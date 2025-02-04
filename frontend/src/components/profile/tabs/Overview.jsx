import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaUserGraduate } from 'react-icons/fa';
import About from '../About';
import Skills from '../Skills';
import Contact from '../Contact';
import Certifications from '../Certifications';

const Overview = ({
  formData,
  activeModal,
  setActiveModal,
  selectedCertification,
  setSelectedCertification,
  handleSubmit,
  handleAddSkill,
  handleEditCertification,
  handleAddCertification,
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-2 space-y-6">
        <About
          about={formData.about}
          onEdit={() => setActiveModal('about')}
          isModalOpen={activeModal === 'about'}
          onCloseModal={() => setActiveModal(null)}
          onSubmit={handleSubmit}
        />

        <Skills
          skills={formData.skills}
          onEdit={() => setActiveModal('skills')}
          isModalOpen={activeModal === 'skills'}
          onCloseModal={() => setActiveModal(null)}
          onSubmit={handleSubmit}
          onAddSkill={handleAddSkill}
        />

        {/* Teaching History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Teaching History</h2>
          </div>
          <div className="space-y-4">
            {formData.teachingHistory.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.subject}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaUserGraduate className="mr-1" />
                        {item.students} Students
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {item.hours} Hours
                      </span>
                      <span className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        {item.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Contact
          contact={formData.contact}
          onEdit={() => setActiveModal('contact')}
          isModalOpen={activeModal === 'contact'}
          onCloseModal={() => setActiveModal(null)}
          onSubmit={handleSubmit}
        />

        <Certifications
          certifications={formData.certifications}
          selectedCertification={selectedCertification}
          isModalOpen={activeModal === 'certifications'}
          onOpenModal={(cert) => {
            setSelectedCertification(cert);
            setActiveModal('certifications');
          }}
          onCloseModal={() => {
            setActiveModal(null);
            setSelectedCertification(null);
          }}
          onEditCertification={handleEditCertification}
          onAddCertification={handleAddCertification}
          onUpdateCertification={setSelectedCertification}
        />

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <FaStar className="text-yellow-600" />
              <div>
                <h3 className="font-medium text-gray-800">Top Rated Teacher</h3>
                <p className="text-sm text-gray-600">Maintained 4.8+ rating</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
