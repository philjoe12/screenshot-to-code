// /root/screenshot-to-code/frontend/src/components/auth/UserCreditsPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Simulated credit packages for our mock implementation
const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 100, price: 9.99 },
  { id: 'professional', name: 'Professional', credits: 500, price: 39.99 },
  { id: 'enterprise', name: 'Enterprise', credits: 2000, price: 99.99 },
];

interface UserCreditsPageProps {}

const UserCreditsPage: React.FC<UserCreditsPageProps> = () => {
  const { user, credits, refreshCredits, isLoading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!user) return;

      setIsLoadingTransactions(true);
      try {
        // In a real app, this would be a call to Supabase
        // const { data, error } = await supabase
        //   .from('credit_transactions')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });

        // if (error) throw error;

        // Mock transaction data
        const mockTransactions = [
          {
            id: 'tx_123456',
            amount: 500,
            type: 'purchase',
            package: 'Professional',
            created_at: '2025-03-01T10:30:00Z',
            status: 'completed',
          },
          {
            id: 'tx_123455',
            amount: 50,
            type: 'usage',
            description: 'Code generation',
            created_at: '2025-02-28T15:45:00Z',
            status: 'completed',
          },
          {
            id: 'tx_123454',
            amount: 100,
            type: 'purchase',
            package: 'Starter',
            created_at: '2025-02-15T09:20:00Z',
            status: 'completed',
          },
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactionHistory();
  }, [user]);

  // Handle purchase button click
  const handlePurchase = async (packageId: string) => {
    // In a real app with Supabase, you'd create a checkout session
    // and redirect to Stripe
    
    // const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    //   body: { packageId, userId: user?.id },
    // });
    
    // if (error) {
    //   console.error('Error creating checkout session:', error);
    //   return;
    // }
    
    // window.location.href = data.url;
    
    // For our mock version, just show an alert
    alert(`In a real app, you would be redirected to Stripe to purchase the ${packageId} package`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Your Account
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Manage your credits and view your transaction history
          </p>
        </div>

        {/* Credit balance */}
        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Available Credits
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Credits are used when you generate code
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {credits?.credits_remaining || 0}
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Buy More Credits
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Credit packages */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Credit Packages
          </h2>
          <div className="mt-6 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800"
              >
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {pkg.name}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                      {pkg.credits} credits
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${pkg.price}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePurchase(pkg.id)}
                      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaction History
          </h2>
          <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            {isLoadingTransactions ? (
              <div className="p-10 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No transactions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'purchase'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {transaction.type === 'purchase' ? 'Purchase' : 'Usage'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {transaction.type === 'purchase'
                            ? `${transaction.package} Package`
                            : transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={
                              transaction.type === 'purchase'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }
                          >
                            {transaction.type === 'purchase' ? '+' : '-'}
                            {transaction.amount} credits
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Account settings */}
        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Account Settings
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>Manage your account settings and preferences.</p>
              </div>
              <div className="mt-5">
                <Link
                  to="/account/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreditsPage;