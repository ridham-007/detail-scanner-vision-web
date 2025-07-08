
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Image as ImageIcon, Star, ArrowRight } from 'lucide-react';
import NoProductData from './NoProductData';
import CircularHealthScore from './CircularHealthScore';
import IngredientsDisplay from './IngredientsDisplay';
import HealthInsights from './HealthInsights';
import ProductFeedback from './ProductFeedback';
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
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
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
                    
                    {/* {product.unit && (
                      <div className="flex justify-center lg:justify-start">
                        <Badge variant="outline" className="text-sm font-medium px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                          Per {product.unit}
                        </Badge>
                      </div>
                    )} */}
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
