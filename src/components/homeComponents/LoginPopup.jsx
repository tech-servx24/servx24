import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { sendSMS, verifyOtp } from '../../services/smsService';
import { setAuthData } from '../../services/authService';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Reset form when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setMobile('');
      setOtp(['', '', '', '']);
      setShowOtpField(false);
      setError('');
      setSuccessMessage('');
      setResendTimer(30);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0 && showOtpField) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, showOtpField]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next field
      if (value && index < 3) {
        const nextField = document.getElementById(`otp-${index + 1}`);
        if (nextField) nextField.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevField = document.getElementById(`otp-${index - 1}`);
      if (prevField) prevField.focus();
    }
  };

  const handleLoginSubmit = async () => {
    const trimmedNumber = mobile.trim();
    if (!/^\d{10}$/.test(trimmedNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Send OTP to mobile number
      const businessId = 3;
      const response = await sendSMS(businessId, trimmedNumber);
      
      if (response.status === true) {
        setShowOtpField(true);
        setResendTimer(30);
        setSuccessMessage(response.message || 'OTP sent successfully!');
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Something went wrong while sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const businessId = 3;
      const trimmedNumber = mobile.trim();
      
      const response = await verifyOtp({
        businessid: businessId,
        mobile: trimmedNumber,
        otp: otpString
      });

      console.log('OTP verification response:', response);
      console.log('🔍 Response data:', response.data);
      console.log('🔍 Token:', response.data?.token);
      console.log('🔍 Subscriber ID:', response.data?.subscriber_id);
      console.log('🔍 Business ID:', response.data?.business_id);

      if (response.status === true && response.data) {
        // Validate required fields from response
        const token = response.data.token;
        const subscriberId = response.data.subscriber_id;
        const businessId = response.data.business_id;

        console.log('🔍 Validating fields - token:', !!token, 'subscriberId:', subscriberId, 'businessId:', businessId);

        // Use default business ID if not provided in response (backend sometimes doesn't return it)
        const defaultBusinessId = 3;
        const finalBusinessId = businessId || defaultBusinessId;

        if (!token || subscriberId === undefined || subscriberId === null) {
          console.error('❌ Missing required fields in response:', {
            hasToken: !!token,
            subscriberId: subscriberId,
            businessId: businessId,
            fullData: response.data
          });
          setError('Invalid response from server. Please try again.');
          return;
        }

        console.log('✅ Using business ID:', finalBusinessId, businessId ? '(from response)' : '(default)');

        // Save authentication data
        setAuthData(
          token,
          subscriberId.toString(),
          finalBusinessId.toString()
        );
        localStorage.setItem('mobileNumber', trimmedNumber);
        setSuccessMessage('Login successful!');

        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 600);
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Something went wrong while verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const businessId = 3;
      const trimmedNumber = mobile.trim();
      
      const response = await sendSMS(businessId, trimmedNumber);
      
      if (response.status === true) {
        setResendTimer(30);
        setSuccessMessage('OTP resent successfully!');
      } else {
        setError(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Something went wrong while resending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMobile = () => {
    setShowOtpField(false);
    setOtp(['', '', '', '']);
    setError('');
    setSuccessMessage('');
    setResendTimer(30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showOtpField ? (
            <>
              {/* Mobile Number Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={10}
                />
              </div>

              {/* Continue Button */}
              <button
                onClick={handleLoginSubmit}
                disabled={isLoading || mobile.length !== 10}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input Fields */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>
                <p className="text-sm text-gray-400 mb-4">
                  We've sent a 4-digit OTP to {mobile}
                </p>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                onClick={handleSubmitOtp}
                disabled={isLoading || otp.join('').length !== 4}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Back to Mobile Button */}
              <button
                onClick={handleBackToMobile}
                disabled={isLoading}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
              >
                Change Mobile Number
              </button>

              {/* Resend OTP */}
              <div className="text-center mt-4">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-400">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-red-500 hover:text-red-400 transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-900 border border-green-700 text-green-300 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-400 mt-6 text-center">
            By proceeding, you agree to our{' '}
            <span className="text-red-500 cursor-pointer">Privacy Policy</span>,{' '}
            <span className="text-red-500 cursor-pointer">User Agreement</span> and{' '}
            <span className="text-red-500 cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
