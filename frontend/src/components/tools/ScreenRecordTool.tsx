import React from 'react';
import ScreenRecorder from '../recording/ScreenRecorder';
import { ScreenRecorderState } from '../../types/types';
import { URLS } from '../../urls';

interface ScreenRecordToolProps {
  screenRecorderState: ScreenRecorderState;
  setScreenRecorderState: (state: ScreenRecorderState) => void;
  generateCode: (images: string[], mode: "image" | "video") => void;
}

const ScreenRecordTool: React.FC<ScreenRecordToolProps> = ({
  screenRecorderState,
  setScreenRecorderState,
  generateCode,
}) => {
  return (
    <div className="h-full">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Record Screen</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Capture interactions and animations</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to use:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record your screen to capture complex interactions, hover states, and animations. Great for cloning entire app flows.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best for:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dynamic interfaces with multiple states and interactions
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ScreenRecorder
          screenRecorderState={screenRecorderState}
          setScreenRecorderState={setScreenRecorderState}
          generateCode={generateCode}
        />
        
        {screenRecorderState === ScreenRecorderState.INITIAL && (
          <>
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h5 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">Pro Tips:</h5>
              <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Record hover effects and dropdown menus</li>
                <li>• Capture form interactions and validation states</li>
                <li>• Show navigation flows between pages</li>
                <li>• Demonstrate responsive behavior</li>
              </ul>
            </div>
            <a
              className="block mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm underline text-center"
              href={URLS["intro-to-video"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about video cloning →
            </a>
          </>
        )}

        {screenRecorderState === ScreenRecorderState.RECORDING && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <p className="text-sm text-red-700 dark:text-red-300">Recording in progress...</p>
            </div>
          </div>
        )}

        {screenRecorderState === ScreenRecorderState.FINISHED && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700 dark:text-green-300">Recording completed!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenRecordTool;