-- Update Brandon Moore to have ADMIN role
UPDATE users 
SET role = 'ADMIN',
    updated_at = NOW()
WHERE username = 'brandon.moore@octopus-tms.com';

-- Add company_type to brandon if missing
UPDATE users 
SET company_type = 'BROKER',
    updated_at = NOW()
WHERE username = 'brandon.moore@octopus-tms.com' 
AND company_type IS NULL;