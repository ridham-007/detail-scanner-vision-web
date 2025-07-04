
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
    <div className="grid gap-4 md:grid-cols-2">
      {/* Positives */}
      {positives && positives.length > 0 && (
        <Card className="w-full animate-fade-in border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              Health Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {positives.map((positive, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-green-700 dark:text-green-300">{positive}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Concerns */}
      {concerns && concerns.length > 0 && (
        <Card className="w-full animate-fade-in border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {concerns.map((concern, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{concern}</p>
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
