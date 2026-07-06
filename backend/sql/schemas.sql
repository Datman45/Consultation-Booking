CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credits INTEGER
);

INSERT INTO clients (credits) VALUES (50);
INSERT INTO clients (credits) VALUES (100);
INSERT INTO clients (credits) VALUES (500);


CREATE TABLE IF NOT EXISTS experts (
    id UUID primary key DEFAULT gen_random_uuid(),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL
);

INSERT INTO experts (first_name, last_name) VALUES ('john', 'Black');
INSERT INTO experts (first_name, last_name) VALUES ('Steven', 'Smith');

CREATE TABLE IF NOT EXISTS slots (
    id UUID primary key DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID primary key DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    expert_id UUID NOT NULL,
    slot_id UUID NOT NULL UNIQUE,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);