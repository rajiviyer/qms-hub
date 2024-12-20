from typing import Optional
from sqlmodel import SQLModel, Field, PrimaryKeyConstraint
from datetime import datetime, date
from ..settings import DB_SCHEMA

class CARProblemDesc(SQLModel, table=True):
    __tablename__ = "car_problem_definition"
    car_number: str = Field(primary_key=True)
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
    
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    phase: str
    responsibility: str
    target_date: datetime
    class Config:
        schema = DB_SCHEMA    
        

class CARProblemDescForm(SQLModel):
    car_number: str;
    initiation_date: date;
    initiator: str;
    recipient: str;
    coordinator: str;
    source: str;
    description: str;
    lacc_phase: str;
    lacc_responsibility: str;
    lacc_target_date: date;
    ca_phase: str;
    ca_responsibility: str;
    ca_target_date: date;        
    
class CARProblemRedef(SQLModel, table=True):
    __tablename__ = "car_problem_redefinition"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', name='car_problem_redefinition_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    redefined_problem: str
    correction: str
    containment: str
    corr_cont_date: datetime
    class Config:
        schema = DB_SCHEMA   