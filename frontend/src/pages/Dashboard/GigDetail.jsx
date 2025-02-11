import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaStar, FaUserCircle, FaCalendar, FaClock, FaMapMarkerAlt, 
  FaSpinner, FaEdit, FaTrash, FaArrowLeft, FaEye, FaHandshake,
  FaExclamationTriangle
} from 'react-icons/fa';
import { getGigDetail, deleteGig } from '../../services/gigs';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur */}
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-all" 
          aria-hidden="true"
          onClick={!isDeleting ? onClose : undefined}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="relative inline-block overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Delete Gig
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this gig? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onConfirm}
              className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm sm:ml-3 sm:w-auto sm:text-sm cursor-pointer ${
                isDeleting
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}
            >
              {isDeleting ? (
                <span className="inline-flex items-center">
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className={`inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                isDeleting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardGigDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setLoading(true);
        const response = await getGigDetail(gigId);
        if (response.status === 'success') {
          setGig(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load gig details');
        console.error('Error fetching gig details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigDetails();
  }, [gigId]);

  const handleDelete = async () => {
    if (!gigId) return;

    try {
      setIsDeleting(true);
      const result = await deleteGig(gigId);

      if (result.status === 'success') {
        toast.success(result.message);
        navigate('/dashboard/gigs');
      } else {
        throw new Error(result.message || 'Failed to delete gig');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Failed to delete gig');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <Link to="/dashboard/gigs" className="text-blue-600 hover:underline">
          Back to Gigs
        </Link>
      </div>
    );
  }

  if (!gig) return null;

  return (
    <>
      {showDeleteModal && (
        <DeleteModal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <Link
              to="/dashboard/gigs"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 sm:mb-0"
            >
              <FaArrowLeft className="mr-2" />
              Back to Gigs
            </Link>
            <div className="flex space-x-4">
              <Link
                to={`/dashboard/gigs/${gigId}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaEdit className="mr-2" />
                Edit Gig
              </Link>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <FaTrash className="mr-2" />
                Delete Gig
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Card */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative pb-[56.25%]">
                  <img
                    src={`http://localhost:8000/${gig.gigImage}`}
                    alt={gig.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{gig.title}</h2>
                <div className="prose max-w-none text-gray-600">
                  {gig.description}
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.tags && gig.tags.length > 0 ? (
                    gig.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 transition-colors duration-200 hover:bg-blue-100"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No tags added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details and Stats */}
            <div className="space-y-6">
              {/* Quick Stats Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <FaEye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <FaHandshake className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Requests</div>
                  </div>
                </div>
              </div>

              {/* Skills Exchange Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Exchange</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm font-medium text-blue-700 mb-1">Offering</div>
                    <div className="text-base font-semibold text-gray-900">{gig.offeredSkills}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm font-medium text-green-700 mb-1">Looking for</div>
                    <div className="text-base font-semibold text-gray-900">{gig.desiredSkills}</div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm">Created on</div>
                      <div className="font-medium">{new Date(gig.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm">Location</div>
                      <div className="font-medium">{gig.location || 'Not specified'}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm">Duration</div>
                      <div className="font-medium">{gig.duration || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardGigDetail;
