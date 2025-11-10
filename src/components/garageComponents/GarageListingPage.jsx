import React from 'react';
import TwoWheelerGarages from './TwoWheelerGarages';
import FourWheelerGarages from './FourWheelerGarages';

const GarageListingPage = ({
  selectedCity,
  filterData,
  selectedVehicleType,
  onGarageClick,
  onBackToMain,
  onVehicleTypeChange,
  onShowLoginPopup
}) => {
  return (
    <>
      {/* Render specific vehicle type garage component */}
      {selectedVehicleType === 'two-wheeler' && (
        <TwoWheelerGarages
          selectedCity={selectedCity}
          filterData={filterData}
          onGarageClick={onGarageClick}
          onBackToMain={onBackToMain}
          onVehicleTypeChange={onVehicleTypeChange}
          onShowLoginPopup={onShowLoginPopup}
        />
      )}
      {selectedVehicleType === 'four-wheeler' && (
        <FourWheelerGarages
          selectedCity={selectedCity}
          filterData={filterData}
          onGarageClick={onGarageClick}
          onBackToMain={onBackToMain}
          onVehicleTypeChange={onVehicleTypeChange}
          onShowLoginPopup={onShowLoginPopup}
        />
      )}
    </>
  );
};

export default GarageListingPage;

