// /frontend/src/components/auth/PaymentSuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    plan: string;
    credits: number;
  } | null>(null);
  
  const { refreshCredits } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        // Verify the payment session with the backend
        const response = await fetch('/payments/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Payment verification failed');
        }

        const data = await response.json();
        
        // Extract subscription details from the response
        if (data.success) {
          let planName = 'Unknown';
          let creditAmount = 0;
          
          // Determine the plan details based on the metadata
          switch(data.session?.metadata?.planId) {
            case 'starter':
              planName = 'Starter';
              creditAmount = 25;
              break;
            case 'professional':
              planName = 'Professional';
              creditAmount = 100;
              break;
            case 'enterprise':
              planName = 'Enterprise';
              creditAmount = 500;
              break;
          }
          
          setSubscriptionDetails({
            plan: planName,
            credits: creditAmount
          });
        }

        // Refresh the user's credits information
        await refreshCredits();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshCredits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Processing Payment</h3>
              <p className="mt-1 text-sm text-gray-500">Please wait while we verify your payment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Verification Failed</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Link
                  to="/account"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Successful!</h3>
            
            {subscriptionDetails && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  You have successfully subscribed to the <span className="font-medium text-gray-800">{subscriptionDetails.plan}</span> plan.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {subscriptionDetails.credits} credits have been added to your account.
                </p>
              </div>
            )}
            
            <div className="mt-8 flex space-x-4">
              <Link
                to="/account"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Account
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Using Your Credits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;