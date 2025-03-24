import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaSpinner, FaExchangeAlt, FaCheck, FaFile, FaUpload, 
  FaDownload, FaCommentAlt, FaArrowLeft, FaUser, FaClock,
  FaHandshake, FaCheckCircle
} from 'react-icons/fa';
import { getSwapDelivery, updateSwapDelivery } from '../../services/core';
import { toast } from 'react-toastify';

const SwapDelivery = () => {
  const { swapId } = useParams();
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('deliverable'); // 'deliverable' or 'requirements'
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  useEffect(() => {
    fetchDeliveryDetails();
  }, [swapId]);

  const fetchDeliveryDetails = async () => {
    try {
      setLoading(true);
      const response = await getSwapDelivery(swapId);
      
      if (response.status === 'success') {
        console.log('Delivery Data:', response.data);
        setDeliveryData(response.data);
      } else {
        setError('Failed to load swap delivery details');
      }
    } catch (err) {
      setError('Failed to load swap delivery details. Please try again.');
      console.error('Error fetching swap delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.warning('Please enter a comment before submitting');
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateSwapDelivery(swapId, 'add_comment', { comment });
      
      if (response.status === 'success') {
        toast.success('Comment added successfully');
        setComment('');
        fetchDeliveryDetails(); // Refresh to show the new comment
      } else {
        throw new Error(response.message || 'Failed to add comment');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadDeliverable = async () => {
    if (!selectedFile) {
      toast.warning('Please select a file to upload');
      return;
    }

    try {
      setIsSubmittingDelivery(true);
      const response = await updateSwapDelivery(swapId, 'upload_deliverable', { 
        file: selectedFile,
        comment: comment // Include the comment with the deliverable
      });
      
      if (response.status === 'success') {
        toast.success('Deliverable uploaded successfully');
        setSelectedFile(null);
        setComment(''); // Clear the comment after successful upload
        fetchDeliveryDetails(); // Refresh data to update the UI
      } else {
        throw new Error(response.message || 'Failed to upload deliverable');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload deliverable');
      console.error('Error uploading deliverable:', err);
    } finally {
      setIsSubmittingDelivery(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      // Determine if the other user has delivered
      const otherUserStatus = current_user_role === 'requestor' 
        ? delivery.responder_status 
        : delivery.requestor_status;
        
      // The other user's delivery must be 'delivered' to be accepted
      if (otherUserStatus !== 'delivered') {
        toast.warning('Cannot accept a deliverable that hasn\'t been submitted yet.');
        return;
      }
      
      // Already accepted case - this is for other user's deliverable
      const otherUserDeliveryAccepted = current_user_role === 'requestor'
        ? delivery.responder_status === 'accepted'
        : delivery.requestor_status === 'accepted';
        
      if (otherUserDeliveryAccepted) {
        toast.warning('This deliverable has already been accepted.');
        return;
      }
      
      setIsMarkingComplete(true);
      const response = await updateSwapDelivery(swapId, 'mark_completed');
      
      if (response.status === 'success') {
        toast.success('You have successfully accepted the deliverable');
        fetchDeliveryDetails(); // Refresh data to update the UI
      } else {
        throw new Error(response.message || 'Failed to accept deliverable');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to accept deliverable');
      console.error('Error accepting deliverable:', err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Extract relevant data for easier access
  const isLoading = loading;
  const hasError = error !== null;
  
  // Define states and data only when available
  if (!deliveryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
        ) : hasError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <FaExchangeAlt className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Swap</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchDeliveryDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  }
  
  // Destructure the new data format
  const {
    swap,
    gig,
    requestor,
    responder,
    current_user_role,
    other_user,
    delivery,
    comments
  } = deliveryData;
  
  // Determine active tab based on content availability
  const myFile = current_user_role === 'requestor' ? delivery.requestor_file : delivery.responder_file;
  const otherFile = current_user_role === 'requestor' ? delivery.responder_file : delivery.requestor_file;
  
  // Determine if current tab should be active
  const isActiveTab = activeTab === 'details' || (!myFile && !otherFile);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link 
        to="/dashboard/swap-requests" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Swap Requests
      </Link>

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaExchangeAlt className="text-blue-600 mr-3" />
                Swap Delivery
              </h1>
              <p className="text-gray-600 mt-1">Swap ID: {swap.swapId}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {/* Action status message */}
              {(() => {
                // Determine what action the user needs to take
                const currentUserStatus = current_user_role === 'requestor' 
                  ? deliveryData.delivery.requestor_status 
                  : deliveryData.delivery.responder_status;
                  
                const otherUserStatus = current_user_role === 'requestor' 
                  ? deliveryData.delivery.responder_status 
                  : deliveryData.delivery.requestor_status;
                
                if (swap.status === 'completed') {
                  return (
                    <div className="text-xs text-green-600 font-medium">
                      This swap has been completed successfully
                    </div>
                  );
                } else if (currentUserStatus === 'pending') {
                  return (
                    <div className="text-xs text-blue-600 font-medium">
                      Action required: Upload your deliverable
                    </div>
                  );
                } else if (currentUserStatus === 'delivered' && otherUserStatus === 'pending') {
                  return (
                    <div className="text-xs text-yellow-600 font-medium">
                      Waiting for {other_user.username} to upload their deliverable
                    </div>
                  );
                } else if (currentUserStatus === 'delivered' && otherUserStatus === 'accepted') {
                  return (
                    <div className="text-xs text-purple-600 font-medium">
                      {other_user.username} has accepted your deliverable
                    </div>
                  );
                } else if (otherUserStatus === 'delivered' && currentUserStatus !== 'accepted') {
                  return (
                    <div className="text-xs text-orange-600 font-medium">
                      Action required: Accept {other_user.username}'s deliverable
                    </div>
                  );
                }
                
                return null;
              })()}
              
              {/* Button */}
              {swap.status === 'completed' ? (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <FaCheckCircle className="mr-2" />
                  Completed
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={isMarkingComplete || 
                    // Button should be disabled if:
                    // 1. The other user's delivery isn't in 'delivered' status
                    // 2. The other user's delivery is already accepted by us
                    // For Requestor: Check if responder's delivery is 'delivered' and not yet accepted 
                    // For Responder: Check if requestor's delivery is 'delivered' and not yet accepted
                    (current_user_role === 'requestor' &&
                      (delivery.responder_status !== 'delivered' || 
                       delivery.responder_status === 'accepted')) ||
                    (current_user_role === 'responder' &&
                      (delivery.requestor_status !== 'delivered' || 
                       delivery.requestor_status === 'accepted'))
                  }
                  className={`px-4 py-2 ${
                    // Button is active only when other user has delivered AND we haven't accepted it yet
                    (current_user_role === 'requestor' && 
                     delivery.responder_status === 'delivered' && 
                     delivery.responder_status !== 'accepted') ||
                    (current_user_role === 'responder' && 
                     delivery.requestor_status === 'delivered' && 
                     delivery.requestor_status !== 'accepted')
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } rounded-lg flex items-center`}
                >
                  {isMarkingComplete ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaHandshake className="mr-2" />
                  )}
                  {/* Show appropriate label based on the other user's delivery status */}
                  {current_user_role === 'requestor'
                    ? (delivery.responder_status === 'accepted' 
                        ? 'Deliverable Accepted' 
                        : delivery.responder_status === 'delivered' 
                          ? 'Accept Deliverable' 
                          : 'Waiting for Deliverable')
                    : (delivery.requestor_status === 'accepted' 
                        ? 'Deliverable Accepted' 
                        : delivery.requestor_status === 'delivered' 
                          ? 'Accept Deliverable' 
                          : 'Waiting for Deliverable')
                  }
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-500">Progress</div>
            {swap.status === 'completed' ? (
              <div className="text-xs font-medium text-green-600">Completed</div>
            ) : (
              <div className="text-xs font-medium text-blue-600">In Progress</div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            {/* Calculate progress percentage based on delivery statuses */}
            {(() => {
              // Different stages of progress
              const totalSteps = 4; // 1. Request Accepted, 2. First Delivery, 3. Second Delivery, 4. Both Accepted
              let completedSteps = 1; // Start with 1 since request is already accepted
              
              // Add steps based on delivery status
              const requestorDelivered = deliveryData.requestor.delivery_status !== 'pending';
              const responderDelivered = deliveryData.responder.delivery_status !== 'pending';
              const requestorAccepted = deliveryData.requestor.delivery_status === 'accepted';
              const responderAccepted = deliveryData.responder.delivery_status === 'accepted';
              
              if (requestorDelivered) completedSteps++;
              if (responderDelivered) completedSteps++;
              if (requestorAccepted && responderAccepted) completedSteps++;
              
              const progressPercentage = (completedSteps / totalSteps) * 100;
              
              return (
                <div 
                  className={`h-2.5 rounded-full ${swap.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              );
            })()}
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex flex-col items-center text-xs text-gray-500">
              <div className={`w-4 h-4 mb-1 rounded-full flex items-center justify-center ${
                true ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaCheck size={8} />
              </div>
              <span>Accepted</span>
            </div>
            <div className="flex flex-col items-center text-xs text-gray-500">
              <div className={`w-4 h-4 mb-1 rounded-full flex items-center justify-center ${
                deliveryData.requestor.delivery_status !== 'pending' || deliveryData.responder.delivery_status !== 'pending' 
                  ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaCheck size={8} />
              </div>
              <span>First Delivery</span>
            </div>
            <div className="flex flex-col items-center text-xs text-gray-500">
              <div className={`w-4 h-4 mb-1 rounded-full flex items-center justify-center ${
                deliveryData.requestor.delivery_status !== 'pending' && deliveryData.responder.delivery_status !== 'pending' 
                  ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaCheck size={8} />
              </div>
              <span>Both Delivered</span>
            </div>
            <div className="flex flex-col items-center text-xs text-gray-500">
              <div className={`w-4 h-4 mb-1 rounded-full flex items-center justify-center ${
                swap.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaCheck size={8} />
              </div>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Acceptance Status Section */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className={`rounded-full w-3 h-3 ${
                  current_user_role === 'requestor'
                    ? (delivery.requestor_status === 'accepted' ? 'bg-green-500' : 
                       delivery.requestor_status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300')
                    : (delivery.responder_status === 'accepted' ? 'bg-green-500' : 
                       delivery.responder_status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300')
                }`}></div>
                <span className="font-medium">Your Deliverable:</span>
                <span className={
                  current_user_role === 'requestor'
                    ? (delivery.requestor_status === 'accepted' ? 'text-green-700' : 
                       delivery.requestor_status === 'delivered' ? 'text-blue-700' : 'text-gray-500')
                    : (delivery.responder_status === 'accepted' ? 'text-green-700' : 
                       delivery.responder_status === 'delivered' ? 'text-blue-700' : 'text-gray-500')
                }>
                  {current_user_role === 'requestor'
                    ? (delivery.requestor_status === 'accepted' ? 'Accepted by Admin' : 
                       delivery.requestor_status === 'delivered' ? 'Delivered' : 'Not Submitted')
                    : (delivery.responder_status === 'accepted' ? 'Accepted by Requester' : 
                       delivery.responder_status === 'delivered' ? 'Delivered' : 'Not Submitted')
                  }
                </span>
              </div>
              {/* Only show waiting message if the user has delivered but it hasn't been accepted */}
              {current_user_role === 'requestor' 
                ? (delivery.requestor_status === 'delivered' && delivery.requestor_status !== 'accepted' && (
                    <div className="text-xs text-yellow-600 mt-1 ml-5">
                      Waiting for {other_user.username} to accept
                    </div>
                  ))
                : (delivery.responder_status === 'delivered' && delivery.responder_status !== 'accepted' && (
                    <div className="text-xs text-yellow-600 mt-1 ml-5">
                      Waiting for {other_user.username} to accept
                    </div>
                  ))
              }
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className={`rounded-full w-3 h-3 ${
                  current_user_role === 'requestor'
                    ? (delivery.responder_status === 'accepted' ? 'bg-green-500' : 
                       delivery.responder_status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300')
                    : (delivery.requestor_status === 'accepted' ? 'bg-green-500' : 
                       delivery.requestor_status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300')
                }`}></div>
                <span className="font-medium">{other_user.username}'s Deliverable:</span>
                <span className={
                  current_user_role === 'requestor'
                    ? (delivery.responder_status === 'accepted' ? 'text-green-700' : 
                       delivery.responder_status === 'delivered' ? 'text-blue-700' : 'text-gray-500')
                    : (delivery.requestor_status === 'accepted' ? 'text-green-700' : 
                       delivery.requestor_status === 'delivered' ? 'text-blue-700' : 'text-gray-500')
                }>
                  {current_user_role === 'requestor'
                    ? (delivery.responder_status === 'accepted' ? 'Accepted by You' : 
                       delivery.responder_status === 'delivered' ? 'Delivered' : 'Not Submitted')
                    : (delivery.requestor_status === 'accepted' ? 'Accepted by You' : 
                       delivery.requestor_status === 'delivered' ? 'Delivered' : 'Not Submitted')
                  }
                </span>
              </div>
              {current_user_role === 'requestor'
                ? (delivery.responder_status === 'delivered' && delivery.responder_status !== 'accepted' && (
                    <div className="text-xs text-blue-600 mt-1 ml-5">
                      Waiting for you to accept
                    </div>
                  ))
                : (delivery.requestor_status === 'delivered' && delivery.requestor_status !== 'accepted' && (
                    <div className="text-xs text-blue-600 mt-1 ml-5">
                      Waiting for you to accept
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Deliverables and Status */}
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('deliverable')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'deliverable'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Deliverables
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'requirements'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Requirements & Instructions
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'deliverable' ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Work</h3>
                  
                  {swap.status !== 'completed' && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="mb-4">
                        <label htmlFor="fileInput" className="block mb-2 text-sm font-medium text-gray-700">
                          Upload File
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          onChange={handleFileChange}
                          className="p-2 w-full text-sm text-gray-600 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {selectedFile && (
                          <p className="mt-2 text-xs text-blue-600">
                            Selected file: {selectedFile.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
                          Comment (Optional)
                        </label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add details about your deliverable..."
                          className="p-2 w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleUploadDeliverable}
                          disabled={!selectedFile || isSubmittingDelivery}
                          className={`px-4 py-2 rounded-md flex items-center ${
                            !selectedFile || isSubmittingDelivery
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          title={comment.trim() ? "Submit file with comment" : "Submit file"}
                        >
                          {isSubmittingDelivery ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaUpload className="mr-2" />
                          )}
                          Submit Deliverable {comment.trim() && <span className="text-xs ml-1">(with comment)</span>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Deliverable Status */}

                  {/* Requestor Deliverables */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Your Deliverables</h4>
                    
                    {/* Display the user's deliverables */}
                    {(() => {
                      // Determine which file to show based on user role
                      const userFile = current_user_role === 'requestor' 
                        ? deliveryData.delivery.requestor_file 
                        : deliveryData.delivery.responder_file;
                        
                      if (userFile) {
                        return (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <FaFile className="text-blue-600 h-5 w-5" />
                                <div>
                                  <h5 className="font-medium text-gray-900">Your Deliverable</h5>
                                  <p className="text-sm text-gray-600">
                                    {current_user_role === 'requestor' 
                                      ? (deliveryData.delivery.requestor_status === 'delivered' ? 'Delivered' : 'Accepted')
                                      : (deliveryData.delivery.responder_status === 'delivered' ? 'Delivered' : 'Accepted')
                                    } 
                                    {deliveryData[current_user_role].delivered_at && 
                                      ` on ${new Date(deliveryData[current_user_role].delivered_at).toLocaleDateString()}`
                                    }
                                  </p>
                                  {/* Display filename */}
                                  <p className="text-xs text-blue-700 mt-1">
                                    {userFile.split('/').pop()}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={userFile.startsWith('http') 
                                  ? userFile 
                                  : `http://localhost:8000${userFile}`}
                                download
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                              >
                                <FaDownload className="mr-2" />
                                Download
                              </a>
                            </div>
                            <div className="text-sm text-gray-700">
                              {/* Display comment if available */}
                              {(() => {
                                // Get comment based on user role
                                const userComment = current_user_role === 'requestor'
                                  ? deliveryData.delivery.requestor_comment
                                  : deliveryData.delivery.responder_comment;
                                
                                if (userComment && userComment.trim()) {
                                  return <p className="whitespace-pre-wrap mb-3">{userComment}</p>;
                                } else {
                                  return <p className="mb-3">Your work has been delivered successfully.</p>;
                                }
                              })()}
                              
                              {/* Show acceptance status */}
                              <div className="mt-2 flex items-center">
                                <div className={`rounded-full w-3 h-3 mr-2 ${
                                  // For YOUR deliverable, we need to check if it's been accepted (by the OTHER user)
                                  // Requestor's deliverable is accepted when requestor_status = 'accepted'
                                  // Responder's deliverable is accepted when responder_status = 'accepted'
                                  current_user_role === 'requestor'
                                    ? (delivery.requestor_status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500')
                                    : (delivery.responder_status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500')
                                }`}></div>
                                <span className={
                                  current_user_role === 'requestor'
                                    ? (delivery.requestor_status === 'accepted' ? 'text-green-700' : 'text-yellow-700')
                                    : (delivery.responder_status === 'accepted' ? 'text-green-700' : 'text-yellow-700')
                                }>
                                  {current_user_role === 'requestor'
                                    ? (delivery.requestor_status === 'accepted' 
                                        ? `Accepted by ${other_user.username}` 
                                        : `Waiting for ${other_user.username} to accept your deliverable`)
                                    : (delivery.responder_status === 'accepted' 
                                        ? `Accepted by ${other_user.username}` 
                                        : `Waiting for ${other_user.username} to accept your deliverable`)
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                            <FaFile className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-gray-500 mb-2">No deliverables submitted yet</p>
                            {swap.status !== 'completed' && (
                              <p className="text-sm text-gray-500">
                                Upload your work using the form above
                              </p>
                            )}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Responder Deliverables */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {other_user.username}'s Deliverables
                    </h4>
                    
                    {/* Display the other user's deliverables */}
                    {(() => {
                      // Determine which file to show based on other user's role
                      const otherUserFile = current_user_role === 'requestor' 
                        ? deliveryData.delivery.responder_file 
                        : deliveryData.delivery.requestor_file;
                        
                      if (otherUserFile) {
                        return (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <FaFile className="text-green-600 h-5 w-5" />
                                <div>
                                  <h5 className="font-medium text-gray-900">{other_user.username}'s Deliverable</h5>
                                  <p className="text-sm text-gray-600">
                                    {current_user_role === 'requestor' 
                                      ? (deliveryData.delivery.responder_status === 'delivered' ? 'Delivered' : 'Accepted')
                                      : (deliveryData.delivery.requestor_status === 'delivered' ? 'Delivered' : 'Accepted')
                                    } 
                                    {deliveryData[current_user_role === 'requestor' ? 'responder' : 'requestor'].delivered_at && 
                                      ` on ${new Date(deliveryData[current_user_role === 'requestor' ? 'responder' : 'requestor'].delivered_at).toLocaleDateString()}`
                                    }
                                  </p>
                                  {/* Display filename */}
                                  <p className="text-xs text-green-700 mt-1">
                                    {otherUserFile.split('/').pop()}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={otherUserFile.startsWith('http') 
                                  ? otherUserFile 
                                  : `http://localhost:8000${otherUserFile}`}
                                download
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                              >
                                <FaDownload className="mr-2" />
                                Download
                              </a>
                            </div>
                            <div className="text-sm text-gray-700">
                              {/* Display comment if available */}
                              {(() => {
                                // Get comment based on other user's role
                                const otherUserComment = current_user_role === 'requestor'
                                  ? deliveryData.delivery.responder_comment
                                  : deliveryData.delivery.requestor_comment;
                                
                                if (otherUserComment && otherUserComment.trim()) {
                                  return <p className="whitespace-pre-wrap mb-3">{otherUserComment}</p>;
                                } else {
                                  return <p className="mb-3">{other_user.username} has delivered their work.</p>;
                                }
                              })()}
                              
                              {/* Show acceptance status or accept button */}
                              {(() => {
                                // For OTHER user's deliverable, we need to check if the CURRENT user has accepted it
                                const otherUserStatus = current_user_role === 'requestor'
                                  ? delivery.responder_status
                                  : delivery.requestor_status;
                                  
                                // For the OTHER user's delivery, WE (the current user) accept it
                                // So check if WE have accepted THEIR delivery
                                const weAcceptedTheirDelivery = current_user_role === 'requestor' 
                                  ? delivery.responder_status === 'accepted'
                                  : delivery.requestor_status === 'accepted';
                                
                                if (weAcceptedTheirDelivery) {
                                  return (
                                    <div className="mt-2 flex items-center">
                                      <div className="rounded-full w-3 h-3 mr-2 bg-green-500"></div>
                                      <span className="text-green-700">You have accepted this deliverable</span>
                                    </div>
                                  );
                                } else if (otherUserStatus === 'delivered') {
                                  return (
                                    <div className="mt-2">
                                      <button 
                                        onClick={handleMarkComplete}
                                        disabled={isMarkingComplete}
                                        className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center w-auto inline-flex"
                                      >
                                        {isMarkingComplete ? (
                                          <FaSpinner className="animate-spin mr-2" />
                                        ) : (
                                          <FaCheckCircle className="mr-2" />
                                        )}
                                        Accept Deliverable
                                      </button>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                            <FaFile className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-gray-500 mb-2">No deliverables received yet</p>
                            <p className="text-sm text-gray-500">
                              {other_user.username} hasn't submitted any deliverables
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Swap Details & Requirements</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Original Request Message</h4>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {swap.message || 'No message was provided with this swap request.'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <h4 className="font-medium text-gray-900 mb-3">What You're Providing</h4>
                      <p className="text-gray-700">
                        {current_user_role === 'requestor' 
                          ? gig.desired_skills
                          : gig.offered_skills}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                      <h4 className="font-medium text-gray-900 mb-3">What You're Receiving</h4>
                      <p className="text-gray-700">
                        {current_user_role === 'requestor' 
                          ? gig.offered_skills
                          : gig.desired_skills}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add comments section */}
          {comments && comments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0">
                          {comment.user.profile_picture ? (
                            <img 
                              src={`http://localhost:8000${comment.user.profile_picture}`} 
                              alt={comment.user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {comment.user.user_first_name || comment.user.username}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{comment.message}</p>
                        </div>
                      </div>
                      
                      {comment.file_attachment && (
                        <div className="mt-2 pl-13">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 ml-13">
                              {/* Display attachment filename */}
                              {comment.file_attachment.split('/').pop()}
                            </span>
                            <a 
                              href={comment.file_attachment.startsWith('http') 
                                ? comment.file_attachment 
                                : `http://localhost:8000${comment.file_attachment}`}
                              download
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center w-auto inline-flex"
                            >
                              <FaDownload className="mr-2" />
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Gig Details and Communication */}
        <div className="lg:col-span-1">
          {/* Gig Details Panel */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-100">
              <h3 className="text-md font-medium text-gray-800">Gig Details</h3>
            </div>
            <div className="p-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                {gig.image ? (
                  <img 
                    src={`http://localhost:8000${gig.image}`} 
                    alt={gig.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaFile className="w-12 h-12" />
                  </div>
                )}
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {gig.title}
              </h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Offering</p>
                  <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{gig.offered_skills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Looking For</p>
                  <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{gig.desired_skills}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUser className="text-blue-600 w-4 h-4" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-500">Swap with</p>
                    <p className="font-medium">{other_user.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaClock className="text-purple-600 w-4 h-4" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(swap.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Communication Panel */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <h3 className="text-md font-medium text-gray-800">Need help?</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Have questions or need to discuss this swap with {other_user.username}?
              </p>
              
              <Link
                to={`/dashboard/chat/${other_user.username}`}
                className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaCommentAlt className="mr-2" />
                Chat with {other_user.username}
              </Link>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-3">Delivery Status</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Your Delivery:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      current_user_role === 'requestor'
                        ? (delivery.requestor_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                           delivery.requestor_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800')
                        : (delivery.responder_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                           delivery.responder_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800')
                    }`}>
                      {current_user_role === 'requestor'
                        ? (delivery.requestor_status === 'accepted' ? 'Accepted by Admin' : 
                           delivery.requestor_status === 'delivered' ? 'Delivered' : 
                           'Pending')
                        : (delivery.responder_status === 'accepted' ? 'Accepted by Requester' : 
                           delivery.responder_status === 'delivered' ? 'Delivered' : 
                           'Pending')
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{other_user.username}'s Delivery:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      current_user_role === 'requestor'
                        ? (delivery.responder_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                           delivery.responder_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800')
                        : (delivery.requestor_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                           delivery.requestor_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800')
                    }`}>
                      {current_user_role === 'requestor'
                        ? (delivery.responder_status === 'accepted' ? 'Accepted by You' : 
                           delivery.responder_status === 'delivered' ? 'Delivered' : 
                           'Pending')
                        : (delivery.requestor_status === 'accepted' ? 'Accepted by You' : 
                           delivery.requestor_status === 'delivered' ? 'Delivered' : 
                           'Pending')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDelivery; 