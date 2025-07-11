-- Create test carrier and shipper users
-- Password for all users: "password" (hashed with BCrypt)

-- Create carrier user
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
) VALUES (
    gen_random_uuid(),
    'carrier1@octopustms.com',
    '$2a$10$X8kAIJquKnSLazQWlsLHKOx6D4bsWEjL6EAiUEfYKCMJpM.uYfqOy', -- password: "password"
    'CARRIER',
    'carrier1@octopustms.com',
    'John',
    'Carrier',
    '650e8400-e29b-41d4-a716-446655440003', -- Existing company ID from seed data
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Create shipper user
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
) VALUES (
    gen_random_uuid(),
    'shipper1@octopustms.com',
    '$2a$10$X8kAIJquKnSLazQWlsLHKOx6D4bsWEjL6EAiUEfYKCMJpM.uYfqOy', -- password: "password"
    'SHIPPER',
    'shipper1@octopustms.com',
    'Sarah',
    'Shipper',
    '650e8400-e29b-41d4-a716-446655440001', -- Existing company ID from seed data
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Verify users were created
SELECT username, role, first_name, last_name FROM users WHERE role IN ('BROKER', 'CARRIER', 'SHIPPER');