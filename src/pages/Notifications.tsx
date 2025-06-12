import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = "user123"; // This should be replaced with actual user ID from authentication

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
      // For demo purposes, setting mock data
      setNotifications([
        {
          id: "1",
          title: "Appointment Confirmed",
          message: "Your wheel alignment appointment has been confirmed for tomorrow at 2 PM.",
          timestamp: new Date().toISOString(),
          isRead: false,
          type: "success"
        },
        {
          id: "2",
          title: "Payment Received",
          message: "We've received your payment of $120 for the recent service.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
          type: "info"
        },
        {
          id: "3",
          title: "Maintenance Reminder",
          message: "Your vehicle is due for brake inspection in the next week.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isRead: false,
          type: "warning"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Replace with your actual API endpoint
      await axios.put(`/api/notifications/${notificationId}/read`);
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // For demo, update state anyway
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
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

  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy • h:mm a');
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
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight={notification.isRead ? 'normal' : 'bold'}
                      >
                        {notification.title}
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
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatTimestamp(notification.timestamp)}
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

export default Notifications;
