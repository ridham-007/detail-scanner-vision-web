
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 1 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // --- ⏰ Session Timeout Logic ---
  useEffect(() => {
    if (!session) return;

    // 1. Update lastActivity on user interaction
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // 2. Check if session expired
    const checkTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (!lastActivity) return;

      const now = Date.now();
      const diff = now - parseInt(lastActivity);

      if (diff > SESSION_TIMEOUT_MS) {
        console.log("⏳ Session expired due to inactivity");
        signOut();
      }
    };

    // Set initial activity time
    updateActivity();

    // Listen to user events
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    // Check every 1 minute
    const interval = setInterval(checkTimeout, 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [session]); // Only when user is logged in

  const value = {
    user,
    session,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
