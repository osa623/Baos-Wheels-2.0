import React, { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageCircle, Trash2, SendHorizonal, Reply, ChevronLeft, MailWarning, MailWarningIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, getDocs, deleteDoc, doc, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { createReplyNotification } from '@/utils/notificationUtils';

interface Message {
  id: string;
  message: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date | Timestamp | null;  // Changed to allow null
  replies?: Reply[];
}

interface Reply {
  id: string;
  message: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date | Timestamp | null;
  parentId: string;
  replyToId?: string;  // ID of the reply this is responding to
  replyToUser?: string; // Username of the person being replied to
  replyToMessage?: string; // Preview of the message being replied to
}

const Community = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingToReply, setReplyingToReply] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  // Maximum number of replies to show before collapsing
  const MAX_VISIBLE_REPLIES = 3;
  
  // Scroll to bottom of chat when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Get user's initials for avatar
  const getUserInitials = (displayName: string): string => {
    if (!displayName) return 'UN';
    
    const nameParts = displayName.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };
  
  // Fetch messages from Firestore - fixed implementation
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      // First, check if collection exists or create it
      const checkCollection = async () => {
        // We don't need to explicitly create collections in Firestore
        // They're created automatically when the first document is added
        console.log("Setting up message listener");
      };
      
      checkCollection();
      
      const messagesRef = collection(db, 'community_chats');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            message: data.message || '',
            userId: data.userId || 'anonymous',
            userName: data.userName || 'Anonymous User',
            userAvatar: data.userAvatar || undefined,
            createdAt: data.createdAt || null
          });
        });
        
        // Sort messages from oldest to newest for display
        fetchedMessages.sort((a, b) => {
          const timeA = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate()) : new Date(0);
          const timeB = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate()) : new Date(0);
          return timeA.getTime() - timeB.getTime();
        });
        
        console.log(`Fetched ${fetchedMessages.length} messages`);
        setMessages(fetchedMessages);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages. Please try again later.");
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up message listener:", err);
      setError("Something went wrong. Please refresh the page.");
      setLoading(false);
      return () => {};
    }
  }, []);
  
  // Fetch replies from Firestore - fixed implementation
  useEffect(() => {
    try {
      const repliesRef = collection(db, 'community_replies');
      const q = query(repliesRef, orderBy('createdAt', 'asc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedReplies: Reply[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReplies.push({
            id: doc.id,
            message: data.message || '',
            userId: data.userId || 'anonymous',
            userName: data.userName || 'Anonymous User',
            userAvatar: data.userAvatar || undefined,
            createdAt: data.createdAt || null,
            parentId: data.parentId || '',
            replyToId: data.replyToId || undefined,
            replyToUser: data.replyToUser || undefined,
            replyToMessage: data.replyToMessage || undefined
          });
        });
        
        console.log(`Fetched ${fetchedReplies.length} replies`);
        setReplies(fetchedReplies);
      }, (error) => {
        console.error("Error fetching replies:", error);
      });
      
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up replies listener:", err);
      return () => {};
    }
  }, []);
  
  // Post a new message - improved error handling
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    
    try {
      console.log("Sending new message");
      const messageData = {
        message: newMessage.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous User',
        userAvatar: currentUser.photoURL || null,
        createdAt: serverTimestamp()
      };
      
      // Debug logging
      console.log("Message data:", JSON.stringify(messageData));
      
      await addDoc(collection(db, 'community_chats'), messageData);
      
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };
  
  // Post a reply to a message or another reply
  const handleSendReply = async () => {
    if (!replyContent.trim() || !currentUser) return;
    
    try {
      if (replyingTo) {
        console.log(`Sending reply to message ${replyingTo}`);
        const replyData: any = {
          message: replyContent.trim(),
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Anonymous User',
          userAvatar: currentUser.photoURL || null,
          createdAt: serverTimestamp(),
          parentId: replyingTo
        };
        
        // If replying to a reply, add the replyToId, replyToUser and a preview of the message
        let recipientUserId = ''; // Track who should receive the notification
        
        if (replyingToReply) {
          const replyBeingRepliedTo = replies.find(r => r.id === replyingToReply);
          if (replyBeingRepliedTo) {
            replyData.replyToId = replyingToReply;
            replyData.replyToUser = replyBeingRepliedTo.userName;
            // Add a preview of the message (limited to 100 chars)
            const previewMessage = replyBeingRepliedTo.message.length > 100 
              ? replyBeingRepliedTo.message.substring(0, 97) + '...' 
              : replyBeingRepliedTo.message;
            replyData.replyToMessage = previewMessage;
            
            // Set the recipient for notification (the author of the reply)
            recipientUserId = replyBeingRepliedTo.userId;
          }
        } else {
          // If replying directly to a message, include a preview of the message
          const messageBeingRepliedTo = messages.find(m => m.id === replyingTo);
          if (messageBeingRepliedTo) {
            // Add a preview of the message (limited to 100 chars)
            const previewMessage = messageBeingRepliedTo.message.length > 100 
              ? messageBeingRepliedTo.message.substring(0, 97) + '...' 
              : messageBeingRepliedTo.message;
            replyData.replyToMessage = previewMessage;
            
            // Set the recipient for notification (the author of the original message)
            recipientUserId = messageBeingRepliedTo.userId;
          }
        }
        
        // Debug logging
        console.log("Reply data:", JSON.stringify(replyData));
        
        // Save the reply to Firestore
        const replyDocRef = await addDoc(collection(db, 'community_replies'), replyData);
        console.log("Reply added with ID:", replyDocRef.id);
        
        // Create a notification for the message/reply author (if different from current user)
        if (recipientUserId && recipientUserId !== currentUser.uid) {
          try {
            await createReplyNotification({
              recipientUserId: recipientUserId,
              senderUserId: currentUser.uid,
              senderUserName: currentUser.displayName || 'Anonymous User',
              senderUserAvatar: currentUser.photoURL || null,
              messageContent: replyContent.trim(),
              originalMessageId: replyingTo,
              chatId: 'community' // Since this is the community chat
            });
          } catch (notifError) {
            console.error("Failed to create notification:", notifError);
          }
        }
        
        setReplyContent('');
        setReplyingTo(null);
        setReplyingToReply(null);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      setError("Failed to send reply. Please try again.");
    }
  };
  
  // Delete a message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Delete the message
      await deleteDoc(doc(db, 'community_chats', messageId));
      
      // Delete all replies to this message
      const repliesRef = collection(db, 'community_replies');
      const q = query(repliesRef, where('parentId', '==', messageId));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  // Delete a reply
  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteDoc(doc(db, 'community_replies', replyId));
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };
  
  // Format timestamp - improved null handling
  const formatTimestamp = (timestamp: Date | Timestamp | null) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
      
      // If today, just show time
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Otherwise show date and time
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting timestamp:", error, timestamp);
      return 'Unknown time';
    }
  };
  
  // Toggle expansion state for a message's replies
  const toggleRepliesExpansion = (messageId: string) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header/>
      
      <div className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          {/* Back navigation */}
          <div className="flex flex-col">      
                <Link to="/" className="inline-flex items-center text-sm mb-2 hover:text-primary transition-colors">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">Community Chat</h1>
                  <Badge variant="secondary" className="bg-green-500 text-white">Public</Badge>
                </div>
          </div>
          <div className='flex items-center gap-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className='flex'>
                    <MailWarningIcon className='h-5 w-5 cursor-pointer text-red-700 mr-2' />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="backdrop-blur bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Community Chat Policies</AlertDialogTitle>
                    <AlertDialogDescription>
                      <ul className="list-disc pl-5 space-y-1 text-left text-sm">
                        <li>Be respectful and considerate to all members.</li>
                        <li>No hate speech, harassment, or personal attacks.</li>
                        <li>Do not share personal or sensitive information.</li>
                        <li>Keep discussions relevant to the community.</li>
                        <li>No spam, advertising, or self-promotion.</li>
                        <li>Report inappropriate content to moderators.</li>
                        <li>Repeated violations may result in removal from the chat.</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">{messages.length} message{messages.length !== 1 && 's'}</span>
              </div>
         </div>     
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Chat container with messages */}
        <Card className="mb-6 overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <ScrollArea className="h-[60vh] sm:h-[65vh] md:h-[70vh] p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
                  <MessageCircle className="h-12 w-12 text-primary" />
                </div>
                <p className="text-xl font-medium mb-2">No messages yet</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Be the first to start the conversation. Your thoughts and questions matter to our community!
                </p>
              </div>
            ) : (
              <div className="space-y-8 p-6">
                {messages.map((message) => {
                  // Get replies for this message
                  const messageReplies = replies.filter(reply => reply.parentId === message.id);
                  const isCurrentUserMessage = currentUser && message.userId === currentUser.uid;
                  
                  // Check if replies should be collapsed
                  const hasExcessReplies = messageReplies.length > MAX_VISIBLE_REPLIES;
                  const isExpanded = expandedMessages[message.id] || false;
                  const visibleReplies = isExpanded ? messageReplies : messageReplies.slice(0, MAX_VISIBLE_REPLIES);
                  
                  return (
                    <div key={message.id} className="relative group">
                      {/* User's own messages will be aligned to the right */}
                      <div className={`flex ${isCurrentUserMessage ? 'flex-row-reverse' : ''} space-x-3 ${isCurrentUserMessage ? 'space-x-reverse' : ''}`}>
                        <div className="flex-shrink-0">
                          <Avatar className={`h-10 w-10 ${isCurrentUserMessage ? 'ring-2 ring-green-400 ring-offset-2' : 'ring-2 ring-primary/20 ring-offset-2'} dark:ring-offset-gray-800`}>
                            <AvatarImage src={message.userAvatar || undefined} />
                            <AvatarFallback className={`${isCurrentUserMessage ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-primary/80 to-primary'} text-white`}>
                              {getUserInitials(message.userName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div 
                          className={`flex-1 max-w-[75%] sm:max-w-[70%] rounded-xl shadow-sm p-3 transition-all
                            ${isCurrentUserMessage 
                              ? 'bg-green-50 dark:bg-green-900/20 ml-auto border-r-4 border-green-300/50' 
                              : 'bg-white dark:bg-gray-800'}`
                            }
                        >
                          <div className={`flex items-center justify-between mb-1.5 ${isCurrentUserMessage ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center flex-wrap gap-1.5 ${isCurrentUserMessage ? 'flex-row-reverse' : ''}`}>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{message.userName}</h4>
                              <Badge variant="secondary" className={`text-[10px] font-medium ${isCurrentUserMessage ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' : 'bg-primary/10 text-primary dark:bg-primary/20'}`}>
                                {isCurrentUserMessage ? 'You' : 'Member'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(message.createdAt)}
                              </span>
                            </div>
                            
                            {isCurrentUserMessage && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this message? This action cannot be undone.
                                      All replies will also be deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                      onClick={() => handleDeleteMessage(message.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-2 leading-relaxed break-words ${isCurrentUserMessage ? 'text-right' : ''}`}>
                            {message.message}
                          </p>
                          
                          {currentUser && (
                            <div className={`flex ${isCurrentUserMessage ? 'justify-start' : 'justify-start'}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5"
                                onClick={() => {
                                  setReplyingTo(message.id);
                                  setReplyingToReply(null);
                                }}
                              >
                                <Reply className="h-3 w-3 mr-1.5" /> Reply
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Replies - we'll keep these left-aligned for simplicity */}
                      {messageReplies.length > 0 && (
                        <div className={`mt-3 space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700
                          ${isCurrentUserMessage ? 'mr-8 sm:mr-12 md:mr-16' : 'ml-8 sm:ml-12 md:ml-16'}`}>
                          {visibleReplies.map((reply) => {
                            const isCurrentUserReply = currentUser && reply.userId === currentUser.uid;
                            
                            // Find the message or reply this is responding to
                            let replyToContent = reply.replyToMessage;
                            
                            // If no stored preview but we have the parent message ID, generate one
                            if (!replyToContent) {
                              if (reply.replyToId) {
                                // Find the reply this is responding to
                                const parentReply = replies.find(r => r.id === reply.replyToId);
                                if (parentReply) {
                                  replyToContent = parentReply.message.length > 100 
                                    ? parentReply.message.substring(0, 97) + '...' 
                                    : parentReply.message;
                                }
                              } else {
                                // Find the original message this is responding to
                                const parentMessage = messages.find(m => m.id === reply.parentId);
                                if (parentMessage) {
                                  replyToContent = parentMessage.message.length > 100 
                                    ? parentMessage.message.substring(0, 97) + '...' 
                                    : parentMessage.message;
                                }
                              }
                            }
                            
                            return (
                              <div key={reply.id} className={`flex ${isCurrentUserReply ? 'flex-row-reverse' : ''} space-x-3 ${isCurrentUserReply ? 'space-x-reverse' : ''} group`}>
                                <div className="flex-shrink-0">
                                  <Avatar className={`h-8 w-8 ${isCurrentUserReply ? 'ring-1 ring-green-300' : 'ring-1 ring-blue-300'} ring-offset-1 dark:ring-offset-gray-800`}>
                                    <AvatarImage src={reply.userAvatar || undefined} />
                                    <AvatarFallback className={`text-xs text-white ${isCurrentUserReply 
                                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                        : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                                      {getUserInitials(reply.userName)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                
                                <div className={`flex-1 max-w-[80%] sm:max-w-[85%] rounded-lg p-2.5 shadow-sm
                                  ${isCurrentUserReply 
                                    ? 'bg-green-50 dark:bg-green-900/20' 
                                    : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                                  <div className={`flex items-center justify-between mb-1 ${isCurrentUserReply ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center flex-wrap gap-1.5 ${isCurrentUserReply ? 'flex-row-reverse' : ''}`}>
                                      <h5 className="font-medium text-xs text-gray-900 dark:text-gray-100">{reply.userName}</h5>
                                      <Badge variant="secondary" className={`text-[10px] ${isCurrentUserReply ? 'bg-green-100 text-green-700' : ''}`}>
                                        {isCurrentUserReply ? 'You' : 'Member'}
                                      </Badge>
                                      <span className="text-[10px] text-muted-foreground">
                                        {formatTimestamp(reply.createdAt)}
                                      </span>
                                    </div>
                                    
                                    {isCurrentUserReply && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete this reply? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-500 hover:bg-red-600 text-white"
                                              onClick={() => handleDeleteReply(reply.id)}
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                  
                                  {/* Always display a quoted message for any reply */}
                                  <div className={`text-[10px] mb-2 p-1.5 rounded-sm ${isCurrentUserReply ? 'bg-green-100/50 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700/50'} border-l-2 ${isCurrentUserReply ? 'border-green-300' : 'border-gray-300'}`}>
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <Reply className="h-2.5 w-2.5 text-gray-500" />
                                      <span className="font-medium text-gray-500">
                                        {reply.replyToUser ? `Reply to ${reply.replyToUser}` : 'Original message'}:
                                      </span>
                                    </div>
                                    <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
                                      {replyToContent || "Message unavailable"}
                                    </p>
                                  </div>
                                  
                                  <p className={`text-xs leading-relaxed break-words ${isCurrentUserReply ? 'text-right' : ''}`}>
                                    {reply.replyToUser && (
                                      <span className="font-medium text-blue-600 dark:text-blue-400">@{reply.replyToUser} </span>
                                    )}
                                    {reply.message}
                                  </p>
                                  
                                  {currentUser && (
                                    <div className={`flex ${isCurrentUserReply ? 'justify-start' : 'justify-start'}`}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[10px] mt-1 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                        onClick={() => {
                                          setReplyingTo(message.id);
                                          setReplyingToReply(reply.id);
                                        }}
                                      >
                                        <Reply className="h-2.5 w-2.5 mr-1" /> Reply
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Show/Hide more replies button */}
                          {hasExcessReplies && (
                            <div className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 border border-dashed hover:border-solid"
                                onClick={() => toggleRepliesExpansion(message.id)}
                              >
                                {isExpanded ? 
                                  <><ChevronLeft className="h-3.5 w-3.5 mr-1" /> Hide {messageReplies.length - MAX_VISIBLE_REPLIES} replies</> : 
                                  <>Show {messageReplies.length - MAX_VISIBLE_REPLIES} more {messageReplies.length - MAX_VISIBLE_REPLIES === 1 ? 'reply' : 'replies'} <ChevronLeft className="h-3.5 w-3.5 ml-1 rotate-180" /></>
                                }
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Reply input */}
                      {replyingTo === message.id && currentUser && (
                        <div className={`mt-3 pr-2 sm:pr-8 ${isCurrentUserMessage ? 'mr-8 sm:mr-12 md:mr-16' : 'ml-8 sm:ml-12 md:ml-16'}`}>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-7 w-7 hidden sm:inline-flex">
                              <AvatarImage src={currentUser.photoURL || undefined} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {currentUser.displayName ? getUserInitials(currentUser.displayName) : 'Me'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {/* Show preview of what you're replying to */}
                              {replyingToReply ? (
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mb-2 text-xs">
                                  <p className="font-medium text-gray-500 mb-0.5">
                                    Replying to {replies.find(r => r.id === replyingToReply)?.userName || 'message'}:
                                  </p>
                                  <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
                                    {replies.find(r => r.id === replyingToReply)?.message || ''}
                                  </p>
                                </div>
                              ) : (
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mb-2 text-xs">
                                  <p className="font-medium text-gray-500 mb-0.5">
                                    Replying to original message:
                                  </p>
                                  <p className="line-clamp-2 text-gray-600 dark:text-gray-300">{message.message}</p>
                                </div>
                              )}
                              
                              <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={replyingToReply ? `Reply to ${replies.find(r => r.id === replyingToReply)?.userName || ''}...` : "Write a reply..."}
                                className="text-sm min-h-[60px] resize-none transition-all focus:ring-1 focus:ring-primary"
                                maxLength={400}
                              />
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyingToReply(null);
                                    setReplyContent('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 text-xs bg-primary hover:bg-primary/90"
                                  onClick={handleSendReply}
                                  disabled={!replyContent.trim()}
                                >
                                  <Reply className="h-3.5 w-3.5 mr-1.5" /> Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Message Input */}
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask Your Question Here..."
              className="flex-1 border-4 border-primary/20 focus:border-primary focus:ring-0 rounded-lg p-3 text-sm resize-none"
              maxLength={1000}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="h-full"
            >
              <SendHorizonal className="h-4 w-4 mr-1" /> Send
            </Button>
          </div>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground mb-2">Sign in to join the conversation</p>
            <Button onClick={() => window.location.href = '/login'}>
              Log In
            </Button>
          </Card>
        )}
      </div>
    <Footer/>
     
    </div>
  );
};

export default Community;
