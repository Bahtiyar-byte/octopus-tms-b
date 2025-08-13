-- Ensure all users have proper company assignments
-- This is critical for the new company-based authentication

-- Create a default broker company if Emily Anderson exists but has no company
INSERT INTO companies (id, name, type, status, created_at, updated_at)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Octopus Logistics',
    'BROKER',
    'ACTIVE',
    NOW(),
    NOW()
WHERE EXISTS (
    SELECT 1 FROM users 
    WHERE username = 'emily.anderson@octopus-tms.com' 
    AND company_id IS NULL
)
AND NOT EXISTS (
    SELECT 1 FROM companies WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- Update Emily Anderson to have the broker company
UPDATE users 
SET company_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
WHERE username = 'emily.anderson@octopus-tms.com' 
AND company_id IS NULL;

-- Ensure test users have their companies (from V008 migration)
UPDATE users u
SET company_id = c.id
FROM companies c
WHERE u.username = 'carrier1@octopustms.com'
AND c.name = 'Test Carrier Company'
AND c.type = 'CARRIER'
AND u.company_id IS NULL;

UPDATE users u
SET company_id = c.id
FROM companies c
WHERE u.username = 'shipper1@octopustms.com'
AND c.name = 'Test Shipper Company'
AND c.type = 'SHIPPER'
AND u.company_id IS NULL;

-- For any remaining users without companies, create appropriate companies based on their role
-- This handles legacy data that might exist
DO $$
DECLARE
    user_rec RECORD;
    new_company_id UUID;
    company_type_val VARCHAR(50);
BEGIN
    FOR user_rec IN 
        SELECT id, username, email, role 
        FROM users 
        WHERE company_id IS NULL
    LOOP
        -- Determine company type based on role (before migration)
        -- or based on email domain
        CASE 
            WHEN user_rec.role IN ('ADMIN', 'SUPERVISOR') THEN
                company_type_val := 'BROKER';
            WHEN user_rec.role = 'DISPATCHER' THEN
                company_type_val := 'CARRIER';
            WHEN user_rec.role = 'DRIVER' THEN
                company_type_val := 'CARRIER';
            ELSE
                company_type_val := 'MULTI'; -- Default for unclear cases
        END CASE;
        
        -- Generate new company ID
        new_company_id := gen_random_uuid();
        
        -- Create company for this user
        INSERT INTO companies (id, name, type, status, created_at, updated_at)
        VALUES (
            new_company_id,
            'Company for ' || user_rec.email,
            company_type_val,
            'ACTIVE',
            NOW(),
            NOW()
        );
        
        -- Update user with company
        UPDATE users 
        SET company_id = new_company_id
        WHERE id = user_rec.id;
        
        RAISE NOTICE 'Created % company for user %', company_type_val, user_rec.email;
    END LOOP;
END $$;

-- Final verification
DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM users 
    WHERE company_id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE EXCEPTION 'Migration failed: % users still have no company', orphan_count;
    END IF;
    
    RAISE NOTICE 'All users now have company assignments!';
END $$;