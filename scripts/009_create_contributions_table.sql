-- Create contributions table to track user contributions
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_in_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method VARCHAR(20), -- 'card' or 'pix'
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  contributor_name TEXT,
  contributor_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at DESC);

-- Enable RLS
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own contributions
CREATE POLICY "Users can view own contributions"
  ON contributions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Anyone can view completed contributions (for public contributors list)
CREATE POLICY "Anyone can view completed contributions"
  ON contributions
  FOR SELECT
  USING (status = 'completed');

-- Policy: Service role can insert/update (for webhooks)
CREATE POLICY "Service role can manage contributions"
  ON contributions
  FOR ALL
  USING (auth.role() = 'service_role');
