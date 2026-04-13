
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
        <Card className="w-full animate-fade-in border border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-[hsl(var(--benefit))]">
              <div className="rounded-full border border-[hsl(var(--benefit))]/30 bg-[hsl(var(--benefit))]/15 p-2">
                <CheckCircle className="h-6 w-6" />
              </div>
              Health Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positives.map((positive, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-[hsl(var(--benefit))]/20 bg-[hsl(var(--benefit))]/6 p-4">
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
        <Card className="w-full animate-fade-in border border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-[hsl(var(--concern))]">
              <div className="rounded-full border border-[hsl(var(--concern))]/30 bg-[hsl(var(--concern))]/15 p-2">
                <AlertTriangle className="h-6 w-6" />
              </div>
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {concerns.map((concern, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-[hsl(var(--concern))]/20 bg-[hsl(var(--concern))]/6 p-4">
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
