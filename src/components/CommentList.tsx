import React, { useEffect, useState } from 'react';
import { fetchCommentsByReview } from '../api/commentApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface CommentType {
  id: string;
  userId: string;
  displayName: string;
  content: string;
  timestamp: string;
  userAvatar?: string;
}

const CommentList = ({ reviewId }: { reviewId: string }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      if (!reviewId) return;
      
      setLoading(true);
      try {
        const data = await fetchCommentsByReview(reviewId);
        setComments(data);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadComments();
  }, [reviewId]);

  // Get user's initials for avatar
  const getUserInitials = (displayName: string): string => {
    if (!displayName) return 'UN'; // Unknown
    
    const names = displayName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback>{getUserInitials(comment.displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{comment.displayName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
