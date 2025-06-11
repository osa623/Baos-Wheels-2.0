import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data for collections
const featuredCollections = [
    {
        id: 1,
        title: "Minimalist Living",
        description: "Simplicity meets Roodhy in this collection of essentials for the modern home.",
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=800&q=80",
        productCount: 24,
        featured: true
    },
    {
        id: 2,
        title: "Nordic Retreat",
        description: "Scandinavian design principles with warm textures and natural materials.",
        image: "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&w=800&q=80",
        productCount: 18,
        featured: true
    }
];

const standardCollections = [
    {
        id: 3,
        title: "Artisan Ceramics",
        description: "Handcrafted ceramic pieces that bring artisanal Roodhy to your dining experience.",
        image: "https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&w=800&q=80",
        productCount: 15,
        relatedImages: [
            "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&w=800&q=80",
            "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&w=800&q=80"
        ]
    },
    {
        id: 4,
        title: "Organic Textiles",
        description: "Sustainable fabrics with modern designs for conscious living.",
        image: "https://cdn.pixabay.com/photo/2024/02/08/10/48/ai-generated-8560805_960_720.jpg",
        productCount: 12,
        
    },
    {
        id: 5,
        title: "Mood Lighting",
        description: "Create atmosphere with our selection of unique lighting solutions.",
        image: "https://s3.amazonaws.com/electronichousesite/wp-content/uploads/2017/01/19090453/mood-lighting.jpg",
        productCount: 18,
        relatedImages: [
            "https://images.pexels.com/photos/3773577/pexels-photo-3773577.jpeg?auto=compress&w=800&q=80",
            "https://images.pexels.com/photos/3773578/pexels-photo-3773578.jpeg?auto=compress&w=800&q=80"
        ]
    },
    {
        id: 6,
        title: "Natural Materials",
        description: "Furniture and accessories crafted from sustainable woods and natural fibers.",
        image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&w=800&q=80",
        productCount: 21,
        relatedImages: [
            "https://images.pexels.com/photos/1866150/pexels-photo-1866150.jpeg?auto=compress&w=800&q=80",
            "https://images.pexels.com/photos/1866151/pexels-photo-1866151.jpeg?auto=compress&w=800&q=80"
        ]
    },
    {
        id: 7,
        title: "Timeless Accessories",
        description: "Elevate your space with objects that transcend trends.",
        image: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&w=800&q=80",
        productCount: 16,
        relatedImages: [
            "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&w=800&q=80",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=800&q=80"
        ]
    },
    {
        id: 8,
        title: "Kitchen Essentials",
        description: "Functional yet beautiful tools for the heart of your home.",
        image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=800&q=80",
        productCount: 19,
        relatedImages: [
            "https://images.pexels.com/photos/461383/pexels-photo-461383.jpeg?auto=compress&w=800&q=80",
            "https://images.pexels.com/photos/461384/pexels-photo-461384.jpeg?auto=compress&w=800&q=80"
        ]
    }
];

const Collections = () => {
  // Refs for sections to animate
  const featuredRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  
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
    <div className="min-h-screen">
      <Header />
      
      {/* Page header */}
      <div className="pt-24 pb-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-semibold mt-6 mb-3">Our Collections</h1>
            <p className="text-muted-foreground max-w-xl">
              Curated selections that bring together our finest products into cohesive design narratives for your space.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Collections */}
      <section className="py-16 px-6">
        <div 
          ref={featuredRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold mb-3">Featured Collections</h2>
              <p className="text-muted-foreground max-w-xl">
                Our most celebrated collections, showcasing the very best of our aesthetic vision.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredCollections.map((collection, index) => (
              <Link 
                to={`/collections/${collection.id}`}
                key={collection.id}
                className="group relative overflow-hidden rounded-xl aspect-[16/9] bg-black shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">{collection.title}</h3>
                  <p className="text-white/90 max-w-md mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-white/80">{collection.productCount} Products</span>
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Collections Grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div 
          ref={collectionsRef}
          className="max-w-7xl mx-auto opacity-0"
          style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-3">All Collections</h2>
            <p className="text-muted-foreground">
              Browse all of our thoughtfully curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardCollections.map((collection, index) => (
              <Link 
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{collection.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{collection.productCount} Products</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto hover:bg-transparent group-hover:text-primary transition-colors"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Season Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3" 
              alt="Seasonal collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 py-16 px-8 md:py-24 md:px-16 lg:max-w-lg">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-white/20 text-white rounded-full">
                New Season
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">The Autumn Collection</h2>
              <p className="text-white/80 mb-8">
                Embrace the changing seasons with our new collection of warm textures, rich colors, and cozy designs to transform your space.
              </p>
              <Button className="rounded-full button-hover bg-white text-black hover:bg-white/90">
                Explore the Collection
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Collection Process */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Our Curation Process</h2>
          <p className="text-muted-foreground mb-12">
            Each collection is carefully crafted through a thoughtful process that ensures every product works in harmony with the others.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="text-xl font-semibold text-primary">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Research & Inspiration</h3>
              <p className="text-sm text-muted-foreground">
                We gather inspiration from art, architecture, nature, and cultural trends.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="text-xl font-semibold text-primary">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Design & Selection</h3>
              <p className="text-sm text-muted-foreground">
                Our designers carefully select products that tell a cohesive story.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="text-xl font-semibold text-primary">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Curation & Presentation</h3>
              <p className="text-sm text-muted-foreground">
                We arrange and style the collection to showcase how pieces work together.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Collections;
