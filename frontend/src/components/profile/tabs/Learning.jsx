import React from 'react';

const Learning = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Learning Progress</h2>
      <div className="text-center py-8">
        <p className="text-gray-600">No learning sessions yet.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Browse Courses
        </button>
      </div>
    </div>
  );
};

export default Learning;
