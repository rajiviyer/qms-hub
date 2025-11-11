-- ============================================================================
-- QMS Hub MVP Database Schema Creation Script
-- ============================================================================
-- This script creates all database objects required for the QMS Hub application
-- including tables, sequences, functions, and constraints.
--
-- Usage:
--   psql -h localhost -p 5410 -U postgres -d qmsdb -f db_scripts/mvp_schema.sql
--
-- Note: Replace 'qms_schema' with your actual schema name if different
-- ============================================================================

-- Set the schema (adjust if your schema name is different)
-- CREATE SCHEMA IF NOT EXISTS qms_schema;
-- SET search_path TO qms_schema, public;

-- ============================================================================
-- PART 1: DROP EXISTING OBJECTS (in reverse dependency order)
-- ============================================================================

-- Drop functions first
DROP FUNCTION IF EXISTS get_root_cause_analysis(TEXT);

-- Drop sequences
DROP SEQUENCE IF EXISTS car_number_seq;

-- Drop tables (in reverse dependency order to handle foreign keys)
DROP TABLE IF EXISTS car_qpt_requirements CASCADE;
DROP TABLE IF EXISTS car_ca_effectiveness_plan CASCADE;
DROP TABLE IF EXISTS car_corrective_action_plan CASCADE;
DROP TABLE IF EXISTS car_immediate_root_cause_analysis CASCADE;
DROP TABLE IF EXISTS car_simple_root_cause_analysis CASCADE;
DROP TABLE IF EXISTS car_fishbone_analysis CASCADE;
DROP TABLE IF EXISTS car_rca_type_selection CASCADE;
DROP TABLE IF EXISTS car_ca_need CASCADE;
DROP TABLE IF EXISTS car_problem_redefinition CASCADE;
DROP TABLE IF EXISTS car_planning_phase CASCADE;
DROP TABLE IF EXISTS car_problem_definition CASCADE;
DROP TABLE IF EXISTS token CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

-- ============================================================================
-- PART 2: CREATE SEQUENCES
-- ============================================================================

-- Sequence for auto-generating CAR numbers
CREATE SEQUENCE car_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

COMMENT ON SEQUENCE car_number_seq IS 'Sequence for auto-generating unique CAR numbers';

-- ============================================================================
-- PART 3: CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- User Management Tables
-- ----------------------------------------------------------------------------

-- User table
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_passwd VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50)
);

COMMENT ON TABLE "user" IS 'User account information';
COMMENT ON COLUMN "user".user_id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN "user".user_email IS 'User email address, unique';
COMMENT ON COLUMN "user".user_passwd IS 'Hashed user password';
COMMENT ON COLUMN "user".user_name IS 'User full name';
COMMENT ON COLUMN "user".organization IS 'User organization';
COMMENT ON COLUMN "user".phone_number IS 'User phone number (optional)';

-- Token table
CREATE TABLE token (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    refresh_token TEXT NOT NULL,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

COMMENT ON TABLE token IS 'JWT refresh token storage';
COMMENT ON COLUMN token.token_id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN token.user_id IS 'Foreign key to user table';
COMMENT ON COLUMN token.refresh_token IS 'JWT refresh token';

-- Employee table
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    employee_email VARCHAR(255) NOT NULL UNIQUE,
    employee_password VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL
);

COMMENT ON TABLE employee IS 'Employee information';
COMMENT ON COLUMN employee.employee_id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN employee.employee_name IS 'Employee full name';
COMMENT ON COLUMN employee.employee_email IS 'Employee email address, unique';
COMMENT ON COLUMN employee.employee_password IS 'Hashed employee password';
COMMENT ON COLUMN employee.organization IS 'Employee organization';

-- Admin table
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    admin_name VARCHAR(255),
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL
);

COMMENT ON TABLE admin IS 'Administrator accounts';
COMMENT ON COLUMN admin.admin_id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN admin.admin_name IS 'Administrator name (optional)';
COMMENT ON COLUMN admin.admin_email IS 'Administrator email address, unique';
COMMENT ON COLUMN admin.admin_password IS 'Hashed administrator password';

-- ----------------------------------------------------------------------------
-- CAR Core Tables
-- ----------------------------------------------------------------------------

-- CAR Problem Definition table (main CAR table)
CREATE TABLE car_problem_definition (
    car_number INTEGER PRIMARY KEY,
    initiation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    initiator VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    coordinator VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_org VARCHAR(255) NOT NULL
);

COMMENT ON TABLE car_problem_definition IS 'Primary CAR information and problem description';
COMMENT ON COLUMN car_problem_definition.car_number IS 'Primary key, unique CAR identifier';
COMMENT ON COLUMN car_problem_definition.initiation_date IS 'Date and time when CAR was initiated';
COMMENT ON COLUMN car_problem_definition.initiator IS 'Person who initiated the CAR';
COMMENT ON COLUMN car_problem_definition.recipient IS 'Person responsible for receiving the CAR';
COMMENT ON COLUMN car_problem_definition.coordinator IS 'Person coordinating the CAR';
COMMENT ON COLUMN car_problem_definition.source IS 'Source of the CAR (e.g., CCN, IA, etc.)';
COMMENT ON COLUMN car_problem_definition.description IS 'Problem description with violating requirement and objective evidence';
COMMENT ON COLUMN car_problem_definition.user_org IS 'Organization of the user creating the CAR';

-- CAR Planning Phase table
CREATE TABLE car_planning_phase (
    car_number INTEGER NOT NULL,
    phase VARCHAR(255) NOT NULL,
    responsibility VARCHAR(255) NOT NULL,
    target_date TIMESTAMP NOT NULL,
    CONSTRAINT car_planning_phase_pk PRIMARY KEY (car_number, phase),
    CONSTRAINT fk_planning_phase_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_planning_phase IS 'CAR workflow phases and responsibilities';
COMMENT ON COLUMN car_planning_phase.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_planning_phase.phase IS 'Phase name (e.g., Look Across, Correct, Contain)';
COMMENT ON COLUMN car_planning_phase.responsibility IS 'Person responsible for this phase';
COMMENT ON COLUMN car_planning_phase.target_date IS 'Target completion date for this phase';

-- CAR Problem Redefinition table
CREATE TABLE car_problem_redefinition (
    car_number INTEGER PRIMARY KEY,
    redefined_problem TEXT NOT NULL,
    correction TEXT NOT NULL,
    containment TEXT NOT NULL,
    corr_cont_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_problem_redef_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_problem_redefinition IS 'Problem redefinition and containment information';
COMMENT ON COLUMN car_problem_redefinition.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_problem_redefinition.redefined_problem IS 'Redefined problem statement';
COMMENT ON COLUMN car_problem_redefinition.correction IS 'Correction actions taken';
COMMENT ON COLUMN car_problem_redefinition.containment IS 'Containment actions taken';
COMMENT ON COLUMN car_problem_redefinition.corr_cont_date IS 'Date of correction and containment';

-- CAR CA Need table
CREATE TABLE car_ca_need (
    car_number INTEGER PRIMARY KEY,
    ca_required VARCHAR(255) NOT NULL,
    required_by VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    severity INTEGER,
    occurrence INTEGER,
    rpn INTEGER,
    ca_needed VARCHAR(255) NOT NULL,
    CONSTRAINT fk_ca_need_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_ca_need IS 'Corrective action requirements assessment';
COMMENT ON COLUMN car_ca_need.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_ca_need.ca_required IS 'Whether corrective action is required';
COMMENT ON COLUMN car_ca_need.required_by IS 'Person or requirement that mandates CA';
COMMENT ON COLUMN car_ca_need.comment IS 'Comments on CA need';
COMMENT ON COLUMN car_ca_need.severity IS 'Severity rating (optional)';
COMMENT ON COLUMN car_ca_need.occurrence IS 'Occurrence rating (optional)';
COMMENT ON COLUMN car_ca_need.rpn IS 'Risk Priority Number (optional)';
COMMENT ON COLUMN car_ca_need.ca_needed IS 'Whether CA is needed';

-- CAR RCA Type Selection table
CREATE TABLE car_rca_type_selection (
    car_number INTEGER PRIMARY KEY,
    rca_type VARCHAR(255) NOT NULL,
    CONSTRAINT fk_rca_type_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_rca_type_selection IS 'Root cause analysis type selection';
COMMENT ON COLUMN car_rca_type_selection.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_rca_type_selection.rca_type IS 'Type of RCA selected (e.g., Fishbone, Simple Root Cause, Immediate Cause Only)';

-- CAR Fishbone Analysis table
CREATE TABLE car_fishbone_analysis (
    id SERIAL PRIMARY KEY,
    car_number INTEGER NOT NULL,
    row_header VARCHAR(255) NOT NULL,
    column_header VARCHAR(255) NOT NULL,
    data TEXT NOT NULL DEFAULT '',
    CONSTRAINT fk_fishbone_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_fishbone_analysis IS 'Fishbone analysis data';
COMMENT ON COLUMN car_fishbone_analysis.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN car_fishbone_analysis.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_fishbone_analysis.row_header IS 'Row header in fishbone analysis';
COMMENT ON COLUMN car_fishbone_analysis.column_header IS 'Column header in fishbone analysis';
COMMENT ON COLUMN car_fishbone_analysis.data IS 'Data value for the cell';

-- CAR Simple Root Cause Analysis table
CREATE TABLE car_simple_root_cause_analysis (
    id SERIAL PRIMARY KEY,
    car_number INTEGER NOT NULL,
    row_header VARCHAR(255) NOT NULL,
    column_header VARCHAR(255) NOT NULL,
    root_cause TEXT NOT NULL DEFAULT '',
    CONSTRAINT fk_simple_rca_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_simple_root_cause_analysis IS 'Simple root cause analysis data';
COMMENT ON COLUMN car_simple_root_cause_analysis.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN car_simple_root_cause_analysis.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_simple_root_cause_analysis.row_header IS 'Row header in simple RCA analysis';
COMMENT ON COLUMN car_simple_root_cause_analysis.column_header IS 'Column header in simple RCA analysis';
COMMENT ON COLUMN car_simple_root_cause_analysis.root_cause IS 'Root cause identified';

-- CAR Immediate Root Cause Analysis table
CREATE TABLE car_immediate_root_cause_analysis (
    car_number INTEGER PRIMARY KEY,
    root_cause TEXT NOT NULL DEFAULT '',
    CONSTRAINT fk_immediate_rca_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_immediate_root_cause_analysis IS 'Immediate root cause analysis';
COMMENT ON COLUMN car_immediate_root_cause_analysis.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_immediate_root_cause_analysis.root_cause IS 'Immediate root cause identified';

-- CAR Corrective Action Plan table
CREATE TABLE car_corrective_action_plan (
    car_number INTEGER NOT NULL,
    root_cause TEXT NOT NULL,
    corrective_action TEXT NOT NULL,
    responsibility VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT car_cap_ca_pk PRIMARY KEY (car_number, root_cause, corrective_action),
    CONSTRAINT fk_cap_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_corrective_action_plan IS 'Corrective action planning and tracking';
COMMENT ON COLUMN car_corrective_action_plan.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_corrective_action_plan.root_cause IS 'Root cause addressed by this action';
COMMENT ON COLUMN car_corrective_action_plan.corrective_action IS 'Corrective action to be taken';
COMMENT ON COLUMN car_corrective_action_plan.responsibility IS 'Person responsible for this action';
COMMENT ON COLUMN car_corrective_action_plan.target_date IS 'Target completion date';
COMMENT ON COLUMN car_corrective_action_plan.actual_date IS 'Actual completion date (optional)';
COMMENT ON COLUMN car_corrective_action_plan.status IS 'Status of the corrective action';

-- CAR QPT Requirements table
CREATE TABLE car_qpt_requirements (
    car_number INTEGER PRIMARY KEY,
    qms_required VARCHAR(255) NOT NULL,
    qms_required_comments TEXT NOT NULL,
    qms_documentation_required VARCHAR(255) NOT NULL,
    qms_documentation_required_comments TEXT NOT NULL,
    training_required VARCHAR(255) NOT NULL,
    training_required_comments TEXT NOT NULL,
    CONSTRAINT fk_qpt_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_qpt_requirements IS 'QMS process and training requirements';
COMMENT ON COLUMN car_qpt_requirements.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_qpt_requirements.qms_required IS 'Whether QMS process is required';
COMMENT ON COLUMN car_qpt_requirements.qms_required_comments IS 'Comments on QMS requirement';
COMMENT ON COLUMN car_qpt_requirements.qms_documentation_required IS 'Whether QMS documentation is required';
COMMENT ON COLUMN car_qpt_requirements.qms_documentation_required_comments IS 'Comments on QMS documentation requirement';
COMMENT ON COLUMN car_qpt_requirements.training_required IS 'Whether training is required';
COMMENT ON COLUMN car_qpt_requirements.training_required_comments IS 'Comments on training requirement';

-- CAR CA Effectiveness Plan table
CREATE TABLE car_ca_effectiveness_plan (
    car_number INTEGER NOT NULL,
    planned_action TEXT NOT NULL,
    responsibility VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT car_ca_effectiveness_plan_pk PRIMARY KEY (car_number, planned_action),
    CONSTRAINT fk_ca_effectiveness_car FOREIGN KEY (car_number) REFERENCES car_problem_definition(car_number) ON DELETE CASCADE
);

COMMENT ON TABLE car_ca_effectiveness_plan IS 'Effectiveness verification planning';
COMMENT ON COLUMN car_ca_effectiveness_plan.car_number IS 'Foreign key to car_problem_definition';
COMMENT ON COLUMN car_ca_effectiveness_plan.planned_action IS 'Planned action for effectiveness verification';
COMMENT ON COLUMN car_ca_effectiveness_plan.responsibility IS 'Person responsible for this action';
COMMENT ON COLUMN car_ca_effectiveness_plan.target_date IS 'Target completion date';
COMMENT ON COLUMN car_ca_effectiveness_plan.actual_date IS 'Actual completion date (optional)';
COMMENT ON COLUMN car_ca_effectiveness_plan.status IS 'Status of the effectiveness verification';

-- ============================================================================
-- PART 4: CREATE INDEXES (for performance optimization)
-- ============================================================================

-- Indexes on foreign keys
CREATE INDEX idx_car_planning_phase_car_number ON car_planning_phase(car_number);
CREATE INDEX idx_car_problem_redef_car_number ON car_problem_redefinition(car_number);
CREATE INDEX idx_car_ca_need_car_number ON car_ca_need(car_number);
CREATE INDEX idx_car_rca_type_car_number ON car_rca_type_selection(car_number);
CREATE INDEX idx_car_fishbone_car_number ON car_fishbone_analysis(car_number);
CREATE INDEX idx_car_simple_rca_car_number ON car_simple_root_cause_analysis(car_number);
CREATE INDEX idx_car_immediate_rca_car_number ON car_immediate_root_cause_analysis(car_number);
CREATE INDEX idx_car_cap_car_number ON car_corrective_action_plan(car_number);
CREATE INDEX idx_car_qpt_car_number ON car_qpt_requirements(car_number);
CREATE INDEX idx_car_ca_effectiveness_car_number ON car_ca_effectiveness_plan(car_number);
CREATE INDEX idx_token_user_id ON token(user_id);

-- Indexes on frequently queried columns
CREATE INDEX idx_car_problem_def_user_org ON car_problem_definition(user_org);
CREATE INDEX idx_car_problem_def_initiation_date ON car_problem_definition(initiation_date);
CREATE INDEX idx_car_problem_def_source ON car_problem_definition(source);

-- ============================================================================
-- PART 5: CREATE FUNCTIONS
-- ============================================================================

-- Function to get root cause analysis based on RCA type
CREATE OR REPLACE FUNCTION get_root_cause_analysis(p_car_number INTEGER)
RETURNS TABLE (
    car_number INTEGER,
    root_cause TEXT
) AS $$
DECLARE
    v_rca_type TEXT;
BEGIN
    -- Retrieve the rca_type for the given car_number
    SELECT crts.rca_type 
    INTO v_rca_type
    FROM car_rca_type_selection crts
    WHERE crts.car_number = p_car_number
    LIMIT 1;

    -- Check the RCA type for the given car_number
    IF v_rca_type = 'Simple Root Cause' THEN
        -- If RCA type is 'Simple Root Cause', return data from car_simple_root_cause_analysis
        RETURN QUERY
        SELECT srcr.car_number, srcr.root_cause::TEXT 
        FROM (
            SELECT *, RANK() OVER (PARTITION BY row_header ORDER BY id DESC) AS rnk
            FROM car_simple_root_cause_analysis cscrca
            WHERE cscrca.root_cause <> '' 
              AND cscrca.car_number = p_car_number
        ) srcr
        WHERE srcr.rnk = 1;
    ELSIF v_rca_type = 'Immediate Cause Only' THEN
        -- If RCA type is 'Immediate Root Cause', return data from car_immediate_root_cause_analysis 
        RETURN QUERY
            SELECT circa.car_number, circa.root_cause::TEXT
            FROM car_immediate_root_cause_analysis circa
            WHERE circa.car_number = p_car_number;
    ELSE
        -- Otherwise, return data from car_fishbone_analysis
        RETURN QUERY
        SELECT cfar.car_number, cfar.data::TEXT AS root_cause
        FROM (
            SELECT *, RANK() OVER (PARTITION BY row_header ORDER BY id DESC) AS rnk
            FROM car_fishbone_analysis cfa  
            WHERE cfa.data <> '' 
              AND cfa.car_number = p_car_number
        ) cfar
        WHERE cfar.rnk = 1;
    END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_root_cause_analysis(INTEGER) IS 'Dynamic root cause analysis function that returns root causes based on the selected RCA type';

-- ============================================================================
-- PART 6: GRANT PERMISSIONS (if needed)
-- ============================================================================

-- Uncomment and adjust if you need to grant permissions to specific users
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO qms_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO qms_user;
-- GRANT EXECUTE ON FUNCTION get_root_cause_analysis(TEXT) TO qms_user;

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================

