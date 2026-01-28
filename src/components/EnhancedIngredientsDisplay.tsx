import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface EnhancedIngredientsDisplayProps {
  ingredients: string;
  allergens?: string[];
  additives?: string[];
}

const EnhancedIngredientsDisplay: React.FC<EnhancedIngredientsDisplayProps> = ({ 
  ingredients, 
  allergens = [], 
  additives = [] 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Enhanced data validation
  if (!ingredients || 
      ingredients.trim() === '' || 
      ingredients.toLowerCase() === 'not available' ||
      ingredients.toLowerCase() === 'n/a' ||
      ingredients.length < 3) {
    return null;
  }

  const ingredientsList = ingredients.split(',').map(ing => ing.trim());
  const displayLimit = 8;
  const displayedIngredients = isExpanded ? ingredientsList : ingredientsList.slice(0, displayLimit);
  const hasMore = ingredientsList.length > displayLimit;
  const hasAlerts = allergens.length > 0 || additives.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* Alert Cards - Top Priority */}
      {hasAlerts && (
        <div className="grid gap-3 md:grid-cols-2">
          {allergens.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-amber-900 text-sm">
                      Allergen Warning
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {allergens.map((allergen, index) => (
                        <Badge 
                          key={index} 
                          className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 text-xs font-medium"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {additives.length > 0 && (
            <Card className="border-rose-200 bg-rose-50/50 shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Shield className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-rose-900 text-sm">
                      Additives Detected
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {additives.map((additive, index) => (
                        <Badge 
                          key={index} 
                          className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 text-xs font-medium"
                        >
                          {additive}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Ingredients Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-2xl" role="img" aria-label="ingredients">🧪</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  {ingredientsList.length} ingredient{ingredientsList.length !== 1 ? 's' : ''} listed
                </p>
              </div>
            </div>
            {hasAlerts && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {allergens.length + additives.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Ingredients Grid */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {displayedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <span className="text-sm text-slate-700 font-medium">
                    {ingredient}
                  </span>
                </div>
              ))}
            </div>

            {/* Expand/Collapse Button */}
            {hasMore && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show {ingredientsList.length - displayLimit} More Ingredients
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedIngredientsDisplay;