import axiosInstance from '../utils/axiosInstance';

/**
 * Fetch dashboard stats including active swaps, rating, and XP points
 */
export const getDashboardStats = async () => {
  console.log('Calling API: /api/dashboard/stats/');
  try {
    const response = await axiosInstance.get('/api/dashboard/stats/');
    console.log('Stats API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    console.error('API error details:', error.response?.data || 'No response data');
    throw error;
  }
};

/**
 * Fetch chart data for the skill swaps over time
 */
export const getChartData = async () => {
  console.log('Calling API: /api/dashboard/chart-data/');
  try {
    const response = await axiosInstance.get('/api/dashboard/chart-data/');
    console.log('Chart API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    console.error('API error details:', error.response?.data || 'No response data');
    throw error;
  }
};

/**
 * Fetch activity feed data
 */
export const getActivityFeed = async () => {
  console.log('Calling API: /api/dashboard/activity-feed/');
  try {
    const response = await axiosInstance.get('/api/dashboard/activity-feed/');
    console.log('Activity feed API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Fetch active and completed swaps data
 */
export const getSwapStatus = async () => {
  console.log('Calling API: /api/dashboard/swap-status/');
  try {
    const response = await axiosInstance.get('/api/dashboard/swap-status/');
    console.log('Swap status API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching swap status:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Fetch all dashboard data at once
 */
export const getAllDashboardData = async () => {
  try {
    const [stats, chartData, activityFeed, swapStatus] = await Promise.all([
      getDashboardStats(),
      getChartData(),
      getActivityFeed(),
      getSwapStatus()
    ]);
    
    return {
      stats,
      chartData,
      activityFeed,
      swapStatus
    };
  } catch (error) {
    console.error('Error fetching all dashboard data:', error);
    throw error;
  }
};
