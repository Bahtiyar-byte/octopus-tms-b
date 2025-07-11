-- Sample broker loads data for Octopus TMS
-- This script inserts sample broker loads into the database

-- First, let's create a broker company and user if they don't exist
INSERT INTO companies (id, name, type, status, address_line1, city, state, zip_code, country, phone, email, website, ein, mc_number, dot_number, created_at, updated_at)
VALUES
    ('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'Shanahan Transportation Systems, Inc.', 'BROKER', 'ACTIVE', '123 Main St', 'Chicago', 'IL', '60601', 'USA', '555-123-4567', 'info@shanahan-transport.com', 'www.shanahan-transport.com', '12-3456789', 'MC123456', 'DOT7890123', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample loads
INSERT INTO loads (
    id, load_number, broker_id, shipper_id, carrier_id, status,
    origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
    destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
    distance, commodity, weight, equipment_type, routing_type, rate, carrier_rate,
    pickup_date, pickup_time_start, pickup_time_end,
    delivery_date, delivery_time_start, delivery_time_end,
    notes, special_instructions, reference_number, posted_to_loadboards,
    created_by, created_at, updated_at
) VALUES
-- Load 1: New load from shipper
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'SH-2152', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    '11111111-1111-1111-1111-111111111111', NULL, 'New',
    '123 Manufacturing Way', 'Cincinnati', 'OH', '45202', 39.1031, -84.5120,
    '456 Delivery Blvd', 'Louisville', 'KY', '40202', 38.2527, -85.7585,
    100, 'Manufacturing Equipment', 35000, 'FLATBED', 'DIRECT', 1200.00, NULL,
    '2025-06-19', '08:00:00', '12:00:00',
    '2025-06-19', '14:00:00', '18:00:00',
    'Priority shipment for manufacturing line', 'Forklift required for loading', 'PO-78950', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 2: Posted load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'BL-1236', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    '33333333-3333-3333-3333-333333333333', NULL, 'Posted',
    '789 Shipping Lane', 'Miami', 'FL', '33101', 25.7617, -80.1918,
    '321 Receiving Road', 'Charlotte', 'NC', '28202', 35.2271, -80.8431,
    700, 'Retail Goods', 18000, 'DRY_VAN', 'DIRECT', 1950.00, NULL,
    '2025-06-17', '09:00:00', '14:00:00',
    '2025-06-19', '10:00:00', '16:00:00',
    'Standard retail shipment', 'Call recipient 1 hour before delivery', 'REF-89012', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 3: Assigned load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d481', 'BL-1234', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'Assigned',
    '101 Pickup Street', 'Chicago', 'IL', '60601', 41.8781, -87.6298,
    '202 Dropoff Avenue', 'Atlanta', 'GA', '30303', 33.7490, -84.3880,
    700, 'Electronics', 15000, 'DRY_VAN', 'DIRECT', 2200.00, 1900.00,
    '2025-06-15', '07:00:00', '11:00:00',
    '2025-06-17', '13:00:00', '17:00:00',
    'High-value electronics shipment', 'Security seal required', 'PO-12345', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 4: En Route load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'SH-2146', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 'En Route',
    '303 Factory Road', 'Detroit', 'MI', '48201', 42.3314, -83.0458,
    '404 Assembly Lane', 'Houston', 'TX', '77002', 29.7604, -95.3698,
    1200, 'Auto Parts', 38000, 'DRY_VAN', 'DIRECT', 2950.00, 2600.00,
    '2025-06-16', '06:00:00', '10:00:00',
    '2025-06-19', '08:00:00', '12:00:00',
    'Critical auto parts for assembly line', 'Temperature controlled environment required', 'PO-78946', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 5: Delivered load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'BL-1237', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    '88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', 'Delivered',
    '505 Harvest Road', 'Seattle', 'WA', '98101', 47.6062, -122.3321,
    '606 Market Street', 'Portland', 'OR', '97201', 45.5051, -122.6750,
    175, 'Produce', 24000, 'REEFER', 'DIRECT', 1100.00, 900.00,
    '2025-06-14', '05:00:00', '09:00:00',
    '2025-06-15', '10:00:00', '14:00:00',
    'Fresh produce delivery', 'Maintain temperature at 34-38F', 'PO-56789', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 6: Awaiting Docs load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d484', 'BL-1238', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Awaiting Docs',
    '707 Medical Drive', 'Boston', 'MA', '02108', 42.3601, -71.0589,
    '808 Hospital Way', 'New York', 'NY', '10001', 40.7128, -74.0060,
    220, 'Medical Supplies', 12000, 'DRY_VAN', 'DIRECT', 950.00, 800.00,
    '2025-06-13', '08:00:00', '12:00:00',
    '2025-06-14', '09:00:00', '13:00:00',
    'Medical supplies delivery', 'Handle with care', 'PO-34567', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
),

-- Load 7: Paid load
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d485', 'BL-1239', 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Paid',
    '909 Construction Ave', 'Denver', 'CO', '80202', 39.7392, -104.9903,
    '1010 Building Blvd', 'Salt Lake City', 'UT', '84101', 40.7608, -111.8910,
    500, 'Construction Materials', 28000, 'FLATBED', 'DIRECT', 1400.00, 1200.00,
    '2025-06-12', '07:00:00', '11:00:00',
    '2025-06-13', '12:00:00', '16:00:00',
    'Construction materials for project site', 'Oversized load', 'PO-23456', TRUE,
    '22222222-2222-2222-2222-222222222222', NOW(), NOW()
);

-- Insert load status history for each load
INSERT INTO load_status_histories (id, load_id, old_status, new_status, change_reason, notes, created_at)
VALUES
-- Load 1 status history
('11111111-aaaa-bbbb-cccc-dddddddddddd', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NULL, 'New', 'Initial creation', 'Load created by shipper', NOW()),

-- Load 2 status history
('22222222-aaaa-bbbb-cccc-dddddddddddd', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', NULL, 'New', 'Initial creation', 'Load created by broker', NOW() - INTERVAL '2 days'),
('22222222-aaaa-bbbb-cccc-ddddddddddee', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 'New', 'Posted', 'Ready for carrier assignment', 'Posted to loadboard', NOW() - INTERVAL '1 day'),

-- Load 3 status history
('33333333-aaaa-bbbb-cccc-dddddddddddd', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', NULL, 'New', 'Initial creation', 'Load created by broker', NOW() - INTERVAL '4 days'),
('33333333-aaaa-bbbb-cccc-ddddddddddee', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', 'New', 'Posted', 'Ready for carrier assignment', 'Posted to loadboard', NOW() - INTERVAL '3 days'),
('33333333-aaaa-bbbb-cccc-ddddddddddef', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Posted', 'Assigned', 'Carrier accepted load', 'Assigned to FastFreight Inc.', NOW() - INTERVAL '2 days'),

-- Load 4 status history
('44444444-aaaa-bbbb-cccc-dddddddddddd', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', NULL, 'New', 'Initial creation', 'Load created by shipper', NOW() - INTERVAL '5 days'),
('44444444-aaaa-bbbb-cccc-ddddddddddee', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'New', 'Posted', 'Ready for carrier assignment', 'Posted to loadboard', NOW() - INTERVAL '4 days'),
('44444444-aaaa-bbbb-cccc-ddddddddddef', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Posted', 'Assigned', 'Carrier accepted load', 'Assigned to Swift Logistics', NOW() - INTERVAL '3 days'),

-- Load 5-7 status histories follow similar patterns
('55555555-aaaa-bbbb-cccc-dddddddddddd', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', NULL, 'New', 'Initial creation', 'Load created by broker', NOW() - INTERVAL '7 days'),
('55555555-aaaa-bbbb-cccc-ddddddddddee', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'New', 'Posted', 'Ready for carrier assignment', 'Posted to loadboard', NOW() - INTERVAL '6 days'),
('55555555-aaaa-bbbb-cccc-ddddddddddef', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Posted', 'Assigned', 'Carrier accepted load', 'Assigned to Pacific Transport', NOW() - INTERVAL '5 days')
