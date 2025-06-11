
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-50 z-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Newsletter signup */}
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
        </div>
        
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
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
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Shop column */}
          <div>
            <h3 className="font-medium mb-4">Shop</h3>
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
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-muted-foreground hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Design Avenue, Creative District<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href="mailto:hello@Roodhy.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@Roodhy.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Roodhy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
