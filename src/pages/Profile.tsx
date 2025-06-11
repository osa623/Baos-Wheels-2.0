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

const Profile = () => {
  const { currentUser } = useAuth();
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [fetchComments , setFetchComments] = useState([]);

  //Fetching all the comments posted by the user
  useEffect(()=> {
     
    try{
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
    
});

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
              <Button onClick={() => window.location.href = '/login'}>
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  

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
                <Button variant="outline" size="sm" className="rounded-md">
                  Edit Profile
                </Button>
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

         <h2 className="text-2xl font-semibold mb-6">All the Comments You Posted</h2>
 
                {/* User Activities */}
                    <div className="bg-slate-50 rounded-lg shadow-md p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            
                            {/* Comments Section */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-4">Your Comments</h3>
                                {fetchComments.length > 0 ? (
                                    <ul className="space-y-4">
                                        {fetchComments.map((comment) => (
                                            <li key={comment.id} className="p-4 bg-white rounded-lg shadow-sm">
                                                <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                                                                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No comments found.</p>
                                )}
                            </div>
                        
                        </div>
            
                        

                    </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
