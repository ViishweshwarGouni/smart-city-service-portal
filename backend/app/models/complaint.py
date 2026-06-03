from pydantic import BaseModel


class Complaint(BaseModel):
    id: int
    title: str
    description: str
