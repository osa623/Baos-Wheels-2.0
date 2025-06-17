import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postComment } from '../api/commentApi';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getUserInitials = (displayName: string): string => {
  if (!displayName) return 'U';

  const names = displayName.trim().split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
};

const CommentForm = ({ reviewId }: { reviewId: string }) => {
  const { currentUser } = useAuth(); // Using your AuthContext
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    if (!currentUser) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to comment',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await postComment(reviewId, content, {
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        photoURL: currentUser.photoURL,
      });

      setContent('');
      toast({
        title: 'Comment posted',
        description: 'Your comment has been added successfully',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="mt-8 p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
          Join the conversation
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Sign in to share your thoughts and connect with others.
        </p>
        <div className="flex justify-center space-x-3">
          <Link to="/login">
          <Button
            variant="default"
            className="px-5 bg-gray-600 hover:bg-gray-700"
          >
            Log In
          </Button>
          </Link>
          <Link to="/register">
          <Button
            variant="outline"
            className="px-5 border-gray-300 dark:border-gray-700"
          >
            Register
          </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
        Add a Comment
      </h3>
      <div className="flex items-start gap-4">
        <Avatar className="h-8 w-8 mt-1 border-2 border-slate-50 dark:border-slate-700 shadow-sm">
          <AvatarImage src={currentUser.photoURL || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gary-600 text-white text-xs">
            {currentUser.displayName
              ? getUserInitials(currentUser.displayName)
              : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            className="w-full mb-3 resize-none border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-gray-800 hover:bg-gray-900 transition-colors px-5"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
