import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaExchangeAlt, FaStar, FaClock, FaTrophy,
  FaChartLine, FaUsers 
} from 'react-icons/fa';

import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';

// Import Dashboard Pages
import Messages from './Messages';
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

const DashboardHome = () => {
  const stats = [
    {
      title: 'Active Swaps',
      value: '12',
      icon: FaExchangeAlt,
      trend: 8,
      color: 'blue'
    },
    {
      title: 'Total Hours',
      value: '48',
      icon: FaClock,
      trend: 12,
      color: 'green'
    },
    {
      title: 'Rating',
      value: '4.9',
      icon: FaStar,
      color: 'yellow'
    },
    {
      title: 'XP Points',
      value: '2,450',
      icon: FaTrophy,
      trend: 15,
      color: 'purple'
    }
  ];

  const chartData = {
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

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, John! Here's your activity overview.</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <FaUsers className="inline-block mr-2" />
            Find Partners
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaExchangeAlt className="inline-block mr-2" />
            New Swap
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Progress & Goals */}
        <div className="space-y-8">
          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hours Taught</span>
                <span className="text-sm font-medium text-gray-800">8/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">React Native Basics</p>
                  <p className="text-xs text-gray-500">Tomorrow, 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">UI/UX Workshop</p>
                  <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
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
