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
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Electriccars from "./pages/Electriccars";
import NotFound from "./pages/NotFound";
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfServices from './pages/TermsOfServices';
import AddPost from './pages/AddPost';
import ReviewsSin from './pages-sin/ReviewsSin';
import ReviewViewSin from './pages-sin/ReviewViewSin';
import ArticlesSin from './pages-sin/ArticlesSin';
import ArticleViewSin from './pages-sin/ArticleViewSin';
import AboutSin from './pages-sin/AboutSin';
import LoginSin from './pages-sin/LoginSin';
import RegisterSin from './pages-sin/RegisterSin';
import AddPostSin from './pages-sin/AddPostSin';
import SearchSin from './pages-sin/SearchSin';
import PrivacyPolicySin from './pages-sin/PrivacyPolicySin';
import ElectriccarsSin from './pages-sin/ElectriccarsSin';
import IndexSin from './pages-sin/IndexSin';
import NotificationsSin from './pages-sin/NotificationsSin';
import ProfileSin from './pages-sin/ProfileSin';

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
          <ScrollToTop />
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<IndexSin />} />

              //English Routes
              <Route path="/reviews" element={<ReviewsSin />} />
              <Route path="/reviews/:id" element={<ReviewViewSin />} />
              <Route path="/articles" element={<ArticlesSin />} />
              <Route path="/articles/:id" element={<ArticleViewSin />} />
              <Route path="/notifications" element={<NotificationsSin />} />
              <Route path="/about" element={<AboutSin />} />
              <Route path="/login" element={<LoginSin />} />
              <Route path="/register" element={<RegisterSin />} />
              <Route path="/search" element={<SearchSin />} />
              <Route path="/electric" element={<ElectriccarsSin />} />
              <Route path="/privacypolicy" element={<PrivacyPolicySin />} />
              <Route path="/termsofservices" element={<TermsOfServices />} />
              <Route path="/profile" element={<ProfileSin />} />


              //Sinhala Routes
              <Route path="/reviewsSin" element={<ReviewsSin />} />
              <Route path="/reviewsSin/:id" element={<ReviewViewSin />} />
              <Route path="/articlesSin" element={<ArticlesSin />} />
              <Route path="/articlesSin/:id" element={<ArticleViewSin />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/aboutSin" element={<AboutSin />} />
              <Route path="/loginSin" element={<LoginSin />} />
              <Route path="/registerSin" element={<RegisterSin />} />
              <Route path='/addpost' element={<AddPostSin/>} />
              <Route path="/searchSin" element={<SearchSin />} />
              <Route path="/electricSin" element={<ElectriccarsSin />} />
              <Route path="/privacypolicySin" element={<PrivacyPolicySin />} />
              <Route path="/termsofservices" element={<TermsOfServices />} />
              <Route path="/profile" element={<Profile />} />



              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
          <ScrollToTop />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
