// /frontend/src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;  // Add this prop to the interface
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = true  // Default to true
}) => {
  const { user, isLoading, resendVerificationEmail } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading spinner while checking authentication status
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    // Save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && user.email_confirmed_at === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've sent a verification email to <strong>{user.email}</strong>. 
              Please check your inbox and click the verification link to continue.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                I've Verified My Email
              </button>
              <button
                onClick={async () => {
                  const result = await resendVerificationEmail();
                  if (result.success) {
                    alert('Verification email resent! Please check your inbox.');
                  } else {
                    alert(`Error: ${result.error || 'Failed to resend email'}`);
                  }
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Resend Verification Email
              </button>
              <Link
                to="/account"
                className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Go to Account Settings
              </Link>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the email? Check your spam folder or contact{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              support
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;