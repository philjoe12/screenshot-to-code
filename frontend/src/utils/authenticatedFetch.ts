

// /root/screenshot-to-code/frontend/src/utils/authenticatedFetch.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper function to make authenticated API calls
 * This function automatically adds the Supabase auth token to requests
 * 
 * @param url - The URL to fetch
 * @param options - Standard fetch options
 * @returns Promise<Response>
 * 
 * @example
 * const response = await authenticatedFetch('/api/auth/user/credits/123');
 * if (response.ok) {
 *   const data = await response.json();
 * }
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('No authentication session available');
  }
  
  // Merge headers with auth token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
    ...(options.headers || {})
  };
  
  // Make the fetch request with authentication
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers
  });
}

/**
 * Helper function specifically for JSON API calls
 * Automatically parses JSON responses and handles errors
 * 
 * @param url - The URL to fetch
 * @param options - Standard fetch options
 * @returns Promise<T> - The parsed JSON response
 * 
 * @example
 * const credits = await authenticatedJsonFetch<Credits>('/api/auth/user/credits/123');
 */
export async function authenticatedJsonFetch<T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

/**
 * Specific helper functions for common API operations
 */

export const authAPI = {
  // Get user credits
  async getUserCredits(userId: string) {
    return authenticatedJsonFetch(`/api/auth/user/credits/${userId}`);
  },
  
  // Use a credit
  async useCredit(data: {
    user_id: string;
    model_used: string;
    framework: string;
    input_type: string;
  }) {
    return authenticatedJsonFetch('/api/auth/user/use-credit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // Get current user
  async getCurrentUser() {
    return authenticatedJsonFetch('/api/auth/user/me');
  },
  
  // Refresh session
  async refreshSession() {
    return authenticatedJsonFetch('/api/auth/refresh', {
      method: 'POST'
    });
  }
};

// Export a hook for React components to use authenticated fetch
import { useCallback } from 'react';

export function useAuthenticatedFetch() {
  const authFetch = useCallback(async (url: string, options?: RequestInit) => {
    return authenticatedFetch(url, options);
  }, []);
  
  const authJsonFetch = useCallback(async <T = any>(url: string, options?: RequestInit) => {
    return authenticatedJsonFetch<T>(url, options);
  }, []);
  
  return {
    authFetch,
    authJsonFetch,
    authAPI
  };
}