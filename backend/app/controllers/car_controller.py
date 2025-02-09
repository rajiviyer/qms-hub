from ..db_models.car_models import (CARProblemDesc, CARPlanningPhase, CARProblemDescForm, 
                                    CARProblemRedef, CARCANeed, CARRCATypeSelection,
                                    FishboneAnalysis, FishboneData, CARCorrectiveActionPlan
                                    )
# from ..utils.types import CARProblemDescForm
from ..utils.types import CarNumber, CarRootCause
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError, NoResultFound
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

def retrieve_car_problem_desc(car_number: CarNumber, session: DBSession):
    try:
        car_problem_desc = session.exec(
            select(CARProblemDesc).\
                where(CARProblemDesc.car_number == car_number["car_number"])
            ).one()
        return car_problem_desc
    except NoResultFound:
        print(f"No car_problem_desc found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_problem_desc: {e}")
        raise Exception(f"Exception in retrieve_car_problem_desc: {e}")
    
def add_car_ca_need_requirement(car_ca_need: CARCANeed, session: DBSession):
    try:
        car_ca_need_query = text("""
            INSERT INTO
                car_ca_need(car_number, ca_required, required_by, comment, severity, occurrence, rpn, ca_needed)
            VALUES
                (:car_number, :ca_required, :required_by, :comment, :severity, :occurrence, :rpn, :ca_needed)
            ON CONFLICT (car_number) DO UPDATE
            SET
                ca_required = :ca_required,
                required_by = :required_by,
                comment = :comment,
                severity = :severity,
                occurrence = :occurrence,
                rpn = :rpn,
                ca_needed = :ca_needed;
        """)
        session.execute(car_ca_need_query, car_ca_need.dict())
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_ca_need: {e}")
        return "Error: Failed to add car ca need"    
    
def retrieve_car_ca_need(car_number: CarNumber, session: DBSession):
    try:
        car_ca_need = session.exec(
            select(CARCANeed).\
                where(CARCANeed.car_number == car_number["car_number"])
            ).one()
        return car_ca_need
    except NoResultFound:
        print(f"No car_ca_need found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_ca_need: {e}")
        raise Exception(f"Exception in retrieve_car_ca_need: {e}")
    
    
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
    except Exception as e:
        return "Error: Failed to add car problem redefinition"
    
def retrieve_car_problem_redefinition(car_number: CarNumber, session: DBSession):
    try:
        print(f"retrieve_car_problem_redefinition - car_number: {car_number}")
        car_problem_redef = session.exec(
            select(CARProblemRedef).\
                where(CARProblemRedef.car_number == car_number["car_number"])
            ).one()
        # car_problem_redef = session.exec(
        #     text("""
        #         SELECT
        #             car_number, redefined_problem, correction, containment, corr_cont_date
        #         FROM
        #             car_problem_redefinition
        #         WHERE
        #             car_number = :car_number
        #     """), {"car_number": car_number}    
        #     ).one()
        # car_problem_redef = session.exec(
        #     text("""
        #             select current_database(), current_schema; 
        #     """) 
        #     )      
        return car_problem_redef
    except Exception as e:
        print(f"Exception in retrieve_car_problem_redefinition: {e}")
        raise Exception("Failed to retrieve car problem redefinition")        
    # return car_problem_redef   
    
def retrieve_car_rca_type(car_number: CarNumber, session: DBSession):
    try:
        car_rca_type_selection = session.exec(
            select(CARRCATypeSelection).\
                where(CARRCATypeSelection.car_number == car_number["car_number"])
            ).one()
        return car_rca_type_selection
    except NoResultFound:
        print(f"No car_rca_type_selection found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_rca_type_selection: {e}")
        raise Exception(f"Exception in retrieve_car_rca_type_selection: {e}")
        
def add_car_rca_type_selection(car_rca_type_selection: CARRCATypeSelection, session: DBSession):
    try:
        car_rca_type_selection_query = text("""
            INSERT INTO
                car_rca_type_selection(car_number, rca_type)
            VALUES
                (:car_number, :rca_type)
            ON CONFLICT (car_number) DO UPDATE
            SET
                rca_type = EXCLUDED.rca_type;
        """)
        session.execute(car_rca_type_selection_query, car_rca_type_selection.dict())
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_rca_type_selection: {e}")
        return "Error: Failed to add car rca type selection"
    
def add_car_fishbone_analysis(fishbone_data: FishboneData, session: DBSession):
    try:
        for entry in fishbone_data.entries:
            stmt = select(FishboneAnalysis).where(
                (FishboneAnalysis.car_number == entry.car_number) & 
                (FishboneAnalysis.row_header == entry.row_header) & 
                (FishboneAnalysis.column_header == entry.column_header)                
            )
            existing_entry = session.exec(stmt).first()
            if existing_entry:
                existing_entry.data = entry.data
                session.add(existing_entry)
            else:
                new_entry = FishboneAnalysis(
                    car_number=entry.car_number,
                    row_header=entry.row_header,
                    column_header=entry.column_header,
                    data=entry.data
                )
                session.add(new_entry)
                
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_fishbone_analysis: {e}")
        return "Error: Failed to add add_car_fishbone_analysis"

def retrieve_car_fishbone_analysis(car_number: CarNumber, session: DBSession):
    try:
        stmt = select(FishboneAnalysis).where(FishboneAnalysis.car_number == car_number["car_number"])
        fishbone_data = session.exec(stmt).all()
        return fishbone_data
    except NoResultFound:
        print(f"No fishbone data found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in get_car_fishbone_analysis: {e}")
        raise Exception(f"Exception in get_car_fishbone_analysis: {e}")
    
def retrieve_car_rootcauses(car_number: CarNumber, session: DBSession):
    try:
        query = text("""
                     select r.car_number, r.data as root_cause from
                        (select *, rank() over (partition by row_header order by id desc) rnk 
                            from car_fishbone_analysis cfa  where data <> '' and car_number = :car_number) r
                            where r.rnk = 1;
                     """)
            
        result = session.execute(query, {"car_number": car_number["car_number"]})
        column_names = result.keys()
        rows = result.fetchall()
        car_rootcauses = [dict(zip(column_names, row)) for row in rows]
        print(f"car_rootcauses: {car_rootcauses}")
        return car_rootcauses
    except NoResultFound:
        print(f"No car_rootcauses found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_rootcauses: {e}")
        raise Exception(f"Exception in retrieve_car_rootcauses: {e}")
    
def add_car_cap_data(car_cap_data: CARCorrectiveActionPlan, session: DBSession):
    try:
        session.add(car_cap_data)
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_cap_data: {e}")
        return "Error: Failed to add car cap data"

def retrieve_car_cap_data(car_rootcause: CarRootCause, session: DBSession):
    try:
        car_cap_data = session.exec(
            select(CARCorrectiveActionPlan).\
                where(CARCorrectiveActionPlan.car_number == car_rootcause["car_number"] 
                      and CARCorrectiveActionPlan.root_cause == car_rootcause["root_cause"])
            ).all()
        return car_cap_data
    except NoResultFound:
        print(f"No car_cap_data found for car_number: {car_rootcause['car_number']} and root cause {car_rootcause['root_cause']}")
    except Exception as e:
        print(f"Exception in retrieve_car_cap_data: {e}")
        raise Exception(f"Exception in retrieve_car_cap_data: {e}") 