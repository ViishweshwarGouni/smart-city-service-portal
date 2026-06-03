from pydantic import BaseModel



class UserCreate(BaseModel):

    name:str

    email:str

    password_hash:str

    phone:str|None=None

    role:str