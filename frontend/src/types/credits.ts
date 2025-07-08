// /frontend/src/types/credits.ts

export interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_used: number;
  plan: PlanType;
  last_purchase_date?: string;
  last_used_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversionHistory {
  id: string;
  user_id: string;
  model_used: string;
  framework: string;
  input_type: 'image' | 'video';
  created_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  amount: number;
  credits_purchased: number;
  plan: PlanType;
  stripe_session_id?: string;
  payment_date: string;
  status: TransactionStatus;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'usage';
  amount: number;
  created_at: string;
  status: TransactionStatus;
  description: string;
  package?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  price_per_credit: number;
  description: string;
  popular?: boolean;
}

export interface PricingResponse {
  plans: PricingPlan[];
  currency: string;
  price_per_credit: number;
}

export interface CreditCheckResponse {
  has_credits: boolean;
  credits_remaining: number;
  message: string;
}

export interface UseCreditResponse {
  success: boolean;
  credits_remaining: number;
  message: string;
}

export interface CheckoutSessionRequest {
  userId: string;
  planId: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  message?: string;
}

export type PlanType = 'free' | 'starter' | 'basic' | 'professional' | 'enterprise';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// WebSocket message types for credit updates
export interface CreditUpdateMessage {
  type: 'credits';
  value: number;
  variantIndex?: number;
}

// Extended auth types to include credits
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface Credits {
  credits_remaining: number;
  total_credits_purchased?: number;
  last_updated?: string;
}

// Stripe types
declare global {
  interface Window {
    Stripe?: any;
  }
}