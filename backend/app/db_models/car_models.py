from typing import Optional, List
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
        
class CARCANeed(SQLModel, table=True):
    __tablename__ = "car_ca_need"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', name='car_ca_need_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    ca_required: str
    required_by: str
    comment: str
    severity: int
    occurrence: int
    rpn: int
    ca_needed: str
    class Config:
        schema = DB_SCHEMA
        
class CARRCATypeSelection(SQLModel, table=True):
    __tablename__ = "car_rca_type_selection"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', name='car_rca_type_selection_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    rca_type: str
    class Config:
        schema = DB_SCHEMA

# Define Fishbone Analysis Model
class FishboneAnalysis(SQLModel, table=True):
    __tablename__ = "car_fishbone_analysis" 
    id: int = Field(default=None, primary_key=True)
    car_number: str = Field(index=True)
    row_header: str
    column_header: str
    data: str = Field(default="")
    class Config:
        schema = DB_SCHEMA
        

class CARCorrectiveActionPlan(SQLModel, table=True):
    __tablename__ = "car_corrective_action_plan"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', 'root_cause', 'corrective_action', name='car_cap_ca_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    root_cause: str
    corrective_action: str
    responsibility: str
    target_date: date
    actual_date: Optional[date]
    status: str
    class Config:
        schema = DB_SCHEMA  

# Define Fishbone Request Model for Batch Insert
class FishboneEntry(SQLModel):
    car_number: str
    row_header: str
    column_header: str
    data: str

class FishboneData(SQLModel):
    car_number: str
    entries: List[FishboneEntry]  
    
class CARCorrectiveActionPlanEntry(SQLModel):
    car_number: str
    root_cause: str
    corrective_action: str
    responsibility: str
    target_date: date
    actual_date: Optional[date]
    status: str
    
class CARCorrectiveActionPlanData(SQLModel):
    entries: List[CARCorrectiveActionPlanEntry]

class CARQPTReq(SQLModel, table = True):
    __tablename__ = "car_qpt_requirements"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', name='car_qpt_requirements_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    qms_required: str
    qms_required_comments: str
    qms_documentation_required: str
    qms_documentation_required_comments: str
    training_required: str
    training_required_comments: str
    class Config:
        schema = DB_SCHEMA
        
class CARCAEffectivenessPlan(SQLModel, table=True):
    __tablename__ = "car_ca_effectiveness_plan"
    __table_args__ = (
        PrimaryKeyConstraint('car_number', 'planned_action', name='car_ca_effectiveness_plan_pk'),
    )
    car_number: str = Field(foreign_key="car_problem_definition.car_number")
    planned_action: str
    responsibility: str
    target_date: date
    actual_date: Optional[date]
    status: str
    class Config:
        schema = DB_SCHEMA

class CARCAEffectivenessPlanData(SQLModel):
    entries: List[CARCAEffectivenessPlan]        
        
        
          