import { notificationFunctions, db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Seeds example notifications for a user.
 * This is helpful for testing the notifications UI when real notifications aren't being generated.
 * 
 * @param userId The ID of the user to seed notifications for
 * @returns Promise that resolves when seeding is complete
 */
export async function seedExampleNotifications(userId: string): Promise<void> {
  if (!userId) {
    console.error("Cannot seed notifications: No user ID provided");
    return;
  }

  console.log("Seeding example notifications for user:", userId);
  
  // Check if we already have some notifications for this user
  const notificationsRef = collection(db, 'notifications');
  const q = query(notificationsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log(`User ${userId} already has ${snapshot.size} notifications`);
    return;
  }
  
  // Create example notifications
  const examples = [
    {
      userId,
      type: 'reply',
      fromUserId: 'system',
      fromUserName: 'System',
      contentPreview: 'Welcome to Baoswheels! This is an example notification.',
      relatedMessageId: 'example',
      isRead: false,
    },
    {
      userId,
      type: 'reply',
      fromUserId: 'example-user-1',
      fromUserName: 'John Smith',
      contentPreview: 'Great post! I really enjoyed your insights about electric vehicles.',
      relatedMessageId: 'example-post-1',
      isRead: false,
    },
    {
      userId,
      type: 'mention',
      fromUserId: 'example-user-2',
      fromUserName: 'Jane Doe',
      contentPreview: 'I think @User would be interested in this discussion about Tesla.',
      relatedMessageId: 'example-post-2',
      isRead: false,
    }
  ];
  
  // Add the examples
  for (const notification of examples) {
    await notificationFunctions.createNotification(notification);
  }
  
  console.log(`Created ${examples.length} example notifications for user ${userId}`);
}
