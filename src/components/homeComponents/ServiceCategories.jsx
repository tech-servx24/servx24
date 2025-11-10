import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMotorcycle, 
  faCar, 
  faTruck, 
  faExclamationTriangle,
  faTools,
  faShoppingCart,
  faKey,
  faBolt,
  faSprayCan
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { ColorPalette, BackgroundGradients } from '../../constants/designSystem';
import VehicleTypeSelectorModal from '../common/VehicleTypeSelectorModal';

const ServiceCategories = forwardRef(({ onServiceClick }, ref) => {
  const { theme } = useTheme();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openVehicleModal: () => setIsVehicleModalOpen(true)
  }));

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsVehicleModalOpen(false);
      }
    };

    if (isVehicleModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVehicleModalOpen]);

  const vehicleTypes = [
    {
      id: 1,
      title: "2 Wheeler",
      description: "Bikes, scooters, motorcycles",
      icon: faMotorcycle,
      type: 'two-wheeler',
      available: true,
      gradient: ColorPalette.vehicleTypes.twoWheeler.gradient
    },
    {
      id: 3,
      title: "4 Wheeler",
      description: "Cars, SUVs, passenger vehicles",
      icon: faCar,
      type: 'four-wheeler',
      available: true,
      gradient: ColorPalette.vehicleTypes.fourWheeler.gradient
    },
    {
      id: 2,
      title: "3 Wheeler",
      description: "Auto rickshaws, tuk-tuks",
      icon: faCar,
      type: 'three-wheeler',
      available: false,
      gradient: ColorPalette.vehicleTypes.threeWheeler.gradient
    },
    {
      id: 4,
      title: "6 Wheeler",
      description: "Trucks, commercial vehicles",
      icon: faTruck,
      type: 'six-wheeler',
      available: false,
      gradient: ColorPalette.vehicleTypes.sixWheeler.gradient
    }
  ];

  const serviceCategories = [
    {
      id: 1,
      title: "Garage",
      description: "Professional vehicle services",
      icon: faTools,
      available: true,
      type: 'garage',
      hasDropdown: true,
      gradient: ColorPalette.services.garage.gradient
    },
    {
      id: 2,
      title: "Washing & Detailing",
      description: "Car wash and detailing services",
      icon: faSprayCan,
      available: true,
      type: 'washing-detailing',
      gradient: ColorPalette.services.washing.gradient
    },
    {
      id: 3,
      title: "Buy/Sell",
      description: "Purchase or sell vehicles",
      icon: faShoppingCart,
      available: true,
      type: 'buy-sell',
      gradient: ColorPalette.services.buySell.gradient
    },
    {
      id: 4,
      title: "Rent",
      description: "Vehicle rental services",
      icon: faKey,
      available: true,
      type: 'rent',
      gradient: ColorPalette.services.rent.gradient
    },
    {
      id: 5,
      title: "EV Service",
      description: "Electric vehicle services",
      icon: faBolt,
      available: true,
      type: 'ev-service',
      gradient: ColorPalette.services.evService.gradient
    },
    {
      id: 6,
      title: "Roadside Assistance",
      description: "24/7 roadside assistance",
      icon: faExclamationTriangle,
      available: true,
      type: 'emergency',
      gradient: ColorPalette.services.emergency.gradient
    }
  ];

  const handleVehicleTypeSelect = (vehicleType) => {
    if (vehicleType.available) {
      onServiceClick(vehicleType.type);
      setIsVehicleModalOpen(false);
    }
  };

  const handleCardClick = (service) => {
    if (service.hasDropdown) {
      setIsVehicleModalOpen(true);
    } else if (service.available) {
      onServiceClick(service.type);
    }
  };


  return (
    <section className={`py-12 md:py-16 lg:py-20 px-4 relative ${theme === 'light' ? BackgroundGradients.light.secondary : BackgroundGradients.dark.secondary}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div id="services-section" className="text-center mb-8" data-aos="fade-up">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Services for All Vehicle Types
          </h2>
          <p className={`text-sm md:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Find the perfect service for your vehicle needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {serviceCategories.map((category, index) => (
            <div 
              key={category.id} 
              className="relative group flex"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className={`relative rounded-xl p-4 md:p-6 text-center transition-all duration-500 cursor-pointer transform group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full flex flex-col h-full ${
                  theme === 'light' 
                    ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md' 
                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                } ${!category.available ? 'opacity-60' : ''}`}
                onClick={() => handleCardClick(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(category);
                  }
                }}
                tabIndex={category.available ? 0 : -1}
                role="button"
                aria-label={`${category.title} - ${category.description}`}
              >
                {/* Icon with Gradient */}
                <div className="flex justify-center mb-2 md:mb-4 flex-shrink-0">
                  <div className={`relative inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg transition-all duration-500`}>
                    <FontAwesomeIcon 
                      icon={category.icon} 
                      className="text-lg md:text-2xl text-white" 
                    />
                  </div>
                </div>

                <h3 className={`text-sm md:text-lg font-semibold mb-1 md:mb-2 flex-shrink-0 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {category.title}
                </h3>
                <p className={`text-xs md:text-sm mb-3 md:mb-4 flex-grow ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {category.description}
                </p>
                
                <div className="mt-auto flex-shrink-0">
                  {category.available ? (
                    <button 
                      className={`w-full group relative overflow-hidden rounded-xl bg-gradient-to-r px-3 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        category.hasDropdown ? ColorPalette.secondary.gradient : ColorPalette.primary.gradient
                      }`}
                    >
                      <span className="relative z-10">
                        {category.hasDropdown ? 'SELECT VEHICLE' : 'EXPLORE NOW'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-300 from-white/20 to-white/10"></div>
                    </button>
                  ) : (
                    <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-700 text-gray-400'}`}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Type Selection Modal - Using Common Component */}
      <VehicleTypeSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSelectVehicleType={handleVehicleTypeSelect}
        title="Select Vehicle Type"
        description="Choose your vehicle type to find specialized garages"
        vehicleTypes={vehicleTypes}
        headerIcon={faTools}
        headerTitle="Garage Service"
        footerText="Click on any vehicle type to find specialized garages near you"
      />
    </section>
  );
});

export default ServiceCategories;