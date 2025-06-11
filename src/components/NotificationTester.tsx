import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedExampleNotifications } from '@/utils/notificationSeeder';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * A component for testing notifications.
 * This is only for development purposes and should be removed in production.
 */
const NotificationTester = () => {
  const { currentUser } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerateNotifications = async () => {
    if (!currentUser) {
      setMessage("You need to be logged in to generate notifications");
      return;
    }
    
    setIsTesting(true);
    setMessage(null);
    
    try {
      await seedExampleNotifications(currentUser.uid);
      setMessage("Example notifications generated! Check your bell icon.");
      
      // Reload the page after a delay to show the new notifications
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Failed to generate notifications:", error);
      setMessage("Failed to generate test notifications");
    } finally {
      setIsTesting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Notification Testing</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Generate example notifications to test the notification system.
      </p>
      
      <Button 
        variant="outline" 
        size="sm"
        disabled={isTesting}
        onClick={handleGenerateNotifications}
      >
        {isTesting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
            Generating...
          </>
        ) : (
          'Generate Test Notifications'
        )}
      </Button>
      
      {message && (
        <p className="mt-2 text-sm text-primary">{message}</p>
      )}
    </div>
  );
};

export default NotificationTester;
