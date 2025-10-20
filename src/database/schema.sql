CREATE TYPE gender AS ENUM('male', 'female');

CREATE TYPE user_role AS ENUM('super_admin', 'admin', 'doctor', 'patient');

CREATE TYPE patient_status AS ENUM('active', 'discharged');

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS hospitals (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON hospitals
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    user_role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE IF NOT EXISTS doctors (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    hospital_id INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_doctor_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_hospital FOREIGN key (hospital_id) REFERENCES hospitals (id)
);

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE IF NOT EXISTS patients (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    hospital_id INT,
    patient_status patient_status,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_patient_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_hospital FOREIGN key (hospital_id) REFERENCES hospitals (id)
);

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE IF NOT EXISTS appointments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    hospital_id INT,
    message TEXT,
    apmt_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_appointment_patient_id FOREIGN KEY (patient_id) REFERENCES patients (id)
);

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();