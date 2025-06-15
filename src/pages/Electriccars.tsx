import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Hero from '@/components/Hero';
import ProductCard, { Article } from '@/components/ArticleCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articlesApi, reviewsApi, Review } from '@/api';
import GridMotion from '@/components/GridMotion';

//imports 
import background01 from '../assets/furBack.jpg';
import workspace from '../assets/workspace.jpg';
import StarBorder from '@/components/StarBorder';

//images for carbrands
import mercedes from '../assets/Brand Logos/Mercedes_benz.png';
import bmw from '../assets/Brand Logos/bmw.png';
import audi from '../assets/Brand Logos/audi.png';
import honda from '../assets/Brand Logos/honda.png';
import mitsubhisi from '../assets/Brand Logos/mitsubhishi.png';
import nissan from '../assets/Brand Logos/nissan.png';
import rangerover from '../assets/Brand Logos/range_rover.png';
import mazda from '../assets/Brand Logos/mazda.png';
import tesla from '../assets/Brand Logos/tesla.png';
import toyota from '../assets/Brand Logos/toyota.png';

//images for carstyles
import sedan from '../assets/vehicle_styels/sedan.png';
import suv from '../assets/vehicle_styels/SUV.png';
import coupe from '../assets/vehicle_styels/coupe.png';
import crossover from '../assets/vehicle_styels/crossover.png';
import hatchback from '../assets/vehicle_styels/hetchback.png';
import sport from '../assets/vehicle_styels/sport.png';
import wagon from '../assets/vehicle_styels/wagon.png';
import mpv from '../assets/vehicle_styels/mpv.png';
import ScrollVelocity, { ScrollVelocitymin } from '@/components/ScrollVelocity';
import Herogreen from '@/components/Herogreen';




// Mock data for categories
const categories = [
  {
    id: 1,
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    count: 42
  },
  {
    id: 2,
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    count: 36
  },
  {
    id: 3,
    name: "Textiles",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    count: 28
  },
  {
    id: 4,
    name: "Decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    count: 53
  }
];

  
// Utility to shuffle an array up to 48 times
function shuffleArray<T>(array: T[]): T[] {
  let arr = [...array];
  const shuffleTimes = Math.min(100, arr.length > 1 ? 48 : 1);
  for (let t = 0; t < shuffleTimes; t++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

// Gather all imported images for car brands and styles
const importedImages = [
  mercedes, bmw, audi, honda, mitsubhisi, nissan, rangerover, mazda, tesla, toyota,
  sedan, suv, coupe, crossover, hatchback, sport, wagon, mpv
];

// Shuffle and select up to 26 images
const items = shuffleArray(importedImages).slice(0, 26).map(String);



// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    content: "The attention to detail in their products is outstanding. I love how every piece feels both modern and timeless.",
    author: "Sarah Johnson",
    title: "Interior Designer"
  },
  {
    id: 2,
    content: "Roodhy has transformed my living space. Their products are not just beautiful, but incredibly functional.",
    author: "Michael Chen",
    title: "Architect"
  },
  {
    id: 3,
    content: "I've never experienced such quality in home goods. Everything I've purchased has exceeded my expectations.",
    author: "Emily Rodriguez",
    title: "Customer"
  }
];

const Electriccars = () => {
  // Refs for sections to animate
  const categoryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [fetchArticles, setFetchArticles] = useState<Article[]>([]);
  const [fetchReviews, setFetchReviews] = useState<Review[]>([]);

  // Fetch articles from the API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const articles = await articlesApi.getAll();
        setFetchArticles(articles);
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    };

    loadArticles();
  }, []);

  // Fetch reviews from the API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviews = await reviewsApi.getAll();
        setFetchReviews(reviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    loadReviews();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (categoryRef.current) observer.observe(categoryRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <Herogreen/>
      
      {/* Featured Article Section */}
      <section id="featured-products" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className='flex flex-col'>
                <span className="absolute px-3 w-auto border-2 py-1 text-xs font-medium bg-green-700 text-white rounded-full animate-fade-in">
                Drive Green
               </span>
                 <h2 className="text-3xl font-semibold mt-8">Latest Articles</h2>
              </div> 
              <p className="text-muted-foreground max-w-xl mt-4">
                Explore the latest articles about the automobile industry, get up-to-date auto news, and discover insights on trends, innovations, and expert tips to keep you informed and inspired.
              </p>
          </div>
            <Link to="/products" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
               <StarBorder
                as="button"
                className="custom-class"
                color="cyan"
                speed="5s"
              >
                View All Articles
              </StarBorder>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fetchArticles.map((article, index) => (
              <div 
                key={article.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1 + 0.2}s`, animationFillMode: 'forwards' }}
              >
                <ProductCard Article={article} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fetaure the Scrolling animation */}
      
  
      {/* Define a velocity value for the ScrollVelocity component */}
      <ScrollVelocitymin
        texts={['#baoswheels', '#driveGreen']} 
        velocity={10} 
        className="custom-scroll-text text-green-800"
      />
      
      {/* Categories Reviews Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div 
          ref={categoryRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className='flex items-center justify-between'>
            <Link to="/products" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
               <StarBorder
                as="button"
                className="custom-class"
                color="cyan"
                speed="5s"
              >
                View All Reviews
              </StarBorder>
            </Link>
              <div className="text-right mb-12">
                <h2 className="text-3xl font-semibold mb-3">Latest Reviews</h2>
                <p className="text-muted-foreground text-right max-w-xl mx-auto">
                  Discover our latest car reviews, offering expert insights and honest opinions to help you make informed decisions on your next vehicle.
                </p>
              </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fetchReviews.slice(0,8).map((review, index) => (
              <Link 
                key={review.id}
                to={`/reviews/${review.id}`}
                className="group relative overflow-hidden rounded-lg aspect-square bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img 
                  src={review.images && review.images.length > 0 ? review.images[0] : 'https://placehold.co/600x600?text=No+Image'}
                  alt={review.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <h3 className="text-md font-semibold"
                  style={{
                    fontWeight:'200'
                  }}>{review.brand}</h3>
                  <h3 className="text-xl font-medium mb-1">{review.title}</h3>
                </div>
                <p className="absolute top-4 bg-white rounded-full px-2 left-4 text-xs text-black/80">{review.category} {review.count && `• ${review.count} Views`}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      
      <Footer />
    </div>
  );
};

export default Electriccars;
