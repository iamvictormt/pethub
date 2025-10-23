-- Add ADOPTION status to pet_status enum
ALTER TYPE pet_status ADD VALUE IF NOT EXISTS 'ADOPTION';

