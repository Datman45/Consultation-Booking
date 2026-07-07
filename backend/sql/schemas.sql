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

INSERT INTO experts (first_name, last_name) VALUES ('John', 'Black');
INSERT INTO experts (first_name, last_name) VALUES ('Steven', 'Smith');

CREATE TABLE IF NOT EXISTS slots (
    id UUID primary key DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id),
    date TIMESTAMP NOT NULL
);

INSERT INTO slots (expert_id, date) SELECT id, '2026-07-10 12:00:00' FROM experts WHERE first_name = 'John' AND last_name = 'Black';
INSERT INTO slots (expert_id, date) SELECT id, '2026-07-10 12:30:00' FROM experts WHERE first_name = 'Steven' AND last_name = 'Smith';
INSERT INTO slots (expert_id, date) SELECT id, '2026-07-10 13:00:00' FROM experts WHERE first_name = 'John' AND last_name = 'Black';
INSERT INTO slots (expert_id, date) SELECT id, '2026-07-10 13:30:00' FROM experts WHERE first_name = 'Steven' AND last_name = 'Smith';

CREATE TABLE IF NOT EXISTS bookings (
    id UUID primary key DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    expert_id UUID NOT NULL REFERENCES experts(id),
    slot_id UUID NOT NULL UNIQUE REFERENCES slots(id),
    status VARCHAR(255) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);