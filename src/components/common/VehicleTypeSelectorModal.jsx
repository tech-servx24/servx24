import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const VehicleTypeSelectorModal = ({
  isOpen,
  onClose,
  onSelectVehicleType,
  title = "Select Vehicle Type",
  description = "Choose your vehicle type",
  vehicleTypes = [],
  headerIcon,
  headerTitle,
  onBack,
  footerText
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleVehicleTypeClick = (vehicleType) => {
    if (vehicleType.available) {
      onSelectVehicleType(vehicleType);
    } else {
      alert(`${vehicleType.title} service - Coming Soon!`);
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Don't allow closing by clicking backdrop - user must select a vehicle type
      // onClose();
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header with Back Button */}
      {onBack && (
        <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b py-4 px-4`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-red-600' : 'text-white hover:text-red-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {headerTitle && (
              <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {headerIcon && <FontAwesomeIcon icon={headerIcon} className="mr-2" />}
                {headerTitle}
              </h1>
            )}
            <div className="w-5"></div> {/* Spacer for centering */}
          </div>
        </div>
      )}

      {/* Vehicle Type Selection Modal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={handleModalBackdropClick}
      >
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col relative`}>
          {/* Close Button */}
          {(onClose || onBack) && (
            <button
              onClick={onClose || onBack}
              className={`absolute top-4 right-4 transition-colors p-2 z-10 ${theme === 'light' ? 'text-gray-900 hover:text-red-600' : 'text-white hover:text-red-200'}`}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          )}

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="text-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {title}
              </h2>
              <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {description}
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
          {footerText && (
            <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 border-gray-700'} px-6 py-3 border-t flex-shrink-0`}>
              <p className={`text-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {footerText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeSelectorModal;

