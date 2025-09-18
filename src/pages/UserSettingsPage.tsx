import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Save, Globe, MapPin, Bell, Settings as SettingsIcon, Shield, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import AvatarUpload from '@/components/AvatarUpload';
import { useNavigate } from 'react-router-dom';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { usePrivacySettings, ProfileVisibility } from '@/hooks/usePrivacySettings';
import { UserPreferencesForm } from '@/components/UserPreferencesForm';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { settings: notificationSettings, loading: notificationLoading, saving: notificationSaving, updateSetting } = useNotificationSettings();
  const { settings: privacySettings, loading: privacyLoading, saving: privacySaving, updateSetting: updatePrivacySetting } = usePrivacySettings();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
          website: data.website || '',
          location: data.location || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profile.full_name,
          username: profile.username.toLowerCase(),
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <AvatarUpload
                      currentAvatarUrl={profile.avatar_url}
                      fallbackText={profile.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                      onAvatarUpdate={handleAvatarUpdate}
                      userId={user.id}
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{profile.full_name || 'No name set'}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  
                  <div className="grid gap-4">
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase() })}
                        placeholder="Enter a unique username (lowercase, alphanumeric, _, -)"
                        pattern="^[a-z0-9_-]+$"
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://your-website.com"
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="Your location"
                      />
                    </div>
                  </div>

                  <Button 
                    aria-label="Save Profile"
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <UserPreferencesForm />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* General Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">General Settings</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        checked={notificationSettings.push_notifications}
                        onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.email_notifications}
                        onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Quiet Hours</Label>
                        <p className="text-sm text-muted-foreground">Disable notifications during quiet hours</p>
                      </div>
                      <Switch
                        checked={notificationSettings.quiet_hours}
                        onCheckedChange={(checked) => updateSetting('quiet_hours', checked)}
                        disabled={notificationSaving}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Content Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Content Preferences</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Scan Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded to scan products regularly</p>
                      </div>
                      <Switch
                        checked={notificationSettings.scan_reminders}
                        onCheckedChange={(checked) => updateSetting('scan_reminders', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Health Insights</Label>
                        <p className="text-sm text-muted-foreground">Receive personalized health insights</p>
                      </div>
                      <Switch
                        checked={notificationSettings.health_insights}
                        onCheckedChange={(checked) => updateSetting('health_insights', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Product Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get alerts about products you've scanned</p>
                      </div>
                      <Switch
                        checked={notificationSettings.product_alerts}
                        onCheckedChange={(checked) => updateSetting('product_alerts', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Weekly Summary</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly health and scan summaries</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weekly_summary}
                        onCheckedChange={(checked) => updateSetting('weekly_summary', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">New Features</Label>
                        <p className="text-sm text-muted-foreground">Stay updated with new app features</p>
                      </div>
                      <Switch
                        checked={notificationSettings.new_features}
                        onCheckedChange={(checked) => updateSetting('new_features', checked)}
                        disabled={notificationSaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Social Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about community activity</p>
                      </div>
                      <Switch
                        checked={notificationSettings.social_updates}
                        onCheckedChange={(checked) => updateSetting('social_updates', checked)}
                        disabled={notificationSaving}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {privacyLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Profile Visibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Profile Visibility</h3>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Who can see your profile?</Label>
                      <RadioGroup 
                        value={privacySettings.profile_visibility} 
                        onValueChange={(value: ProfileVisibility) => updatePrivacySetting('profile_visibility', value)}
                        disabled={privacySaving}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public" className="flex-1">
                            <div className="space-y-1">
                              <div className="font-medium">Public</div>
                              <div className="text-sm text-muted-foreground">Anyone can see your profile</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="friends" id="friends" />
                          <Label htmlFor="friends" className="flex-1">
                            <div className="space-y-1">
                              <div className="font-medium">Friends Only</div>
                              <div className="text-sm text-muted-foreground">Only your friends can see your profile</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private" className="flex-1">
                            <div className="space-y-1">
                              <div className="font-medium">Private</div>
                              <div className="text-sm text-muted-foreground">Only you can see your profile</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <Separator />

                  {/* Data & Privacy */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Data & Privacy</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Usage Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help us improve the app by sharing usage data</p>
                      </div>
                      <Switch
                        checked={privacySettings.usage_analytics}
                        onCheckedChange={(checked) => updatePrivacySetting('usage_analytics', checked)}
                        disabled={privacySaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Crash Reporting</Label>
                        <p className="text-sm text-muted-foreground">Automatically send crash reports to help fix bugs</p>
                      </div>
                      <Switch
                        checked={privacySettings.crash_reporting}
                        onCheckedChange={(checked) => updatePrivacySetting('crash_reporting', checked)}
                        disabled={privacySaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Personalized Ads</Label>
                        <p className="text-sm text-muted-foreground">Show ads tailored to your interests</p>
                      </div>
                      <Switch
                        checked={privacySettings.personalized_ads}
                        onCheckedChange={(checked) => updatePrivacySetting('personalized_ads', checked)}
                        disabled={privacySaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Location Services</Label>
                        <p className="text-sm text-muted-foreground">Allow the app to access your location</p>
                      </div>
                      <Switch
                        checked={privacySettings.location_services}
                        onCheckedChange={(checked) => updatePrivacySetting('location_services', checked)}
                        disabled={privacySaving}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Cloud Backup</Label>
                        <p className="text-sm text-muted-foreground">Backup your data to the cloud</p>
                      </div>
                      <Switch
                        checked={privacySettings.cloud_backup}
                        onCheckedChange={(checked) => updatePrivacySetting('cloud_backup', checked)}
                        disabled={privacySaving}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
