import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  doc,
  updateDoc,
  writeBatch,
  limit,
  onSnapshot,
  getDoc,
  deleteDoc
} from "firebase/firestore";

console.log("Initializing Firebase");

// Use a simpler development config that will work even without environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAJ5DGQ2Kiq3Yi_I1nhUJ2tuoKQPocT7hI",
  authDomain: "baoswheels.firebaseapp.com",
  projectId: "baoswheels",
  storageBucket: "baoswheels.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "975090471104",
  appId: "1:975090471104:web:dd1b24f6fecaca9c2f9d25",
  measurementId: "G-Q2FTKW1S9J"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable offline persistence if in a browser environment
  if (typeof window !== 'undefined') {
    try {
      enableMultiTabIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time
          console.warn('Firebase persistence failed to enable: Multiple tabs open');
          // Fall back to memory-only storage
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.warn('Firebase persistence not supported in this browser');
        }
      });
    } catch (err) {
      console.warn('Failed to enable Firebase persistence', err);
    }
  }
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw new Error("Failed to initialize Firebase. Please check your configuration.");
}

// Export auth functions directly for easier access
export const signUp = async (email: string, password: string, displayName: string) => {
  console.log("Attempting to create user:", email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential.user.uid);
    
    // Update profile with display name
    if (displayName) {
      console.log("Setting display name:", displayName);
      try {
        await updateProfile(userCredential.user, { displayName });
        console.log("Display name updated successfully");
      } catch (error) {
        console.error("Failed to update display name:", error);
      }
    }
    
    return userCredential;
  } catch (error: any) {
    console.error("Sign up failed:", error.code, error.message);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  console.log("Attempting to sign in user:", email);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Sign in successful:", result.user.uid);
    return result;
  } catch (error: any) {
    console.error("Sign in failed:", error.code, error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  console.log("Attempting Google sign in");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign in successful:", result.user.uid);
    return result;
  } catch (error: any) {
    console.error("Google sign in failed:", error.code, error.message);
    throw error;
  }
};

export const logOut = async () => {
  console.log("Attempting to sign out");
  try {
    await signOut(auth);
    console.log("Sign out successful");
  } catch (error: any) {
    console.error("Sign out failed:", error.code, error.message);
    throw error;
  }
};

// Keep the authFunctions object for backward compatibility
export const authFunctions = {
  signUp,
  signIn,
  signInWithGoogle,
  signOut: logOut
};

// Comment interface
export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string | Timestamp;
}

// Comment functions
export const commentFunctions = {
  // Get all comments for a specific review
  getCommentsByReviewId: async (reviewId: string): Promise<Comment[]> => {
    console.log("Fetching comments for review:", reviewId);
    try {
      if (!reviewId) {
        console.error("Invalid review ID provided:", reviewId);
        return [];
      }

      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('reviewId', '==', reviewId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q)
        .catch(error => {
          console.error(`Error in Firestore query for comments (reviewId: ${reviewId}):`, error);
          throw new Error(`Firestore query failed: ${error.message}`);
        });
      
      const comments: Comment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          reviewId: data.reviewId || reviewId,
          userId: data.userId || 'anonymous',
          userName: data.userName || 'Anonymous User',
          userAvatar: data.userAvatar,
          content: data.content || '[No content]',
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString()
            : (data.createdAt || new Date().toISOString())
        });
      });
      
      console.log(`Found ${comments.length} comments for review ${reviewId}`);
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },
  
  // Add a new comment to a review
  addComment: async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    console.log("Adding comment for review:", comment.reviewId);
    try {
      if (!comment.reviewId) {
        throw new Error("Review ID is required");
      }
      
      // Validate input
      const validatedComment = {
        reviewId: comment.reviewId,
        userId: comment.userId || 'anonymous',
        userName: comment.userName || 'Anonymous User', 
        userAvatar: comment.userAvatar,
        content: comment.content || '[No content]',
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'comments'), validatedComment);
      console.log("Comment added with ID:", docRef.id);
      
      // Return the new comment with the ID from Firestore
      return {
        id: docRef.id,
        ...comment,
        createdAt: new Date().toISOString() // Use current time as a placeholder
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  // Update an existing comment
  updateComment: async (commentId: string, updates: {content?: string}): Promise<void> => {
    console.log("Updating comment:", commentId);
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }
      
      const commentRef = doc(db, 'comments', commentId);
      
      // Only allow updating specific fields
      const validUpdates: Record<string, any> = {};
      if (updates.content !== undefined) {
        validUpdates.content = updates.content;
      }
      
      // Add an updatedAt field
      validUpdates.updatedAt = serverTimestamp();
      
      await updateDoc(commentRef, validUpdates);
      console.log("Comment updated successfully:", commentId);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },
  
  // Delete a comment (hard delete only)
  deleteComment: async (commentId: string): Promise<void> => {
    console.log("Deleting comment:", commentId);
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }

      const commentRef = doc(db, 'comments', commentId);

      // Check if the document exists before attempting to delete
      const commentDoc = await getDoc(commentRef);
      if (!commentDoc.exists()) {
        console.warn(`Comment with ID ${commentId} does not exist. Nothing to delete.`);
        return;
      }

      await deleteDoc(commentRef);
      console.log("Comment hard-deleted successfully:", commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
  // Get all comments by a specific user
  getCommentsByUserId: async (userId: string): Promise<Comment[]> => {
    console.log("Fetching comments for user:", userId);
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const comments: Comment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          reviewId: data.reviewId,
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          content: data.content,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString()
            : data.createdAt
        });
      });
      
      console.log(`Found ${comments.length} comments for user ${userId}`);
      return comments;
    } catch (error) {
      console.error('Error fetching user comments:', error);
      return [];
    }
  },

  // Get a single comment by ID
  getCommentById: async (commentId: string): Promise<Comment | null> => {
    console.log("Fetching comment by ID:", commentId);
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }
      
      const commentRef = doc(db, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      
      if (!commentSnap.exists()) {
        console.log("No comment found with ID:", commentId);
        return null;
      }
      
      const data = commentSnap.data();
      return {
        id: commentId,
        reviewId: data.reviewId,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        content: data.content,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : data.createdAt
      };
    } catch (error) {
      console.error('Error fetching comment by ID:', error);
      return null;
    }
  },
};

// Notification interface
export interface Notification {
  id: string;
  userId: string;   // The user who should receive this notification
  type: string;     // Type of notification (e.g., 'reply', 'mention', etc.)
  fromUserId: string;  // Who created the notification
  fromUserName: string;
  contentPreview: string; // Preview of the message content
  relatedMessageId?: string; // ID of the related message
  relatedReplyId?: string;  // ID of the related reply
  isRead: boolean;   // Whether notification has been read
  createdAt: Timestamp | null;
}

// Notification functions
export const notificationFunctions = {
  // Create a new notification
  createNotification: async (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    try {
      const notificationData = {
        ...notification,
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      console.log("Notification created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },
  
  // Get all unread notifications for a user
  getUnreadNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          contentPreview: data.contentPreview,
          relatedMessageId: data.relatedMessageId,
          relatedReplyId: data.relatedReplyId,
          isRead: data.isRead,
          createdAt: data.createdAt
        });
      });
      
      return notifications;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return [];
    }
  },
  
  // Get all notifications for a user
  getAllNotifications: async (userId: string, limit = 20): Promise<Notification[]> => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          contentPreview: data.contentPreview,
          relatedMessageId: data.relatedMessageId,
          relatedReplyId: data.relatedReplyId,
          isRead: data.isRead,
          createdAt: data.createdAt
        });
      });
      
      return notifications;
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      return [];
    }
  },
  
  // Mark all notifications as read for a user
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.update(document.ref, { isRead: true });
      });
      
      await batch.commit();
      console.log("All notifications marked as read for user:", userId);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
};

export { auth, db };
export default app;
