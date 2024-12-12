from typing import Optional
from sqlmodel import SQLModel, Field, PrimaryKeyConstraint
from datetime import datetime
from ..settings import DB_SCHEMA

class CARProblemDesc(SQLModel, table=True):
    __tablename__ = "car_problem_definition"
    car_number: Optional[int] = Field(None, primary_key=True)
    initiation_date: datetime = Field(default_factory=datetime.now)
    initiator: str
    recipient: str
    coordinator: str
    source: str
    description: str
    class Config:
        schema = DB_SCHEMA    
    
class CARPlanningPhase(SQLModel, table=True):
    __tablename__ = "car_planning_phase"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', 'phase', name='car_planning_phase_pk'),
    )
    
    car_number: int = Field(foreign_key="car_problem_definition.car_number")
    phase: str
    responsibility: str
    target_date: datetime
    class Config:
        schema = DB_SCHEMA    