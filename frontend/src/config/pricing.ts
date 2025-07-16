// Centralized pricing configuration
// This should match the backend pricing in /backend/routes/payments.py

export interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number; // in dollars
  priceInCents: number; // in cents (for Stripe)
  description: string;
  features: string[];
  recommended?: boolean;
  isCustom?: boolean;
  stripePriceId?: string;
}

// Base price per credit: $0.15
export const PRICE_PER_CREDIT = 0.15;

// Free credits for new users
export const FREE_CREDITS_NEW_USER = 2;

// Credit packages - aligned with backend pricing
export const CREDIT_PACKAGES: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 1.50,
    priceInCents: 150,
    description: 'Perfect for trying out the platform',
    features: [
      '10 code generations',
      'All frameworks supported',
      'Basic support',
      'Export to ZIP'
    ],
    recommended: false,
    stripePriceId: 'STRIPE_STARTER_PRICE_ID'
  },
  {
    id: 'basic',
    name: 'Basic',
    credits: 50,
    price: 7.50,
    priceInCents: 750,
    description: 'Great for small projects and personal use',
    features: [
      '50 code generations',
      'All frameworks supported',
      'Email support',
      'Export to ZIP',
      'History tracking'
    ],
    recommended: true,
    stripePriceId: 'STRIPE_BASIC_PRICE_ID'
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 200,
    price: 30.00,
    priceInCents: 3000,
    description: 'Ideal for freelancers and growing businesses',
    features: [
      '200 code generations',
      'All frameworks supported',
      'Priority support',
      'Export to ZIP',
      'History tracking',
      'Advanced customization'
    ],
    recommended: false,
    stripePriceId: 'STRIPE_PROFESSIONAL_PRICE_ID'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 1000,
    price: 150.00,
    priceInCents: 15000,
    description: 'Best for agencies and professional teams',
    features: [
      '1000 code generations',
      'All frameworks supported',
      'Priority support',
      'Export to ZIP',
      'History tracking',
      'Advanced customization',
      'API access',
      'Custom branding'
    ],
    recommended: false,
    stripePriceId: 'STRIPE_ENTERPRISE_PRICE_ID'
  }
];

// Helper functions
export const getPlanById = (id: string): PricingPlan | undefined => {
  return CREDIT_PACKAGES.find(plan => plan.id === id);
};

export const getPricePerCredit = (plan: PricingPlan): number => {
  return plan.price / plan.credits;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

export const formatCredits = (credits: number): string => {
  return new Intl.NumberFormat('en-US').format(credits);
};

// Value proposition calculations
export const TRADITIONAL_DEVELOPMENT_COST_PER_COMPONENT = 100;
export const PIX2CODE_COST_PER_COMPONENT = PRICE_PER_CREDIT;
export const SAVINGS_PERCENTAGE = Math.round(
  ((TRADITIONAL_DEVELOPMENT_COST_PER_COMPONENT - PIX2CODE_COST_PER_COMPONENT) / 
   TRADITIONAL_DEVELOPMENT_COST_PER_COMPONENT) * 100
);