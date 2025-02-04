import React from 'react';
import { FaPen, FaPlus, FaCertificate } from 'react-icons/fa';
import Modal from '../common/Modal';

const Certifications = ({
  certifications,
  selectedCertification,
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onEditCertification,
  onAddCertification,
  onUpdateCertification
}) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Certifications</h2>
          <button
            onClick={() => onOpenModal()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-100 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <FaCertificate className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <span className="text-sm text-gray-500">{cert.year}</span>
                </div>
              </div>
              <button
                onClick={() => onOpenModal(cert)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <FaPen className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title={selectedCertification ? "Edit Certification" : "Add Certification"}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCertification?.name || ''}
              onChange={(e) => onUpdateCertification({
                ...selectedCertification || {},
                name: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuing Organization
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCertification?.issuer || ''}
              onChange={(e) => onUpdateCertification({
                ...selectedCertification || {},
                issuer: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCertification?.year || ''}
              onChange={(e) => onUpdateCertification({
                ...selectedCertification || {},
                year: e.target.value
              })}
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
              onClick={() => {
                if (selectedCertification?.id) {
                  onEditCertification(selectedCertification);
                } else {
                  onAddCertification(selectedCertification);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedCertification?.id ? 'Save Changes' : 'Add Certification'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Certifications;
