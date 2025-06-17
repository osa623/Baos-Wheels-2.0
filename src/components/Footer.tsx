
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//importing images
import logo from '../assets/RoundPhoto_Sep202021_165616.png';

const Footer = () => {
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
              Crafting meaningful products that balance form and function, designed with intention and care for detail.
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
          
          {/* Shop column */}
          <div>
            <h3 className="font-medium mb-4">Latest Reviews</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-primary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-muted-foreground hover:text-primary transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-muted-foreground hover:text-primary transition-colors">
                  Sale
                </Link>
              </li>
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
          
          {/* Contact column */}
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href="mailto:hello@Roodhy.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@baos.com
                </a>
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
