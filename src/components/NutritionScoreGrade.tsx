import { Badge } from '@/components/ui/badge';

interface NutritionScoreGradeProps {
  grade: string;
  className?: string;
}

const gradeConfig: Record<string, { label: string; color: string; description: string }> = {
  a: { label: 'A', color: 'bg-green-500 text-white', description: 'Excellent nutritional quality' },
  b: { label: 'B', color: 'bg-lime-500 text-white', description: 'Good nutritional quality' },
  c: { label: 'C', color: 'bg-yellow-500 text-white', description: 'Average nutritional quality' },
  d: { label: 'D', color: 'bg-orange-500 text-white', description: 'Poor nutritional quality' },
  e: { label: 'E', color: 'bg-red-500 text-white', description: 'Very poor nutritional quality' },
};

export const NutritionScoreGrade = ({ grade, className = '' }: NutritionScoreGradeProps) => {
  const normalizedGrade = grade.toLowerCase();
  const config = gradeConfig[normalizedGrade] || gradeConfig['c'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className={`${config.color} text-lg font-bold px-3 py-1`}>
        {config.label}
      </Badge>
      <span className="text-sm text-muted-foreground">{config.description}</span>
    </div>
  );
};
