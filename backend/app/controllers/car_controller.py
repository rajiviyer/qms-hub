from ..db_models.car_models import CARProblemDesc, CARPlanningPhase, CARProblemDescForm
# from ..utils.types import CARProblemDescForm
from sqlmodel import Session, select
from typing import Annotated
from ..db.db_connector import get_session
from fastapi import Depends

DBSession = Annotated[Session, Depends(get_session)]

def add_car_problem_desc_pphase(car_problem_desc_form: CARProblemDescForm, session: DBSession):
    try:
        
        # Insert the car problem description into the database
        car_problem_desc = CARProblemDesc(
                                        car_number=car_problem_desc_form.car_number,
                                        initiation_date=car_problem_desc_form.initiation_date,
                                        initiator=car_problem_desc_form.initiator,
                                        recipient=car_problem_desc_form.recipient,
                                        coordinator=car_problem_desc_form.coordinator,
                                        source=car_problem_desc_form.source,
                                        description=car_problem_desc_form.description
                                        )
        
        print(f"car_problem_desc: {car_problem_desc}")
        
        session.add(car_problem_desc)
        
        car_planning_phase = CARPlanningPhase(
            car_number=car_problem_desc_form.car_number,
            phase=car_problem_desc_form.lacc_phase,
            responsibility=car_problem_desc_form.lacc_responsibility,
            target_date=car_problem_desc_form.lacc_target_date
        )
        session.add(car_planning_phase)
        
        car_planning_phase = CARPlanningPhase(
            car_number=car_problem_desc_form.car_number,
            phase=car_problem_desc_form.ca_phase,
            responsibility=car_problem_desc_form.ca_responsibility,
            target_date=car_problem_desc_form.ca_target_date
        )
        session.add(car_planning_phase)

        session.commit()
        session.refresh(car_problem_desc)
        return "Success"
    except:
        raise Exception("Failed to add car problem description & phase")
        return "Failed"
