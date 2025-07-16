// /frontend/src/components/start-pane/StartPane.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings } from "../../types/types";
import { Stack } from "../../lib/stacks";
import { ScreenRecorderState } from "../../types/types";
import { useAuth } from "../auth/AuthContext";
import { IS_RUNNING_ON_CLOUD } from "../../config";
import { 
  UploadTool, 
  UrlScreenshotTool, 
  ScreenRecordTool, 
  ImportCodeTool,
  UrlToVideoTool,
  ImagesToVideoTool,
  VideoToSceneGraphTool
} from "../tools";
import { FeatureType, CREDIT_USAGE, getCreditCost } from "../../config/credit-usage";

interface StartPaneProps {
  doCreate: (referenceImages: string[], inputMode: "image" | "video") => void;
  importFromCode: (code: string, stack: Stack) => void;
  settings: Settings;
  children?: React.ReactNode;
}

const StartPane: React.FC<StartPaneProps> = ({ doCreate, importFromCode, settings, children }) => {
  const [dragActive, setDragActive] = useState(false);
  const [screenRecorderState, setScreenRecorderState] = useState<ScreenRecorderState>(ScreenRecorderState.INITIAL);
  const [selectedTab, setSelectedTab] = useState<"start" | "tools" | "experimental" | "examples">("start");
  
  // Get authentication state
  const { user, isLoading, credits } = useAuth();
  const navigate = useNavigate();

  // Check authentication on mount and when auth state changes
  useEffect(() => {
    if (!isLoading && !user && IS_RUNNING_ON_CLOUD) {
      console.log("User not authenticated, redirecting to signup");
      navigate('/signup');
    }
  }, [user, isLoading, navigate]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const isVideo = file.type.startsWith("video/");
          doCreate([event.target.result], isVideo ? "video" : "image");
        }
      };
      reader.readAsDataURL(file);
    }
  }, [doCreate, user, navigate]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const isVideo = file.type.startsWith("video/");
          doCreate([event.target.result], isVideo ? "video" : "image");
        }
      };
      reader.readAsDataURL(file);
    }
  }, [doCreate, user, navigate]);

  const handleUrlCapture = useCallback(async (url: string) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    doCreate([url], "image");
  }, [doCreate, user, navigate]);

  const handleCodeImport = useCallback((code: string, stack: Stack) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    importFromCode(code, stack);
  }, [importFromCode, user, navigate]);

  const handleFileSelect = useCallback((dataUrl: string, isVideo: boolean) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    doCreate([dataUrl], isVideo ? "video" : "image");
  }, [doCreate, user, navigate]);

  // Experimental feature handlers
  const handleUrlToVideo = useCallback((url: string) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    console.log('Generate video from URL:', url);
    // TODO: Implement URL to video functionality
  }, [user, navigate]);

  const handleImagesToVideo = useCallback((images: string[]) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    console.log('Create video from images:', images.length);
    // TODO: Implement images to video functionality
  }, [user, navigate]);

  const handleVideoToSceneGraph = useCallback((videoData: string) => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    console.log('Generate scene graph from video');
    // TODO: Implement video to scene graph functionality
  }, [user, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated and running on cloud, redirect
  if (!user && IS_RUNNING_ON_CLOUD) {
    return null; // Will redirect in useEffect
  }

  // Example use cases
  const useCases = [
    {
      title: "Landing Pages",
      description: "Convert mockups to responsive landing pages",
      icon: "🎨",
      color: "blue"
    },
    {
      title: "Dashboard UIs",
      description: "Transform complex dashboard designs to code",
      icon: "📊",
      color: "purple"
    },
    {
      title: "E-commerce",
      description: "Build product pages from screenshots",
      icon: "🛒",
      color: "green"
    },
    {
      title: "Clone Apps",
      description: "Recreate existing app interfaces",
      icon: "📱",
      color: "orange"
    }
  ];


  // Main component content
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Turn Designs Into Code, Instantly
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload any design and get production-ready code in React, Vue, HTML, and more. 
            Perfect for developers and designers who want to ship faster.
          </p>
          {IS_RUNNING_ON_CLOUD && user && credits && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              {credits.credits_remaining} credits available
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab("start")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTab === "start"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Quick Start
            </button>
            <button
              onClick={() => setSelectedTab("tools")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTab === "tools"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => setSelectedTab("experimental")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTab === "experimental"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center">
                Advanced
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Beta
                </span>
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("examples")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTab === "examples"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Use Cases
            </button>
          </div>
        </div>

        {/* Quick Start Tab */}
        {selectedTab === "start" && (
          <div className="space-y-8">
            {/* Main Upload Area */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl">
                <div 
                  className={`p-12 text-center transition-all duration-200 ${
                    dragActive ? "bg-blue-50 dark:bg-blue-900/20 scale-[0.99]" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Drop your design here
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        or click to browse • Supports images, screenshots, and videos
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input 
                          type="file" 
                          accept="image/*,video/mp4,video/quicktime,video/webm" 
                          className="hidden" 
                          id="file-upload" 
                          onChange={handleFileInput} 
                        />
                        <button 
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Choose File
                        </button>
                        <button 
                          onClick={() => setSelectedTab("tools")}
                          className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          More Options
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">First time?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Try uploading a screenshot of any website or app
                    </p>
                    <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      View tutorial →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Pro tip</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Use videos to capture hover states and animations
                    </p>
                    <button 
                      onClick={() => setSelectedTab("tools")}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Try screen recording →
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💡</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Need help?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Check out common use cases and examples
                    </p>
                    <button 
                      onClick={() => setSelectedTab("examples")}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Browse examples →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Advanced Features
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Beta
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Explore cutting-edge video creation and analysis tools
                    </p>
                    <button 
                      onClick={() => setSelectedTab("experimental")}
                      className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline font-medium"
                    >
                      Try advanced features →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Tools Tab */}
        {selectedTab === "tools" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <UploadTool 
                    onFileSelect={handleFileSelect}
                    dragActive={dragActive}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <UrlScreenshotTool 
                    onCapture={handleUrlCapture}
                    apiKey={settings.screenshotOneApiKey}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <ScreenRecordTool 
                    screenRecorderState={screenRecorderState}
                    setScreenRecorderState={setScreenRecorderState}
                    generateCode={(images, mode) => doCreate(images, mode)}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <ImportCodeTool 
                    onImport={handleCodeImport}
                    defaultStack={settings.generatedCodeConfig}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Experimental Features Tab */}
        {selectedTab === "experimental" && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Advanced Features</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Cutting-edge tools that push the boundaries of AI-powered development. These features are experimental and may have limited availability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Beta Version
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      AI-Powered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Case Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Video Creation</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Transform static content into dynamic video presentations and walkthroughs.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Website walkthrough videos</li>
                  <li>• Image sequence animations</li>
                  <li>• Product demo generation</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Scene Analysis</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Extract detailed structural information from video content for analysis and documentation.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• UI component mapping</li>
                  <li>• Interaction flow analysis</li>
                  <li>• State transition tracking</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v4a1 1 0 01-1 1h-4v4a1 1 0 01-1 1H8a1 1 0 01-1-1v-4H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Automated Workflows</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Streamline complex processes with AI-powered automation and intelligent processing.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Batch processing</li>
                  <li>• Multi-step workflows</li>
                  <li>• Smart content generation</li>
                </ul>
              </div>
            </div>

            {/* Experimental Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UrlToVideoTool 
                onGenerate={handleUrlToVideo}
                isGenerating={false}
              />
              
              <ImagesToVideoTool 
                onCreateVideo={handleImagesToVideo}
                isProcessing={false}
              />
              
              <VideoToSceneGraphTool 
                onGenerateSceneGraph={handleVideoToSceneGraph}
                isProcessing={false}
              />
            </div>

            {/* Detailed Workflows */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Common Advanced Workflows</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      📹 Create Product Demos
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Step 1:</strong> Enter your product's URL in "URL to Video"</p>
                      <p><strong>Step 2:</strong> AI generates an automated walkthrough</p>
                      <p><strong>Step 3:</strong> Use scene graph to analyze user flow</p>
                      <p><strong>Result:</strong> Professional demo video + detailed analysis</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🎨 Design Process Documentation
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Step 1:</strong> Upload design iterations to "Images to Video"</p>
                      <p><strong>Step 2:</strong> Create animated progression video</p>
                      <p><strong>Step 3:</strong> Extract components with scene graph</p>
                      <p><strong>Result:</strong> Animated design story + component library</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🔍 Competitor Analysis
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Step 1:</strong> Generate videos from competitor URLs</p>
                      <p><strong>Step 2:</strong> Analyze videos with scene graph tool</p>
                      <p><strong>Step 3:</strong> Compare UI patterns and flows</p>
                      <p><strong>Result:</strong> Detailed competitive insights</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      📱 App Flow Visualization
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Step 1:</strong> Upload app screenshots in sequence</p>
                      <p><strong>Step 2:</strong> Create flow animation video</p>
                      <p><strong>Step 3:</strong> Extract interaction patterns</p>
                      <p><strong>Result:</strong> Visual user journey + interaction map</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Limitations */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                ⚠️ Current Limitations & Roadmap
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Known Limitations:</h5>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Video generation may take 30-60 seconds</li>
                    <li>• Scene graph analysis is in early beta</li>
                    <li>• Some complex animations may not capture perfectly</li>
                    <li>• Limited to specific video formats</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Coming Soon:</h5>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Real-time video processing</li>
                    <li>• Advanced scene graph visualization</li>
                    <li>• Batch processing capabilities</li>
                    <li>• Integration with design tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Use Cases Tab */}
        {selectedTab === "examples" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <div key={useCase.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-4xl">{useCase.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Popular Workflows</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Design to Code</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload a Figma screenshot → Get React/Vue/HTML code → Deploy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Clone Existing Sites</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter URL → Capture screenshot → Generate matching code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Interactive Prototypes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Record screen with interactions → AI understands behavior → Get functional code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sign up CTA for non-authenticated users */}
        {!user && IS_RUNNING_ON_CLOUD && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-3">Ready to Start Creating?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                Sign up now to get 2 free credits and start converting your designs to code instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-md"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-8 py-3 border border-white/30 text-base font-medium rounded-xl text-white hover:bg-white/10 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default StartPane;