import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articlesApi } from '@/api/index';
import { Article } from '@/components/ArticleCard';

const Articles = () => {
  // Refs for sections to animate
  const featuredRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  
  // State for articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getAll();
        console.log("Fetched Articles:", response);
        setArticles(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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
    
    if (featuredRef.current) observer.observe(featuredRef.current);
    if (collectionsRef.current) observer.observe(collectionsRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen py-24">
      <Header />
      
      {/* Featured Articles */}
      <section className="py-8 px-6">
        <div 
          ref={featuredRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
               <Link to="/" className="inline-flex items-center text-sm mb-1 hover:text-primary transition-colors">
                 <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Home
              </Link>
              <h2 className="text-3xl font-semibold mb-3">Articles</h2>
              <p className="text-muted-foreground max-w-xl">
                Our most celebrated articles, showcasing the very best of our automotive insights.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Articles Grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div 
          ref={collectionsRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={article.images?.[1] || 'https://placehold.co/600x400?text=No+Image'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="px-3 w-auto border-2 py-1 text-xs font-medium bg-gray-400 text-white rounded-full animate-fade-in">
                        {article.category || 'General'}
                      </span>
                      <Button 
                        // Fix: Use article.id instead of _id, with fallback if needed
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the parent Link from also navigating
                          window.location.href = `/articles/${article._id || article.id}`;
                        }}
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto hover:bg-transparent group-hover:text-primary transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No articles state */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found.</p>
            </div>
          )}
        </div>
      </section>

      
      <Footer />
    </div>
  );
};


export default Articles;
