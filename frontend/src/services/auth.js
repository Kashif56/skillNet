import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api/auth';

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Required for CORS with credentials
});

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    // Add 10 second buffer to prevent edge cases
    return Date.now() >= (tokenData.exp * 1000) - 10000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Add CSRF token and auth token to requests
authApi.interceptors.request.use(async (config) => {
  // Get CSRF token
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    // Check if token is expired and try to refresh if needed
    if (isTokenExpired(token) && config.url !== '/token/refresh/') {
      try {
        const newToken = await authService.refreshToken();
        config.headers.Authorization = `Bearer ${newToken.access}`;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails and we're not already logging out, do it now
        if (config.url !== '/logout/') {
          authService.logout();
        }
        throw error;
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken.access}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token && !isTokenExpired(token);
  },

  // Initialize auth state from storage
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && !isTokenExpired(token)) {
      return {
        isAuthenticated: true,
        username,
        token
      };
    }
    
    // Clear storage if token is expired
    localStorage.clear();
    return {
      isAuthenticated: false,
      username: null,
      token: null
    };
  },

  // Register new user
  signup: async (userData) => {
    try {
      const response = await authApi.post('/registration/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { 
        email: credentials.email,
        // Don't log password for security
      });

      const response = await authApi.post('/login/', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Login response:', response.data);

      // Validate response data
      if (!response.data.access && !response.data.user) {
        throw new Error('Invalid response format from server');
      }

      // Format response data consistently
      const authData = {
        user: response.data.user,
        token: response.data.access,
        refreshToken: response.data.refresh,
        username: response.data.user.username
      };

      // Store tokens
      localStorage.setItem('token', authData.token);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('username', authData.username);
      localStorage.setItem('isAuthenticated', 'true');

      // Start token refresh interval
      authService.startTokenRefreshInterval();

      return authData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        throw { detail: 'Invalid email or password. Please try again.' };
      }
      
      throw error.response?.data || { 
        detail: error.message || 'Login failed. Please try again.' 
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Clear refresh interval
      if (window.tokenRefreshInterval) {
        clearInterval(window.tokenRefreshInterval);
      }

      // Attempt to logout on server
      await authApi.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.clear();
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authApi.get('/user/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (data) => {
    try {
      const response = await authApi.patch('/user/profile/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update profile' };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Check if refresh token is expired
      if (isTokenExpired(refreshToken)) {
        throw new Error('Refresh token expired');
      }

      const response = await authApi.post('/token/refresh/', { refresh: refreshToken });
      
      if (!response.data.access) {
        throw new Error('No access token in refresh response');
      }

      // Store new tokens
      localStorage.setItem('token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, force logout
      authService.logout();
      throw error.response?.data || { 
        detail: error.message || 'Failed to refresh token'
      };
    }
  },

  // Start token refresh interval
  startTokenRefreshInterval: () => {
    // Clear any existing interval
    if (window.tokenRefreshInterval) {
      clearInterval(window.tokenRefreshInterval);
    }

    // Set up automatic token refresh every 4 minutes
    // This ensures we refresh before the typical 5-minute expiration
    window.tokenRefreshInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
          await authService.refreshToken();
        }
      } catch (error) {
        console.error('Auto refresh failed:', error);
        // If auto-refresh fails, clear interval but don't logout
        // This allows the next request to handle the refresh
        if (window.tokenRefreshInterval) {
          clearInterval(window.tokenRefreshInterval);
        }
      }
    }, 4 * 60 * 1000); // 4 minutes

    // Refresh immediately if token is expired
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      authService.refreshToken().catch(console.error);
    }
  },

  // Password reset request
  requestPasswordReset: async (email) => {
    try {
      const response = await authApi.post('/password/reset/', { email });
      toast.success('Password reset email has been sent');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to request password reset' };
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (data) => {
    try {
      const response = await authApi.post('/password/reset/confirm/', data);
      toast.success('Password has been reset successfully');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to reset password' };
    }
  }
};

export default authService;
