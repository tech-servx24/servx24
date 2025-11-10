import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faShieldAlt, 
  faClock, 
  faDollarSign, 
  faMobileAlt, 
  faCar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { ColorPalette, BackgroundGradients } from '../../constants/designSystem';

const WhyChooseUsSection = () => {
  const { theme } = useTheme();

  const handleJoinClick = () => {
    // Scroll to services section
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      title: "Verified Garages",
      description: "All garages are verified and quality-checked",
      icon: faShieldAlt,
      gradient: ColorPalette.benefits.verified.gradient,
      stats: "500+ Verified"
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs, clear service breakdowns",
      icon: faDollarSign,
      gradient: ColorPalette.benefits.pricing.gradient,
      stats: "0 Hidden Fees"
    },
    {
      title: "All Vehicle Types",
      description: "2 wheelers, 4 wheelers, and commercial vehicles",
      icon: faCar,
      gradient: ColorPalette.benefits.vehicleTypes.gradient,
      stats: "4 Vehicle Types"
    },
    {
      title: "Real-time Updates",
      description: "Track your service progress live",
      icon: faClock,
      gradient: ColorPalette.benefits.updates.gradient,
      stats: "Live Tracking"
    },
    {
      title: "Customer Reviews",
      description: "Read genuine reviews from other customers",
      icon: faStar,
      gradient: ColorPalette.benefits.reviews.gradient,
      stats: "10K+ Reviews"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      icon: faMobileAlt,
      gradient: ColorPalette.benefits.support.gradient,
      stats: "24/7 Available"
    }
  ];

  return (
    <section className={`py-12 md:py-16 lg:py-20 px-4 relative ${theme === 'light' ? BackgroundGradients.light.neutral : BackgroundGradients.dark.neutral}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Why Choose Our Platform
          </h2>
          <p className={`text-sm md:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Trusted by thousands of vehicle owners across India
          </p>
        </div>

        {/* CTA Button - Above Cards */}
        <div className="text-center mb-8 md:mb-12" data-aos="fade-up" data-aos-delay="100">
          <button
            onClick={handleJoinClick}
            className={`inline-flex items-center px-6 md:px-8 py-3 md:py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              theme === 'light' ? 'bg-white shadow-2xl hover:shadow-3xl' : 'bg-gray-800 shadow-2xl hover:shadow-3xl'
            }`}
            aria-label="Join our platform"
          >
            <FontAwesomeIcon 
              icon={faStar} 
              className="text-yellow-400 text-xl md:text-2xl mr-3 md:mr-4"
            />
            <span className={`text-base md:text-lg lg:text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Join 50,000+ satisfied customers today
            </span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative flex"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`relative rounded-2xl p-4 md:p-8 text-center transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl w-full flex flex-col h-full ${
                theme === 'light' 
                  ? 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl' 
                  : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-xl'
              }`}>
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Stats Badge - Above Icon */}
                <div className="flex justify-center mb-2 md:mb-3 flex-shrink-0">
                  <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold z-10 ${
                    theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {benefit.stats}
                  </div>
                </div>

                {/* Icon Container - Centered */}
                <div className="flex justify-center mb-3 md:mb-6 flex-shrink-0">
                  <div className={`relative inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                    <FontAwesomeIcon 
                      icon={benefit.icon} 
                      className="text-lg md:text-2xl text-white" 
                    />
                  </div>
                </div>

                <h3 className={`text-base md:text-2xl font-bold mb-2 md:mb-4 flex-shrink-0 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-xs md:text-lg leading-relaxed flex-grow ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {benefit.description}
                </p>

                {/* Animated Check Circle */}
                <div className="mt-3 md:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex-shrink-0 flex justify-center">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className={`text-lg md:text-2xl bg-gradient-to-br ${benefit.gradient} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;