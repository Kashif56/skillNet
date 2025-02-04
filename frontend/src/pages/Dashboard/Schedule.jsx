import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarPlus, 
  FaClock, 
  FaUser, 
  FaVideo,
  FaChalkboardTeacher,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // week or month

  const scheduleItems = [
    {
      id: 1,
      title: 'React Native Basics',
      type: 'Teaching',
      student: 'Alex Johnson',
      time: '2:00 PM - 3:00 PM',
      date: '2025-02-04',
      platform: 'Zoom',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'UI/UX Design Workshop',
      type: 'Learning',
      teacher: 'Sarah Wilson',
      time: '4:00 PM - 5:30 PM',
      date: '2025-02-04',
      platform: 'Google Meet',
      status: 'upcoming'
    },
    // Add more items as needed
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
          <p className="text-gray-600">Manage your upcoming sessions and availability</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaCalendarPlus className="mr-2" />
          New Session
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg ${
                view === 'week' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg ${
                view === 'month' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <span className="text-lg font-medium text-gray-800 min-w-[150px] text-center">
              February 2025
            </span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search sessions..."
                className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FaFilter className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {scheduleItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  item.type === 'Teaching' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.type === 'Teaching' ? <FaChalkboardTeacher className="w-5 h-5" /> : <FaUser className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {item.time}
                    </span>
                    <span className="flex items-center">
                      <FaVideo className="mr-1" />
                      {item.platform}
                    </span>
                    <span className="flex items-center">
                      {item.type === 'Teaching' ? (
                        <>
                          <FaUser className="mr-1" />
                          {item.student}
                        </>
                      ) : (
                        <>
                          <FaChalkboardTeacher className="mr-1" />
                          {item.teacher}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  item.status === 'upcoming' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                <button className="px-4 py-2 text-sm bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                  Join Session
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
