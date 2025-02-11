import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import GigsListing from './pages/Gigs/GigsListing';
import GigDetail from './pages/Gigs/GigDetail';
import { AuthRoute, PrivateRoute } from './components/auth/ProtectedRoute';
import { useSelector } from 'react-redux';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/gigs" element={<Layout><GigsListing /></Layout>} />
        <Route path="/gigs/:gigId" element={<Layout><GigDetail /></Layout>} />
        
        {/* Auth routes - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
