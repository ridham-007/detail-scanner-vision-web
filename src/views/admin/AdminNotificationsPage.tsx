"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Send, Users, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type NotificationType = Database['public']['Enums']['notification_type'];
type NotificationPriority = Database['public']['Enums']['notification_priority'];

interface NotificationForm {
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  action_url: string;
  target: 'all' | 'single';
  user_id: string;
}

const AdminNotificationsPage = () => {
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [form, setForm] = useState<NotificationForm>({
    title: '',
    body: '',
    type: 'product_suggestion',
    priority: 'normal',
    action_url: '',
    target: 'all',
    user_id: '',
  });

  // Fetch all users for targeting
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, username')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  // Fetch recent notifications
  const { data: recentNotifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['admin-recent-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Get unique user IDs and fetch their profiles
      const userIds = [...new Set(data.map(n => n.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
      
      // Map profiles to notifications
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      return data.map(notification => ({
        ...notification,
        profile: profileMap.get(notification.user_id) || null,
      }));
    },
    enabled: !!isAdmin,
  });

  // Send notification mutation
  const sendNotification = useMutation({
    mutationFn: async (notification: NotificationForm) => {
      if (notification.target === 'all') {
        // Send to all users
        const userIds = users?.map(u => u.id) || [];
        const notifications = userIds.map(userId => ({
          user_id: userId,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          priority: notification.priority,
          action_url: notification.action_url || null,
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);
        
        if (error) throw error;
        return { count: userIds.length };
      } else {
        // Send to single user
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: notification.user_id,
            title: notification.title,
            body: notification.body,
            type: notification.type,
            priority: notification.priority,
            action_url: notification.action_url || null,
          });
        
        if (error) throw error;
        return { count: 1 };
      }
    },
    onSuccess: (data) => {
      toast.success(`Notification sent to ${data.count} user(s)`);
      queryClient.invalidateQueries({ queryKey: ['admin-recent-notifications'] });
      setForm({
        title: '',
        body: '',
        type: 'product_suggestion',
        priority: 'normal',
        action_url: '',
        target: 'all',
        user_id: '',
      });
    },
    onError: (error) => {
      toast.error('Failed to send notification');
      console.error('Error sending notification:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Please fill in title and body');
      return;
    }
    
    if (form.target === 'single' && !form.user_id) {
      toast.error('Please select a user');
      return;
    }

    sendNotification.mutate(form);
  };

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    router.replace('/');
    return null;
  }

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: 'scan_reminder', label: 'Scan Reminder' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'health_alert', label: 'Health Alert' },
    { value: 'weekly_summary', label: 'Weekly Summary' },
    { value: 'product_suggestion', label: 'Product Suggestion' },
    { value: 'quiz_challenge', label: 'Quiz Challenge' },
  ];

  const priorityOptions: { value: NotificationPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'secondary' },
    { value: 'normal', label: 'Normal', color: 'default' },
    { value: 'high', label: 'High', color: 'destructive' },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/28 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-primary" />
        <div>
          <p className="inline-flex rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">Admin messaging</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Notification Management</h1>
          <p className="text-muted-foreground">Send notifications to users</p>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Notification Form */}
        <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </CardTitle>
            <CardDescription>
              Create and send notifications to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notification title"
                    required
                    className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Notification message"
                  rows={3}
                    required
                    className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: NotificationType) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(value: NotificationPriority) => setForm({ ...form, priority: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action_url">Action URL (optional)</Label>
                <Input
                  id="action_url"
                  value={form.action_url}
                  onChange={(e) => setForm({ ...form, action_url: e.target.value })}
                  placeholder="/food-scanner or https://example.com"
                  className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Target</Label>
                <Select
                  value={form.target}
                  onValueChange={(value: 'all' | 'single') => setForm({ ...form, target: value, user_id: '' })}
                >
                  <SelectTrigger className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        All Users ({users?.length || 0})
                      </span>
                    </SelectItem>
                    <SelectItem value="single">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Single User
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.target === 'single' && (
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <Select
                    value={form.user_id}
                    onValueChange={(value) => setForm({ ...form, user_id: value })}
                  >
                    <SelectTrigger className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white">
                      <SelectValue placeholder="Choose a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <div className="p-2">
                          <Skeleton className="h-6 w-full" />
                        </div>
                      ) : (
                        users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name || user.email || user.username || user.id.slice(0, 8)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-full" 
                disabled={sendNotification.isPending}
              >
                {sendNotification.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Last 20 notifications sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingNotifications ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-[rgb(var(--accent))]/12 bg-[rgb(var(--accent-soft))]/18 p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : recentNotifications && recentNotifications.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="rounded-2xl border border-[rgb(var(--accent))]/12 bg-[rgb(var(--accent-soft))]/18 p-3 transition-colors hover:bg-[rgb(var(--accent-soft))]/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.body}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant={
                            notification.priority === 'high' ? 'destructive' : 
                            notification.priority === 'low' ? 'secondary' : 'default'
                          }
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                        {notification.is_read && (
                          <Badge variant="outline" className="text-xs">Read</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {notification.type.replace('_', ' ')}
                      </Badge>
                      <span>•</span>
                      <span>
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <p>No notifications sent yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
