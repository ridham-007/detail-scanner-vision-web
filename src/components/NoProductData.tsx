import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductSubmissionForm } from './ProductSubmissionForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NoProductDataProps {
  barcode?: string;
}

const NoProductData: React.FC<NoProductDataProps> = ({ barcode }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Package size={40} className="text-muted-foreground/60" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Product Not Found
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We couldn't find this product in our database. Help us grow by adding it!
            </p>
          </div>

          {barcode && (
            <Collapsible open={showForm} onOpenChange={setShowForm}>
              <CollapsibleTrigger asChild>
                <Button className="w-full" variant={showForm ? 'outline' : 'default'}>
                  {showForm ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide Form
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add This Product
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <ProductSubmissionForm 
                  barcode={barcode} 
                  onSuccess={() => setShowForm(false)}
                  onCancel={() => setShowForm(false)}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* What happens next */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
            <h4 className="font-medium text-foreground text-sm">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your submission goes to our review queue</li>
              <li>• Admins verify and approve the product</li>
              <li>• You earn points when approved (members only)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoProductData;
