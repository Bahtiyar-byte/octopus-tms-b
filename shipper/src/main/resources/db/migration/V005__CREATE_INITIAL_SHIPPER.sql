CREATE TABLE IF NOT EXISTS warehouses (
    id UUID NOT NULL,
    company_id UUID,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    latitude numeric(10, 6),
    longitude numeric(10, 6),
    manager_id UUID,
    phone VARCHAR(50),
    email VARCHAR(255),
    operating_hours TEXT,
    capacity_sqft INTEGER,
    dock_doors INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID NOT NULL,
    company_id UUID,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_of_measure VARCHAR(50),
    weight numeric(10, 2),
    length numeric(10, 2),
    width numeric(10, 2),
    height numeric(10, 2),
    reorder_point INTEGER,
    reorder_quantity INTEGER,
    hazmat BOOLEAN,
    temperature_controlled BOOLEAN,
    fragile BOOLEAN,
    status VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS inventory_levels (
    id UUID NOT NULL,
    item_id UUID,
    quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    reserved_quantity INTEGER NOT NULL,
    location_zone VARCHAR(50),
    location_aisle VARCHAR(50),
    location_rack VARCHAR(50),
    location_bin VARCHAR(50),
    last_count_date date,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    warehouse_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID NOT NULL,
    item_id UUID,
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    reference_type VARCHAR(50),
    reference_id UUID,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    inventory_item_id UUID NOT NULL,
    warehouse_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS shipment_readinesses (
    id UUID NOT NULL,
    warehouse_id UUID,
    order_number VARCHAR(100),
    customer_id UUID,
    status VARCHAR(50),
    priority VARCHAR(50),
    required_date date,
    special_instructions TEXT,
    total_items INTEGER,
    picked_items INTEGER,
    packed_items INTEGER,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);