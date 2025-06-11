
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  Shield, 
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mock data for single product
const product = {
  id: 1,
  name: "Minimalist Ceramic Vase",
  price: 79.99,
  originalPrice: 99.99,
  rating: 4.8,
  reviewCount: 124,
  description: "An elegantly crafted ceramic vase with a minimalist design that complements any interior style. The smooth matte finish and organic shape create a subtle statement piece that's perfect for displaying fresh flowers or standing alone as a sculptural element.",
  images: [
    "https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1632114941807-5be62fc6aca8?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1598113571553-05e3278cc92c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
  ],
  colors: [
    { name: "White", value: "#FFFFFF", border: true },
    { name: "Black", value: "#222222" },
    { name: "Terracotta", value: "#BF6F4A" }
  ],
  sizes: [
    { name: "Small", dimensions: "H: 15cm, W: 10cm" },
    { name: "Medium", dimensions: "H: 20cm, W: 15cm" },
    { name: "Large", dimensions: "H: 30cm, W: 20cm" }
  ],
  inStock: true,
  details: [
    "Made from premium ceramic",
    "Matte finish",
    "Handcrafted in small batches",
    "Water-resistant interior",
    "Sustainable production methods"
  ],
  category: "Decor",
  tags: ["vase", "ceramic", "minimalist", "home decor"]
};

// Mock data for related products
const relatedProducts: Product[] = [
  {
    id: 2,
    name: "Ceramic Coffee Set",
    price: 89,
    image: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    category: "Tableware"
  },
  {
    id: 5,
    name: "Porcelain Bowl Set",
    price: 65,
    image: "https://images.unsplash.com/photo-1603470452845-4fa675811194?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    category: "Decor"
  },
  {
    id: 9,
    name: "Marble Candle Holder",
    price: 45,
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    category: "Decor"
  },
  {
    id: 10,
    name: "Concrete Planter",
    price: 39,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    category: "Decor"
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  // Change selected image
  const handleImageChange = (image: string) => {
    setMainImage(image);
  };
  
  // Increase or decrease quantity
  const updateQuantity = (amount: number) => {
    const newValue = quantity + amount;
    if (newValue > 0) {
      setQuantity(newValue);
    }
  };
  
  // Add to cart functionality
  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${selectedColor.name}, ${selectedSize.name})`,
      duration: 3000,
    });
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
      duration: 2000,
    });
  };
  
  // Share product
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Product Details */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg overflow-hidden aspect-square">
                <img 
                  src={mainImage} 
                  alt={product.name}
                  className="w-full h-full object-cover object-center animate-fade-in"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(image)}
                    className={cn(
                      "bg-white rounded-md overflow-hidden aspect-square transition-all",
                      mainImage === image ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} · {product.reviewCount} reviews
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl font-semibold mr-3">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor.name}</span></h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-10 h-10 rounded-full transition-all flex items-center justify-center",
                        selectedColor.name === color.name && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name} color`}
                    >
                      <span 
                        className={cn(
                          "w-8 h-8 rounded-full", 
                          color.border && "border border-gray-200"
                        )}
                        style={{ backgroundColor: color.value }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size: <span className="text-muted-foreground">{selectedSize.name}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={cn(
                        "px-4 py-2 border rounded-md text-sm transition-all",
                        selectedSize.name === size.name 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.name}
                      <span className="text-xs block text-muted-foreground">
                        {size.dimensions}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex border rounded-md">
                  <button 
                    className="flex items-center justify-center w-10 h-10 border-r text-muted-foreground hover:bg-secondary transition-colors"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex items-center justify-center w-14 text-center">
                    {quantity}
                  </div>
                  <button 
                    className="flex items-center justify-center w-10 h-10 border-l text-muted-foreground hover:bg-secondary transition-colors"
                    onClick={() => updateQuantity(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <Button 
                  className="flex-1 rounded-md button-hover"
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className={cn(
                    "rounded-md transition-colors",
                    isFavorite && "text-red-500 border-red-200 bg-red-50"
                  )}
                  onClick={toggleFavorite}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-md transition-colors"
                  onClick={shareProduct}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Product status */}
              <div className="flex items-center text-sm mb-8">
                <div className="flex items-center">
                  {product.inStock ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">In Stock</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>
                <Separator orientation="vertical" className="mx-3 h-4" />
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Free shipping on orders over $50</span>
                </div>
              </div>
              
              {/* USPs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 mb-2 text-primary" />
                  <h4 className="text-sm font-medium">Free Shipping</h4>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <RotateCcw className="h-5 w-5 mb-2 text-primary" />
                  <h4 className="text-sm font-medium">30-Day Returns</h4>
                  <p className="text-xs text-muted-foreground">Hassle-free returns</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 mb-2 text-primary" />
                  <h4 className="text-sm font-medium">2-Year Warranty</h4>
                  <p className="text-xs text-muted-foreground">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="shipping"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {product.description}
                  </p>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="pt-6">
                <div className="divide-y">
                  <div className="grid grid-cols-1 sm:grid-cols-2 py-3">
                    <div className="font-medium">Materials</div>
                    <div className="text-muted-foreground">Premium ceramic</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 py-3">
                    <div className="font-medium">Finish</div>
                    <div className="text-muted-foreground">Matte</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 py-3">
                    <div className="font-medium">Care Instructions</div>
                    <div className="text-muted-foreground">Wipe clean with a damp cloth</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 py-3">
                    <div className="font-medium">Origin</div>
                    <div className="text-muted-foreground">Handcrafted in Portugal</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 py-3">
                    <div className="font-medium">Weight</div>
                    <div className="text-muted-foreground">Small: 0.5kg / Medium: 0.8kg / Large: 1.2kg</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                  <p className="text-muted-foreground mb-6">
                    Reviews are currently being processed. Check back soon!
                  </p>
                  <Button variant="outline">Write a Review</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Shipping</h3>
                    <p className="text-muted-foreground">
                      We offer free standard shipping on all orders over $50. For orders under $50, a flat shipping rate of $5.99 applies. Standard shipping typically takes 3-5 business days, depending on your location.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Returns & Exchanges</h3>
                    <p className="text-muted-foreground">
                      We accept returns within l days of delivery. Items must be in their original condition and packaging. To initiate a return, please contact our customer service team with your order number and reason for return.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">You may also like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <div 
                key={product.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
