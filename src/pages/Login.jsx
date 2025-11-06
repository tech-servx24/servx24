import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { sendSMS, verifyOtp } from '../services/smsService';
import { setAuthData } from '../services/authService';
import { useTheme } from '../components/context/ThemeContext';

const Login = ({ setCurrentPage, setIsLoggedIn }) => {
  const { theme } = useTheme();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showOtpField && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpField, resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
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
        setIsLoggedIn(true);
        setSuccessMessage('Login successful!');

        // Handle redirects consistent with previous flow
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        const garageId = urlParams.get('garageId');
        const vehicleType = urlParams.get('vehicleType');

        const bookingIntent = sessionStorage.getItem('bookingIntent');
        let bookingData = null;
        if (bookingIntent) {
          try {
            bookingData = JSON.parse(bookingIntent);
            sessionStorage.removeItem('bookingIntent');
          } catch (e) {
            console.error('Error parsing booking intent:', e);
          }
        }

        setTimeout(() => {
          if ((returnTo === 'booking' && garageId) || bookingData) {
            const finalGarageId = garageId || bookingData?.garageId;
            const finalVehicleType = vehicleType || bookingData?.vehicleType || 'two-wheeler';
            window.location.href = `/booking?garageId=${finalGarageId}&returnTo=garage-list&vehicleType=${finalVehicleType}`;
          } else if (returnTo === 'home' || bookingData?.returnTo === 'home') {
            setCurrentPage('home');
          } else {
            setCurrentPage('profile');
          }
        }, 800);
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

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'}`}>
      {/* Header */}
      <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'} border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Sign In</h1>
                <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Enter your mobile number to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} rounded-lg p-8 border`}>
            <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Unlock These Benefits</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Trusted Garages',
                  desc: 'Quality service at verified garages near you',
                  icon: ShieldCheckIcon,
                  color: 'text-green-500'
                },
                {
                  title: 'Transparent Pricing',
                  desc: 'Know your service costs upfront with no hidden charges',
                  icon: CurrencyDollarIcon,
                  color: 'text-yellow-500'
                },
                {
                  title: 'Certified Mechanics',
                  desc: 'Experienced and certified mechanics ensuring top-quality repairs',
                  icon: WrenchScrewdriverIcon,
                  color: 'text-blue-500'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-lg flex items-center justify-center ${benefit.color}`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{benefit.title}</h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Offer */}
            <div className="mt-8 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-full bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-white font-bold text-lg">UPTO 12% OFF*</p>
                  <p className="text-gray-300 text-sm">Enjoy hassle-free doorstep servicing</p>
                  <p className="text-red-400 text-sm font-medium">On‑demand service at your fingertips</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} rounded-lg p-8 border`}>
            <div className="mb-6">
              {/* OTP disabled */}
              
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Sign In</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Enter your mobile number to get started</p>
            </div>

            {!showOtpField ? (
              <>
                {/* Mobile Input */}
                <div className="mb-6">
                  <label className={`block text-sm mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Mobile Number</label>
                  <div className="relative">
                    <PhoneIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent ${theme === 'light' ? 'bg-white text-gray-900 border border-gray-300' : 'bg-gray-800 text-white border border-gray-700'}`}
                      maxLength={10}
                    />
                    {mobile && (
                      <button
                        onClick={() => {
                          setMobile('');
                          setError('');
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLoginSubmit}
                  disabled={!mobile || mobile.length !== 10 || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors mb-4"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                {/* OTP Input Fields */}
                <div className="mb-6">
                  <label className={`block text-sm mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Enter OTP</label>
                  <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
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
                        className={`w-12 h-12 text-center text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          theme === 'light'
                            ? 'bg-white text-gray-900 border border-gray-300'
                            : 'bg-gray-800 text-white border border-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify OTP Button */}
                <button
                  onClick={handleSubmitOtp}
                  disabled={isLoading || otp.join('').length !== 4}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors mb-3"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {/* Back to Mobile Button */}
                <button
                  onClick={handleBackToMobile}
                  disabled={isLoading}
                  className={`w-full text-sm py-2 transition-colors mb-3 ${
                    theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Change Mobile Number
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
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
              <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-900 bg-opacity-20 border border-green-800 text-green-300 px-4 py-3 rounded-lg text-sm mb-4 flex items-center space-x-2">
                <CheckIcon className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Terms */}
            <p className={`text-xs text-center mt-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              By proceeding, you agree to our{' '}
              <span className="text-red-400 cursor-pointer hover:underline">Privacy Policy</span>,{' '}
              <span className="text-red-400 cursor-pointer hover:underline">User Agreement</span> and{' '}
              <span className="text-red-400 cursor-pointer hover:underline">Terms of Service</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
