-- Update contributions table to support PIX payments without Stripe
-- Remove Stripe-specific columns and add PIX-specific ones

-- Add PIX-specific columns
ALTER TABLE contributions 
  ADD COLUMN IF NOT EXISTS pix_key TEXT,
  ADD COLUMN IF NOT EXISTS pix_qr_code TEXT,
  ADD COLUMN IF NOT EXISTS pix_transaction_id TEXT;

-- Make user_id nullable to allow anonymous contributions
ALTER TABLE contributions 
  ALTER COLUMN user_id DROP NOT NULL;

-- Update payment_method to default to 'pix'
ALTER TABLE contributions 
  ALTER COLUMN payment_method SET DEFAULT 'pix';

-- Drop Stripe-specific constraints if they exist
ALTER TABLE contributions 
  DROP CONSTRAINT IF EXISTS contributions_stripe_session_id_key;

-- Create index for PIX transaction lookups
CREATE INDEX IF NOT EXISTS idx_contributions_pix_transaction_id ON contributions(pix_transaction_id);

-- Update RLS policies to allow anonymous contributions
DROP POLICY IF EXISTS "Users can view own contributions" ON contributions;
DROP POLICY IF EXISTS "Anyone can view completed contributions" ON contributions;
DROP POLICY IF EXISTS "Service role can manage contributions" ON contributions;

-- New policy: Users can view their own contributions (if logged in)
CREATE POLICY "Users can view own contributions"
  ON contributions
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Anyone can view completed contributions (for public contributors list)
CREATE POLICY "Anyone can view completed contributions"
  ON contributions
  FOR SELECT
  USING (status = 'completed');

-- Policy: Anyone can insert contributions (for anonymous donations)
CREATE POLICY "Anyone can create contributions"
  ON contributions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can manage all contributions
CREATE POLICY "Service role can manage contributions"
  ON contributions
  FOR ALL
  USING (auth.role() = 'service_role');
