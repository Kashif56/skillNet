import React from 'react';
import { 
  FaVideo, 
  FaChartLine, 
  FaShieldAlt, 
  FaUsers, 
  FaCertificate, 
  FaGlobe 
} from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="text-blue-600 text-2xl" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: FaVideo,
      title: "Live Video Sessions",
      description: "Connect face-to-face with skilled mentors and learners through our high-quality video platform."
    },
    {
      icon: FaChartLine,
      title: "Skill Progress Tracking",
      description: "Monitor your learning journey with detailed progress analytics and achievement milestones."
    },
    {
      icon: FaShieldAlt,
      title: "Verified Profiles",
      description: "Trust our community with verified user profiles and skill endorsements from peers."
    },
    {
      icon: FaUsers,
      title: "Community Support",
      description: "Join topic-specific groups and forums to discuss, share, and learn together."
    },
    {
      icon: FaCertificate,
      title: "Skill Certificates",
      description: "Earn certificates for your achievements and showcase them on your profile."
    },
    {
      icon: FaGlobe,
      title: "Global Network",
      description: "Connect with learners and mentors from around the world, breaking geographical barriers."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Better Learning
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Everything you need to make the most of your skill-sharing journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <button className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
