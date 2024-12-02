from typing_extensions import TypedDict
from typing import List
from uuid import UUID, uuid4

class TokenType(TypedDict):
    user_name: str;
    user_email: str;
    access_expiry_time: int;
    refresh_expiry_time: int;