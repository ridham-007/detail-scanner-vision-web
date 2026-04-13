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
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'negative':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default:
      return <Minus className="w-5 h-5 text-yellow-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'positive':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    case 'negative':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 60) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50';
  if (score >= 30) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50';
  return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50';
};

const getCardBorderColor = (impact: string) => {
  switch (impact) {
    case 'positive':
      return 'border-l-4 border-l-green-500 hover:border-l-green-600';
    case 'negative':
      return 'border-l-4 border-l-red-500 hover:border-l-red-600';
    default:
      return 'border-l-4 border-l-yellow-500 hover:border-l-yellow-600';
  }
};

export const IngredientAnalysisCard = ({ ingredients }: IngredientAnalysisCardProps) => {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="rounded-lg border border-border/70 bg-muted/30 p-2">
            <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          Ingredient Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Detailed breakdown of ingredients and their health impacts
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl bg-background border transition-colors duration-200 hover:bg-muted/20 ${getCardBorderColor(
                ingredient.impact
              )}`}
            >
              <div className="p-4">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      {getImpactIcon(ingredient.impact)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base leading-tight">
                        {ingredient.ingredient}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {ingredient.short_reason}
                </p>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <Badge 
                    variant="outline" 
                    className={`${getImpactColor(ingredient.impact)} font-medium capitalize`}
                  >
                    {ingredient.impact}
                  </Badge>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getScoreColor(ingredient.score)}`}>
                    <span className="text-xs font-medium">Score:</span>
                    <span className="text-sm font-bold">{ingredient.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
