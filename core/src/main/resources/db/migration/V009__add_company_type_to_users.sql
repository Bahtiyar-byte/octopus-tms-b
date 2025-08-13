-- Add company_type column to users table (already added manually)
-- This migration only updates existing users with appropriate company types

-- Update test users with company types based on their email domains
UPDATE Users 
SET company_type = 'BROKER' 
WHERE email LIKE '%@octopus-tms.com' 
  AND email IN ('emily.anderson@octopus-tms.com');

UPDATE Users 
SET company_type = 'SHIPPER' 
WHERE email LIKE '%@octopustms.com' 
  AND email LIKE 'shipper%';

UPDATE Users 
SET company_type = 'CARRIER' 
WHERE email LIKE '%@octopustms.com' 
  AND email LIKE 'carrier%';

-- Set a default company_type for any remaining users without one
UPDATE Users 
SET company_type = 'BROKER' 
WHERE company_type IS NULL;