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

  // Enhanced data validation - only show if we have meaningful ingredients data
  if (!ingredients || 
      ingredients.trim() === '' || 
      ingredients.toLowerCase() === 'not available' ||
      ingredients.toLowerCase() === 'n/a' ||
      ingredients.length < 3) {
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
  // const processIngredients = (text: string): React.ReactNode[] => {
  //   const words = text.split(/[\s,]+/);
  //   return words.map((word, index) => {
  //     const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
  //     const isHarmful = harmfulAdditives.some(additive => 
  //       cleanWord.includes(additive.replace(/\s/g, '')) || additive.includes(cleanWord)
  //     );
  //     const isAllergen = commonAllergens.some(allergen => 
  //       cleanWord.includes(allergen) || allergen.includes(cleanWord)
  //     );

  //     if (isHarmful) {
  //       return (
  //         <span key={`harmful-${index}`} className="bg-destructive/20 text-destructive px-1 rounded">
  //           {word}
  //         </span>
  //       );
  //     }
  //     if (isAllergen) {
  //       return (
  //         <span key={`allergen-${index}`} className="bg-accent/20 text-accent-foreground px-1 rounded">
  //           {word}
  //         </span>
  //       );
  //     }
  //     return <span key={`word-${index}`}>{word}</span>;
  //   }).reduce<React.ReactNode[]>((prev, curr, index) => {
  //     if (index === 0) return [curr];
  //     return [...prev, ' ', curr];
  //   }, []);
  // };

  const processIngredients = (text: string): React.ReactNode => {
  return <p className="text-base ">{text}</p>;
  // .text-muted-foreground 
};

  const ingredientsList = ingredients.split(',').map(ing => ing.trim());
  const displayedIngredients = isExpanded ? ingredientsList : ingredientsList.slice(0, 5);
  const hasMore = ingredientsList.length > 5;

  return (
    <Card className="w-full animate-fade-in ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {/* <List className="h-5 w-5 text-primary" /> */}
          <span role="img" aria-label="ingredients">🧪</span>
          Ingredients Analysis
          {(allergens.length > 0 || additives.length > 0) && (
            <Badge variant="secondary" className="text-xs">
              {allergens.length + additives.length} alerts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 ">
        {/* Alerts Section */}
        {(allergens.length > 0 || additives.length > 0) && (
          <div className="space-y-3">
            {allergens.length > 0 && (
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-accent-foreground" />
                  <span className="font-medium text-accent-foreground">Allergen Alert</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen, index) => (
                    <Badge key={index} variant="outline" className="border-accent/30 text-accent-foreground">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {additives.length > 0 && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Additives Found</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {additives.map((additive, index) => (
                    <Badge key={index} variant="outline" className="border-destructive/30 text-destructive">
                      {additive}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ingredients List */}
        <div className="space-y-3  ">
          <h4 className="font-medium text-lg ">Full Ingredients List</h4>
          <div className="p-4 bg-muted/60 rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">
              {processIngredients(ingredients)}
            </p>
          </div>

          {/* Expand/Collapse for long ingredient lists */}
          {/* {hasMore && (
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
          )} */}
        </div>

        {/* Legend */}
        {/* <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Legend:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-destructive/20 rounded"></span>
              <span>Concerning additives</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-accent/20 rounded"></span>
              <span>Common allergens</span>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default EnhancedIngredientsDisplay;