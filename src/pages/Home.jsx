import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/homeComponents/Header';
import LandingPage from '../components/homeComponents/LandingPage';
import GarageListingPage from '../components/garageComponents/GarageListingPage';
import GarageDetailPage from '../components/garageComponents/GarageDetailPage';
import WashingService from '../components/washingComponents/WashingService';
import EVService from '../components/evComponents/EVService';
import EmergencyService from '../components/emergencyComponents/EmergencyService';
import BuySellService from '../components/buySellComponents/BuySellService';
import RentService from '../components/rentComponents/RentService';
import VehicleDetailPage from '../components/buySellComponents/VehicleDetailPage';
import RentVehicleDetailPage from '../components/rentComponents/RentVehicleDetailPage';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { fetchLandingPageData } from '../services/landingpage';
import { getCurrentLocation, getCityFromCoordinates, storeLocationData } from '../utils/geolocation';
import LoginPopup from '../components/homeComponents/LoginPopup';
import { useTheme } from '../components/context/ThemeContext';

const Home = ({ setCurrentPage }) => {
  const { theme } = useTheme();
  // State management - exact from original site
  const [selectedCity, setSelectedCity] = useState(() => {
    const city = sessionStorage.getItem("selectedCity") || "Pune";
    // Convert localities to main cities
    if (city === "Mulshi" || city === "Hinjewadi" || city === "Wakad" || city === "Baner") {
      sessionStorage.setItem("selectedCity", "Pune");
      return "Pune";
    }
    return city;
  });
  const [landingData, setLandingData] = useState({});
  const [cities, setCities] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filters, setFilters] = useState(null);
  const [locationReady, setLocationReady] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [garages, setGarages] = useState([]);
  const [showGarageListing, setShowGarageListing] = useState(false);
  const [showWashingService, setShowWashingService] = useState(false);
  const [showEVService, setShowEVService] = useState(false);
  const [showEmergencyService, setShowEmergencyService] = useState(false);
  const [showBuySellService, setShowBuySellService] = useState(false);
  const [showRentService, setShowRentService] = useState(false);
  const [isRentVehicleDetail, setIsRentVehicleDetail] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showGarageDetail, setShowGarageDetail] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDetail, setShowVehicleDetail] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginPopupGarageId, setLoginPopupGarageId] = useState(null);
  const [loginPopupWashingCenterId, setLoginPopupWashingCenterId] = useState(null);

  // Ref for ServiceCategories component to access its modal functions
  const serviceCategoriesRef = useRef(null);

  // Handle URL parameters for returning from booking flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleType = urlParams.get('vehicleType');
    const returnTo = urlParams.get('returnTo');
    
    if (vehicleType) {
      console.log('📍 Returning from booking flow, showing garage list for:', vehicleType);
      setSelectedVehicleType(vehicleType);
      setShowGarageListing(true);
      setSelectedServiceId(1);
    } else if (returnTo === 'washing-list') {
      console.log('📍 Returning from washing booking flow, showing washing service');
      setShowWashingService(true);
    } else if (returnTo === 'ev-list') {
      console.log('📍 Returning from EV booking flow, showing EV service');
      setShowEVService(true);
    }
  }, []);

  // Geolocation setup - simplified approach like old website
  useEffect(() => {
    // Check if we already have location data
    if (sessionStorage.getItem("latitude") && sessionStorage.getItem("longitude")) {
      console.log("📍 Using existing location data");
      setLocationReady(true);
      return;
    }

    // Simple geolocation approach (like old website)
    const initializeLocation = async () => {
      setIsDetectingLocation(true);
      try {
        console.log("📍 Attempting to get current location...");
        const { latitude, longitude } = await getCurrentLocation();
        
        console.log("📍 Coordinates obtained:", { latitude, longitude });
        
        // Get city information from coordinates
        const cityData = await getCityFromCoordinates(latitude, longitude);
        console.log("📍 City data:", cityData);
        
        // Store location data with city information
        storeLocationData(latitude, longitude, cityData);
        
        // Update selected city if we got a valid city
        if (cityData.city) {
          setSelectedCity(cityData.city);
          console.log("📍 Updated selected city to:", cityData.city);
        }
        
        setLocationReady(true);
      } catch (error) {
        console.error("📍 Geolocation failed:", error);
        
        // Set fallback coordinates (Pune)
        const fallbackLat = 18.5204;
        const fallbackLng = 73.8567;
        sessionStorage.setItem("latitude", fallbackLat.toString());
        sessionStorage.setItem("longitude", fallbackLng.toString());
        sessionStorage.setItem("selectedCity", "Pune");
        
        console.log("📍 Using fallback location: Pune");
        setLocationReady(true);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    initializeLocation();
  }, []);

  // Load landing page data - exact from original site
  useEffect(() => {
    const loadLandingPage = async (city) => {
      try {
        const data = await fetchLandingPageData(city.toLowerCase());
        setLandingData(data);
        setCities(data?.cities || []);
        setFilterData(data?.filter || {});
      } catch (err) {
        console.error("Failed to load landing page data:", err);
      }
    };

    const cityToLoad = selectedCity || sessionStorage.getItem("selectedCity") || "Pune";
    loadLandingPage(cityToLoad);
  }, [selectedCity]);

  // Session storage management - exact from original site
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectedCity") {
        setSelectedCity(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const cityFromStorage = sessionStorage.getItem("selectedCity");
      if (cityFromStorage !== selectedCity) {
        setSelectedCity(cityFromStorage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedCity]);

  // Scroll to top when vehicle type changes (garage page opens)
  useEffect(() => {
    if (selectedVehicleType) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedVehicleType]);

  // Handle service category click
  const handleServiceClick = (serviceType) => {
    if (serviceType === 'two-wheeler' || serviceType === 'four-wheeler') {
      setShowGarageListing(true);
      setSelectedVehicleType(serviceType);
      setSelectedServiceId(1); // Garage service ID
    } else if (serviceType === 'washing-detailing') {
      setShowWashingService(true);
    } else if (serviceType === 'ev-service') {
      setShowEVService(true);
    } else if (serviceType === 'emergency') {
      setShowEmergencyService(true);
    } else if (serviceType === 'buy-sell') {
      setShowBuySellService(true);
    } else if (serviceType === 'rent') {
      setShowRentService(true);
    } else {
      // Show coming soon for other services
      alert(`${serviceType} service - Coming Soon!`);
    }
  };

  // Handle vehicle type change from garage pages
  const handleVehicleTypeChange = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
  };

  // Handle opening vehicle type modal from BannerCarousel
  const handleFindGaragesClick = () => {
    if (serviceCategoriesRef.current) {
      serviceCategoriesRef.current.openVehicleModal();
    }
  };

  // Handle garage click
  const handleGarageClick = (garage) => {
    setSelectedGarage(garage);
    setShowGarageDetail(true);
  };

  // Handle vehicle click from buy/sell service
  const handleVehicleClick = (vehicle, isRent = false) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetail(true);
    setIsRentVehicleDetail(isRent);
  };

  // Close vehicle detail
  const closeVehicleDetail = () => {
    setShowVehicleDetail(false);
    setSelectedVehicle(null);
    setIsRentVehicleDetail(false);
  };

  // Handle filter apply
  const handleFilterApply = (newFilters) => {
    console.log("Filters received from child:", newFilters);
    setFilters(newFilters);
  };

  // Close garage detail modal
  const closeGarageDetail = () => {
    setShowGarageDetail(false);
    setSelectedGarage(null);
  };

  // Back to main page
  const backToMain = () => {
    setShowGarageListing(false);
    setShowWashingService(false);
    setShowEVService(false);
    setShowEmergencyService(false);
    setShowBuySellService(false);
    setShowRentService(false);
    setSelectedVehicleType(null);
    setSelectedServiceId(null);
    // Scroll to top when going back to main page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle login popup from garage cards
  const handleShowLoginPopup = (garageId) => {
    console.log("🔍 Showing login popup for garage:", garageId);
    setLoginPopupGarageId(garageId);
    setLoginPopupWashingCenterId(null);
    setShowLoginPopup(true);
  };

  // Handle login popup from washing service
  const handleShowWashingLoginPopup = (washingCenterId) => {
    console.log("🔍 Showing login popup for washing center:", washingCenterId);
    setLoginPopupWashingCenterId(washingCenterId);
    setLoginPopupGarageId(null);
    setShowLoginPopup(true);
  };

  // Handle login success for garage detail
  const handleLoginSuccess = () => {
    console.log("✅ Login successful, proceeding to booking");
    if (loginPopupWashingCenterId) {
      // Login popup from washing service
      window.location.href = `/washing-booking?washingCenterId=${loginPopupWashingCenterId}&returnTo=washing-list&vehicleType=all`;
    } else if (loginPopupGarageId && showEVService) {
      // Login popup from EV service
      window.location.href = `/booking?garageId=${loginPopupGarageId}&returnTo=ev-list&vehicleType=all`;
    } else if (loginPopupGarageId) {
      // Login popup from garage card (regular garage listing)
      window.location.href = `/booking?garageId=${loginPopupGarageId}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
    } else if (selectedGarage) {
      // Login popup from garage detail
      closeGarageDetail();
      window.location.href = `/booking?garageId=${selectedGarage.id}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
    } else {
      // Fallback - refresh the page to retry booking
      console.log("Login successful, refreshing page");
      window.location.reload();
    }
    setShowLoginPopup(false);
    setLoginPopupGarageId(null);
    setLoginPopupWashingCenterId(null);
  };

  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header */}
      <Header 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
        setCurrentPage={setCurrentPage}
        scrollToTop={scrollToTop}
        onBackToMain={backToMain}
        isDetectingLocation={isDetectingLocation}
      />


      {/* Main Content */}
      <main>
        {!showGarageListing && !showWashingService && !showEVService && !showEmergencyService && !showBuySellService && !showRentService ? (
          <LandingPage
            ref={serviceCategoriesRef}
              banners={landingData.banners || []} 
              onFindGaragesClick={handleFindGaragesClick}
              onServiceClick={handleServiceClick} 
            />
        ) : showWashingService ? (
          <WashingService
            selectedCity={selectedCity}
            onBackToMain={backToMain}
            onWashingCenterClick={handleGarageClick}
            onShowLoginPopup={handleShowWashingLoginPopup}
          />
        ) : showEVService ? (
          <EVService
            selectedCity={selectedCity}
            onBackToMain={backToMain}
            onEVGarageClick={handleGarageClick}
            onShowLoginPopup={handleShowLoginPopup}
          />
        ) : showEmergencyService ? (
          <EmergencyService
            selectedCity={selectedCity}
            onBackToMain={backToMain}
            onEmergencyGarageClick={handleGarageClick}
            onShowLoginPopup={handleShowLoginPopup}
          />
        ) : showBuySellService && !showVehicleDetail ? (
          <BuySellService
            selectedCity={selectedCity}
            onBackToMain={backToMain}
            onVehicleClick={handleVehicleClick}
          />
        ) : showRentService && !showVehicleDetail ? (
          <RentService
            selectedCity={selectedCity}
            onBackToMain={backToMain}
            onVehicleClick={handleVehicleClick}
          />
        ) : showVehicleDetail && selectedVehicle && isRentVehicleDetail ? (
          <RentVehicleDetailPage
            vehicle={selectedVehicle}
            onClose={closeVehicleDetail}
            onRentNow={(rentalData) => {
              alert(`Rent ${rentalData.vehicle.brand} ${rentalData.vehicle.model} for ${rentalData.rentalType.toLowerCase()} rental (${rentalData.startDate} to ${rentalData.endDate}). Total: ₹${rentalData.price.toLocaleString()}. This feature will be implemented soon.`);
            }}
          />
        ) : showVehicleDetail && selectedVehicle ? (
          <VehicleDetailPage
            vehicle={selectedVehicle}
            onClose={closeVehicleDetail}
            onContactSeller={() => {
              alert(`Contact seller for ${selectedVehicle.brand} ${selectedVehicle.model}. This feature will be implemented soon.`);
            }}
          />
        ) : showGarageDetail && selectedGarage ? (
          <GarageDetailPage
            garage={selectedGarage}
            onClose={closeGarageDetail}
            onBookNow={() => {
              // Check if user is authenticated
              const token = localStorage.getItem('authToken');
              
              if (token) {
                // User is authenticated, proceed to booking
                console.log("✅ User is authenticated, proceeding to booking");
                closeGarageDetail();
                window.location.href = `/booking?garageId=${selectedGarage.id}&returnTo=garage-list&vehicleType=${selectedVehicleType}`;
              } else {
                // User not authenticated, show login popup
                console.log("❌ User not authenticated, showing login popup");
                setShowLoginPopup(true);
              }
            }}
          />
        ) : (
          <GarageListingPage
                selectedCity={selectedCity}
                filterData={filterData}
            selectedVehicleType={selectedVehicleType}
                onGarageClick={handleGarageClick}
                onBackToMain={backToMain}
                onVehicleTypeChange={handleVehicleTypeChange}
                onShowLoginPopup={handleShowLoginPopup}
            />
        )}
      </main>




      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} scrollToTop={scrollToTop} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;