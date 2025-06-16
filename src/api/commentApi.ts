import { db, commentFunctions } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface User {
  userId: string;
  displayName: string;
  photoURL?: string;
}

export const postComment = async (
  reviewId: string,
  content: string,
  user: User
) => {
  // Use the existing commentFunctions from firebase.ts
  return commentFunctions.addComment({
    reviewId,
    userId: user.userId,
    userName: user.displayName,
    userAvatar: user.photoURL,
    content
  });
};

export const fetchCommentsByReview = async (reviewId: string) => {
  // Use the existing commentFunctions from firebase.ts
  const comments = await commentFunctions.getCommentsByReviewId(reviewId);
  
  // Transform to match the component's expected format
  return comments.map(comment => ({
    id: comment.id,
    userId: comment.userId,
    displayName: comment.userName,
    content: comment.content,
    timestamp: comment.createdAt,
    userAvatar: comment.userAvatar
  }));
};

// Implement fetchCommentsByUser properly
export const fetchCommentsByUser = async (userId: string) => {
  console.log(`API: Fetching comments for user ${userId}`);
  
  if (!userId) {
    console.error('User ID is required to fetch comments');
    return [];
  }

  try {
    // First try using the commentFunctions from lib/firebase
    if (commentFunctions && typeof commentFunctions.getCommentsByUserId === 'function') {
      console.log('Using commentFunctions.getCommentsByUserId');
      return await commentFunctions.getCommentsByUserId(userId);
    } 
    
    // Fallback to direct Firestore query if the function isn't available
    console.log('Falling back to direct Firestore query');
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const comments = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data
      });
    });
    
    console.log(`Found ${comments.length} comments for user`);
    return comments;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return []; // Return empty array on error
  }
};

export const editComment = async (commentId: string, content: string, userId?: string) => {
  try {
    // Check if the authenticated user is the comment owner before updating
    const commentData = await commentFunctions.getCommentById(commentId);
    
    if (!commentData) {
      throw new Error("Comment not found");
    }
    
    // Add security check
    if (userId && commentData.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }
    
    return await commentFunctions.updateComment(commentId, { content });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string, userId?: string) => {
  try {
    // Check if the authenticated user is the comment owner before deleting
    const commentData = await commentFunctions.getCommentById(commentId);
    
    if (!commentData) {
      throw new Error("Comment not found");
    }
    
    // Add security check
    if (userId && commentData.userId !== userId) {
      throw new Error("You can only delete your own comments");
    }
    
    return await commentFunctions.deleteComment(commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
