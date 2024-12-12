from ..db_models.car_models import CARProblemDesc, CARPlanningPhase
from ..utils.types import CARProblemDesc
from sqlmodel import Session, select
from typing import Annotated
from ..db.db_connector import get_session
from fastapi import Depends

DBSession = Annotated[Session, Depends(get_session)]

def add_car_problem_desc(car_problem_desc: CARProblemDesc, session: DBSession):
    # Insert the car problem description into the database
    car_problem_desc = CARProblemDesc(
                                      car_number=car_problem_desc.car_number,
                                      initiation_date=car_problem_desc.initiation_date,
                                      initiator=car_problem_desc.initiator,
                                      recipient=car_problem_desc.recipient,
                                      coordinator=car_problem_desc.coordinator,
                                      source=car_problem_desc.source,
                                      description=car_problem_desc.description
                                      )
    print(f"car_problem_desc: {car_problem_desc}")
    session.add(car_problem_desc)
    
    car_planning_phase = CARPlanningPhase(
        car_number=car_problem_desc.car_number,
        phase=car_problem_desc.lacc_phase,
        responsibility=car_problem_desc.lacc_responsibility,
        target_date=car_problem_desc.lacc_target_date
    )
    session.add(car_planning_phase)
    
    car_planning_phase = CARPlanningPhase(
        car_number=car_problem_desc.car_number,
        phase=car_problem_desc.ca_phase,
        responsibility=car_problem_desc.ca_responsibility,
        target_date=car_problem_desc.ca_target_date
    )
    session.add(car_planning_phase)

    session.commit()
    session.refresh(car_problem_desc)
    car_problem_desc = session.exec(
        select(CARProblemDesc).where(
            CARProblemDesc.car_number == car_problem_desc.car_number
        )
    )
    # print(f"car_problem_desc: {car_problem_desc}")
    return car_problem_desc