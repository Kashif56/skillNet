import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GigCard from '../../components/gigs/GigCard';
import Filters from '../../components/gigs/Filters';

const ITEMS_PER_PAGE = 20;

const GigsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  // Mock data - replace with actual API call
  const gigs = Array.from({ length: 85 }, (_, index) => ({
    id: index + 1,
    title: `Gig ${index + 1}: ${["JavaScript & React", "UI/UX Design", "Content Writing", "Digital Marketing"][index % 4]}`,
    category: ["Programming", "Design", "Writing", "Marketing"][index % 4],
    price: Math.floor(Math.random() * 200),
    rating: (4 + Math.random()).toFixed(1),
    image: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&auto=format&fit=crop&q=60"
    ][index % 3],
    offering: [`Skill ${index + 1}`],
    lookingFor: [`Need ${index + 1}`],
    user: {
      name: `User ${index + 1}`,
      avatar: `https://ui-avatars.com/api/?name=User+${index + 1}&background=0D8ABC&color=fff`,
      rating: (4 + Math.random()).toFixed(1)
    }
  }));

  // Filter gigs based on search query and category
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = !searchQuery || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.offering.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      gig.lookingFor.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || gig.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalItems = filteredGigs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGigs = filteredGigs.slice(startIndex, endIndex);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pageNumbers.push(1);

    // Calculate start and end of the visible page range
    let start = Math.max(currentPage - 1, 2);
    let end = Math.min(currentPage + 1, totalPages - 1);

    // Adjust range if at the start or end
    if (currentPage <= 2) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(totalPages - 3, 2);
    }

    // Add ellipsis if needed
    if (start > 2) {
      pageNumbers.push('...');
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams(prev => {
        prev.set('page', page);
        return prev;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? (
              <>Results for "<span className="text-blue-600">{searchQuery}</span>"</>
            ) : (
              'All Gigs'
            )}
          </h1>
          <p className="text-md font-medium text-gray-500 mt-1">
            {filteredGigs.length.toLocaleString()} {filteredGigs.length === 1 ? 'gig' : 'gigs'} available
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Filters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredGigs.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentGigs.map((gig) => (
                <Link key={gig.id} to={`/gigs/${gig.id}`} className="transform hover:scale-[1.02] transition-transform">
                  <GigCard gig={gig} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems})
                  </span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm border border-gray-300 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="px-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm border border-gray-300 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
                window.history.pushState({}, '', '/gigs');
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigsListing;
