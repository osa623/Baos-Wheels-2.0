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
      <section id="featured-products" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold mb-3">Latest Articles</h2>
              <p className="text-muted-foreground max-w-xl">
                Explore the latest articles about the automobile industry, get up-to-date auto news, and discover insights on trends, innovations, and expert tips to keep you informed and inspired.
              </p>
          </div>
            <Link to="/articles" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
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
      <div className='flex w-auto h-auto rotate-2 overflow-hidden'>
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
           1px  1px 0 #000;
          }
        `}
      </style>
      
      {/* Categories Reviews Section */}
      <section className="py-20 px-6 z-30 bg-gray-50">
        <div 
          ref={categoryRef}
          className="max-w-7xl mx-auto opacity-0"
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
              <h2 className="text-3xl font-semibold mb-3">Latest Reviews</h2>
              <p className="text-muted-foreground text-end max-w-xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fetchReviews.slice(0,8).map((review) => {
              // Handle MongoDB _id format if present
              const reviewId = review._id || review.id;
              
              return (
                <Link 
                  key={reviewId}
                  to={`/reviews/${reviewId}`}
                  state={{ reviewId: reviewId }} // Pass the MongoDB ObjectId
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
              className="lg:text-9xl text-5xl text-border mt-6  text-nowrap z-20 w-full top-0 overflow-visible font-semibold absolute text-center"
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
              className="lg:text-8xl text-4xl text-sidebar-border mt-6  text-nowrap z-10 w-full top-0 overflow-visible font-semibold absolute text-center"
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




            <section className="hidden z-30 lg:flex py-24 mt-24 px-6 w-full">
                  <div className="w-[45%] mx-auto animate-slide-down">
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
                  <div className="w-[45%] mx-auto animate-slide-up">
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
                        <Link to="/community" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
                        <StarBorder
                          as="button"
                          className="custom-class w-[30rem]"
                          color="cyan"
                          speed="5s"
                        >
                          Digital Garage will be available soon
                        </StarBorder>
                      </Link>
                      </div>

                    </div>
                  </div>
            </section>

            {/* Banners for smaller screens */}
            <section className="lg:hidden py-24 px-6 space-y-5 w-full">
                    <div className="w-[100%] mx-auto animate-slide-down">
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
                          
                          <StarBorder
                            as="button"
                            className="custom-class"
                            color="cyan"
                            speed="5s"
                          >
                            Garage will be available soon
                          </StarBorder>
                        
                        </div>

                      </div>
                    </div>
            </section>
      </div>

      {/* News Section */}
      <section className="py-20 px-6">
        <div 
          ref={aboutRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-secondary rounded-full">
                News of the Day
              </span>
              <h2 className="text-3xl font-semibold mb-6">{latestNews?.title || 'No News Available'}</h2>
              <p className="text-muted-foreground mb-6">
                {latestNews?.subtitle}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg">
                <img 
                  src={latestNews?.images[1] || workspace}
                  alt="Design workspace"
                  className="w-full h-full border-separate rounded-xl border-double border-8 border-gray-700 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-50 rounded-lg p-4 shadow-sm hidden md:block">
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
      <div className='flex w-auto h-auto py-24 -rotate-2 overflow-hidden'>
          <ScrollVelocity
        texts={['#baoswheels', '#driveYourPassion']} 
        velocity={10} 
        className="custom-scroll-text  font-bold text-border"
          />
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
