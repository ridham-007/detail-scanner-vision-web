import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle, AlertTriangle, Minus } from 'lucide-react';
import { NutritionDataItem } from '@/types/ProductData';

interface NutritionDataCardProps {
  nutritionData: NutritionDataItem[];
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'positive':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'negative':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-yellow-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'positive':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'negative':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

const getProgressColor = (impact: string) => {
  switch (impact) {
    case 'positive':
      return 'bg-green-500';
    case 'negative':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

export const NutritionDataCard = ({ nutritionData }: NutritionDataCardProps) => {
  if (!nutritionData || nutritionData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-blue-500" />
          Detailed Nutrition Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nutritionData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getImpactIcon(item.impact)}
                  <span className="font-medium">{item.nutrient}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{item.value}</span>
                  <Badge className={getImpactColor(item.impact)}>
                    {item.impact}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress
                    value={item.score}
                    className="h-2"
                    indicatorClassName={getProgressColor(item.impact)}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {item.score}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">{item.short_reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
