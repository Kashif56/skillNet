import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEllipsisV, FaTrash, FaPlus, FaSpinner, FaEye, FaMousePointer, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllGigs, getGigDetail } from '../../services/gigs';
import { Link } from 'react-router-dom';


const GigStatus = {
  ACTIVE: 'ACTIVE',
  PENDING_APPROVAL: 'PENDING APPROVAL',
  REQUIRES_MODIFICATION: 'REQUIRES MODIFICATION',
  DRAFT: 'DRAFT',
  DENIED: 'DENIED',
  PAUSED: 'PAUSED'
};

const Gigs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(GigStatus.ACTIVE);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [timeFilter, setTimeFilter] = useState('LAST 30 DAYS');
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusTabs = [
    { status: GigStatus.ACTIVE, count: filteredGigs.filter(g => g.status === GigStatus.ACTIVE).length },
    { status: GigStatus.PAUSED, count: 0 }
  ];

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const response = await getAllGigs();
      if(response.status === 'success') {
        console.log(response.data);
        setGigs(response.data);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const filtered = gigs.filter(gig => 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.offering.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.lookingFor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGigs(filtered);
    } else {
      setFilteredGigs(gigs);
    }
  }, [searchParams, gigs]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGigs(filteredGigs.map(gig => gig.id));
    } else {
      setSelectedGigs([]);
    }
  };

  const handleSelectGig = (gigId) => {
    setSelectedGigs(prev => {
      if (prev.includes(gigId)) {
        return prev.filter(id => id !== gigId);
      } else {
        return [...prev, gigId];
      }
    });
  };

  const handleDeleteSelected = () => {
    // Handle deleting selected gigs
    console.log('Deleting gigs:', selectedGigs);
  };

  const displayGigs = filteredGigs

  return (
    <>
    {loading ? (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
      </div>
    ) : (
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gigs</h1>
          <div className="flex items-center space-x-4">
         
            <button
              onClick={() => navigate('/dashboard/gigs/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer" 
            >
              <FaPlus size={16} />
              <span>CREATE A NEW GIG</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {statusTabs.map(({ status, count }) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`pb-4 px-1 relative ${activeTab === status ? 'text-[#4A90E2]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="flex items-center">
                  {status}
                  {count > 0 && (
                    <span className={`ml-2 rounded-full text-xs px-2 py-0.5 ${activeTab === status ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {count}
                    </span>
                  )}
                </span>
                {activeTab === status && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A90E2]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gigs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="font-medium text-gray-700">ACTIVE GIGS</h2>
              {selectedGigs.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete Selected ({selectedGigs.length})
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>LAST 30 DAYS</option>
                <option>LAST 60 DAYS</option>
                <option>LAST 90 DAYS</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedGigs.length === displayGigs.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GIG
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaEye className="mr-1 text-gray-400" />
                    IMPRESSIONS
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaMousePointer className="mr-1 text-gray-400" />
                    CLICKS
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaExchangeAlt className="mr-1 text-gray-400" />
                    SWAPS
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {displayGigs.length > 0 ? (
                displayGigs.map((gig) => (
                  <tr key={gig.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedGigs.includes(gig.id)}
                        onChange={() => handleSelectGig(gig.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/dashboard/gigs/${gig.gigId}`} className="block">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-lg object-cover" src={`http://localhost:8000${gig.gigImage}`} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">{gig.title}</div>
                            <div className="flex space-x-4 text-xs">
                              <div>
                                <span className="text-blue-600 font-medium">Offering:</span>
                                <span className="text-gray-500 ml-1">{gig.offeredSkills}</span>
                              </div>
                              <div>
                                <span className="text-green-600 font-medium">Looking for:</span>
                                <span className="text-gray-500 ml-1">{gig.desiredSkills}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-700">{gig.impressions || 0}</span>
                        <span className="text-xs text-gray-500">Impressions</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-700">{gig.clicks || 0}</span>
                        <span className="text-xs text-gray-500">Clicks</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-700">{gig.swaps || 0}</span>
                        <span className="text-xs text-gray-500">Swaps</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link 
                          to={`/dashboard/gigs/${gig.gigId}/edit`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                          <FaEllipsisV className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FaPlus className="text-gray-300 mb-3 text-3xl" />
                      <p className="text-gray-500 mb-2">No gigs found</p>
                      <button 
                        onClick={() => navigate('/dashboard/gigs/create')}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Gig
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )}
    
    </>
  );
};

export default Gigs;
