from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import timedelta
import os

class Settings(BaseSettings):
    DB_URL: str
    SECRET_KEY: str
    ACCESS_EXPIRY_TIME: int
    REFRESH_EXPIRY_TIME: int
    ALGORITHM: str    

    model_config = SettingsConfigDict(env_file='./app/.env', env_file_encoding='utf-8')

settings = Settings()
DB_URL = settings.DB_URL
SECRET_KEY = settings.SECRET_KEY
ACCESS_EXPIRY_TIME = timedelta(minutes=settings.ACCESS_EXPIRY_TIME).total_seconds()
REFRESH_EXPIRY_TIME = timedelta(days=settings.REFRESH_EXPIRY_TIME).total_seconds()
ALGORITHM = settings.ALGORITHM