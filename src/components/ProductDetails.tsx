
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
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Scan a barcode to view product details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">by {product.brand}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            <Package size={12} className="mr-1" />
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {product.image && (
          <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-semibold text-lg">
              {product.currency} {product.price}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Building size={16} className="text-blue-600" />
            <span className="text-sm">{product.manufacturer}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-semibold">Product Information</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barcode:</span>
              <span className="font-mono">{product.barcode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country:</span>
              <span>{product.countryOfOrigin}</span>
            </div>
            {product.weight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span>{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span>{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </>
        )}

        {product.ingredients && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Ingredients</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.ingredients}
              </p>
            </div>
          </>
        )}

        {product.allergens && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield size={16} className="text-orange-600" />
                Allergens
              </h4>
              <p className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 p-2 rounded">
                {product.allergens}
              </p>
            </div>
          </>
        )}

        {(product.expiryDate || product.batchNumber) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar size={16} className="text-purple-600" />
                Product Details
              </h4>
              <div className="grid gap-2 text-sm">
                {product.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span>{product.expiryDate}</span>
                  </div>
                )}
                {product.batchNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch:</span>
                    <span className="font-mono">{product.batchNumber}</span>
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
