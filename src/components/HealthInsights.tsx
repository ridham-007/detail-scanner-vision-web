
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface HealthInsightsProps {
  positives: string[];
  concerns: string[];
}

const HealthInsights: React.FC<HealthInsightsProps> = ({ positives, concerns }) => {
  if ((!positives || positives.length === 0) && (!concerns || concerns.length === 0)) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Positives */}
      {positives && positives.length > 0 && (
        <Card className="w-full animate-fade-in border-none shadow-lg bg-[hsl(var(--benefit-bg))] dark:bg-[hsl(var(--benefit-bg))]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-[hsl(var(--benefit))]">
              <div className="p-2 rounded-full bg-[hsl(var(--benefit))]/20">
                <CheckCircle className="h-6 w-6" />
              </div>
              Health Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positives.map((positive, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/80 dark:bg-card/50 rounded-xl shadow-sm border border-[hsl(var(--benefit))]/20">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--benefit))] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-[hsl(var(--benefit))] leading-relaxed">{positive}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Concerns */}
      {concerns && concerns.length > 0 && (
        <Card className="w-full animate-fade-in border-none shadow-lg bg-[hsl(var(--concern-bg))] dark:bg-[hsl(var(--concern-bg))]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-[hsl(var(--concern))]">
              <div className="p-2 rounded-full bg-[hsl(var(--concern))]/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {concerns.map((concern, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/80 dark:bg-card/50 rounded-xl shadow-sm border border-[hsl(var(--concern))]/20">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--concern))] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-[hsl(var(--concern))] leading-relaxed">{concern}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthInsights;
