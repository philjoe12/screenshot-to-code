// /frontend/src/components/UserCreditsDisplay.tsx
import React from 'react';
import { useAuth } from './auth/AuthContext';
import { Link } from 'react-router-dom';

const UserCreditsDisplay: React.FC = () => {
  const { credits, user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-2 bg-white shadow-sm">
      <div className="text-sm font-medium">
        <span className="text-gray-500">Credits: </span>
        <span className={`font-bold ${credits?.credits_remaining === 0 ? 'text-red-500' : 'text-blue-600'}`}>
          {credits?.credits_remaining || 0}
        </span>
      </div>
      
      {credits?.credits_remaining === 0 && (
        <Link 
          to="/account" 
          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Buy Credits
        </Link>
      )}
      
      <Link 
        to="/account" 
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Account
      </Link>
    </div>
  );
};

export default UserCreditsDisplay;