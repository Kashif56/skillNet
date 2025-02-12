import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaHome,
  FaInbox,
  FaCalendar,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTrophy,
  FaChartLine,
  FaQuestionCircle,
  FaBriefcase,
  FaExchangeAlt
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { name: 'Profile', path: '/dashboard/profile', icon: FaUser },
    { name: 'Messages', path: '/dashboard/conversations', icon: FaInbox },
    { name: 'Schedule', path: '/dashboard/schedule', icon: FaCalendar },
    { name: 'Gigs', path: '/dashboard/gigs', icon: FaBriefcase },
    { name: 'Swap Requests', path: '/dashboard/swap-requests', icon: FaExchangeAlt },
    { name: 'Settings', path: '/dashboard/settings', icon: FaCog },
    { name: 'Analytics', path: '/dashboard/analytics', icon: FaChartLine },
    { name: 'Leaderboards', path: '/dashboard/leaderboards', icon: FaTrophy },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className="bg-white border-r border-gray-200 h-full transition-all duration-300"
    >
      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 shadow-sm z-50"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronLeft className="w-4 h-4 text-gray-600" />
        </motion.div>
      </button>

      {/* Navigation Menu */}
      <div className="mt-8 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.li
                key={item.path}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-8 w-full px-3">
        <div className={`p-4 bg-blue-50 rounded-lg ${isCollapsed ? 'mx-2' : ''}`}>
          {!isCollapsed && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-blue-900">Need Help?</h4>
              <p className="text-xs text-blue-700">Check our documentation</p>
            </div>
          )}
          <button className="w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaQuestionCircle className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2 text-sm">Support</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
