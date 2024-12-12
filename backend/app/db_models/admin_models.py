from typing import Optional
from sqlmodel import SQLModel, Field
from ..settings import DB_SCHEMA

class Admin(SQLModel, table=True):
    admin_id: int = Field(None, primary_key=True)
    admin_name: Optional[str]
    admin_email: str
    admin_password: str
    class Config:
        schema = DB_SCHEMA    