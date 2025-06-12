import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Import pages
import Index from "./pages/Index";
import ReviewView from "./pages/ReviewView";
import Reviews from "./pages/Reviews";
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Electriccars from "./pages/Electriccars";
import NotFound from "./pages/NotFound";
import Profile from './pages/Profile';
import Community from './pages/Community';
import Notifications from './pages/Notifications';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/:id" element={<ReviewView />} />
              <Route path="/products" element={<Navigate to="/reviews" replace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/community" element={<Community />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/electric" element={<Electriccars />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
