import React from 'react';
import { FaCamera, FaStar, FaClock, FaUserGraduate, FaEdit } from 'react-icons/fa';

const Header = ({ name, title, avatar, stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
          <FaCamera className="text-gray-600" />
        </button>
      </div>
      <div className="px-8 pb-8 relative">
        <div className="flex justify-between items-end">
          <div className="flex items-end -mt-12">
            <div className="relative mb-4">
              <img
                src={avatar}
                alt={name}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-sm"
              />
              <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                <FaCamera className="text-gray-600 w-4 h-4" />
              </button>
            </div>
            <div className="ml-6 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
              <p className="text-gray-600">{title}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-sm text-gray-600">
                  <FaStar className="text-yellow-400 mr-1" />
                  {stats.rating} Rating
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <FaClock className="text-gray-400 mr-1" />
                  {stats.hoursTeaching} Hours Taught
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <FaUserGraduate className="text-gray-400 mr-1" />
                  {stats.totalStudents} Students
                </span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
