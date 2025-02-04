import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthIllustration from '../../components/auth/AuthIllustration';
import Navbar from '../../components/layout/Navbar';

const Login = () => {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>

      {/* Illustration Section */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthIllustration type="login" />
      </div>
    </div>
  );
};

export default Login;
