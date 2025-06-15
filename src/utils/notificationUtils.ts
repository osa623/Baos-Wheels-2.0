import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';

/**
 * Creates a notification when someone replies to a message
 */
export const createReplyNotification = async (params: {
  recipientUserId: string; // User who will receive the notification
  senderUserId: string;    // User who created the reply
  senderUserName: string;  // Display name of user who replied
  senderUserAvatar?: string; // Avatar URL of user who replied
  messageContent: string;  // Content of the reply
  originalMessageId: string; // ID of the original message being replied to
  chatId: string;         // ID of the chat thread
}) => {
  const {
    recipientUserId,
    senderUserId,
    senderUserName,
    senderUserAvatar,
    messageContent,
    originalMessageId,
    chatId
  } = params;
  
  // Don't create notification if user is replying to their own message
  if (recipientUserId === senderUserId) {
    console.log("Skipping notification - user replied to their own message");
    return null;
  }
  
  try {
    console.log("Creating notification for user:", recipientUserId);
    
    const db = getFirestore(getApp());
    const notificationsRef = collection(db, 'notifications');
    
    // Create notification
    const notification = {
      userId: recipientUserId, // Important: this is the recipient's ID (who receives the notification)
      type: 'reply',
      fromUserId: senderUserId,
      fromUserName: senderUserName,
      fromUserAvatar: senderUserAvatar || null,
      contentPreview: messageContent.length > 100 ? messageContent.substring(0, 97) + '...' : messageContent,
      contentId: originalMessageId,
      isRead: false,
      createdAt: serverTimestamp(),
      url: `/community?message=${originalMessageId}` // URL to navigate to the message
    };
    
    console.log("Creating notification with data:", notification);
    const docRef = await addDoc(notificationsRef, notification);
    console.log("Notification created with ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string) => {
  // Implementation for marking all notifications as read
  // (Add this functionality if needed)
}


