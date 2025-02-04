import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaBook, FaImage, FaExclamationCircle } from 'react-icons/fa';

import BasicInfo from '../../components/gigs/create/BasicInfo';
import DetailedDescription from '../../components/gigs/create/DetailedDescription';
import MediaPreview from '../../components/gigs/create/MediaPreview';

const steps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Let\'s start with the basics of your gig',
    fields: ['title', 'offering', 'lookingFor'],
    icon: <FaInfoCircle className="w-5 h-5" />
  },
  {
    id: 2,
    title: 'Detailed Description',
    description: 'Tell us more about your teaching style and expertise',
    fields: ['description', 'tags'],
    icon: <FaBook className="w-5 h-5" />
  },
  {
    id: 3,
    title: 'Media & Preview',
    description: 'Add images and preview your gig',
    fields: ['image'],
    icon: <FaImage className="w-5 h-5" />
  }
];

const CHAR_LIMITS = {
  title: 70,
  description: 600,
  offering: 30,
  lookingFor: 30
};

const CreateGig = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    // Try to load from localStorage
    const savedData = localStorage.getItem('gigFormData');
    return savedData ? JSON.parse(savedData) : {
      title: '',
      offering: '',
      lookingFor: '',
      description: '',
      tags: [],
      image: null
    };
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    localStorage.setItem('gigFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check for special characters except apostrophe
    if (['title', 'offering', 'lookingFor'].includes(name)) {
      if (!/^[a-zA-Z0-9\s']*$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Special characters are not allowed except apostrophe'
        }));
        return;
      }
    }

    // Check character limits
    if (CHAR_LIMITS[name] && value.length > CHAR_LIMITS[name]) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  const handleTagsChange = (newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    const newErrors = {};
    
    currentStepData.fields.forEach(field => {
      if (!formData[field] && field !== 'tags' && field !== 'image') {
        newErrors[field] = 'This field is required';
      }
    });

    if (currentStep === 1) {
      if (formData.title.length < 10) {
        newErrors.title = 'Title must be at least 10 characters long';
      }
      if (!/^[a-zA-Z0-9\s']*$/.test(formData.title)) {
        newErrors.title = 'Special characters are not allowed except apostrophe';
      }
      if (!/^[a-zA-Z0-9\s']*$/.test(formData.offering)) {
        newErrors.offering = 'Special characters are not allowed except apostrophe';
      }
      if (!/^[a-zA-Z0-9\s']*$/.test(formData.lookingFor)) {
        newErrors.lookingFor = 'Special characters are not allowed except apostrophe';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        // Your submit logic here
        console.log('Form submitted:', formData);
        // Clear localStorage after successful submission
        localStorage.removeItem('gigFormData');
        navigate('/dashboard/gigs');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleTabClick = (stepId) => {
    // Validate current step before allowing navigation
    if (validateStep()) {
      setCurrentStep(stepId);
    } else {
      // Show error message
      setErrors(prev => ({
        ...prev,
        general: 'Please fill in all required fields correctly before proceeding'
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );

      case 2:
        return (
          <DetailedDescription
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleTagAdd={handleTagAdd}
            handleTagRemove={handleTagRemove}
          />
        );

      case 3:
        return (
          <MediaPreview
            formData={formData}
            handleImageChange={handleImageChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/gigs')}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create a New Gig</h1>
              <p className="text-sm text-gray-500">Share your expertise and find what you want to learn</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleTabClick(step.id)}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                } cursor-pointer`}
              >
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      step.id === currentStep
                        ? 'bg-blue-600 text-white'
                        : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className={`text-sm mt-2 transition-colors ${
                    step.id === currentStep
                      ? 'text-blue-600 font-medium'
                      : step.id < currentStep
                      ? 'text-green-500'
                      : 'text-gray-500'
                  }`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <FaExclamationCircle />
              {errors.general}
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {steps.find(step => step.id === currentStep).icon}
              {steps.find(step => step.id === currentStep).title}
            </h2>
            <p className="text-sm text-gray-500">
              {steps.find(step => step.id === currentStep).description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`px-6 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ${
              currentStep === 1 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          <button
            onClick={currentStep === steps.length ? handleSubmit : handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length ? 'Publish Gig' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
