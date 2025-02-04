import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/profile/Header';
import Overview from '../../components/profile/tabs/Overview';
import Teaching from '../../components/profile/tabs/Teaching';
import Learning from '../../components/profile/tabs/Learning';
import Reviews from '../../components/profile/tabs/Reviews';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    name: "John Doe",
    title: "Senior Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    about: "I am a passionate teacher with over 5 years of experience...",
    skills: [
      { name: "Mathematics", proficiency: "Expert" },
      { name: "Physics", proficiency: "Advanced" },
      { name: "Online Teaching", proficiency: "Expert" },
      { name: "Curriculum Development", proficiency: "Intermediate" }
    ],
    teachingHistory: [
      {
        subject: 'React Native Development',
        students: 12,
        hours: 48,
        rating: 4.9,
      },
      {
        subject: 'UI/UX Fundamentals',
        students: 8,
        hours: 32,
        rating: 4.8,
      },
    ],
    certifications: [
      { id: 1, name: "Advanced Teaching Certificate", issuer: "Education Board", year: "2024" },
      { id: 2, name: "Online Education Specialist", issuer: "E-Learning Institute", year: "2023" }
    ],
    contact: {
      location: "San Francisco, CA",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      twitter: "twitter.com/johndoe"
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = (name, proficiency) => {
    const newSkills = [...formData.skills, { name, proficiency }];
    handleInputChange('skills', newSkills);
  };

  const handleAddCertification = (cert) => {
    const newCert = { ...cert, id: Date.now() };
    const newCerts = [...formData.certifications, newCert];
    handleInputChange('certifications', newCerts);
    setActiveModal(null);
    setSelectedCertification(null);
  };

  const handleEditCertification = (cert) => {
    const newCerts = formData.certifications.map(c => 
      c.id === cert.id ? cert : c
    );
    handleInputChange('certifications', newCerts);
    setActiveModal(null);
    setSelectedCertification(null);
  };

  const handleSubmit = (field, value) => {
    if (value) {
      handleInputChange(field, value);
    }
    setActiveModal(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview
            formData={formData}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            selectedCertification={selectedCertification}
            setSelectedCertification={setSelectedCertification}
            handleSubmit={handleSubmit}
            handleAddSkill={handleAddSkill}
            handleEditCertification={handleEditCertification}
            handleAddCertification={handleAddCertification}
          />
        );

      case 'teaching':
        return <Teaching teachingHistory={formData.teachingHistory} />;

      case 'learning':
        return <Learning />;

      case 'reviews':
        return <Reviews />;

      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header/Cover */}
        <Header
          name={formData.name}
          title={formData.title}
          avatar={formData.avatar}
          stats={{
            rating: 4.9,
            hoursTeaching: 480,
            totalStudents: 42
          }}
        />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-6 bg-white rounded-lg p-1 shadow-sm">
          {['overview', 'teaching', 'learning', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
