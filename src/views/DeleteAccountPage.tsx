"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';

const DeleteAccountPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dataToBeDeleted = [
    'Your profile information (name, avatar, bio)',
    'Scan history and saved products',
    'Favorites and shopping lists',
    'Quiz attempts and scores',
    'Product submissions and contributions',
    'Notification preferences and settings',
    'Active subscriptions (will be cancelled)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!confirmed) {
      toast.error('Please confirm that you understand the deletion is irreversible');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({
          email: email.trim().toLowerCase(),
          user_id: user?.id || null,
          reason: reason.trim() || null,
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Account deletion request submitted successfully');
    } catch (error: unknown) {
      console.error('Error submitting deletion request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_30%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.22))] flex items-center justify-center">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-700">
                <CheckCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl">Request Submitted</CardTitle>
              <CardDescription className="text-base">
                Your account deletion request has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                We will process your request within <strong>7 business days</strong>.
              </p>
              <p className="text-muted-foreground">
                A confirmation email will be sent to <strong>{email}</strong> once your account and all associated data have been deleted.
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                If you have any questions, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Delete Account | EaterIQ"
        description="Request deletion of your EaterIQ account and all associated data."
        canonicalUrl="https://www.eateriq.com/delete-account/"
      />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.14),transparent_30%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.22))]">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'Delete Account' }]} />
          <div className="py-4">
          <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-700">
                <Trash2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Delete Your Account</CardTitle>
              <CardDescription className="text-base">
                Request permanent deletion of your EaterIQ account and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-6 rounded-2xl border-rose-200 bg-rose-50 text-rose-900">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action is irreversible. All your data will be permanently deleted within 7 days.
                </AlertDescription>
              </Alert>

              <div className="mb-6 rounded-[28px] border border-[rgb(var(--accent))]/12 bg-[rgb(var(--accent-soft))]/35 p-5">
                <h3 className="font-semibold mb-3">The following data will be deleted:</h3>
                <ul className="space-y-2">
                  {dataToBeDeleted.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email associated with your account"
                    required
                    disabled={!!user?.email}
                    className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the email address you used to create your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for leaving (optional)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Help us improve by sharing why you're leaving..."
                    rows={3}
                    className="rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                  />
                  <Label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                    I understand that this action is irreversible and all my data will be permanently deleted within 7 days.
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full rounded-full"
                  disabled={loading || !confirmed || !email}
                >
                  {loading ? 'Submitting...' : 'Submit Deletion Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountPage;
