import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserPreferences, UserPreferences } from '@/hooks/useUserPreferences';
import { Loader2 } from 'lucide-react';

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'dairy_free', label: 'Dairy-Free' },
  { id: 'nut_free', label: 'Nut-Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' }
];

const ALLERGY_OPTIONS = [
  { id: 'nuts', label: 'Nuts' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'soy', label: 'Soy' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'fish', label: 'Fish' },
  { id: 'sesame', label: 'Sesame' }
];

const HEALTH_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_building', label: 'Muscle Building' },
  { value: 'heart_health', label: 'Heart Health' },
  { value: 'general_wellness', label: 'General Wellness' }
];

const PREFERENCE_OPTIONS = [
  { id: 'organic', label: 'Prefer Organic' },
  { id: 'low_sodium', label: 'Low Sodium' },
  { id: 'low_sugar', label: 'Low Sugar' },
  { id: 'high_protein', label: 'High Protein' },
  { id: 'low_calorie', label: 'Low Calorie' }
];

export const UserPreferencesForm = () => {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  const handleDietaryToggle = (dietaryId: string) => {
    const updated = localPreferences.dietary.includes(dietaryId)
      ? localPreferences.dietary.filter(d => d !== dietaryId)
      : [...localPreferences.dietary, dietaryId];
    
    setLocalPreferences({ ...localPreferences, dietary: updated });
  };

  const handleAllergyToggle = (allergyId: string) => {
    const updated = localPreferences.allergies.includes(allergyId)
      ? localPreferences.allergies.filter(a => a !== allergyId)
      : [...localPreferences.allergies, allergyId];
    
    setLocalPreferences({ ...localPreferences, allergies: updated });
  };

  const handlePreferenceToggle = (prefId: string) => {
    const updated = localPreferences.preferences.includes(prefId)
      ? localPreferences.preferences.filter(p => p !== prefId)
      : [...localPreferences.preferences, prefId];
    
    setLocalPreferences({ ...localPreferences, preferences: updated });
  };

  const handleHealthGoalChange = (goal: string) => {
    setLocalPreferences({ ...localPreferences, health_goal: goal === 'none' ? null : goal });
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
  };

  // Update local state when preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Preferences</CardTitle>
        <CardDescription>
          Help us personalize your food scanning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dietary Restrictions */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Dietary Restrictions</Label>
          <div className="grid grid-cols-2 gap-3">
            {DIETARY_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Switch
                  id={option.id}
                  checked={localPreferences.dietary.includes(option.id)}
                  onCheckedChange={() => handleDietaryToggle(option.id)}
                />
                <Label htmlFor={option.id} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Allergies */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Allergies</Label>
          <div className="grid grid-cols-2 gap-3">
            {ALLERGY_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Switch
                  id={`allergy-${option.id}`}
                  checked={localPreferences.allergies.includes(option.id)}
                  onCheckedChange={() => handleAllergyToggle(option.id)}
                />
                <Label htmlFor={`allergy-${option.id}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Health Goal */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Primary Health Goal</Label>
          <Select
            value={localPreferences.health_goal || 'none'}
            onValueChange={handleHealthGoalChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your primary health goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific goal</SelectItem>
              {HEALTH_GOALS.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Other Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Other Preferences</Label>
          <div className="grid grid-cols-2 gap-3">
            {PREFERENCE_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Switch
                  id={`pref-${option.id}`}
                  checked={localPreferences.preferences.includes(option.id)}
                  onCheckedChange={() => handlePreferenceToggle(option.id)}
                />
                <Label htmlFor={`pref-${option.id}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
