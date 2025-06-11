import React, { useState } from 'react';
import { postComment } from '../api/commentApi';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

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
      <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
        <p className="mb-2">You need to be logged in to comment</p>
        <Button
          variant="default"
          className="mr-2"
          onClick={() => (window.location.href = '/login')}
        >
          Log In
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = '/register')}
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
      <Textarea
        className="w-full mb-2 resize-none"
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Share your thoughts..."
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="flex items-center"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
