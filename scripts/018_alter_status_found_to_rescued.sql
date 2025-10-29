-- Add expiration_date column for SIGHTED pets
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS expiration_date timestamptz;

-- Migrate existing FOUND pets to RESCUED (safer default - assume they have the pet)
UPDATE public.pets SET status = 'RESCUED' WHERE status = 'FOUND';

-- Create index for expiration queries
CREATE INDEX IF NOT EXISTS idx_pets_expiration ON public.pets(expiration_date) WHERE expiration_date IS NOT NULL;

-- Add comment explaining the statuses
COMMENT ON TYPE pet_status IS 'Pet status: LOST (owner lost pet), SIGHTED (someone saw pet, expires in 7 days), RESCUED (someone has pet in custody), ADOPTION (available for adoption), REUNITED (pet returned to owner)';
