import React, { useState, useCallback } from 'react';
import { FeatureType } from '../../config/credit-usage';
import CreditCostBadge from '../credits/CreditCostBadge';

interface VideoToSceneGraphToolProps {
  onGenerateSceneGraph: (videoData: string) => void;
  isProcessing?: boolean;
}

const VideoToSceneGraphTool: React.FC<VideoToSceneGraphToolProps> = ({ 
  onGenerateSceneGraph, 
  isProcessing = false 
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [videoSize, setVideoSize] = useState<string>("");

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      // Set file info
      setVideoName(file.name);
      setVideoSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

      // Read file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setSelectedVideo(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGenerate = () => {
    if (selectedVideo) {
      onGenerateSceneGraph(selectedVideo);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('video/')
    );
    
    if (files.length > 0) {
      // Simulate file input with dropped file
      const input = document.getElementById('video-scene-upload') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      input.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const clearSelection = () => {
    setSelectedVideo(null);
    setVideoName("");
    setVideoSize("");
    // Clear the file input
    const input = document.getElementById('video-scene-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zM9 19V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video to Scene Graph</h3>
            <CreditCostBadge featureType={FeatureType.VIDEO_TO_SCENE_GRAPH} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Extract scene structure from video content</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          Experimental
        </span>
      </div>
      
      <div className="space-y-4">
        {!selectedVideo ? (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="video/mp4,video/quicktime,video/webm,video/*" 
              className="hidden" 
              id="video-scene-upload" 
              onChange={handleFileInput} 
            />
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" transform="scale(2)" />
            </svg>
            <label 
              htmlFor="video-scene-upload"
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="text-cyan-600 dark:text-cyan-400 hover:underline">Choose a video</span> or drag it here
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              MP4, MOV, WebM up to 100MB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{videoName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{videoSize}</p>
                  </div>
                </div>
                <button
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Video...
                </>
              ) : (
                'Generate Scene Graph'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
          <h5 className="text-xs font-medium text-cyan-900 dark:text-cyan-100 mb-1">What is a Scene Graph?</h5>
          <p className="text-xs text-cyan-700 dark:text-cyan-300">
            A scene graph breaks down your video into a structured representation of UI elements, their relationships, and transitions over time.
          </p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Use Cases:</h5>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
            <li>• Analyze UI flow and navigation patterns</li>
            <li>• Extract component hierarchy</li>
            <li>• Understand state transitions</li>
            <li>• Generate documentation from demos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoToSceneGraphTool;