"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, AlertCircle, Package, User, Calendar, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Submission {
  id: string;
  barcode: string;
  product_name: string;
  product_description: string | null;
  brand: string | null;
  ingredients: string | null;
  nutrition_data: unknown;
  product_images: string[] | null;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submitted_by: string | null;
  guest_email: string | null;
  guest_name: string | null;
  review_notes: string | null;
  points_awarded: number | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null } | null;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'border-amber-200 bg-amber-50 text-amber-800' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'border-rose-200 bg-rose-50 text-rose-800' },
  needs_revision: { label: 'Needs Revision', icon: AlertCircle, color: 'border-sky-200 bg-sky-50 text-sky-800' },
};

export default function ProductSubmissionsPage() {
  const { user } = useAuth();
  const adminQuery = useIsAdmin();
  const isAdmin = adminQuery.data === true;
  const adminLoading = adminQuery.isLoading;
  const { toast } = useToast();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [pointsAwarded, setPointsAwarded] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin, filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('product_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected' | 'needs_revision') => {
    if (!selectedSubmission || !user) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('product_submissions')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null,
          points_awarded: status === 'approved' ? pointsAwarded : 0,
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      // If approved, also add to scanned_products
      if (status === 'approved') {
        const { error: productError } = await supabase
          .from('scanned_products')
          .upsert({
            barcode: selectedSubmission.barcode,
            name: selectedSubmission.product_name,
            description: selectedSubmission.product_description,
            ingredients: selectedSubmission.ingredients,
            is_published: true,
          }, { onConflict: 'barcode' });

        if (productError) {
          console.error('Error adding to products:', productError);
        }
      }

      toast({
        title: 'Review Submitted',
        description: `Submission ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'sent back for revision'}`,
      });

      setSelectedSubmission(null);
      setReviewNotes('');
      setPointsAwarded(10);
      fetchSubmissions();
    } catch (error) {
      console.error('Error reviewing submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/28 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between sm:px-8">
        <div>
          <p className="inline-flex rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">Admin review</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Product Submissions</h1>
          <p className="text-muted-foreground">Review and approve user-submitted products</p>
        </div>
        
        <div className="flex gap-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-full"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
              <CardContent className="py-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <Card className="rounded-[28px] border-white/70 bg-white/95 shadow-[var(--shadow-soft)]">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No submissions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            const StatusIcon = statusConfig[submission.status].icon;
            return (
              <Card key={submission.id} className="rounded-[28px] border-white/70 bg-white/95 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">{submission.product_name}</h3>
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
                          <User className="w-4 h-4" />
                          {submission.guest_name || 'Member'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(submission.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-[rgb(var(--accent))]/20 bg-white/80"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewNotes(submission.review_notes || '');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[32px] border-white/70 bg-white/95">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Review the product details and approve, reject, or request revisions.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Product Name</Label>
                  <p className="font-medium">{selectedSubmission.product_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Barcode</Label>
                  <p className="font-medium">{selectedSubmission.barcode}</p>
                </div>
                {selectedSubmission.brand && (
                  <div>
                    <Label className="text-muted-foreground">Brand</Label>
                    <p className="font-medium">{selectedSubmission.brand}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Submitted By</Label>
                  <p className="font-medium">
                    {selectedSubmission.guest_name || selectedSubmission.guest_email || 'Member'}
                  </p>
                </div>
              </div>

              {selectedSubmission.product_description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{selectedSubmission.product_description}</p>
                </div>
              )}

              {selectedSubmission.ingredients && (
                <div>
                  <Label className="text-muted-foreground">Ingredients</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedSubmission.ingredients}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <div>
                  <Label htmlFor="review-notes">Review Notes</Label>
                  <Textarea
                    id="review-notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes for the contributor..."
                    className="mt-1 rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                  />
                </div>

                {selectedSubmission.status === 'pending' && selectedSubmission.submitted_by && (
                  <div>
                    <Label htmlFor="points">Points to Award (if approved)</Label>
                    <Input
                      id="points"
                      type="number"
                      min="0"
                      max="100"
                      value={pointsAwarded}
                      onChange={(e) => setPointsAwarded(Number(e.target.value))}
                      className="mt-1 w-32 rounded-2xl border-[rgb(var(--accent))]/15 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedSubmission?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReview('rejected')}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview('needs_revision')}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                  Request Revision
                </Button>
                <Button
                  onClick={() => handleReview('approved')}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
