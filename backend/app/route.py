from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.requests import Request
# from fastapi.security import OAuth2PasswordRequestForm
from .db.db_connector import get_session, create_table
from contextlib import asynccontextmanager
from .db_models.admin_models import Admin
from .db_models.user_models import User, Token, Employee
from .db_models.car_models import CARProblemDesc, CARPlanningPhase, CARCANeed
from .utils.exceptions import (
    NotFoundException, UserEmailExistsException, InvalidInputException, TokenException
    )
from .controllers.user_controller import sign_up, sign_in, retrieve_user_details
from .controllers.car_controller import (retrieve_car_problem_desc, add_car_problem_desc_pphase, add_car_problem_redefinition, 
                                         retrieve_car_problem_redefinition, retrieve_car_ca_need, add_car_ca_need_requirement,
                                         retrieve_car_rca_type, add_car_rca_type_selection, add_car_fishbone_analysis, 
                                         retrieve_car_fishbone_analysis
                                         )


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating Tables..")
    create_table()
    yield

app = FastAPI(lifespan=lifespan)
# app = FastAPI(
#     title = "Backend API",
#     version = "1.0.0",
#     description = "Backend API for Audit Planning and Coordination Tool"
#     )

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(NotFoundException)
def not_found(request: Request, exception: NotFoundException):
    return JSONResponse(
        status_code = 404,
        content = f"{exception.entity} {exception.entity_name} Not Found")

@app.exception_handler(UserEmailExistsException)
def user_email_exists(request: Request, exception: UserEmailExistsException):
    return JSONResponse(status_code = 404,
                 content = f"{exception.user_email} User Already Exists")

@app.exception_handler(InvalidInputException)
def invalid_input(request: Request, exception: InvalidInputException):
    print(f"Invalid Input: {exception.message}")
    return JSONResponse(
        status_code = 401,
        content = f"{exception.message}")

@app.exception_handler(TokenException)
def token_error(request: Request, exception: TokenException):
    return JSONResponse(
        status_code = 499,
        content = f"{exception.message}")

@app.get("/")
def home():
    return "Welcome!"

@app.post("/api/signup")
def user_signup(user_token_data: Annotated[dict, Depends(sign_up)]):
    if not user_token_data:
        raise NotFoundException("User")
    return user_token_data

@app.post("/api/signin")
def user_signin(user_token_data: Annotated[dict, Depends(sign_in)]):
    print(f"user_form_data: {user_token_data}")
    return user_token_data
    # if not user_form_data:
    #     raise NotFoundException("User")

@app.post("/api/getuser")
def get_user(user: Annotated[dict, Depends(retrieve_user_details)]):
    print("user: ", user)
    return user

@app.post("/api/add_car_problem_desc")
def add_car_problem_desc(message: Annotated[str, Depends(add_car_problem_desc_pphase)]):
    print(f"message: {message}")
    return message

@app.post("/api/add_car_problem_redef")
def add_car_problem_redef(message: Annotated[str, Depends(add_car_problem_redefinition)]):
    print(f"message: {message}")
    return message

@app.post("/api/get_car_problem_desc")
def get_car_problem_desc(problem_desc: Annotated[dict, Depends(retrieve_car_problem_desc)]):
    print("problem_desc: ", problem_desc)
    return problem_desc

@app.post("/api/get_car_problem_redef")
def get_car_problem_redef(problem_redef: Annotated[dict, Depends(retrieve_car_problem_redefinition)]):
    """ 
    End Point to retrieve Problem Redefinition (Look Across) Data from DB
    """
    return problem_redef

@app.post("/api/get_car_ca_need")
def get_car_ca_need(car_ca_need: Annotated[dict, Depends(retrieve_car_ca_need)]):
    """ 
    End Point to retrieve CA Need Data from DB
    """
    return car_ca_need 

@app.post("/api/add_car_ca_need")
def add_car_ca_need(message: Annotated[str, Depends(add_car_ca_need_requirement)]):
    """ 
    End Point to add CA Need Data to DB
    """
    print(f"message: {message}")
    return message

@app.post("/api/get_car_rca_type")
def get_car_rca_type(car_rca_type: Annotated[dict, Depends(retrieve_car_rca_type)]):
    """ 
    End Point to retrieve RCA Type Data from DB
    """
    return car_rca_type

@app.post("/api/add_car_rca_type")
def add_car_rca_type(message: Annotated[str, Depends(add_car_rca_type_selection)]):
    """ 
    End Point to add RCA Type Data to DB
    """
    print(f"message: {message}")
    return message

@app.post("/api/add_car_fishbone_analysis")
def add_car_fishbone_analysis(message: Annotated[str, Depends(add_car_fishbone_analysis)]):
    """ 
    End Point to add Fishbone Analysis Data to DB
    """
    print(f"message: {message}")
    return message

@app.post("/api/get_car_fishbone_analysis")
def get_car_fishbone_analysis(car_fishbone_analysis: Annotated[dict, Depends(retrieve_car_fishbone_analysis)]):
    """ 
    End Point to retrieve Fishbone Analysis Data from DB
    """
    return car_fishbone_analysis