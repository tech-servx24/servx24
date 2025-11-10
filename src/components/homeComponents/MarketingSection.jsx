import React from 'react';
import { useTheme } from '../context/ThemeContext';

const MarketingSection = ({ onExploreServicesClick }) => {
  const { theme } = useTheme();

  const handleExploreClick = () => {
    if (onExploreServicesClick) {
      onExploreServicesClick();
    } else {
      const element = document.getElementById('services-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className={`py-20 px-4 relative ${theme === 'light' ? 'bg-gradient-to-br from-white to-blue-50/30' : 'bg-gradient-to-br from-gray-900 to-blue-900/20'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight ${
              theme === 'light' 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>
              Your Vehicle,{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h2>
            <p className={`text-xl md:text-2xl leading-relaxed mb-8 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Whether you drive a bike, car, or commercial vehicle, we connect you with the best garages in your area. 
              Get transparent pricing, verified mechanics, and quality service for all vehicle types.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExploreClick}
                className="premium-btn-lg group relative overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <span className="relative z-10">EXPLORE SERVICES</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 group-hover:from-red-700 group-hover:to-orange-700 transition-all duration-300"></div>
              </button>
              <button 
                className="premium-outline-btn-lg group relative overflow-hidden"
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <span className="relative z-10">LEARN MORE</span>
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-xl group-hover:bg-cyan-400 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </button>
            </div>
          </div>
          
          <div className="relative" data-aos="fade-left" data-aos-delay="300">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg"
                alt="Professional Garage Service"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl" data-aos="fade-up" data-aos-delay="600">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Verified Garages</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl" data-aos="fade-up" data-aos-delay="700">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;