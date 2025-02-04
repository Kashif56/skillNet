import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedSkills from '../components/home/FeaturedSkills';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <FeaturedSkills />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;
