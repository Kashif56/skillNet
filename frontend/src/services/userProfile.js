import axios from 'axios';
import authService from './auth';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const userProfileApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Required for CORS with credentials
});

// Add request interceptor for auth token
userProfileApi.interceptors.request.use(
    async (config) => {
        // Get current token
        const token = localStorage.getItem('token');
        
        // Check if token exists and is expired
        if (token && authService.isTokenExpired && authService.isTokenExpired(token)) {
            try {
                // Try to refresh the token
                const newToken = await authService.refreshToken();
                config.headers.Authorization = `Bearer ${newToken.access}`;
            } catch (error) {
                // If refresh fails and we're not already logging out, do it now
                if (!config.url.includes('/logout')) {
                    authService.logout();
                }
                throw error;
            }
        } else if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
userProfileApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await authService.refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken.access}`;
                return userProfileApi(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout and redirect to login
                authService.logout();
                return Promise.reject(refreshError);
            }
        }

        // For other errors, reject with a formatted error object
        return Promise.reject({
            message: error.response?.data?.detail || error.message || 'An error occurred'
        });
    }
);

export const getUserProfile = async () => {
    try {
        const response = await userProfileApi.get('/profile/profile/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (data) => {
    try {
        const response = await userProfileApi.patch('/profile/update/', data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateProfilePicture = async (formData) => {
    try {
        const response = await userProfileApi.post('/profile/picture/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateBannerImage = async (formData) => {
    try {
        const response = await userProfileApi.post('/profile/banner/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateSkills = async (skills) => {
    try {
        const response = await userProfileApi.post('/profile/skills/', { skills });
        return response;
    } catch (error) {
        throw error;
    }
};

export default userProfileApi;