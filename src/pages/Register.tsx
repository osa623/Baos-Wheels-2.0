import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

//importing videos
import video1 from '@/assets/Videos/video1.mp4';
import video2 from '@/assets/Videos/video2.mp4';

//importing images
import logo from '@/assets/RoundPhoto_Sep202021_165616.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signInWithGoogle } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted", { name, email });
    
    // Reset errors
    setErrors({});
    
    // Validate form
    let isValid = true;
    const newErrors: FormErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      console.log("Attempting to create user account");
      // Use Firebase authentication to create a new user
      await signUp(email, password, name);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created! You can now log in.",
        duration: 5000,
      });
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different Firebase auth error codes
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered. Please sign in instead.' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email format' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak. Use at least 6 characters.' });
      } else if (error.code === 'auth/network-request-failed') {
        toast({
          title: "Network error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message || "An unexpected error occurred. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google signup handler
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      
      toast({
        title: "Account created",
        description: "Welcome to Baoswheels!",
        duration: 3000,
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Google signup error:", error);
      
      toast({
        title: "Google signup failed",
        description: error.message || "An error occurred during Google signup. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-20 ">
        
        
        <div className='absolute  z-20 overflow-hidden w-full h-screen'>
          <video autoPlay loop muted className='w-full h-full blur-sm  object-cover'>
            <source src={video2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

        </div>
        
        <div className="relative w-[70%] z-20 mt-12 mx-auto bg-transparent rounded-xl overflow-hidden shadow-sm border animate-fade-in">
          
          
         <div className='flex w-full bg-transparent overflow-hidden h-[40rem]  justify-items items-center'>

            {/* Art Section */}
            <div className="w-[50%] h-[40rem] relative sm:p-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-l-xl"></div>
            {/* You can add any art or illustration here */}

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <img src={logo} alt="Baoswheels Logo" className="w-80 h-80 mb-4 rounded-full shadow-lg" />             
            </div>
            </div>

            {/* Register Page */}
            <div className="p-6 w-[50%] bg-white sm:p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold mb-2">Create an Account</h1>
                <p className="text-muted-foreground text-sm">
                  Join Baoswheels and discover our automotive insights
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`rounded-md ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`rounded-md ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`rounded-md pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`rounded-md pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 pt-1">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms} 
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      className={errors.terms ? 'border-red-500' : ''}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the 
                        <Link to="/terms" className="text-primary hover:underline mx-1">
                          Terms of Service
                        </Link>
                        and
                        <Link to="/privacy" className="text-primary hover:underline ml-1">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-red-500">{errors.terms}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full rounded-md button-hover mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                            {/* Social Signup */}
              <div className="mt-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                </div>
              </div>
              </form>
              
            </div>


        </div>   
          
         
        </div>
        

      </div>

      <div className='z-50'>
        <Footer />
      </div>

    </div>  
  );
};

export default Register;
