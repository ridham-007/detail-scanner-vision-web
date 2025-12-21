import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Minus } from 'lucide-react';
import { AllergenAnalysis } from '@/types/ProductData';

interface AllergenAnalysisCardProps {
  allergens: AllergenAnalysis[];
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

const getSeverityColor = (score: number) => {
  if (score >= 70) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
};

export const AllergenAnalysisCard = ({ allergens }: AllergenAnalysisCardProps) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Allergen Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allergens.map((allergen, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-start gap-3">
                {getImpactIcon(allergen.impact)}
                <div>
                  <p className="font-medium">{allergen.allergen}</p>
                  <p className="text-sm text-muted-foreground">{allergen.short_reason}</p>
                </div>
              </div>
              <Badge className={getSeverityColor(allergen.severity_score)}>
                Severity: {allergen.severity_score}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
