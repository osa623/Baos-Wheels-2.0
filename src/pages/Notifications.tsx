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
  Avatar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ChatIcon from '@mui/icons-material/Chat';
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
  Timestamp 
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

// Firebase notification functions
const db = getFirestore(getApp());
const notificationsCollection = collection(db, 'notifications');

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Create query with proper imports
      const q = query(
        notificationsCollection,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      setNotifications(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
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
        <Box display="flex" alignItems="center" mb={3}>
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

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notifications.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              You don't have any notifications yet.
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
                    borderRadius: 1,
                    mb: 1
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
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationsPage;
