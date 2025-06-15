import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { searchApi, SearchResult } from '@/api';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();

  // Check URL for search parameters on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await searchApi.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render search result based on type
  const renderSearchResult = (result: SearchResult) => {
    const imageSrc = result.images && result.images.length > 0 
      ? result.images[0] 
      : 'https://placehold.co/600x400?text=No+Image';

    // Create a safe content preview by checking type and removing HTML tags if it's a string
    const contentPreview = typeof result.content === 'string' 
      ? result.content.replace(/<[^>]*>/g, '') 
      : result.description || '';

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
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">{result.title}</h3>
          
          {contentPreview && (
            <p className="text-sm line-clamp-2 text-gray-700 mb-3 flex-1">
              {contentPreview}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
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
          <div className="flex gap-2">
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
                <h2 className="text-xl font-medium mb-4">
                  Found {results.length} results for "{searchQuery}"
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(renderSearchResult)}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  We couldn't find any items matching "{searchQuery}"
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
