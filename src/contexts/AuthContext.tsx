import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, authFunctions, logOut as firebaseLogOut } from '@/lib/firebase';
import { SessionTimeout } from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Session timeout reference
  const sessionTimeoutRef = useRef<SessionTimeout | null>(null);

  // First define the logout function to avoid circular references
  const performLogOut = async (): Promise<void> => {
    console.log("AuthContext: logOut called");
    try {
      await firebaseLogOut();
    } catch (error) {
      console.error("AuthContext: logOut failed", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "Not logged in");
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Handle logout from session timeout - now using the performLogOut function
  const handleSessionTimeout = useCallback(() => {
    console.log('Session timed out due to inactivity');
    
    try {
      // Now toast is properly defined
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        duration: 5000,
      });
    } catch (e) {
      console.log('Unable to display toast notification');
    }
    
    // Use the performLogOut function instead of logOut
    performLogOut();
  }, [toast]); // Only depend on toast, not on logOut

  // Initialize session timeout when user changes
  useEffect(() => {
    // Clean up any existing session timeout
    if (sessionTimeoutRef.current) {
      sessionTimeoutRef.current.cleanup();
    }

    // Only set up the session timeout if we have a logged-in user
    if (currentUser) {
      sessionTimeoutRef.current = new SessionTimeout({
        // 30 minutes of inactivity before logout
        timeout: 30 * 60 * 1000,
        onTimeout: handleSessionTimeout,
        isEnabled: true
      });
      
      console.log('Session timeout monitoring started');
    }

    // Cleanup on unmount or when user changes
    return () => {
      if (sessionTimeoutRef.current) {
        sessionTimeoutRef.current.cleanup();
        sessionTimeoutRef.current = null;
      }
    };
  }, [currentUser, handleSessionTimeout]);

  const value = {
    currentUser,
    loading,
    signUp: async (email: string, password: string, name: string): Promise<User> => {
      console.log("AuthContext: signUp called", { email, name });
      try {
        const result = await authFunctions.signUp(email, password, name);
        return result.user;
      } catch (error) {
        console.error("AuthContext: signUp failed", error);
        throw error;
      }
    },
    signIn: async (email: string, password: string): Promise<User> => {
      console.log("AuthContext: signIn called", { email });
      try {
        const result = await authFunctions.signIn(email, password);
        return result.user;
      } catch (error) {
        console.error("AuthContext: signIn failed", error);
        throw error;
      }
    },
    signInWithGoogle: async (): Promise<User> => {
      console.log("AuthContext: signInWithGoogle called");
      try {
        const result = await authFunctions.signInWithGoogle();
        return result.user;
      } catch (error) {
        console.error("AuthContext: signInWithGoogle failed", error);
        throw error;
      }
    },
    logOut: performLogOut, // Use the already defined function
    resetPassword: async (email: string): Promise<void> => {
      console.log("AuthContext: resetPassword called", { email });
      try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent");
      } catch (error) {
        console.error("AuthContext: resetPassword failed", error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
      