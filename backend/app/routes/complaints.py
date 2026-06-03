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



router = APIRouter(
    prefix="/complaints",
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
    # Save to Supabase
    # --------------------


    data={

        "user_id":
        complaint.user_id,


        "title":
        complaint.title,


        "description":
        complaint.description,


        "latitude":
        complaint.latitude,


        "longitude":
        complaint.longitude,


        "predicted_department":
        department,


        "fraud_score":
        fraud_score,


        "severity_score":
        50,


        "priority":
        "Medium",


        "status":
        "Pending"

    }



    response = (
        supabase
        .table("complaints")
        .insert(data)
        .execute()
    )



    return {

        "message":
        "Complaint submitted successfully",


        "AI_department":
        department,


        "fraud_score":
        fraud_score,


        "saved":
        response.data

    }



@router.get("/all")

def all_complaints():


    result=(
        supabase
        .table("complaints")
        .select("*")
        .execute()
    )


    return result.data