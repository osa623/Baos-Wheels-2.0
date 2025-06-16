
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

//images 
import heroImage from '../assets/furBack.png';
import heroImageSm from '../assets/furBacksm.png';
import StarBorder from './StarBorder';
import overlayImage from '../assets/overlayImage.png';

//video
import backgroundVideo from '../assets/Videos/backgroundVideo2.mp4';
import ScrollVelocity from './ScrollVelocitymin';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollY = window.scrollY;
      const opacity = 1 - (scrollY / 500);
      const transform = `translateY(${scrollY * 0.4}px)`;
      
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(opacity, 0).toString();
        heroRef.current.style.transform = transform;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-transparent">
        <video src={backgroundVideo} autoPlay loop muted className="hidden lg:flex w-full h-full object-cover opacity-50" />
        <img src={overlayImage} alt="Hero Background" className="absolute z- lg:flex md:flex w-full h-full object-cover opacity-50" />
        
      </div>


      <div className="absolute inset-0 bg-transparent">
              <img
                src={heroImageSm}
                alt="Hero Background Small"
                className="flex lg:hidden md:hidden w-full h-full object-cover opacity-50"
              />
      </div>
      
      {/* Hero content */}
      <div 
        ref={heroRef}
        className="relative h-full flex flex-col items-center justify-center px-6 transition-all duration-300 ease-out"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 border-2 py-1 mb-3 text-xs font-medium bg-secondary rounded-full animate-fade-in">
            Drive the future
          </span>
          
          <h1 className="lg:text-7xl lg:scale-110 text-4xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight animate-slide-down">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-800 to-gray-500">Innovation
                  </span> Fuels <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500">Every Journey</span>
          </h1>
          

          
          <div className="flex flex-col  py-6  sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/reviews" className="custom-class button-hover">
              <StarBorder
                as="button"
                className="custom-class button-hover"
                color="cyan"
                speed="5s"
              >
                Explore Reviews

              </StarBorder>
              </Link>
           <Link to="/articles" className="custom-class button-hover">
                <Button 
                  onClick={() => window.location.href = '/articles'}
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 button-hover"
                >
                    Explore Articles
                    
                </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll down button */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-pulse">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full animate-bounce" 
          onClick={scrollToProducts}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>

    </section>
  );
};

export default Hero;
