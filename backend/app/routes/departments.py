from fastapi import APIRouter

from app.database.supabase_client import supabase



router=APIRouter()



@router.get("/")


def departments():


    data=supabase.table(
        "departments"
    ).select("*").execute()



    return data.data