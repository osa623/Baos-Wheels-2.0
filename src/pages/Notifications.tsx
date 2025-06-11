import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { notificationFunctions, Notification } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCheck, Bell, ChevronLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const userNotifications = await notificationFunctions.getAllNotifications(currentUser.uid, 100);
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // Format notification timestamp
  const formatNotificationTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      await notificationFunctions.markAllAsRead(currentUser.uid);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      setError("Failed to mark notifications as read.");
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="flex-grow mx-auto w-full max-w-4xl px-4 pt-24 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex items-center text-sm mb-2 hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
            <p>{error}</p>
          </div>
        )}
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {loading ? (
              <Card className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </Card>
            ) : notifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You don't have any notifications yet. When someone replies to your messages, you'll see them here.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    formatTime={formatNotificationTime}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread">
            {loading ? (
              <Card className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </Card>
            ) : unreadNotifications.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCheck className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  You've read all your notifications.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    formatTime={formatNotificationTime}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  formatTime: (timestamp: any) => string;
}

const NotificationItem = ({ notification, formatTime }: NotificationItemProps) => {
  return (
    <Card className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
      !notification.isRead ? 'border-l-4 border-primary' : ''
    }`}>
      <Link 
        to={notification.type === 'reply' ? '/community' : '/'}
        className="flex items-start space-x-4"
      >
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={notification.fromUserAvatar || undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {notification.fromUserName?.substring(0, 2).toUpperCase() || 'UN'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                {notification.fromUserName}
                {notification.type === 'reply' && ' replied to your message'}
                {notification.type === 'mention' && ' mentioned you'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{notification.contentPreview}</p>
            </div>
            <span className="text-xs text-muted-foreground ml-4">
              {formatTime(notification.createdAt)}
            </span>
          </div>
        </div>
        {!notification.isRead && (
          <div className="h-3 w-3 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
        )}
      </Link>
    </Card>
  );
};

export default Notifications;
