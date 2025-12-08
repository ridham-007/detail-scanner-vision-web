import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  needs_revision: { label: 'Needs Revision', icon: AlertCircle, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Submissions</h1>
          <p className="text-muted-foreground">Review and approve user-submitted products</p>
        </div>
        
        <div className="flex gap-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No submissions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            const StatusIcon = statusConfig[submission.status].icon;
            return (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    className="mt-1"
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
                      className="mt-1 w-32"
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
