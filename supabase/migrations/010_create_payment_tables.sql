-- Migration: Payment & Subscription System
-- Description: Stripe integration for Pro subscriptions

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe/Payment Gateway IDs
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  
  -- Subscription Details
  plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due', 'incomplete')),
  
  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Dates
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Auto-renewal
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id) -- One active subscription per user
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- ============================================
-- PAYMENTS TABLE (Payment History)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Payment Gateway Info
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded', 'cancelled')),
  
  -- Invoice
  invoice_url TEXT,
  receipt_url TEXT,
  
  -- Metadata
  payment_method TEXT, -- card, upi, net_banking, etc.
  description TEXT,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

-- ============================================
-- PRICING PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT NOT NULL CHECK (billing_period IN ('month', 'year', 'lifetime')),
  
  -- Stripe Product IDs
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  
  -- Features
  features JSONB DEFAULT '[]',
  
  -- Trial
  trial_days INTEGER DEFAULT 0,
  
  -- Discount
  discount_percentage INTEGER DEFAULT 0,
  original_price DECIMAL(10,2),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_name ON pricing_plans(name);

-- Seed initial plans
INSERT INTO pricing_plans (name, display_name, price, currency, billing_period, trial_days, features, is_popular, sort_order)
VALUES 
  (
    'monthly', 
    'Monthly Pro', 
    9.99, 
    'USD', 
    'month', 
    7, 
    '["Unlimited audiobooks", "Offline downloads", "HD audio quality (320kbps)", "Ad-free experience", "Early access to new books", "Cancel anytime"]'::jsonb,
    false,
    1
  ),
  (
    'yearly', 
    'Yearly Pro', 
    99.99, 
    'USD', 
    'year', 
    14, 
    '["Unlimited audiobooks", "Offline downloads", "HD audio quality (320kbps)", "Ad-free experience", "Early access to new books", "Save 17%", "Priority support", "Exclusive content"]'::jsonb,
    true,
    2
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- UPDATE BOOKS TABLE (Add premium flag)
-- ============================================
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Create index for premium books
CREATE INDEX IF NOT EXISTS idx_books_premium ON books(is_premium);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update subscriptions updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update pricing_plans updated_at
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Sync Profile Plan with Subscription
-- ============================================
CREATE OR REPLACE FUNCTION sync_profile_plan_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription becomes active, upgrade profile to premium
  IF NEW.status = 'active' OR NEW.status = 'trial' THEN
    UPDATE profiles
    SET plan = 'premium'
    WHERE id = NEW.user_id;
  
  -- When subscription is cancelled/expired/past_due, downgrade to free
  ELSIF NEW.status IN ('cancelled', 'expired', 'past_due') THEN
    UPDATE profiles
    SET plan = 'free'
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-sync profile plan
DROP TRIGGER IF EXISTS sync_profile_on_subscription_change ON subscriptions;
CREATE TRIGGER sync_profile_on_subscription_change
  AFTER INSERT OR UPDATE OF status ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_plan_from_subscription();

-- ============================================
-- FUNCTION: Check Expired Subscriptions (Run daily via cron)
-- ============================================
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  -- Mark subscriptions as expired if period ended and not renewed
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status = 'active'
    AND current_period_end < NOW()
    AND cancel_at_period_end = true;
  
  -- Downgrade users with expired subscriptions
  UPDATE profiles
  SET plan = 'free'
  WHERE id IN (
    SELECT user_id 
    FROM subscriptions 
    WHERE status = 'expired'
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments Policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Pricing Plans Policies (Public read)
CREATE POLICY "Anyone can view active pricing plans" ON pricing_plans
  FOR SELECT USING (is_active = true);

-- ============================================
-- VIEWS
-- ============================================

-- View: Active Subscribers
CREATE OR REPLACE VIEW active_subscribers AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  s.plan_name,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.trial_ends_at,
  s.amount,
  s.currency
FROM profiles p
JOIN subscriptions s ON p.id = s.user_id
WHERE s.status IN ('active', 'trial')
ORDER BY s.created_at DESC;

-- View: Revenue Stats
CREATE OR REPLACE VIEW revenue_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as payment_count,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_revenue,
  COUNT(DISTINCT user_id) as unique_customers
FROM payments
WHERE status = 'succeeded'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- View: Subscription Stats
CREATE OR REPLACE VIEW subscription_stats AS
SELECT 
  plan_name,
  status,
  COUNT(*) as subscriber_count,
  SUM(amount) as mrr, -- Monthly Recurring Revenue
  AVG(amount) as avg_price
FROM subscriptions
WHERE status IN ('active', 'trial')
GROUP BY plan_name, status;

-- ============================================
-- COMMENTS (Documentation)
-- ============================================
COMMENT ON TABLE subscriptions IS 'User subscription records linked to Stripe';
COMMENT ON TABLE payments IS 'Payment transaction history';
COMMENT ON TABLE pricing_plans IS 'Available subscription plans and pricing';
COMMENT ON COLUMN books.is_premium IS 'Flag to restrict book to premium users only';
COMMENT ON FUNCTION check_expired_subscriptions() IS 'Run daily to expire subscriptions and downgrade users';


