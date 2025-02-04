import React from 'react';
import { FaPen } from 'react-icons/fa';
import Modal from '../common/Modal';

const About = ({ about, onEdit, isModalOpen, onCloseModal, onSubmit }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">About</h2>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <FaPen className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-600">{about}</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title="Edit About"
      >
        <div className="mt-4 space-y-4">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            value={about}
            onChange={(e) => onSubmit('about', e.target.value)}
            placeholder="Tell us about yourself..."
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onCloseModal}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit('about')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default About;
