from fastapi import APIRouter


from app.database.supabase_client import supabase

from app.schemas.complaint_schema import ComplaintCreate



router=APIRouter()



@router.post("/add")

def add_complaint(
    complaint:ComplaintCreate
):


    data=complaint.model_dump()


    result=supabase.table(
        "complaints"
    ).insert(
        data
    ).execute()


    return result.data




@router.get("/all")

def all_complaints():


    data=supabase.table(
        "complaints"
    ).select("*").execute()



    return data.data