import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface NotificationSettings {
  id?: string;
  user_id?: string;
  push_notifications: boolean;
  email_notifications: boolean;
  quiet_hours: boolean;
  scan_reminders: boolean;
  health_insights: boolean;
  product_alerts: boolean;
  weekly_summary: boolean;
  new_features: boolean;
  social_updates: boolean;
}

const defaultSettings: NotificationSettings = {
  push_notifications: true,
  email_notifications: true,
  quiet_hours: false,
  scan_reminders: true,
  health_insights: true,
  product_alerts: true,
  weekly_summary: true,
  new_features: true,
  social_updates: false,
};

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .insert({
          user_id: user.id,
          ...defaultSettings
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, [key]: value };
      
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved"
      });
    } catch (error) {
      console.error('Error updating notification setting:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    updateSetting,
    refetch: fetchSettings
  };
};