from pydantic import BaseModel


class UserSchema(BaseModel):
    email: str
    password: str
    full_name: str | None = None
