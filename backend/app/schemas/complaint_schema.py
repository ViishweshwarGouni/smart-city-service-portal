from pydantic import BaseModel



class ComplaintCreate(BaseModel):

    user_id:str

    department_id:str|None=None

    title:str

    description:str

    latitude:float|None=None

    longitude:float|None=None