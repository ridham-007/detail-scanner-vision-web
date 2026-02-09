"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProductSubmission } from '@/hooks/useProductSubmission';
import { ContributorStats } from '@/components/ContributorStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  needs_revision: { label: 'Needs Revision', icon: AlertCircle, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
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
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h1 className="text-xl font-semibold mb-2">Sign In Required</h1>
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Contributions</h1>
          <p className="text-muted-foreground">Track your product submissions and earned rewards</p>
        </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList>
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
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
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
                  <Card key={submission.id}>
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground">{submission.product_name}</h3>
                            <Badge className={statusConfig[submission.status].color}>
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
                            <p className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              <strong>Reviewer Notes:</strong> {submission.review_notes}
                            </p>
                          )}
                        </div>

                        {submission.status === 'approved' && submission.points_awarded && (
                          <div className="text-right">
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
