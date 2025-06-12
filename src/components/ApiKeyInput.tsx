
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Info, CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const hasEnvKey = !!import.meta.env.VITE_OPENAI_API_KEY;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Key size={20} />
          OpenAI API Configuration
          {hasEnvKey && <CheckCircle size={16} className="text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasEnvKey ? (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-700 dark:text-green-300">
                <p className="font-medium mb-1">API Key Configured via Environment Variables</p>
                <p className="text-xs">Your OpenAI API key is securely loaded from environment variables.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Enhanced Features with OpenAI API:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• AI-powered product ratings and reviews</li>
                    <li>• Smart buying suggestions with price comparisons</li>
                    <li>• Personalized recommendations and analysis</li>
                    <li>• Your API key is stored locally and never sent to our servers</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
