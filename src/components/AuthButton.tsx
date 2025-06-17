
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthButton = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} className="bg-gradient-to-r from-emerald-600 to-blue-600">
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Google
    </Button>
  );
};

export default AuthButton;
