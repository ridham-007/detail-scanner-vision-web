import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useProductSubmission } from '@/hooks/useProductSubmission';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Camera, Award, User, Mail, Loader2, CheckCircle2 } from 'lucide-react';

const guestSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  brand: z.string().max(100).optional(),
  guestName: z.string().min(2, 'Name is required').max(100),
  guestEmail: z.string().email('Valid email is required'),
});

const loggedInSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  brand: z.string().max(100).optional(),
  productDescription: z.string().max(1000).optional(),
  ingredients: z.string().max(2000).optional(),
});

interface ProductSubmissionFormProps {
  barcode: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductSubmissionForm({ barcode, onSuccess, onCancel }: ProductSubmissionFormProps) {
  const { user } = useAuth();
  const { submitProduct, isSubmitting, userTier } = useProductSubmission();
  const [submitted, setSubmitted] = useState(false);

  const schema = user ? loggedInSchema : guestSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: '',
      brand: '',
      productDescription: '',
      ingredients: '',
      guestName: '',
      guestEmail: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const success = await submitProduct({
      barcode,
      productName: values.productName,
      brand: values.brand,
      productDescription: 'productDescription' in values ? values.productDescription : undefined,
      ingredients: 'ingredients' in values ? values.ingredients : undefined,
      guestName: 'guestName' in values ? values.guestName : undefined,
      guestEmail: 'guestEmail' in values ? values.guestEmail : undefined,
    });

    if (success) {
      setSubmitted(true);
      onSuccess?.();
    }
  };

  if (submitted) {
    return (
      <Card className="w-full animate-fade-in">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">Thank You!</h3>
            <p className="text-muted-foreground">
              Your product submission has been received and is pending review.
              {user && ' You\'ll earn points once it\'s approved!'}
            </p>
            {!user && (
              <p className="text-sm text-muted-foreground">
                Create an account to track your contributions and earn rewards!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Add New Product</CardTitle>
              <CardDescription>Help us grow our database</CardDescription>
            </div>
          </div>
          <Badge variant={user ? 'default' : 'secondary'}>
            {userTier === 'verified' ? 'Verified' : userTier === 'logged_in' ? 'Member' : 'Guest'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">Barcode: {barcode}</p>
        </div>

        {user && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Award className="w-4 h-4" />
              <span>Earn 10+ points when your submission is approved!</span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Organic Oat Milk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Oatly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user && (
              <>
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the product..." 
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List ingredients from the package..." 
                          className="resize-none"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {!user && (
              <>
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex gap-3 pt-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Product'
                )}
              </Button>
            </div>
          </form>
        </Form>

        {!user && (
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Sign in to submit more details and earn contribution points!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
