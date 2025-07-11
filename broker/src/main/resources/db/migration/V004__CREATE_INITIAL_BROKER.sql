CREATE TABLE IF NOT EXISTS contracts (
    id UUID NOT NULL,
    broker_id UUID,
    carrier_id UUID,
    contract_number VARCHAR(50),
    status VARCHAR(50),
    effective_date date,
    expiration_date date,
    auto_renew BOOLEAN,
    terms TEXT,
    rate_schedule TEXT,
    insurance_requirements TEXT,
    signed_date date,
    signed_by VARCHAR(255),
    file_path VARCHAR(500),
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
