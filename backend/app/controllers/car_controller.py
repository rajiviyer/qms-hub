from ..db_models.car_models import (CARProblemDesc, CARPlanningPhase, CARProblemDescForm, 
                                    CARProblemRedef, CARCANeed, CARRCATypeSelection,
                                    FishboneAnalysis, FishboneData, CARCorrectiveActionPlan, CARCorrectiveActionPlanData,
                                    CARQPTReq, CARCAEffectivenessPlan, CARCAEffectivenessPlanData,
                                    SimpleRootCauseAnalysis, SimpleRootCauseData, ImmediateRootCauseAnalysis
                                    )
# from ..utils.types import CARProblemDescForm
from ..utils.types import CarNumber, CarRootCause, UserOrg
from sqlmodel import Session, select, delete, insert
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
                car_problem_definition(car_number, initiation_date, initiator,recipient,coordinator, source, description, user_org)
            VALUES
                (:car_number, :initiation_date, :initiator, :recipient, :coordinator, :source, :description, :user_org)
            ON CONFLICT (car_number) DO UPDATE
            SET
                initiation_date = EXCLUDED.initiation_date,
                initiator = EXCLUDED.initiator,
                recipient = EXCLUDED.recipient,
                coordinator = EXCLUDED.coordinator,
                source = EXCLUDED.source,
                description = EXCLUDED.description,
                user_org = EXCLUDED.user_org;
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
    except NoResultFound:
        print(f"No car problem redef data found for car_number: {car_number['car_number']}")
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
    
# def retrieve_car_rootcauses(car_number: CarNumber, session: DBSession):
#     try:
#         query = text("""
#                      select r.car_number, r.data as root_cause from
#                         (select *, rank() over (partition by row_header order by id desc) rnk 
#                             from car_fishbone_analysis cfa  where data <> '' and car_number = :car_number) r
#                             where r.rnk = 1;
#                      """)
            
#         result = session.execute(query, {"car_number": car_number["car_number"]})
#         column_names = result.keys()
#         rows = result.fetchall()
#         car_rootcauses = [dict(zip(column_names, row)) for row in rows]
#         print(f"car_rootcauses: {car_rootcauses}")
#         return car_rootcauses
#     except NoResultFound:
#         print(f"No car_rootcauses found for car_number: {car_number['car_number']}")
#     except Exception as e:
#         print(f"Exception in retrieve_car_rootcauses: {e}")
#         raise Exception(f"Exception in retrieve_car_rootcauses: {e}")

def retrieve_car_rootcauses(car_number: CarNumber, session: DBSession):
    """
    Calls the PostgreSQL function get_root_cause_analysis and returns the result.
    """
    try:
        query = text("SELECT * FROM get_root_cause_analysis(:car_number)")
        result = session.execute(query, {"car_number": car_number["car_number"]})
        records = result.fetchall()

        if not records:
            print(f"No car_rootcauses found for car_number: {car_number['car_number']}")
            
        print(f"records: {records}")            

        # Convert records to list of dictionaries
        return [
            {
                "car_number": row[0],
                "root_cause": row[1]
            }
            for row in records
        ]

    except Exception as e:
        print(f"Exception in retrieve_car_rootcauses: {e}")
        raise Exception(f"Exception in retrieve_car_rootcauses: {e}")   
    
def add_car_cap_info(car_cap_data: CARCorrectiveActionPlanData, session: DBSession):
    try:
        for entry in car_cap_data.entries:
            stmt = select(CARCorrectiveActionPlan).where(
                (CARCorrectiveActionPlan.car_number == entry.car_number) & 
                (CARCorrectiveActionPlan.root_cause == entry.root_cause) &
                (CARCorrectiveActionPlan.corrective_action == entry.corrective_action)
            )
            existing_entry = session.exec(stmt).first()
            if existing_entry:
                existing_entry.responsibility = entry.responsibility
                existing_entry.target_date = entry.target_date
                if existing_entry.actual_date:
                    existing_entry.actual_date = entry.actual_date
                existing_entry.status = entry.status
                session.add(existing_entry)
            else:
                new_entry = CARCorrectiveActionPlan(
                    car_number=entry.car_number,
                    root_cause=entry.root_cause,
                    corrective_action = entry.corrective_action,
                    responsibility = entry.responsibility,
                    target_date = entry.target_date,
                    actual_date = entry.actual_date if entry.actual_date else None,
                    status = entry.status
                )
                session.add(new_entry)
                
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_cap_info: {e}")
        return "Error: Failed to add add_car_cap_info"

def retrieve_car_cap_data(car_rootcause: CarRootCause, session: DBSession):
    try:
        car_cap_data = session.exec(
            select(CARCorrectiveActionPlan).\
                where(CARCorrectiveActionPlan.car_number == car_rootcause["car_number"] 
                      and CARCorrectiveActionPlan.root_cause.in_(car_rootcause["root_causes"]))
            ).all()
        print(f"car_cap_data: {car_cap_data}")
        return car_cap_data
    except NoResultFound:
        print(f"No car_cap_data found for car_number: {car_rootcause['car_number']} and root cause {car_rootcause['root_cause']}")
    except Exception as e:
        print(f"Exception in retrieve_car_cap_data: {e}")
        raise Exception(f"Exception in retrieve_car_cap_data: {e}")

def add_car_qpt_requirement(car_qpt_req: CARQPTReq, session: DBSession):
    try:
        car_qpt_req_query = text("""
         INSERT INTO car_qpt_requirements(car_number, qms_required, qms_required_comments, qms_documentation_required, 
                        qms_documentation_required_comments, training_required, training_required_comments)
         VALUES (:car_number, :qms_required, :qms_required_comments, :qms_documentation_required, 
                        :qms_documentation_required_comments, :training_required, :training_required_comments)
         ON CONFLICT (car_number) DO UPDATE
         SET
            qms_required = :qms_required,
            qms_required_comments = :qms_required_comments,
            qms_documentation_required = :qms_documentation_required,
            qms_documentation_required_comments = :qms_documentation_required_comments,
            training_required = :training_required,
            training_required_comments = :training_required_comments;                        
        """)
        session.execute(car_qpt_req_query, car_qpt_req.dict())
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_qpt_requirement: {e}")
        return "Error: Failed to add car qpt requirements"
    
def retrieve_car_qpt_requirement(car_number: CarNumber, session: DBSession):
    try:
        car_qpt_req = session.exec(
            select(CARQPTReq).\
                where(CARQPTReq.car_number == car_number["car_number"])
            ).one()
        return car_qpt_req
    except NoResultFound:
        print(f"No car_qpt_req found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_qpt_requirement: {e}")
        raise Exception(f"Exception in retrieve_car_qpt_requirement: {e}")
        
        
def add_car_ca_effectiveness_plan(car_ca_effectiveness_plan: CARCAEffectivenessPlanData, session: DBSession):
    try:
        for entry in car_ca_effectiveness_plan.entries:
            stmt = select(CARCAEffectivenessPlan).where(
                (CARCAEffectivenessPlan.car_number == entry.car_number) & 
                (CARCAEffectivenessPlan.planned_action == entry.planned_action)
            )
            existing_entry = session.exec(stmt).first()
            if existing_entry:
                existing_entry.responsibility = entry.responsibility
                existing_entry.target_date = entry.target_date
                if existing_entry.actual_date:
                    existing_entry.actual_date = entry.actual_date
                existing_entry.status = entry.status
                session.add(existing_entry)
            else:
                new_entry = CARCAEffectivenessPlan(
                    car_number=entry.car_number,
                    planned_action = entry.planned_action,
                    responsibility = entry.responsibility,
                    target_date = entry.target_date,
                    actual_date = entry.actual_date if entry.actual_date else None,
                    status = entry.status
                )
                session.add(new_entry)
                
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_ca_effectiveness_plan: {e}")
        return "Error: Failed to add add_car_ca_effectiveness_plan"

def retrieve_car_ca_effectiveness_plan(car_number: CarNumber, session: DBSession):
    try:
        car_ca_effectiveness_plan = session.exec(
            select(CARCAEffectivenessPlan).\
                where(CARCAEffectivenessPlan.car_number == car_number["car_number"])
            ).all()
        return car_ca_effectiveness_plan
    except NoResultFound:
        print(f"No car_ca_effectiveness_plan found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_ca_effectiveness_plan: {e}")
        raise Exception(f"Exception in retrieve_car_ca_effectiveness_plan: {e}")    

def add_car_simple_root_cause_analysis(simple_root_cause_data: SimpleRootCauseData, session: DBSession):
    try:
        print(f"SimpleRootCauseData: {simple_root_cause_data}")
        # delete existing data for car_number and add new data into the SimpleRootCauseAnalysis table
        stmt = delete(SimpleRootCauseAnalysis).where(SimpleRootCauseAnalysis.car_number == simple_root_cause_data.car_number)
        session.execute(stmt)
        session.commit()
        
        # add new data in bulk into the SimpleRootCauseAnalysis table
        bulk_data = [
            {
                "car_number": entry.car_number,
                "row_header": entry.row_header,
                "column_header": entry.column_header,
                "root_cause": entry.root_cause,
            }
            for entry in simple_root_cause_data.entries
        ]
        
        # Perform bulk insert
        session.bulk_insert_mappings(SimpleRootCauseAnalysis, bulk_data)
        session.commit()        

        return "Success"
        
        # for entry in simple_root_cause_data.entries:
        #     stmt = select(SimpleRootCauseAnalysis).where(
        #         (SimpleRootCauseAnalysis.car_number == entry.car_number) & 
        #         (SimpleRootCauseAnalysis.row_header == entry.row_header) & 
        #         (SimpleRootCauseAnalysis.column_header == entry.column_header)                
        #     )
        #     existing_entry = session.exec(stmt).first()
        #     if existing_entry:
        #         existing_entry.data = entry.data
        #         session.add(existing_entry)
        #     else:
        #         new_entry = SimpleRootCauseAnalysis(
        #             car_number=entry.car_number,
        #             row_header=entry.row_header,
        #             column_header=entry.column_header,
        #             root_cause=entry.root_cause
        #         )
        #         session.add(new_entry)
                
        # session.commit()
        # return "Success"
    except Exception as e:
        print(f"Exception in add_car_simple_root_cause_analysis: {e}")
        return "Error: Failed to add data using add_car_simple_root_cause_analysis"

def retrieve_car_simple_root_cause_analysis(car_number: CarNumber, session: DBSession):
    try:
        stmt = select(SimpleRootCauseAnalysis).where(SimpleRootCauseAnalysis.car_number == car_number["car_number"])
        simple_root_cause_data = session.exec(stmt).all()
        return simple_root_cause_data
    except NoResultFound:
        print(f"No simple root cause data found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_simple_root_cause_analysis: {e}")
        raise Exception(f"Exception in retrieve_car_simple_root_cause_analysis: {e}")
    
def add_car_immediate_root_cause_analysis(immediate_root_cause: ImmediateRootCauseAnalysis, session: DBSession):
    try:
        immediate_root_cause_query = text(
            """
            INSERT INTO car_immediate_root_cause_analysis (car_number, root_cause)
            VALUES (:car_number, :root_cause)
            ON CONFLICT (car_number) DO UPDATE
            SET root_cause = :root_cause;
            """
        )
        session.execute(immediate_root_cause_query, immediate_root_cause.dict())
        session.commit()
        return "Success"
    except Exception as e:
        print(f"Exception in add_car_immediate_root_cause_analysis: {e}")
        return "Error: Failed to add data using add_car_immediate_root_cause_analysis"
    
def retrieve_car_immediate_root_cause_analysis(car_number: CarNumber, session: DBSession):
    try:
        stmt = select(ImmediateRootCauseAnalysis).where(ImmediateRootCauseAnalysis.car_number == car_number["car_number"])
        immediate_root_cause_data = session.exec(stmt).one()
        return immediate_root_cause_data
    except NoResultFound:
        print(f"No immediate root cause data found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in retrieve_car_immediate_root_cause_analysis: {e}")
        raise Exception(f"Exception in retrieve_car_immediate_root_cause_analysis: {e}")
    
def retrieve_car_logs(user_org: UserOrg, session: DBSession): 
    try:
        query = text("""
            select car_number, initiation_date::date::text, source, 
	            (select max(cpp.target_date) from car_planning_phase cpp where cpp.car_number = cpd.car_number)::date::text as target_date
            from car_problem_definition cpd where cpd.user_org = :user_org;
        """)
        car_logs = session.execute(query, {"user_org": user_org["user_org"]}).fetchall()
        # car_logs = session.execute(query).fetchall()
        return [
            {
                "car_number": car_number,
                "initiation_date": initiation_date,
                "source": source,
                "target_date": target_date
            }
            for car_number, initiation_date, source, target_date in car_logs
        ]
    except NoResultFound:
        print(f"No car logs found for user_org: {user_org['user_org']}")
    except Exception as e:
        print(f"Exception in retrieve_car_logs: {e}")
        raise Exception(f"Exception in retrieve_car_logs: {e}")
    
def retrieve_car_problem_desc(car_number: CarNumber, session: DBSession):
    # retrieve data from car_problem_desc table & car_planning_phase     table
    # return data to frontend
    try:
        car_problem_desc_query = text("""
                                      with
                                        car_num_data as (select :car_number as car_num),
                                        lacc_data as (select * from car_planning_phase, car_num_data 
                                                        where car_number = car_num_data.car_num and phase = 'Look Across, Correct, Contain'),
                                        ca_phase_data as (select * from car_planning_phase, car_num_data 
                                                        where car_number = car_num_data.car_num and phase = 'Corrective Action (CA) Implementation'),
                                        ca_desc_data as (select * from car_problem_definition cpd, car_num_data where car_number = car_num_data.car_num )
                                        select ca_desc_data.car_number, ca_desc_data.initiation_date::date::text, 
                                            ca_desc_data.initiator, ca_desc_data.recipient,
                                            ca_desc_data.coordinator, ca_desc_data.source, ca_desc_data.description,
                                            lacc_data.phase as lacc_phase, lacc_data.responsibility as lacc_responsibility, 
                                            lacc_data.target_date::date::text as lacc_target_date,
                                            ca_phase_data.phase as ca_phase, ca_phase_data.responsibility as ca_responsibility, 
                                            ca_phase_data.target_date::date::text as ca_target_date 
                                        from lacc_data, ca_phase_data, ca_desc_data
                                    """)
        car_problem_desc_data = session.execute(car_problem_desc_query, {"car_number": car_number["car_number"]}).one()
        car_number, initiation_date, initiator, recipient, coordinator, source, description, \
            lacc_phase, lacc_responsibility, lacc_target_date, ca_phase, ca_responsibility, ca_target_date = car_problem_desc_data
        car_problem_desc = {
            "car_number": car_number,
            "initiation_date": initiation_date,
            "initiator": initiator,
            "recipient": recipient,
            "coordinator": coordinator,
            "source": source,
            "description": description,
            "lacc_phase": lacc_phase,
            "lacc_responsibility": lacc_responsibility,
            "lacc_target_date": lacc_target_date,
            "ca_phase": ca_phase,
            "ca_responsibility": ca_responsibility,
            "ca_target_date": ca_target_date
        }
        return car_problem_desc
    except NoResultFound:
        print(f"No car problem desc data found for car_number: {car_number['car_number']}")
    except Exception as e:
        print(f"Exception in get_car_problem_desc: {e}")
        raise Exception(f"Exception in get_car_problem_desc: {e}")
    