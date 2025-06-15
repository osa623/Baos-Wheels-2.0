import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  CircularProgress, 
  Alert, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Chip,
  Avatar,
  Button,
  Snackbar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '@/contexts/AuthContext';

// Import Firebase functionality
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc, 
  doc,
  onSnapshot
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

// Define Notification interface directly in this file
interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'mention' | 'like' | 'system' | 'info' | 'warning' | 'error' | 'success';
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  contentPreview: string;
  contentId?: string;
  isRead: boolean;
  createdAt: any; // Using "any" to handle Firestore Timestamp
  url?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const { currentUser } = useAuth();

  // Re-fetch notifications when the component mounts or currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError("You need to be logged in to view notifications");
      return;
    }
    
    // Set up real-time listener for notifications
    setupNotificationListener();
  }, [currentUser]);

  // Real-time notification listener
  const setupNotificationListener = () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(`Setting up listener for user: ${currentUser.uid}`);
      
      const db = getFirestore(getApp());
      const notificationsRef = collection(db, 'notifications');
      
      // Query for user's notifications, ordered by creation time
      const q = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      // Real-time listener
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const notificationData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Notification[];
          
          // Check for new notifications
          if (notifications.length > 0 && notificationData.length > notifications.length) {
            // Find newest notification that's not in our current list
            const newNotifications = notificationData.filter(
              newNotif => !notifications.some(oldNotif => oldNotif.id === newNotif.id)
            );
            
            if (newNotifications.length > 0) {
              // Set newest notification for alert
              setNewNotification(newNotifications[0]);
            }
          }
          
          setNotifications(notificationData);
          setLoading(false);
          setDebugInfo(`Real-time update: ${notificationData.length} notifications`);
        },
        (err) => {
          console.error("Error in notification listener:", err);
          setError(`Failed to listen for notifications: ${err.message}`);
          setLoading(false);
          
          // Fall back to regular fetch if listener fails
          fetchNotifications();
        }
      );
      
      // Clean up listener when component unmounts
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Error setting up notification listener:", err);
      setError(`Failed to set up notification system: ${err.message}`);
      setLoading(false);
      
      // Fall back to regular fetch
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) {
      setDebugInfo('No current user');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(`Fetching for user: ${currentUser.uid}`);
      
      // Initialize Firestore inside the function to ensure it's fresh
      const db = getFirestore(getApp());
      const notificationsRef = collection(db, 'notifications');
      
      // Create query
      const q = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const numDocs = querySnapshot.docs.length;
      setDebugInfo(`Query returned ${numDocs} documents`);
      
      // Process results
      const notificationData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(notificationData);
      console.log("Notifications loaded:", notificationData.length);
    } catch (err: any) {
      const errorMessage = err?.message || "Unknown error";
      console.error("Error fetching notifications:", err);
      setError(`Failed to load notifications: ${errorMessage}`);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    
    try {
      const db = getFirestore(getApp());
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err: any) {
      console.error("Error marking as read:", err);
      alert(`Failed to mark as read: ${err.message}`);
    }
  };

  const handleCloseAlert = () => {
    setNewNotification(null);
  };

  // Update the navigation handler to work with community chat URLs
  const navigateToNotification = () => {
    if (newNotification?.url) {
      if (newNotification.url.startsWith('/')) {
        // Internal URL - use window.location for now, but could use router navigation
        window.location.href = newNotification.url;
      } else {
        window.open(newNotification.url, '_blank');
      }
      handleCloseAlert();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'reply':
        return <ChatIcon color="primary" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorOutlineIcon color="error" />;
      case 'success':
        return <DoneAllIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const formatTimestamp = (timestamp: any): string => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy • h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <NotificationsIcon sx={{ fontSize: 28, mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Notifications
            </Typography>
            <Badge 
              badgeContent={notifications.filter(n => !n.isRead).length} 
              color="primary"
              sx={{ ml: 2 }}
            >
              <Chip label="Unread" size="small" color="primary" variant="outlined" />
            </Badge>
          </Box>
          
          <Button 
            startIcon={<RefreshIcon />}
            onClick={fetchNotifications}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert 
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchNotifications}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : notifications.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              You don't have any notifications yet.
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.id}
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
                  borderRadius: 1,
                  mb: 1,
                  cursor: notification.url ? 'pointer' : 'default'
                }}
                onClick={() => {
                  if (notification.url) {
                    if (notification.url.startsWith('/')) {
                      window.location.href = notification.url;
                    } else {
                      window.open(notification.url, '_blank');
                    }
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {notification.fromUserAvatar ? (
                    <Avatar src={notification.fromUserAvatar} alt={notification.fromUserName || 'User'} />
                  ) : (
                    getNotificationIcon(notification.type)
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight={notification.isRead ? 'normal' : 'bold'}
                    >
                      {notification.type === 'reply' 
                        ? `${notification.fromUserName || 'Someone'} replied to your message` 
                        : notification.fromUserName || 'Notification'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.contentPreview}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatTimestamp(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
                {!notification.isRead && (
                  <IconButton 
                    size="small" 
                    onClick={() => markAsRead(notification.id)}
                    sx={{ mt: 1 }}
                    title="Mark as read"
                  >
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Notification alert */}
      <Snackbar
        open={!!newNotification}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="info" 
          sx={{ width: '100%', cursor: 'pointer' }}
          onClick={navigateToNotification}
        >
          {newNotification?.type === 'reply' ? (
            <Box>
              <Typography variant="subtitle2">
                {newNotification.fromUserName || 'Someone'} replied to your message
              </Typography>
              <Typography variant="caption">
                {newNotification.contentPreview}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle2">New notification</Typography>
              <Typography variant="caption">
                {newNotification?.contentPreview || ''}
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
      
      {/* Debug information - more detailed */}
      <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Debug Information
        </Typography>
        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
          {`User ID: ${currentUser ? currentUser.uid : 'Not logged in'}
Notifications Count: ${notifications.length}
Status: ${loading ? 'Loading...' : error ? 'Error' : 'Ready'}
Details: ${debugInfo}
Latest notification: ${notifications[0] ? JSON.stringify({
  id: notifications[0].id,
  type: notifications[0].type,
  from: notifications[0].fromUserName,
  contentPreview: notifications[0].contentPreview?.substring(0, 30) + '...'
}, null, 2) : 'None'}`}
        </Typography>
        <Button 
          size="small" 
          variant="outlined" 
          sx={{ mt: 1 }}
          onClick={() => {
            console.log('Current notifications:', notifications);
            fetchNotifications();
          }}
        >
          Debug Refresh
        </Button>
      </Paper>
    </Container>
  );
};

export default NotificationsPage;
