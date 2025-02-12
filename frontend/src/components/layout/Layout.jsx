import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaMusic, FaUserCircle, FaInfoCircle, FaEnvelope, FaSearch } from 'react-icons/fa';
import Footer from './Footer'; // Assuming Footer component is in the same directory
import { useSelector } from 'react-redux';
import authService from '../../services/auth';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isActive = (path) => location.pathname === path;
 

  const {token, username, isAuthenticated} = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center px-4 sm:px-6 lg:px-8">
              <FaMusic className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SkillNet</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl px-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gigs..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 px-4 sm:px-6 lg:px-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaHome className="mr-1.5 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/gigs"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/gigs') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaMusic className="mr-1.5 h-4 w-4" />
                Gigs
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaInfoCircle className="mr-1.5 h-4 w-4" />
                About
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/contact') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <FaEnvelope className="mr-1.5 h-4 w-4" />
                Contact
              </Link>

              {/* Auth Section */}
              <div className="ml-4 flex items-center">
                {token ? (
                  <div className='inline-flex items-center px-3 py-2 rounded-md text-sm'>
                    <Link
                      to="/dashboard/profile"
                      className="inline-flex items-center px-3 py-2 rounded-md text-blue-700 font-medium underline"
                    >
                      <FaUserCircle className="h-6 w-6 mr-2" /> 
                      Hey, {username}
                    </Link>
                    <button className='inline-flex items-center px-3 py-2 rounded-md text-red-600 font-medium border border-red-600 hover:bg-red-400 hover:text-white cursor-pointer px-4' onClick={handleLogout}>Logout</button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
