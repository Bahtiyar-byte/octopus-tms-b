-- Verification script to check auth setup
-- Run this after migrations to ensure everything is correct

-- 1. Check UserRole enum values are valid
SELECT 'Checking user roles...' as status;
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role 
ORDER BY role;

-- Should NOT see: BROKER, SHIPPER, CARRIER
-- Should see: ADMIN, SUPERVISOR, DISPATCHER, DRIVER, ACCOUNTING, SALES, SUPPORT

-- 2. Check all users have companies
SELECT 'Checking users without companies...' as status;
SELECT id, username, role, company_id 
FROM users 
WHERE company_id IS NULL;

-- Should return 0 rows

-- 3. Check company types
SELECT 'Checking company distribution...' as status;
SELECT type, COUNT(*) as count 
FROM companies 
GROUP BY type 
ORDER BY type;

-- Should see: BROKER, CARRIER, SHIPPER, MULTI

-- 4. Check specific test users
SELECT 'Checking test users...' as status;
SELECT 
    u.username, 
    u.role as user_role, 
    c.name as company_name, 
    c.type as company_type
FROM users u
JOIN companies c ON u.company_id = c.id
WHERE u.username IN (
    'emily.anderson@octopus-tms.com',
    'shipper1@octopustms.com',
    'carrier1@octopustms.com'
)
ORDER BY u.username;

-- Expected:
-- emily.anderson@octopus-tms.com | ADMIN | Octopus Logistics | BROKER
-- carrier1@octopustms.com | DISPATCHER | Test Carrier Company | CARRIER  
-- shipper1@octopustms.com | SUPERVISOR | Test Shipper Company | SHIPPER

-- 5. Check for any potential issues
SELECT 'Checking for invalid enum values...' as status;
SELECT * FROM users 
WHERE role NOT IN ('ADMIN', 'SUPERVISOR', 'DISPATCHER', 'DRIVER', 'ACCOUNTING', 'SALES', 'SUPPORT');

-- Should return 0 rows