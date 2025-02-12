import axios from "axios";

const API_URL = 'http://localhost:8000/api';

// Create an axios instance for authenticated endpoints
export const gigsApi = axios.create({
    baseURL: API_URL,
});

// Create an axios instance for public endpoints
export const publicApi = axios.create({
    baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Function to refresh token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken
        });
        const { access } = response.data;
        localStorage.setItem('token', access);
        return access;
    } catch (error) {
        // If refresh token is invalid, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw error;
    }
};

// Add auth token to requests if available (only for authenticated endpoints)
gigsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication required');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Add response interceptor to handle token refresh
gigsApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request has already been retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // If token refresh is in progress, queue the request
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return gigsApi(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshAccessToken();
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return gigsApi(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

// Get all gigs (public endpoint)
export const getAllGigs = async () => {
    try {
        const response = await publicApi.get('/all-gigs/');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get gig details by gigId (public endpoint)
export const getGigDetail = async (gigId) => {
    try {
        const response = await publicApi.get(`/gig-detail/${gigId}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Send swap request (authenticated endpoint)
export const sendSwapRequest = async (data) => {
    try {
        const response = await gigsApi.post('/send-swap-request/', data);
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please log in to send a swap request');
        }
        throw error.response?.data || error.message;
    }
};

// Check swap request status (authenticated endpoint)
export const checkSwapRequest = async (gigId) => {
    try {
        const response = await gigsApi.get('/check-swap-request/', { params: { gigId } });
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            return { hasRequested: false };
        }
        throw error.response?.data || error.message;
    }
};

// Get swap request details by swapId (authenticated endpoint)
export const getSwapRequest = async (swapId) => {
    try {
        const response = await gigsApi.get(`/get-swap-request/${swapId}/`);
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please log in to view swap request details');
        }
        throw error.response?.data || error.message;
    }
};

// Get my swap requests (authenticated endpoint)
export const getMySwapRequests = async () => {
    try {
        const response = await gigsApi.get('/my-swap-requests/');
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please log in to view your swap requests');
        }
        throw error.response?.data || error.message;
    }
};

// Handle swap request response (accept/reject)
export const respondToSwapRequest = async (swapId, action) => {
    try {
        const response = await gigsApi.post(`/respond-swap-request/`, {
            swapId: swapId,
            action: action // 'accept' or 'reject'
        });
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please log in to respond to the swap request');
        }
        throw error.response?.data || error.message;
    }
};

// Withdraw a sent swap request
export const withdrawSwapRequest = async (swapId) => {
    try {
        const response = await gigsApi.post('/withdraw-swap-request/', {
            swapId: swapId
        });
        return response.data;
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please log in to withdraw the swap request');
        }
        throw error.response?.data || error.message;
    }
};