from sqlmodel import create_engine, Session, SQLModel
from ..settings import DB_URL
from ..db_models.user_models import User, Token

connection_string = DB_URL.replace("postgresql","postgresql+psycopg2")
print(f"Connection String: {connection_string}")

engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

def create_table():
    SQLModel.metadata.create_all(engine)