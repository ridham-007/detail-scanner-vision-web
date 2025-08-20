import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface NutritionData {
  calories_kcal: number | null;
  total_fat_g: number | null;
  saturated_fat_g: number | null;
  carbohydrates_g: number | null;
  sugar_g: number | null;
  fiber_g: number | null;
  protein_g: number | null;
  salt_mg: number | null;
}

interface NutritionComparisonProps {
  nutrition: NutritionData;
  productName: string;
}

// Category averages (mock data - in real app, this would come from your database)
const categoryAverages = {
  calories_kcal: 250,
  total_fat_g: 8,
  saturated_fat_g: 3,
  carbohydrates_g: 35,
  sugar_g: 15,
  fiber_g: 3,
  protein_g: 6,
  salt_mg: 400
};

const NutritionComparison: React.FC<NutritionComparisonProps> = ({
  nutrition,
  productName
}) => {
  // Check if we have meaningful nutrition data
  const hasNutritionData = nutrition && Object.values(nutrition).some(value => 
    value !== null && value !== undefined && value > 0
  );

  // Don't render if no nutrition data is available
  if (!hasNutritionData) {
    return null;
  }
  const nutritionItems = [
    {
      key: 'calories_kcal' as keyof NutritionData,
      label: 'Calories',
      unit: 'kcal',
      goodRange: 'lower',
      color: 'bg-primary'
    },
    {
      key: 'total_fat_g' as keyof NutritionData,
      label: 'Total Fat',
      unit: 'g',
      goodRange: 'moderate',
      color: 'bg-accent'
    },
    {
      key: 'saturated_fat_g' as keyof NutritionData,
      label: 'Saturated Fat',
      unit: 'g',
      goodRange: 'lower',
      color: 'bg-destructive'
    },
    {
      key: 'carbohydrates_g' as keyof NutritionData,
      label: 'Carbohydrates',
      unit: 'g',
      goodRange: 'moderate',
      color: 'bg-secondary'
    },
    {
      key: 'sugar_g' as keyof NutritionData,
      label: 'Sugar',
      unit: 'g',
      goodRange: 'lower',
      color: 'bg-accent'
    },
    {
      key: 'fiber_g' as keyof NutritionData,
      label: 'Fiber',
      unit: 'g',
      goodRange: 'higher',
      color: 'bg-primary'
    },
    {
      key: 'protein_g' as keyof NutritionData,
      label: 'Protein',
      unit: 'g',
      goodRange: 'higher',
      color: 'bg-secondary'
    },
    {
      key: 'salt_mg' as keyof NutritionData,
      label: 'Salt',
      unit: 'mg',
      goodRange: 'lower',
      color: 'bg-muted'
    }
  ];

  const getComparisonPercentage = (value: number | null, average: number) => {
    if (!value) return 0;
    return Math.min((value / (average * 2)) * 100, 100);
  };

  const getComparisonStatus = (value: number | null, average: number, goodRange: string) => {
    if (!value) return { status: 'unknown', difference: 0 };
    
    const difference = ((value - average) / average) * 100;
    
    if (goodRange === 'lower') {
      return {
        status: value < average ? 'better' : 'worse',
        difference: Math.abs(difference)
      };
    } else if (goodRange === 'higher') {
      return {
        status: value > average ? 'better' : 'worse',
        difference: Math.abs(difference)
      };
    } else {
      // moderate range
      return {
        status: Math.abs(difference) < 20 ? 'similar' : difference > 20 ? 'higher' : 'lower',
        difference: Math.abs(difference)
      };
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Nutrition Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How does this product compare to category average?
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nutritionItems.map((item) => {
            const value = nutrition[item.key];
            const average = categoryAverages[item.key];
            const percentage = getComparisonPercentage(value, average);
            const comparison = getComparisonStatus(value, average, item.goodRange);
            
            // Skip items with no meaningful data
            if (!value || value <= 0) return null;

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.label}</span>
                    <Badge 
                      variant={
                        comparison.status === 'better' ? 'default' : 
                        comparison.status === 'worse' ? 'destructive' : 'secondary'
                      }
                      className="text-xs px-2 py-0.5"
                    >
                      {comparison.status === 'better' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {comparison.status === 'worse' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {comparison.difference.toFixed(0)}% {comparison.status}
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold">
                    {value}{item.unit}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0{item.unit}</span>
                    <span className="text-center">Avg: {average}{item.unit}</span>
                    <span>{average * 2}{item.unit}+</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-3 mt-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span>Better than average for this category</span>
              </p>
              <p className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-destructive" />
                <span>Higher than recommended for this category</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionComparison;