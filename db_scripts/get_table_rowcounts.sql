---Find table count
DO $$
DECLARE
    table_record RECORD;
    row_count BIGINT;
BEGIN
    RAISE NOTICE 'Table Name | Row Count';
    RAISE NOTICE '---------------------';

    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I.%I', 'public', table_record.table_name)
        INTO row_count;

        RAISE NOTICE '% | %', table_record.table_name, row_count;
    END LOOP;
END;
$$;