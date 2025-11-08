import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSprayCan, faCar, faMotorcycle, faTimes } from '@fortawesome/free-solid-svg-icons';
import GarageCard from '../homeComponents/GarageCard';
import { getGaragesByServiceCategory } from '../../services/garageService';
import { apiGet } from '../../utils/api';
import { getStoredLocationData } from '../../utils/geolocation';
import { useTheme } from '../context/ThemeContext';

// Fallback Washing & Detailing Service Category ID - Update this if the ID changes
// Check admin panel Service Categories table for the actual ID of "Washing & Detailing"
const FALLBACK_WASHING_SERVICE_ID = 8; // Update based on actual ID in admin panel

const WashingService = ({ selectedCity, onBackToMain, onWashingCenterClick, onShowLoginPopup }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [washingGarages, setWashingGarages] = useState([]);
  const [filteredGarages, setFilteredGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationReady, setLocationReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [rating, setRating] = useState('all');
  const [distance, setDistance] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(true); // Show modal first
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [washingServiceCategoryId, setWashingServiceCategoryId] = useState(null);
  const [error, setError] = useState(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize location
  useEffect(() => {
    if (sessionStorage.getItem("latitude") && sessionStorage.getItem("longitude")) {
      setLocationReady(true);
    } else {
      // Set default location if not available
      const fallbackLat = 18.5204;
      const fallbackLng = 73.8567;
      sessionStorage.setItem("latitude", fallbackLat.toString());
      sessionStorage.setItem("longitude", fallbackLng.toString());
      setLocationReady(true);
    }
  }, []);

  // Fetch Washing & Detailing service category ID from API
  useEffect(() => {
    const fetchWashingServiceCategory = async () => {
      try {
        const city = selectedCity || sessionStorage.getItem("selectedCity") || 'Pune';
        const cityParam = city.toLowerCase();
        const response = await apiGet(`/active-cities/?city=${cityParam}`);
        
        console.log('🧼 Washing Service - Full API response:', response);
        console.log('🧼 Washing Service - Service categories:', response.data?.filter?.services);
        
        if (response.status === "success" && response.data?.filter?.services) {
          const services = response.data.filter.services;
          
          // Log all available service categories for debugging
          console.log('🧼 Available service categories:', services.map(s => ({ id: s.id, name: s.name })));
          
          // Try multiple variations of washing/detailing service name matching
          const washingService = services.find(
            service => {
              const name = service.name.toLowerCase();
              return name.includes('washing') || 
                     name.includes('detailing') ||
                     name.includes('wash') ||
                     name === 'washing & detailing' ||
                     name === 'washing and detailing' ||
                     name.includes('car wash') ||
                     name.includes('bike wash');
            }
          );
          
          if (washingService) {
            console.log('✅ Washing & Detailing Service category found in API response:', washingService);
            console.log('🧼 Using ID from API response:', washingService.id);
            setWashingServiceCategoryId(washingService.id);
          } else {
            console.log('⚠️ Washing & Detailing Service category not found in displayed categories');
            console.log('⚠️ Available categories:', services.map(s => `${s.id}: ${s.name}`));
            console.log('🧼 Note: "Washing & Detailing" may exist in backend but Display is "Hidden"');
            console.log(`🧼 Using fallback ID ${FALLBACK_WASHING_SERVICE_ID} for Washing & Detailing Service`);
            setWashingServiceCategoryId(FALLBACK_WASHING_SERVICE_ID);
          }
        } else {
          console.log(`⚠️ No service categories in response, using fallback ID ${FALLBACK_WASHING_SERVICE_ID}`);
          setWashingServiceCategoryId(FALLBACK_WASHING_SERVICE_ID);
        }
      } catch (error) {
        console.error('❌ Error fetching Washing & Detailing service category:', error);
        console.log(`🧼 Using fallback ID ${FALLBACK_WASHING_SERVICE_ID} for Washing & Detailing Service`);
        setWashingServiceCategoryId(FALLBACK_WASHING_SERVICE_ID);
      }
    };

    if (selectedCity || locationReady) {
      fetchWashingServiceCategory();
    }
  }, [selectedCity, locationReady]);

  // Fetch Washing & Detailing garages when location and service category ID are ready
  useEffect(() => {
    if (!locationReady || !washingServiceCategoryId || isVehicleModalOpen) return;

    const fetchWashingGarages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { latitude, longitude } = getStoredLocationData();
        const lat = latitude || 18.5204;
        const lng = longitude || 73.8567;

        let location = selectedCity || sessionStorage.getItem("selectedCity") || 'Pune';
        if (location === 'Bangalore') {
          location = 'Bangalore ';
        }

        const requestData = {
          location: location,
          latitude: lat,
          longitude: lng,
          filter: {
            sort: [],
            ratings: [],
            distence: [],
            service: [washingServiceCategoryId], // Filter by Washing & Detailing service category
          },
        };

        console.log('🧼 Fetching Washing & Detailing garages with service category ID:', washingServiceCategoryId);
        console.log('🧼 Request data:', JSON.stringify(requestData, null, 2));
        
        // Validate that service category ID is set
        if (!washingServiceCategoryId || !requestData.filter.service || requestData.filter.service.length === 0) {
          console.error('❌ Washing & Detailing Service Category ID is not set!');
          setError('Washing & Detailing Service category ID not found. Please check the console for details.');
          setLoading(false);
          return;
        }
        
        const response = await getGaragesByServiceCategory(requestData);
        console.log('🧼 Washing & Detailing Garage response:', response);
        console.log('🧼 Number of garages returned:', response?.data?.length || 0);

        if (response && response.data && response.data.length > 0) {
          console.log(`✅ Found ${response.data.length} Washing & Detailing service garages`);
          setWashingGarages(response.data);
          setFilteredGarages(response.data);
        } else {
          setWashingGarages([]);
          setFilteredGarages([]);
          console.log('⚠️ No Washing & Detailing garages found with service category ID:', washingServiceCategoryId);
          setError(null); // Don't show error, show "Coming Soon" message instead
        }
      } catch (error) {
        console.error("❌ Failed to fetch Washing & Detailing garages:", error);
        setError('Failed to load Washing & Detailing service garages');
        setWashingGarages([]);
        setFilteredGarages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWashingGarages();
  }, [locationReady, selectedCity, washingServiceCategoryId, isVehicleModalOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSortOpen && !event.target.closest('.sort-dropdown')) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  // Vehicle types for washing service
  const vehicleTypes = [
    {
      id: 1,
      title: "2 Wheeler",
      description: "Bikes, scooters, motorcycles",
      icon: faMotorcycle,
      type: 'two-wheeler',
      available: true
    },
    {
      id: 2,
      title: "4 Wheeler",
      description: "Cars, SUVs, passenger vehicles",
      icon: faCar,
      type: 'four-wheeler',
      available: true
    }
  ];

  // Handle vehicle type selection
  const handleVehicleTypeClick = (vehicleType) => {
    if (vehicleType.available) {
      setSelectedVehicleType(vehicleType.type);
      setIsVehicleModalOpen(false);
    } else {
      alert(`${vehicleType.title} service - Coming Soon!`);
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Don't allow closing by clicking backdrop - user must select a vehicle type
      // setIsVehicleModalOpen(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...washingGarages];

    // Rating filter
    if (rating !== 'all') {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(garage => 
        (garage.rating || 0) >= minRating
      );
    }

    // Distance filter
    if (distance !== 'all') {
      const maxDistance = parseFloat(distance);
      filtered = filtered.filter(garage => {
        if (garage.distance === null || garage.distance === undefined) return false;
        return garage.distance <= maxDistance;
      });
    }

    // Sort by
    if (sortBy === 'distance') {
      filtered.sort((a, b) => {
        const distA = a.distance !== null && a.distance !== undefined ? a.distance : Infinity;
        const distB = b.distance !== null && b.distance !== undefined ? b.distance : Infinity;
        return distA - distB;
      });
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredGarages(filtered);
  }, [washingGarages, rating, distance, sortBy]);

  const handleGarageClick = (garage) => {
    if (onWashingCenterClick) {
      onWashingCenterClick(garage);
    }
  };

  if (loading && !isVehicleModalOpen) {
    return (
      <div className={`py-12 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto border-red-600"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
              Loading Washing & Detailing centers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show vehicle type selection modal first
  if (isVehicleModalOpen) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
        {/* Header with Back Button */}
        <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b py-4 px-4`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBackToMain}
              className={`flex items-center transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-red-600' : 'text-white hover:text-red-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <FontAwesomeIcon icon={faSprayCan} className="mr-2" />
              Washing & Detailing
            </h1>
            <div className="w-5"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Vehicle Type Selection Modal */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col relative`}>
            {/* Close Button */}
            <button
              onClick={onBackToMain}
              className={`absolute top-4 right-4 transition-colors p-2 z-10 ${theme === 'light' ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-200'}`}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="text-center mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Select Vehicle Type
                </h2>
                <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Choose your vehicle type to find washing & detailing centers
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-xl p-6 text-center transition-all border-2 border-transparent group ${
                      vehicle.available 
                        ? `${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} cursor-pointer transform hover:scale-105 hover:border-red-500` 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => handleVehicleTypeClick(vehicle)}
                  >
                    <div className={`text-6xl mb-4 transition-colors ${
                      vehicle.available 
                        ? 'group-hover:scale-110' 
                        : ''
                    }`} style={{ 
                      background: vehicle.available 
                        ? 'linear-gradient(135deg, #ff3864, #cc1e3a)' 
                        : 'linear-gradient(135deg, #666, #999)',
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent', 
                      backgroundClip: 'text' 
                    }}>
                      <FontAwesomeIcon icon={vehicle.icon} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${vehicle.available ? (theme === 'light' ? 'text-gray-900' : 'text-white') : 'text-gray-500'}`}>
                      {vehicle.title}
                    </h3>
                    <p className={`text-base ${vehicle.available ? (theme === 'light' ? 'text-gray-700' : 'text-gray-400') : 'text-gray-600'}`}>
                      {vehicle.description}
                    </p>
                    {!vehicle.available && (
                      <div className="mt-2">
                        <span className={`text-xs text-gray-500 px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 border-gray-700'} px-6 py-3 border-t flex-shrink-0`}>
              <p className={`text-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Click on any vehicle type to find washing & detailing centers near you
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header with Back Button and Vehicle Type Selector */}
      <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b py-4 px-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBackToMain}
            className={`flex items-center transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-red-600' : 'text-white hover:text-red-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-4 flex-1 justify-center">
            <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <FontAwesomeIcon icon={faSprayCan} className="mr-2" />
              Washing & Detailing
            </h1>
            {selectedVehicleType && (
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <FontAwesomeIcon 
                  icon={selectedVehicleType === 'two-wheeler' ? faMotorcycle : faCar} 
                  className="text-sm"
                />
                <span className="text-sm font-medium">
                  {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : '4 Wheeler'}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="w-5"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Washing Centers Section */}
      <section className={`py-8 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : selectedVehicleType === 'four-wheeler' ? '4 Wheeler' : ''} Washing & Detailing Centers Near You
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Find professional {selectedVehicleType === 'two-wheeler' ? 'bike' : selectedVehicleType === 'four-wheeler' ? 'car' : ''} wash and detailing services
            </p>
          </div>

          {/* Mobile Filter and Sort Buttons - Outside of sidebar */}
          <div className="lg:hidden mb-6 flex justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center justify-center font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 border ${
                theme === 'light'
                  ? 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500'
              }`}
            >
              <span className="mr-2">Filters</span>
              <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative sort-dropdown">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`inline-flex items-center justify-center font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 border ${
                  theme === 'light'
                    ? 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                }`}
              >
                <span className="mr-2">
                  {sortBy === 'distance' ? 'Distance' : sortBy === 'rating' ? 'Rating' : 'Name'}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Sort Dropdown Menu */}
              {isSortOpen && (
                <div className={`absolute right-0 top-full mt-2 w-48 border rounded-lg shadow-lg z-50 ${
                  theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
                }`}>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSortBy('distance');
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === 'distance'
                          ? 'text-red-600 bg-gray-100'
                          : theme === 'light'
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-white hover:bg-gray-700'
                      } ${theme === 'light' && sortBy === 'distance' ? 'bg-gray-100' : ''} ${theme === 'dark' && sortBy === 'distance' ? 'bg-gray-700' : ''}`}
                    >
                      Distance
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('rating');
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === 'rating'
                          ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                          : theme === 'light'
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-white hover:bg-gray-700'
                      }`}
                    >
                      Rating
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === 'name'
                          ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                          : theme === 'light'
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-white hover:bg-gray-700'
                      }`}
                    >
                      Name
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Filters</h3>
                </div>
                
                {/* Mobile Filter Header - Only show when filters are open */}
                <div className={`lg:hidden flex items-center justify-between mb-6 ${isFilterOpen ? 'block' : 'hidden'}`}>
                  <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Filters</h3>
                </div>

                <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* Distance Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Maximum Distance
                    </label>
                    <select
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All Distances</option>
                      <option value="1">Within 1 km</option>
                      <option value="3">Within 3 km</option>
                      <option value="5">Within 5 km</option>
                      <option value="10">Within 10 km</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Minimum Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => {
                      setRating('all');
                      setDistance('all');
                      setSortBy('distance');
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Washing Centers Grid */}
            <div className={`${isFilterOpen && isMobile ? 'hidden' : 'block'} lg:col-span-3`}>
              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center">
                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {filteredGarages.length} {filteredGarages.length === 1 ? 'garage' : 'garages'} found
                </div>
              </div>

              {filteredGarages.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faSprayCan} className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Coming Soon
                  </p>
                  <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Washing & Detailing services are not available in your area yet. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGarages.map((garage) => (
                    <GarageCard
                      key={garage.id}
                      garage={garage}
                      onClick={() => handleGarageClick(garage)}
                      onShowLoginPopup={onShowLoginPopup}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WashingService;
