// /frontend/src/components/start-pane/StartPane.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings } from "../../types/types";
import { Stack } from "../../lib/stacks";
import { URLS } from "../../urls";
import ScreenRecorder from "../recording/ScreenRecorder";
import { ScreenRecorderState } from "../../types/types";
import { useAuth } from "../auth/AuthContext";
import { IS_RUNNING_ON_CLOUD } from "../../config";

interface StartPaneProps {
  doCreate: (referenceImages: string[], inputMode: "image" | "video") => void;
  importFromCode: (code: string, stack: Stack) => void;
  settings: Settings;
  children?: React.ReactNode;
}

const StartPane: React.FC<StartPaneProps> = ({ doCreate, importFromCode, settings, children }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const [codeInputValue, setCodeInputValue] = useState("");
  const [selectedStack, setSelectedStack] = useState<Stack>(settings.generatedCodeConfig);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [screenRecorderState, setScreenRecorderState] = useState<ScreenRecorderState>(ScreenRecorderState.INITIAL);
  
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

  const handleUrlCapture = useCallback(() => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    if (urlInputValue.trim()) {
      fetch(`/api/screenshot?url=${encodeURIComponent(urlInputValue)}`)
        .then(response => response.json())
        .then(data => {
          if (data.imageUrl) {
            doCreate([data.imageUrl], "image");
          }
        })
        .catch(error => {
          console.error("Error capturing URL:", error);
        });
    }
  }, [urlInputValue, doCreate, user, navigate]);

  const handleCodeImport = useCallback(() => {
    // Check authentication before processing
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
      return;
    }
    
    if (codeInputValue.trim()) {
      importFromCode(codeInputValue, selectedStack);
      setIsCodeModalOpen(false);
    }
  }, [codeInputValue, selectedStack, importFromCode, user, navigate]);

  const handleGetStartedClick = useCallback(() => {
    if (!user && IS_RUNNING_ON_CLOUD) {
      navigate('/signup');
    } else {
      // Scroll to upload section
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [user, navigate]);

  const handleFeatureClick = useCallback((e: React.MouseEvent) => {
    if (!user && IS_RUNNING_ON_CLOUD) {
      e.preventDefault();
      navigate('/signup');
    }
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

  // Main component content
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Turn Designs Into Code <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          Pix 2 Code uses AI to transform screenshots, mockups, and designs into 
          production-ready HTML, CSS, and more. Save hours of coding time.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          {IS_RUNNING_ON_CLOUD ? (
            user ? (
              <>
                <a 
                  href="#upload-section" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started ({credits?.credits_remaining || 0} credits)
                </a>
                <a 
                  href="https://github.com/abi/screenshot-to-code" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View on GitHub
                </a>
              </>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up Free
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </Link>
              </>
            )
          ) : (
            // Local development mode - no auth required
            <a 
              href="#upload-section" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </a>
          )}
        </div>
        {!user && IS_RUNNING_ON_CLOUD && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Get 2 free credits when you sign up. No credit card required.
          </p>
        )}
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Screenshot to Code</h3>
            <p className="text-gray-600 dark:text-gray-300">Upload any screenshot or image of a UI design and convert it to clean, production-ready code.</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Frameworks</h3>
            <p className="text-gray-600 dark:text-gray-300">Generate code in HTML/Tailwind CSS, HTML/CSS, React, Vue, and more with a single click.</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Edits</h3>
            <p className="text-gray-600 dark:text-gray-300">Make changes to your generated code using natural language instructions. No manual coding required.</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {(user || !IS_RUNNING_ON_CLOUD) && (
        <div id="upload-section" className="py-12">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Get Started</h2>
            
            {screenRecorderState === ScreenRecorderState.INITIAL && (
              <>
                {/* Drag and Drop Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 text-center ${
                    dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <h3 className="text-lg font-medium">Drag & drop a screenshot here</h3>
                    <p className="text-gray-500 dark:text-gray-400">or click to upload</p>
                    <input 
                      type="file" 
                      accept="image/*,video/mp4,video/quicktime,video/webm" 
                      className="hidden" 
                      id="file-upload" 
                      onChange={handleFileInput} 
                    />
                    <button 
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Upload File
                    </button>
                    {IS_RUNNING_ON_CLOUD && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        You have {credits?.credits_remaining || 0} credits remaining
                      </p>
                    )}
                  </div>
                </div>

                {/* Screen Recording Info */}
                <div className="text-center text-sm text-slate-800 dark:text-slate-300 mt-4">
                  Upload a screen recording (.mp4, .mov) or record your screen to clone
                  a whole app (experimental).{" "}
                  <a
                    className="underline"
                    href={URLS["intro-to-video"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more.
                  </a>
                </div>
              </>
            )}

            {/* Screen Recorder Component */}
            <ScreenRecorder
              screenRecorderState={screenRecorderState}
              setScreenRecorderState={setScreenRecorderState}
              generateCode={(images, mode) => doCreate(images, mode)}
            />

            {/* URL Input */}
            <div className="mt-8">
              <p className="text-center text-gray-500 dark:text-gray-400 mb-4">Or screenshot a URL</p>
              <div className="flex">
                <input 
                  type="text" 
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  placeholder="Enter URL"
                  className="flex-1 min-w-0 block rounded-l-md border-gray-300 dark:border-gray-700 dark:bg-zinc-800 dark:text-white px-4 py-2"
                />
                <button 
                  onClick={handleUrlCapture}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Capture
                </button>
              </div>
            </div>

            {children}

            {/* Import from Code */}
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsCodeModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                Import from Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign up CTA for non-authenticated users */}
      {!user && IS_RUNNING_ON_CLOUD && (
        <div className="py-12 text-center">
          <div className="max-w-xl mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign up now to get 2 free credits and start converting your designs to code instantly.
            </p>
            <Link 
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Free Account
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-500">Sign in</Link>
            </p>
          </div>
        </div>
      )}

      {/* Code Import Modal */}
      {isCodeModalOpen && (user || !IS_RUNNING_ON_CLOUD) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" 
                 onClick={() => setIsCodeModalOpen(false)}></div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl transform transition-all w-full max-w-2xl">
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Import from Code</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Framework</label>
                    <select 
                      value={selectedStack}
                      onChange={(e) => setSelectedStack(e.target.value as Stack)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-zinc-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={Stack.HTML_TAILWIND}>HTML + Tailwind</option>
                      <option value={Stack.HTML_CSS}>HTML + CSS</option>
                      <option value={Stack.REACT_TAILWIND}>React + Tailwind</option>
                      <option value={Stack.VUE_TAILWIND}>Vue + Tailwind</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paste your code</label>
                    <textarea 
                      value={codeInputValue}
                      onChange={(e) => setCodeInputValue(e.target.value)}
                      rows={10}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-zinc-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsCodeModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCodeImport}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples Section */}
      <div className="py-12 bg-gray-50 dark:bg-zinc-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">What You Can Create</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Cards */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <h3 className="font-medium">Landing Pages</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Convert landing page designs to responsive code in seconds</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <h3 className="font-medium">Dashboard UI</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Transform complex dashboard mockups into functional interfaces</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <h3 className="font-medium">Mobile App Screens</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Turn app designs into responsive mobile-first code</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learn More Links */}
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold text-center mb-8">Learn More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/gallery" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Gallery
          </Link>
          <Link 
            to="/pricing" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            See Pricing
          </Link>
          <Link 
            to="/about" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            About Us
          </Link>
        </div>
        
        {/* Additional Links */}
        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <Link 
            to="/contact" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Contact Us
          </Link>
          <Link 
            to="/blog" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Blog
          </Link>
          <Link 
            to="/terms-of-service" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Terms of Service
          </Link>
          <Link 
            to="/privacy" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPane;