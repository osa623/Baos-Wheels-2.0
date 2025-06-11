import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';


//importing videos
import video1 from '@/assets/Videos/video1.mp4';
import video2 from '@/assets/Videos/video2.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signInWithGoogle } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted", { email });
    
    // Reset errors
    setErrors({});
    
    // Validate form
    let isValid = true;
    const newErrors: {email?: string, password?: string} = {};
    
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
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in");
      // Use Firebase authentication to sign in
      await signIn(email, password);
      
      // If remember me is checked, store in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Baoswheels!",
        duration: 3000,
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different Firebase auth error codes with more specific messages
      if (error.code === 'auth/user-not-found') {
        setErrors({ email: 'No account found with this email' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email format' });
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ password: 'Too many failed login attempts. Please try again later or reset your password.' });
      } else if (error.code === 'auth/network-request-failed') {
        toast({
          title: "Network error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "An unexpected error occurred. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      
      toast({
        title: "Login successful",
        description: "Welcome to Baoswheels!",
        duration: 3000,
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Google login error:", error);
      
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during Google login. Please try again.",
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
      
      <div className="pt-20">

       <div className='absolute  z-30 overflow-hidden w-full h-screen'>
          <video autoPlay loop muted className='w-full h-full blur-sm  object-cover'>
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

        </div>

        <div className="relative z-40 max-w-md mt-12 mx-auto bg-white rounded-xl overflow-hidden shadow-sm border animate-fade-in">
          {/* Page header */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">
                Sign in to your account to continue
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
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
              
              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full rounded-md button-hover"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md"
                  onClick={handleGoogleLogin}
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
                  Sign in with Google
                </Button>
              </div>
            </div>
          </div>
          
        </div>
        

      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
