import React from 'react';
import { FaPen, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Modal from '../common/Modal';

const Contact = ({ contact, onEdit, isModalOpen, onCloseModal, onSubmit }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contact & Social</h2>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <FaPen className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{contact.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaEnvelope />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaPhone />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaGithub />
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              {contact.github}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaLinkedin />
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              {contact.linkedin}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaTwitter />
            <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              {contact.twitter}
            </a>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title="Edit Contact & Social"
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.location}
              onChange={(e) => onSubmit('contact', { ...contact, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.email}
              onChange={(e) => onSubmit('contact', { ...contact, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.phone}
              onChange={(e) => onSubmit('contact', { ...contact, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="url"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.github}
              onChange={(e) => onSubmit('contact', { ...contact, github: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.linkedin}
              onChange={(e) => onSubmit('contact', { ...contact, linkedin: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input
              type="url"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact.twitter}
              onChange={(e) => onSubmit('contact', { ...contact, twitter: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onCloseModal}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit('contact')}
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

export default Contact;
