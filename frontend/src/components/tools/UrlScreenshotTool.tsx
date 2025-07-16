import React, { useState, useCallback } from 'react';
import { FeatureType } from '../../config/credit-usage';
import CreditCostBadge from '../credits/CreditCostBadge';
import { useAuth } from '../auth/AuthContext';

interface UrlScreenshotToolProps {
  onCapture: (url: string) => void;
  apiKey?: string | null;
}

const UrlScreenshotTool: React.FC<UrlScreenshotToolProps> = ({ onCapture, apiKey }) => {
  const [urlInputValue, setUrlInputValue] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleUrlCapture = useCallback(async () => {
    if (!urlInputValue.trim()) return;
    
    if (!apiKey) {
      setError("ScreenshotOne API key is required. Please add it in settings.");
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urlInputValue,
          apiKey: apiKey,
          userId: user?.id || '',
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        onCapture(data.url);
        setUrlInputValue(""); // Clear input on success
      } else {
        setError("Failed to capture screenshot. Please try again.");
      }
    } catch (err) {
      console.error("Error capturing URL:", err);
      setError("An error occurred while capturing the screenshot.");
    } finally {
      setIsCapturing(false);
    }
  }, [urlInputValue, apiKey, onCapture]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCapturing) {
      handleUrlCapture();
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Screenshot URL</h3>
            <CreditCostBadge featureType={FeatureType.URL_SCREENSHOT} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Capture any live website automatically</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to use:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter any website URL and we'll take a screenshot for you. Requires a ScreenshotOne API key.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best for:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Recreating existing websites or analyzing live designs
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <input 
            type="text" 
            value={urlInputValue}
            onChange={(e) => {
              setUrlInputValue(e.target.value);
              setError(null); // Clear error when user types
            }}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isCapturing}
          />
          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <button 
          onClick={handleUrlCapture}
          disabled={!urlInputValue.trim() || !apiKey || isCapturing}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isCapturing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Capturing...
            </>
          ) : (
            !apiKey ? "API Key Required" : "Capture Screenshot"
          )}
        </button>
        {!apiKey && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add your ScreenshotOne API key in settings to use this feature.
          </p>
        )}
      </div>
    </div>
  );
};

export default UrlScreenshotTool;