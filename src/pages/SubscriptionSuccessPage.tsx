import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import SEOHead from '@/components/SEOHead';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const { checkSubscription, tier } = useSubscription();

  useEffect(() => {
    // Refresh subscription status
    checkSubscription();
  }, [checkSubscription]);

  return (
    <>
      <SEOHead 
        title="Subscription Activated - EaterIQ"
        description="Your EaterIQ subscription has been activated. Start scanning products with your new premium features."
        canonicalUrl="https://www.eateriq.com/subscription-success"
      />
      <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <Card className="border-primary">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to EaterIQ {tier === 'premium' ? 'Premium' : 'Pro'}!</CardTitle>
                <CardDescription className="text-lg">
                  Your subscription has been activated successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 justify-center text-primary mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Your new features are ready</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Unlimited product scans</li>
                    <li>✓ Personalized health insights</li>
                    <li>✓ Full scan history</li>
                    <li>✓ Ad-free experience</li>
                    {tier === 'premium' && (
                      <>
                        <li>✓ Family accounts</li>
                        <li>✓ AI recommendations</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/scanner')}
                  >
                    Start Scanning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/pricing')}
                  >
                    View Your Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
  );
};

export default SubscriptionSuccessPage;
