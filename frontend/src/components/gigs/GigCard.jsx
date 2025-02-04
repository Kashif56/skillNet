import React from 'react';
import { FaStar } from 'react-icons/fa';

const GigCard = ({ gig }) => {
  return (
    <div className="rounded-lg shadow-lg hover:shadow-md transition-all duration-300 overflow-hidden h-[400px] flex flex-col">
      {/* Image Container - Fixed Height */}
      <div className="h-48 relative">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-gradient-to-b from-black/50 to-transparent">
          <span className="text-white font-medium">{gig.category}</span>
        </div>
      </div>
      
      {/* Content Container - Flex Grow */}
      <div className="p-4 flex-grow flex flex-col">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={gig.user.avatar}
            alt={gig.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-sm font-medium text-gray-900">{gig.user.name}</h4>
            <div className="flex items-center text-sm">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-gray-600">{gig.user.rating}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
          {gig.title}
        </h3>

        {/* Skills Exchange - Push to Bottom */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">Offering:</span>
            <span className="text-sm text-gray-600">{gig.offering[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">Looking for:</span>
            <span className="text-sm text-gray-600">{gig.lookingFor[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
