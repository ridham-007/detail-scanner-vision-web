
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Settings, Scan, Trophy, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
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
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Scanner', icon: Scan },
    { path: '/quizzes', label: 'Food IQ Tests', icon: Trophy },
  ];

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
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{username || user.email}</span>
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
            <DropdownMenuItem onClick={() => navigate(`/profile/${username}`)}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
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
            <Button variant="outline" size="sm">
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
        onClick={signInWithGoogle} 
        className="hidden md:flex bg-gradient-to-r from-emerald-600 to-blue-600"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with Google
      </Button>
    </>
  );
};

export default AuthButton;
