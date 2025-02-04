import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaSearch, FaUsers } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="pt-16">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Share Your Musical Skills</span>
              <span className="block text-blue-600">Learn from Others</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl md:max-w-3xl">
              Join our community of musicians, share your expertise, and learn new skills through collaborative exchange.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center">
              <div className="rounded-md shadow">
                <Link
                  to="/gigs"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Browse Gigs
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <FaMusic className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Share Your Skills</h3>
              <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto">
                Offer your musical expertise and help others grow in their musical journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <FaSearch className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Find Teachers</h3>
              <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto">
                Discover skilled musicians willing to share their knowledge with you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <FaUsers className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Join Community</h3>
              <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto">
                Be part of a growing community of passionate musicians and learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to start your musical journey?</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/gigs"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
