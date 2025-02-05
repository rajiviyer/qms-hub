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
    
# class CARProblemDescForm(TypedDict):
#     car_number: str;
#     initiation_date: date;
#     initiator: str;
#     recipient: str;
#     coordinator: str;
#     source: str;
#     description: str;
#     lacc_phase: str;
#     lacc_responsibility: str;
#     lacc_target_date: date;
#     ca_phase: str;
#     ca_responsibility: str;
#     ca_target_date: date;
    
# class CARCANeed(TypedDict):
#     car_number: str;
#     ca_required: str;
#     required_by: str;
#     comment: str;
#     severity: int;
#     occurrence: int;
#     rpn: int;
#     ca_needed: str;
    
# class CarRcaTypeSelection(TypedDict):
#     car_number: str;
#     rca_type: str