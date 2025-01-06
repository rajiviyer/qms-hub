from ..db_models.car_models import CARProblemDesc, CARPlanningPhase, CARProblemDescForm, CARProblemRedef, CARCANeed
# from ..utils.types import CARProblemDescForm
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import text
from typing import Annotated
from ..db.db_connector import get_session
from fastapi import Depends
from ..utils.exceptions import CARNumberExistsException

DBSession = Annotated[Session, Depends(get_session)]

def add_car_problem_desc_pphase(car_problem_desc_form: CARProblemDescForm, session: DBSession):
    try:
        car_problem_desc_query = text("""
            INSERT INTO
                car_problem_definition(car_number, initiation_date, initiator,recipient,coordinator, source, description)
            VALUES
                (:car_number, :initiation_date, :initiator, :recipient, :coordinator, :source, :description)
            ON CONFLICT (car_number) DO UPDATE
            SET
                initiation_date = EXCLUDED.initiation_date,
                initiator = EXCLUDED.initiator,
                recipient = EXCLUDED.recipient,
                coordinator = EXCLUDED.coordinator,
                source = EXCLUDED.source,
                description = EXCLUDED.description;
        """)
        session.execute(car_problem_desc_query, car_problem_desc_form.dict())
        session.commit()
        
        car_planning_phase_delete_query =  text("""
            DELETE FROM
                car_planning_phase
            WHERE
                car_number = :car_number;
        """)
        session.execute(car_planning_phase_delete_query, {"car_number": car_problem_desc_form.car_number})
        
        car_planning_phase_query = text("""
            INSERT INTO
                car_planning_phase(car_number, phase, responsibility, target_date)
            VALUES
                (:car_number, :phase, :responsibility, :target_date);
        """)
        
        session.execute(car_planning_phase_query, {
            "car_number": car_problem_desc_form.car_number,
            "phase": car_problem_desc_form.lacc_phase,
            "responsibility": car_problem_desc_form.lacc_responsibility,
            "target_date": car_problem_desc_form.lacc_target_date
        })
        
        session.execute(car_planning_phase_query, {
            "car_number": car_problem_desc_form.car_number,
            "phase": car_problem_desc_form.ca_phase,
            "responsibility": car_problem_desc_form.ca_responsibility,
            "target_date": car_problem_desc_form.ca_target_date
        })
        session.commit()
        # try:
            
        #     # # Insert the car problem description into the database
        #     # car_problem_desc = CARProblemDesc(
        #     #                                 car_number=car_problem_desc_form.car_number,
        #     #                                 initiation_date=car_problem_desc_form.initiation_date,
        #     #                                 initiator=car_problem_desc_form.initiator,
        #     #                                 recipient=car_problem_desc_form.recipient,
        #     #                                 coordinator=car_problem_desc_form.coordinator,
        #     #                                 source=car_problem_desc_form.source,
        #     #                                 description=car_problem_desc_form.description
        #     #                                 )
            
        #     # print(f"car_problem_desc: {car_problem_desc}")
            
        #     # session.add(car_problem_desc)
        #     # session.commit()
        # except IntegrityError as e:
        #     return "Error: CAR Number Already Exists"
        # except Exception as e:
        #     return "Error: Failed to add car problem description"
        
        # car_planning_phase = CARPlanningPhase(
        #     car_number=car_problem_desc_form.car_number,
        #     phase=car_problem_desc_form.lacc_phase,
        #     responsibility=car_problem_desc_form.lacc_responsibility,
        #     target_date=car_problem_desc_form.lacc_target_date
        # )
        # session.add(car_planning_phase)
        
        # car_planning_phase = CARPlanningPhase(
        #     car_number=car_problem_desc_form.car_number,
        #     phase=car_problem_desc_form.ca_phase,
        #     responsibility=car_problem_desc_form.ca_responsibility,
        #     target_date=car_problem_desc_form.ca_target_date
        # )
        # session.add(car_planning_phase)

        # session.commit()
        # session.refresh(car_problem_desc)
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_problem_desc_pphase: {e}")
        return "Error: Failed to add car problem description & phase"

def retrieve_car_problem_desc(car_number: str, session: DBSession):
    try:
        car_problem_desc = session.exec(
            select(CARProblemDesc).\
                where(CARProblemDesc.car_number == car_number)
            ).one()
        return car_problem_desc
    except:
        raise Exception("Failed to retrieve car problem description")
    
def add_car_ca_need(car_ca_need: CARCANeed, session: DBSession):
    try:
        session.add(car_ca_need)
        session.commit()
        return "Success"
    except IntegrityError as e:
        return "Error: CAR Number Already Exists"
    except Exception as e:
        return "Error: Failed to add car ca need"    
    
def retrieve_car_ca_need(car_number: str, session: DBSession):
    try:
        car_ca_need = session.exec(
            select(CARCANeed).\
                where(CARCANeed.car_number == car_number)
            ).one()
        return car_ca_need
    except:
        raise Exception("Failed to retrieve car ca need")
    
    
def add_car_problem_redefinition(car_problem_redef: CARProblemRedef, session: DBSession):
    try:
        car_problem_redef_query = text("""
            INSERT INTO
                car_problem_redefinition(car_number, redefined_problem, correction, containment, corr_cont_date)
            VALUES
                (:car_number, :redefined_problem, :correction, :containment, :corr_cont_date)
            ON CONFLICT (car_number)
            DO UPDATE SET
                redefined_problem = :redefined_problem,
                correction = :correction,
                containment = :containment,
                corr_cont_date = :corr_cont_date;
        """)
        session.execute(car_problem_redef_query, car_problem_redef.dict())
        session.commit()
        return "Success"
            
    #     session.add(car_problem_redef)
    #     session.commit()
    #     return "Success"
    # except IntegrityError as e:
    #     return "Error: CAR Number Already Exists"
    except Exception as e:
        return "Error: Failed to add car problem redefinition"
    
def retrieve_car_problem_redefinition(car_number: str, session: DBSession):
    try:
        car_problem_redef = session.exec(
            select(CARProblemRedef).\
                where(CARProblemRedef.car_number == car_number)
            ).one()
        return car_problem_redef
    except:
        raise Exception("Failed to retrieve car problem redefinition")        
    # return car_problem_redef   