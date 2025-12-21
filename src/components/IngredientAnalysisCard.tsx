import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, CheckCircle, AlertTriangle, Minus } from 'lucide-react';
import { IngredientAnalysis } from '@/types/ProductData';

interface IngredientAnalysisCardProps {
  ingredients: IngredientAnalysis[];
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

const getScoreColor = (score: number) => {
  if (score >= 60) return 'text-green-600 dark:text-green-400';
  if (score >= 30) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const IngredientAnalysisCard = ({ ingredients }: IngredientAnalysisCardProps) => {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Leaf className="w-5 h-5 text-green-500" />
          Ingredient Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-start gap-3">
                {getImpactIcon(ingredient.impact)}
                <div>
                  <p className="font-medium">{ingredient.ingredient}</p>
                  <p className="text-sm text-muted-foreground">{ingredient.short_reason}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={getImpactColor(ingredient.impact)}>
                  {ingredient.impact}
                </Badge>
                <span className={`text-sm font-medium ${getScoreColor(ingredient.score)}`}>
                  Score: {ingredient.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
