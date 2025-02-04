import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIO = 16 / 9;
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, ASPECT_RATIO));
  }

  const getCroppedImage = useCallback(async () => {
    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!image || !completedCrop) {
        throw new Error('Image or crop data missing');
      }

      // Set canvas size to target dimensions
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;

      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling factors
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Calculate actual crop dimensions
      const sourceX = completedCrop.x * scaleX;
      const sourceY = completedCrop.y * scaleY;
      const sourceWidth = completedCrop.width * scaleX;
      const sourceHeight = completedCrop.height * scaleY;

      // Draw the cropped image
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT
      );

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas is empty');
          }
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.95);
      });
    } catch (error) {
      console.error('Error during image cropping:', error);
      throw error;
    }
  }, [completedCrop]);

  const handleCropClick = async () => {
    if (!completedCrop?.width || !completedCrop?.height) {
      return;
    }

    setIsProcessing(true);
    try {
      const croppedImageUrl = await getCroppedImage();
      if (croppedImageUrl) {
        // Convert data URL to Blob
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        
        // Create a File object
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        
        // Pass both URL and File object to parent
        onCropComplete({ url: croppedImageUrl, file });
      }
    } catch (error) {
      console.error('Error applying crop:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Crop Image</h2>
            <p className="text-sm text-gray-500">
              Please crop your image to {TARGET_WIDTH}x{TARGET_HEIGHT}px (16:9)
            </p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIO}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={image}
              onLoad={onImageLoad}
              className="max-w-full"
              style={{ maxHeight: '50vh' }}
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end space-x-3 pt-2 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropClick}
            disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing...</span>
              </>
            ) : (
              'Apply Crop'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
