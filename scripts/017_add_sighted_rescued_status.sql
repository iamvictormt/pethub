-- Add SIGHTED and RESCUED statuses to replace FOUND
-- SIGHTED: Someone saw the pet but didn't rescue it (expires in 7 days)
-- RESCUED: Someone rescued the pet and has it in custody

-- Add new statuses to enum
ALTER TYPE pet_status ADD VALUE IF NOT EXISTS 'SIGHTED';
ALTER TYPE pet_status ADD VALUE IF NOT EXISTS 'RESCUED';

