-- Create pricing_plans table to store centralized pricing configuration
CREATE TABLE IF NOT EXISTS pricing_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL, -- Price in cents for precise calculations
  price_dollars DECIMAL(10,2) GENERATED ALWAYS AS (price_cents::decimal / 100) STORED,
  description TEXT,
  features TEXT[], -- Array of feature strings
  is_recommended BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  stripe_price_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on active plans for faster queries
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active, sort_order);

-- Insert default pricing plans (matching current backend configuration)
INSERT INTO pricing_plans (id, name, credits, price_cents, description, features, is_recommended, stripe_price_id, sort_order) VALUES
  ('starter', 'Starter', 10, 150, 'Perfect for trying out the platform', 
   ARRAY['10 code generations', 'All frameworks supported', 'Basic support', 'Export to ZIP'], 
   FALSE, 'STRIPE_STARTER_PRICE_ID', 1),
  
  ('basic', 'Basic', 50, 750, 'Great for small projects and personal use', 
   ARRAY['50 code generations', 'All frameworks supported', 'Email support', 'Export to ZIP', 'History tracking'], 
   TRUE, 'STRIPE_BASIC_PRICE_ID', 2),
  
  ('professional', 'Professional', 200, 3000, 'Ideal for freelancers and growing businesses', 
   ARRAY['200 code generations', 'All frameworks supported', 'Priority support', 'Export to ZIP', 'History tracking', 'Advanced customization'], 
   FALSE, 'STRIPE_PROFESSIONAL_PRICE_ID', 3),
  
  ('enterprise', 'Enterprise', 1000, 15000, 'Best for agencies and professional teams', 
   ARRAY['1000 code generations', 'All frameworks supported', 'Priority support', 'Export to ZIP', 'History tracking', 'Advanced customization', 'API access', 'Custom branding'], 
   FALSE, 'STRIPE_ENTERPRISE_PRICE_ID', 4);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_pricing_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER pricing_plans_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_plans_updated_at();

-- Create configuration table for pricing constants
CREATE TABLE IF NOT EXISTS pricing_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert pricing configuration
INSERT INTO pricing_config (key, value, description) VALUES
  ('price_per_credit', '0.15', 'Base price per credit in USD'),
  ('free_credits_new_user', '2', 'Number of free credits for new users'),
  ('traditional_dev_cost', '100', 'Traditional development cost per component for comparison'),
  ('currency', '"USD"', 'Default currency for pricing');

-- Create trigger for pricing_config updated_at
CREATE TRIGGER pricing_config_updated_at
  BEFORE UPDATE ON pricing_config
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_plans_updated_at();