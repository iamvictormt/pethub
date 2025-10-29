-- Add Mercado Pago payment tracking fields to contributions table
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'mercadopago',
ADD COLUMN IF NOT EXISTS payment_data JSONB;

-- Add index for faster payment_id lookups
CREATE INDEX IF NOT EXISTS idx_contributions_payment_id ON contributions(payment_id);

-- Update RLS policies to allow webhook updates
CREATE POLICY "Allow webhook updates" ON contributions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
