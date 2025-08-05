
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  open, 
  onOpenChange, 
  action = "create quizzes" 
}) => {
  const { signInWithGoogle } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Sign In Required
          </DialogTitle>
          <DialogDescription>
            You need to be signed in to {action}. Join our community to get started!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={signInWithGoogle}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In / Sign Up
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;
