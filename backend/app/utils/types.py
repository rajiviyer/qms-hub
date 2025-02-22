from typing_extensions import TypedDict
from typing import List
from uuid import UUID, uuid4
from datetime import date

class TokenType(TypedDict):
    user_name: str;
    user_email: str;
    access_expiry_time: int;
    refresh_expiry_time: int;
    
class UserEmail(TypedDict):
    user_email: str;
    
class CarNumber(TypedDict):
    car_number: str
    
class CarRootCause(TypedDict):
    car_number: str
    root_cause: str
    
class UserOrg(TypedDict):
    user_org: str