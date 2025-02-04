import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[140px] justify-between"
      >
        <span className="truncate">{label}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-56">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  value === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Filters = ({ selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming & Tech' },
    { value: 'design', label: 'Design & Creative' },
    { value: 'writing', label: 'Writing & Translation' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'video', label: 'Video & Animation' },
    { value: 'music', label: 'Music & Audio' },
    { value: 'business', label: 'Business' }
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'online', label: 'Online Services' },
    { value: 'local', label: 'Local Services' },
    { value: 'featured', label: 'Featured Services' }
  ];

  const sellerDetails = [
    { value: 'all', label: 'All Sellers' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'level_two', label: 'Level Two' },
    { value: 'level_one', label: 'Level One' },
    { value: 'new', label: 'New Sellers' }
  ];

  const budgetOptions = [
    { value: 'all', label: 'Any Budget' },
    { value: 'free', label: 'Free' },
    { value: 'low', label: 'Low (< $25)' },
    { value: 'medium', label: 'Medium ($25-$100)' },
    { value: 'high', label: 'High (> $100)' }
  ];

  const deliveryOptions = [
    { value: 'any', label: 'Any Time' },
    { value: '24h', label: '24 Hours' },
    { value: '3d', label: 'Up to 3 days' },
    { value: '7d', label: 'Up to 7 days' },
    { value: 'custom', label: 'Custom' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <FilterDropdown
          label="Category"
          options={categories}
          value={selectedCategory}
          onChange={onCategoryChange}
        />

        <FilterDropdown
          label="Service options"
          options={serviceOptions}
          value="all"
          onChange={() => {}}
        />

        <FilterDropdown
          label="Seller details"
          options={sellerDetails}
          value="all"
          onChange={() => {}}
        />

        <FilterDropdown
          label="Budget"
          options={budgetOptions}
          value="all"
          onChange={() => {}}
        />

        <FilterDropdown
          label="Delivery time"
          options={deliveryOptions}
          value="any"
          onChange={() => {}}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Pro Services Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Pro services</span>
        </label>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <FilterDropdown
            label={sortOptions.find(opt => opt.value === sortBy)?.label || 'Relevance'}
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
