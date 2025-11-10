import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRocket, faUsers, faAward, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const MissionAndFeaturesSection = () => {
  const { theme } = useTheme();

  const features = [
    "Verified garage network for all vehicle types",
    "Transparent pricing with detailed cost breakdowns",
    "Real-time service tracking and updates",
    "Support for 2, 4, and 6 wheelers",
    "24/7 customer support and assistance",
    "Quality assured service guarantee"
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "500+", label: "Verified Garages" },
    { number: "4.8/5", label: "Customer Rating" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <section className={`py-8 md:py-12 px-4 relative ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Mission Content */}
          <div data-aos="fade-right">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faRocket} className="text-white text-xl" />
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Our Mission
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className={`text-xl leading-relaxed ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                We're revolutionizing how vehicle owners find and connect with garages. Whether you own a bike, 
                car, or commercial vehicle, our platform makes it easy to find verified garages near you with 
                transparent pricing and quality service.
              </p>
              
              <p className={`text-xl leading-relaxed ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Our comprehensive verification system ensures every garage meets high standards for quality, 
                reliability, and customer service. We understand that your vehicle is essential for your daily 
                life and business.
              </p>

              <div className="flex items-center space-x-4 pt-6">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-xl" />
                  <span className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Trusted Community
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faAward} className="text-yellow-500 text-xl" />
                  <span className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Quality Assured
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    theme === 'light' 
                      ? 'bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl' 
                      : 'bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl'
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className={`text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Card */}
          <div data-aos="fade-left" data-aos-delay="200">
            <div className={`relative rounded-3xl p-8 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-white to-blue-50/50 shadow-2xl' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900/50 shadow-2xl'
            } backdrop-blur-sm border border-white/10`}>
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faHeart} className="text-white text-xl" />
                </div>
                <h3 className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Platform Features
                </h3>
              </div>
              
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-center group"
                    data-aos="fade-up"
                    data-aos-delay={index * 100 + 300}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                    </div>
                    <span className={`text-lg group-hover:translate-x-2 transition-transform duration-300 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-12 text-center">
                <button className="premium-btn-lg group relative overflow-hidden w-full max-w-xs mx-auto">
                  <span className="relative z-10">GET STARTED TODAY</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 group-hover:from-red-700 group-hover:to-orange-700 transition-all duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionAndFeaturesSection;