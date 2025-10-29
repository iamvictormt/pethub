-- Add reward fields to pets table
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS has_reward BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reward_amount DECIMAL(10, 2);

-- Add comment for documentation
COMMENT ON COLUMN public.pets.has_reward IS 'Indicates if the pet owner is offering a reward';
COMMENT ON COLUMN public.pets.reward_amount IS 'Reward amount in BRL (between 1 and 10000)';
