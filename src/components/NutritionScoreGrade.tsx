import { Badge } from '@/components/ui/badge';

interface NutritionScoreGradeProps {
  grade: string;
  className?: string;
}

const gradeConfig: Record<string, { label: string; color: string; description: string }> = {
  a: { label: 'A', color: 'border-emerald-200 bg-emerald-50 text-emerald-700', description: 'Excellent nutritional quality' },
  b: { label: 'B', color: 'border-emerald-200 bg-emerald-100 text-emerald-800', description: 'Good nutritional quality' },
  c: { label: 'C', color: 'border-amber-200 bg-amber-50 text-amber-700', description: 'Average nutritional quality' },
  d: { label: 'D', color: 'border-orange-200 bg-orange-50 text-orange-700', description: 'Poor nutritional quality' },
  e: { label: 'E', color: 'border-red-200 bg-red-50 text-red-700', description: 'Very poor nutritional quality' },
};

export const NutritionScoreGrade = ({ grade, className = '' }: NutritionScoreGradeProps) => {
  const normalizedGrade = grade.toLowerCase();
  const config = gradeConfig[normalizedGrade] || gradeConfig['c'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className={`${config.color} text-lg font-bold px-3 py-1 shadow-sm`}>
        {config.label}
      </Badge>
      <span className="text-sm font-medium text-muted-foreground">{config.description}</span>
    </div>
  );
};
