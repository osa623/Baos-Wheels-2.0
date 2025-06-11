import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, authFunctions } from '@/lib/firebase';

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
    logOut: async (): Promise<void> => {
      console.log("AuthContext: logOut called");
      try {
        await authFunctions.signOut();
      } catch (error) {
        console.error("AuthContext: logOut failed", error);
        throw error;
      }
    },
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
