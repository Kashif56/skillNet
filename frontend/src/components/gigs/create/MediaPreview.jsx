import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import ImageCropper from './ImageCropper';

const GigPreview = ({ formData }) => (
  <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
      {formData.image ? (
        <img
          src={formData.image}
          alt="Gig preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <FaImage className="w-12 h-12 text-gray-300" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-medium text-lg mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
        {formData.title || 'Your gig title'}
      </h3>
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm">
          <span className="text-blue-600 font-medium min-w-[80px]">Offering:</span>
          <span className="ml-2 text-gray-600 line-clamp-1">{formData.offering || 'What you\'ll teach'}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-green-600 font-medium min-w-[80px]">Looking for:</span>
          <span className="ml-2 text-gray-600 line-clamp-1">{formData.lookingFor || 'What you want to learn'}</span>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
          {formData.description || 'Your gig description will appear here'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.tags?.length > 0 ? (
          formData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">Add tags to help others find your gig</span>
        )}
      </div>
    </div>
  </div>
);

const MediaPreview = ({ formData, handleImageChange }) => {
  const [tempImage, setTempImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropper(true);
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (result) => {
    try {
      // Convert the cropped image URL to base64
      const response = await fetch(result.url);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 string
        handleImageChange(reader.result);
        setShowCropper(false);
        setTempImage(null);
        setError('');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error processing cropped image:', error);
      setError('Error processing image');
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImage(reader.result);
          setShowCropper(true);
          setError('');
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please upload an image file');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gig Thumbnail (1280x720px - 16:9)
        </label>
        <div
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {formData.image ? (
            <div className="space-y-2 text-center w-full max-w-md">
              <div className="relative w-full max-w-md mx-auto" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
              <button
                onClick={() => handleImageChange(null)}
                className="text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
              >
                <span className="text-xs">Remove Image</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1 text-center max-w-md w-full">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG up to 10MB (1280x720px - 16:9 aspect ratio)
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="max-w-sm mx-auto">
          <GigPreview formData={formData} />
        </div>
      </div>

      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default MediaPreview;
