import React, { useState } from 'react';
import { FaBell, FaSignOutAlt, FaCog, FaChevronDown, FaUser, FaInbox } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const DashboardNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { isAuthenticated, userData, token, username, refreshToken } = useSelector((state) => state.auth);
  console.log('DashboardNavbar:', { isAuthenticated, userData, token, username, refreshToken });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const[loading, setLoading] = useState(false);

  const [notifications] = useState([
    {
      id: 1,
      title: 'New Skill Swap Request',
      message: 'Alex wants to learn React.js',
      time: '5 min ago',
      type: 'request',
      unread: true
    },
    {
      id: 2,
      title: 'Session Reminder',
      message: 'UI/UX Workshop in 1 hour',
      time: '1 hour ago',
      type: 'reminder',
      unread: true
    },
    {
      id: 3,
      title: 'New Message',
      message: 'Sarah sent you a message',
      time: '2 hours ago',
      type: 'message',
      unread: false
    }
  ]);

  const handleLogout = () => {
    setLoading(true);
    authService.logout();
    setLoading(false);

  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 fixed w-full z-30 top-0">
      <div className="px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Brand */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Skill</span>
            <span className="text-2xl font-bold text-gray-800">Net</span>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            {/* <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                Find Mentors
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Session
              </button>
            </div> */}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <FaBell className="text-gray-600 w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Notifications
                        </h3>
                        <button className="text-xs text-blue-600 hover:text-blue-700">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="relative">
              <Link to="/dashboard/conversations" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <FaInbox className="text-gray-600 w-5 h-5" />
              </Link>
            </div>

            {/* Profile Menu */}
            { isAuthenticated && token && (
              <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{username.charAt(0)}</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">{username}</div>
                 
                </div>
                <FaChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link to="/dashboard/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <FaUser className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link to="/dashboard/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <FaCog className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="w-4 h-4 mr-3" />
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            ) }
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
