import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRocket, faUsers, faAward, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { ColorPalette, BackgroundGradients } from '../../constants/designSystem';

const MissionAndFeaturesSection = () => {
  const { theme } = useTheme();

  const handleGetStartedClick = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    "Verified garage network for all vehicle types",
    "Transparent pricing with detailed cost breakdowns",
    "Real-time service tracking and updates",
    "Support for 2, 4, and 6 wheelers",
    "24/7 customer support and assistance",
    "Quality assured service guarantee"
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: faUsers },
    { number: "500+", label: "Verified Garages", icon: faAward },
    { number: "4.8/5", label: "Customer Rating", icon: faHeart },
    { number: "24/7", label: "Support Available", icon: faCheck }
  ];

  return (
    <section className={`py-16 md:py-20 lg:py-24 px-4 relative ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`} data-mission-section>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Unified Header Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${ColorPalette.primary.gradient} flex items-center justify-center mr-4`}>
              <FontAwesomeIcon icon={faRocket} className="text-white text-2xl" />
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Our Mission
            </h2>
          </div>
          
          <p className={`max-w-4xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Revolutionizing how vehicle owners find and connect with trusted garages. 
            Transparent pricing, verified quality, and seamless service for all your vehicle needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Mission & Stats */}
          <div className="space-y-12" data-aos="fade-right">
            {/* Mission Details */}
            <div className={`rounded-3xl p-8 ${
              theme === 'light' 
                ? 'bg-white shadow-2xl border border-gray-100' 
                : 'bg-gray-800 shadow-2xl border border-gray-700'
            }`}>
              <div className="space-y-6">
                <p className={`text-base md:text-lg leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Whether you own a bike, car, or commercial vehicle, our platform makes it easy to find 
                  verified garages near you with transparent pricing and quality-assured service.
                </p>
                
                <p className={`text-base md:text-lg leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Our comprehensive verification system ensures every garage meets high standards for 
                  quality, reliability, and customer service. We understand that your vehicle is 
                  essential for your daily life and business.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center`}>
                    <FontAwesomeIcon icon={faUsers} className="text-blue-600 dark:text-blue-400 text-lg" />
                  </div>
                  <div>
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Trusted Community
                    </div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Thousands served
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center`}>
                    <FontAwesomeIcon icon={faAward} className="text-yellow-600 dark:text-yellow-400 text-lg" />
                  </div>
                  <div>
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Quality Assured
                    </div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Verified excellence
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    theme === 'light' 
                      ? 'bg-white shadow-xl hover:shadow-2xl border border-gray-100' 
                      : 'bg-gray-800 shadow-xl hover:shadow-2xl border border-gray-700'
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${ColorPalette.primary.gradient} flex items-center justify-center mx-auto mb-4`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-white text-lg" />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r ${ColorPalette.primary.gradient} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className={`text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features Card */}
          <div data-aos="fade-left" data-aos-delay="200">
            <div className={`relative rounded-3xl p-8 h-full ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-white to-blue-50 shadow-2xl border border-gray-100' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700'
            }`}>
              {/* Decorative Elements */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${ColorPalette.primary.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${ColorPalette.secondary.gradient} opacity-10 rounded-full translate-y-16 -translate-x-16`}></div>
              
              <div className="flex items-center mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${ColorPalette.secondary.gradient} flex items-center justify-center mr-4`}>
                  <FontAwesomeIcon icon={faHeart} className="text-white text-2xl" />
                </div>
                <h3 className={`text-3xl md:text-4xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Why Choose Us
                </h3>
              </div>
              
              <ul className="space-y-5 mb-12">
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-start group"
                    data-aos="fade-up"
                    data-aos-delay={index * 100 + 300}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r ${ColorPalette.success.gradient} flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                      <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                    </div>
                    <span className={`text-lg md:text-xl pt-1 group-hover:translate-x-2 transition-transform duration-300 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleGetStartedClick}
                  className="premium-btn-lg group relative overflow-hidden w-full max-w-sm mx-auto focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 py-4 px-8 rounded-2xl font-semibold text-lg"
                  aria-label="Get started with our platform"
                >
                  <span className="relative z-10">GET STARTED TODAY</span>
                  <div className={`absolute inset-0 bg-gradient-to-r ${ColorPalette.primary.gradient} group-hover:opacity-90 transition-all duration-300`}></div>
                </button>
                <p className={`mt-4 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Join thousands of satisfied vehicle owners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionAndFeaturesSection;