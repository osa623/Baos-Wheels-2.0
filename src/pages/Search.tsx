import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { searchApi, SearchResult } from '@/api';
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
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!text || !searchTerm) return text;
    
    // Escape special characters in the search term
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Split the search term into words
    const words = escapedSearchTerm
      .split(/\s+/)
      .filter(word => word.length > 2) // Only highlight words with 3+ characters
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    if (words.length === 0) return text;
    
    // Create a regex to find any of the words
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    
    // Split by the regex matches
    const parts = text.split(regex);
    
    // Combine with highlighting
    return parts.map((part, i) => {
      // Check if this part matches any of the search words
      const isMatch = words.some(word => 
        part.toLowerCase() === word.toLowerCase().replace(/\\/g, '')
      );
      
      return isMatch ? 
        <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
        part;
    });
  };

  const performSearch = async (query: string, type: string = 'all') => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      console.log(`Performing search for: "${query}" with type: ${type}`);
      
      if (type === 'all') {
        // Use simple search for all content types
        const searchResults = await searchApi.search(query);
        console.log('Search results:', searchResults);
        setResults(searchResults);
        setTotalResults(searchResults.length);
      } else {
        // Use advanced search with content type filter
        const advancedResults = await searchApi.advancedSearch({
          query,
          type: type as 'article' | 'news' | 'review' | 'all',
          limit: 30
        });
        setResults(advancedResults.results);
        setTotalResults(advancedResults.total);
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

    // Use the snippet field from SearchResult interface
    const contentPreview = result.snippet || result.description || '';

    // Define type-based styling
    const typeColorMap: Record<string, { bg: string, text: string }> = {
      review: { bg: 'bg-blue-100', text: 'text-blue-700' },
      article: { bg: 'bg-green-100', text: 'text-green-700' },
      news: { bg: 'bg-amber-100', text: 'text-amber-700' }
    };

    const typeStyle = typeColorMap[result.type] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
      <div key={`${result.type}-${result.id}`} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={result.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="flex gap-2">
              <span className={`capitalize font-medium text-xs rounded-full px-3 py-1 ${typeStyle.bg} ${typeStyle.text}`}>
                {result.type}
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
            {result.date && (
              <span className="text-xs text-gray-500">
                {new Date(result.date).toLocaleDateString()}
              </span>
            )}
            <Button
              variant="link" 
              className="p-0 h-auto text-primary hover:text-primary/90"
              onClick={() => {
                let url = '/';
                if (result.type === 'review') url = `/reviews/${result.id}`;
                else if (result.type === 'news') url = `/news/${result.id}`;
                else if (result.type === 'article') url = `/articles/${result.id}`;
                window.location.href = url;
              }}
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
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
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
              
              <Button type="submit" disabled={isLoading}>
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
                  <h2 className="text-xl font-medium">
                    Found {totalResults} results for "{searchQuery}"
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full max-w-[300px]">
                    <AccordionItem value="filters">
                      <AccordionTrigger className="text-sm py-2">
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced Filters
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 py-2">
                          {/* Add more filter options here if needed */}
                          <p className="text-xs text-muted-foreground">
                            More filter options will be available in a future update.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
