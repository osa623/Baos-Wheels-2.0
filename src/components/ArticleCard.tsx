import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { articlesApi } from '@/api/index'

export interface Article {
  summary: string;
  _id: number;
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
    <div className='relative sm:p7-2 cursor-pointer'>
    <div 
      className="Article-card group rounded-2xl border-2 border-double bg-white"
      style={{ animationDelay, 
        boxShadow: ' 4px 6px rgba(204,255,0, 0.9)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Article image container */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Article image */}
        <img 
          src={Article.images && Article.images.length > 0 ? Article.images[1] : 'https://placehold.co/600x800?text=No+Image'}
          alt={Article.title}
          className="w-full h-[20vh] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick actions overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/5 flex items-center justify-center gap-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >

          
          <Link to={`/articles/${Article._id}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white shadow-sm hover:bg-white/90 transition-transform hover:scale-105"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          
        </div>
        
        {/* Category tag */}
        <div className="absolute top-3 left-3 ">
          <span className="inline-block px-2 border-double border-[#EEF525] border-2 py-1 text-xs bg-white/90 backdrop-blur-sm rounded">
            {Article.category}
          </span>
        </div>
      </div>

      
      

    </div>
    <div className='relative z-10'>
    <div className='absolute w-full mt-3 border-2 border-black bg-[#EEF525] px-4 py-2 z-20'>
      <p className="text-md text-center text-[#1e1d1d]">{Article.title}</p>
    </div>    
    <div className='absolute w-2/3 mt-11 ml-2 border-black border-2 border-dashed bg-transparent py-2 z-10 '/>
    </div>


        <div className='flex mt-16 relative z-10'>

    <div className='absolute w-full mt-3 sm:py-2 border-black bg-transparent z-20'>
      <p className="text-xs text-start line-clamp-3 text-[#1e1d1d]">{Article.summary}</p>
    </div>    
    </div>

    </div>
  );
};

export default ArticleCard;
