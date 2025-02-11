import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/auth';

// Parse stored user data safely
const parseStoredData = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Initialize state from localStorage if available
const initialState = {
  user: parseStoredData('userData', null),
  username: localStorage.getItem('username') || '',
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Store auth data in localStorage
      localStorage.setItem('userData', JSON.stringify(action.payload.user));
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.username = '';
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      authService.logout();
    },
    updateToken: (state, action) => {
      state.token = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
      // Update localStorage
      localStorage.setItem('token', action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem('refreshToken', action.payload.refresh);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(state.user));
    }
  }
});

export const { 
  login, 
  logout, 
  updateToken,
  setError, 
  clearError, 
  setLoading, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;