import React from 'react';
import { FaTags } from 'react-icons/fa';

const CHAR_LIMIT = 600;

const DetailedDescription = ({ formData, handleChange, errors, tagInput, setTagInput, handleTagAdd, handleTagRemove }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description
          <span className="text-xs text-gray-500 ml-2">
            ({formData.description.length}/{CHAR_LIMIT} characters)
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          placeholder="Describe your teaching experience, methodology, and what students can expect..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={CHAR_LIMIT}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FaTags className="text-gray-400" />
          Tags
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTagAdd(e)}
              placeholder="Add tags and press Enter"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
            />
            <button
              onClick={handleTagAdd}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center group hover:bg-blue-200 transition-colors"
            >
              {tag}
              <button
                onClick={() => handleTagRemove(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter or click Add Tag to add multiple tags. Tags help students find your gig.
        </p>
      </div>
    </div>
  );
};

export default DetailedDescription;
