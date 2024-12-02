from typing import Optional
from sqlmodel import SQLModel, Field

class LoginModel(SQLModel):
    user_email: str
    user_passwd: str

class SignUpModel(LoginModel):
    user_name: str

class User(SignUpModel, table=True):
    user_id: Optional[int] = Field(None, primary_key=True)
    phone_number: Optional[str]

class Token(SQLModel, table=True):
    token_id: Optional[int] = Field(None, primary_key=True)
    user_id: int = Field(int, foreign_key="user.user_id")
    refresh_token: str