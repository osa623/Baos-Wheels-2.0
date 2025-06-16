import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, LogIn, LogOut, Settings, UserCircle, Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { notificationFunctions, Notification } from '@/lib/firebase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns';

// Import mobile fixes CSS
import '@/styles/mobile-fixes.css';

//images
import logo from '@/assets/RoundPhoto_Sep202021_165616.png';

// Get Firestore instances directly like in Notifications.tsx
const db = getFirestore(getApp());
const notificationsCollection = collection(db, 'notifications');

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { currentUser, logOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  
  // Check if the current path matches the link
  const isActive = (path: string) => location.pathname === path;

  // Fetch notifications for the current user - using the same method as Notifications.tsx
  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, skipping notification fetch");
      return;
    }

    console.log("Fetching notifications for user:", currentUser.uid);
    setIsLoadingNotifications(true);
    setNotificationError(null);

    const fetchNotifications = async () => {
      try {
        // Create query with proper imports - directly like in Notifications.tsx
        const q = query(
          notificationsCollection,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        
        console.log(`Fetched ${fetchedNotifications.length} notifications`);
        setNotifications(fetchedNotifications);
        
        // Calculate unread count
        const unread = fetchedNotifications.filter(n => !n.isRead).length;
        console.log(`Found ${unread} unread notifications`);
        setUnreadCount(unread);
        
        setNotificationError(null);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotificationError("Failed to load notifications");
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
    
    // Set up polling for notifications - keep the polling mechanism
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(interval);
      console.log("Cleaned up notification polling");
    };
  }, [currentUser]);

  // Mark all notifications as read using direct Firebase methods
  const markAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    
    try {
      // Get all unread notifications
      const q = query(
        notificationsCollection,
        where('userId', '==', currentUser.uid),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      // No unread notifications
      if (querySnapshot.empty) {
        return;
      }
      
      // Use batch write for better performance
      const batch = writeBatch(db);
      
      querySnapshot.forEach((document) => {
        batch.update(doc(db, 'notifications', document.id), { 
          isRead: true 
        });
      });
      
      await batch.commit();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
      setUnreadCount(0);
      
      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  
  // Mark a specific notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Replace the useEffect for marking all as read with a click handler
  useEffect(() => {
    if (isNotificationsOpen && unreadCount > 0 && currentUser) {
      markAllNotificationsAsRead();
    }
  }, [isNotificationsOpen, unreadCount, currentUser]);

  // Format notification timestamp
  const formatNotificationTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Add a class to the body to prevent scrolling when menu is open
      document.body.classList.add('mobile-menu-open', 'menu-open');
      document.body.style.overflow = 'hidden';
      // Add menu-open class to header for proper z-indexing
      document.querySelector('header')?.classList.add('menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open', 'menu-open');
      document.body.style.overflow = '';
      // Remove menu-open class from header
      document.querySelector('header')?.classList.remove('menu-open');
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('mobile-menu-open', 'menu-open');
      document.body.style.overflow = '';
      document.querySelector('header')?.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await logOut();
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user's display name or email
  const getUserDisplayName = () => {
    if (!currentUser) return null;
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (!displayName) return 'U';
    
    const nameParts = displayName.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  // Add a useEffect to force animation class updates
  useEffect(() => {
    // Force animation refresh by removing and re-adding classes
    const header = document.querySelector('header');
    if (header) {
      header.classList.remove('slide-right', 'slide-back');
      // Trigger reflow
      void header.offsetWidth;
      // Add the appropriate class
      if (isMobileMenuOpen) {
        header.classList.add('slide-right');
      } else {
        header.classList.add('slide-back');
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 py-2 sm:py-3 md:py-4 px-3 sm:px-6 md:px-12 header-layer",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-md shadow-sm",
        "mobile-header", // Mobile header class
        // Remove transition-all to prevent conflicts with animations
      )}
      style={{
        // Apply inline animation style as a backup
        animation: isMobileMenuOpen 
          ? 'headerSlideRight 0.4s cubic-bezier(0.17, 0.67, 0.12, 1.02) forwards' 
          : 'headerSlideBack 0.3s ease forwards'
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - improved mobile sizing */}
        <Link to="/" className="flex items-center transition-transform hover:scale-[1.02] z-10">
          <img src={logo} alt="Baos Wheels Logo" className="h-6 sm:h-7 md:h-8 border-3 sm:border-4 w-6 sm:w-7 md:w-8 rounded-full mr-1 sm:mr-2" />
          <h1 className="text-lg sm:text-xl md:text-lg font-semibold tracking-tight animate-fade-in truncate">
            Baos Wheels
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8" aria-label="Desktop navigation">
          <Link to="/" className={cn("nav-link lg:text-sm md:text-xs", isActive('/') && "text-primary after:w-full")}>
            Home
          </Link>
          <Link to="/community" className={cn("nav-link lg:text-sm md:text-xs", isActive('/community') && "text-primary after:w-full")}>
            Community
          </Link>
          <Link to="/reviews" className={cn("nav-link lg:text-sm md:text-xs", isActive('/reviews') && "text-primary after:w-full")}>
            Car Reviews
          </Link>
          <Link to="/articles" className={cn("nav-link lg:text-sm md:text-xs", isActive('/articles') && "text-primary after:w-full")}>
            Auto Articles
          </Link>
          <Link to="/electric" className={cn("nav-link lg:text-sm md:text-xs", isActive('/electric') && "text-primary after:w-full")}>
            Electric Cars
          </Link>
          <Link to="/about" className={cn("nav-link lg:text-sm md:text-xs", isActive('/about') && "text-primary after:w-full")}>
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/search" className="relative">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary transition-colors">
            <Search className="h-5 w-5" />
          </Button>
          </Link>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-gray-200 hover:bg-gray-300 w-10 h-10 p-0 flex items-center justify-center border-transparent focus:border-transparent focus:ring-0 transform-none"
                  style={{ outline: 'none' }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    {currentUser.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full px-4 hover:bg-secondary transition-colors">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          
          {currentUser && (
            <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer rounded-full hover:bg-secondary transition-colors">
                  {isLoadingNotifications ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {unreadCount > 0 && (
                        <span className="absolute right-0 top-0 rounded-full flex w-5 h-5 items-center justify-center text-center text-xs text-white bg-red-500">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                      <Bell className="h-6 w-6" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-[500px]" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 hover:bg-muted"
                      onClick={markAllNotificationsAsRead}
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                      Mark all as read
                    </Button>
                  )}
                </div>
                <ScrollArea className="max-h-[400px]">
                  {isLoadingNotifications ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : notificationError ? (
                    <div className="px-4 py-6 text-center text-red-500">
                      <p>{notificationError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => {
                          setIsLoadingNotifications(true);
                          notificationFunctions.getAllNotifications(currentUser.uid, 50)
                            .then(notifications => {
                              setNotifications(notifications);
                              setUnreadCount(notifications.filter(n => !n.isRead).length);
                              setNotificationError(null);
                            })
                            .catch(err => {
                              console.error("Retry failed:", err);
                              setNotificationError("Couldn't load notifications");
                            })
                            .finally(() => {
                              setIsLoadingNotifications(false);
                            });
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="px-4 py-3 cursor-default focus:bg-muted">
                        <Link 
                          to={notification.type === 'reply' ? '/community' : '/'} 
                          className="flex items-start space-x-3 w-full"
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {notification.fromUserName?.substring(0, 2).toUpperCase() || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm line-clamp-2">
                              <span className="font-medium">{notification.fromUserName}</span>
                              {notification.type === 'reply' && ' replied to your message: '}
                              {notification.type === 'mention' && ' mentioned you: '}
                              <span className="text-muted-foreground">{notification.contentPreview}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs" asChild>
                    <Link to="/notifications">View All Notifications</Link>
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Actions - Added visible actions to the header */}
        <div className="flex md:hidden items-center space-x-2">
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full p-1 h-8 w-8 relative"
                >
                  {isLoadingNotifications ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {unreadCount > 0 && (
                        <span className="absolute right-0 top-0 rounded-full flex w-4 h-4 items-center justify-center text-center text-[10px] text-white bg-red-500">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                      <Bell className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
                <div className="p-2 text-sm border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <ScrollArea className="max-h-[300px]">
                  {isLoadingNotifications ? (
                    <div className="p-4 flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-2 focus:bg-muted" asChild>
                        <Link to={notification.type === 'reply' ? '/community' : '/'} className="flex items-start space-x-2">
                          <div className={`w-2 h-2 mt-1.5 flex-shrink-0 rounded-full ${!notification.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-xs line-clamp-2">
                              <span className="font-medium">{notification.fromUserName}</span>
                              {notification.type === 'reply' && ' replied: '}
                              <span className="text-muted-foreground">{notification.contentPreview}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
                <div className="p-2 text-center border-t">
                  <Button variant="ghost" size="sm" className="w-full h-7 text-xs" asChild>
                    <Link to="/notifications">View All</Link>
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Improved touch target for mobile search */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full h-8 w-8 p-1"
            onClick={() => window.location.href = '/search'}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu Button - enhanced with higher z-index */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden rounded-full hover:bg-secondary transition-colors z-[10000] ml-1 h-10 w-10 p-2 header-menu-button" 
          onClick={() => {
            console.log("Mobile menu toggled:", !isMobileMenuOpen);
            setIsMobileMenuOpen(!isMobileMenuOpen);
            // Force body class update
            if (!isMobileMenuOpen) {
              document.body.classList.add('mobile-menu-open', 'menu-open');
            } else {
              document.body.classList.remove('mobile-menu-open', 'menu-open');
            }
          }}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Add a backdrop/overlay for the mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99990]" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 99990
            }}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu - completely reworked for better visibility and z-index */}
        <div 
          id="mobile-menu"
          ref={mobileMenuRef}
          className={cn(
            "fixed inset-0 bg-white z-[99999] flex flex-col md:hidden transition-transform duration-300 ease-in-out overflow-auto",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 99999,
            willChange: 'transform',
            maxWidth: '100%',
            width: '100%',
            height: '100%',
            visibility: isMobileMenuOpen ? 'visible' : 'hidden',
            display: 'flex'
          }}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="sticky top-0 flex justify-start px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-[100000]">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full h-10 w-10 p-2 z-[100001]"
              onClick={() => {
                console.log("Close button clicked");
                setIsMobileMenuOpen(false);
                document.body.classList.remove('mobile-menu-open', 'menu-open');
              }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="ml-4 flex-1 text-center font-medium">
              Menu
            </div>
          </div>
          
          {/* Current user display in mobile menu - improved spacing */}
          {currentUser && (
            <div className="flex items-center p-5 border-b border-gray-100">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{getUserDisplayName()}</p>
                {currentUser.email && (
                  <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
                )}
              </div>
            </div>
          )}
        
          {/* Main menu links - better touch targets */}
          <div className="flex flex-col p-5 space-y-1">
            <Link 
              to="/" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/community" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/community') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/reviews" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/reviews') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Car Reviews
            </Link>
            <Link 
              to="/articles" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/articles') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Auto Articles
            </Link>
            <Link 
              to="/electric" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/electric') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Electric Cars
            </Link>
            <Link 
              to="/about" 
              className={cn("text-base font-medium py-3 px-4 rounded-md hover:bg-gray-50", 
                isActive('/about') && "text-primary bg-primary/5")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
          
          {/* User actions - improved layout */}
          <div className="p-5 border-t border-gray-100">
            {currentUser ? (
              <div className="space-y-3">
                <Link 
                  to="/profile" 
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full justify-start">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link 
                  to="/notifications" 
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-start">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Notification section - improved layout */}
          {currentUser && (
            <div className="p-5 border-t border-gray-100">
              <h3 className="text-sm font-medium mb-3">Recent Notifications</h3>
              {isLoadingNotifications ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <Link 
                      key={notification.id} 
                      to={notification.type === 'reply' ? '/community' : '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <Avatar className="h-7 w-7 mr-2 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {notification.fromUserName?.substring(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-1">
                            <span className="font-medium">{notification.fromUserName}</span>
                            {notification.type === 'reply' && ' replied: '}
                            {notification.type === 'mention' && ' mentioned you: '}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {notification.contentPreview}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                    </Link>
                  ))}
                  

                  <Link 
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-sm text-primary hover:underline mt-2"
                  >
                    View all notifications
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">No notifications yet</p>
              )}
            </div>
          )}

          {/* Support info in mobile menu - improved layout */}
          <div className="mt-auto p-5 border-t border-gray-100">
            <p className="text-sm text-muted-foreground mb-3">Need help? Contact us:</p>
            <div className="flex flex-col space-y-2">
              <a href="tel:+1234567890" className="text-sm hover:text-primary">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (123) 456-7890
                </span>
              </a>
              <a href="mailto:support@baoswheels.com" className="text-sm hover:text-primary">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@baoswheels.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
