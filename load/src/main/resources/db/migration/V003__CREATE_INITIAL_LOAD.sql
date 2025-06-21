CREATE TABLE loads (
    id UUID NOT NULL,
    load_number VARCHAR(50) NOT NULL,
    broker_id UUID,
    shipper_id UUID,
    carrier_id UUID,
    status VARCHAR(100) NOT NULL,
    origin_address VARCHAR(500),
    origin_city VARCHAR(100),
    origin_state VARCHAR(50),
    origin_zip VARCHAR(20),
    origin_lat numeric(10, 6),
    origin_lng numeric(10, 6),
    destination_address VARCHAR(500),
    destination_city VARCHAR(100),
    destination_state VARCHAR(50),
    destination_zip VARCHAR(20),
    destination_lat numeric(10, 6),
    destination_lng numeric(10, 6),
    distance INTEGER,
    commodity VARCHAR(255),
    weight INTEGER,
    equipment_type VARCHAR(100),
    routing_type VARCHAR(100),
    rate numeric(10, 2),
    carrier_rate numeric(10, 2),
    pickup_date date,
    pickup_time_start time WITHOUT TIME ZONE,
    pickup_time_end time WITHOUT TIME ZONE,
    delivery_date date,
    delivery_time_start time WITHOUT TIME ZONE,
    delivery_time_end time WITHOUT TIME ZONE,
    notes TEXT,
    special_instructions TEXT,
    reference_number VARCHAR(100),
    posted_to_loadboards BOOLEAN,
    created_by UUID,
    assigned_dispatcher UUID,
    assigned_driver_id UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT loads_pkey PRIMARY KEY (id)
);

CREATE TABLE load_stops (
    id UUID NOT NULL,
    stop_number INTEGER NOT NULL,
    stop_type VARCHAR(100) NOT NULL,
    company_id UUID,
    warehouse_id UUID,
    location_name VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50),
    latitude numeric(10, 6),
    longitude numeric(10, 6),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    scheduled_date date,
    scheduled_time_start time WITHOUT TIME ZONE,
    scheduled_time_end time WITHOUT TIME ZONE,
    actual_arrival TIMESTAMP WITHOUT TIME ZONE,
    actual_departure TIMESTAMP WITHOUT TIME ZONE,
    notes TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    load_id UUID NOT NULL,
    CONSTRAINT load_stops_pkey PRIMARY KEY (id)
);

CREATE TABLE load_cargoes (
    id UUID NOT NULL,
    commodity VARCHAR(255) NOT NULL,
    commodity_code VARCHAR(50),
    weight numeric(10, 2) NOT NULL,
    weight_unit VARCHAR(10),
    pieces INTEGER,
    pallet_count INTEGER,
    dimensions TEXT,
    hazmat BOOLEAN,
    hazmat_class VARCHAR(50),
    un_number VARCHAR(10),
    temperature_controlled BOOLEAN,
    temperature_min numeric(5, 2),
    temperature_max numeric(5, 2),
    temperature_unit VARCHAR(10),
    cargo_value numeric(12, 2),
    po_number VARCHAR(100),
    seal_number VARCHAR(50),
    cargo_status VARCHAR(50),
    reference_number VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    load_id UUID NOT NULL,
    pickup_stop_id UUID,
    delivery_stop_id UUID,
    CONSTRAINT load_cargoes_pkey PRIMARY KEY (id)
);

CREATE TABLE load_status_histories (
    id UUID NOT NULL,
    load_id UUID,
    old_status VARCHAR(255),
    new_status VARCHAR(255) NOT NULL,
    change_reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT load_status_histories_pkey PRIMARY KEY (id)
);

CREATE TABLE load_trackings (
    id UUID NOT NULL,
    driver_id UUID,
    latitude numeric(10, 6),
    longitude numeric(10, 6),
    location_name VARCHAR(255),
    speed INTEGER,
    heading INTEGER,
    odometer INTEGER,
    engine_hours INTEGER,
    fuel_level INTEGER,
    temperature numeric(5, 2),
    status VARCHAR(50),
    event_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    load_id UUID NOT NULL,
    CONSTRAINT load_trackings_pkey PRIMARY KEY (id)
);

CREATE TABLE load_documents (
    id UUID NOT NULL,
    stop_id UUID,
    load_cargo_id UUID,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE,
    load_id UUID NOT NULL,
    CONSTRAINT load_documents_pkey PRIMARY KEY (id)
);

CREATE TABLE load_offers (
    id UUID NOT NULL,
    carrier_id UUID,
    offered_rate numeric(10, 2),
    status VARCHAR(50),
    valid_until TIMESTAMP WITHOUT TIME ZONE,
    equipment_type VARCHAR(100),
    driver_id UUID,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    load_id UUID NOT NULL,
    CONSTRAINT load_offers_pkey PRIMARY KEY (id)
);

CREATE TABLE load_status_events (
    id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    stop_id UUID,
    latitude numeric(10, 6),
    longitude numeric(10, 6),
    notes TEXT,
    metadata TEXT,
    created_by UUID,
    load_id UUID NOT NULL,
    CONSTRAINT load_status_events_pkey PRIMARY KEY (id)
);

CREATE TABLE load_assignments (
    id UUID NOT NULL,
    load_id UUID NOT NULL,
    assignment_type VARCHAR(50) NOT NULL,
    assigned_to_id UUID,
    assigned_to_company_id UUID,
    assigned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    unassigned_at TIMESTAMP WITHOUT TIME ZONE,
    assignment_reason VARCHAR(255),
    unassignment_reason VARCHAR(255),
    notes TEXT,
    assigned_by UUID,
    unassigned_by UUID,
    CONSTRAINT load_assignments_pkey PRIMARY KEY (id)
);

ALTER TABLE load_stops ADD CONSTRAINT fk_load_stops_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_cargoes ADD CONSTRAINT fk_load_cargoes_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_cargoes ADD CONSTRAINT fk_load_cargoes_pickup_stop_id FOREIGN KEY (pickup_stop_id) REFERENCES load_stops (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_cargoes ADD CONSTRAINT fk_load_cargoes_delivery_stop_id FOREIGN KEY (delivery_stop_id) REFERENCES load_stops (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_trackings ADD CONSTRAINT fk_load_trackings_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_documents ADD CONSTRAINT fk_load_documents_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_offers ADD CONSTRAINT fk_load_offers_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE load_status_events ADD CONSTRAINT fk_load_status_events_load_id FOREIGN KEY (load_id) REFERENCES loads (id) ON UPDATE NO ACTION ON DELETE NO ACTION;
