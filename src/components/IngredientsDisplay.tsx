
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

interface IngredientsDisplayProps {
  ingredients: string;
}

const IngredientsDisplay: React.FC<IngredientsDisplayProps> = ({ ingredients }) => {
  if (!ingredients || ingredients.trim() === '') {
    return null;
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <List className="h-5 w-5 text-blue-600" />
          Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">
            {ingredients}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientsDisplay;
