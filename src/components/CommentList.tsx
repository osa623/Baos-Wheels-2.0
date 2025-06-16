import React, { useEffect, useState } from 'react';
import { fetchCommentsByReview, editComment, deleteComment } from '../api/commentApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";

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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

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

  const handleEditClick = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const saveEdit = async (commentId: string) => {
    if (!editContent.trim() || !currentUser) return;

    try {
      await editComment(commentId, editContent, currentUser.uid);
      
      // Update the comments array with the edited content
      setComments(comments.map(comment => 
        comment.id === commentId ? {...comment, content: editContent} : comment
      ));
      
      setEditingCommentId(null);
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to update your comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (commentId: string) => {
    setIsDeleting(commentId);
  };

  const handleDelete = async () => {
    if (!isDeleting || !currentUser) return;

    try {
      await deleteComment(isDeleting, currentUser.uid);
      
      // Remove the deleted comment from the state
      setComments(comments.filter(comment => comment.id !== isDeleting));
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to delete your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const isCurrentUserComment = (userId: string) => {
    return currentUser && currentUser.uid === userId;
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
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Comments</h2>
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>
      
      {comments.length === 0 ? (
        <div className="py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border-2 border-slate-50 dark:border-slate-700 shadow-sm">
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gary-800 text-white">
                    {getUserInitials(comment.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{comment.displayName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-3">
                      <Textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full mb-3 resize-none border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEdit}
                          className="text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => saveEdit(comment.id)}
                          disabled={!editContent.trim()}
                          className="text-sm font-medium bg-blue-600 hover:bg-blue-700"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
                  )}
                </div>
              </div>

              {/* Comment actions - only visible to the comment author */}
              {isCurrentUserComment(comment.userId) && editingCommentId !== comment.id && (
                <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditClick(comment)}
                    className="flex items-center h-8 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2"
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => confirmDelete(comment.id)}
                    className="flex items-center h-8 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleting !== null} onOpenChange={() => setIsDeleting(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Delete Comment</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
            <AlertDialogCancel className="border border-gray-300 dark:border-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentList;
