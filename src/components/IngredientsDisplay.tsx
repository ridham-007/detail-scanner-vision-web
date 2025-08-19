
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
    <Card className="w-full animate-fade-in border-none shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
          <div className="p-2 rounded-full bg-primary/20">
            <List className="h-6 w-6 text-primary" />
          </div>
          Ingredients List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-muted/30 rounded-2xl border border-border/30">
          <p className="text-base text-foreground leading-relaxed font-medium">
            {ingredients}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientsDisplay;
