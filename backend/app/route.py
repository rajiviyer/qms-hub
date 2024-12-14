from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.requests import Request
# from fastapi.security import OAuth2PasswordRequestForm
from .db.db_connector import get_session, create_table
from contextlib import asynccontextmanager
from .db_models.admin_models import Admin
from .db_models.user_models import User, Token, Employee
from .db_models.car_models import CARProblemDesc, CARPlanningPhase
from .utils.exceptions import (
    NotFoundException, UserEmailExistsException, InvalidInputException, TokenException
    )
from .controllers.user_controller import sign_up, sign_in, retrieve_user_details
from .controllers.car_controller import add_car_problem_desc_pphase


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("Creating Tables..")
#     create_table()
#     yield

# app = FastAPI(lifespan=lifespan)
app = FastAPI(
    title = "Backend API",
    version = "1.0.0",
    description = "Backend API for Audit Planning and Coordination Tool"
    )

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