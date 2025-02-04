import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AddGigButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
    >
      <FaPlus className="w-6 h-6" />
    </button>
  );
};

export default AddGigButton;
