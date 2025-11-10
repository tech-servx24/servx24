import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCar, faMotorcycle, faTruck } from '@fortawesome/free-solid-svg-icons';
import VehicleTypeSelectorModal from '../common/VehicleTypeSelectorModal';
import { useTheme } from '../context/ThemeContext';

const RentService = ({ selectedCity, onBackToMain, onVehicleClick }) => {
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
  const [rentalType, setRentalType] = useState('all'); // daily, weekly, monthly
  const [transmission, setTransmission] = useState('all'); // manual, automatic

  // Dummy vehicle rental listings data
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

  // Vehicle types for Rent
  const vehicleTypes = [
    {
      id: 1,
      title: "2 Wheeler",
      description: "Bikes, scooters, motorcycles",
      icon: faMotorcycle,
      type: 'two-wheeler',
      available: true,
      gradient: "from-green-400 to-cyan-500"
    },
    {
      id: 2,
      title: "4 Wheeler",
      description: "Cars, SUVs, passenger vehicles",
      icon: faCar,
      type: 'four-wheeler',
      available: true,
      gradient: "from-blue-400 to-purple-500"
    },
    {
      id: 3,
      title: "Commercial",
      description: "Trucks, commercial vehicles",
      icon: faTruck,
      type: 'commercial',
      available: true,
      gradient: "from-red-400 to-pink-500"
    }
  ];

  // Generate dummy vehicle rental listings based on selected vehicle type
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
        const fuelTypes = ['Petrol', 'Electric'];
        const transmissions = ['Manual', 'Automatic'];
        const rentalTypes = ['Daily', 'Weekly', 'Monthly'];
        
        for (let i = 1; i <= 12; i++) {
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            dailyPrice: Math.floor(Math.random() * 500) + 200, // ₹200 - ₹700/day
            weeklyPrice: Math.floor(Math.random() * 3000) + 1200, // ₹1200 - ₹4200/week
            monthlyPrice: Math.floor(Math.random() * 10000) + 5000, // ₹5000 - ₹15000/month
            kmDriven: Math.floor(Math.random() * 30000) + 5000, // 5k - 35k km
            location: cities[Math.floor(Math.random() * cities.length)],
            fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
            transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
            rentalType: rentalTypes[Math.floor(Math.random() * rentalTypes.length)],
            image: 'https://quickinsure.s3.ap-south-1.amazonaws.com/uploads/static_page/a83d207a-a933-41ac-a446-db9d23682693/Ktm%20Upcoming%20Bikes%20In%20India%202023%20New%20Launches%20And%20Bike%20Insurance.png',
            available: Math.random() > 0.2, // 80% available
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
            reviews: Math.floor(Math.random() * 50) + 10
          });
        }
      } else if (selectedVehicleType === 'four-wheeler') {
        const brands = ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata'];
        const models = ['Swift', 'i20', 'City', 'Innova', 'XUV', 'Nexon'];
        const years = [2020, 2021, 2022, 2023, 2024];
        const cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
        const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];
        const transmissions = ['Manual', 'Automatic'];
        const rentalTypes = ['Daily', 'Weekly', 'Monthly'];
        
        for (let i = 1; i <= 12; i++) {
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            dailyPrice: Math.floor(Math.random() * 2000) + 1000, // ₹1000 - ₹3000/day
            weeklyPrice: Math.floor(Math.random() * 12000) + 6000, // ₹6000 - ₹18000/week
            monthlyPrice: Math.floor(Math.random() * 40000) + 20000, // ₹20000 - ₹60000/month
            kmDriven: Math.floor(Math.random() * 50000) + 10000, // 10k - 60k km
            location: cities[Math.floor(Math.random() * cities.length)],
            fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
            transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
            rentalType: rentalTypes[Math.floor(Math.random() * rentalTypes.length)],
            image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
            available: Math.random() > 0.2, // 80% available
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
            reviews: Math.floor(Math.random() * 50) + 10
          });
        }
      } else if (selectedVehicleType === 'commercial') {
        const brands = ['Tata', 'Mahindra', 'Ashok Leyland', 'Eicher'];
        const models = ['Ace', 'Bolero', '407', 'Pro'];
        const years = [2020, 2021, 2022, 2023];
        const cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore'];
        const fuelTypes = ['Diesel', 'CNG'];
        const transmissions = ['Manual'];
        const rentalTypes = ['Daily', 'Weekly', 'Monthly'];
        
        for (let i = 1; i <= 8; i++) {
          listings.push({
            id: i,
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            year: years[Math.floor(Math.random() * years.length)],
            dailyPrice: Math.floor(Math.random() * 3000) + 1500, // ₹1500 - ₹4500/day
            weeklyPrice: Math.floor(Math.random() * 18000) + 9000, // ₹9000 - ₹27000/week
            monthlyPrice: Math.floor(Math.random() * 60000) + 30000, // ₹30000 - ₹90000/month
            kmDriven: Math.floor(Math.random() * 100000) + 20000, // 20k - 120k km
            location: cities[Math.floor(Math.random() * cities.length)],
            fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
            transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
            rentalType: rentalTypes[Math.floor(Math.random() * rentalTypes.length)],
            image: 'https://images.news18.com/ibnlive/uploads/2022/09/tata-truck-1.jpg',
            available: Math.random() > 0.3, // 70% available
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
            reviews: Math.floor(Math.random() * 30) + 5
          });
        }
      }
      
      return listings;
    };

    const listings = generateDummyListings();
    setVehicleListings(listings);
    setFilteredListings(listings);
  }, [selectedVehicleType]);

  const handleVehicleTypeSelect = (vehicleType) => {
    setSelectedVehicleType(vehicleType.type);
    setIsVehicleModalOpen(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicleListings];

    // Price filter (daily price)
    if (minPrice) {
      const min = parseInt(minPrice);
      filtered = filtered.filter(vehicle => vehicle.dailyPrice >= min);
    }
    if (maxPrice) {
      const max = parseInt(maxPrice);
      filtered = filtered.filter(vehicle => vehicle.dailyPrice <= max);
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

    // Rental type filter
    if (rentalType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.rentalType === rentalType);
    }

    // Transmission filter
    if (transmission !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.transmission === transmission);
    }

    setFilteredListings(filtered);
  }, [vehicleListings, minPrice, maxPrice, minYear, maxYear, maxKm, location, fuelType, rentalType, transmission]);

  // Sort filtered listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price') {
      return a.dailyPrice - b.dailyPrice;
    } else if (sortBy === 'price-desc') {
      return b.dailyPrice - a.dailyPrice;
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
    setRentalType('all');
    setTransmission('all');
  };

  // Show vehicle type selection modal first
  if (isVehicleModalOpen) {
    return (
      <VehicleTypeSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={onBackToMain}
        onSelectVehicleType={handleVehicleTypeSelect}
        title="Select Vehicle Type"
        description="Choose your vehicle type to browse rental listings"
        vehicleTypes={vehicleTypes}
        headerIcon={faKey}
        headerTitle="Rent Vehicles"
        onBack={onBackToMain}
        footerText="Click on any vehicle type to browse available rental listings"
      />
    );
  }

  const handleVehicleClick = (vehicle) => {
    if (onVehicleClick) {
      onVehicleClick(vehicle, true); // Pass true to indicate it's a rent vehicle
    } else {
      // Navigate to vehicle detail page
      navigate(`/rent-vehicle/${vehicle.id}?vehicleType=${selectedVehicleType}`);
    }
  };

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
              <FontAwesomeIcon icon={faKey} className="mr-2" />
              Rent Vehicles
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
              {selectedVehicleType === 'two-wheeler' ? '2 Wheeler' : selectedVehicleType === 'four-wheeler' ? '4 Wheeler' : 'Commercial'} Vehicles for Rent
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Browse available {selectedVehicleType === 'two-wheeler' ? 'bikes and scooters' : selectedVehicleType === 'four-wheeler' ? 'cars and SUVs' : 'commercial vehicles'} for rent in your area
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
                      Daily Price (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Year
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* KM Driven */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Max KM Driven
                    </label>
                    <select
                      value={maxKm}
                      onChange={(e) => setMaxKm(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="10000">Up to 10,000 km</option>
                      <option value="25000">Up to 25,000 km</option>
                      <option value="50000">Up to 50,000 km</option>
                      <option value="100000">Up to 100,000 km</option>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                      }`}
                    >
                      <option value="all">All Locations</option>
                      {availableLocations.map(loc => (
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                      }`}
                    >
                      <option value="all">All</option>
                      {availableFuelTypes.map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rental Type */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Rental Type
                    </label>
                    <select
                      value={rentalType}
                      onChange={(e) => setRentalType(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Transmission
                    </label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  {/* Clear Filters Button */}
                  <button
                    onClick={clearFilters}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="lg:col-span-3">
              {/* Sort and Filter Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {isMobile && (
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                          : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                    </button>
                  )}
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {filteredListings.length} vehicles available
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                        : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">Sort: </span>
                    <span className="text-sm">
                      {sortBy === 'price' ? 'Price: Low to High' :
                       sortBy === 'price-desc' ? 'Price: High to Low' :
                       sortBy === 'year' ? 'Year: Newest' :
                       sortBy === 'km' ? 'KM: Low to High' : 'Default'}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10 ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
                    }`}>
                      <button
                        onClick={() => { setSortBy('price'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'
                        }`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'
                        }`}
                      >
                        Price: High to Low
                      </button>
                      <button
                        onClick={() => { setSortBy('year'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'
                        }`}
                      >
                        Year: Newest
                      </button>
                      <button
                        onClick={() => { setSortBy('km'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          theme === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-700 text-white'
                        }`}
                      >
                        KM: Low to High
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Cards */}
              {sortedListings.length === 0 ? (
                <div className={`text-center py-12 rounded-lg border ${
                  theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'
                }`}>
                  <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    No vehicles found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleClick(vehicle)}
                      className={`rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-xl transform hover:scale-105 ${
                        theme === 'light'
                          ? 'bg-white border-gray-200 hover:border-red-500'
                          : 'bg-gray-800 border-gray-700 hover:border-red-500'
                      } ${!vehicle.available ? 'opacity-60' : ''}`}
                    >
                      {/* Vehicle Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        {!vehicle.available && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                              Not Available
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            vehicle.rentalType === 'Daily' ? 'bg-green-500 text-white' :
                            vehicle.rentalType === 'Weekly' ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {vehicle.rentalType}
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="p-4">
                        <h3 className={`text-lg font-bold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {vehicle.year} • {vehicle.kmDriven.toLocaleString()} km • {vehicle.fuelType} • {vehicle.transmission}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Daily</p>
                            <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              ₹{vehicle.dailyPrice}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Weekly</p>
                            <p className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              ₹{vehicle.weeklyPrice}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Monthly</p>
                            <p className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              ₹{vehicle.monthlyPrice}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              {vehicle.rating}
                            </span>
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              ({vehicle.reviews})
                            </span>
                          </div>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {vehicle.location}
                          </p>
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

export default RentService;

