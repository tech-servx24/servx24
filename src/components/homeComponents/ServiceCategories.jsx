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
  faTimes,
  faSprayCan
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

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
      gradient: "from-green-400 to-cyan-500"
    },
    {
      id: 3,
      title: "4 Wheeler",
      description: "Cars, SUVs, passenger vehicles",
      icon: faCar,
      type: 'four-wheeler',
      available: true,
      gradient: "from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "3 Wheeler",
      description: "Auto rickshaws, tuk-tuks",
      icon: faCar,
      type: 'three-wheeler',
      available: false,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 4,
      title: "6 Wheeler",
      description: "Trucks, commercial vehicles",
      icon: faTruck,
      type: 'six-wheeler',
      available: false,
      gradient: "from-red-400 to-pink-500"
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
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Washing & Detailing",
      description: "Car wash and detailing services",
      icon: faSprayCan,
      available: true,
      type: 'washing-detailing',
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Buy/Sell",
      description: "Purchase or sell vehicles",
      icon: faShoppingCart,
      available: true,
      type: 'buy-sell',
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "Rent",
      description: "Vehicle rental services",
      icon: faKey,
      available: false,
      type: 'rent',
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 5,
      title: "EV Service",
      description: "Electric vehicle services",
      icon: faBolt,
      available: true,
      type: 'ev-service',
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      id: 6,
      title: "Roadside Assistance",
      description: "24/7 roadside assistance",
      icon: faExclamationTriangle,
      available: true,
      type: 'emergency',
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const handleVehicleTypeClick = (vehicleType) => {
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

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsVehicleModalOpen(false);
    }
  };

  return (
    <section className={`py-20 px-4 relative ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-blue-50/30' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {serviceCategories.map((category, index) => (
            <div 
              key={category.id} 
              className="relative group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className={`relative rounded-xl p-4 md:p-6 text-center transition-all duration-500 cursor-pointer transform group-hover:scale-105 ${
                  theme === 'light' 
                    ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md' 
                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                } ${!category.available ? 'opacity-60' : ''}`}
                onClick={() => handleCardClick(category)}
              >
                {/* Icon with Gradient */}
                <div className={`relative inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl mb-3 md:mb-4 bg-gradient-to-br ${category.gradient} shadow-lg transition-all duration-500`}>
                  <FontAwesomeIcon 
                    icon={category.icon} 
                    className="text-xl md:text-2xl text-white" 
                  />
                </div>

                <h3 className={`text-base md:text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {category.title}
                </h3>
                <p className={`text-xs md:text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {category.description}
                </p>
                
                <div className="mt-auto">
                  {category.available ? (
                    <button 
                      className={`premium-btn w-full group relative overflow-hidden rounded-xl ${
                        category.hasDropdown ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                    >
                      <span className="relative z-10">
                        {category.hasDropdown ? 'SELECT VEHICLE' : 'EXPLORE NOW'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-300 from-white/20 to-white/10"></div>
                    </button>
                  ) : (
                    <span className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-700 text-gray-400'}`}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Vehicle Type Selection Modal */}
      {isVehicleModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div 
            className={`relative rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-white to-gray-50/90' 
                : 'bg-gradient-to-br from-gray-900 to-gray-800/90'
            } backdrop-blur-sm border border-white/10`}
            data-aos="zoom-in"
            data-aos-duration="500"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVehicleModalOpen(false)}
              className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>

            {/* Modal Header */}
            <div className="relative p-8 text-center border-b border-white/10">
              <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Choose Your Vehicle Type
              </h3>
              <p className={`text-lg mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Select your vehicle to find specialized garages
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicleTypes.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className={`relative group rounded-2xl p-8 text-center transition-all duration-500 border-2 ${
                      vehicle.available 
                        ? `cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
                            theme === 'light' 
                              ? 'border-gray-200 hover:border-transparent bg-white/80' 
                              : 'border-gray-700 hover:border-transparent bg-gray-800/80'
                          }` 
                        : `opacity-50 cursor-not-allowed ${
                            theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                          }`
                    }`}
                    onClick={() => handleVehicleTypeClick(vehicle)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {/* Background Gradient on Hover */}
                    {vehicle.available && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${vehicle.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    )}

                    {/* Icon */}
                    <div className={`relative inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 ${
                      vehicle.available 
                        ? `bg-gradient-to-br ${vehicle.gradient} shadow-lg group-hover:shadow-xl` 
                        : 'bg-gray-500'
                    } transition-all duration-500`}>
                      <FontAwesomeIcon 
                        icon={vehicle.icon} 
                        className="text-4xl text-white" 
                      />
                    </div>

                    <h4 className={`text-2xl font-bold mb-3 ${
                      vehicle.available 
                        ? (theme === 'light' ? 'text-gray-900' : 'text-white') 
                        : 'text-gray-500'
                    }`}>
                      {vehicle.title}
                    </h4>
                    <p className={`text-lg ${
                      vehicle.available 
                        ? (theme === 'light' ? 'text-gray-600' : 'text-gray-400') 
                        : 'text-gray-600'
                    }`}>
                      {vehicle.description}
                    </p>

                    {!vehicle.available && (
                      <div className="mt-4">
                        <span className={`px-4 py-2 rounded-lg text-sm ${
                          theme === 'light' ? 'bg-gray-200 text-gray-500' : 'bg-gray-700 text-gray-400'
                        }`}>
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

export default ServiceCategories;