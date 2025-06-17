import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Loader2, Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [contentType, setContentType] = useState<string>('all');
  const [totalResults, setTotalResults] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check URL for search parameters on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    const type = queryParams.get('type');
    
    if (query) {
      setSearchQuery(query);
      if (type) setContentType(type);
      performSearch(query, type || 'all');
    }
  }, [location.search]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search parameters
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (contentType !== 'all') params.set('type', contentType);
      navigate(`/search?${params.toString()}`);
      
      performSearch(searchQuery, contentType);
    }
  };

  // Function to highlight the search terms in a text
  const highlightSearchTerm = (text: string | any, searchTerm: string) => {
    // Check if text is not a string (might be JSX or null/undefined)
    if (!text || typeof text !== 'string' || !searchTerm) return text;
    
    // Filter to words with at least 2 characters
    const searchWords = searchTerm
      .split(/\s+/)
      .filter(word => word.length >= 2);
      
    if (searchWords.length === 0) return text;
    
    // Create regex pattern for all search words
    const pattern = searchWords
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special characters
      .join('|');
    
    const regex = new RegExp(`(${pattern})`, 'gi');
    
    // Use replace with callback function to wrap matches in highlight span
    let lastIndex = 0;
    const result = [];
    let match;
    
    // Create a fresh regex for each iteration to reset lastIndex
    const findRegex = new RegExp(regex);
    
    // Find all matches and build result array
    let textCopy = text;
    while ((match = findRegex.exec(textCopy)) !== null) {
      const matchedText = match[0];
      const index = match.index;
      
      // Add text before match
      if (index > lastIndex) {
        result.push(text.substring(lastIndex, index));
      }
      
      // Add highlighted match
      result.push(
        <span key={`highlight-${index}`} className="bg-yellow-200 font-medium">
          {matchedText}
        </span>
      );
      
      lastIndex = index + matchedText.length;
      
      // Avoid infinite loops for zero-width matches
      if (match.index === findRegex.lastIndex) {
        findRegex.lastIndex++;
      }
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length ? result : text;
  };

  const performSearch = async (query: string, type: string = 'all') => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      console.log(`Performing search for: "${query}" with type: ${type}`);
      
      // Build the search URL with query parameters
      let searchUrl = `https://baosbackend-9f8439698e78.herokuapp.com/api/search?q=${encodeURIComponent(query)}`;
      
      // Add content type filter if not "all"
      if (type !== 'all') {
        searchUrl += `&type=${type}`;
      }
      
      console.log("Search URL:", searchUrl);
      
      // Make direct API call to the backend
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Search request failed with status: ${response.status}`);
      }
      
      const searchResults = await response.json();
      console.log('Search results:', searchResults);
      
      // Handle different response formats
      if (Array.isArray(searchResults)) {
        // Handle array response format
        setResults(searchResults);
        setTotalResults(searchResults.length);
      } else if (searchResults.results && Array.isArray(searchResults.results)) {
        // Handle object with results array format
        setResults(searchResults.results);
        setTotalResults(searchResults.total || searchResults.results.length);
      } else if (searchResults.articles || searchResults.news || searchResults.reviews) {
        // Handle the format with separate arrays for different content types
        let combinedResults = [];
        
        // If a specific type is selected, only include that type
        if (type !== 'all') {
          if (type === 'article' && searchResults.articles) {
            combinedResults = searchResults.articles.map(item => ({...item, type: 'article'}));
          } else if (type === 'news' && searchResults.news) {
            combinedResults = searchResults.news.map(item => ({...item, type: 'news'}));
          } else if (type === 'review' && searchResults.reviews) {
            combinedResults = searchResults.reviews.map(item => ({...item, type: 'review'}));
          }
        } else {
          // For 'all', combine all types and ensure each has the correct type property
          if (searchResults.articles) {
            combinedResults = [...combinedResults, 
              ...searchResults.articles.map(item => ({...item, type: 'article'}))
            ];
          }
          if (searchResults.news) {
            combinedResults = [...combinedResults, 
              ...searchResults.news.map(item => ({...item, type: 'news'}))
            ];
          }
          if (searchResults.reviews) {
            combinedResults = [...combinedResults, 
              ...searchResults.reviews.map(item => ({...item, type: 'review'}))
            ];
          }
        }
        
        setResults(combinedResults);
        setTotalResults(searchResults.total || combinedResults.length);
      } else {
        console.error("Unexpected API response format", searchResults);
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    if (searchQuery.trim()) {
      // Update URL with new filter
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (value !== 'all') params.set('type', value);
      navigate(`/search?${params.toString()}`);
      
      performSearch(searchQuery, value);
    }
  };

  // Function to render search result based on type
  const renderSearchResult = (result: SearchResult) => {
    const imageSrc = result.images && result.images.length > 0 
      ? result.images[0] 
      : 'https://placehold.co/600x400?text=No+Image';

    // Use the appropriate content field based on content type
    let contentPreview = '';
    if (result.type === 'review') {
      contentPreview = result.content || result.snippet || result.description || '';
      // Strip HTML tags if present
      contentPreview = contentPreview.replace(/<[^>]*>/g, '');
    } else {
      contentPreview = result.snippet || result.description || '';
    }

    // Make sure result.type exists with a fallback
    // Explicitly normalize the type to ensure consistent casing/format
    let resultType = 'unknown';
    if (result.type) {
      // Convert to lowercase and trim for consistency
      resultType = result.type.toLowerCase().trim();
    }

    // Define type-based styling
    const typeColorMap: Record<string, { bg: string, text: string }> = {
      review: { bg: 'bg-blue-100', text: 'text-blue-700' },
      article: { bg: 'bg-green-100', text: 'text-green-700' },
      news: { bg: 'bg-amber-100', text: 'text-amber-700' }
    };

    const typeStyle = typeColorMap[resultType] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    // Get the appropriate ID for the item (handling different API formats)
    const getItemId = () => {
      // Let's log the entire result object to see what fields are available
      console.log("Result object for navigation:", result);
      
      // MongoDB typically uses _id as the primary key field
      if (result._id) return result._id;
      if (result.id) return result.id;
      
      // Check for type-specific ID fields
      if (result.slug) return result.slug;
      if (result.articleId) return result.articleId;
      if (result.newsId) return result.newsId;
      if (result.reviewId) return result.reviewId;
      
      // Log error if no ID is found
      console.error("No ID found for item:", result);
      return null;
    };

    const itemId = getItemId();

    // Handle navigation with appropriate approach
    const handleNavigation = () => {
      if (!itemId) {
        console.error("Cannot navigate: No ID found for:", result);
        return;
      }
      
      // Ensure we're using the correct type for navigation
      console.log(`Navigation triggered for ${resultType} with ID: ${itemId}`);
      
      // Debug info
      console.log("Result object:", result);
      console.log("Result type:", resultType);
      
      let url = '/';
      
      // Explicitly check the type to ensure correct routing
      if (resultType === 'review') {
        url = `/reviews/${itemId}`;
      } else if (resultType === 'news') {
        url = `/news/${itemId}`;
      } else if (resultType === 'article') {
        url = `/articles/${itemId}`;
      }
      
      console.log("Final navigation URL:", url);
      
      // Use window.location for hard navigation to ensure correct loading
      window.location.href = url;
    };

    return (
      <div key={`${resultType}-${itemId || Math.random()}`} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={result.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="flex gap-2">
              <span className={`capitalize font-medium text-xs rounded-full px-3 py-1 ${typeStyle.bg} ${typeStyle.text}`}>
                {resultType}
              </span>
              {result.category && (
                <span className="capitalize text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {result.category}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {highlightSearchTerm(result.title, searchQuery)}
          </h3>
          
          {contentPreview && (
            <p className="text-sm line-clamp-3 text-gray-700 mb-3 flex-1">
              {highlightSearchTerm(contentPreview, searchQuery)}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <Button
              variant="link" 
              className="p-0 h-auto text-primary hover:text-primary/90"
              onClick={handleNavigation}
            >
              View details
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='relative min-h-screen flex flex-col'>
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24">
        <h1 onClick={() => window.location.href = '/'} className="text-sm cursor-pointer font-normal mb-1 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block text-muted-foreground" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </h1>
        <h1 className="text-3xl font-bold mb-6 ml-5">Search</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for cars, reviews, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={contentType} onValueChange={handleContentTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className='w-full' type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </form>
        
        <Separator className="mb-6" />
        
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="lg:text-xl md:text-xs font-medium">
                    Found {totalResults} results for "{searchQuery}"
                  </h2>

                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(renderSearchResult)}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  We couldn't find any items matching "{searchQuery}"
                  {contentType !== 'all' && ` in ${contentType}s`}
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">Start searching</h2>
              <p className="text-muted-foreground">
                Enter a keyword above to search for cars, reviews, articles, and more
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
