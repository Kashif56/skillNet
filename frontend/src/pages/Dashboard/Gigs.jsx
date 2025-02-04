import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEllipsisV, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  
  // Temporary mock data
  const [gigs] = useState([
    {
      id: 1,
      title: 'be your react or jquery frontend web developer and do frontend development',
      impressions: 132,
      clicks: 2,
      orders: 0,
      cancellations: '0 %',
      status: GigStatus.ACTIVE,
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      offering: 'React Development',
      lookingFor: 'UI/UX Design'
    },
    {
      id: 2,
      title: 'develop custom website, business website development as full stack web',
      impressions: 138,
      clicks: 6,
      orders: 0,
      cancellations: '0 %',
      status: GigStatus.ACTIVE,
      thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      offering: 'Full Stack Development',
      lookingFor: 'Digital Marketing'
    },
    {
      id: 3,
      title: 'be your backend web developer and do website development in python django',
      impressions: 170,
      clicks: 4,
      orders: 0,
      cancellations: '0 %',
      status: GigStatus.ACTIVE,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      offering: 'Django Development',
      lookingFor: 'Frontend Development'
    }
  ]);

  const statusTabs = [
    { status: GigStatus.ACTIVE, count: filteredGigs.filter(g => g.status === GigStatus.ACTIVE).length },
    { status: GigStatus.PENDING_APPROVAL, count: 0 },
    { status: GigStatus.REQUIRES_MODIFICATION, count: 0 },
    { status: GigStatus.DRAFT, count: 0 },
    { status: GigStatus.DENIED, count: 0 },
    { status: GigStatus.PAUSED, count: 0 }
  ];

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

  const displayGigs = filteredGigs.filter(gig => gig.status === activeTab);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gigs</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Accepting Custom Orders</span>
              <button 
                onClick={() => setAcceptingOrders(!acceptingOrders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${acceptingOrders ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${acceptingOrders ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <button
              onClick={() => navigate('/dashboard/gigs/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  IMPRESSIONS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLICKS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ORDERS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CANCELLATIONS
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayGigs.map((gig) => (
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
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover" src={gig.thumbnail} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">{gig.title}</div>
                        <div className="flex space-x-4 text-xs">
                          <div>
                            <span className="text-blue-600 font-medium">Offering:</span>
                            <span className="text-gray-500 ml-1">{gig.offering}</span>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">Looking for:</span>
                            <span className="text-gray-500 ml-1">{gig.lookingFor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gig.impressions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gig.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gig.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gig.cancellations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <FaEllipsisV />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gigs;
