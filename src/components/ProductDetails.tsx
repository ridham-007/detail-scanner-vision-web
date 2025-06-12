import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, DollarSign, Building, Calendar, Shield } from 'lucide-react';

interface ProductData {
  barcode: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  description: string;
  category: string;
  image?: string;
  manufacturer: string;
  countryOfOrigin: string;
  weight?: string;
  dimensions?: string;
  nutritionalInfo?: string;
  ingredients?: string;
  allergens?: string;
  expiryDate?: string;
  batchNumber?: string;
}

interface ProductDetailsProps {
  product: ProductData | null;
  isLoading: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="h-6 sm:h-7 bg-muted rounded-lg w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 sm:h-40 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="w-full shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center h-32 sm:h-40">
          <div className="text-center space-y-3">
            <div className="p-3 bg-muted/50 rounded-full w-fit mx-auto">
              <Package size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Scan a barcode to view product details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
              {product.name}
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground">
              by <span className="font-medium text-foreground">{product.brand}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 flex items-center gap-1.5">
              <Package size={12} />
              {product.category}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {product.image && (
          <div className="w-full h-48 sm:h-56 lg:h-64 bg-muted rounded-xl overflow-hidden shadow-lg border border-border/50">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Enhanced price and manufacturer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border border-green-200 dark:border-green-800">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">Price</p>
              <span className="font-bold text-lg text-green-800 dark:text-green-200">
                {product.currency} {product.price}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Manufacturer</p>
              <span className="font-medium text-sm text-blue-800 dark:text-blue-200">
                {product.manufacturer}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Enhanced product information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            📊 Product Information
          </h4>
          <div className="grid gap-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground font-medium">Barcode:</span>
              <span className="font-mono text-foreground bg-background px-2 py-1 rounded text-xs">
                {product.barcode}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground font-medium">Country of Origin:</span>
              <span className="text-foreground">{product.countryOfOrigin}</span>
            </div>
            {product.weight && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground font-medium">Weight:</span>
                <span className="text-foreground font-medium">{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground font-medium">Dimensions:</span>
                <span className="text-foreground font-medium">{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Keep existing sections for description, ingredients, allergens, etc. */}
        {product.description && (
          <>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="space-y-3">
              <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                📝 Description
              </h4>
              <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/50">
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </>
        )}

        {product.ingredients && (
          <>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="space-y-3">
              <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                🧪 Ingredients
              </h4>
              <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/50">
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            </div>
          </>
        )}

        {product.allergens && (
          <>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="space-y-3">
              <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <Shield size={18} className="text-orange-600" />
                ⚠️ Allergens
              </h4>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-sm sm:text-base text-orange-800 dark:text-orange-200 font-medium">
                  {product.allergens}
                </p>
              </div>
            </div>
          </>
        )}

        {(product.expiryDate || product.batchNumber) && (
          <>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="space-y-3">
              <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <Calendar size={18} className="text-purple-600" />
                📅 Product Details
              </h4>
              <div className="grid gap-3 text-sm">
                {product.expiryDate && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Expiry Date:</span>
                    <span className="text-purple-800 dark:text-purple-200 font-medium">{product.expiryDate}</span>
                  </div>
                )}
                {product.batchNumber && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Batch Number:</span>
                    <span className="font-mono text-purple-800 dark:text-purple-200 bg-background px-2 py-1 rounded text-xs">
                      {product.batchNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
