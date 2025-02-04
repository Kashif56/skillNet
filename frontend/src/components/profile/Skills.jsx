import React from 'react';
import { FaPen } from 'react-icons/fa';
import Modal from '../common/Modal';

const Skills = ({ skills, onEdit, isModalOpen, onCloseModal, onSubmit, onAddSkill }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <FaPen className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="p-4 border border-gray-100 rounded-lg hover:border-blue-100 transition-colors"
            >
              <h3 className="font-medium text-gray-800">{skill.name}</h3>
              <span className="text-sm text-gray-600">{skill.proficiency}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title="Edit Skills"
      >
        <div className="mt-4 space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Skill name"
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index] = { ...skill, name: e.target.value };
                    onSubmit('skills', newSkills);
                  }}
                />
                <select
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={skill.proficiency}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index] = { ...skill, proficiency: e.target.value };
                    onSubmit('skills', newSkills);
                  }}
                >
                  <option value="">Select Proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                onClick={() => {
                  const newSkills = skills.filter((_, i) => i !== index);
                  onSubmit('skills', newSkills);
                }}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddSkill('', '')}
            className="w-full p-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            Add Skill
          </button>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onCloseModal}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit('skills')}
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

export default Skills;
