import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductData } from '@/types/ProductData';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface PersonalizedInsightsProps {
  product: ProductData;
  userPreferences?: {
    dietaryRestrictions?: string[];
    healthGoals?: string[];
    allergies?: string[];
  };
  comparisonData?: {
    lastScanScore?: number;
    averageScore?: number;
  };
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({
  product,
  userPreferences = {},
  comparisonData
}) => {
  const { preferences: userStoredPreferences } = useUserPreferences();
  
  // Use stored preferences if userPreferences prop is not provided
  const activePreferences = userPreferences.dietaryRestrictions ? userPreferences : {
    dietaryRestrictions: userStoredPreferences.dietary,
    healthGoals: userStoredPreferences.health_goal ? [userStoredPreferences.health_goal] : [],
    allergies: userStoredPreferences.allergies
  };
  
  const { dietaryRestrictions = [], healthGoals = [], allergies = [] } = activePreferences;

  // Check for dietary restrictions
  const checkDietaryRestrictions = (): { alerts: string[]; compatible: string[] } => {
    const alerts: string[] = [];
    const compatible: string[] = [];
    
    const ingredients = product.ingredients.toLowerCase();
    const allergens = product.nutrition_per_100g.allergens || [];
    
    dietaryRestrictions.forEach(restriction => {
      switch (restriction.toLowerCase()) {
        case 'vegetarian':
          if (ingredients.includes('meat') || ingredients.includes('chicken') || ingredients.includes('beef')) {
            alerts.push('Contains meat - not vegetarian friendly');
          } else {
            compatible.push('Vegetarian friendly');
          }
          break;
        case 'vegan':
          if (ingredients.includes('milk') || ingredients.includes('egg') || ingredients.includes('honey')) {
            alerts.push('Contains animal products - not vegan friendly');
          } else {
            compatible.push('Appears vegan friendly');
          }
          break;
        case 'gluten-free':
          if (ingredients.includes('wheat') || ingredients.includes('gluten') || allergens.includes('gluten')) {
            alerts.push('Contains gluten');
          } else {
            compatible.push('Appears gluten-free');
          }
          break;
        case 'dairy-free':
          if (ingredients.includes('milk') || ingredients.includes('dairy') || allergens.includes('milk')) {
            alerts.push('Contains dairy');
          } else {
            compatible.push('Appears dairy-free');
          }
          break;
        case 'low-sodium': {
          const sodium = product.nutrition_per_100g.salt_mg || 0;
          if (sodium > 300) {
            alerts.push(`High sodium content: ${sodium}mg`);
          } else {
            compatible.push('Low sodium option');
          }
          break;
        }
      }
    });
    
    return { alerts, compatible };
  };

  // Check for allergen warnings
  const checkAllergens = (): string[] => {
    const warnings: string[] = [];
    const productAllergens = product.nutrition_per_100g.allergens || [];
    
    allergies.forEach(allergy => {
      if (productAllergens.some(allergen => 
        allergen.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(allergen.toLowerCase())
      )) {
        warnings.push(`⚠️ Contains ${allergy} - matches your allergy profile`);
      }
    });
    
    return warnings;
  };

  // Health goal alignment
  const checkHealthGoals = (): { aligned: string[]; conflicting: string[] } => {
    const aligned: string[] = [];
    const conflicting: string[] = [];
    
    const nutrition = product.nutrition_per_100g;
    
    healthGoals.forEach(goal => {
      switch (goal.toLowerCase()) {
        case 'weight-loss':
          if ((nutrition.calories_kcal || 0) < 200) {
            aligned.push('Low calorie - supports weight loss');
          } else if ((nutrition.calories_kcal || 0) > 400) {
            conflicting.push('High calorie content');
          }
          break;
        case 'muscle-building':
          if ((nutrition.protein_g || 0) > 10) {
            aligned.push('High protein - great for muscle building');
          } else {
            conflicting.push('Low protein content');
          }
          break;
        case 'heart-health':
          if ((nutrition.saturated_fat_g || 0) < 3) {
            aligned.push('Low saturated fat - heart healthy');
          } else {
            conflicting.push('High saturated fat content');
          }
          break;
        case 'low-sugar':
          if ((nutrition.sugar_g || 0) < 5) {
            aligned.push('Low sugar content');
          } else {
            conflicting.push('High sugar content');
          }
          break;
      }
    });
    
    return { aligned, conflicting };
  };

  const dietaryCheck = checkDietaryRestrictions();
  const allergenWarnings = checkAllergens();
  const healthGoalCheck = checkHealthGoals();
  
  // Comparison with last scan
  const getComparisonInsight = () => {
    if (!comparisonData?.lastScanScore) return null;
    
    const difference = product.health_score - comparisonData.lastScanScore;
    const percentDiff = Math.abs(difference);
    
    if (Math.abs(difference) < 5) {
      return {
        type: 'neutral',
        message: 'Similar health score to your last scan',
        icon: Target
      };
    } else if (difference > 0) {
      return {
        type: 'positive',
        message: `${percentDiff} points healthier than your last scan!`,
        icon: TrendingUp
      };
    } else {
      return {
        type: 'negative',
        message: `${percentDiff} points less healthy than your last scan`,
        icon: TrendingDown
      };
    }
  };

  const comparisonInsight = getComparisonInsight();
  
  // Don't render if no personalization data
  if (dietaryRestrictions.length === 0 && healthGoals.length === 0 && allergies.length === 0 && !comparisonInsight) {
    return null;
  }

  return (
    <Card className="w-full animate-fade-in border-blue-200 bg-blue-50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold tracking-tight text-blue-800">Personalized Insights</h3>
        </div>

        {/* Allergen Warnings - Most Important */}
        {allergenWarnings.length > 0 && (
          <Alert className="border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="space-y-1">
              {allergenWarnings.map((warning, index) => (
                <div key={index} className="text-red-800 font-medium">
                  {warning}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Comparison with Last Scan */}
        {comparisonInsight && (
          <div className={`p-3 rounded-lg border ${
            comparisonInsight.type === 'positive' ? 'bg-green-50 border-green-200' :
            comparisonInsight.type === 'negative' ? 'bg-orange-50 border-orange-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <comparisonInsight.icon className={`w-4 h-4 ${
                comparisonInsight.type === 'positive' ? 'text-green-600' :
                comparisonInsight.type === 'negative' ? 'text-orange-600' :
                'text-gray-600'
              }`} />
              <span className={`text-sm font-medium ${
                comparisonInsight.type === 'positive' ? 'text-green-800' :
                comparisonInsight.type === 'negative' ? 'text-orange-800' :
                'text-gray-800'
              }`}>
                {comparisonInsight.message}
              </span>
            </div>
          </div>
        )}

        {/* Dietary Restrictions */}
        {dietaryCheck.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-700">Dietary Alerts</h4>
            {dietaryCheck.alerts.map((alert, index) => (
              <Badge key={index} variant="destructive" className="mr-2 mb-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {alert}
              </Badge>
            ))}
          </div>
        )}

        {dietaryCheck.compatible.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-700">Dietary Compatible</h4>
            {dietaryCheck.compatible.map((item, index) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-1 bg-green-100 text-green-800">
                ✓ {item}
              </Badge>
            ))}
          </div>
        )}

        {/* Health Goals */}
        {healthGoalCheck.aligned.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-700">Supports Your Goals</h4>
            {healthGoalCheck.aligned.map((item, index) => (
              <Badge key={index} variant="default" className="mr-2 mb-1">
                🎯 {item}
              </Badge>
            ))}
          </div>
        )}

        {healthGoalCheck.conflicting.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-700">May Conflict With Goals</h4>
            {healthGoalCheck.conflicting.map((item, index) => (
              <Badge key={index} variant="outline" className="mr-2 mb-1 border-orange-300 text-orange-700">
                ⚠️ {item}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsights;
