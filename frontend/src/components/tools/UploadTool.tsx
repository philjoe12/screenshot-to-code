import React, { useCallback } from 'react';
import { FeatureType } from '../../config/credit-usage';
import CreditCostBadge from '../credits/CreditCostBadge';

interface UploadToolProps {
  onFileSelect: (dataUrl: string, isVideo: boolean) => void;
  dragActive?: boolean;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const UploadTool: React.FC<UploadToolProps> = ({
  onFileSelect,
  dragActive = false,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const isVideo = file.type.startsWith("video/");
          onFileSelect(event.target.result, isVideo);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  return (
    <div className="h-full">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Image/Video</h3>
            <div className="flex gap-2">
              <CreditCostBadge featureType={FeatureType.CODE_GENERATION_IMAGE} />
              <span className="text-sm text-gray-500">or</span>
              <CreditCostBadge featureType={FeatureType.CODE_GENERATION_VIDEO} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Drag & drop or select files from your device</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to use:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Simply drag and drop your image or video file, or click to browse. Supports PNG, JPG, GIF, MP4, MOV, and WebM formats.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best for:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick conversions of static designs or UI mockups
          </p>
        </div>
      </div>

      <div className="mt-6">
        <input 
          type="file" 
          accept="image/*,video/mp4,video/quicktime,video/webm" 
          className="hidden" 
          id="file-upload-tool" 
          onChange={handleFileInput} 
        />
        <button 
          onClick={() => document.getElementById('file-upload-tool')?.click()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          Choose File
        </button>
      </div>

      {/* Drag and drop overlay for main upload area */}
      {onDragEnter && onDragOver && onDragLeave && onDrop && (
        <div 
          className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200 ${
            dragActive 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drop your files here
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadTool;