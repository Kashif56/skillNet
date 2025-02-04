import React from 'react';
import SignupForm from '../../components/auth/SignupForm';
import AuthIllustration from '../../components/auth/AuthIllustration';
import Navbar from '../../components/layout/Navbar';

const Signup = () => {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      {/* Illustration Section */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthIllustration type="signup" />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mt-15">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
