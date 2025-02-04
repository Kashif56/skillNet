import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBell, FaLock, FaCreditCard, FaGlobe, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: FaUser },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'security', name: 'Security', icon: FaLock },
    { id: 'billing', name: 'Billing', icon: FaCreditCard },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 last:mb-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      defaultValue="Experienced teacher specializing in mathematics and physics..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teaching Languages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['English', 'Spanish', 'French'].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          <FaGlobe />
                          <span>{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h3 className="font-medium text-gray-800 capitalize">{key} Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via {key}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`text-2xl ${value ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        {value ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing Information</h2>
                
                <div className="bg-blue-50 text-blue-600 p-4 rounded-lg">
                  <p>You are currently on the Professional Plan</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium text-gray-800">Payment Method</h3>
                      <p className="text-sm text-gray-600">Visa ending in 4242</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">Edit</button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Billing Cycle</h3>
                      <p className="text-sm text-gray-600">Next billing date: March 1, 2025</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">Change Plan</button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
