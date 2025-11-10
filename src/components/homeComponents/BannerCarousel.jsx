import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './BannerCarousel.css';

const BannerCarousel = ({ banners, onFindGaragesClick }) => {
  // Ensure banners is an array
  const bannerList = Array.isArray(banners) ? banners : [];
  const hasMultipleBanners = bannerList.length >= 2;

  // If no banners, show a default banner
  if (bannerList.length === 0) {
    return (
      <section className="relative w-full overflow-hidden" style={{ height: '50vh' }}>
        <div className="relative h-full w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg)',
              width: '100%',
              height: '100%'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="text-white">Find Your</span>
                <span className="text-cyan-400"> Perfect</span>
                <span className="text-white"> Garage</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Professional vehicle service and maintenance at your fingertips
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center">
                <button 
                  onClick={onFindGaragesClick}
                  className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  FIND GARAGES
                </button>
                <button className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-colors duration-200 border-2 text-sm sm:text-base">
                  VIEW PRICES
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '50vh' }}>
      <Swiper
        key={`banner-carousel-${bannerList.length}`}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={hasMultipleBanners ? {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={hasMultipleBanners ? {
          clickable: true,
          dynamicBullets: true,
        } : false}
        navigation={hasMultipleBanners}
        loop={hasMultipleBanners}
        speed={600}
        allowTouchMove={true}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
      >
        {bannerList.map((banner, index) => (
          <SwiperSlide key={banner.id || banner._id || index} style={{ width: '100%', height: '100%' }}>
            <div className="relative h-full w-full" style={{ width: '100%', height: '100%' }}>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${banner.image || banner.banner_image || 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg'})`,
                  width: '100%',
                  height: '100%',
                  zIndex: 0
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50" style={{ zIndex: 1 }}></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-8" style={{ width: '100%', height: '100%' }}>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    {/* Use banner title if available, otherwise use default */}
                    {banner.title ? (
                      <>
                        <span className="text-white">{banner.title.split(' ')[0]}</span>
                        <span className="text-cyan-400"> {banner.title.split(' ')[1] || ''}</span>
                        <span className="text-white"> {banner.title.split(' ').slice(2).join(' ')}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white">Find Your</span>
                        <span className="text-cyan-400"> Perfect</span>
                        <span className="text-white"> Garage</span>
                      </>
                    )}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                    {/* Use banner subtitle/description if available, otherwise use default */}
                    {banner.subtitle || banner.description || 'Professional vehicle service and maintenance at your fingertips'}
                  </p>
                  <div className="flex flex-row gap-2 sm:gap-3 justify-center">
                    <button 
                      onClick={onFindGaragesClick}
                      className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      FIND GARAGES
                    </button>
                    <button className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-colors duration-200 border-2 text-sm sm:text-base">
                      VIEW PRICES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerCarousel;
