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

// Add auth token to requests if available (only for authenticated endpoints)
gigsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication required');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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