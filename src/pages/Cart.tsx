
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Mock cart items
const initialCartItems = [
  {
    id: 1,
    name: "Minimalist Ceramic Vase",
    price: 79.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    color: "White",
    size: "Medium"
  },
  {
    id: 3,
    name: "Wooden Side Table",
    price: 249,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
    color: "Natural",
    size: "Standard"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { toast } = useToast();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = promoApplied ? discountAmount : 0;
  const total = subtotal + shipping - discount;
  
  // Update item quantity
  const updateQuantity = (id: number, amount: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };
  
  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
      duration: 3000,
    });
  };
  
  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME20') {
      const discount = subtotal * 0.2;
      setDiscountAmount(discount);
      setPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "20% discount has been applied to your order",
        duration: 3000,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Animation for cart items
  useEffect(() => {
    const cartItemElements = document.querySelectorAll('.cart-item');
    cartItemElements.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-fade-in');
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground">Cart</span>
            </div>
          </div>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="grid grid-cols-12 text-sm font-medium">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                  </div>
                  
                  {/* Cart Items */}
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="cart-item opacity-0 p-4 grid grid-cols-12 items-center"
                      >
                        {/* Product */}
                        <div className="col-span-6 flex items-center">
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              Color: {item.color}, Size: {item.size}
                            </p>
                            <button 
                              className="text-xs text-red-500 flex items-center hover:underline"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="col-span-2 text-center text-sm">
                          ${item.price.toFixed(2)}
                        </div>
                        
                        {/* Quantity */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex border rounded-md w-24">
                            <button 
                              className="flex items-center justify-center w-8 h-8 border-r text-muted-foreground hover:bg-secondary transition-colors"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <div className="flex items-center justify-center w-8 text-sm">
                              {item.quantity}
                            </div>
                            <button 
                              className="flex items-center justify-center w-8 h-8 border-l text-muted-foreground hover:bg-secondary transition-colors"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="col-span-2 text-right font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link to="/products">
                    <Button variant="outline" className="rounded-md">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border p-6 sticky top-24">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (20%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-3" />
                    <div className="flex justify-between font-medium text-base">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-2">Promo Code</p>
                    <div className="flex gap-2">
                      <Input 
                        type="text" 
                        placeholder="Enter code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="rounded-md"
                        disabled={promoApplied}
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyPromoCode}
                        disabled={!promoCode || promoApplied}
                        className="rounded-md button-hover"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-green-600 mt-1">
                        20% discount applied!
                      </p>
                    )}
                    {!promoApplied && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Try code: WELCOME20
                      </p>
                    )}
                  </div>
                  
                  {/* Checkout Button */}
                  <Button className="w-full rounded-md button-hover">
                    Proceed to Checkout
                  </Button>
                  
                  {/* Shipping info */}
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free shipping on orders over $50. <br />
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <svg 
                className="w-24 h-24 text-muted-foreground mb-6" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Looks like you haven't added anything to your cart yet. Explore our products and find something you love.
              </p>
              <Link to="/products">
                <Button className="rounded-md button-hover">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
