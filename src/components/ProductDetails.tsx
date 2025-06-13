import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, DollarSign, Building, Calendar, Shield, Star, StarHalf, ShoppingCart, MapPin, Award } from 'lucide-react';

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
  rating?: number;
  reviewCount?: number;
  buyingSuggestions?: Array<{
    store: string;
    price: string;
    availability: string;
    url?: string;
  }>;
  aiRecommendation?: string;
  nutritionGrade?: string;
  source?: string;
}

interface ProductDetailsProps {
  product: ProductData | null;
  isLoading: boolean;
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" size={size} className="fill-yellow-400 text-yellow-400" />);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} size={size} className="text-gray-300" />);
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

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
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={product.rating} />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                {product.reviewCount && (
                  <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="ml-2">
              <Package size={12} className="mr-1" />
              {product.category}
            </Badge>
            {product.nutritionGrade && (
              <Badge variant={product.nutritionGrade === 'a' || product.nutritionGrade === 'b' ? 'default' : 'destructive'} className="ml-2">
                <Award size={12} className="mr-1" />
                Nutri-Score: {product.nutritionGrade.toUpperCase()}
              </Badge>
            )}
            {product.source && (
              <Badge variant="outline" className="ml-2 text-xs">
                {product.source}
              </Badge>
            )}
          </div>
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

        {product.aiRecommendation && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Star size={16} className="text-blue-600" />
                AI Recommendation
              </h4>
              <p className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                {product.aiRecommendation}
              </p>
            </div>
          </>
        )}

        {product.buyingSuggestions && product.buyingSuggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <ShoppingCart size={16} className="text-green-600" />
                Where to Buy
              </h4>
              <div className="space-y-2">
                {product.buyingSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="font-medium">{suggestion.store}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{suggestion.price}</div>
                      <div className={`text-xs ${
                        suggestion.availability === 'In Stock' ? 'text-green-600' :
                        suggestion.availability === 'Limited' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {suggestion.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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

        {product.nutritionalInfo && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Nutritional Information</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.nutritionalInfo}
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
