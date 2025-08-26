
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Settings, Scan, Trophy, Menu, BookOpen, Shield, ShoppingCart, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const AuthButton = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles').select('username, avatar_url, full_name').eq('id', user.id).single();

      if (data) {
        setUsername(data.username);
        setFullName(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Scanner', icon: Scan },
    { path: '/quizzes', label: 'Food IQ Tests', icon: Trophy },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/history', label: 'History', icon: History },
    { path: '/shopping-lists', label: 'Lists', icon: ShoppingCart },
  ];

  // Debug logging
  console.log('AuthButton - user:', user);
  console.log('AuthButton - navigationItems:', navigationItems);

  const getUserInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  if (loading) {
    return <Button aria-label="Loading..." variant="outline" disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="User Menu" variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-white">
            <Avatar className="h-6 w-6">
              <AvatarImage alt="user avatar" src={avatarUrl || undefined}/>
              <AvatarFallback className="text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{fullName || username || user.email}</span>
            <Menu className="h-4 w-4 md:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Mobile Navigation Items */}
          <div className="md:hidden">
            {navigationItems.map((item) => (
              <DropdownMenuItem 
                key={item.path}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? 'bg-muted' : ''}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
          
          {/* User Menu Items */}
          {username && (
            <DropdownMenuItem onClick={() => navigate(`/profile/${username}`)} className=' hover:!bg-primary hover:!text-white'>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate('/settings')} className=' hover:!bg-primary hover:!text-white'>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          
          {/* Admin Menu Items */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/blogs')} className=' hover:!bg-primary hover:!text-white'>
                <Shield className="h-4 w-4 mr-2" />
                Manage Blogs
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuItem onClick={signOut} className=' hover:!bg-primary hover:!text-white'>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      {/* Mobile Navigation for Non-Authenticated Users */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Mobile Menu" variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {navigationItems.map((item) => (
              <DropdownMenuItem 
                key={item.path}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? 'bg-muted' : ''}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signInWithGoogle}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign in with Google
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Desktop Sign In Button */}
      <Button 
        aria-label="Sign in with Google"
        onClick={signInWithGoogle} 
        className="hidden md:flex bg-primary text-primary-foreground"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with Google
      </Button>
    </>
  );
};

export default AuthButton;
