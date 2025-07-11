-- Create test carrier and shipper users
-- Password for all users: "password" (hashed with BCrypt)

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
    'CARRIER',
    'carrier1@octopustms.com',
    'John',
    'Carrier',
    (SELECT company_id FROM users WHERE username = 'emily.anderson@octopus-tms.com'), -- Use Emily's company
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
    'SHIPPER',
    'shipper1@octopustms.com',
    'Sarah',
    'Shipper',
    (SELECT company_id FROM users WHERE username = 'emily.anderson@octopus-tms.com'), -- Use Emily's company
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'shipper1@octopustms.com'
);