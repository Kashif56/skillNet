import React, { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const HeroSection = () => {
  useEffect(() => {
    // Add animation classes after component mounts
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const searchBox = document.querySelector('.hero-search');
    
    title?.classList.add('animate-fadeInUp');
    setTimeout(() => {
      subtitle?.classList.add('animate-fadeInUp');
    }, 200);
    setTimeout(() => {
      searchBox?.classList.add('animate-fadeInUp');
    }, 400);
  }, []);

  return (
    <div className="relative min-h-[90vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden pb-20 md:pb-40">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 text-center px-4">
        <h1 className="hero-title opacity-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 transform translate-y-10">
          Share Skills,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Grow Together
          </span>
        </h1>
        
        <p className="hero-subtitle opacity-0 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 transform translate-y-10 max-w-xl sm:max-w-2xl mx-auto">
          Connect with people worldwide to exchange skills and knowledge in a vibrant learning community
        </p>
        
        <div className="hero-search opacity-0 transform translate-y-10 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="What would you like to learn?"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full text-gray-800 bg-white/95 backdrop-blur-sm shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base sm:text-lg transition-all duration-300 group-hover:shadow-blue-300/20"
            />
            <button className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 sm:p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
              <FaSearch className="text-lg sm:text-xl" />
            </button>
          </div>
          
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/90">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full backdrop-blur-sm">
              Web Development
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full backdrop-blur-sm">
              Digital Marketing
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full backdrop-blur-sm">
              Graphic Design
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full backdrop-blur-sm">
              Language Learning
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="wave-parallax">
            <use href="#wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use href="#wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use href="#wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use href="#wave" x="48" y="7" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
