DROP FUNCTION IF EXISTS get_root_cause_analysis;

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
            FROM car_immediate_root_cause_analysis  circa
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