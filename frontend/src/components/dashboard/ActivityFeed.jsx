import React from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaComment, FaStar, FaCalendarCheck } from 'react-icons/fa';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'swap_request',
      title: 'New Skill Swap Request',
      description: 'Sarah requested to swap UI/UX Design for Python Programming',
      time: '2 hours ago',
      icon: FaExchangeAlt,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'Mike sent you a message about the JavaScript session',
      time: '4 hours ago',
      icon: FaComment,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'review',
      title: 'New Review',
      description: 'You received a 5-star review for your React.js tutorial',
      time: '1 day ago',
      icon: FaStar,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 4,
      type: 'session',
      title: 'Upcoming Session',
      description: 'React Native basics with Alex tomorrow at 3 PM',
      time: 'in 1 day',
      icon: FaCalendarCheck,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              variants={item}
              className="flex items-start space-x-4"
            >
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ActivityFeed;
