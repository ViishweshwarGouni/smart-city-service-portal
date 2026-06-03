from fastapi import APIRouter

from app.database.supabase_client import supabase

from app.schemas.user_schema import UserCreate



router=APIRouter()



@router.post("/register")

def register(user:UserCreate):


    result=supabase.table(
        "users"
    ).insert(

        user.model_dump()

    ).execute()


    return result.data



@router.post("/login")

def login(data:dict):


    user=supabase.table(
        "users"
    ).select("*").eq(

        "email",
        data["email"]

    ).execute()



    return user.data