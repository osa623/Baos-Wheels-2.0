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
      <section className="py-20 px-6 bg-gray-50">
        <div 
          ref={categoryRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className='flex items-center justify-between'>
            <Link to="/reviews" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:underline">
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


        {/* Turboss Banner */}
        <section className="py-24 px-6">
              <div className="max-w-7xl mx-auto">

                <div className="relative overflow-hidden rounded-xl bg-black">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-20">
                  
                  </div>

                  {/* Text Section */}
                                
                <div className="absolute z-10 overflow-hidden flex right-0 sms:flex-col w-[60%]  sms:scale-90 sms:w-full bg-transparent h-auto items-center justify-center">
                        
                        <div className="flex flex-col sms:mt-12 lgs:h-auto lgs:w-full items-start lgs:space-y-8 lgs:p-12 justify-center overflow-hidden">

                            <div className="flex lgs:w-auto lgs:scale-90 scale-75 sms:scale-75 ml-20 items-start justify-center">
                                
                                <div className="flex bg-gray-400 items-center justify-center overflow-hidden border-4 w-[4rem] h-[4rem] rounded-full" data-aos='zoom-in' data-aos-delay='350'>
                                     MJ
                                </div>

                                <div className="flex flex-col bg-gray-300 rounded-2xl ml-2 items-start p-5 justify-center w-[30rem] lgs:h-[8rem]" data-aos='fade-left' data-aos-delay='400'
                                style={{
                                    boxShadow:'0px 0px 20px 5px rgba(0,0,0, 0.4), inset 0px 0px 10px 2px rgba(255,255,255, 0.4)'
                                }}>
                                    <h2 className="flex font-dmsans text-orange-600 lgs:text-sm"
                                    style={{
                                        fontWeight:'800'
                                    }}>
                                        Jessica Anderson<span className="ml-2 text-primary"
                                        style={{
                                            fontWeight:'200'
                                        }}>
                                            Tue 03:01
                                        </span>
                                    </h2>
                                    <p className="flex font-dmsans text-primary lgs:text-lg"
                                    style={{
                                        fontWeight:'100'
                                    }}>
                                        Why does my car make a ticking noise when I start it, and then the sound goes away after a few minutes?
                                    </p>
                                </div>

                            </div>

                             <div className="flex lgs:w-auto lgs:scale-90 scale-75 sms:scale-75 lgs:ml-12 items-start justify-center">

                                <div className="flex bg-gray-300 items-center justify-center overflow-hidden border-4 w-[4rem] h-[4rem] rounded-full" data-aos='zoom-in' data-aos-delay='350'>
                                    JD
                                </div>

                                <div className="flex flex-col bg-gray-300 rounded-2xl ml-2 items-start p-5 justify-center w-[30rem] lgs:h-[8rem]" data-aos='fade-left' data-aos-delay='400'
                                style={{
                                    boxShadow:'0px 0px 20px 5px rgba(0,0,0, 0.4), inset 0px 0px 10px 2px rgba(255,255,255, 0.4)'
                                }}>
                                    <h2 className="flex font-dmsans text-orange-600 lgs:text-sm"
                                    style={{
                                        fontWeight:'800'
                                    }}>
                                        Jessica Anderson<span className="ml-2 text-primary"
                                        style={{
                                            fontWeight:'200'
                                        }}>
                                            Tue 03:01
                                        </span>
                                    </h2>
                                    <p className="flex font-dmsans text-primary lgs:text-lg"
                                    style={{
                                        fontWeight:'100'
                                    }}>
                                        Why does my car make a ticking noise when I start it, and then the sound goes away after a few minutes?
                                    </p>
                                </div>

                            </div>

                            <div className="flex lgs:w-auto sms:ml-12  scale-100 items-start justify-center">
                                
                                <div className="flex bg-green-600 text-white items-center justify-center overflow-hidden border-4 w-[4rem] h-[4rem] rounded-full" data-aos='zoom-in' data-aos-delay='450'>
                                   NI
                                </div>

                                <div className="flex flex-col bg-gray-400 rounded-2xl ml-2 items-start p-5 justify-center w-[30rem] sms:w-[25rem] lgs:h-[8rem]" 
                                data-aos='fade-left' data-aos-delay='500'
                                style={{
                                    boxShadow:'0px 0px 20px 5px rgba(0,0,0, 0.4), inset 0px 0px 10px 2px rgba(255,255,255, 0.4)'
                                }}>

                                    <div className="flex bg-transparent items-center justify-start w-full h-auto">
                                    <h2 className="flex font-dmsans text-orange-600 lgs:text-sm"
                                    style={{
                                        fontWeight:'800'
                                    }}>
                                        Jhon Dewik<span className="ml-2 text-primary"
                                        style={{
                                            fontWeight:'200'
                                        }}>
                                            Tue 03:15
                                        </span>
                                    </h2>
                                    <h2 className="flex font-dmsans ml-2 text-primary bg-orange-600 p-1 rounded-full"
                                    style={{
                                        fontWeight:'800',
                                        fontSize:'0.5rem'
                                    }}>
                                        Auto Expert
                                    </h2>
                                    </div>
                                    <p className="flex font-dmsans lgs:mt-1 text-primary text-sm"
                                    style={{
                                        fontWeight:'100'
                                    }}>
                                        A ticking noise at startup that fades after a few minutes is often due to low oil levels, cold engine parts, or worn valve lifters. It’s usually harmless if it stops quickly, but if it continues, it’s best to get it checked to avoid engine damage
                                    </p>
                                </div>

                            </div>
                           
                            <div className="flex lgs:w-auto  ml-2 scale-75 mt-2   items-start justify-center">
                                
                                <div className="flex bg-gray-400 items-center justify-center overflow-hidden border-4 w-[4rem] h-[4rem] rounded-full" data-aos='zoom-in' data-aos-delay='550'>
                                    JO
                                </div>

                                <div className="flex flex-col bg-gray-300 rounded-2xl ml-2 items-start p-5 justify-center lgs:w-[30rem] lgs:h-[8rem]" data-aos='fade-left' data-aos-delay='600'
                                style={{
                                    boxShadow:'0px 0px 20px 5px rgba(0,0,0, 0.4), inset 0px 0px 10px 2px rgba(255,255,255, 0.4)'
                                }}>
                                    <h2 className="flex font-dmsans text-orange-600 lgs:text-sm"
                                    style={{
                                        fontWeight:'800'
                                    }}>
                                        David Jhohanson<span className="ml-2 text-primary"
                                        style={{
                                            fontWeight:'200'
                                        }}>
                                            Wed 08:01
                                        </span>
                                    </h2>
                                    <p className="flex font-dmsans text-primary lgs:text-lg"
                                    style={{
                                        fontWeight:'100'
                                    }}>
                                        When I brake at high speeds, my car starts shaking. What could be the cause?
                                    </p>
                                </div>

                            </div>


                        </div>


                </div>

                    <img 
                      src= {communityBackground}
                      alt="Seasonal collection"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  <div className="relative z-20 px-8 py-24 md:px-16 lg:max-w-lg">
                    <span className="inline-block px-3 text-xs py-1 mb-2 font-medium bg-green-600 text-white rounded-full">
                       Public
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">The BW Community</h2>
                    <p className="text-white/80 mb-8 font-light">
                      Connect with fellow car enthusiasts by asking questions, sharing tips, or discussing anything automotive.
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
      </section>


      {/* Test Section */}
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
              <Button 
                variant="outline" 
                className="rounded-full px-8 button-hover"
              >
                Learn more about us
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={latestNews?.images[1] || workspace}
                  alt="Design workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-50 rounded-lg p-4 shadow-sm hidden md:block">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">By</p>
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
        className="custom-scroll-text font-bold text-border"
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
      
      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-gray-100 to-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter to receive updates on new products, special offers, and design inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex h-10 w-full rounded-full border border-input bg-white px-5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button className="rounded-full button-hover">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
