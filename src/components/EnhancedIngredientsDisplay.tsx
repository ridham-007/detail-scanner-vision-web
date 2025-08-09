import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';

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

  if (!ingredients || ingredients.trim() === '') {
    return null;
  }

  // Common harmful additives and allergens for highlighting
  const harmfulAdditives = [
    'sodium nitrite', 'high fructose corn syrup', 'trans fat', 'artificial colors',
    'monosodium glutamate', 'msg', 'sodium benzoate', 'potassium sorbate',
    'bha', 'bht', 'tbhq', 'propyl gallate', 'artificial flavors'
  ];

  const commonAllergens = [
    'milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 
    'wheat', 'soybeans', 'gluten', 'soy', 'dairy'
  ];

  // Process ingredients text to highlight concerning items
  const processIngredients = (text: string): React.ReactNode[] => {
    const words = text.split(/[\s,]+/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      const isHarmful = harmfulAdditives.some(additive => 
        cleanWord.includes(additive.replace(/\s/g, '')) || additive.includes(cleanWord)
      );
      const isAllergen = commonAllergens.some(allergen => 
        cleanWord.includes(allergen) || allergen.includes(cleanWord)
      );

      if (isHarmful) {
        return (
          <span key={`harmful-${index}`} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-1 rounded">
            {word}
          </span>
        );
      }
      if (isAllergen) {
        return (
          <span key={`allergen-${index}`} className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-1 rounded">
            {word}
          </span>
        );
      }
      return <span key={`word-${index}`}>{word}</span>;
    }).reduce<React.ReactNode[]>((prev, curr, index) => {
      if (index === 0) return [curr];
      return [...prev, ' ', curr];
    }, []);
  };

  const ingredientsList = ingredients.split(',').map(ing => ing.trim());
  const displayedIngredients = isExpanded ? ingredientsList : ingredientsList.slice(0, 5);
  const hasMore = ingredientsList.length > 5;

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <List className="h-5 w-5 text-blue-600" />
          Ingredients Analysis
          {(allergens.length > 0 || additives.length > 0) && (
            <Badge variant="secondary" className="text-xs">
              {allergens.length + additives.length} alerts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alerts Section */}
        {(allergens.length > 0 || additives.length > 0) && (
          <div className="space-y-3">
            {allergens.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Allergen Alert</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen, index) => (
                    <Badge key={index} variant="outline" className="border-yellow-300 text-yellow-700 dark:text-yellow-300">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {additives.length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">Additives Found</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {additives.map((additive, index) => (
                    <Badge key={index} variant="outline" className="border-red-300 text-red-700 dark:text-red-300">
                      {additive}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ingredients List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Full Ingredients List</h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">
              {processIngredients(ingredients)}
            </p>
          </div>

          {/* Expand/Collapse for long ingredient lists */}
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show All {ingredientsList.length} Ingredients
                </>
              )}
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Legend:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></span>
              <span>Concerning additives</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded"></span>
              <span>Common allergens</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedIngredientsDisplay;