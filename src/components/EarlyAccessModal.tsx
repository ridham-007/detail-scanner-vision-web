
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EarlyAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to get early access.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('early_access_subscriptions')
        .insert([
          {
            name: formData.name || null,
            email: formData.email.toLowerCase().trim()
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Subscribed",
            description: "You're already on our early access list! We'll notify you when new features launch.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "Welcome to Early Access! 🎉",
          description: "You'll be the first to know about our exciting new features.",
        });
      }
    } catch (error) {
      console.error('Early access subscription error:', error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact our support team.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after close animation
    setTimeout(() => {
      setFormData({ name: '', email: '' });
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-muted/50" />
        
        <div className="relative z-10">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
              {isSuccess ? (
                <CheckCircle className="h-8 w-8 text-white animate-fade-in" />
              ) : (
                <Bell className="h-8 w-8 text-white" />
              )}
            </div>
            <DialogTitle className="!text-center text-2xl font-bold text-primary animate-fade-in">
              {isSuccess ? "You're In!" : "Get Early Access"}
            </DialogTitle>
          </DialogHeader>

          {isSuccess ? (
            <div className="text-center py-4 animate-fade-in">
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Perfect! You're now on our exclusive early access list. We'll send you a personal invitation when these amazing features go live.
              </p>
              <Button
                aria-label="Close"
                onClick={handleClose}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Awesome, Thanks!
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Be the first to experience our game-changing features: AI Meal Planner, Food Community, and Smart Reminders.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 "
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  aria-label="Maybe Later"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  Maybe Later
                </Button>
                <Button
                  aria-label="Get Early Access"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Bell className="mr-2 h-4 w-4" />
                      Get Early Access
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                We respect your privacy. No spam, just exclusive early access to amazing features.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EarlyAccessModal;
