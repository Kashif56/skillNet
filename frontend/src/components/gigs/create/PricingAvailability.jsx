import React from 'react';
import { FaDollarSign, FaClock } from 'react-icons/fa';

const PricingAvailability = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="50"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Duration (hours)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClock className="text-gray-400" />
            </div>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1">1 hour</option>
              <option value="1.5">1.5 hours</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                handleChange({
                  target: {
                    name: 'availability',
                    value: formData.availability.includes(day)
                      ? formData.availability.filter(d => d !== day)
                      : [...formData.availability, day]
                  }
                });
              }}
              className={`p-2 rounded-lg text-sm font-medium ${
                formData.availability.includes(day)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingAvailability;
