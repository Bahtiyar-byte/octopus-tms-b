CREATE TABLE IF NOT EXISTS invoices (
    id UUID NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    load_id UUID,
    company_id UUID,
    invoice_type VARCHAR(50) NOT NULL,
    status VARCHAR(100),
    amount numeric(10, 2) NOT NULL,
    tax_amount numeric(10, 2),
    total_amount numeric(10, 2) NOT NULL,
    due_date date,
    paid_date date,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID NOT NULL,
    company_id UUID NOT NULL,
    payment_number VARCHAR(50),
    amount numeric(10, 2) NOT NULL,
    payment_method VARCHAR(100),
    payment_date date,
    reference_number VARCHAR(100),
    status VARCHAR(50),
    processor VARCHAR(50),
    processor_reference VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    invoice_id UUID
);

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID NOT NULL,
    description VARCHAR(500),
    quantity numeric(10, 2),
    unit_price numeric(10, 2),
    amount numeric(10, 2),
    tax_rate numeric(5, 2),
    tax_amount numeric(10, 2),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    invoice_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS accessorial_charges (
    id UUID NOT NULL,
    charge_type VARCHAR(100) NOT NULL,
    description TEXT,
    quantity numeric(10, 2),
    rate numeric(10, 2) NOT NULL,
    amount numeric(10, 2) NOT NULL,
    billable_to VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    approved_at TIMESTAMP WITHOUT TIME ZONE,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS rate_agreements (
    id UUID NOT NULL,
    agreement_number VARCHAR(50) NOT NULL,
    lane_origin_city VARCHAR(100),
    lane_origin_state VARCHAR(50),
    lane_origin_zip VARCHAR(20),
    lane_destination_city VARCHAR(100),
    lane_destination_state VARCHAR(50),
    lane_destination_zip VARCHAR(20),
    equipment_type VARCHAR(100),
    base_rate numeric(10, 2),
    rate_per_mile numeric(5, 2),
    fuel_surcharge_percent numeric(5, 2),
    min_rate numeric(10, 2),
    accessorial_rates TEXT,
    valid_from date NOT NULL,
    valid_until date NOT NULL,
    auto_renew BOOLEAN,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
