
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {reviewsApi , articlesApi } from "@/api/index";;
import { Input } from "@/components/ui/input";

//importing images
import logo from '../assets/RoundPhoto_Sep202021_165616.png';

const Footer = () => {

  const [reviews, setReviews] = useState([]);
  const [articles, setArticles] = useState([]);

  //implementing the logic 
  useEffect(()=> {
    const fetchReviews = async () => {
      try {
        const response = await reviewsApi.getAll();
        setReviews(response); // Get the latest 5 reviews
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await articlesApi.getAll();
        setArticles(response); // Get the latest 5 articles
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchReviews();
    fetchArticles();
  })




  return (
    <footer className="bg-gray-50 z-40 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Newsletter signup 
        <div className="mb-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Join our newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest collections, news, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-full bg-white"
              />
              <Button className="rounded-full button-hover">
                Subscribe
              </Button>
            </div>
          </div>
        </div> */}
        
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center py-2 px-2 space-x-2">
            <img src={logo} alt="Baos Wheels Logo" className="h-10 w-10 border-2 rounded-full" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Baos Wheels
              </h1>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm">
              Empowering automotive enthusiasts with the latest reviews, articles, and community insights—your trusted source for everything on wheels.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                {/* Replace with your TikTok icon component */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 3a5.5 5.5 0 0 0 5.5 5.5v3.25a8.75 8.75 0 1 1-8.75-8.75h3.25zm-3.25 2A6.75 6.75 0 1 0 20 11.75V9.9a7.5 7.5 0 0 1-3.25-.9V16a4.25 4.25 0 1 1-4.25-4.25h.5v2a2.25 2.25 0 1 0 2.25 2.25V5z"/>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>
            <div>
            <h3 className="font-medium mb-4">Latest Reviews</h3>
            <ul className="space-y-3 text-sm">
              {[...reviews]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((review) => (
                <li key={review.id}>
                <Link to={`/reviews/${review.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {review.title}
                </Link>
                </li>
              ))}
            </ul>
            </div>

        {/* Articles Section */}
          <div>
            <h3 className="font-medium mb-4">Latest Articles</h3>
            <ul className="space-y-3 text-sm">
              {[...articles]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((article) => (
                  <li key={article.id}>
                    <Link to={`/articles/${article.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          
          {/* Company column */}
          <div>
            <h3 className="font-medium mb-4">We Offer</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-primary transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Chat
                </Link>
              </li>
              <li>
                <Link to="/electric" className="text-muted-foreground hover:text-primary transition-colors">
                  Electric Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        
        </div>
        
        {/* Bottom footer */}
        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} baoswheels. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacypolicy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/termsofservices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
