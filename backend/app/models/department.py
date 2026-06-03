from pydantic import BaseModel


class Department(BaseModel):
    id: int
    name: str
