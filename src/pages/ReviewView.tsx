import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Star, ThumbsUp, MessageCircle, Share2, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { reviewsApi, Review, articlesApi } from '@/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article } from '@/components/ArticleCard';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import { Helmet } from 'react-helmet-async';

const ReviewView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  // Try to get reviewId from location state if it exists
  const reviewIdFromState = location.state?.reviewId;
  
  const [review, setReview] = useState<Review | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  
  console.log("Review ID from params:", id); 
  console.log("Review ID from state:", reviewIdFromState);
  
  // Fetch review data
  useEffect(() => {
    const fetchReview = async () => {
      // Use ID from params or from state
      const reviewId = id || reviewIdFromState;
      
      if (!reviewId) {
        setError("No review ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching review with ID:", reviewId);

        // Use the ID to fetch review
        const reviewData = await reviewsApi.getById(reviewId);
        console.log("Fetched review data:", reviewData);

        if (!reviewData) {
          throw new Error("No review data returned");
        }
        
        // Normalize the review object - ensure it has an id field
        if (reviewData._id && !reviewData.id) {
          reviewData.id = reviewData._id;
        }

        setReview(reviewData);
        setLikeCount(Math.floor(Math.random() * 1));
      } catch (err: any) {
        console.error("Error fetching review:", err);
        setError(err.message || "Failed to load the review. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [id, reviewIdFromState]);

  //fetching related articles
  useEffect(() => {
    const fetchArticles = async () => {
        try {
            const articles = await articlesApi.getAll();
            setRelatedArticles(articles);
        } catch (error) {
            console.error('Failed to load articles:', error);
            console.error('Article ID:', articlesApi);
        }
    };
    fetchArticles();

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <h2 className="text-2xl font-bold mb-4">Error Loading Review</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Helmet for SEO and metadata */}
      <Helmet>
        <title>{review.title} - {review.brand} Review</title>
        <meta name="description" content={`Read our in-depth review of the ${review.brand} ${review.title}. Explore its features, performance, and more.`} />
        <link rel="canonical" href={`${window.location.origin}/reviews/${review.id}`} />
        <meta property="og:title" content={`${review.title} - ${review.brand} Review`} />
        <meta property="og:description" content={`Read our in-depth review of the ${review.brand} ${review.title}. Explore its features, performance, and more.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/reviews/${review.id}`} />
        <meta property="og:image" content={review.images && review.images.length > 0 ? review.images[0] : 'https://placehold.co/1200x800?text=No+Image'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${review.title} - ${review.brand} Review`} />
        <meta name="twitter:description" content={`Read our in-depth review of the ${review.brand} ${review.title}. Explore its features, performance, and more.`} />
        <meta name="twitter:image" content={review.images && review.images.length > 0 ? review.images[0] : 'https://placehold.co/1200x800?text=No+Image'} />
      </Helmet>



      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back navigation */}
          <Link to="/" className="inline-flex items-center text-sm mb-8 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Reviews
          </Link>
          
          {/* Review header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <Badge variant="secondary" className="mb-2">{review.category}</Badge>
                <Badge variant="secondary" className="mb-2 mx-1">{review.brand}</Badge>
                <h1 className="flex text-3xl sm:text-4xl font-bold">{review.brand}<span className='font-thin ml-2'>{review.title}</span></h1>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  {review.date && (
                    <>
                      <span className="mx-0">•</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{review.date}</span>
                    </>
                  )}
                  {review.author && (
                    <>
                      <span className="ml-2">•</span>
                      <User className="h-4 w-4" />
                      <span>{review.author}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main image */}
          <div className="mb-8">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={review.images && review.images.length > 0 ? 
                  review.images[0] : 'https://placehold.co/1200x800?text=No+Image'} 
                alt={review.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Rating 
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < (review.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="font-bold">{review.rating || 4.0}/5.0</span>
            </div>
            {review.ratingText && (
              <p className="text-sm font-medium">{review.ratingText}</p>
            )}
          </div>  */}
          
          <Separator className="" />
            <h2 className='flex flex-col lg:text-2xl text-3xl font-bold py-6'>
                Specifications
                <p className='font-normal text-xs py-2 lg:w-[60%]'>
                    The following specifications cover all essential technical and design aspects of the vehicle, including engine performance, dimensions, fuel economy, and advanced features.
                </p>
            </h2>
            <div className='hidden lg:grid grid-cols-2 gap-4 mb-8'>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.engine}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.drivetrain}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.fuelEconomy}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.seatingCapacity}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.singleprice}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.transmission}</Badge>
            </div>
            <div className='grid lg:hidden grid-cols-1 gap-4 mb-8'>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.engine}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.drivetrain}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.fuelEconomy}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.seatingCapacity}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.singleprice}</Badge>
                <Badge variant="secondary" className='py-2 bg-gray-300'>{review.transmission}</Badge>
            </div>



          <Separator className="mb-8" />
          
          {/* Review content */}
          <div className="prose max-w-none mb-8">
              <h2 className='flex flex-col text-3xl lg:w-[70%] font-bold py-6'>
                 <span className='flex items-center'><div className='bg-black border-4 border-gray-500 h-5 w-5 mr-4 rounded-full' /><span>What You’re Really Getting</span></span>
                <p className='font-light text-lg  py-4 w-[100%]'>
                  {review.overview}
                </p>
            </h2>
             <h2 className='flex flex-col text-3xl lg:w-[70%] font-bold py-6'>
                 <span className='flex items-center'><div className='bg-black border-4 border-gray-500 h-5 w-5 mr-4 rounded-full' /><span>What Defines It's Look</span></span>
                <p className='font-light text-lg py-4 w-[100%]'>
                  {review.exterior}
                </p>
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={review.images && review.images.length > 0 ? 
                  review.images[1] : 'https://placehold.co/1200x800?text=No+Image'} 
                alt={review.title}
                className="w-full h-full object-cover"
              />
            </div>
             <h2 className='flex flex-col text-3xl lg:w-[70%] font-extrabold py-6'>
                 <span className='flex items-center'><div className='bg-black border-4 border-gray-500 h-5 w-5 mr-4 rounded-full' /><span>What Surrounds You</span></span>
                <p className='font-light text-lg  py-4 w-[100%]'>
                  {review.interior}
                </p>
            </h2>
            {/* Fetch related Article section */}
            <div className='relative flex-col w-full py-8'>
                
                <div className='flex bg-transparent'>
                    <h3 className='flex text-lg text-white w-auto p-2 font-normal bg-gray-600 mb-4'>Check These Related Articles</h3>
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    <Separator className="mt-5" />
                    {relatedArticles.slice(0, 3).map((article) => (
                        <div 
                        key={article.id} 
                        className='flex-col'>
                        <Link 
                          to={`/articles/${article.id}`} 
                          className="flex bg-transparent"
                        >
                            <div className='flex w-[20%] h-24 overflow-hidden'>
                            <img 
                              src={article.images[0]} 
                              alt={article.title} 
                              className="h-auto w-[100%] object-cover"
                            />
                            </div>
                            <div className="p-4">
                                <h4 className="text-xl font-semibold mb-2">{article.title}</h4>
                                <p className="text-sm text-muted-foreground">{article.category}</p>
                            </div>
                        </Link>
                        <Separator className="mt-5" />
                        </div>
                        
                    ))}
                </div>    
            
            </div> 
             <h2 className='flex flex-col text-3xl lg:w-[70%] font-bold py-6'>
                 <span className='flex items-center'><div className='bg-black border-4 border-gray-500 h-5 w-5 mr-4 rounded-full' /><span>What Drives It </span></span>
                <p className='font-light  text-lg  py-4 w-[100%]'>
                  {review.performance}
                </p>
            </h2>
          </div>
          
          {/* Additional images */}
          {review.images && review.images.length > 1 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {review.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${review.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section - Replace with the fixed components */}
          <div className="mb-8">
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Discussion</h3>
            <CommentForm reviewId={review._id || review.id} />
            <CommentList reviewId={review._id || review.id} />
          </div>

          {/* Interaction buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                navigator.share({
                  title: review.title,
                  text: `Check out this review of the ${review.brand} ${review.title}`,
                  url: window.location.href,
                }).catch(err => console.error('Error sharing:', err));
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>



        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewView;
