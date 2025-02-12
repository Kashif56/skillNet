import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaExchangeAlt, FaCheck, FaTimes, FaFilter, FaSearch, FaSortAmountDown, FaCommentAlt, FaTrash } from 'react-icons/fa';
import { getMySwapRequests, respondToSwapRequest, withdrawSwapRequest } from '../../services/core';
import { toast } from 'react-toastify';

const SwapRequests = () => {
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('received');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const response = await getMySwapRequests();
      
      if (response.status === 'success') {
        setRequests({
          sent: response.sent,
          received: response.received
        });
      }
    } catch (err) {
      setError('Failed to load swap requests');
      toast.error('Failed to load swap requests. Please try again.');
      console.error('Error fetching swap requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (swapId, action, username) => {
    try {
      setActionLoading(swapId);
      const response = await respondToSwapRequest(swapId, action);
      
      if (response.status === 'success') {
        toast.success(
          action === 'accepted' 
            ? `Successfully accepted ${username}'s swap request`
            : `Successfully rejected ${username}'s swap request`
        );
        await fetchSwapRequests(); // Refresh the requests list
      } else {
        throw new Error(response.data || 'Failed to process request');
      }
    } catch (err) {
      toast.error(
        err.message || `Failed to ${action === 'accepted' ? 'accept' : 'reject'} the swap request`
      );
      console.error(`Error ${action}ing request:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdraw = async (swapId, gigTitle) => {
    try {
      setActionLoading(swapId);
      const response = await withdrawSwapRequest(swapId);
      
      if (response.status === 'success') {
        toast.success(`Successfully withdrew swap request for "${gigTitle}"`);
        await fetchSwapRequests(); // Refresh the requests list
      } else {
        throw new Error(response.data || 'Failed to withdraw request');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw the swap request');
      console.error('Error withdrawing request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const filterRequests = (requests) => {
    return requests.filter(request => {
      // Filter by status
      if (filters.status !== 'all' && request.status !== filters.status) return false;
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesGigTitle = request.gig.title.toLowerCase().includes(searchTerm);
        const matchesUsername = (activeTab === 'sent' 
          ? request.responder.username 
          : request.requestor.username
        ).toLowerCase().includes(searchTerm);
        
        if (!matchesGigTitle && !matchesUsername) return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by date
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  };

  const RequestCard = ({ request, type }) => {
    const otherUser = type === 'sent' ? request.responder : request.requestor;
    const showActions = type === 'received' && request.status === 'pending';
    const showWithdraw = type === 'sent' && request.status === 'pending';
    
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:8000/${otherUser.profile_picture}`}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {otherUser.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </div>

        <div className="p-4">
          <Link 
            to={`/gigs/${request.gig.gigId}`} 
            className="block mb-3 hover:underline"
          >
            <h4 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
              {request.gig.title}
            </h4>
          </Link>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md mb-4">
            {request.message || 'No message provided'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/dashboard/messages/${otherUser.username}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaCommentAlt className="w-4 h-4 mr-2" />
              Chat with {otherUser.user_first_name}
            </Link>

            {showActions && (
              <>
                <button
                  onClick={() => handleRequestResponse(request.swapId, 'accepted', otherUser.username)}
                  disabled={actionLoading === request.swapId}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  {actionLoading === request.swapId ? (
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FaCheck className="w-4 h-4 mr-2" />
                  )}
                  Accept Request
                </button>

                <button
                  onClick={() => handleRequestResponse(request.swapId, 'rejected', otherUser.username)}
                  disabled={actionLoading === request.swapId}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                >
                  {actionLoading === request.swapId ? (
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FaTimes className="w-4 h-4 mr-2" />
                  )}
                  Reject Request
                </button>
              </>
            )}

            {showWithdraw && (
              <button
                onClick={() => handleWithdraw(request.swapId, request.gig.title)}
                disabled={actionLoading === request.swapId}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
              >
                {actionLoading === request.swapId ? (
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaTrash className="w-4 h-4 mr-2" />
                )}
                Withdraw Request
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchSwapRequests}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredRequests = filterRequests(activeTab === 'received' ? requests.received : requests.sent);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Swap Requests</h1>
            <p className="text-gray-600 mt-1">Manage your skill exchange requests</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-md border flex items-center gap-2 ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setActiveTab('received')}
                className={`px-4 py-2 ${
                  activeTab === 'received'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Received ({requests.received.length})
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 ${
                  activeTab === 'sent'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sent ({requests.sent.length})
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search by title or username"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="relative">
                  <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard key={request.swapId} request={request} type={activeTab} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FaExchangeAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
                <p className="mt-2 text-gray-500">
                  {filters.search || filters.status !== 'all' 
                    ? 'Try adjusting your filters'
                    : `No ${activeTab} requests yet`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequests;
