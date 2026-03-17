"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProductSubmission } from '@/hooks/useProductSubmission';
import { ContributorStats } from '@/components/ContributorStats';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import SEOHead from '@/components/SEOHead';

interface Submission {
  id: string;
  barcode: string;
  product_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  review_notes: string | null;
  points_awarded: number | null;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'border-amber-200 bg-amber-50 text-amber-800' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'border-rose-200 bg-rose-50 text-rose-800' },
  needs_revision: { label: 'Needs Revision', icon: AlertCircle, color: 'border-sky-200 bg-sky-50 text-sky-800' },
};

export default function ContributionsPage() {
  const { user } = useAuth();
  const { getUserSubmissions } = useProductSubmission();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getUserSubmissions();
      setSubmissions(data as Submission[]);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-3xl rounded-[32px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent-foreground))]">
              <Package className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-foreground">Sign In Required</h1>
            <p className="text-muted-foreground">
              Please sign in to view your contributions and earn rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="My Contributions | EaterIQ"
        description="Track your product submissions, earned rewards, and contribution stats on EaterIQ."
        keywords="contributions, product submissions, rewards, badges"
        canonicalUrl="https://www.eateriq.com/contributions/"
      />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/30 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">
            <Package className="h-4 w-4" />
            Community rewards
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">My Contributions</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Track your product submissions, see reviewer feedback, and watch your contributor level grow over time.</p>
        </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="h-auto rounded-full border border-white/70 bg-white/90 p-1 shadow-[var(--shadow-soft)]">
          <TabsTrigger value="stats">Stats & Badges</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <ContributorStats />
        </TabsContent>

        <TabsContent value="submissions">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <Card className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgb(var(--accent-soft))]/60 text-[rgb(var(--accent-foreground))]">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Submissions Yet</h3>
                <p className="text-muted-foreground">
                  When you submit products that aren't in our database, they'll appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {submissions.map((submission) => {
                const StatusIcon = statusConfig[submission.status].icon;
                return (
                  <Card key={submission.id} className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground">{submission.product_name}</h3>
                            <Badge className={`rounded-full border px-3 py-1 ${statusConfig[submission.status].color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[submission.status].label}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {submission.barcode}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(submission.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>

                          {submission.review_notes && (
                            <p className="mt-3 rounded-2xl border border-[rgb(var(--accent))]/15 bg-[rgb(var(--accent-soft))]/45 p-3 text-sm text-muted-foreground">
                              <strong>Reviewer Notes:</strong> {submission.review_notes}
                            </p>
                          )}
                        </div>

                        {submission.status === 'approved' && submission.points_awarded && (
                          <div className="rounded-2xl border border-[rgb(var(--accent))]/15 bg-[rgb(var(--accent-soft))]/45 px-4 py-3 text-right">
                            <span className="text-lg font-bold text-primary">+{submission.points_awarded}</span>
                            <p className="text-xs text-muted-foreground">points earned</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
