import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { HTTP_BACKEND_URL } from '../config';

interface CreditSummary {
  credits_remaining: number;
  credits_used: number;
  total_credits_purchased: number;
  plan: string;
  last_usage_date?: string;
  usage_this_month: number;
  available_features: string[];
}

interface CreditAnalytics {
  total_credits_used: number;
  usage_by_feature: Record<string, {
    count: number;
    total_credits: number;
    percentage: number;
  }>;
  monthly_usage: Record<string, number>;
  most_used_feature?: string;
}

export const useCreditUsage = () => {
  const { user } = useAuth();
  const [creditSummary, setCreditSummary] = useState<CreditSummary | null>(null);
  const [creditAnalytics, setCreditAnalytics] = useState<CreditAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditSummary = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/credit-usage/user/${user.id}/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch credit summary');
      }
      
      const data = await response.json();
      setCreditSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching credit summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditAnalytics = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/credit-usage/user/${user.id}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch credit analytics');
      }
      
      const data = await response.json();
      setCreditAnalytics(data.analytics);
    } catch (err) {
      console.error('Error fetching credit analytics:', err);
    }
  };

  const calculateFeatureCost = async (
    featureType: string,
    options?: {
      priority?: boolean;
      file_size_mb?: number;
      framework?: string;
      is_iteration?: boolean;
    }
  ) => {
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/credit-usage/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          feature_type: featureType,
          ...options,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate credit cost');
      }
      
      const data = await response.json();
      return data.calculated_cost;
    } catch (err) {
      console.error('Error calculating credit cost:', err);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCreditSummary();
      fetchCreditAnalytics();
    }
  }, [user?.id]);

  return {
    creditSummary,
    creditAnalytics,
    isLoading,
    error,
    refetch: fetchCreditSummary,
    calculateFeatureCost,
  };
};