import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaStar, FaClock, FaUsers, FaSearch } from 'react-icons/fa';

const Leaderboards = () => {
  const [activeCategory, setActiveCategory] = useState('top-rated');
  
  const categories = [
    { id: 'top-rated', name: 'Top Rated', icon: FaStar },
    { id: 'most-sessions', name: 'Most Sessions', icon: FaClock },
    { id: 'most-students', name: 'Most Students', icon: FaUsers },
  ];

  const leaderboardData = [
    { rank: 1, name: 'John Smith', score: '4.9', sessions: 245, students: 180, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { rank: 2, name: 'Sarah Johnson', score: '4.8', sessions: 232, students: 165, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { rank: 3, name: 'Michael Brown', score: '4.8', sessions: 228, students: 155, avatar: 'https://randomuser.me/api/portraits/men/86.jpg' },
    { rank: 4, name: 'Emily Davis', score: '4.7', sessions: 215, students: 142, avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
    { rank: 5, name: 'David Wilson', score: '4.7', sessions: 208, students: 138, avatar: 'https://randomuser.me/api/portraits/men/54.jpg' },
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreValue = (item, category) => {
    switch (category) {
      case 'top-rated': return item.score;
      case 'most-sessions': return item.sessions;
      case 'most-students': return item.students;
      default: return item.score;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leaderboards</h1>
        <p className="text-gray-600">See how you rank among other teachers</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <category.icon />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-lg shadow-sm">
        {leaderboardData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 text-center font-bold ${getRankColor(item.rank)}`}>
                  {item.rank <= 3 ? <FaTrophy /> : item.rank}
                </div>
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="flex items-center">
                      {activeCategory === 'top-rated' && <FaStar className="mr-1 text-yellow-400" />}
                      {activeCategory === 'most-sessions' && <FaClock className="mr-1 text-blue-400" />}
                      {activeCategory === 'most-students' && <FaUsers className="mr-1 text-green-400" />}
                      {getScoreValue(item, activeCategory)}
                      {activeCategory === 'top-rated' && ' rating'}
                      {activeCategory === 'most-sessions' && ' sessions'}
                      {activeCategory === 'most-students' && ' students'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-sm bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboards;
