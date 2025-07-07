import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Save, Globe, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import AvatarUpload from '@/components/AvatarUpload';
import { useNavigate } from 'react-router-dom';

const UserSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
        <div className="max-w-2xl mx-auto">
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
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
