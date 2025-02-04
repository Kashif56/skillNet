import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaUserGraduate } from 'react-icons/fa';

const Teaching = ({ teachingHistory }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Teaching Sessions</h2>
      <div className="space-y-6">
        {teachingHistory.map((session, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium text-gray-800">{session.subject}</h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <FaUserGraduate className="mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{session.students}</p>
                      <p className="text-xs">Students</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{session.hours}</p>
                      <p className="text-xs">Hours</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaStar className="mr-2 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium">{session.rating}</p>
                      <p className="text-xs">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Teaching;
