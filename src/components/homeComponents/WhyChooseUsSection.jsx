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

const WhyChooseUsSection = () => {
  const { theme } = useTheme();

  const benefits = [
    {
      title: "Verified Garages",
      description: "All garages are verified and quality-checked",
      icon: faShieldAlt,
      gradient: "from-blue-500 to-cyan-500",
      stats: "500+ Verified"
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs, clear service breakdowns",
      icon: faDollarSign,
      gradient: "from-green-500 to-emerald-500",
      stats: "0 Hidden Fees"
    },
    {
      title: "All Vehicle Types",
      description: "2 wheelers, 4 wheelers, and commercial vehicles",
      icon: faCar,
      gradient: "from-purple-500 to-pink-500",
      stats: "4 Vehicle Types"
    },
    {
      title: "Real-time Updates",
      description: "Track your service progress live",
      icon: faClock,
      gradient: "from-orange-500 to-red-500",
      stats: "Live Tracking"
    },
    {
      title: "Customer Reviews",
      description: "Read genuine reviews from other customers",
      icon: faStar,
      gradient: "from-yellow-500 to-amber-500",
      stats: "10K+ Reviews"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      icon: faMobileAlt,
      gradient: "from-indigo-500 to-purple-500",
      stats: "24/7 Available"
    }
  ];

  return (
    <section className={`py-8 md:py-12 px-4 relative ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`relative rounded-2xl p-8 text-center transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl ${
                theme === 'light' 
                  ? 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl' 
                  : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-xl'
              }`}>
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                  <FontAwesomeIcon 
                    icon={benefit.icon} 
                    className="text-2xl text-white" 
                  />
                </div>

                {/* Stats Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                }`}>
                  {benefit.stats}
                </div>

                <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-lg leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {benefit.description}
                </p>

                {/* Animated Check Circle */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className={`text-2xl bg-gradient-to-br ${benefit.gradient} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="600">
          <div className={`inline-flex items-center px-8 py-4 rounded-2xl ${
            theme === 'light' ? 'bg-white shadow-2xl' : 'bg-gray-800 shadow-2xl'
          }`}>
            <FontAwesomeIcon 
              icon={faStar} 
              className="text-yellow-400 text-2xl mr-4"
            />
            <span className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Join 50,000+ satisfied customers today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;