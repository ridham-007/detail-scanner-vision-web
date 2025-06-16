
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Activity, Image as ImageIcon } from 'lucide-react';

interface ProductData {
  barcode: string;
  name: string;
  health_score: number;
  unit: string;
  nutrition_per_100g: {
    calories_kcal: number | null;
    total_fat_g: number | null;
    saturated_fat_g: number | null;
    trans_fat_g: number | null;
    cholesterol_mg: number | null;
    carbohydrates_g: number | null;
    sugar_g: number | null;
    fiber_g: number | null;
    protein_g: number | null;
    salt_mg: number | null;
    vitamin_a_iu: number | null;
    vitamin_c_mg: number | null;
    calcium_mg: number | null;
    iron_mg: number | null;
    potassium_mg: number | null;
    magnesium_mg: number | null;
    zinc_mg: number | null;
    allergens: string[];
    additives: string[];
  };
  positives: string[];
  concerns: string[];
  recommendations: string[];
  images: string[];
}

interface ProductDetailsProps {
  product: ProductData | null;
  isLoading: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, isLoading }) => {
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

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="p-8 space-y-6">
        {/* Product Image */}
        <div className="flex justify-center">
          {product.images && product.images.length > 0 ? (
            <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA3NUgxMjVWMTI1SDc1Vjc1WiIgZmlsbD0iI0Q1RDVENSIvPgo8L3N2Zz4K';
                }}
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon size={48} className="text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Product Name and Health Score */}
        <div className="text-center space-y-3">
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <div className="flex justify-center">
            <Badge className={`${getHealthScoreColor(product.health_score)} border-0 px-4 py-2`}>
              <Activity size={16} className="mr-2" />
              Health Score: {product.health_score}/100
            </Badge>
          </div>
        </div>

        {/* Recommendations */}
        {product.recommendations && product.recommendations.length > 0 ? (
          <>
            <Separator />
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
          </>
        ) : (
          <>
            <Separator />
            <div className="text-center py-8">
              <p className="text-muted-foreground">Data not available for this product</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
