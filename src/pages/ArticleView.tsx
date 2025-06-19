import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Share2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { articlesApi } from '@/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article } from '@/api/index';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import { Helmet } from 'react-helmet-async';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const articleIdFromState = location.state?.articleId;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log("Article ID from params:", id); 
  console.log("Article ID from state:", articleIdFromState);
  
  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      // Use ID from params or from state
      const articleId = id || articleIdFromState;
      
      if (!articleId) {
        console.error("No article ID provided");
        setError("No article ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("ArticleView: Fetching article with ID:", articleId);

        // Use the ID to fetch article
        const articleData = await articlesApi.getById(articleId);
        console.log("ArticleView: Fetched article data:", articleData);

        if (!articleData) {
          throw new Error("No article data returned");
        }
        


        // Ensure the content property exists
        setArticle({
          ...articleData,
          summary: articleData.summary ?? "",
          images: articleData.images || [], // Ensure images is always an array
          subtitle: articleData.subtitle ?? "",
          description: articleData.description ?? "",
        });
      } catch (err: any) {
        console.error("ArticleView: Error fetching article:", err);
        setError(err.message || "Failed to load the article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, articleIdFromState]);

  // Fetching related articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await articlesApi.getAll();
        // Filter out the current article and get a few related ones
        const filtered = articles.filter(a => a.id !== (article?.id || id));
        setRelatedArticles(filtered);
      } catch (error) {
        console.error('Failed to load related articles:', error);
      }
    };
    fetchArticles();
  }, [article, id]);

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

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <h2 className="text-2xl font-bold mb-4">Error Loading Article</h2>
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

      {/* Helmet for SEO */}
      <Helmet>
        <title>{article.title} | Baos Wheels</title>
        <meta name="description" content={article.summary || "Read this article on Baos Wheels"} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary || "Read this article on Baos Wheels"} />
        <meta property="og:image" content={article.images && article.images.length > 0 ? article.images[0] : 'https://placehold.co/1200x800?text=No+Image'} />
     </Helmet>
     
        


      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back navigation */}
          <Link to="/articles" className="inline-flex items-center text-sm mb-8 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Articles
          </Link>
          
          {/* Article header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                <h1 className="text-3xl sm:text-4xl font-bold">{article.title}</h1>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  {article.date && (
                    <>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{article.date}</span>
                      <span className="mx-1">•</span>
                    </>
                  )}
                  {article.author && (
                    <>
                      <User className="h-4 w-4 mr-1" />
                      <span>{article.author}</span>
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
                src={article.images && article.images.length > 0 ? 
                  article.images[0] : 'https://placehold.co/1200x800?text=No+Image'} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          {/* Article content */}
          <div className="prose max-w-none mb-8">
            {/* Render subtitles and paragraphs as pairs */}
            {Array.isArray(article.subtitle) && Array.isArray(article.description) ? (
              article.subtitle.map((sub, idx) => (
                <div key={idx} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{sub}</h2>
                  <p>{article.description[idx]}</p>
                </div>
              ))
            ) : (
              // Fallback for old structure: single subtitle and description
              <>
                {article.subtitle && <h2 className="text-xl font-semibold mb-2">{article.subtitle}</h2>}
                {article.description && <p>{article.description}</p>}
              </>
            )}

            {/* Additional image if available */}
            {article.images && article.images.length > 1 && (
              <div className="my-8">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={article.images[1]} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Fetch related Article section */}
            <div className='relative flex-col w-full py-8'>
                <div className='flex bg-transparent'>
                    <h3 className='flex text-lg text-white w-auto p-2 font-normal bg-gray-600 mb-4'>Check These Related Articles</h3>
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    <Separator className="mt-5" />
                    {relatedArticles.slice(0, 3).map((relatedArticle) => (
                        <div 
                        key={relatedArticle.id} 
                        className='flex-col'>
                        <Link 
                          to={`/articles/${relatedArticle.id}`} 
                          className="flex bg-transparent"
                        >
                            <div className='flex w-[20%] h-24 overflow-hidden'>
                            <img 
                              src={relatedArticle.images?.[0] || 'https://placehold.co/600x400?text=No+Image'} 
                              alt={relatedArticle.title} 
                              className="h-auto w-[100%] object-cover"
                            />
                            </div>
                            <div className="p-4">
                                <h4 className="text-xl font-semibold mb-2">{relatedArticle.title}</h4>
                                <p className="text-sm text-muted-foreground">{relatedArticle.category}</p>
                            </div>
                        </Link>
                        <Separator className="mt-5" />
                        </div>
                    ))}
                </div>    
            </div>
          </div>
          
          {/* Additional images */}
          {article.images && article.images.length > 2 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {article.images.slice(2).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${article.title} - Image ${index + 3}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section 
          <div className="mb-8">
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Discussion</h3>
            <CommentForm reviewId={article._id || article.id.toString()} />
            <CommentList reviewId={article._id || article.id.toString()} />
          </div> */}

          {/* Interaction buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                navigator.share({
                  title: article.title,
                  text: `Check out this article: ${article.title}`,
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

export default ArticleView;
