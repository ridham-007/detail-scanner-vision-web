// components/pricing/PricingClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Crown, 
  Zap, 
  Sparkles, 
  Star, 
  Users, 
  Shield, 
  Clock,
  Scan,
  BookOpen,
  Brain,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, SUBSCRIPTION_PLANS } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export default function PricingClient() {
  const { user } = useAuth();
  const { tier, subscribed, loading, createSubscription } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planType: 'pro' | 'premium') => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setProcessingPlan(planType);
    try {
      await createSubscription(SUBSCRIPTION_PLANS[planType].planId);
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
      price: 0,
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
      price: SUBSCRIPTION_PLANS.pro.amount,
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
      price: SUBSCRIPTION_PLANS.premium.amount,
      features: [
        'Everything in Pro',
        'Family accounts (up to 5)',
        'Meal recommendations',
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
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium" aria-current="page">Pricing</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <header className="text-center mb-12">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
          Simple, transparent pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Choose Your Health Journey
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features to make informed food choices. Start free, upgrade anytime.
        </p>
      </header>

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
                <plan.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    /year
                  </span>
                </div>
                {plan.price > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    That's just ${(plan.price / 12).toFixed(2)}/month
                  </p>
                )}
              </div>

              <div className="space-y-3 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center" aria-hidden="true">−</span>
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
      <section className="text-center mb-16">
        <h2 className="text-lg font-semibold mb-6">Trusted by health-conscious people</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5" aria-hidden="true" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" aria-hidden="true" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" aria-hidden="true" />
            <span>10,000+ users</span>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4 bg-primary/5">Pro</th>
                <th className="text-center py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Daily Scans</td>
                <td className="text-center py-3 px-4">5</td>
                <td className="text-center py-3 px-4 bg-primary/5">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Scan History</td>
                <td className="text-center py-3 px-4">7 days</td>
                <td className="text-center py-3 px-4 bg-primary/5">Forever</td>
                <td className="text-center py-3 px-4">Forever</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Personalized Insights</td>
                <td className="text-center py-3 px-4">−</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Ad-Free</td>
                <td className="text-center py-3 px-4">−</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Family Accounts</td>
                <td className="text-center py-3 px-4">−</td>
                <td className="text-center py-3 px-4 bg-primary/5">−</td>
                <td className="text-center py-3 px-4">Up to 5</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Meal Recommendations</td>
                <td className="text-center py-3 px-4">−</td>
                <td className="text-center py-3 px-4 bg-primary/5">−</td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Priority Support</td>
                <td className="text-center py-3 px-4">−</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-primary mx-auto" aria-hidden="true" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
              Can I cancel anytime?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Yes! You can cancel your subscription anytime. Your access continues until the end of your billing period.
            </div>
          </details>
          
          <details className="group border rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
              What happens to my data if I downgrade?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Your scan history is preserved, but you'll only be able to view the most recent 7 days on the free plan.
            </div>
          </details>
          
          <details className="group border rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
              Do you offer refunds?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              We offer a 7-day money-back guarantee for new subscribers. Contact support if you're not satisfied.
            </div>
          </details>
          
          <details className="group border rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
              How do family accounts work?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights.
            </div>
          </details>
          
          <details className="group border rounded-lg">
            <summary className="p-4 cursor-pointer font-semibold flex items-center justify-between">
              What payment methods do you accept?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              We accept all major credit cards, debit cards, and UPI payments through our secure payment processor.
            </div>
          </details>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-16 bg-primary/5 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Try EaterIQ free today. No credit card required. Upgrade anytime to unlock premium features.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/scanner/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
              Try Free Scanner
            </Button>
          </Link>
          <Link href="/quiz/">
            <Button size="lg" variant="outline">
              <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
              Take a Quiz
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Links */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Explore EaterIQ</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/scanner/" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Scan className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Food Scanner
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Scan any product
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/blog/" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <BookOpen className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Nutrition Blog
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expert articles
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/quiz/" className="group">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/20">
                  <Brain className="h-5 w-5 text-secondary-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Quiz Hub
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}