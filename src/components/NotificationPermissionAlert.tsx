import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface NotificationPermissionAlertProps {
  onDismiss: () => void;
}

const NotificationPermissionAlert = ({ onDismiss }: NotificationPermissionAlertProps) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-800">Notification Permissions Issue</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-2">
          Your account doesn't have permission to create notifications. This is likely due to 
          Firebase security rules that need to be updated. Replies will still work, but recipients
          won't be notified.
        </p>
        <p className="text-sm">
          For administrators: Check the firebase-security-rules.txt file for the correct security rules.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-800"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default NotificationPermissionAlert;
