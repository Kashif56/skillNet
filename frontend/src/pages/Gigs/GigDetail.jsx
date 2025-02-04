import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUserCircle, FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const GigDetail = () => {
  // Mock data - replace with API call
  const gig = {
    id: 1,
    title: "Professional Singing Lessons & Vocal Training",
    description: "I am a professional singer with over 10 years of experience in vocal training and performance. I specialize in contemporary, pop, and jazz styles. My lessons are tailored to your goals and current skill level.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1280&h=720&fit=crop&q=80",
    offering: {
      title: "Vocal Training",
      description: "Professional singing lessons covering technique, breathing, pitch control, and performance skills.",
      experience: "10+ years",
      level: "Advanced"
    },
    lookingFor: {
      title: "Guitar Lessons",
      description: "Interested in learning guitar to accompany my singing. Basic to intermediate level lessons.",
      preferredLevel: "Intermediate"
    },
    user: {
      id: 1,
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      rating: 4.9,
      totalReviews: 128,
      location: "New York, USA",
      memberSince: "Jan 2023",
      languages: ["English", "Spanish"],
      availability: {
        days: ["Monday", "Wednesday", "Friday"],
        times: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative pb-[56.25%]">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="absolute inset-0 w-full h-full object-cover max-w-[1280px] max-h-[720px] mx-auto"
                />
              </div>
            </div>

            {/* Title and Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-6">
                {/* Title Section */}
                <div>
                 
                  <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                </div>

                {/* Description Section */}
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gig.description}</p>
                </div>
              </div>
            </div>

            {/* Skills Exchange */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offering */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What I'm Offering</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-600">{gig.offering.title}</h3>
                  <p className="text-gray-600">{gig.offering.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-blue-600">Experience: {gig.offering.experience}</span>
                    </div>
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-blue-600">Level: {gig.offering.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Looking For */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What I Need</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-600">{gig.lookingFor.title}</h3>
                  <p className="text-gray-600">{gig.lookingFor.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-blue-600">Preferred Level: {gig.lookingFor.preferredLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              {/* User Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <img
                  src={gig.user.avatar}
                  alt={gig.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{gig.user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 w-4 h-4" />
                      <span className="ml-1 text-sm font-medium text-gray-600">{gig.user.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({gig.user.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="py-6 space-y-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400 w-5 h-5" />
                  <span className="text-gray-600">{gig.user.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-gray-400 w-5 h-5" />
                  <span className="text-gray-600">Member since {gig.user.memberSince}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-gray-400 w-5 h-5" />
                  <div className="text-gray-600">
                    <p className="font-medium">Available on:</p>
                    <p className="text-sm">{gig.user.availability.days.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400 w-5 h-5" />
                  <div className="text-gray-600">
                    <p className="font-medium">Hours:</p>
                    <p className="text-sm">{gig.user.availability.times.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.user.languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-4">
                <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Teacher
                </button>
                <button className="w-full px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
