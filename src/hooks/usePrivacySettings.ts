import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type ProfileVisibility = 'public' | 'friends' | 'private';

export interface PrivacySettings {
  id?: string;
  user_id?: string;
  profile_visibility: ProfileVisibility;
  usage_analytics: boolean;
  crash_reporting: boolean;
  personalized_ads: boolean;
  location_services: boolean;
  cloud_backup: boolean;
}

const defaultPrivacySettings: PrivacySettings = {
  profile_visibility: 'public',
  usage_analytics: true,
  crash_reporting: true,
  personalized_ads: false,
  location_services: false,
  cloud_backup: true,
};

export const usePrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings>(defaultPrivacySettings);
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
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          ...data,
          profile_visibility: data.profile_visibility as ProfileVisibility
        });
      } else {
        // Create default settings if none exist
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to load privacy settings",
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
        .from('user_privacy_settings')
        .insert({
          user_id: user.id,
          ...defaultPrivacySettings
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          ...data,
          profile_visibility: data.profile_visibility as ProfileVisibility
        });
      }
    } catch (error) {
      console.error('Error creating default privacy settings:', error);
    }
  };

  const updateSetting = async (key: keyof PrivacySettings, value: boolean | ProfileVisibility) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, [key]: value };
      
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved"
      });
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
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