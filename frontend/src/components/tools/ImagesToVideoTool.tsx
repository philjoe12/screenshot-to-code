import React, { useState, useCallback } from 'react';

interface ImagesToVideoToolProps {
  onCreateVideo: (images: string[]) => void;
  isProcessing?: boolean;
}

const ImagesToVideoTool: React.FC<ImagesToVideoToolProps> = ({ onCreateVideo, isProcessing = false }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages: string[] = [];
      const newPreviews: string[] = [];
      
      const readFile = (file: File, index: number) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === "string") {
              newImages[index] = event.target.result;
              newPreviews[index] = event.target.result;
              resolve();
            }
          };
          reader.readAsDataURL(file);
        });
      };

      Promise.all(files.map((file, index) => readFile(file, index))).then(() => {
        setSelectedImages([...selectedImages, ...newImages]);
        setPreviewUrls([...previewUrls, ...newPreviews]);
      });
    }
  }, [selectedImages, previewUrls]);

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleCreateVideo = () => {
    if (selectedImages.length > 0) {
      onCreateVideo(selectedImages);
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
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      // Simulate file input with dropped files
      const input = document.getElementById('images-upload') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Images to Video</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create a video from multiple images</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          Experimental
        </span>
      </div>
      
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            id="images-upload" 
            onChange={handleFileInput} 
          />
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
          </svg>
          <label 
            htmlFor="images-upload"
            className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
          >
            <span className="text-blue-600 dark:text-blue-400 hover:underline">Choose images</span> or drag them here
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>

        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected images ({previewUrls.length})
            </p>
            <div className="grid grid-cols-4 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={handleCreateVideo}
          disabled={selectedImages.length === 0 || isProcessing}
          className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Video...
            </>
          ) : (
            `Create Video${selectedImages.length > 0 ? ` (${selectedImages.length} images)` : ''}`
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
        <p className="text-xs text-pink-700 dark:text-pink-300">
          <strong>Tip:</strong> Upload images in the order you want them to appear in the video. Each image will be displayed for a few seconds.
        </p>
      </div>
    </div>
  );
};

export default ImagesToVideoTool;