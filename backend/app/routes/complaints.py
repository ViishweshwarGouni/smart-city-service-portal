from fastapi import APIRouter
from pydantic import BaseModel

import sys
import os

from app.database.supabase_client import supabase

# connect ml_model folder
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(__file__)
        )
    )
)

ML_PATH = os.path.join(
    BASE_DIR,
    "ml_model"
)

sys.path.append(
    ML_PATH
)

from predict import predict_department
from fraud_detection import detect_fraud

# REMOVED internal prefix to prevent double-prefixing 404 errors with main.py
router = APIRouter(
    tags=["Complaints"]
)


class Complaint(BaseModel):
    user_id: str
    title: str
    description: str
    latitude: float
    longitude: float


@router.post("/add")
def add_complaint(
    complaint: Complaint
):

    # --------------------
    # AI prediction
    # --------------------
    prediction = predict_department(
        complaint.title,
        complaint.description
    )

    department = prediction[
        "department"
    ]

    fraud_score = detect_fraud(
        complaint.description
    )

    # --------------------
    # Duplicate Detection
    # --------------------
    is_duplicate = False
    master_complaint_id = None
    try:
        existing = (
            supabase
            .table("complaints")
            .select("complaint_id, description")
            .execute()
        )
        if existing.data:
            descriptions = [c["description"] for c in existing.data if c.get("description")]
            ids = [c["complaint_id"] for c in existing.data if c.get("description")]
            if descriptions:
                from sklearn.feature_extraction.text import TfidfVectorizer
                from sklearn.metrics.pairwise import cosine_similarity
                
                docs = descriptions + [complaint.description]
                vectorizer = TfidfVectorizer()
                matrix = vectorizer.fit_transform(docs)
                similarity = cosine_similarity(matrix[-1], matrix[:-1])
                
                if similarity.size > 0:
                    max_score = similarity.max()
                    if max_score > 0.80:
                        is_duplicate = True
                        best_match_idx = similarity.argmax()
                        master_complaint_id = ids[best_match_idx]
    except Exception as e:
        print("Duplicate detection error:", e)

    # Calculate severity based on keywords (simple heuristic)
    severity_score = 50
    desc_lower = complaint.description.lower()
    if any(w in desc_lower for w in ["urgent", "danger", "hazard", "fire", "leak", "accident"]):
        severity_score = 90
    elif any(w in desc_lower for w in ["pothole", "broken", "dirty"]):
        severity_score = 60
    else:
        severity_score = 30

    priority = "Medium"
    if severity_score >= 80:
        priority = "High"
    elif severity_score <= 30:
        priority = "Low"

    # --------------------
    # Save to Supabase
    # --------------------
    data = {
        "user_id": complaint.user_id,
        "title": complaint.title,
        "description": complaint.description,
        "latitude": complaint.latitude,
        "longitude": complaint.longitude,
        "predicted_department": department,
        "fraud_score": fraud_score,
        "severity_score": severity_score,
        "priority": priority,
        "status": "Pending",
        "is_duplicate": is_duplicate,
        "master_complaint_id": master_complaint_id
    }

    response = (
        supabase
        .table("complaints")
        .insert(data)
        .execute()
    )

    return {
        "message": "Complaint submitted successfully",
        "AI_department": department,
        "fraud_score": fraud_score,
        "is_duplicate": is_duplicate,
        "master_complaint_id": master_complaint_id,
        "saved": response.data
    }


@router.get("/all")
def all_complaints():
    result = (
        supabase
        .table("complaints")
        .select("*")
        .execute()
    )
    return result.data


class ComplaintUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    department_id: str | None = None
    is_duplicate: bool | None = None
    master_complaint_id: str | None = None


@router.put("/{complaint_id}")
def update_complaint(
    complaint_id: str,
    update: ComplaintUpdate
):
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not data:
        return {"message": "No updates provided"}
    
    response = (
        supabase
        .table("complaints")
        .update(data)
        .eq("complaint_id", complaint_id)
        .execute()
    )
    return {
        "message": "Complaint updated successfully",
        "data": response.data
    }
