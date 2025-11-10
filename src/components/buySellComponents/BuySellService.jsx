import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCar, faMotorcycle, faTruck } from '@fortawesome/free-solid-svg-icons';
import VehicleTypeSelectorModal from '../common/VehicleTypeSelectorModal';
import { useTheme } from '../context/ThemeContext';

const BuySellService = ({ selectedCity, onBackToMain, onVehicleClick }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(true);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [maxKm, setMaxKm] = useState('all');
  const [location, setLocation] = useState('all');
  const [fuelType, setFuelType] = useState('all');
  const [ownerType, setOwnerType] = useState('all');
  const [condition, setCondition] = useState('all');

  // Dummy vehicle listings data
  const [vehicleListings, setVehicleListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Vehicle types for Buy/Sell
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
    },
    {
      id: 3,
      title: "Commercial",
      description: "Trucks, commercial vehicles",
      icon: faTruck,
      type: 'commercial',
      available: true
    }
  ];

  // Generate dummy vehicle listings based on selected vehicle type
  useEffect(() => {
    if (!selectedVehicleType) {
      setVehicleListings([]);
      return;
    }

    // Dummy data generator
    const generateDummyListings = () => {
      const listings = [];
      
      if (selectedVehicleType === 'two-wheeler') {
        const brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield'];
        const models = ['Activa', 'Pulsar', 'Splendor', 'Apache', 'Classic', 'Shine'];
        const years = [2020, 2021, 2022, 2023, 2024];
        const cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
        
        for (let i = 1; i <= 12; i++) {
          // Randomly assign partner to ~35% of listings
          const hasPartner = Math.random() < 0.35;
          const partner = hasPartner ? (Math.random() > 0.5 ? 'Spinny' : 'Cars24') : null;
          
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            price: Math.floor(Math.random() * 50000) + 30000, // ₹30k - ₹80k
            kmDriven: Math.floor(Math.random() * 30000) + 5000, // 5k - 35k km
            location: cities[Math.floor(Math.random() * cities.length)],
            image: 'https://quickinsure.s3.ap-south-1.amazonaws.com/uploads/static_page/a83d207a-a933-41ac-a446-db9d23682693/Ktm%20Upcoming%20Bikes%20In%20India%202023%20New%20Launches%20And%20Bike%20Insurance.png',
            ownerType: Math.random() > 0.5 ? 'First Owner' : 'Second Owner',
            fuelType: Math.random() > 0.5 ? 'Petrol' : 'Electric',
            condition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
            postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
            partner: partner
          });
        }
      } else if (selectedVehicleType === 'four-wheeler') {
        const brands = ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra'];
        const models = ['Swift', 'i20', 'City', 'Innova', 'Nexon', 'XUV700'];
        const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
        const cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
        
        for (let i = 1; i <= 12; i++) {
          // Randomly assign partner to ~35% of listings
          const hasPartner = Math.random() < 0.35;
          const partner = hasPartner ? (Math.random() > 0.5 ? 'Spinny' : 'Cars24') : null;
          
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            price: Math.floor(Math.random() * 1000000) + 300000, // ₹3L - ₹13L
            kmDriven: Math.floor(Math.random() * 80000) + 10000, // 10k - 90k km
            location: cities[Math.floor(Math.random() * cities.length)],
            image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
            ownerType: Math.random() > 0.5 ? 'First Owner' : 'Second Owner',
            fuelType: ['Petrol', 'Diesel', 'CNG', 'Electric'][Math.floor(Math.random() * 4)],
            condition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
            postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
            partner: partner
          });
        }
      } else if (selectedVehicleType === 'commercial') {
        const brands = ['Tata', 'Mahindra', 'Ashok Leyland', 'Eicher'];
        const models = ['Ace', 'Bolero Pickup', 'Dost', '407'];
        const years = [2019, 2020, 2021, 2022, 2023];
        const cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore'];
        
        for (let i = 1; i <= 8; i++) {
          // Randomly assign partner to ~35% of listings
          const hasPartner = Math.random() < 0.35;
          const partner = hasPartner ? (Math.random() > 0.5 ? 'Spinny' : 'Cars24') : null;
          
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            price: Math.floor(Math.random() * 2000000) + 500000, // ₹5L - ₹25L
            kmDriven: Math.floor(Math.random() * 150000) + 20000, // 20k - 170k km
            location: cities[Math.floor(Math.random() * cities.length)],
            image: 'https://images.news18.com/ibnlive/uploads/2022/09/tata-truck-1.jpg',
            ownerType: Math.random() > 0.5 ? 'First Owner' : 'Second Owner',
            fuelType: Math.random() > 0.5 ? 'Diesel' : 'CNG',
            condition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
            postedDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
            partner: partner
          });
        }
      }
      
      return listings;
    };

    const listings = generateDummyListings();
    setVehicleListings(listings);
  }, [selectedVehicleType]);

  // Handle vehicle type selection
  const handleVehicleTypeSelect = (vehicleType) => {
    setSelectedVehicleType(vehicleType.type);
    setIsVehicleModalOpen(false);
  };

  // Apply filters to listings
  useEffect(() => {
    let filtered = [...vehicleListings];

    // Price filter
    if (minPrice) {
      const min = parseInt(minPrice);
      filtered = filtered.filter(vehicle => vehicle.price >= min);
    }
    if (maxPrice) {
      const max = parseInt(maxPrice);
      filtered = filtered.filter(vehicle => vehicle.price <= max);
    }

    // Year filter
    if (minYear) {
      const min = parseInt(minYear);
      filtered = filtered.filter(vehicle => vehicle.year >= min);
    }
    if (maxYear) {
      const max = parseInt(maxYear);
      filtered = filtered.filter(vehicle => vehicle.year <= max);
    }

    // KM driven filter
    if (maxKm !== 'all') {
      const max = parseInt(maxKm);
      filtered = filtered.filter(vehicle => vehicle.kmDriven <= max);
    }

    // Location filter
    if (location !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.location === location);
    }

    // Fuel type filter
    if (fuelType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.fuelType === fuelType);
    }

    // Owner type filter
    if (ownerType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.ownerType === ownerType);
    }

    // Condition filter
    if (condition !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.condition === condition);
    }

    setFilteredListings(filtered);
  }, [vehicleListings, minPrice, maxPrice, minYear, maxYear, maxKm, location, fuelType, ownerType, condition]);

  // Sort filtered listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'year') {
      return b.year - a.year;
    } else if (sortBy === 'km') {
      return a.kmDriven - b.kmDriven;
    }
    return 0;
  });

  // Get unique locations from listings
  const availableLocations = [...new Set(vehicleListings.map(v => v.location))];
  const availableFuelTypes = [...new Set(vehicleListings.map(v => v.fuelType))];

  // Clear all filters
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setMaxKm('all');
    setLocation('all');
    setFuelType('all');
    setOwnerType('all');
    setCondition('all');
  };

  // Show vehicle type selection modal first
  if (isVehicleModalOpen) {
    return (
      <VehicleTypeSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={onBackToMain}
        onSelectVehicleType={handleVehicleTypeSelect}
        title="Select Vehicle Type"
        description="Choose your vehicle type to browse listings"
        vehicleTypes={vehicleTypes}
        headerIcon={faShoppingCart}
        headerTitle="Buy/Sell Vehicles"
        onBack={onBackToMain}
        footerText="Click on any vehicle type to browse available listings"
      />
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
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Buy/Sell Vehicles
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
                  icon={selectedVehicleType === 'two-wheeler' ? faMotorcycle : selectedVehicleType === 'four-wheeler' ? faCar : faTruck} 
                  className="text-sm"
                />
                <span className="text-sm font-medium">
                  {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : selectedVehicleType === 'four-wheeler' ? '4 Wheeler' : 'Commercial'}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="w-5"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Vehicle Listings Section */}
      <section className={`py-8 px-4 ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : selectedVehicleType === 'four-wheeler' ? '4 Wheeler' : 'Commercial'} Vehicles for Sale
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Browse available {selectedVehicleType === 'two-wheeler' ? 'bikes and scooters' : selectedVehicleType === 'four-wheeler' ? 'cars and SUVs' : 'commercial vehicles'} in your area
            </p>
          </div>

          {/* Filters and Listings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className={`${isMobile ? (isFilterOpen ? 'block' : 'hidden') : 'block'} lg:col-span-1`}>
              <div className={`rounded-lg border p-4 sticky top-4 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
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

                <div className="space-y-4">
                  {/* Price Range */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Price Range (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-800 text-white border-gray-600'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-800 text-white border-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Year Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                        min="2010"
                        max="2024"
                        className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-800 text-white border-gray-600'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.target.value)}
                        min="2010"
                        max="2024"
                        className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light'
                            ? 'bg-white text-gray-900 border-gray-300'
                            : 'bg-gray-800 text-white border-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* KM Driven */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Maximum KM Driven
                    </label>
                    <select
                      value={maxKm}
                      onChange={(e) => setMaxKm(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="10000">Under 10,000 km</option>
                      <option value="20000">Under 20,000 km</option>
                      <option value="30000">Under 30,000 km</option>
                      <option value="50000">Under 50,000 km</option>
                      <option value="100000">Under 1,00,000 km</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All Locations</option>
                      {availableLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Fuel Type
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All Fuel Types</option>
                      {availableFuelTypes.map((fuel) => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Owner Type */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Owner Type
                    </label>
                    <select
                      value={ownerType}
                      onChange={(e) => setOwnerType(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="First Owner">First Owner</option>
                      <option value="Second Owner">Second Owner</option>
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-300'
                          : 'bg-gray-800 text-white border-gray-600'
                      }`}
                    >
                      <option value="all">All Conditions</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
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
                  {sortedListings.length} {sortedListings.length === 1 ? 'vehicle' : 'vehicles'} found
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`inline-flex items-center justify-center font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 border ${
                      theme === 'light'
                        ? 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <span className="mr-2">
                      Sort: {sortBy === 'price' ? 'Price (Low to High)' : sortBy === 'price-desc' ? 'Price (High to Low)' : sortBy === 'year' ? 'Year (Newest)' : 'KM (Lowest)'}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Sort Dropdown Menu */}
                  {isSortOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 border rounded-lg shadow-lg z-50 ${
                      theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
                    }`}>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setSortBy('price');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortBy === 'price'
                              ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                              : theme === 'light'
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-white hover:bg-gray-700'
                          }`}
                        >
                          Price: Low to High
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('price-desc');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortBy === 'price-desc'
                              ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                              : theme === 'light'
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-white hover:bg-gray-700'
                          }`}
                        >
                          Price: High to Low
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('year');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortBy === 'year'
                              ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                              : theme === 'light'
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-white hover:bg-gray-700'
                          }`}
                        >
                          Year: Newest First
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('km');
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortBy === 'km'
                              ? theme === 'light' ? 'text-red-600 bg-gray-100' : 'text-red-400 bg-gray-700'
                              : theme === 'light'
                              ? 'text-gray-700 hover:bg-gray-50'
                              : 'text-white hover:bg-gray-700'
                          }`}
                        >
                          KM Driven: Lowest First
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Listings Grid */}
              {sortedListings.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faShoppingCart} className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    No vehicles found for this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`rounded-xl overflow-hidden transition-all cursor-pointer ${
                        theme === 'light' 
                          ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        if (onVehicleClick) {
                          onVehicleClick(vehicle);
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = selectedVehicleType === 'two-wheeler' 
                              ? 'https://quickinsure.s3.ap-south-1.amazonaws.com/uploads/static_page/a83d207a-a933-41ac-a446-db9d23682693/Ktm%20Upcoming%20Bikes%20In%20India%202023%20New%20Launches%20And%20Bike%20Insurance.png'
                              : selectedVehicleType === 'four-wheeler'
                              ? 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400'
                              : 'https://images.news18.com/ibnlive/uploads/2022/09/tata-truck-1.jpg';
                          }}
                        />
                        {/* Partner Logo - Left Side */}
                        {vehicle.partner && (
                          <div className="absolute top-2 left-2 bg-white bg-opacity-95 rounded-lg px-1.5 py-1  shadow-lg flex items-center border border-gray-200">
                            <img
                              src={vehicle.partner === 'Spinny' 
                                ? 'https://latestlogo.com/wp-content/uploads/2024/01/spinny-dark.svg'
                                : 'https://wp.logos-download.com/wp-content/uploads/2023/02/Cars24_Logo.png?dl'
                              }
                              alt={vehicle.partner}
                              className="max-h-4 w-auto object-contain"
                              style={{ aspectRatio: 'auto' }}
                              onError={(e) => {
                                // Fallback to text if image fails to load
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent && !parent.querySelector('.fallback-text')) {
                                  const fallback = document.createElement('span');
                                  fallback.className = `fallback-text text-xs font-bold ${
                                    vehicle.partner === 'Spinny' 
                                      ? 'text-blue-700' 
                                      : 'text-orange-700'
                                  }`;
                                  fallback.textContent = vehicle.partner;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        )}
                        {/* Condition Badge - Right Side */}
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {vehicle.condition}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {vehicle.year} • {vehicle.kmDriven.toLocaleString()} km
                          </p>
                        </div>
                        
                        <div className={`flex items-center text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{vehicle.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {vehicle.ownerType} • {vehicle.fuelType}
                          </span>
                          <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {vehicle.postedDate}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div>
                            <span className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              ₹{vehicle.price.toLocaleString()}
                            </span>
                          </div>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view details - will be handled by parent component
                          if (onVehicleClick) {
                            onVehicleClick(vehicle);
                          }
                        }}
                      >
                        View Details
                      </button>
                        </div>
                      </div>
                    </div>
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

export default BuySellService;

