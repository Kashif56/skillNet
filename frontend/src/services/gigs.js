import axios from 'axios';
import authService from './auth';

const API_URL = 'http://localhost:8000/api/gigs';

export const gigsApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor
gigsApi.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
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

gigsApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is not 401 or the request was for refreshing token, reject immediately
        if (error.response?.status !== 401 || originalRequest.url?.includes('refresh-token')) {
            return Promise.reject(error);
        }

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                // Try to refresh the token
                const newToken = await authService.refreshToken();
                
                // Update the token in localStorage
                localStorage.setItem('token', newToken.access);
                
                // Update the failed request's authorization header
                originalRequest.headers.Authorization = `Bearer ${newToken.access}`;
                
                // Process all the requests in the queue
                processQueue(null, newToken.access);
                
                // Retry the original request
                return gigsApi(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // If refresh fails, logout and redirect to login
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // If refreshing is in progress, add the request to queue
        return new Promise((resolve, reject) => {
            failedQueue.push({
                resolve: (token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(gigsApi(originalRequest));
                },
                reject: (err) => {
                    reject(err);
                }
            });
        });
    }
);

export const getAllGigs = async () => {
    try {
        const response = await gigsApi.get('/all-gigs/');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getGigDetail = async (gigId) => {
    try {
        const response = await gigsApi.get(`/gig-detail/${gigId}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createGig = async (data) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('offering', data.offering);
        formData.append('lookingFor', data.lookingFor);
        formData.append('tags', JSON.stringify(data.tags));

        if (data.image) {
            const base64Data = data.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
            const file = new File([blob], 'gig_image.jpg', { type: 'image/jpeg' });
            formData.append('gigImage', file);
        }

        const response = await gigsApi.post('/create-gig/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateGig = async (gigId, data) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('offering', data.offering);
        formData.append('lookingFor', data.lookingFor);
        formData.append('tags', JSON.stringify(data.tags));

        if (data.image && data.image.startsWith('data:')) {
            // Only convert and append if it's a new image (base64)
            const base64Data = data.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
            const file = new File([blob], 'gig_image.jpg', { type: 'image/jpeg' });
            formData.append('gigImage', file);
        }

        const response = await gigsApi.put(`/update-gig/${gigId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteGig = async (gigId) => {
    try {
        const response = await gigsApi.delete(`/delete-gig/${gigId}/`);
        if (response.status === 204 || response.status === 200) {
            return { status: 'success', message: 'Gig deleted successfully' };
        }
        throw new Error('Failed to delete gig');
    } catch (error) {
        throw {
            status: 'error',
            message: error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to delete gig'
        };
    }
};

// Track impression when a gig is viewed
export const trackImpression = async (gigId) => {
    if (!gigId) {
        console.error('Cannot track impression: No gigId provided');
        return Promise.reject(new Error('No gigId provided'));
    }

    try {
        // Check if we've tracked this gig's impression recently
        const impressionKey = `impression_${gigId}`;
        const lastImpressionTime = localStorage.getItem(impressionKey);
        const currentTime = new Date().getTime();
        
        // If we have a stored time for this gig
        if (lastImpressionTime) {
            const timeSinceLastImpression = currentTime - parseInt(lastImpressionTime);
            const tenMinutesInMs = 10 * 60 * 1000;
            
            // If it's been less than 10 minutes, don't track
            if (timeSinceLastImpression < tenMinutesInMs) {
                console.log(`Skipping impression for gig ${gigId}: within cooldown period (${Math.round(timeSinceLastImpression / 1000 / 60)} minutes since last impression)`);
                return Promise.resolve({ 
                    status: 'skipped', 
                    message: 'Impression not tracked: cooldown period active'
                });
            }
        }
        
        // If we reach here, either there's no stored time or it's been more than 10 minutes
        // Track the impression
        const response = await gigsApi.post('/track-impression/', { gigId });
        
        // Store the current time as the last impression time for this gig
        localStorage.setItem(impressionKey, currentTime.toString());
        
        return response.data;
    } catch (error) {
        console.error('Error tracking impression:', error);
        // Return a resolved promise with error status to prevent UI disruption
        return Promise.resolve({ 
            status: 'error', 
            message: 'Failed to track impression',
            error: error.message
        });
    }
};

// Track click when a gig is clicked
export const trackClick = async (gigId) => {
    if (!gigId) {
        console.error('Cannot track click: No gigId provided');
        return Promise.reject(new Error('No gigId provided'));
    }

    try {
        const response = await gigsApi.post('/track-click/', { gigId });
        return response.data;
    } catch (error) {
        console.error('Error tracking click:', error);
        // Return a resolved promise with error status to prevent UI disruption
        return Promise.resolve({ 
            status: 'error', 
            message: 'Failed to track click',
            error: error.message
        });
    }
};

// Send swap request and track it
export const sendSwapRequest = async (data) => {
    try {
        const response = await gigsApi.post('/send-swap-request/', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
