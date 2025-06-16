
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, AlertTriangle, Lightbulb, Activity, Image as ImageIcon } from 'lucide-react';

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

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const nutritionData = [
    { label: 'Calories', value: product.nutrition_per_100g.calories_kcal, unit: 'kcal' },
    { label: 'Total Fat', value: product.nutrition_per_100g.total_fat_g, unit: 'g' },
    { label: 'Saturated Fat', value: product.nutrition_per_100g.saturated_fat_g, unit: 'g' },
    { label: 'Cholesterol', value: product.nutrition_per_100g.cholesterol_mg, unit: 'mg' },
    { label: 'Carbohydrates', value: product.nutrition_per_100g.carbohydrates_g, unit: 'g' },
    { label: 'Sugar', value: product.nutrition_per_100g.sugar_g, unit: 'g' },
    { label: 'Fiber', value: product.nutrition_per_100g.fiber_g, unit: 'g' },
    { label: 'Protein', value: product.nutrition_per_100g.protein_g, unit: 'g' },
    { label: 'Salt', value: product.nutrition_per_100g.salt_mg, unit: 'mg' },
  ];

  const vitaminsData = [
    { label: 'Vitamin A', value: product.nutrition_per_100g.vitamin_a_iu, unit: 'IU' },
    { label: 'Vitamin C', value: product.nutrition_per_100g.vitamin_c_mg, unit: 'mg' },
    { label: 'Calcium', value: product.nutrition_per_100g.calcium_mg, unit: 'mg' },
    { label: 'Iron', value: product.nutrition_per_100g.iron_mg, unit: 'mg' },
    { label: 'Potassium', value: product.nutrition_per_100g.potassium_mg, unit: 'mg' },
    { label: 'Magnesium', value: product.nutrition_per_100g.magnesium_mg, unit: 'mg' },
    { label: 'Zinc', value: product.nutrition_per_100g.zinc_mg, unit: 'mg' },
  ];

  return (
    <div className="space-y-6">
      <Card className="w-full animate-fade-in">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {product.barcode}
                </Badge>
                <Badge className={`${getHealthScoreColor(product.health_score)} border-0`}>
                  <Activity size={12} className="mr-1" />
                  Health Score: {product.health_score}/100
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {product.images && product.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-600" />
                Product Images
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.positives && product.positives.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Heart size={16} className="text-green-600" />
                  Positives
                </h4>
                <div className="space-y-2">
                  {product.positives.map((positive, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-green-700 dark:text-green-300">{positive}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {product.concerns && product.concerns.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  Concerns
                </h4>
                <div className="space-y-2">
                  {product.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-red-700 dark:text-red-300">{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {product.recommendations && product.recommendations.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lightbulb size={16} className="text-blue-600" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {product.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Nutritional Information (per {product.unit})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">{item.label}:</span>
                  <span className="text-sm">
                    {item.value !== null ? `${item.value} ${item.unit}` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Vitamins & Minerals (per {product.unit})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vitaminsData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">{item.label}:</span>
                  <span className="text-sm">
                    {item.value !== null ? `${item.value} ${item.unit}` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {(product.nutrition_per_100g.allergens.length > 0 || product.nutrition_per_100g.additives.length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Additional Information</h4>
                {product.nutrition_per_100g.allergens.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Allergens:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.nutrition_per_100g.allergens.map((allergen, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {product.nutrition_per_100g.additives.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Additives:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.nutrition_per_100g.additives.map((additive, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {additive}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
