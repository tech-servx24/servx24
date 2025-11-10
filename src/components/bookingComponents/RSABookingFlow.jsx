import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepperNavigation from '../homeComponents/StepperNavigation';
import SelectBikeStep from '../homeComponents/bookingSteps/SelectBikeStep';
import SelectServiceStep from '../homeComponents/bookingSteps/SelectServiceStep';
import SlotAndAddressStep from '../homeComponents/bookingSteps/SlotAndAddressStep';
import SummaryStep from '../homeComponents/bookingSteps/SummaryStep';
import { fetchGarageById } from '../../services/garageDetailService';
import { useTheme } from '../context/ThemeContext';

const RSABookingFlow = ({ garageId: propGarageId, vehicleType: propVehicleType, onComplete, onCancel }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get garageId from props, URL params, or navigation state
  const urlParams = new URLSearchParams(location.search);
  const garageId = propGarageId || urlParams.get('garageId') || location.state?.garageId;
  const returnTo = urlParams.get('returnTo') || location.state?.returnTo;
  const vehicleType = propVehicleType || urlParams.get('vehicleType') || location.state?.vehicleType;
  
  // Main booking state
  const [activeStep, setActiveStep] = useState(0);
  const [bikeData, setBikeData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [slotAndAddress, setSlotAndAddress] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [garageInfo, setGarageInfo] = useState(null);
  
  const steps = ["Select Vehicle", "RSA Service", "Location & Details", "Summary"];
  
  // Check authentication and fetch garage info
  useEffect(() => {
    try {
      console.log("RSABookingFlow mounted with garageId:", garageId);
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No authentication token, redirecting to login");
        navigate("/login");
        return;
      }
      
      if (!garageId) {
        console.log("No garageId, redirecting to home");
        if (onCancel) {
          onCancel();
        } else {
          navigate("/");
        }
        return;
      }
      
      // Fetch garage information
      const fetchGarageInfo = async () => {
        try {
          const garageData = await fetchGarageById(garageId);
          if (garageData) {
            setGarageInfo(garageData);
            console.log("RSA Garage info loaded:", garageData);
          } else {
            console.error("Failed to load RSA garage information");
            if (onCancel) {
              onCancel();
            } else {
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error fetching RSA garage info:", error);
          if (onCancel) {
            onCancel();
          } else {
            navigate("/");
          }
        }
      };
      
      fetchGarageInfo();
    } catch (error) {
      console.error("Error in RSABookingFlow useEffect:", error);
      if (onCancel) {
        onCancel();
      } else {
        navigate("/");
      }
    }
  }, [garageId, navigate, location.state, onCancel]);
  
  // Navigation logic with validation
  const handleNext = () => {
    setErrors({});
    
    if (activeStep === 0 && !bikeData) {
      setErrors({ bike: "Please select a vehicle to continue" });
      return;
    }
    if (activeStep === 1 && !selectedService) {
      setErrors({ service: "Please select at least one RSA service to continue" });
      return;
    }
    if (activeStep === 2 && !slotAndAddress) {
      setErrors({ slot: "Please provide location and service details to continue" });
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };
  
  const handlePrevious = () => {
    setActiveStep(prev => prev - 1);
    setErrors({});
  };
  
  const handleStepClick = (stepIndex) => {
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
      setErrors({});
    }
  };
  
  // Render current step component
  const renderStep = () => {
    const commonProps = {
      garageId,
      garageInfo,
      bikeData,
      selectedService,
      slotAndAddress,
      suggestion,
      setBikeData,
      setSelectedService,
      setSlotAndAddress,
      setSuggestion,
      loading,
      setLoading,
      errors,
      setErrors,
      onComplete: onComplete || (() => {
        // Default completion handler
        if (returnTo === 'rsa-list') {
          navigate("/?returnTo=rsa-list");
        } else {
          navigate("/");
        }
      })
    };
    
    switch(activeStep) {
      case 0:
        return <SelectBikeStep {...commonProps} />;
      case 1:
        return <SelectServiceStep {...commonProps} />;
      case 2:
        return <SlotAndAddressStep {...commonProps} />;
      case 3:
        return <SummaryStep {...commonProps} />;
      default:
        return <SelectBikeStep {...commonProps} />;
    }
  };
  
  if (!garageId) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Invalid Booking Request</h2>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Please select an RSA service provider first to start booking.</p>
          <button
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate("/");
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while garage info is being fetched
  if (!garageInfo) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto border-red-600 mb-4"></div>
          <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Loading RSA service provider information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StepperNavigation
          steps={steps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />
        
        <div className="mt-8">
          {renderStep()}
        </div>
        
        <div className="mt-8 flex justify-between">
          {activeStep > 0 && (
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
          )}
          <div className="flex-1"></div>
          {activeStep < steps.length - 1 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RSABookingFlow;

