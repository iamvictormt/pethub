-- Add additional photo URL columns to pets table
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS photo_url_2 TEXT,
ADD COLUMN IF NOT EXISTS photo_url_3 TEXT,
ADD COLUMN IF NOT EXISTS photo_url_4 TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.pets.photo_url IS 'Primary photo URL';
COMMENT ON COLUMN public.pets.photo_url_2 IS 'Secondary photo URL';
COMMENT ON COLUMN public.pets.photo_url_3 IS 'Third photo URL';
COMMENT ON COLUMN public.pets.photo_url_4 IS 'Fourth photo URL';
