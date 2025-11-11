-- Create sequence for auto-generating CAR numbers
-- This sequence starts at 1 and increments by 1 for each new CAR

DROP SEQUENCE IF EXISTS car_number_seq;

CREATE SEQUENCE car_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Optional: Set the sequence to start from the maximum existing CAR number + 1
-- This is useful if you have existing CARs
-- Uncomment and adjust the query below if needed:
-- SELECT setval('car_number_seq', COALESCE((SELECT MAX(car_number) FROM car_problem_definition), 0) + 1, false);


