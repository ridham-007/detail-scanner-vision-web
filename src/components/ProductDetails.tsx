
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Lightbulb, Image as ImageIcon, Star, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import NoProductData from './NoProductData';
import CircularHealthScore from './CircularHealthScore';
import IngredientsDisplay from './IngredientsDisplay';
import HealthInsights from './HealthInsights';
import ProductFeedback from './ProductFeedback';
import { AddToShoppingListModal } from '@/components/AddToShoppingListModal';
import { useFavorites } from '@/hooks/useFavorites';
import { ProductData } from '@/types/ProductData';

interface ProductDetailsProps {
  product: ProductData | null;
  isLoading: boolean;
  showNoDataState?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  isLoading, 
  showNoDataState = false 
}) => {
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
            <div className="max-w-7xl mx-auto px-8 py-16">
              
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute top-20 -right-5 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full animate-pulse opacity-20" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full animate-pulse opacity-25" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 rounded-full animate-pulse opacity-30" style={{animationDelay: '1.5s'}}></div>
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Product Image Skeleton */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 animate-pulse relative">
                        {/* Scanning line effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-600 to-transparent opacity-50 animate-pulse" 
                             style={{animation: 'slide-scan 2s ease-in-out infinite'}}>
                        </div>
                      </div>
                    </div>
                    {/* Floating dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="lg:col-span-5 text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    {/* Title skeleton with shimmer */}
                    <div className="space-y-3">
                      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse w-4/5"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-pulse w-3/5"></div>
                    </div>
                    
                    {/* Stats skeleton */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Score Skeleton */}
                <div className="lg:col-span-3 flex justify-center">
                  <div className="text-center space-y-4">
                    {/* Circular progress skeleton */}
                    <div className="relative w-40 h-40">
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </div>
                      {/* Rotating ring */}
                      <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{animationDuration: '3s'}}></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading text with typing effect */}
              <div className="text-center mt-12">
                <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-lg font-medium">Analyzing product...</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Getting nutritional information and health insights
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showNoDataState) {
    return <NoProductData />;
  }

  if (!product) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center space-y-2">
            <ImageIcon size={48} className="mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">Scan a barcode to view product details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Product Card - Redesigned */}
      <Card className="w-full animate-fade-in overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0">
          {/* Clean Header Section */}
          <div className="relative bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Product Image - Left Side */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative group">
                    <div className="w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:shadow-3xl transition-all duration-500">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA3NUgxMjVWMTI1SDc1Vjc1WiIgZmlsbD0iI0Q1RDVENSIvPgo8L3N2Zz4K';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={80} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Info - Center */}
                <div className="lg:col-span-5 text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                      {product.name}
                    </h1>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                      <Button
                        variant={isFavorite(product.barcode) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isFavorite(product.barcode)) {
                            removeFromFavorites(product.barcode);
                          } else {
                            addToFavorites(product.barcode, product.name, product.health_score);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite(product.barcode) ? 'fill-current' : ''}`} 
                        />
                        {isFavorite(product.barcode) ? 'Favorited' : 'Add to Favorites'}
                      </Button>

                      <AddToShoppingListModal
                        barcode={product.barcode}
                        productName={product.name}
                      >
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Add to List
                        </Button>
                      </AddToShoppingListModal>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {product.is_health_related_product && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {product.positives?.length || 0} Benefits
                          </span>
                        </div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {product.concerns?.length || 0} Concerns
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Health Score - Right Side */}
                {product.is_health_related_product && (
                  <div className="lg:col-span-3 flex justify-center">
                    <div className="text-center space-y-4">
                      <CircularHealthScore score={product.health_score} size={160} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Health Assessment
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Based on nutritional analysis
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Subtle bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <HealthInsights positives={product.positives} concerns={product.concerns} />

      {/* Ingredients */}
      <IngredientsDisplay ingredients={product.ingredients || ''} />

      {/* Recommendations */}
      {product.recommendations && product.recommendations.length > 0 && (
        <Card className="w-full animate-fade-in">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center justify-center gap-2 text-lg">
                <Lightbulb size={20} className="text-blue-600" />
                Recommendations
              </h4>
              <div className="space-y-3">
                {product.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-700 dark:text-blue-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Suggestions */}
      {product.other_good_product_suggestions && product.other_good_product_suggestions.length > 0 && (
        <Card className="w-full animate-fade-in">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Star size={20} className="text-orange-500" />
                Better Alternatives
              </h3>
              <p className="text-muted-foreground">
                Here are some healthier options you might consider
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              {product.other_good_product_suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{suggestion.name}</h4>
                        {suggestion.brand && (
                          <p className="text-sm text-muted-foreground">{suggestion.brand}</p>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <span className="font-medium">Why it's better:</span> {suggestion.why_better}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
            {/* User Feedback Section */}
      <ProductFeedback barcode={product.barcode} />
    </div>
  );
};

export default ProductDetails;
