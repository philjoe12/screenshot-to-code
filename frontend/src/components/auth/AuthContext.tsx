// /root/screenshot-to-code/frontend/src/components/auth/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// We’ll call backend routes via a relative “/api” prefix to respect CSP
const BACKEND_BASE = '/api/auth';

// Initialize Supabase client if credentials are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if both credentials are provided
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Persist session in localStorage under Supabase’s default key
        persistSession: true,
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Log warning if Supabase is not configured
if (!supabase) {
  console.warn(
    'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'in your environment variables to enable authentication.'
  );
}

// Define the User type with email verification
export interface User {
  id: string;
  email: string;
  name?: string;
  email_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Define the Credits type
export interface Credits {
  credits_remaining: number;
  credits_used?: number;
  total_credits_purchased?: number;
  last_updated?: string;
  plan?: string;
}

// Define result type for auth operations
export interface AuthResult {
  success: boolean;
  error?: string;
  requiresEmailVerification?: boolean;
}

// Define the Authentication Context type with ALL required properties
export interface AuthContextType {
  user: User | null;
  credits: Credits | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading for backward compatibility
  session: Session | null;
  // Authentication functions
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  refreshCredits: () => Promise<void>;
  resendVerificationEmail: () => Promise<AuthResult>;
  // Aliases for backward compatibility
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateCredits: () => Promise<void>;
}

// Create the context with comprehensive default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  credits: null,
  isLoading: true,
  loading: true,
  session: null,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  resetPassword: async () => ({ success: false }),
  refreshCredits: async () => {},
  resendVerificationEmail: async () => ({ success: false }),
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  updateCredits: async () => {}
});

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: always retrieve the latest session directly from Supabase
  const getCurrentSession = async (): Promise<Session | null> => {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error retrieving session from Supabase:", error);
      return null;
    }
    return session;
  };

  // Helper function to make authenticated API calls
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    // Retrieve the current session directly from Supabase
    const currentSession = await getCurrentSession();
    if (!currentSession) {
      throw new Error("No authentication session available");
    }

    // Merge headers with auth token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentSession.access_token}`,
      ...(options.headers || {})
    };

    return fetch(url, {
      ...options,
      credentials: 'include',
      headers
    });
  };

  // Initialize auth state on mount
  useEffect(() => {
    console.log("AuthProvider mounted");
    checkAuth();

    if (supabase) {
      // Listen for any changes in auth state (sign-in, sign-out, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: string, newSession) => {
          console.log("Auth state changed:", event);

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (newSession?.user) {
              await handleUserSession(newSession);
            }
          } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            handleSignOut();
          }
        }
      );

      return () => {
        subscription.unsubscribe();
        console.log("AuthProvider unmounted");
      };
    }
  }, []);

  // Handle signing out locally
  const handleSignOut = () => {
    setUser(null);
    setCredits(null);
    setSession(null);
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      // Supabase uses "supabase.auth.token" by default; no need for a custom key here
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    }
  };

  // After successful sign-in (or token refresh), update local state and fetch credits
  const handleUserSession = async (supabaseSession: Session) => {
    try {
      const supabaseUser = supabaseSession.user as SupabaseUser;
      const newUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name,
        email_confirmed_at: supabaseUser.email_confirmed_at,
        created_at: supabaseUser.created_at,
        updated_at: supabaseUser.updated_at
      };

      setUser(newUser);
      setSession(supabaseSession);
      await fetchUserCredits(newUser.id);
    } catch (error) {
      console.error('Error handling user session:', error);
      handleSignOut();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
  };

  // On component mount, check if there’s an existing session
  const checkAuth = async () => {
    try {
      console.log("Checking auth status...");
      setIsLoading(true);

      if (!supabase) {
        console.log("Supabase not configured - no authentication available");
        handleSignOut();
        return;
      }

      const currentSession = await getCurrentSession();
      if (currentSession?.user) {
        console.log("User session found");
        try {
          await handleUserSession(currentSession);
        } catch (err) {
          console.error("Session validation failed:", err);
          handleSignOut();
          await supabase.auth.signOut();
        }
      } else {
        console.log("No user session found");
        handleSignOut();
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      handleSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user credits from your backend
  const fetchUserCredits = async (userId: string) => {
    try {
      console.log(`Fetching credits for user ${userId}`);
      const response = await authenticatedFetch(`${BACKEND_BASE}/user/credits/${userId}`);

      if (response.ok) {
        const data = await response.json();
        setCredits({
          credits_remaining: data.credits_remaining || 0,
          credits_used: data.credits_used || 0,
          total_credits_purchased: data.total_credits_purchased,
          plan: data.plan || 'free',
          last_updated: new Date().toISOString()
        });
        console.log("Credits fetched successfully:", data);
      } else if (response.status === 401) {
        console.error("Unauthorized when fetching credits - clearing session");
        handleSignOut();
        if (supabase) await supabase.auth.signOut();
      } else {
        console.error("Failed to fetch credits:", response.status);
        setCredits({ credits_remaining: 0 });
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
      setCredits({ credits_remaining: 0 });
    }
  };

  // Sign In function - Option 1 flow
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    console.log(`Signing in user with email ${email}`);

    if (!supabase) {
      return {
        success: false,
        error: 'Authentication is not configured. Please contact support.'
      };
    }

    setIsLoading(true);

    try {
      // 1) Sign in via Supabase JS on the client
      await supabase.auth.signOut(); // ensure any old session is cleared
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (supabaseError) {
        console.error("Supabase sign-in error:", supabaseError);
        return { success: false, error: supabaseError.message };
      }
      if (!data.session) {
        return { success: false, error: 'Failed to obtain Supabase session' };
      }

      // 2) Immediately inform our backend so it can set an HTTP-only cookie
      const backendResponse = await fetch(`${BACKEND_BASE}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ensure Set-Cookie is honored
        body: JSON.stringify({ email, password })
      });

      if (!backendResponse.ok) {
        const body = await backendResponse.json().catch(() => null);
        const msg = body?.detail || 'Backend sign-in failed';
        console.error("Backend sign-in error:", msg);
        // Even if backend fails, sign out Supabase to keep states in sync
        await supabase.auth.signOut();
        return { success: false, error: msg };
      }

      // 3) Now that backend has set sb-auth-token, update local React state
      await handleUserSession(data.session);
      console.log("Sign in successful");
      return { success: true };
    } catch (err) {
      console.error('Sign in error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An error occurred during sign in'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up function
  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    console.log(`Signing up user with email ${email}`);

    if (!supabase) {
      return {
        success: false,
        error: 'Authentication is not configured. Please contact support.'
      };
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Sign up successful - verification email sent");
        return {
          success: true,
          requiresEmailVerification: true
        };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (err) {
      console.error('Sign up error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An error occurred during sign up'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out function
  const signOut = async () => {
    console.log("Signing out user");
    setIsLoading(true);

    try {
      // 1) Sign out from Supabase client
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Supabase sign out error:", error);
      }

      // 2) Notify backend so it can clear the HTTP-only cookie
      await fetch(`${BACKEND_BASE}/signout`, {
        method: 'POST',
        credentials: 'include'
      }).catch(err => console.error('Backend signout error:', err));

      handleSignOut();
      console.log("Sign out successful");
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Error signing out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password function
  const resetPassword = async (email: string): Promise<AuthResult> => {
    console.log(`Resetting password for email ${email}`);

    if (!supabase) {
      return {
        success: false,
        error: 'Authentication is not configured. Please contact support.'
      };
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error("Reset password error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to send reset email'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (): Promise<AuthResult> => {
    if (!user?.email) {
      return { success: false, error: 'No user email found' };
    }

    if (!supabase) {
      return {
        success: false,
        error: 'Authentication is not configured. Please contact support.'
      };
    }

    console.log(`Resending verification email to ${user.email}`);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`
        }
      });

      if (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Resend verification error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to resend verification email'
      };
    }
  };

  // Refresh Credits function
  const refreshCredits = async () => {
    if (!user) {
      console.log("Cannot refresh credits - no user logged in");
      return;
    }
    await fetchUserCredits(user.id);
  };

  // Provide both the new and old function names for backward compatibility
  const value: AuthContextType = {
    user,
    credits,
    isLoading,
    loading: isLoading, // Alias
    session,
    // New function names
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshCredits,
    resendVerificationEmail,
    // Old function names as aliases
    login: signIn,
    signup: signUp,
    logout: signOut,
    updateCredits: refreshCredits
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
