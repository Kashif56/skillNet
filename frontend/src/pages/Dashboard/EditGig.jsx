import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaInfoCircle, FaBook, FaImage, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

import BasicInfo from '../../components/gigs/create/BasicInfo';
import DetailedDescription from '../../components/gigs/create/DetailedDescription';
import MediaPreview from '../../components/gigs/create/MediaPreview';

import { getGigDetail, updateGig } from '../../services/gigs';

const steps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Update the basics of your gig',
    fields: ['title', 'offering', 'lookingFor'],
    icon: <FaInfoCircle className="w-5 h-5" />
  },
  {
    id: 2,
    title: 'Detailed Description',
    description: 'Modify your teaching style and expertise description',
    fields: ['description', 'tags'],
    icon: <FaBook className="w-5 h-5" />
  },
  {
    id: 3,
    title: 'Media & Preview',
    description: 'Update images and preview your gig',
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

const EditGig = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    offering: '',
    lookingFor: '',
    description: '',
    tags: [],
    image: null
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  // Fetch gig data on component mount
  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await getGigDetail(gigId);
        if (response.status === 'success') {
          const gig = response.data;
          setFormData({
            title: gig.title,
            offering: gig.offeredSkills,
            lookingFor: gig.desiredSkills,
            description: gig.description,
            tags: gig.tags || [],
            image: gig.gigImage ? `http://localhost:8000/${gig.gigImage}` : null
          });
        }
      } catch (err) {
        toast.error('Failed to load gig details');
        navigate('/dashboard/gigs');
      } finally {
        setLoading(false);
      }
    };

    fetchGigData();
  }, [gigId, navigate]);

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
        setSubmitting(true);
        const response = await updateGig(gigId, formData);
        if (response.status === 'success') {
          toast.success('Gig updated successfully');
          navigate(`/dashboard/gigs/${gigId}`);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to update gig');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/gigs/${gigId}`)}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Gig Details
          </button>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Gig</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-1 ${
                  step.id !== steps.length ? 'border-r border-gray-200 pr-4 mr-4' : ''
                }`}
              >
                <div
                  className={`flex items-center ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {step.icon}
                  <span className="ml-2 text-sm font-medium">{step.title}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          {currentStep === 1 && (
            <BasicInfo
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {currentStep === 2 && (
            <DetailedDescription
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleTagAdd={handleTagAdd}
              handleTagRemove={handleTagRemove}
            />
          )}
          {currentStep === 3 && (
            <MediaPreview
              formData={formData}
              handleImageChange={handleImageChange}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Previous
          </button>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/dashboard/gigs/${gigId}`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Gig'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGig;
