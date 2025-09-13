CREATE TABLE IF NOT EXISTS room (
                                    room_id SERIAL PRIMARY KEY,
                                    room_number VARCHAR(30) NOT NULL UNIQUE,
    room_floor INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
    );

TRUNCATE TABLE room RESTART IDENTITY;

DO $$
DECLARE
f INT;
    r INT;
BEGIN
FOR f IN 1..2 LOOP
        FOR r IN 1..12 LOOP
            INSERT INTO room (room_floor, room_number, status)
            VALUES (f, CONCAT(f, LPAD(r::text, 2, '0')), 'available');
END LOOP;
END LOOP;
END$$;
