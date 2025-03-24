import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GigCard from '../../components/gigs/GigCard';
import Filters from '../../components/gigs/Filters';
import { getAllGigs } from '../../services/core';
import { trackImpression } from '../../services/gigs';

const ITEMS_PER_PAGE = 20;

const GigsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track which gigs have already had impressions recorded
  const [trackedImpressions, setTrackedImpressions] = useState({});
  // Refs for observed elements
  const observerRefs = useRef({});

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  // Fetch gigs from backend
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const response = await getAllGigs();
        
        // Handle response with proper structure validation
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          setGigs(response.data);
        } else if (Array.isArray(response)) {
          setGigs(response);
        } else {
          console.error('Unexpected API response format:', response);
          setGigs([]);
          setError('Failed to load gigs: Unexpected data format');
        }
      } catch (err) {
        setError('Failed to load gigs. Please try again later.');
        console.error('Error fetching gigs:', err);
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []); // Empty dependency array means this runs once on component mount

  // Filter gigs based on search query and category
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = !searchQuery || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.offeredSkills?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.desiredSkills?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      gig.offeredSkills?.category?.name?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalItems = filteredGigs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGigs = filteredGigs.slice(startIndex, endIndex);

  // Clean up observer refs when component unmounts
  useEffect(() => {
    return () => {
      observerRefs.current = {};
    };
  }, []);

  // Set up intersection observer for impression tracking
  useEffect(() => {
    // Skip if there are no gigs or page is loading
    if (loading || !currentGigs || !currentGigs.length) return;

    let observer;
    try {
      // Create a new IntersectionObserver instance
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const gigId = entry.target.dataset.gigId;
              
              // Only track impression if we haven't already for this gig in this session
              if (gigId && !trackedImpressions[gigId]) {
                // Track the impression
                trackImpression(gigId)
                  .then((result) => {
                    // Handle the result based on status
                    if (result.status === 'success' || result.status === 'skipped') {
                      // Mark the impression as tracked to prevent future attempts
                      // We mark it as tracked even if skipped due to cooldown
                      setTrackedImpressions(prev => ({
                        ...prev,
                        [gigId]: true
                      }));
                      
                      // Log the response if it was skipped
                      if (result.status === 'skipped') {
                        console.info(`Impression for gig ${gigId} skipped: ${result.message}`);
                      }
                    }
                  })
                  .catch(err => {
                    console.error(`Error tracking impression for gig ${gigId}:`, err);
                  });
                
                // We only need to track once, so unobserve after first visibility
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: 0.5, // Element is considered visible when 50% is in viewport
          rootMargin: '0px' // No margin
        }
      );

      // Start observing each gig card
      currentGigs.forEach(gig => {
        if (gig && gig.gigId && observerRefs.current[gig.gigId] && !trackedImpressions[gig.gigId]) {
          observer.observe(observerRefs.current[gig.gigId]);
        }
      });
    } catch (error) {
      console.error("Error setting up IntersectionObserver:", error);
    }

    // Cleanup function to disconnect observer when component unmounts
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentGigs, loading, trackedImpressions]);

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

  // Function to set ref for each gig card
  const setGigRef = (gigId, element) => {
    if (!gigId) {
      console.warn("Attempted to set ref for gig with undefined gigId");
      return;
    }
    
    if (element) {
      observerRefs.current[gigId] = element;
    } else if (observerRefs.current[gigId]) {
      // Clean up reference if element is null (component unmounting)
      delete observerRefs.current[gigId];
    }
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
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gigs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Try Again
            </button>
          </div>
        ) : filteredGigs.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentGigs.map((gig) => (
                <div
                  key={gig.gigId}
                  ref={(el) => setGigRef(gig.gigId, el)}
                  data-gig-id={gig.gigId}
                  className="transform hover:scale-[1.02] transition-transform"
                >
                  <Link to={`/gigs/${gig.gigId}`}>
                    <GigCard gig={gig} />
                  </Link>
                </div>
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
