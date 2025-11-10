import React, { forwardRef, useEffect } from 'react';
import BannerCarousel from './BannerCarousel';
import ServiceCategories from './ServiceCategories';
import MarketingSection from './MarketingSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import CustomerReviewsSection from './CustomerReviewsSection';
import MissionAndFeaturesSection from './MissionAndFeaturesSection';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = forwardRef(({ 
  banners, 
  onFindGaragesClick, 
  onServiceClick
}, ref) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out-cubic',
      once: true,
      offset: 50,
      delay: 0
    });
  }, []);

  return (
    <div className="landing-page relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-purple-100/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-cyan-100/30 to-blue-100/40 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-red-100/20 to-orange-100/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      {/* Banner Carousel */}
      <section data-aos="fade-in" data-aos-duration="1200">
        <BannerCarousel 
          banners={banners || []} 
          onFindGaragesClick={onFindGaragesClick}
        />
      </section>

      {/* Service Categories */}
      <section 
        id="services-section"
        data-aos="fade-up"
        data-aos-delay="200"
        className="relative"
      >
        <ServiceCategories 
          ref={ref}
          onServiceClick={onServiceClick} 
        />
      </section>

      {/* Marketing Section */}
      <section 
        data-aos="fade-up"
        data-aos-delay="300"
        className="relative"
      >
        <MarketingSection 
          onExploreServicesClick={() => {
            const element = document.getElementById('services-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </section>

      {/* Why Choose Us Section */}
      <section 
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <WhyChooseUsSection />
      </section>

      {/* Customer Reviews Section */}
      <section 
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <CustomerReviewsSection />
      </section>

      {/* Mission and Features Section */}
      <section 
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <MissionAndFeaturesSection />
      </section>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;