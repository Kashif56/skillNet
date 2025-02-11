import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import authService from '../../services/auth';
import { login } from '../../redux/slices/authSlice';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    try {
      setIsLoading(true);

      // Register the user - match dj-rest-auth registration fields
      const userData = {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword
      };

      const signupResponse = await authService.signup(userData);
      toast.success('Account created successfully!');

      // If registration is successful, automatically log them in
      try {
        const loginResponse = await authService.login({
          email: formData.email,
          password: formData.password
        });

        // Update Redux store with user data
        dispatch(login({
          user: loginResponse.user,
          token: loginResponse.access_token,
          refreshToken: loginResponse.refresh_token
        }));

        toast.success('Welcome to SkillNet!');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (loginError) {
        console.error('Login error:', loginError);
        toast.error('Account created but unable to log in automatically. Please try logging in manually.');
        navigate('/login');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.detail || 
        (typeof error === 'object' && Object.values(error)[0]?.[0]) || 
        'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup will be available soon!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
        <p className="text-gray-600 mt-2">Join our community of skill sharers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a username"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms and Conditions</Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Sign up with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <FaGoogle className="mr-2" />
          Sign up with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default SignupForm;
