-- Create initial test users with proper company assignments
-- Password for all users: "password" (BCrypt hash)

-- Create main broker company
INSERT INTO companies (id, name, type, status, email, phone, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Octopus Logistics',
    'BROKER',
    'ACTIVE',
    'info@octopus-tms.com',
    '555-123-4567',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create Emily Anderson (Broker Admin)
INSERT INTO users (
    id, 
    username, 
    password_hash, 
    role, 
    email, 
    first_name, 
    last_name, 
    company_id,
    status,
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    'emily.anderson@octopus-tms.com',
    '{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', -- password
    'ADMIN', -- Position-based role
    'emily.anderson@octopus-tms.com',
    'Emily',
    'Anderson',
    '550e8400-e29b-41d4-a716-446655440001'::uuid, -- Octopus Logistics
    'ACTIVE',
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;