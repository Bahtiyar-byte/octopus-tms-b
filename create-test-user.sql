-- Create a test user for development
-- Password is 'password' encrypted with bcrypt
INSERT INTO users (
    id,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    department,
    status,
    failed_login_attempts,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    'test@example.com',
    '$2a$10$ebyC4z5WtCXXc.HGDc1Yoe6CLFzcntFmfse6/pTj7CeDY5I05w16C',
    'Test',
    'User',
    '555-0123',
    'ADMIN',
    'Development',
    'ACTIVE',
    0,
    NOW(),
    NOW()
);