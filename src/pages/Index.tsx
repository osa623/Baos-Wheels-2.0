import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Hero from '@/components/Hero';
import ProductCard, { Article } from '@/components/ArticleCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articlesApi, reviewsApi, newsApi } from '@/api';
import SplitText from '@/components/SplitText';
import { Helmet } from 'react-helmet-async'; 

//imports 
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
import ScrollVelocity from '@/components/ScrollVelocity';

//images
import communityBackground from '../assets/communityImage.jpg';
import turbossImage from '../assets/turbossImage.jpg';
import ReviewView from './ReviewView';




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
  const arr = [...array];
  const shuffleTimes = Math.min(100, arr.length > 1 ? 48 : 1);
  for (let t = 0; t < shuffleTimes; t++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

//handle the section
const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

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

const Index = () => {
  // Refs for sections to animate
  const categoryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [fetchArticles, setFetchArticles] = useState<Article[]>([]);
  const [fetchReviews, setFetchReviews] = useState<Review[]>([]);
  const [latestNews, setLatestNews] = useState<any>(null);

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

  //fetch news from the API
  useEffect(()=> {
    
    const loadnews = async () => {
      try {

        const news = await newsApi.getAll();
        if (news && news.length > 0) {
          // Assuming you want to display the first news item
          const firstNews = news[0];
          setLatestNews(firstNews);
          console.log('Latest News:', firstNews);
        } else {
          setLatestNews(null);
          console.warn('No news available');
        }
      } catch (error){
        setLatestNews(null);
        console.error('Failed to load news:', error);
      }
    };

    loadnews();

  }, []);

  // Fetch reviews from the API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviews = await reviewsApi.getAll();
        setFetchReviews(reviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        console.error('Review ID:', reviewsApi);
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
    <div className="min-h-screen overflow-hidden">
      <Header />

      {/* SEO */}
      <Helmet>
        <title>Baoswheels | Latest Car Reviews, Auto News & Community</title>
        <meta
          name="description"
          content="Baoswheels is your trusted source for the latest car reviews, automotive news, and expert insights. Join our community to explore trends, innovations, and connect with fellow car enthusiasts."
        />
        <meta
          name="keywords"
          content="cars, automotive, car reviews, auto news, car community, vehicle trends, car insights, Baoswheels"
        />
        <meta property="og:title" content="Baoswheels | Latest Car Reviews, Auto News & Community" />
        <meta
          property="og:description"
          content="Stay up-to-date with Baoswheels. Read expert car reviews, discover automotive news, and join a passionate car community."
        />
        <meta property="og:url" content="https://www.baoswheels.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.baoswheels.com/og-image.jpg" />
        <link rel="canonical" href="https://www.baoswheels.com/" />
      </Helmet>

      {/* Hero Section */}
      <Hero />
      
      {/* Featured Article Section */}
      <section id="featured-products" className="relative py-20 px-6">
        <div className='absolute inset-0 bg-transparent  w-full overflow-hidden top-0 h-auto  to-transparent z-10'>
          <div className='absolute inset-0 bg-black -top-40 h-[20%] -rotate-[10deg] md:h-[50%] scale-150 md:rounded-full md:-rotate-[10deg] z-20'></div>
         <div className='absolute inset-0 bg-gray-300 -top-40 h-[25%] -rotate-[10deg] md:h-[54%] scale-150 md:rounded-full md:-rotate-[8deg] z-10'></div>
        </div>
        <div className="relative max-w-7xl mx-auto z-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-semibold text-[#EEF525] mb-3">Latest Articles</h2>
              <p className=" text-gray-400 lg:pt-2 max-w-2xl">
                Explore the latest articles about the automobile industry, get up-to-date auto news, and discover insights on trends, innovations, and expert tips to keep you informed and inspired.
              </p>
          </div>
            <Link to="/articles" className="inline-flex items-center mt-8 md:mt-0 text-primary hover:underline">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 lg:grid-cols-4 lg:gap-6">
            {fetchArticles.slice(0,4).map((article, index) => (
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

        
      {/* Define a velocity value for the ScrollVelocity component */}
      <div className='flex w-auto h-auto rotate-2 z-50 py-20 overflow-hidden'>
          <ScrollVelocity
        texts={['#baoswheels', '#driveYourPassion']} 
        velocity={10} 
        className="custom-scroll-text font-bold text-border"
          />
      </div>
       
      <style>
        {`
          .text-border {
        color: white;
        text-shadow:
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           1px  1px 0 #ff0;
          }
        `}
      </style>
      
      {/* Categories Reviews Section */}
      <section className="py-20 z-20 relative px-6 bg-gray-50">
        <div className='absolute inset-0 bg-transparent  w-full overflow-hidden top-0 h-auto  to-transparent z-10'>
          <div className='absolute inset-0 bg-black md:rounded-full -top-40 h-[20%] rotate-[10deg] md:h-[50%] scale-150 rounded-5xl md:rotate-[10deg] z-20'></div>
         <div className='absolute inset-0 bg-gray-300 -top-40 md:rounded-full h-[25%] rotate-[10deg] md:h-[54%] scale-150 rounded-5xl md:rotate-[8deg] z-10'></div>
        </div>
        <div 
          ref={categoryRef}
          className="max-w-7xl relative mx-auto z-20 opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <Link to="/reviews" className="hidden lg:flex items-center mt-4 md:mt-0 text-primary hover:underline">
               <StarBorder
                as="button"
                className="custom-class"
                color="cyan"
                speed="5s"
              >
                View All Reviews
              </StarBorder>
            </Link>
            <div className='items-end flex flex-col'>
              <h2 className="text-3xl font-semibold text-[#EEF525] mb-3">Latest Reviews</h2>
              <p className="text-gray-300 text-end max-w-xl">
                Discover our latest car reviews, offering expert insights and honest opinions to help you make informed decisions on your next vehicle.
              </p>
          </div>
           <Link to="/reviews" className="lg:hidden justify-end items-end flex w-full mt-4 md:mt-0 text-primary hover:underline">
               <StarBorder
                as="button"
                className="custom-class w-auto"
                color="cyan"
                speed="5s"
              >
                View All Reviews
              </StarBorder>
            </Link>

          </div>

          <div className='relative max-w-8xl h-auto'>
            {/* Placeholder for image */}
            {fetchReviews.filter(review => review.title === 'Patrol NISMO 2026').map(review => (
              <div key={review._id || review.id} className='hidden flex-col'>
              <div className='relative max-w-xl overflow-hidden border-2 border-gray-400 rounded-xl h-3/4'>
                <img src= {review.images[0]} className='object-cover w-full h-full'/>
              </div> 
            
                <div className='relative flex flex-col items-start w-auto'>
                <p className="absolute top-2 bg-white rounded-full px-2 left-4 text-sm text-black/80">{review.category} {review.count && `• ${review.count} Views`}</p>
               <h3 className="text-5xl flex mt-10 px-4 text-white font-medium mb-1">{review.brand} {review.title}</h3>
               <p className='text-sm line-clamp-20 max-w-5xl px-4 text-white'>
                {review.overview}.
               </p>

               <p className='text-sm line-clamp-3 max-w-5xl mt-4 px-4 text-white'>
                {review.interior}.
               </p>
              
              </div> 
            
            
            </div>
            
            ))}

             {fetchReviews.filter(review => review.title === 'Patrol NISMO 2026').map(review => (
              <div key={review._id || review.id} className='hidden md:flex'>
              <div className='relative max-w-xl overflow-hidden border-2 border-gray-400 rounded-xl h-3/4'>
                <img src= {review.images[0]} className='object-cover w-full h-full'/>
              </div> 
            
                <div className='relative flex flex-col items-start w-auto'>
                <p className="absolute top-2 bg-white rounded-full px-2 left-4 text-sm text-black/80">{review.category} {review.count && `• ${review.count} Views`}</p>
               <h3 className="text-5xl flex mt-10 px-4 text-white font-medium mb-1">{review.brand} {review.title}</h3>
               <p className='text-sm line-clamp-20 max-w-5xl px-4 text-white'>
                {review.overview}.
               </p>

               <p className='text-sm line-clamp-3 max-w-5xl mt-4 px-4 text-white'>
                {review.interior}.
               </p>

                <Link to= {`/reviews/${review._id || review.id}`} className="absolute bottom-0 right-12 justify-end items-end flex w-full mt-4 md:mt-0 text-primary hover:underline">
               <StarBorder
                as="button"
                className="custom-class w-auto"
                color="cyan"
                speed="5s"
              >
                View More..
              </StarBorder>
            </Link>
              
              </div> 
            
            
            </div>
            
            ))}
          </div>




          <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fetchReviews.slice(0,8).map((review) => {
              // Handle MongoDB _id format if present
              const reviewId = review._id || review.id;
              
              return (
                
                <Link 
                  key={reviewId}
                  to={`/reviews/${reviewId}`}
                  state={{ reviewId: reviewId }} // Pass the MongoDB ObjectId
                  className="group relative overflow-hidden border-2 h-[30vh]  rounded-lg  bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{
                        boxShadow: ' 4px 6px rgba(204,255,0, 0.8)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <img 
                    src={review.images && review.images.length > 0 ? review.images[0] : 'https://placehold.co/600x600?text=No+Image'}
                    alt={review.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                 
                  <p className="absolute top-4 bg-white rounded-full px-2 left-4 text-xs text-black/80">{review.category} {review.count && `• ${review.count} Views`}</p>

                  <div className='absolute p-4 flex flex-col bottom-0 left-0 z-20'>
                  <h2 className="flex bottom-0 bg-[#EEF525]  py-2  border-2 border-gray-300 justify-start px-2 left-4 text-sm text-black">{review.brand}</h2>
                  <h2 className="flex bottom-4 rounded-full px-2 left-4 text-sm text-white">{review.title}</h2>
                  </div>
                       
                </Link>
                
              );
            })}
          </div>
        </div>
      </section>

      {/* Banners */}

      <div className='relative bg-gray-100 flex w-full'>

            {/* Banners for below section */}
            <SplitText
              text="What's New"
              className="lg:text-9xl text-5xl text-border mt-6  text-nowrap z-30 w-full top-0 overflow-visible font-semibold absolute text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />

            {/* Banners for below section */}
            <SplitText
              text="What's New"
              className="lg:text-8xl text-4xl text-sidebar-border mt-6 opacity-20  text-nowrap z-20 w-full top-0 overflow-visible font-semibold absolute text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />

        <div className='absolute inset-0 bg-transparent  w-full overflow-hidden top-0 h-auto  to-transparent z-10'>
          <div className='absolute inset-0 bg-black -top-40 h-[20%] -rotate-[10deg] md:h-[50%] scale-150 rounded-5xl md:-rotate-[10deg] z-20'></div>
         <div className='absolute inset-0 bg-gray-300 -top-40 h-[25%] rotate-[10deg] md:h-[54%] scale-150 rounded-5xl md:rotate-[8deg] z-10'></div>
        </div>



            <section className="hidden z-30 lg:flex py-24 mt-24 px-6 w-full">
                  <div className="w-[45%] rounded-xl border-2 border-white mx-auto animate-slide-down"
                  style={{
                     boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
                  }}>
                    <div className="relative overflow-hidden rounded-xl bg-black">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-20">

                        </div>
                        <img
                          src={communityBackground}
                          alt="Seasonal collection"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      <div className="relative z-20 px-8 py-24 md:px-16 lg:max-w-2xl">
                        <span className="inline-block px-3 text-xs py-1 mb-2 font-medium bg-green-600 text-white rounded-full">
                          Public
                        </span>
                        <h2 className="lg:text-4xl md:text-4xl font-semibold font-poppins mb-4 text-white">The BW Community</h2>
                        <p className="text-white/80 mb-8 font-light">
                           The BW Community is a vibrant hub for car enthusiasts, owners, and experts to connect, share experiences, and stay updated on the latest trends in the automotive world. 
                        </p>
                        <Link to="/community" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
                        <StarBorder
                          as="button"
                          className="custom-class"
                          color="cyan"
                          speed="5s"
                        >
                          Check out the Community
                        </StarBorder>
                      </Link>
                      </div>

                    </div>
                  </div>
                  <div className="w-[45%] border-2 rounded-xl border-white mx-auto animate-slide-up"
                  style={{
                    boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
                  }}>
                    <div className="relative overflow-hidden rounded-xl bg-black">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-20">

                        </div>
                        <img
                          src={turbossImage}
                          alt="Seasonal collection"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      <div className="relative z-20 px-8 py-24 md:px-16 lg:max-w-2xl">
                        <span className="inline-block px-3 text-xs py-1 mb-2 font-medium bg-orange-600 text-white rounded-full">
                          Digital Garage
                        </span>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">TurBoss Digital Garage</h2>
                        <p className="text-white/80 mb-8 font-light">
                          Turboss is your go-to place to explore car details from A to Z. From engine specs to the latest tech, we cover everything you need to know about cars in one easy-to-use platform.
                        </p>
                        <Link to="https://www.turboss.baoswheels.com" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
                        <StarBorder
                          as="button"
                          className="custom-class w-[30rem]"
                          color="cyan"
                          speed="5s"
                        >
                          Go to the Digital Garage
                        </StarBorder>
                      </Link>
                      </div>

                    </div>
                  </div>
            </section>

            {/* Banners for smaller screens */}
            <section className="lg:hidden py-24 px-6 z-40 space-y-5 w-full">
                    <div className="w-[100%] mx-auto animate-slide-down">
                      <div className="relative overflow-hidden rounded-xl border-2 border-white bg-black"
                      style={{
                                             boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
                      }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-20">

                          </div>
                          <img
                            src={communityBackground}
                            alt="Seasonal collection"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        <div className="relative z-20 px-8 py-24 md:px-16 lg:max-w-2xl">
                          <span className="inline-block px-3 text-xs py-1 mb-2 font-medium bg-green-600 text-white rounded-full">
                            Public
                          </span>
                           <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">The BW Community</h2>
                            <p className="text-white/80 mb-8 font-light">
                            The BW Community is a vibrant hub for car enthusiasts, owners, and experts to connect, share experiences, and stay updated on the latest trends in the automotive world.
                            </p>
                          <Link to="/community" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
                          <StarBorder
                            as="button"
                            className="custom-class"
                            color="cyan"
                            speed="5s"
                          >
                            Check out the Community
                          </StarBorder>
                        </Link>
                        </div>

                      </div>
                    </div>
                    <div className="w-[100%] mx-auto animate-slide-up">
                      <div className="relative overflow-hidden border-2 border-white rounded-xl bg-black"
                      style={{
                            boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
                      }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-20">

                          </div>
                          <img
                            src={turbossImage}
                            alt="Seasonal collection"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        <div className="relative z-20 px-8 py-24 md:px-16 lg:max-w-2xl">
                          <span className="inline-block px-3 text-xs py-1 mb-2 font-medium bg-orange-600 text-white rounded-full">
                            Digital Garage
                          </span>
                          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">TurBoss Digital Garage</h2>
                          <p className="text-white/80 mb-8 font-light">
                            Turboss is your go-to place to explore car details from A to Z. From engine specs to the latest tech, we cover everything you need to know about cars in one easy-to-use platform.
                          </p>
                           <Link to="https://www.turboss.baoswheels.com" className="">
                          <StarBorder
                            as="button"
                            className="custom-class"
                            color="cyan"
                            speed="5s"
                          >
                            Go to the Digital Garage
                          </StarBorder>
                          </Link>
                        
                        </div>

                      </div>
                    </div>
            </section>
      </div>

            <style>
        {`
          .text-border1 {
        color: [#EEF525];
        text-shadow:
          -1px -1px 0 #000,  
           1px -1px 0 #000,
          -1px  1px 0 #000,
           1px  1px 0 #000;
          }
        `}
      </style>

      {/* News Section */}
      <section className="relative bg-gray-300 py-40 px-6">
        <div className='absolute inset-0 bg-transparent  w-full overflow-hidden top-0 h-auto  to-transparent z-10'>
          <div className='absolute inset-0 bg-black -top-40 h-[80%] rounded-br-full  md:h-[80%] scale-150 rounded-5xl  z-20'></div>
         <div className='absolute inset-0 bg-gray-300 -top-40 h-[25%]  md:h-[84%] scale-150 rounded-5xl  z-10'></div>
         <div className='absolute inset-0 bg-gray-100 top-0 h-[25%] rounded-bl-full  md:h-[22%]  z-20'></div>
        </div>
        <div 
          ref={aboutRef}
          className="max-w-7xl relative mx-auto opacity-0 z-20"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-xs border-2 font-medium bg-secondary rounded-full">
                News of the Day
              </span>
              <h2 className="text-3xl text-border1 text-[#EEF525] font-semibold mb-6">{latestNews?.title || 'No News Available'}</h2>
              <p className="text-gray-300 mb-6">
                {latestNews?.subtitle}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/4] rounded-lg">
                <img 
                  src={latestNews?.images[1] || workspace}
                  alt="Design workspace"
                  className="w-full h-full border-separate rounded-xl border-double border-8 border-gray-300 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-50 rounded-lg p-4 shadow-sm hidden md:block"
              style={{
                      boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
              }}>
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">News By</p>
                    <p className="text-xs font-semibold">{latestNews?.author}</p>
                  </div>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-xs font-semibold">{latestNews?.date}</p>
                  </div>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="text-xs font-semibold">{latestNews?.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Define a velocity value for the ScrollVelocity component */}
      <div className='relative bg-gray-300'>
      <div className='flex relative z-20 w-auto h-auto py-24 -rotate-2 overflow-hidden'>
          <ScrollVelocity
        texts={['#baoswheels', '#driveYourPassion']} 
        velocity={10} 
        className="custom-scroll-text  font-bold text-border"
          />
      </div>
      <div className='absolute inset-0 bg-white rounded-tr-full  w-full overflow-hidden top-0 h-auto z-10'>
          
      </div>
      </div>

      {/* Testimonials Section 
      <section className="py-20 px-6 bg-gray-50">
        <div 
          ref={testimonialsRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">What People Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from our customers about their experience with our products.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      
      <Footer />
    </div>
  );
};

export default Index;
