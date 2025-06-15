
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';

//images 
import heroImage from '../assets/greenhero.png';
import StarBorder from './StarBorder';

const Herogreen = () => {
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
    <section className="relative h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-transparent">
        <img src={heroImage} alt="Hero Background" className="w-full h-full object-cover opacity-50" />
      </div>
      
      {/* Hero content */}
      <div 
        ref={heroRef}
        className="relative h-full flex flex-col items-center justify-center px-6 transition-all duration-300 ease-out"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 border-2 py-1 mb-3 text-xs font-medium bg-green-700 text-white rounded-full animate-fade-in">
            Drive Green
          </span>
          
          <h1 className="lg:text-7xl text-4xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight animate-slide-down">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-800">Sustainability 
                  </span> Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500">the Road</span>
          </h1>
            <p className="text-muted-foreground text-gray-600 text-md mb-8 max-w-xl mx-auto animate-slide-up">
            Discover our reviews of electric vehicles and Read Green Artcles.Find the perfect electric vehicle for your needs and pave your way to a greener future.
            </p>
          

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

export default Herogreen;
