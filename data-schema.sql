CREATE OR REPLACE FUNCTION encode_base62(input BYTEA) RETURNS TEXT AS $$
DECLARE
    chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    base INT := 62;
    num NUMERIC := 0;
    result TEXT := '';
    i INT;
BEGIN
    -- Convert bytea input to a big number
    FOR i IN 0 .. length(input) - 1 LOOP
        num := num * 256 + get_byte(input, i);
    END LOOP;

    -- Convert number to base62
    IF num = 0 THEN
        RETURN substr(chars, 1, 1);
    END IF;

    WHILE num > 0 LOOP
        result := substr(chars, (mod(num, base) + 1)::INT, 1) || result;
        num := floor(num / base);
    END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


CREATE OR REPLACE FUNCTION generate_random_alphanum_id() RETURNS TEXT AS $$
DECLARE
    raw BYTEA;
    code TEXT;
BEGIN
    LOOP
        -- Generate 8 random bytes (~64 bits)
        raw := gen_random_bytes(8);

        -- Encode as base62 and left-pad to 10 characters
        code := lpad(encode_base62(raw), 10, '0');

        -- Optionally check for uniqueness in a table here
        -- EXIT WHEN NOT EXISTS (SELECT 1 FROM your_table WHERE id = code);

        RETURN code;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;


CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT generate_random_alphanum_id(),
    name TEXT NOT NULL
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob');


SELECT * FROM users;