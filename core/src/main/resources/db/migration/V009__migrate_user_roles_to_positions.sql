-- Migrate existing users from business roles to position-based roles
-- This migration MUST run before the application starts with the new UserRole enum

-- First, let's see what we're dealing with
DO $$
BEGIN
    RAISE NOTICE 'Starting role migration...';
    
    -- Log current role distribution
    RAISE NOTICE 'Current role distribution:';
    FOR r IN 
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role 
        ORDER BY role
    LOOP
        RAISE NOTICE '  Role: %, Count: %', r.role, r.count;
    END LOOP;
END $$;

-- Update BROKER users to SUPERVISOR (or ADMIN based on their position)
UPDATE users 
SET role = 'SUPERVISOR'
WHERE role = 'BROKER'
AND NOT EXISTS (
    SELECT 1 FROM users WHERE role = 'BROKER' AND username LIKE '%admin%'
);

-- Update admin brokers to ADMIN
UPDATE users 
SET role = 'ADMIN'
WHERE role = 'BROKER'
AND username LIKE '%admin%';

-- Update SHIPPER users to SUPERVISOR
UPDATE users 
SET role = 'SUPERVISOR'
WHERE role = 'SHIPPER';

-- Update CARRIER users to DISPATCHER (carriers typically dispatch loads)
UPDATE users 
SET role = 'DISPATCHER'
WHERE role = 'CARRIER';

-- Verify no old roles remain
DO $$
DECLARE
    bad_roles_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO bad_roles_count
    FROM users 
    WHERE role IN ('BROKER', 'SHIPPER', 'CARRIER');
    
    IF bad_roles_count > 0 THEN
        RAISE EXCEPTION 'Migration failed: % users still have old roles', bad_roles_count;
    END IF;
    
    RAISE NOTICE 'Migration completed successfully!';
    
    -- Log new role distribution
    RAISE NOTICE 'New role distribution:';
    FOR r IN 
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role 
        ORDER BY role
    LOOP
        RAISE NOTICE '  Role: %, Count: %', r.role, r.count;
    END LOOP;
END $$;