import React from 'react';
import { FaUserPlus, FaHandshake, FaVideo, FaStar } from 'react-icons/fa';

const Step = ({ icon: Icon, title, description, number }) => (
  <div className="relative flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-600 text-3xl" />
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: FaUserPlus,
      title: "Create Your Profile",
      description: "Sign up and list the skills you want to share and learn. Build your personal learning roadmap."
    },
    {
      icon: FaHandshake,
      title: "Connect & Match",
      description: "Find users with complementary skills and interests. Our smart matching system helps you find the perfect learning partner."
    },
    {
      icon: FaVideo,
      title: "Schedule Sessions",
      description: "Set up virtual or in-person skill exchange sessions. Choose the time and format that works best for you."
    },
    {
      icon: FaStar,
      title: "Grow Together",
      description: "Learn, teach, and earn recognition in the community. Track your progress and celebrate achievements."
    }
  ];

  return (
    <section className="py-20 px-40 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How SkillNet Works
          </h2>
          <p className="text-gray-600 text-lg">
            Follow these simple steps to start your skill-sharing journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <Step {...step} number={index + 1} />
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-1/4 transform -translate-y-1/2 w-full h-0.5 bg-blue-100 z-0" 
                     style={{ left: `${(index + 1) * 25}%` }}>
                  <div className="absolute right-0 -mt-1 w-3 h-3 rounded-full bg-blue-200"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full translate-x-1/2 translate-y-1/2 opacity-50"></div>
    </section>
  );
};

export default HowItWorks;
