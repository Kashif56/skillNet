import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaUserCircle, FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { getGigDetail, checkSwapRequest, sendSwapRequest } from '../../services/core';

const GigDetail = () => {
  const { gigId } = useParams();

  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swapRequestStatus, setSwapRequestStatus] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setLoading(true);
        const response = await getGigDetail(gigId);
        
        setGig(response.data);
        
        
        
        // Only check swap request status if user is authenticated
        if (isAuthenticated) {
          try {
            const swapStatus = await checkSwapRequest(gigId);
            setSwapRequestStatus(swapStatus);
          } catch (err) {
            console.error('Error checking swap request status:', err);
            // Don't set main error state, just log the error
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load gig details');
        console.error('Error fetching gig details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigDetails();
  }, [gigId, isAuthenticated]);

  const handleSwapRequest = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      alert('Please log in to send a swap request');
      return;
    }

    try {
      setSendingRequest(true);
      await sendSwapRequest({ gigId });
      setSwapRequestStatus({ hasRequested: true });
    } catch (err) {
      console.error('Error sending swap request:', err);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Gig</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/gigs"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative pb-[56.25%]">
                {gig.gigImage && (
                  <img
                    src={`http://localhost:8000/${gig.gigImage}`}
                    alt={gig.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Title and Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gig.description}</p>
                </div>
              </div>
            </div>

            {/* Skills Exchange */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offering */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What I'm Offering</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-600">{gig.offeredSkills?.name}</h3>
                  <p className="text-gray-600">{gig.offeredSkills?.description}</p>
                  {gig.offeredSkills?.category && (
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-blue-50 px-3 py-1 rounded-full">
                        <span className="text-sm text-blue-600">Category: {gig.offeredSkills.category.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Looking For */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What I Need</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-green-600">{gig.desiredSkills?.name}</h3>
                  <p className="text-gray-600">{gig.desiredSkills?.description}</p>
                  {gig.desiredSkills?.category && (
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-green-50 px-3 py-1 rounded-full">
                        <span className="text-sm text-green-600">Category: {gig.desiredSkills.category.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                {gig.user?.profile_picture && (
                  <img
                    src={`http://localhost:8000/${gig.user.profile_picture}`}
                    alt={gig.user?.user?.username || 'User'}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{gig.user?.user?.username}</h3>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {gig.user?.rating || 0} ({gig.user?.rating_count || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{gig.user?.address || 'Location not specified'}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    Member since {gig.user?.user?.date_joined ? new Date(gig.user.user.date_joined).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-center"
                  >
                    Login to Send Request
                  </Link>
                ) : swapRequestStatus?.hasRequested ? (
                  <button
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-md font-medium cursor-not-allowed"
                    disabled
                  >
                    Swap Request Sent
                  </button>
                ) : (
                  <button
                    onClick={handleSwapRequest}
                    disabled={sendingRequest}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingRequest ? 'Sending Request...' : 'Send Swap Request'}
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span>{gig.user?.user?.email || 'N/A'}</span>
                </div>
                {gig.user?.phone && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Phone:</span>
                    <span>{gig.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
