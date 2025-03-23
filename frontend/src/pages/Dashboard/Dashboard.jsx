import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaExchangeAlt, FaStar, FaClock, FaTrophy,
  FaChartLine, FaUsers, FaCheckCircle,
  FaArrowRight, FaCalendarCheck, FaClipboardList,
  FaInbox, FaPaperPlane
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { getDashboardStats, getChartData, getActivityFeed, getSwapStatus } from '../../services/dashboard';

// Import Dashboard Pages
import Schedule from './Schedule';
import Profile from './Profile';
import Analytics from './Analytics';
import Leaderboards from './Leaderboards';
import Settings from './Settings';
import Gigs from './Gigs';
import CreateGig from './CreateGig';
import GigDetail from './GigDetail';
import EditGig from './EditGig';
import SwapRequests from './SwapRequests';
import Conversations from './Conversations';
import Chat from './Chat';

// Swap Card Component
const SwapCard = ({ swap, requestType = null }) => {
  const statusColors = {
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    'completed': <FaCheckCircle className="w-4 h-4" />,
    'accepted': <FaExchangeAlt className="w-4 h-4" />,
    'pending': <FaClock className="w-4 h-4" />,
    'sent': <FaPaperPlane className="w-4 h-4" />,
    'received': <FaInbox className="w-4 h-4" />
  };

  // Determine which icon to show
  let Icon;
  if (requestType === 'sent') {
    Icon = statusIcons.sent;
  } else if (requestType === 'received') {
    Icon = statusIcons.received;
  } else {
    Icon = statusIcons[swap.status] || null;
  }

  // Determine the background color for the icon
  let iconBgColor;
  if (requestType === 'sent') {
    iconBgColor = 'bg-purple-100';
  } else if (requestType === 'received') {
    iconBgColor = 'bg-teal-100';
  } else {
    iconBgColor = swap.status === 'completed' ? 'bg-green-100' : 'bg-blue-100';
  }

  // Determine the status label to display
  let statusLabel;
  if (requestType === 'sent') {
    statusLabel = 'sent';
  } else if (requestType === 'received') {
    statusLabel = 'received';
  } else {
    statusLabel = swap.status;
  }

  // Determine the status label color
  let statusLabelColor;
  if (requestType === 'sent') {
    statusLabelColor = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (requestType === 'received') {
    statusLabelColor = 'bg-teal-100 text-teal-800 border-teal-200';
  } else {
    statusLabelColor = statusColors[swap.status];
  }

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'some time ago';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          {Icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 text-base">{swap.title}</h3>
          <span className="text-xs text-gray-500">{formatTime(swap.date)}</span>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusLabelColor}`}>
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{swap.details}</p>
      <div className="flex justify-end">
        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
          View Details <FaArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User');
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllSent, setShowAllSent] = useState(false);
  const [showAllReceived, setShowAllReceived] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get user info from localStorage
        try {
          const username = localStorage.getItem('username');
          if (username) {
            setUserName(username);
          }
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
        }

        // Fetch dashboard stats
        let statsData;
        let chart;
        let swapData;
        let activityData;
        
        try {
          statsData = await getDashboardStats();
          
          // Verify the statsData has the expected structure
          if (!statsData || !statsData.stats) {
            throw new Error('Invalid stats data format received from API');
          }
        } catch (err) {
          console.error('Error fetching dashboard stats:', err);
          // Use fallback data if API fails
          statsData = {
            stats: {
              active_swaps: { value: 5, trend: 10 },
              rating: { value: 4.5 },
              xp_points: { value: 1250, trend: 5 }
            }
          };
        }

        try {
          chart = await getChartData();
          
          // Verify chart data has expected structure
          if (!chart || !chart.labels || !chart.datasets) {
            throw new Error('Invalid chart data format received from API');
          }
        } catch (err) {
          console.error('Error fetching chart data:', err);
          // Use fallback chart data if API fails
          chart = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Skill Swaps',
                data: [4, 6, 8, 7, 10, 12],
                borderColor: '#4A90E2',
                tension: 0.4
              }
            ]
          };
        }

        // Fetch activity data first since we'll need it for both activity feed and swaps
        try {
          activityData = await getActivityFeed();
          if (Array.isArray(activityData)) {
            setActivities(activityData);
            
            // Extract swap requests (pending) from activity feed
            const sent = [];
            const received = [];
            
            activityData.forEach(activity => {
              if (activity.type === 'request_sent') {
                sent.push({
                  id: activity.swap_id || Math.random().toString(36).substr(2, 9),
                  status: 'pending',
                  title: activity.title,
                  details: activity.details,
                  date: activity.time,
                  gig_id: activity.gig_id,
                  other_user: activity.other_user
                });
              } else if (activity.type === 'new_request') {
                received.push({
                  id: activity.swap_id || Math.random().toString(36).substr(2, 9),
                  status: 'pending',
                  title: activity.title,
                  details: activity.details,
                  date: activity.time,
                  gig_id: activity.gig_id,
                  other_user: activity.other_user
                });
              }
            });
            
            setSentRequests(sent);
            setReceivedRequests(received);
          }
        } catch (err) {
          console.error('Error fetching activity feed:', err);
          // We still continue even if this fails
        }

        // Fetch swap status data
        try {
          swapData = await getSwapStatus();
          
          if (swapData && swapData.active_swaps && swapData.completed_swaps) {
            setActiveSwaps(swapData.active_swaps);
            setCompletedSwaps(swapData.completed_swaps);
          } else {
            // Fallback to extracting from activity feed if the dedicated endpoint fails
            try {
              if (Array.isArray(activityData)) {
                // Extract active and completed swaps from activity feed
                const active = [];
                const completed = [];
                
                activityData.forEach(activity => {
                  if (activity.type === 'swap_accepted') {
                    active.push({
                      id: activity.swap_id || Math.random().toString(36).substr(2, 9),
                      status: 'accepted',
                      title: activity.title,
                      details: activity.details,
                      date: activity.time,
                      gig_id: activity.gig_id,
                      other_user: activity.other_user
                    });
                  } else if (activity.type === 'swap_completed') {
                    completed.push({
                      id: activity.swap_id || Math.random().toString(36).substr(2, 9),
                      status: 'completed',
                      title: activity.title,
                      details: activity.details,
                      date: activity.time,
                      gig_id: activity.gig_id,
                      other_user: activity.other_user
                    });
                  }
                });
                
                if (active.length > 0) setActiveSwaps(active);
                if (completed.length > 0) setCompletedSwaps(completed);
              }
            } catch (err) {
              console.error('Error processing activity data for swaps:', err);
              // Even if this fails, we continue with empty arrays
            }
          }
        } catch (err) {
          console.error('Error fetching swap status:', err);
          // We'll fallback to empty arrays if both methods fail
        }

        // Format the stats data for the UI
        const formattedStats = [
          {
            title: 'Active Swaps',
            value: String(activeSwaps.length || statsData.stats.active_swaps.value || 0),
            icon: FaExchangeAlt,
            trend: statsData.stats.active_swaps.trend || 0,
            color: 'blue'
          },
          {
            title: 'Rating',
            value: String(statsData.stats.rating.value || 0),
            icon: FaStar,
            color: 'yellow'
          },
          {
            title: 'Completed Swaps',
            value: String(completedSwaps.length || 0),
            icon: FaCalendarCheck,
            color: 'green'
          },
          {
            title: 'Pending Requests',
            value: String(sentRequests.length + receivedRequests.length || 0),
            icon: FaClipboardList,
            color: 'purple'
          }
        ];

        setStats(formattedStats);
        setChartData(chart);
        setError(null);
      } catch (err) {
        console.error('Error in dashboard data fetching:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Determine which swaps to display based on toggle state
  const displayActiveSwaps = showAllActive ? activeSwaps : activeSwaps.slice(0, 3);
  const displayCompletedSwaps = showAllCompleted ? completedSwaps : completedSwaps.slice(0, 3);
  const displaySentRequests = showAllSent ? sentRequests : sentRequests.slice(0, 3);
  const displayReceivedRequests = showAllReceived ? receivedRequests : receivedRequests.slice(0, 3);

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName}! Here's your activity overview.</p>
        </div>
       
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Swap Status Sections */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Active Swaps */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaExchangeAlt className="text-blue-500" /> Active Swaps
                </h2>
                {activeSwaps.length > 3 && (
                  <button 
                    onClick={() => setShowAllActive(!showAllActive)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {showAllActive ? 'Show Less' : 'View All'} 
                    {!showAllActive && <FaArrowRight className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {displayActiveSwaps.length > 0 ? (
                <div className="space-y-4">
                  {displayActiveSwaps.map(swap => (
                    <SwapCard key={swap.id} swap={swap} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                  <FaExchangeAlt className="mx-auto text-gray-300 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No active swaps found</p>
                </div>
              )}
            </div>
            
            {/* Completed Swaps */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Completed Swaps
                </h2>
                {completedSwaps.length > 3 && (
                  <button 
                    onClick={() => setShowAllCompleted(!showAllCompleted)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {showAllCompleted ? 'Show Less' : 'View All'} 
                    {!showAllCompleted && <FaArrowRight className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {displayCompletedSwaps.length > 0 ? (
                <div className="space-y-4">
                  {displayCompletedSwaps.map(swap => (
                    <SwapCard key={swap.id} swap={swap} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                  <FaCheckCircle className="mx-auto text-gray-300 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No completed swaps yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sent Requests */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaPaperPlane className="text-purple-500" /> Sent Requests
                </h2>
                {sentRequests.length > 3 && (
                  <button 
                    onClick={() => setShowAllSent(!showAllSent)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {showAllSent ? 'Show Less' : 'View All'} 
                    {!showAllSent && <FaArrowRight className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {displaySentRequests.length > 0 ? (
                <div className="space-y-4">
                  {displaySentRequests.map(request => (
                    <SwapCard key={request.id} swap={request} requestType="sent" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                  <FaPaperPlane className="mx-auto text-gray-300 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No sent requests</p>
                  <button className="mt-3 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 transition-colors">
                    Find Gigs to Request
                  </button>
                </div>
              )}
            </div>
            
            {/* Received Requests */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaInbox className="text-teal-500" /> Received Requests
                </h2>
                {receivedRequests.length > 3 && (
                  <button 
                    onClick={() => setShowAllReceived(!showAllReceived)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {showAllReceived ? 'Show Less' : 'View All'} 
                    {!showAllReceived && <FaArrowRight className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {displayReceivedRequests.length > 0 ? (
                <div className="space-y-4">
                  {displayReceivedRequests.map(request => (
                    <SwapCard key={request.id} swap={request} requestType="received" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                  <FaInbox className="mx-auto text-gray-300 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No received requests</p>
                  <button className="mt-3 px-3 py-1.5 bg-teal-100 text-teal-700 text-xs rounded-lg hover:bg-teal-200 transition-colors">
                    Create a Gig to Receive Requests
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaChartLine className="text-purple-500" /> Recent Activity
            </h2>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar />
      </div>
      <div className="flex h-full pt-16">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
          <Sidebar isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
        </div>
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} overflow-y-auto`}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leaderboards" element={<Leaderboards />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="gigs" element={<Gigs />} />
            <Route path="gigs/create" element={<CreateGig />} />
            <Route path="gigs/:gigId" element={<GigDetail />} />
            <Route path="gigs/:gigId/edit" element={<EditGig />} />
            <Route path="swap-requests" element={<SwapRequests />} />
            <Route path="conversations/" element={<Conversations />} />
            <Route path="chat/:username" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
