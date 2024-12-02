from jose import jwt, JWTError
from passlib.context import CryptContext
from ..utils.types import TokenType
from ..settings import SECRET_KEY, ALGORITHM
# from datetime import timedelta

pwd_context = CryptContext(schemes="bcrypt")

def generate_token(data: dict,
                          expiry_time: int):
    try:
        data_to_encode = data.copy()
        data_to_encode.update({"expiry_time": expiry_time})
        token = jwt.encode(data_to_encode,
                                key=SECRET_KEY,
                                algorithm=ALGORITHM)

        return token
    except JWTError as je:
        raise je

def generate_access_refresh_token(user_details: TokenType):
    data = {
        "user_name": user_details["user_name"],
        "user_email": user_details["user_email"]
    }

    access_token = generate_token(data, user_details["access_expiry_time"])
    refresh_token = generate_token(data, user_details["refresh_expiry_time"])
    access_expiry_time = user_details["access_expiry_time"]
    refresh_expiry_time = user_details["refresh_expiry_time"]

    return {
        "access_token": {
            "token": access_token,
            "expiry_time": access_expiry_time
        },
        "refresh_token": {
            "token": refresh_token,
            "expiry_time": refresh_expiry_time
        }
    }

def decode_token(token: str):
    try:
        decoded_data = jwt.decode(token, key=SECRET_KEY, algorithms=ALGORITHM)
        return decoded_data
    except JWTError as je:
        raise je

def hash_password(passwd_text: str):
    hashed_passwd = pwd_context.hash(passwd_text)
    return hashed_passwd

def verify_password(passwd_hash: str, passwd_text: str):
    return pwd_context.verify(passwd_text, hash = passwd_hash)

def token_service():
    ...  