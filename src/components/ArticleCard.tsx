import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export interface Article {
  id: number;
  title: string;
  category: string;
  images: string[];
}

interface ArticleCardProps {
  Article: Article; // Keep as is for backward compatibility
  index?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ Article, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Animation delay based on index for staggered entrance
  const animationDelay = `${index * 0.1}s`;

  return (
    <div 
      className="Article-card group bg-white"
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Article image container */}
      <div className="relative overflow-hidden aspect-[4/5]">
        {/* Article image */}
        <img 
          src={Article.images && Article.images.length > 0 ? Article.images[1] : 'https://placehold.co/600x800?text=No+Image'}
          alt={Article.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick actions overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/5 flex items-center justify-center gap-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white shadow-sm hover:bg-white/90 transition-transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          
          <Link to={`/articles/${Article.id}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white shadow-sm hover:bg-white/90 transition-transform hover:scale-105"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className={cn(
              "rounded-full transition-transform hover:scale-105",
              isFavorite ? "bg-red-50 text-red-500" : "bg-white hover:bg-white/90"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
          </Button>
        </div>
        
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 text-xs bg-white/90 backdrop-blur-sm rounded">
            {Article.category}
          </span>
        </div>
      </div>
      
      {/* Article details */}
      <div className="p-4">
        <Link to={`/articles/${Article.id}`}>
          <h3 className="font-medium text-md hover:text-primary transition-colors">
            {Article.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {Article.category}
        </p>
      </div>
    </div>
  );
};

export default ArticleCard;
