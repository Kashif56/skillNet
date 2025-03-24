import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  FaExchangeAlt, 
  FaListAlt, 
  FaUserPlus, 
  FaInfoCircle, 
  FaPlus, 
  FaPaperPlane,
  FaInbox,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { getActivityFeed } from '../../services/dashboard';

const getActivityIcon = (type) => {
  switch (type) {
    case 'swap_completed':
      return { icon: <FaCheck />, color: 'text-green-500', bgColor: 'bg-green-100' };
    case 'swap_accepted':
      return { icon: <FaExchangeAlt />, color: 'text-blue-500', bgColor: 'bg-blue-100' };
    case 'gig_created':
      return { icon: <FaPlus />, color: 'text-purple-500', bgColor: 'bg-purple-100' };
    case 'user_joined':
      return { icon: <FaUserPlus />, color: 'text-indigo-500', bgColor: 'bg-indigo-100' };
    case 'new_request':
      return { icon: <FaInbox />, color: 'text-teal-500', bgColor: 'bg-teal-100' };
    case 'request_sent':
      return { icon: <FaPaperPlane />, color: 'text-purple-500', bgColor: 'bg-purple-100' };
    case 'request_rejected':
      return { icon: <FaTimes />, color: 'text-red-500', bgColor: 'bg-red-100' };
    case 'system':
      return { icon: <FaInfoCircle />, color: 'text-teal-500', bgColor: 'bg-teal-100' };
    default:
      return { icon: <FaListAlt />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  }
};

const ActivityItem = ({ activity }) => {
  const { icon, color, bgColor } = getActivityIcon(activity.type);
  
  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'some time ago';
    }
  };

  const getActionButton = (type) => {
    switch (type) {
      case 'new_request':
        return (
          <div className="flex space-x-2 mt-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors">
              Accept
            </button>
            <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors">
              Decline
            </button>
          </div>
        );
      case 'swap_accepted':
        return (
          <button className="px-3 py-1 mt-2 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors">
            Complete Swap
          </button>
        );
      default:
        return null;
    }
  };

  return (
      <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start space-x-3 pb-5"
    >
      <div className={`p-2 rounded-full ${bgColor} flex-shrink-0 mt-1`}>
        <span className={`${color}`}>{icon}</span>
              </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm text-gray-800">{activity.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
        {getActionButton(activity.type)}
        <span className="text-xs text-gray-400 block mt-1">{formatTime(activity.time)}</span>
              </div>
            </motion.div>
          );
};

const ActivityFeed = ({ activities: propActivities }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      // If activities were passed as a prop, use those
      if (propActivities && propActivities.length > 0) {
        setActivities(propActivities);
        return;
      }

      // Otherwise fetch from API
      try {
        setLoading(true);
        const data = await getActivityFeed();
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching activity feed:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [propActivities]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-100 bg-gray-50 rounded-lg">
        <FaInfoCircle className="mx-auto text-gray-300 text-3xl mb-3" />
        <p className="text-gray-500">No activities yet</p>
        <p className="text-xs text-gray-400 mt-1">Create gigs or send swap requests to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 divide-y divide-gray-100 max-h-[600px] overflow-y-auto pr-2">
      {activities.map((activity, index) => (
        <ActivityItem 
          key={`${activity.type}-${index}-${activity.time}`} 
          activity={activity} 
        />
      ))}
    </div>
  );
};

export default ActivityFeed;
