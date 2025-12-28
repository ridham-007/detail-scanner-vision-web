import React, { useState } from 'react';
import { Check, Crown, Zap, Sparkles, Star, Users, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, SUBSCRIPTION_PLANS } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

const PricingPage = () => {
  const { user } = useAuth();
  const { tier, subscribed, loading, createOrder } = useSubscription();
  const [isYearly, setIsYearly] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planType: 'pro' | 'premium') => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setProcessingPlan(planType);
    try {
      const planId = isYearly 
        ? SUBSCRIPTION_PLANS[planType].yearly 
        : SUBSCRIPTION_PLANS[planType].monthly;
      await createOrder(planId);
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error && error.message !== 'Payment cancelled') {
        toast.error('Failed to process payment. Please try again.');
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      description: 'Perfect for trying out EaterIQ',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 scans per day',
        '7-day scan history',
        'Basic health scores',
        'Standard ingredient breakdown',
        'Community support',
      ],
      limitations: ['Ads displayed', 'Limited history', 'No personalized insights'],
      popular: false,
      current: tier === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Star,
      description: 'For health-conscious individuals',
      monthlyPrice: 399,
      yearlyPrice: 3199,
      savings: '33% off',
      features: [
        'Unlimited scans',
        'Full scan history forever',
        'Personalized health insights',
        'Allergy & dietary alerts',
        'Shopping list integration',
        'Export scan data',
        'Ad-free experience',
        'Priority support',
      ],
      limitations: [],
      popular: true,
      current: tier === 'pro',
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      description: 'For families & health enthusiasts',
      monthlyPrice: 799,
      yearlyPrice: 6399,
      savings: '33% off',
      features: [
        'Everything in Pro',
        'Family accounts (up to 5)',
        'AI-powered meal recommendations',
        'Nutrition goal tracking',
        'Progress reports',
        'Product comparison tools',
        'Early access to new features',
        '2x contribution point rewards',
        'Exclusive community access',
      ],
      limitations: [],
      popular: false,
      current: tier === 'premium',
    },
  ];

  return (
    <>
      <SEOHead 
        title="Pricing - EaterIQ"
        description="Choose the perfect plan for your health journey. From free basic features to premium family plans."
      />
      <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple, transparent pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Health Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock powerful features to make informed food choices. Start free, upgrade anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : 'text-muted-foreground'}>
              Yearly
            </Label>
            {isYearly && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Save 33%
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : plan.current 
                    ? 'border-primary/50' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.current && subscribed && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-background">
                      Current Plan
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {plan.savings && isYearly && (
                      <Badge variant="secondary" className="mt-2">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center">−</span>
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    {plan.id === 'free' ? (
                      plan.current ? (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Free Forever
                        </Button>
                      )
                    ) : plan.current ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        onClick={() => handleSubscribe(plan.id as 'pro' | 'premium')}
                        disabled={loading || processingPlan !== null}
                      >
                        {processingPlan === plan.id ? 'Processing...' : `Get ${plan.name}`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="text-center mb-16">
            <h3 className="text-lg font-semibold mb-6">Trusted by health-conscious people</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span>10,000+ users</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! Your subscription remains active until the end of your billing period. No automatic renewals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens to my data if I downgrade?</h3>
                <p className="text-muted-foreground">
                  Your scan history is preserved, but you'll only be able to view the most recent 7 days on the free plan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">
                  We offer a 7-day money-back guarantee for new subscribers. Contact support if you're not satisfied.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do family accounts work?</h3>
                <p className="text-muted-foreground">
                  Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights.
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default PricingPage;
