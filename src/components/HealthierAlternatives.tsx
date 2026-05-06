import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';
import { useHealthierAlternatives } from '@/hooks/useHealthierAlternatives';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthierAlternativesProps {
  barcode: string;
  currentHealthScore: number | null;
}

export const HealthierAlternatives = ({ barcode, currentHealthScore }: HealthierAlternativesProps) => {
  const { data: alternatives, isLoading } = useHealthierAlternatives(barcode, currentHealthScore);

  if (isLoading) {
    return (
      <Card className="w-full animate-fade-in border-0 shadow-lg bg-card">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show section if no alternatives found
  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <Card className="w-full animate-fade-in border-0 shadow-lg bg-card">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <Star size={18} className="text-green-600" />
            <h3 className="text-xl font-semibold tracking-tight text-green-700">
              Healthier Alternatives
            </h3>
          </div>
          <p className="text-muted-foreground">
            Similar products with better health scores in the same category
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((product) => {
            const scoreDiff = currentHealthScore !== null 
              ? product.health_score - currentHealthScore 
              : 0;

            return (
              <div key={product.barcode} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white border border-green-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="space-y-4">
                    {/* Product Image */}
                    {product.images && product.images.length > 0 && (
                      <div className="w-full h-24 flex items-center justify-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-foreground text-base line-clamp-2">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-2">
                        <ArrowRight size={14} className="text-green-600" />
                      </div>
                    </div>
                    
                    {/* Health Score Comparison */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10"></div>
                      <div className="relative p-4 bg-green-50/50 rounded-lg border border-green-200/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Health Score
                            </span>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-600 text-white">
                            {product.health_score}/100
                          </Badge>
                        </div>
                        {scoreDiff > 0 && (
                          <p className="text-xs text-green-600 mt-2">
                            +{scoreDiff} points better than current product
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
