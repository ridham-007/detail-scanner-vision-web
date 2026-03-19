"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  User,
  Save,
  Globe,
  MapPin,
  Bell,
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import AvatarUpload from "@/components/AvatarUpload";
import { useRouter } from "next/navigation";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import {
  usePrivacySettings,
  ProfileVisibility,
} from "@/hooks/usePrivacySettings";
import { UserPreferencesForm } from "@/components/UserPreferencesForm";
import SEOHead from "@/components/SEOHead";
import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Breadcrumbs from "@/components/Breadcrumbs";

const UserSettingsPage = () => {
  const { user, session, loading: userLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const {
    settings: notificationSettings,
    loading: notificationLoading,
    saving: notificationSaving,
    updateSetting,
  } = useNotificationSettings();
  const {
    settings: privacySettings,
    loading: privacyLoading,
    saving: privacySaving,
    updateSetting: updatePrivacySetting,
  } = usePrivacySettings();
  const {
    subscribed,
    tier,
    subscriptionEnd,
    cancelAtPeriodEnd,
    loading: subscriptionLoading,
    checkSubscription,
  } = useSubscription();
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user && !userLoading) {
      router.push("/");
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          username: data.username || "",
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfile((prev) => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        username: profile.username.toLowerCase(),
        bio: profile.bio,
        website: profile.website,
        location: profile.location,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!session) return;

    setCancellingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "razorpay-cancel-subscription",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description:
          data.message ||
          "Your subscription will end at the current billing period.",
      });

      // Refresh subscription status
      await checkSubscription();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancellingSubscription(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <SEOHead
        title="Settings | EaterIQ"
        description="Manage your EaterIQ account settings, preferences, notifications, and privacy options."
        keywords="account settings, user preferences, privacy settings, notifications"
        canonicalUrl="https://www.eateriq.com/settings/"
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Settings' }]} />
          <div className="mx-auto">
            <div className="mb-8 rounded-[32px] border border-white/60 bg-white/82 px-6 py-8 text-center shadow-product backdrop-blur-sm">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Settings</h1>
              <p className="mt-3 text-muted-foreground">Manage your account, subscription, notifications, and privacy in one place.</p>
            </div>
            <Tabs defaultValue="profile" className="space-y-6">
              <div className="overflow-x-auto pb-1">
              <TabsList className="grid h-auto min-w-[640px] grid-cols-5 rounded-[24px] bg-orange-50 p-1 shadow-[var(--shadow-soft)]">
                <TabsTrigger
                  value="profile"
                  className="flex min-h-11 items-center gap-2"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sr-only sm:hidden">Profile</span>
                </TabsTrigger>

                <TabsTrigger
                  value="subscription"
                  className="flex min-h-11 items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Subscription</span>
                  <span className="sr-only sm:hidden">Subscription</span>
                </TabsTrigger>

                <TabsTrigger
                  value="preferences"
                  className="flex min-h-11 items-center gap-2"
                >
                  <SettingsIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Preferences</span>
                  <span className="sr-only sm:hidden">Preferences</span>
                </TabsTrigger>

                <TabsTrigger
                  value="notifications"
                  className="flex min-h-11 items-center gap-2"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="sr-only sm:hidden">Notifications</span>
                </TabsTrigger>

                <TabsTrigger
                  value="privacy"
                  className="flex min-h-11 items-center gap-2"
                >
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Privacy</span>
                  <span className="sr-only sm:hidden">Privacy</span>
                </TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value="profile">
                <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
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
                            fallbackText={
                              profile.full_name?.charAt(0)?.toUpperCase() ||
                              user.email?.charAt(0)?.toUpperCase() ||
                              "?"
                            }
                            onAvatarUpdate={handleAvatarUpdate}
                            userId={user.id}
                          />
                          <div className="text-center">
                            <h3 className="text-lg font-semibold">
                              {profile.full_name || "No name set"}
                            </h3>
                            <p className="text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={profile.full_name}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  full_name: e.target.value,
                                })
                              }
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={profile.username}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  username: e.target.value.toLowerCase(),
                                })
                              }
                              placeholder="Enter a unique username (lowercase, alphanumeric, _, -, .)"
                              pattern="^[a-z0-9_.-]+$"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={profile.bio}
                              onChange={(e) =>
                                setProfile({ ...profile, bio: e.target.value })
                              }
                              placeholder="Tell us about yourself"
                              rows={3}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="website"
                              className="flex items-center gap-2"
                            >
                              <Globe className="h-4 w-4" />
                              Website
                            </Label>
                            <Input
                              id="website"
                              type="url"
                              value={profile.website}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  website: e.target.value,
                                })
                              }
                              placeholder="https://your-website.com"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="location"
                              className="flex items-center gap-2"
                            >
                              <MapPin className="h-4 w-4" />
                              Location
                            </Label>
                            <Input
                              id="location"
                              value={profile.location}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  location: e.target.value,
                                })
                              }
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
                          {saving ? "Saving..." : "Save Profile"}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {subscriptionLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        {/* Current Plan */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Current Plan
                          </h3>

                          <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-lg capitalize">
                                  {tier} Plan
                                </p>
                                {subscribed && subscriptionEnd && (
                                  <p className="text-sm text-muted-foreground">
                                    {cancelAtPeriodEnd
                                      ? `Ends on ${new Date(subscriptionEnd).toLocaleDateString()}`
                                      : tier === "free"
                                        ? "Free forever"
                                        : `Renews on ${new Date(subscriptionEnd).toLocaleDateString()}`}
                                  </p>
                                )}
                                {!subscribed && (
                                  <p className="text-sm text-muted-foreground">
                                    You're on the free plan
                                  </p>
                                )}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${cancelAtPeriodEnd
                                  ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                  : subscribed
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                {cancelAtPeriodEnd
                                  ? "Cancelled"
                                  : subscribed
                                    ? "Active"
                                    : "Free"}
                              </div>
                            </div>
                          </div>

                          {!subscribed && (
                            <Button
                              onClick={() => router.push("/pricing")}
                              className="w-full"
                            >
                              Upgrade to Pro or Premium
                            </Button>
                          )}
                        </div>

                        {subscribed &&
                          tier !== "free" &&
                          !cancelAtPeriodEnd && (
                            <>
                              <Separator />

                              {/* Cancel Subscription */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                  Cancel Subscription
                                </h3>

                                <Alert
                                  variant="destructive"
                                  className="bg-destructive/10 border-destructive/30"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>
                                    Cancel your subscription
                                  </AlertTitle>
                                  <AlertDescription>
                                    Your subscription will remain active until
                                    the end of the current billing period (
                                    {subscriptionEnd
                                      ? new Date(
                                        subscriptionEnd,
                                      ).toLocaleDateString()
                                      : "N/A"}
                                    ). After that, you'll be downgraded to the
                                    free plan.
                                  </AlertDescription>
                                </Alert>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      className="w-full"
                                      disabled={cancellingSubscription}
                                    >
                                      {cancellingSubscription
                                        ? "Cancelling..."
                                        : "Cancel Subscription"}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure you want to cancel?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Your subscription will remain active
                                        until{" "}
                                        {subscriptionEnd
                                          ? new Date(
                                            subscriptionEnd,
                                          ).toLocaleDateString()
                                          : "the end of your billing period"}
                                        . After that, you'll lose access to
                                        premium features and be downgraded to
                                        the free plan.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Keep Subscription
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={handleCancelSubscription}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Yes, Cancel Subscription
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}

                        {subscribed && tier !== "free" && cancelAtPeriodEnd && (
                          <>
                            <Separator />

                            {/* Already Cancelled */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-foreground">
                                Subscription Cancelled
                              </h3>

                              <Alert className="bg-orange-500/10 border-orange-500/30">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <AlertTitle className="text-orange-600 dark:text-orange-400">
                                  Your subscription has been cancelled
                                </AlertTitle>
                                <AlertDescription>
                                  You'll continue to have access to {tier}{" "}
                                  features until{" "}
                                  <strong>
                                    {subscriptionEnd
                                      ? new Date(
                                        subscriptionEnd,
                                      ).toLocaleDateString()
                                      : "the end of your billing period"}
                                  </strong>
                                  . After that, you'll be downgraded to the free
                                  plan.
                                </AlertDescription>
                              </Alert>

                              <Button
                                onClick={() => router.push("/pricing")}
                                className="w-full"
                              >
                                Resubscribe
                              </Button>
                            </div>
                          </>
                        )}
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
                          <h3 className="text-lg font-semibold text-foreground">
                            General Settings
                          </h3>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Push Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications on your device
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.push_notifications}
                              onCheckedChange={(checked) =>
                                updateSetting("push_notifications", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Email Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.email_notifications}
                              onCheckedChange={(checked) =>
                                updateSetting("email_notifications", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Quiet Hours
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Disable notifications during quiet hours
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.quiet_hours}
                              onCheckedChange={(checked) =>
                                updateSetting("quiet_hours", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Content Preferences */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Content Preferences
                          </h3>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Scan Reminders
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Get reminded to scan products regularly
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.scan_reminders}
                              onCheckedChange={(checked) =>
                                updateSetting("scan_reminders", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Health Insights
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive personalized health insights
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.health_insights}
                              onCheckedChange={(checked) =>
                                updateSetting("health_insights", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Product Alerts
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Get alerts about products you've scanned
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.product_alerts}
                              onCheckedChange={(checked) =>
                                updateSetting("product_alerts", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Weekly Summary
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive weekly health and scan summaries
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.weekly_summary}
                              onCheckedChange={(checked) =>
                                updateSetting("weekly_summary", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                New Features
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Stay updated with new app features
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.new_features}
                              onCheckedChange={(checked) =>
                                updateSetting("new_features", checked)
                              }
                              disabled={notificationSaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Social Updates
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Get notified about community activity
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.social_updates}
                              onCheckedChange={(checked) =>
                                updateSetting("social_updates", checked)
                              }
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
                          <h3 className="text-lg font-semibold text-foreground">
                            Profile Visibility
                          </h3>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">
                              Who can see your profile?
                            </Label>
                            <RadioGroup
                              value={privacySettings.profile_visibility}
                              onValueChange={(value: ProfileVisibility) =>
                                updatePrivacySetting(
                                  "profile_visibility",
                                  value,
                                )
                              }
                              disabled={privacySaving}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public" className="flex-1">
                                  <div className="space-y-1">
                                    <div className="font-medium">Public</div>
                                    <div className="text-sm text-muted-foreground">
                                      Anyone can see your profile
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="friends" id="friends" />
                                <Label htmlFor="friends" className="flex-1">
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      Friends Only
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Only your friends can see your profile
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private" className="flex-1">
                                  <div className="space-y-1">
                                    <div className="font-medium">Private</div>
                                    <div className="text-sm text-muted-foreground">
                                      Only you can see your profile
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <Separator />

                        {/* Data & Privacy */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Data & Privacy
                          </h3>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Usage Analytics
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Help us improve the app by sharing usage data
                              </p>
                            </div>
                            <Switch
                              checked={privacySettings.usage_analytics}
                              onCheckedChange={(checked) =>
                                updatePrivacySetting("usage_analytics", checked)
                              }
                              disabled={privacySaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Crash Reporting
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically send crash reports to help fix
                                bugs
                              </p>
                            </div>
                            <Switch
                              checked={privacySettings.crash_reporting}
                              onCheckedChange={(checked) =>
                                updatePrivacySetting("crash_reporting", checked)
                              }
                              disabled={privacySaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Location Services
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Allow the app to access your location
                              </p>
                            </div>
                            <Switch
                              checked={privacySettings.location_services}
                              onCheckedChange={(checked) =>
                                updatePrivacySetting(
                                  "location_services",
                                  checked,
                                )
                              }
                              disabled={privacySaving}
                            />
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">
                                Cloud Backup
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Backup your data to the cloud
                              </p>
                            </div>
                            <Switch
                              checked={privacySettings.cloud_backup}
                              onCheckedChange={(checked) =>
                                updatePrivacySetting("cloud_backup", checked)
                              }
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
    </>
  );
};

export default UserSettingsPage;
