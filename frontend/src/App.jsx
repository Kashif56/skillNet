import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import GigsListing from './pages/Gigs/GigsListing';
import GigDetail from './pages/Gigs/GigDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes without Layout wrapper */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard route without Layout wrapper */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        
        {/* Main routes with Layout wrapper */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/gigs" element={<Layout><GigsListing /></Layout>} />
        <Route path="/gigs/:id" element={<Layout><GigDetail /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
