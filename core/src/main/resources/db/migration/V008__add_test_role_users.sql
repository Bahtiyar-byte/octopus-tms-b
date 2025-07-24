-- Create test companies and users
-- Password for all users: "password" (hashed with BCrypt)

-- Create carrier company if not exists
INSERT INTO companies (
    id, 
    name, 
    type, 
    status, 
    created_at, 
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'Test Carrier Company',
    'CARRIER',
    'ACTIVE',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies WHERE name = 'Test Carrier Company' AND type = 'CARRIER'
);

-- Create shipper company if not exists
INSERT INTO companies (
    id, 
    name, 
    type, 
    status, 
    created_at, 
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'Test Shipper Company',
    'SHIPPER',
    'ACTIVE',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM companies WHERE name = 'Test Shipper Company' AND type = 'SHIPPER'
);

-- Create carrier user if not exists
INSERT INTO users (
    id, 
    username, 
    password_hash, 
    role, 
    email, 
    first_name, 
    last_name, 
    company_id, 
    created_at, 
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'carrier1@octopustms.com',
    '{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', -- password: "password"
    'DISPATCHER', -- Using position-based role instead of CARRIER
    'carrier1@octopustms.com',
    'John',
    'Carrier',
    (SELECT id FROM companies WHERE name = 'Test Carrier Company' AND type = 'CARRIER' LIMIT 1),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'carrier1@octopustms.com'
);

-- Create shipper user if not exists
INSERT INTO users (
    id, 
    username, 
    password_hash, 
    role, 
    email, 
    first_name, 
    last_name, 
    company_id, 
    created_at, 
    updated_at
) 
SELECT 
    gen_random_uuid(),
    'shipper1@octopustms.com',
    '{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', -- password: "password"
    'SUPERVISOR', -- Using position-based role instead of SHIPPER
    'shipper1@octopustms.com',
    'Sarah',
    'Shipper',
    (SELECT id FROM companies WHERE name = 'Test Shipper Company' AND type = 'SHIPPER' LIMIT 1),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'shipper1@octopustms.com'
);