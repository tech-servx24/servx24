import React, { useState, useMemo } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { createBooking } from '../../../services/bookingService';
import { useTheme } from '../../context/ThemeContext';

const SummaryStep = ({ 
  bikeData, 
  selectedService, 
  slotAndAddress, 
  suggestion, 
  setSuggestion,
  garageId,
  garageInfo,
  loading, 
  setLoading, 
  errors, 
  setErrors 
}) => {
  const { theme } = useTheme();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Map service category names to booking service type IDs
  const mapServiceCategoryToType = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('pick') && name.includes('drop')) {
      return 'pickup_drop';
    } else if (name.includes('doorstep')) {
      return 'doorstep_servicing';
    } else if (name.includes('garage')) {
      return 'garage_servicing';
    }
    // Default fallback
    return null;
  };
  
  // Get service types from garage's service_provided categories
  const availableServiceTypes = useMemo(() => {
    console.log('🔍 SummaryStep - Garage service_provided:', garageInfo?.service_provided);
    
    if (!garageInfo?.service_provided || !Array.isArray(garageInfo.service_provided)) {
      console.log('⚠️ No service_provided data, using fallback service types');
      // Fallback to default hardcoded options if no service categories available
      return [
        { id: 'pickup_drop', label: 'Pickup & Drop' },
        { id: 'garage_servicing', label: 'Garage Servicing' },
        { id: 'doorstep_servicing', label: 'Doorstep Servicing' },
      ];
    }
    
    // Map real service categories to service types
    const serviceTypesMap = new Map();
    
    garageInfo.service_provided.forEach((category) => {
      console.log(`🔍 Processing service category: "${category.name}"`);
      const typeId = mapServiceCategoryToType(category.name);
      if (typeId && !serviceTypesMap.has(typeId)) {
        // Create a user-friendly label from the category name
        let label = category.name;
        // Clean up common patterns
        if (label.includes('Pick & Drop') || label.includes('Pickup')) {
          label = 'Pickup & Drop';
        } else if (label.includes('Doorstep')) {
          label = 'Doorstep Servicing';
        } else if (label.includes('Garage')) {
          label = 'Garage Servicing';
        }
        
        serviceTypesMap.set(typeId, {
          id: typeId,
          label: label,
          originalName: category.name
        });
        console.log(`✅ Mapped "${category.name}" to service type: ${typeId} (${label})`);
      } else if (!typeId) {
        console.log(`⚠️ Could not map service category: "${category.name}"`);
      }
    });
    
    // Convert map to array
    const serviceTypes = Array.from(serviceTypesMap.values());
    
    console.log('🔍 Final available service types:', serviceTypes);
    
    // If no service types found, use fallback
    if (serviceTypes.length === 0) {
      console.log('⚠️ No service types mapped, using fallback');
      return [
        { id: 'pickup_drop', label: 'Pickup & Drop' },
        { id: 'garage_servicing', label: 'Garage Servicing' },
        { id: 'doorstep_servicing', label: 'Doorstep Servicing' },
      ];
    }
    
    return serviceTypes;
  }, [garageInfo?.service_provided]);
  
  const calculateTotal = () => {
    if (!selectedService) return 0;
    return selectedService.reduce((sum, service) => sum + parseFloat(service.price || 0), 0);
  };
  
  const applyPromoCode = () => {
    const total = calculateTotal();
    // Use applied coupon discount if available, otherwise use default 10% for SUMMER10
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.discount;
    } else {
      discount = total * 0.1; // 10% discount for SUMMER10 (default)
    }
    return {
      originalTotal: total,
      discount: discount,
      finalTotal: total - discount
    };
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setCouponLoading(true);
    setCouponError('');
    
    // Dummy implementation - just simulate API call
    setTimeout(() => {
      // Simulate coupon validation
      const code = couponCode.trim().toUpperCase();
      
      // Dummy validation - accept any code for now
      if (code.length >= 3) {
        // Simulate successful coupon
        const discount = calculateTotal() * 0.15; // 15% discount (dummy)
        setAppliedCoupon({
          code: code,
          discount: discount,
          type: 'percentage',
          value: 15
        });
        setCouponError('');
      } else {
        setCouponError('Invalid coupon code. Please try again.');
        setAppliedCoupon(null);
      }
      
      setCouponLoading(false);
    }, 500);
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };
  
  const handleBooking = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const total = calculateTotal();
      const promoData = applyPromoCode();
      
      // Format date like old website (extract date from date string)
      const formattedDate = slotAndAddress.date.split(' ')[0];
      
      const payload = {
        businessid: parseInt(localStorage.getItem("businessId") || "1"),
        subscriberid: parseInt(localStorage.getItem("subscriberId") || "1"),
        subscribervehicleid: bikeData.vehicle_id || bikeData.id,
        subscriberaddressid: slotAndAddress.address?.id,
        garageid: garageId,
        bookingdate: formattedDate,
        bookingslot: slotAndAddress.slot,
        suggestion: suggestion.trim(),
        bookingamount: calculateTotal().toFixed(2),
        promocode: "SUMMER10",
        requiredestimate: slotAndAddress.estimate === "yes",
        servicetype: serviceType || undefined
      };
      
      console.log("🔍 Creating booking with payload:", payload);
      console.log("🔍 Debug values:");
      console.log("  - businessid:", parseInt(localStorage.getItem("businessId") || "1"));
      console.log("  - subscriberid:", parseInt(localStorage.getItem("subscriberId") || "1"));
      console.log("  - subscribervehicleid:", bikeData.vehicle_id || bikeData.id);
      console.log("  - subscriberaddressid:", slotAndAddress.address?.id);
      console.log("  - garageid:", garageId);
      console.log("  - bookingdate:", formattedDate);
      console.log("  - bookingslot:", slotAndAddress.slot);
      console.log("  - suggestion:", suggestion.trim());
      console.log("  - bookingamount:", calculateTotal().toFixed(2));
      console.log("  - promocode:", "SUMMER10");
      console.log("  - requiredestimate:", slotAndAddress.estimate === "yes");
      console.log("  - servicetype:", serviceType);
      
      const response = await createBooking(payload);
      
      if (response.success) {
        setBookingData(response.data);
        setBookingSuccess(true);
      } else {
        setErrors({ booking: 'Failed to create booking. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Check if it's a duplicate booking error
      if (error.response?.data?.errors?.non_field_errors?.includes('A booking already exists with these details.')) {
        setErrors({ booking: 'A booking with these details already exists. Please try with different date, time, or service selection.' });
      } else {
        setErrors({ booking: 'Failed to create booking. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (timeString) => {
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour);
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${ampm}`;
  };
  
  if (bookingSuccess && bookingData) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Booking Confirmed!</h2>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Your service has been successfully booked. You will receive a confirmation SMS shortly.
          </p>
          
          <div className={`rounded-xl p-6 border mb-6 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Booking Details</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Booking ID:</span>
                <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{bookingData.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Date:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatDate(bookingData.booking_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Time:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{formatTime(bookingData.booking_slot)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Total Amount:</span>
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{bookingData.total_amount}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ←
          </button>
        </div>
      </div>
    );
  }
  
  const promoData = applyPromoCode();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Review Your Booking</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Please review all details before confirming</p>
      </div>
      
      {/* Error Display */}
      {errors.booking && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <p>{errors.booking}</p>
        </div>
      )}
      
      {/* Bike Details - Card Format like old website */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-xs w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Bike</h3>
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
              <img
                src={bikeData?.image || bikeData?.model?.image || 'https://via.placeholder.com/96'}
                alt={bikeData?.brand || bikeData?.model?.name || 'Vehicle'}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className={`font-medium text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {bikeData?.brand || bikeData?.model?.name || 'Unknown Vehicle'}
            </h4>
          </div>
        </div>
      </div>
      
      {/* Services - Card Format like old website */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Service</h3>
          {selectedService && selectedService.length > 0 ? (
            <div className="space-y-3">
              {selectedService.map((service) => (
                <div key={service.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-medium text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h4>
                    <span className="text-red-400 font-semibold text-lg">₹{parseFloat(service.price || 0).toFixed(0)}</span>
                  </div>
                  {service.description && (
                    <p className={`text-sm whitespace-pre-line ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No service selected</p>
          )}
        </div>
      </div>
      
      {/* Schedule - Card Format like old website */}
      {slotAndAddress?.date && slotAndAddress?.slot && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Schedule</h3>
            <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
              {formatDate(slotAndAddress.date)} at {formatTime(slotAndAddress.slot)}
            </p>
          </div>
        </div>
      )}

      {/* Address - Card Format like old website */}
      {slotAndAddress?.address && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Selected Address</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>City:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.city}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Locality:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.address}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Pincode:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{slotAndAddress.address.pincode}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional Details - Card Format like old website */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Additional Details</h3>
          <div className="space-y-3">
             {slotAndAddress?.estimate && (
               <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                 <strong>Estimate Required:</strong> {slotAndAddress.estimate === "yes" ? 'Yes' : 'No'}
               </p>
             )}
            {suggestion && suggestion.trim() !== "" && (
              <p className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                <strong>Suggestion:</strong> {suggestion}
              </p>
            )}
            {(!slotAndAddress?.estimate && (!suggestion || suggestion.trim() === "")) && (
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>No additional details</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestion Input */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Special Instructions (Optional)</h3>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Any special instructions or requests for the mechanic..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
              theme === 'light'
                ? 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
                : 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
            }`}
          />
        </div>
      </div>
      
      {/* Coupon Code Section */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Apply Coupon Code</h3>
          
          {appliedCoupon ? (
            <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-200' : 'bg-green-900 bg-opacity-20 border-green-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className={`font-semibold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>
                      Coupon Applied: {appliedCoupon.code}
                    </p>
                    <p className={`text-sm ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      {appliedCoupon.value}% discount applied
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'text-green-700 hover:bg-green-100'
                      : 'text-green-400 hover:bg-green-900'
                  }`}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder="Enter coupon code"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      : 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyCoupon();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className={`text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
                  {couponError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Final Price - Simple format like old website */}
      {selectedService && selectedService.length > 0 && (
        <div className="flex justify-center">
          <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`text-lg font-semibold mb-4 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Subtotal:</span>
                <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>₹{calculateTotal().toFixed(0)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center">
                  <span className={`flex items-center space-x-1 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                    <span>Discount ({appliedCoupon.code}):</span>
                  </span>
                  <span className={`font-semibold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                    -₹{appliedCoupon.discount.toFixed(0)}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Total:</span>
                  <span className="text-2xl font-bold text-red-400">₹{applyPromoCode().finalTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Type Selection - Using real service categories from garage */}
      <div className="flex justify-center">
        <div className={`rounded-xl p-6 border max-w-lg w-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Select Service Type</h3>
          {availableServiceTypes.length > 0 ? (
            <>
              <div className={`grid grid-cols-1 ${availableServiceTypes.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3`}>
                {availableServiceTypes.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setServiceType(opt.id)}
                    className={`px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      serviceType === opt.id
                        ? 'bg-red-600 border-red-600 text-white'
                        : theme === 'light'
                        ? 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'
                        : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                    }`}
                    title={opt.originalName || opt.label}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {!serviceType && (
                <p className={`text-sm mt-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Please choose a service type. You can change this later.</p>
              )}
            </>
          ) : (
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              No service types available for this garage.
            </p>
          )}
        </div>
      </div>

      {/* Confirm Booking Button */}
      <div className="text-center">
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Confirming Booking...' : 'Confirm Booking'}
        </button>
        <p className="text-gray-500 text-sm mt-3">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default SummaryStep;

