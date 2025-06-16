import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

//apis
import { reviewsApi, Review } from '@/api';
import { Badge } from '@/components/ui/badge';

// Categories for filtering car reviews
const categories = [
  { id: "suv", name: "SUV" },
  { id: "sedan", name: "Sedan" },
  { id: "electric", name: "Electric" },
  { id: "sports", name: "Sports" },
  { id: "luxury", name: "Luxury" }
];

// Categories for filtering car reviews
const brands = [
  { id: "mercedesbenz", name: "Mercedes Benz" },
  { id: "audi", name: "Audi" },
  { id: "tesla", name: "Tesla" },
  { id: "porsche", name: "Porsche" },
  { id: "bmw", name: "BMW" },
  { id: "nissan", name: "Nissan" },
  { id: "toyota", name: "Toyota" },
  { id: "mazda", name: "Mazda" },
  { id: "mitsubishi", name: "Mitsubishi" },
  { id: "honda", name: "Honda" }
];

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all the reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const reviewsData = await reviewsApi.getAll();
        setReviews(reviewsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []); 

  // Apply filters when filter criteria changes
  useEffect(() => {
    let result = [...reviews];
    
    // Filter by price - use numeric price from singleprice field or default to 0
    result = result.filter(review => {
      const price = review.singleprice ? 
                    (typeof review.singleprice === 'string' ? 
                     parseFloat(review.singleprice.replace(/[^0-9.]/g, '')) : 
                     review.singleprice) : 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(review => 
        review.category && selectedCategories.includes(review.category.toLowerCase())
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter(review => 
        review.brand && selectedBrands.includes(review.brand.toLowerCase())
      );
    }
    
    // Sort reviews
    switch (sortBy) {
      case "name-a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        result.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });
        break;
      case "brand-a-z":
        result.sort((a, b) => {
          const brandA = a.brand || '';
          const brandB = b.brand || '';
          return brandA.localeCompare(brandB);
        });
        break;
      default:
        // Featured - no sorting needed
        break;
    }
    
    setFilteredReviews(result);
  }, [reviews, priceRange, selectedCategories, selectedBrands, sortBy]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSortBy("featured");
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter reviews by search term as well
  useEffect(() => {
    let result = [...reviews];

    // Filter by price
    result = result.filter(review => {
      const price = review.singleprice ?
        (typeof review.singleprice === 'string' ?
          parseFloat(review.singleprice.replace(/[^0-9.]/g, '')) :
          review.singleprice) : 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(review =>
        review.category && selectedCategories.includes(review.category.toLowerCase())
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter(review =>
        review.brand && selectedBrands.includes(review.brand.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(review =>
        (review.title && review.title.toLowerCase().includes(term)) ||
        (review.brand && review.brand.toLowerCase().includes(term)) ||
        (review.category && review.category.toLowerCase().includes(term))
      );
    }

    // Sort reviews
    switch (sortBy) {
      case "name-a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        result.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });
        break;
      case "brand-a-z":
        result.sort((a, b) => {
          const brandA = a.brand || '';
          const brandB = b.brand || '';
          return brandA.localeCompare(brandB);
        });
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    setFilteredReviews(result);
  }, [reviews, priceRange, selectedCategories, selectedBrands, sortBy, searchTerm]);

  return (
    <div className="min-h-screen ">
      <Header />
      
      {/* Page header */}
      <div className="pt-24 pb-6 px-6 bg-gray-50 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-center">
            <div className='flex flex-col'>
              <Link to="/" className="inline-flex items-center text-sm mb-1 hover:text-primary transition-colors">
                 <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Home
              </Link>
              <h1 className="text-3xl text-left font-semibold mb-3">Car Reviews</h1>
              <p className="text-muted-foreground text-left max-w-md">
                Explore our collection of in-depth automotive reviews to help you make informed decisions. 
              </p>
            </div>
            <div className="hidden lg:flex items-center mt-6 ml-8 w-full relative">
              <input
              type="text"
              placeholder="Search reviews..."
              className="border border-gray-300 rounded-md px-4 py-2 w-[100%] focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              </span>
            </div>
          </div>
          <div className="lg:hidden mt-6">
            <input
              type="text"
              placeholder="Search reviews..."
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            </div>
        </div>
      </div>
      
      {/* Reviews grid with sidebar */}
      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 border-4 bg-gray-50 p-4">
                  <div className='flex w-full'>
                      <h2 className='font-normal px-2 bg-gray-400 p-2 text-white text-sm mb-4'>
                        Choose Your Car
                      </h2>
                  </div>
                  <div className="mb-8">
                    <Badge variant="secondary" className="mb-5">Price Range</Badge>
                    <Slider 
                      min={0}
                      max={150000}
                      step={5000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                {/* Desktop Sort */}
                <div className="flex flex-col justify-between items-center mb-6">
                
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="name-a-z">Title: A to Z</SelectItem>
                      <SelectItem value="name-z-a">Title: Z to A</SelectItem>
                      <SelectItem value="brand-a-z">Brand: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  
                  <div className="mb-8">
                    <Badge variant="secondary" className="mb-5">Categories</Badge>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <Badge variant="secondary" className="mb-5">Auto Brands</Badge>
                    <div className="space-y-2">
                      {brands.map(category => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`category-${category.id}`}
                            checked={selectedBrands.includes(category.id)}
                            onCheckedChange={() => handleBrandChange(category.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Mobile Filters Button */}
            <div className="lg:hidden flex justify-between  items-center mb-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name-a-z">Title: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Title: Z to A</SelectItem>
                  <SelectItem value="brand-a-z">Brand: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile Filters Modal */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 md:overflow-scroll bg-tranparent z-50 lg:hidden">
                <div className="absolute right-0 top-0 bottom-0 w-80 h-[50rem] bg-white p-6 animate-slide-in-right">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-medium mb-4">Price Range</h3>
                    <Slider 
                      min={0}
                      max={150000}
                      step={5000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-medium mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`mobile-category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`mobile-category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-medium mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`mobile-category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`mobile-category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setIsMobileFilterOpen(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        resetFilters();
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reviews Content */}
            <div className="flex-1">
              
             {/* Desktop Sort */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredReviews.length} reviews
                </p>

                
                
              </div>

              
              {/* Loading and Error States */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse space-y-2">
                    <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-3 w-64 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="text-lg text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-lg mb-4">No reviews match your filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                /* Reviews Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReviews.map((review, index) => {
                    // Handle MongoDB _id format if present
                    const reviewId = review._id || review.id;
                    
                    return (
                      <Link 
                        key={reviewId}
                        to={`/reviews/${reviewId}`}
                        state={{ reviewId }}
                        className="group relative overflow-hidden rounded-lg aspect-square bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                        <img 
                          src={review.images && review.images.length > 0 ? review.images[0] : 'https://placehold.co/600x600?text=No+Image'}
                          alt={review.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                          <h3 className="text-md font-normal opacity-90">{review.brand}</h3>
                          <h3 className="text-xl font-medium mb-1">{review.title}</h3>
                        </div>
                        <p className="absolute top-4 bg-white rounded-full px-2 left-4 text-xs text-black/80">{review.category}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Reviews;
