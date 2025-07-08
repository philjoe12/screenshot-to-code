// Path: /root/screenshot-to-code/frontend/src/components/auth/CreditProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface CreditProtectedRouteProps {
  children: React.ReactNode;
}

const CreditProtectedRoute: React.FC<CreditProtectedRouteProps> = ({ children }) => {
  const { user, credits, loading, isLoading } = useAuth();
  
  // Use either loading or isLoading depending on which one is available in your AuthContext
  const isPageLoading = loading || isLoading;

  if (isPageLoading) {
    // Show loading spinner while checking authentication status
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  // Safely check credits with nullish coalescing and optional chaining
  const creditsRemaining = credits?.credits_remaining ?? 0;
  if (!credits || creditsRemaining <= 0) {
    // Redirect to account page if user has no credits
    return <Navigate to="/account" />;
  }

  return <>{children}</>;
};

export default CreditProtectedRoute;