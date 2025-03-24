import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { trackClick } from '../../services/gigs';

const GigCard = ({ gig }) => {
  const { user, username } = useSelector((state) => state.auth);
 
  // Handle click event to track when a gig is clicked
  const handleGigClick = () => {
    // Track the click
    trackClick(gig.gigId);
  };

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {/* Image Container - Fixed Height */}
        <Link to={`/gigs/${gig.gigId}`} onClick={handleGigClick}>
          <div className="h-48 relative">
            <img
              src={`http://localhost:8000${gig.gigImage}`}
              alt={gig.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-gradient-to-b from-black/50 to-transparent">
              <span className="text-white font-medium">{gig.category}</span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
          <Link to={`/gigs/${gig.gigId}`} onClick={handleGigClick}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
              {gig.title}
            </h3>
          </Link>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`http://localhost:8000${gig.user.profile_picture}`}
              alt={gig.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">{gig.user.username}</h4>
              <div className="flex items-center text-sm">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-gray-600">{gig.user.rating}</span>
              </div>
            </div>
          </div>

         

          {/* Skills */}
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">Offering:</span>
              <span className="text-sm text-gray-600">{gig.offeredSkills}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Looking for:</span>
              <span className="text-sm text-gray-600">{gig.desiredSkills}</span>
            </div>
          </div>
        </div>
      </div>
    );

};

export default GigCard;
