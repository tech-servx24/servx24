import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import GarageCard from '../homeComponents/GarageCard';
import VehicleTypeSelectorModal from '../common/VehicleTypeSelectorModal';
import { getGaragesByServiceCategory } from '../../services/garageService';
import { apiGet } from '../../utils/api';
import { getStoredLocationData } from '../../utils/geolocation';
import { useTheme } from '../context/ThemeContext';

// Fallback Emergency Services Category ID - Update this if the ID changes
// Check admin panel Service Categories table for the actual ID of "Emergency Services" or "Roadside Assistant"
const FALLBACK_EMERGENCY_SERVICE_ID = 5; // Roadside Assistant (RSA) - Update based on actual ID in admin panel

const EmergencyService = ({ selectedCity, onBackToMain, onEmergencyGarageClick, onShowLoginPopup }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [emergencyGarages, setEmergencyGarages] = useState([]);
  const [filteredGarages, setFilteredGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationReady, setLocationReady] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [rating, setRating] = useState('all');
  const [distance, setDistance] = useState('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emergencyServiceCategoryId, setEmergencyServiceCategoryId] = useState(null);
  const [error, setError] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(true); // Show modal first
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);

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

  // Fetch Emergency Services category ID from API
  useEffect(() => {
    const fetchEmergencyServiceCategory = async () => {
      try {
        const city = selectedCity || sessionStorage.getItem("selectedCity") || 'Pune';
        const cityParam = city.toLowerCase();
        const response = await apiGet(`/active-cities/?city=${cityParam}`);
        
        console.log('🚨 Emergency Service - Full API response:', response);
        console.log('🚨 Emergency Service - Service categories:', response.data?.filter?.services);
        
        if (response.status === "success" && response.data?.filter?.services) {
          const services = response.data.filter.services;
          
          // Log all available service categories for debugging
          console.log('🚨 Available service categories:', services.map(s => ({ id: s.id, name: s.name })));
          
          // Try multiple variations of emergency/roadside service name matching
          const emergencyService = services.find(
            service => {
              const name = service.name.toLowerCase();
              return name.includes('emergency') || 
                     name.includes('roadside') ||
                     name.includes('rsa') ||
                     name === 'roadside assistant' ||
                     name === 'roadside assistance' ||
                     name.includes('24/7') ||
                     name.includes('breakdown');
            }
          );
          
          if (emergencyService) {
            console.log('✅ Emergency Services category found in API response:', emergencyService);
            console.log('🚨 Using ID from API response:', emergencyService.id);
            setEmergencyServiceCategoryId(emergencyService.id);
          } else {
            console.log('⚠️ Emergency Services category not found in displayed categories');
            console.log('⚠️ Available categories:', services.map(s => `${s.id}: ${s.name}`));
            console.log('🚨 Note: "Emergency Services" or "Roadside Assistant" may exist in backend but Display is "Hidden"');
            console.log(`🚨 Using fallback ID ${FALLBACK_EMERGENCY_SERVICE_ID} for Emergency Services`);
            setEmergencyServiceCategoryId(FALLBACK_EMERGENCY_SERVICE_ID);
          }
        } else {
          console.log(`⚠️ No service categories in response, using fallback ID ${FALLBACK_EMERGENCY_SERVICE_ID}`);
          setEmergencyServiceCategoryId(FALLBACK_EMERGENCY_SERVICE_ID);
        }
      } catch (error) {
        console.error('❌ Error fetching Emergency Services category:', error);
        console.log(`🚨 Using fallback ID ${FALLBACK_EMERGENCY_SERVICE_ID} for Emergency Services`);
        setEmergencyServiceCategoryId(FALLBACK_EMERGENCY_SERVICE_ID);
      }
    };

    if (selectedCity || locationReady) {
      fetchEmergencyServiceCategory();
    }
  }, [selectedCity, locationReady]);

  // Fetch Emergency Services garages when location and service category ID are ready
  useEffect(() => {
    if (!locationReady || !emergencyServiceCategoryId || isVehicleModalOpen) return;

    const fetchEmergencyGarages = async () => {
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
            service: [emergencyServiceCategoryId], // Filter by Emergency Services category
          },
        };

        console.log('🚨 Fetching Emergency Services garages with service category ID:', emergencyServiceCategoryId);
        console.log('🚨 Request data:', JSON.stringify(requestData, null, 2));
        
        // Validate that service category ID is set
        if (!emergencyServiceCategoryId || !requestData.filter.service || requestData.filter.service.length === 0) {
          console.error('❌ Emergency Services Category ID is not set!');
          setError('Emergency Services category ID not found. Please check the console for details.');
          setLoading(false);
          return;
        }
        
        const response = await getGaragesByServiceCategory(requestData);
        console.log('🚨 Emergency Services Garage response:', response);
        console.log('🚨 Number of garages returned:', response?.data?.length || 0);

        if (response && response.data && response.data.length > 0) {
          console.log(`✅ Found ${response.data.length} Emergency Services garages`);
          setEmergencyGarages(response.data);
          setFilteredGarages(response.data);
        } else {
          setEmergencyGarages([]);
          setFilteredGarages([]);
          console.log('⚠️ No Emergency Services garages found with service category ID:', emergencyServiceCategoryId);
          setError(null); // Don't show error, show "Coming Soon" message instead
        }
      } catch (error) {
        console.error("❌ Failed to fetch Emergency Services garages:", error);
        setError('Failed to load Emergency Services garages');
        setEmergencyGarages([]);
        setFilteredGarages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyGarages();
  }, [locationReady, selectedCity, emergencyServiceCategoryId, isVehicleModalOpen]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...emergencyGarages];

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
  }, [emergencyGarages, rating, distance, sortBy]);

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

  // Vehicle types for RSA service
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
  const handleVehicleTypeSelect = (vehicleType) => {
    setSelectedVehicleType(vehicleType.type);
    setIsVehicleModalOpen(false);
  };

  const handleGarageClick = (garage) => {
    if (onEmergencyGarageClick) {
      onEmergencyGarageClick(garage);
    }
  };

  if (loading && !isVehicleModalOpen) {
    return (
      <div className={`py-12 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto border-red-600"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
              Loading Roadside Assistance...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show vehicle type selection modal first
  if (isVehicleModalOpen) {
    return (
      <VehicleTypeSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={onBackToMain}
        onSelectVehicleType={handleVehicleTypeSelect}
        title="Select Vehicle Type"
        description="Choose your vehicle type to find roadside assistance services"
        vehicleTypes={vehicleTypes}
        headerIcon={faExclamationTriangle}
        headerTitle="Roadside Assistance (RSA)"
        onBack={onBackToMain}
        footerText="Click on any vehicle type to find roadside assistance services near you"
      />
    );
  }

  if (error) {
    return (
      <div className={`py-12 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {error}
            </p>
            <button
              onClick={onBackToMain}
              className="mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
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
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Roadside Assistance (RSA)
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

      {/* Roadside Assistance Section */}
      <section className={`py-8 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : selectedVehicleType === 'four-wheeler' ? '4 Wheeler' : ''} Roadside Assistance (RSA)
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Find garages offering roadside assistance for {selectedVehicleType === 'two-wheeler' ? 'bikes' : selectedVehicleType === 'four-wheeler' ? 'cars' : ''}
            </p>
          </div>

          {/* Filters and Sort Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Filter Sidebar */}
            <div className={`${isFilterOpen || !isMobile ? 'block' : 'hidden lg:block'} lg:col-span-1`}>
              <div className={`rounded-lg border p-4 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Filters</h3>
                  {isMobile && (
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className={`text-gray-500 hover:text-gray-700 ${theme === 'light' ? 'hover:text-gray-700' : 'hover:text-gray-300'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Distance Filter */}
                <div className="mb-6">
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
                <div className="mb-6">
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

            {/* Main Content Area */}
            <div className={`${isFilterOpen && isMobile ? 'hidden' : 'block'} lg:col-span-3`}>
              {/* Sort and Filter Toggle */}
              <div className="mb-6 flex justify-between items-center gap-4">
                {/* Filter Toggle Button (Mobile) */}
                {isMobile && (
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`inline-flex items-center justify-center font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 border ${
                      theme === 'light'
                        ? 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                  </button>
                )}
                
                {/* Results Count */}
                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {filteredGarages.length} {filteredGarages.length === 1 ? 'garage' : 'garages'} found
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative sort-dropdown ml-auto">
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
                              ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                              : theme === 'light'
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-white hover:bg-gray-700'
                          }`}
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

              {filteredGarages.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faExclamationTriangle} className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Coming Soon
                  </p>
                  <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Roadside Assistance (RSA) services are not available in your area yet. Please check back later.
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

export default EmergencyService;

