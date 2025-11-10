import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const CustomerReviewsSection = () => {
  const { theme } = useTheme();

  const reviews = [
    {
      name: "Rahul Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Found a great garage for my bike service. Transparent pricing and quality work. Highly recommended!",
      verified: true,
      timestamp: "2 days ago",
      vehicle: "Yamaha MT-15",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Priya Patel",
      location: "Delhi",
      rating: 5,
      comment: "Excellent service for my car. The garage was professional and completed work on time. Will use again!",
      verified: true,
      timestamp: "1 week ago",
      vehicle: "Hyundai Creta",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Amit Kumar",
      location: "Bangalore",
      rating: 4,
      comment: "Good platform for comparing garage prices. Saved money on my truck service. Very satisfied!",
      verified: false,
      timestamp: "2 weeks ago",
      vehicle: "Tata Truck",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon 
        key={i}
        icon={faStar} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className={`py-8 md:py-12 px-4 relative ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            What Our Customers Say
          </h2>
          <p className={`text-sm md:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Real reviews from real customers across India
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className={`relative rounded-2xl p-8 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl ${
                theme === 'light' 
                  ? 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl' 
                  : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-xl'
              }`}>
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-10">
                  <FontAwesomeIcon 
                    icon={faQuoteLeft} 
                    className="text-6xl text-gray-400"
                  />
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1 text-lg">
                    {renderStars(review.rating)}
                  </div>
                  {review.verified && (
                    <span className="flex items-center text-green-500 text-sm font-semibold">
                      <FontAwesomeIcon icon={faCheck} className="mr-1" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className={`text-lg leading-relaxed mb-6 relative z-10 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  "{review.comment}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {review.name}
                      </h4>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {review.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {review.location} • {review.vehicle}
                    </p>
                  </div>
                </div>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="600">
          <div className={`inline-flex flex-col items-center px-12 py-8 rounded-2xl ${
            theme === 'light' ? 'bg-white shadow-2xl' : 'bg-gray-800 shadow-2xl'
          }`}>
            <div className="flex items-center space-x-2 text-3xl mb-4">
              {renderStars(5)}
              <span className={`text-2xl font-bold ml-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                4.8/5
              </span>
            </div>
            <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Based on 2,500+ customer reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;