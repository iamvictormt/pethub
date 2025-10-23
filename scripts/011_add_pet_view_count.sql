-- Add view_count column to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for better performance when sorting by views
CREATE INDEX IF NOT EXISTS idx_pets_view_count ON pets(view_count DESC);

-- Update existing pets to have 0 views
UPDATE pets SET view_count = 0 WHERE view_count IS NULL;
