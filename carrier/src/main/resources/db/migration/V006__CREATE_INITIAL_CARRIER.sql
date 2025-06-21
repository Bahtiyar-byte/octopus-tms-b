CREATE TABLE drivers (
    id UUID NOT NULL,
    company_id UUID,
    user_id UUID,
    driver_code VARCHAR(50),
    cdl_number VARCHAR(50),
    cdl_state VARCHAR(50),
    cdl_expiration date,
    medical_cert_expiration date,
    hazmat_endorsed BOOLEAN,
    tanker_endorsed BOOLEAN,
    doubles_endorsed BOOLEAN,
    assigned_truck VARCHAR(50),
    home_terminal VARCHAR(100),
    status VARCHAR(50),
    hire_date date,
    termination_date date,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT drivers_pkey PRIMARY KEY (id)
);

CREATE TABLE driver_performances (
    id UUID NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    miles_driven INTEGER,
    loads_completed INTEGER,
    on_time_percentage numeric(5, 2),
    safety_score numeric(5, 2),
    fuel_efficiency numeric(5, 2),
    customer_rating numeric(3, 2),
    violations INTEGER,
    accidents INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    driver_id UUID,
    CONSTRAINT driver_performances_pkey PRIMARY KEY (id)
);

CREATE TABLE equipments (
    id UUID NOT NULL,
    carrier_id UUID NOT NULL,
    equipment_number VARCHAR(50) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    year INTEGER,
    make VARCHAR(100),
    model VARCHAR(100),
    vin VARCHAR(50),
    license_plate VARCHAR(50),
    license_state VARCHAR(2),
    color VARCHAR(50),
    status VARCHAR(50),
    current_location VARCHAR(255),
    current_driver_id UUID,
    last_inspection_date date,
    next_inspection_due date,
    registration_expiry date,
    insurance_expiry date,
    eld_provider VARCHAR(100),
    eld_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT equipments_pkey PRIMARY KEY (id)
);

ALTER TABLE driver_performances ADD CONSTRAINT fk_driver_performances_driver_id FOREIGN KEY (driver_id) REFERENCES drivers (id) ON UPDATE NO ACTION ON DELETE NO ACTION;
