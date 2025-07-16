import React, { useState } from 'react';
import { Stack } from '../../lib/stacks';

interface ImportCodeToolProps {
  onImport: (code: string, stack: Stack) => void;
  defaultStack: Stack;
}

const ImportCodeTool: React.FC<ImportCodeToolProps> = ({ onImport, defaultStack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState("");
  const [selectedStack, setSelectedStack] = useState<Stack>(defaultStack);

  const handleCodeImport = () => {
    if (codeInputValue.trim()) {
      onImport(codeInputValue, selectedStack);
      setIsModalOpen(false);
      setCodeInputValue(""); // Clear after import
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Start from existing HTML/CSS</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to use:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paste your existing HTML/CSS code and convert it to your preferred framework (React, Vue, etc.).
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best for:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Migrating legacy code or refactoring existing projects
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Import Code
          </button>
        </div>

        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h5 className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">Supported Formats:</h5>
          <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
            <li>• HTML with inline styles</li>
            <li>• HTML + CSS</li>
            <li>• React components</li>
            <li>• Vue templates</li>
          </ul>
        </div>
      </div>

      {/* Import Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl transform transition-all w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Import from Code</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Framework
                    </label>
                    <select 
                      value={selectedStack}
                      onChange={(e) => setSelectedStack(e.target.value as Stack)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-zinc-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={Stack.HTML_TAILWIND}>HTML + Tailwind</option>
                      <option value={Stack.HTML_CSS}>HTML + CSS</option>
                      <option value={Stack.REACT_TAILWIND}>React + Tailwind</option>
                      <option value={Stack.VUE_TAILWIND}>Vue + Tailwind</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paste your code
                    </label>
                    <textarea 
                      value={codeInputValue}
                      onChange={(e) => setCodeInputValue(e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-zinc-700 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                      placeholder={`<div class="container">
  <h1>Hello World</h1>
  <p>Your HTML/CSS code here...</p>
</div>`}
                    ></textarea>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-zinc-900 rounded-md p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Tip:</strong> For best results, include all relevant CSS styles either inline or in a style tag.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCodeImport}
                    disabled={!codeInputValue.trim()}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Import Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportCodeTool;