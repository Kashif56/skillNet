import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaClock, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Analytics = () => {
  const stats = [
    { title: 'Total Sessions', value: '156', change: '+12%', isPositive: true, icon: FaUsers },
    { title: 'Hours Taught', value: '342', change: '+8%', isPositive: true, icon: FaClock },
    { title: 'Average Rating', value: '4.8', change: '+0.2', isPositive: true, icon: FaStar },
    { title: 'Completion Rate', value: '94%', change: '-2%', isPositive: false, icon: FaChartLine },
  ];

  const performanceData = [
    { month: 'Jan', sessions: 45 },
    { month: 'Feb', sessions: 52 },
    { month: 'Mar', sessions: 48 },
    { month: 'Apr', sessions: 58 },
    { month: 'May', sessions: 62 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600">Track your teaching performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-blue-50">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-sm font-medium flex items-center ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions Overview</h3>
          <div className="h-64 flex items-end justify-between">
            {performanceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${data.sessions * 2}px` }}
                ></div>
                <span className="text-sm text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Feedback</h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-8 text-sm text-gray-600">{rating}★</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${100 - (5 - rating) * 15}%` }}
                    ></div>
                  </div>
                </div>
                <span className="w-12 text-sm text-gray-600 text-right">
                  {100 - (5 - rating) * 15}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
