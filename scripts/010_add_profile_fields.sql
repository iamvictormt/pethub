-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add comment
COMMENT ON COLUMN profiles.state IS 'Brazilian state (UF)';
COMMENT ON COLUMN profiles.city IS 'City name';
COMMENT ON COLUMN profiles.bio IS 'User or petshop bio/description';
