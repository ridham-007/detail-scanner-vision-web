
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package } from 'lucide-react';

const NoProductData: React.FC = () => {
  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="flex items-center justify-center py-16">
        <div className="text-center space-y-6 max-w-md">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center animate-pulse">
              <Package size={48} className="text-muted-foreground/60" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
              <Search size={16} className="text-orange-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Product Not Found
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We couldn't find this product in our database, but don't worry! 
              We've recorded your request and our team will work on adding it soon.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              What happens next?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your scan has been logged and we'll prioritize adding this product to our database. 
              Try scanning again in a few days!
            </p>
          </div>

          {/* Suggestion */}
          <p className="text-sm text-muted-foreground">
            💡 Try scanning a different product or check if the barcode is clearly visible
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoProductData;
