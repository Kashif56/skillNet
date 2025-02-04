import React from 'react';

const CHAR_LIMITS = {
  title: 70,
  offering: 30,
  lookingFor: 30
};

const BasicInfo = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gig Title
          <span className="text-xs text-gray-500 ml-2">
            ({formData.title.length}/{CHAR_LIMITS.title} characters)
          </span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Professional React Development Teaching"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={CHAR_LIMITS.title}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are you offering to teach?
          <span className="text-xs text-gray-500 ml-2">
            ({formData.offering.length}/{CHAR_LIMITS.offering} characters)
          </span>
        </label>
        <input
          type="text"
          name="offering"
          value={formData.offering}
          onChange={handleChange}
          placeholder="e.g., React Development"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={CHAR_LIMITS.offering}
        />
        {errors.offering && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.offering}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to learn?
          <span className="text-xs text-gray-500 ml-2">
            ({formData.lookingFor.length}/{CHAR_LIMITS.lookingFor} characters)
          </span>
        </label>
        <input
          type="text"
          name="lookingFor"
          value={formData.lookingFor}
          onChange={handleChange}
          placeholder="e.g., UI/UX Design"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={CHAR_LIMITS.lookingFor}
        />
        {errors.lookingFor && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.lookingFor}
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;
