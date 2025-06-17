import axios from 'axios';
import { Article } from '@/components/ArticleCard';

// Base URL settings
const API_BASE_URL = import.meta.env.API_BASE_URL;

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

// news interface
export interface News {
  _id?: string;
  id: number | string;
  title: string;
  subtitle: string;
  keywords: string[];
  images: string[];
  content: string;
  author: string;
  date: string;
  category: string;

}

// article interface
export interface Article {
  _id?: string;             
  id: number | string;     
  title: string;
  category: string;
  summary: string;
  subtitle: string[];
  description: string[];
  images?: string[];
  author?: string;
  date?: string;  
}

// Search result interface - represents any searchable content
export interface SearchResult {
  id: string | number;
  _id?: string;
  title: string;
  type: 'article' | 'news' | 'review';  // Content type
  category: string;
  date?: string;
  images?: string[];
  description?: string;
  snippet?: string;  // Brief excerpt showing the search match
  author?: string;
  relevanceScore?: number;  // Optional score for sorting results
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
  getById: async (id: number | string): Promise<Article> => {
    try {
      console.log("API calling getById with ID:", id);
      
      // Check if this is a MongoDB ObjectId (24-character hex string)
      const idParam = typeof id === 'string' && id.length === 24 ? id : `${id}`;
      
      // Fix: Use the correct endpoint - "article" instead of "articles"
      const endpoint = `/api/article/get/${idParam}`;
      console.log("API endpoint:", endpoint);
      
      const response = await axios.get(getApiUrl(endpoint));
      console.log("API response for article:", response.data);

      if (!response.data) {
        throw new Error("Empty response from API");
      }
      
      // Handle MongoDB style document with _id field
      const articleData = response.data;
      if (articleData._id && !articleData.id) {
        articleData.id = articleData._id;
      }

      return articleData;
    } catch (error: any) {
      console.error(`Error fetching article ${id}:`, error);

      // adding a mock data value if the article does not exist
      if (import.meta.env.DEV) {
        console.log("Providing mock article data in development");
        
        // Provide mock data with the right interface structure
        return {
          _id: id.toString(),
          id: id,
          title: `Sample Article ${id}`,
          category: "Automotive",
          summary: "This is a sample article summary",
          subtitle: ["First subtitle", "Second subtitle"],
          description: ["This is the first paragraph of the description.", "This is the second paragraph."],
          images: [
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1974",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1974"
          ],
          author: "Auto Enthusiast",
          date: new Date().toISOString().split('T')[0]
        };
      }
      
      throw {
        message: `Failed to fetch article ${id}`,
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  }
};

// News Apis
export const newsApi = {

  // Get all news
  getAll: async (): Promise<News[]> => {
    try {
      const response = await axios.get(getApiUrl('/api/news/get'));
      if (Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error('Unexpected API response format');
    } catch (error: any) {
      console.error('Error fetching news articles:', error);

      // Return fallback data during development
      if (import.meta.env.DEV) {
        return [
          // You can add mock news data here if needed
        ];
      }

      throw {
        message: 'Failed to fetch news articles',
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  },

  // Get news by ID
  getById: async (id: number | string): Promise<News> => {
    try {
      const idParam = typeof id === 'string' && id.length === 24 ? id : `${id}`;
      const response = await axios.get(getApiUrl(`/api/news/get/${idParam}`));
      if (!response.data) {
        throw new Error("Empty response from API");
      }
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching news article ${id}:`, error);
      throw {
        message: `Failed to fetch news article ${id}`,
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  },

  // Get latest news (fetches the most recent news article)
  getLatest: async (): Promise<News | null> => {
    try {
      const response = await axios.get(getApiUrl('/api/news/get'));
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Assuming news are sorted by date descending, otherwise sort here
        const sorted = response.data.sort((a: News, b: News) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sorted[0];
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching latest news:', error);

      // Return fallback data during development
      if (import.meta.env.DEV) {
        return null;
      }

      throw {
        message: 'Failed to fetch latest news',
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

// Search API
export const searchApi = {
  // Search across all content types
  search: async (query: string): Promise<SearchResult[]> => {
    try {
      if (!query || query.trim() === '') {
        return [];
      }

      console.log('Searching for:', query);
      const sanitizedQuery = encodeURIComponent(query.trim());
      const response = await axios.get(getApiUrl(`/search?q=${sanitizedQuery}`));
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error('Unexpected API response format');
    } catch (error: any) {
      console.error('Error searching content:', error);
      
      // Return fallback data during development
      if (import.meta.env.DEV) {
        console.log('API: Providing mock search results in development for query:', query);
        
        // First get all content to search through
        let allContent: SearchResult[] = [];
        
        // Collect reviews
        try {
          const reviews = await reviewsApi.getAll();
          reviews.forEach(review => {
            allContent.push({
              id: review.id,
              _id: review._id,
              title: review.title,
              type: 'review',
              category: review.category,
              date: review.date,
              images: review.images,
              description: review.description,
              snippet: createSnippet([
                review.title,
                review.description,
                review.overview,
                review.exterior,
                review.interior,
                review.performance,
                review.safety
              ], query),
              author: review.author,
              relevanceScore: calculateRelevance(review, query)
            });
          });
        } catch (e) {
          console.error('Error getting reviews for search:', e);
        }
        
        // Mock articles data for search
        const mockArticles = [
          {
            id: "article-1",
            title: "The Future of Electric Vehicles in 2024",
            category: "Technology",
            content: "Electric vehicles are rapidly evolving with new battery technologies extending range beyond 400 miles per charge. Tesla, Ford, and Volkswagen are leading the charge with innovative designs that combine performance with sustainability. The latest models feature enhanced autonomous driving capabilities and integrated renewable energy solutions.",
            images: ["https://placehold.co/600x400?text=Electric+Car"],
            author: "Jane Smith",
            date: "2023-11-15"
          },
          {
            id: "article-2",
            title: "Top 10 Family SUVs for 2024",
            category: "Buyer's Guide",
            content: "Family SUVs continue to dominate the market with spacious interiors and advanced safety features. The Toyota Highlander, Honda Pilot, and Kia Telluride top our list with excellent crash test ratings and fuel economy. New models feature enhanced entertainment systems and configurable seating arrangements to accommodate growing families.",
            images: ["https://placehold.co/600x400?text=Family+SUV"],
            author: "David Wilson",
            date: "2023-12-03"  
          }
        ];
        
        // Add articles to search content
        mockArticles.forEach(article => {
          allContent.push({
            id: article.id,
            title: article.title,
            type: 'article',
            category: article.category,
            date: article.date,
            images: article.images,
            snippet: createSnippet([article.title, article.content], query),
            author: article.author,
            relevanceScore: calculateRelevanceSimple(article.title + " " + article.content + " " + article.category, query)
          });
        });
        
        // Mock news data for search
        const mockNews = [
          {
            id: "news-1",
            title: "BMW Unveils Revolutionary Hydrogen-Powered Concept",
            category: "Industry News",
            content: "BMW has revealed a groundbreaking hydrogen fuel cell concept vehicle that promises 500 miles of range with refueling times under 5 minutes. The concept features a sleek aerodynamic design with sustainable materials throughout the cabin. BMW plans to begin production within the next three years, positioning the vehicle as a premium alternative to battery electric vehicles.",
            images: ["https://placehold.co/600x400?text=BMW+Concept"],
            author: "Michael Chang",
            date: "2023-12-01"
          },
          {
            id: "news-2",
            title: "Ford F-150 Lightning Sets New Sales Record",
            category: "Market Trends",
            content: "The Ford F-150 Lightning has become the best-selling electric truck in North America, surpassing 100,000 units sold in 2023. Fleet customers account for nearly 40% of sales, citing lower operating costs and maintenance requirements. Ford has announced plans to expand production capacity by 50% to meet growing demand in both consumer and commercial markets.",
            images: ["https://placehold.co/600x400?text=F150+Lightning"],
            author: "Sarah Johnson",
            date: "2023-11-28"
          }
        ];
        
        // Add news to search content
        mockNews.forEach(news => {
          allContent.push({
            id: news.id,
            title: news.title,
            type: 'news',
            category: news.category,
            date: news.date,
            images: news.images,
            snippet: createSnippet([news.title, news.content], query),
            author: news.author,
            relevanceScore: calculateRelevanceSimple(news.title + " " + news.content + " " + news.category, query)
          });
        });
        
        // Filter content by search query across all fields
        const searchResults = allContent.filter(item => {
          // Create a combined text of all searchable fields
          const searchableText = [
            item.title,
            item.category,
            item.description,
            item.snippet,
            item.author
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          
          // Check if query matches any part of the searchable text
          return searchableText.includes(query.toLowerCase());
        });
        
        // Sort by relevance score
        return searchResults.sort((a, b) => {
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        });
      }
      
      throw {
        message: 'Failed to search content',
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  },
  
  // Advanced search with filters (unchanged)
  advancedSearch: async (params: {
    query: string,
    type?: 'article' | 'news' | 'review' | 'all',
    category?: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: number,
    page?: number
  }): Promise<{results: SearchResult[], total: number, page: number, totalPages: number}> => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params.category) queryParams.append('category', params.category);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      
      const response = await axios.get(getApiUrl(`/api/search/advanced?${queryParams.toString()}`));
      
      if (response.data && Array.isArray(response.data.results)) {
        return response.data;
      }
      
      throw new Error('Unexpected API response format');
    } catch (error: any) {
      console.error('Error performing advanced search:', error);
      
      // Return fallback data during development
      if (import.meta.env.DEV) {
        // Use the same approach as the basic search but with filtering
        const basicResults = await searchApi.search(params.query);
        
        // Apply type filter if specified
        let filteredResults = params.type && params.type !== 'all' 
          ? basicResults.filter(item => item.type === params.type)
          : basicResults;
        
        // Apply category filter if specified
        if (params.category) {
          filteredResults = filteredResults.filter(item => 
            item.category.toLowerCase() === params.category?.toLowerCase()
          );
        }
        
        // Apply date filters if specified
        if (params.dateFrom || params.dateTo) {
          filteredResults = filteredResults.filter(item => {
            if (!item.date) return false;
            
            const itemDate = new Date(item.date).getTime();
            const fromDate = params.dateFrom ? new Date(params.dateFrom).getTime() : 0;
            const toDate = params.dateTo ? new Date(params.dateTo).getTime() : Infinity;
            
            return itemDate >= fromDate && itemDate <= toDate;
          });
        }
        
        // Calculate pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const total = filteredResults.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
          results: filteredResults.slice(startIndex, endIndex),
          total,
          page,
          totalPages
        };
      }
      
      throw {
        message: 'Failed to perform advanced search',
        status: error.response?.status,
        details: error.message
      } as ApiError;
    }
  }
};


// Create a snippet from content that highlights the search term
function createSnippet(contentParts: (string | undefined)[], query: string): string {
  if (!query) return '';
  
  // Join all content parts, filter out undefined, and convert HTML to plain text
  const fullContent = contentParts
    .filter(Boolean)
    .join(' ')
    .replace(/<[^>]*>/g, '');
  
  // If no content, return empty string
  if (!fullContent) return '';
  
  const lowerQuery = query.toLowerCase();
  const lowerContent = fullContent.toLowerCase();
  
  // Find position of the query in the content
  const position = lowerContent.indexOf(lowerQuery);
  
  if (position === -1) {
    // If query not found as-is, look for any words from the query
    const queryWords = lowerQuery.split(/\s+/).filter(Boolean);
    for (const word of queryWords) {
      if (word.length < 3) continue; // Skip very short words
      
      const wordPos = lowerContent.indexOf(word);
      if (wordPos !== -1) {
        // Create snippet around the first matching word
        const start = Math.max(0, wordPos - 40);
        const end = Math.min(fullContent.length, wordPos + word.length + 60);
        return (start > 0 ? '...' : '') + 
               fullContent.substring(start, end).trim() + 
               (end < fullContent.length ? '...' : '');
      }
    }
    
    // If still no match, return the first part of the content
    return fullContent.substring(0, 100) + (fullContent.length > 100 ? '...' : '');
  }
  
  // Create snippet with some context around the query
  const start = Math.max(0, position - 40);
  const end = Math.min(fullContent.length, position + query.length + 60);
  
  return (start > 0 ? '...' : '') + 
         fullContent.substring(start, end).trim() + 
         (end < fullContent.length ? '...' : '');
}

// Calculate relevance score for a review with multiple possible content fields
function calculateRelevance(review: any, query: string): number {
  if (!query) return 0;
  
  const lowerQuery = query.toLowerCase();
  let score = 0;
  
  // Check title (highest importance)
  if (review.title && review.title.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }
  
  // Check category and brand
  if (review.category && review.category.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }
  if (review.brand && review.brand.toLowerCase().includes(lowerQuery)) {
    score += 4;
  }
  
  // Check various content fields
  const contentFields = [
    'description', 'overview', 'exterior', 
    'interior', 'performance', 'safety'
  ];
  
  for (const field of contentFields) {
    if (review[field] && review[field].toLowerCase().includes(lowerQuery)) {
      score += 2;
    }
  }
  
  return score;
}

// Simpler relevance calculation for basic text content
function calculateRelevanceSimple(content: string, query: string): number {
  if (!query || !content) return 0;
  
  const lowerQuery = query.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  // Basic relevance: how many times the query appears
  const occurrences = countOccurrences(lowerContent, lowerQuery);
  
  // Title match is worth more
  const titleBoost = content.substring(0, 100).toLowerCase().includes(lowerQuery) ? 3 : 0;
  
  return occurrences + titleBoost;
}

// Count occurrences of a substring in a string
function countOccurrences(text: string, subtext: string): number {
  if (!subtext) return 0;
  let count = 0;
  let position = text.indexOf(subtext);
  
  while (position !== -1) {
    count++;
    position = text.indexOf(subtext, position + 1);
  }
  
  return count;
}

// Export all API modules
export default {
  articles: articlesApi,
  reviews: reviewsApi,
  news: newsApi,
  search: searchApi
};