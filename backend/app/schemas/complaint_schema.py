from pydantic import BaseModel


class ComplaintSchema(BaseModel):
    title: str
    description: str
    category: str
    location: str
