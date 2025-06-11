import axios from 'axios';
import { Article } from '@/components/ArticleCard';

// Base URL settings
const API_BASE_URL = "https://baosbackend-9f8439698e78.herokuapp.com";

// Helper to handle API URLs and CORS proxying
const getApiUrl = (endpoint: string) => {
  const apiUrl = `${API_BASE_URL}${endpoint}`;
  // Use proxy in development to avoid CORS issues
  return import.meta.env.DEV ? endpoint : apiUrl;
};

// Reviews interface
export interface Review {
  _id?: string;             // Add MongoDB style _id field
  id: number | string;      // Keep existing id field for compatibility
  title: string;
  date : string;
  category: string;
  brand?: string;
  description?: string;
  images: string[];
  count?: number;
  rating?: number;
  ratingText?: string;
  author?: string;
  publishDate?: string;
  readTime?: number;
  engine: string;
  drivetrain?: string;
  fuelEconomy?: string;
  seatingCapacity: number;
  transmission?: string;
  singleprice? : string;
  overview?: string;
  exterior?: string;
  interior?: string;
  performance?: string;
  safety?: string;
  specs?: {
    [key: string]: string | number;
  };
  pros?: string[];
  cons?: string[];
}

// Type for API error responses
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Articles API
export const articlesApi = {
  // Get all articles
  getAll: async (): Promise<Article[]> => {
    try {
      const response = await axios.get(getApiUrl('/api/article/get'));
      if (Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error('Unexpected API response format');
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      
      // Return fallback data during development
      if (import.meta.env.DEV) {
        return [
          { 
            id: 1, 
            title: "Sample Article 1", 
            category: "News", 
            images: ["https://placehold.co/600x800?text=Sample+1"] 
          },
          { 
            id: 2, 
            title: "Sample Article 2", 
            category: "Review", 
            images: ["https://placehold.co/600x800?text=Sample+2"] 
          },
          { 
            id: 3, 
            title: "Sample Article 3", 
            category: "Review", 
            images: ["https://placehold.co/600x800?text=Sample+3"] 
          },
          { 
            id: 4, 
            title: "Sample Article 4", 
            category: "News", 
            images: ["https://placehold.co/600x800?text=Sample+4"] 
          }
        ];
      }
      
      throw {
        message: 'Failed to fetch articles',
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  },
  
  // Get article by ID
  getById: async (id: number): Promise<Article> => {
    try {
      const response = await axios.get(getApiUrl(`/api/article/get/${id}`));
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching article ${id}:`, error);
      throw {
        message: `Failed to fetch article ${id}`,
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  }
};

// Reviews API
export const reviewsApi = {
  // Get all reviews
  getAll: async (): Promise<Review[]> => {
    try {
      console.log('API: Calling getAll reviews endpoint');
      const response = await axios.get(getApiUrl('/api/reviews/get'));
      console.log('API: Reviews response data:', response.data);
      
      if (Array.isArray(response.data)) {
        // Process the reviews to ensure consistent ID field
        const processedReviews = response.data.map(review => {
          // If the review has _id but no id, set id to _id
          if (review._id && !review.id) {
            review.id = review._id;
          }
          return review;
        });
        
        return processedReviews;
      }
      
      throw new Error('Unexpected API response format');
    } catch (error: any) {
      console.error('Error fetching reviews:', error);

      // Return fallback data during development
      if (import.meta.env.DEV) {
        console.log('API: Providing mock reviews in development');
        return [
          { 
            id: 1, 
            _id: "1",
            title: "BMW X5 Review", 
            brand: "BMW",
            category: "SUV",
            date: "2023-05-15",
            engine: "3.0L Twin-Turbo",
            drivetrain: "AWD",
            fuelEconomy: "21/26 mpg",
            seatingCapacity: 5,
            transmission: "8-Speed Automatic",
            singleprice: "$65,000",
            images: ["https://images.unsplash.com/photo-1622095136787-90f2755962e2?auto=format&fit=crop&q=80&w=1974"],
            count: 12
          },
          { 
            id: 2,
            _id: "2",
            title: "Tesla Model 3 Review", 
            brand: "Tesla",
            category: "electric",
            date: "2023-06-22", 
            engine: "Dual Motor Electric",
            drivetrain: "AWD",
            fuelEconomy: "131/120 MPGe",
            seatingCapacity: 5,
            transmission: "Single-Speed",
            singleprice: "$45,990",
            images: ["https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=1974"],
            count: 18
          },
          { 
            id: 3,
            _id: "3", 
            title: "Toyota Camry Review",
            brand: "Toyota", 
            category: "sedan",
            date: "2023-07-10", 
            engine: "2.5L 4-Cylinder",
            drivetrain: "FWD",
            fuelEconomy: "28/39 mpg",
            seatingCapacity: 5,
            transmission: "8-Speed Automatic",
            singleprice: "$26,420",
            images: ["https://images.unsplash.com/photo-1616634375264-2d2e17736a36?auto=format&fit=crop&q=80&w=1974"],
            count: 24
          },
          { 
            id: 4,
            _id: "4", 
            title: "Ford Mustang GT Review", 
            brand: "Ford",
            category: "sports",
            date: "2023-08-05", 
            engine: "5.0L V8",
            drivetrain: "RWD",
            fuelEconomy: "15/24 mpg",
            seatingCapacity: 4,
            transmission: "6-Speed Manual",
            singleprice: "$37,945",
            images: ["https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?auto=format&fit=crop&q=80&w=1974"],
            count: 15
          }
        ];
      }
      
      throw {
        message: 'Failed to fetch reviews',
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  },
  
  // Get review by ID
  getById: async (id: number | string): Promise<Review> => {
    try {
      console.log("API calling getById with ID:", id);
      
      // Check if this is a MongoDB ObjectId (24-character hex string)
      const idParam = typeof id === 'string' && id.length === 24 ? id : `${id}`;
      
      // Use the appropriate endpoint based on the ID format
      const endpoint = `/api/reviews/get/${idParam}`;
      console.log("API endpoint:", endpoint);
      
      const response = await axios.get(getApiUrl(endpoint));
      console.log("API response for review:", response.data);
      
      if (!response.data) {
        throw new Error("Empty response from API");
      }
      
      // Handle MongoDB style document with _id field
      const reviewData = response.data;
      if (reviewData._id && !reviewData.id) {
        reviewData.id = reviewData._id;
      }
      
      return reviewData;
    } catch (error: any) {
      console.error(`Error fetching review ${id}:`, error);
      
      // adding a mock data value if the review does not exist
      if (import.meta.env.DEV) {
        console.log("Providing mock review data in development");
        
        // Create a mock review with the requested ID
        const mockReview: Review = {
          id: id,
          title: `Test Review ${id}`,
          brand: "Test Brand",
          category: "Test Category",
          description: "<p>This is a detailed description of the test review item. It includes <strong>formatted text</strong> and multiple paragraphs.</p><p>Second paragraph with more details about the review.</p>",
          images: [
            "https://images.unsplash.com/photo-1622095136787-90f2755962e2?auto=format&fit=crop&q=80&w=1974",
            "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=1974",
            "https://images.unsplash.com/photo-1616634375264-2d2e17736a36?auto=format&fit=crop&q=80&w=1974"
          ],
          rating: 4.5,
          ratingText: "Excellent vehicle with great performance",
          author: "Test Author",
          publishDate: new Date().toISOString(),
          readTime: 5
        };
        
        return mockReview;
      }
      
      throw {
        message: `Failed to fetch review ${id}`,
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  }
};

// Export all API modules
export default {
  articles: articlesApi,
  reviews: reviewsApi
  // Add more API modules here as needed
};