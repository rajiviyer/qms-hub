from ..controllers.auth_controller import (
    hash_password, generate_access_refresh_token,
    decode_token, verify_password
)
from ..db_models.user_models import User, Token, LoginModel, SignUpModel
from ..db.db_connector import get_session
from ..utils.exceptions import (
    UserEmailExistsException, InvalidInputException,
    NotFoundException, TokenException
)
from ..settings import SECRET_KEY, ACCESS_EXPIRY_TIME, REFRESH_EXPIRY_TIME
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..utils.types import TokenType
from sqlmodel import Session, select
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

DBSession = Annotated[Session, Depends(get_session)]

def sign_up(user_token_data: SignUpModel,
            session: DBSession):
    print(f"user_token_data: {user_token_data}")
    user_name = user_token_data.user_name
    user_email = user_token_data.user_email
    user_passwd = user_token_data.user_passwd
    user_exists = \
        session.exec(
            select(User).\
                where(User.user_email == user_email)
            ).all()
    print(f"user_exists: {user_exists}")
    if user_exists:
        raise UserEmailExistsException(user_email)
    else:
        hashed_passwd = hash_password(user_passwd)
        user = User(user_name = user_name,
                    user_email = user_email,
                    user_passwd = hashed_passwd)
        session.add(user)
        session.commit()
        session.refresh(user)

        user_data = TokenType({
            "user_name": user_name,
            "user_email": user_email,
            "access_expiry_time": ACCESS_EXPIRY_TIME,
            "refresh_expiry_time": REFRESH_EXPIRY_TIME
            })

        tokens = generate_access_refresh_token(user_data)

        if tokens:
            token = Token(user_id = user.user_id,
                        refresh_token = tokens["refresh_token"]["token"])
            session.add(token)
            session.commit()
            return tokens
        else:
            raise TokenException("Tokens Not Generated")

def sign_in(user_login_form: LoginModel,
            session: DBSession):
    try:
        user_login_email = user_login_form.user_email
        user_login_passwd = user_login_form.user_passwd
        # user_login_passwd_hashed = hash_password(user_login_passwd)
        try:
            user = session.exec(
                select(User).\
                    where(User.user_email == user_login_email)
                ).one()
        except:
            raise InvalidInputException("Invalid User Email")

        if verify_password(user.user_passwd, user_login_passwd):
            user_token_data = TokenType({
                "user_name": user.user_name,
                "user_email": user.user_email,
                "access_expiry_time": ACCESS_EXPIRY_TIME,
                "refresh_expiry_time": REFRESH_EXPIRY_TIME
                })

            tokens = generate_access_refresh_token(user_token_data)

            # Retrieve existing Token
            if tokens:
                existing_token = session.exec(
                    select(Token).\
                        where(Token.user_id == user.user_id)
                    ).one()
                existing_token.refresh_token = tokens["refresh_token"]["token"]
                session.add(existing_token)
                session.commit()
                session.refresh(existing_token)
                return tokens
            else:
                raise TokenException("Tokens Not Generated")
        else:
            raise InvalidInputException("Invalid Password")
    except Exception as e:
        raise e

def get_user(token: Annotated[str, Depends(oauth2_scheme)],
             session: Annotated[Session, Depends(get_session)]):
    if token:
        try:
            decoded_data = decode_token(token)
            user_email = decoded_data["user_email"]
            user = session.exec(
                select(User).\
                    where(User.user_email == user_email)
                ).one()
            return user
        except:
            raise NotFoundException("Token")
    else:
        raise NotFoundException("Token")