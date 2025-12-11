import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCommentsByUser } from '@/api/commentApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [fetchComments, setFetchComments] = useState([]);
  
  // Add state for editing mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Add state for password change
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Initialize form values when user data is available
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  //Fetching all the comments posted by the user
  useEffect(() => {
    try {
      const fetchUserComments = async () => {
        if (!currentUser || !currentUser.uid) return;
        
        setIsLoadingComments(true);
        console.log(`Fetching comments for user ID: ${currentUser.uid}`);
        
        const comments = await fetchCommentsByUser(currentUser.uid);
        console.log(`User ${currentUser.uid} has ${comments.length} comments`);
        
        setFetchComments(comments);
      };
      
      fetchUserComments();
    } catch (error) {
      console.error("Error loading user comments:", error);
    }
  }, [currentUser?.uid]);

  // Get user's display name or email
  const getUserDisplayName = () => {
    if (!currentUser) return 'Guest';
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  // Fix the comment count loading functionality
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;
    
    const loadCommentCount = async () => {
      try {
        setIsLoadingComments(true);
        console.log(`Fetching comments for user ID: ${currentUser.uid}`);
        
        const comments = await fetchCommentsByUser(currentUser.uid);
        console.log(`User ${currentUser.uid} has ${comments.length} comments`);
        
        setCommentCount(comments.length);
      } catch (error) {
        console.error("Error loading comment count:", error);
        setCommentCount(0);
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    loadCommentCount();
  }, [currentUser?.uid]); // Only depend on uid to prevent unnecessary re-fetches

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (!displayName || displayName === 'Guest') return 'GU';
    
    const nameParts = displayName.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 mt-10">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>Please log in to view your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button>
                  Log In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form values when canceling
      setDisplayName(currentUser?.displayName || '');
      setPhotoURL(currentUser?.photoURL || '');
    }
    setIsEditing(!isEditing);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    try {
      setIsUpdating(true);
      
      // Update the user profile in Firebase
      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentUser) return;
    
    // Reset error
    setPasswordError('');
    
    // Validate password fields
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      // Re-authenticate the user first (required by Firebase for sensitive operations)
      const credential = EmailAuthProvider.credential(
        currentUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update the password
      await updatePassword(currentUser, newPassword);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        duration: 3000,
      });
      
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError(error.message || 'Failed to change password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Reset password fields and errors when edit mode changes
  useEffect(() => {
    if (!isEditing) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [isEditing]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
          
          <div className="bg-slate-50 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-semibold">{getUserDisplayName()}</h3>
                {currentUser.email && (
                  <p className="text-muted-foreground">{currentUser.email}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="outline">Member</Badge>
                  <Badge variant="secondary">Auto Enthusiast</Badge>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 sm:mt-0">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="rounded-md"
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-md"
                      onClick={handleEditToggle}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-md"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photoURL">Profile Photo URL</Label>
                        <Input 
                          id="photoURL"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          placeholder="Enter URL to profile photo"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter a direct link to an image for your profile picture.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Display Name</p>
                        <p>{currentUser.displayName || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p>{currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                      {isLoadingComments ? (
                        <p>Loading...</p>
                      ) : (
                        <p>{commentCount} comment{commentCount !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p>{currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* Password Change Section */}
          {isEditing && (
            <>
              <h3 className="text-xl font-semibold mb-4 mt-6">Change Password</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Password Management</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {passwordError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="mt-2"
                    >
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
