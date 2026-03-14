// app/pricing/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SubscribeButton from '@/components/pricing/SubscribeButton';
import FAQSection from '@/app/pricing/FAQSection';

export const SUBSCRIPTION_PLANS = {
  pro: {
    planId: 'pro_yearly',
    amount: 14.99, // $14.99/year
    razorpayPlanId: 'plan_RyBotV05u0dtMH',
  },
  premium: {
    planId: 'premium_yearly',
    amount: 29.99, // $29.99/year
    razorpayPlanId: 'plan_RyBqWY2wYKtXMX',
  },
} as const;
// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Pricing - Affordable Plans for Your Health Journey | EaterIQ',
  description: 'Choose the right EaterIQ plan for your health journey. Free basics, Pro with unlimited scans, or Premium for families. Simple, transparent pricing.',
  keywords: ['EaterIQ pricing', 'food scanner subscription', 'nutrition app plans', 'health app pricing', 'food tracking subscription'],
  alternates: {
    canonical: 'https://www.eateriq.com/pricing/',
  },
  openGraph: {
    type: 'website',
    title: 'Pricing - Affordable Plans | EaterIQ',
    description: 'Choose the perfect plan for your health journey. From free basic features to premium family plans.',
    url: 'https://www.eateriq.com/pricing/',
    siteName: 'EaterIQ',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'EaterIQ Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Affordable Plans | EaterIQ',
    description: 'Choose the perfect plan for your health journey. Start free, upgrade anytime.',
    images: ['/og-pricing.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Pricing structured data
const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "EaterIQ Pricing",
  "description": "Choose the perfect EaterIQ plan for your health journey",
  "url": "https://www.eateriq.com/pricing/",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "EaterIQ Free",
          "description": "Perfect for trying out EaterIQ with 5 scans per day and basic health scores",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "EaterIQ Pro",
          "description": "For health-conscious individuals with unlimited scans, personalized insights, and ad-free experience",
          "offers": {
            "@type": "Offer",
            "price": SUBSCRIPTION_PLANS.pro.amount,
            "priceCurrency": "USD",
            "billingIncrement": "P1Y",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "EaterIQ Premium",
          "description": "For families and health enthusiasts with family accounts, and nutrition tracking",
          "offers": {
            "@type": "Offer",
            "price": SUBSCRIPTION_PLANS.premium.amount,
            "priceCurrency": "USD",
            "billingIncrement": "P1Y",
            "availability": "https://schema.org/InStock"
          }
        }
      }
    ]
  }
};

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.eateriq.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pricing",
      "item": "https://www.eateriq.com/pricing/"
    }
  ]
};

// FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I cancel my EaterIQ subscription anytime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can cancel your subscription anytime. Your access continues until the end of your billing period."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to my data if I downgrade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your scan history is preserved, but you'll only be able to view the most recent 7 days on the free plan."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer refunds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 7-day money-back guarantee for new subscribers. Contact support if you're not satisfied."
      }
    },
    {
      "@type": "Question",
      "name": "How do family accounts work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit cards, debit cards, and UPI payments through our secure payment processor."
      }
    }
  ]
};

export default function PricingPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
          {/* Free Plan */}
          <Card className="relative flex flex-col">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out EaterIQ</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">5 scans per day</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">7-day scan history</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Basic health scores</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Standard ingredient breakdown</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Community support</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center" aria-hidden="true">−</span>
                  <span className="text-sm">Limited history</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center" aria-hidden="true">−</span>
                  <span className="text-sm">No personalized insights</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/#scanner">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative flex flex-col border-primary shadow-lg scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For health-conscious individuals</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${SUBSCRIPTION_PLANS.pro.amount}</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  That&apos;s just ${(SUBSCRIPTION_PLANS.pro.amount / 12).toFixed(2)}/month
                </p>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Unlimited scans</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Full scan history forever</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Personalized health insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Allergy &amp; dietary alerts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Shopping list integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Export scan data</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Ad-free experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>

              <div className="mt-6">
                {/* Client Component for Subscribe Button */}
                <SubscribeButton planType="pro" planName="Pro" popular />
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative flex flex-col">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>For families &amp; health enthusiasts</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${SUBSCRIPTION_PLANS.premium.amount}</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  That&apos;s just ${(SUBSCRIPTION_PLANS.premium.amount / 12).toFixed(2)}/month
                </p>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Family accounts (up to 5)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Nutrition goal tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Progress reports</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Product comparison tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Early access to new features</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">2x contribution point rewards</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Exclusive community access</span>
                </div>
              </div>

              <div className="mt-6">
                {/* Client Component for Subscribe Button */}
                <SubscribeButton planType="premium" planName="Premium" />
              </div>
            </CardContent>
          </Card>
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
                  <td className="text-center py-3 px-4 bg-primary/5 font-semibold text-primary">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Scan History</td>
                  <td className="text-center py-3 px-4">7 days</td>
                  <td className="text-center py-3 px-4 bg-primary/5 font-semibold text-primary">Forever</td>
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
                  <td className="py-3 px-4">Allergy &amp; Dietary Alerts</td>
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
                  <td className="text-center py-3 px-4 font-semibold text-primary">Up to 5</td>
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
        <FAQSection />

        {/* CTA Section */}
        <section className="text-center mb-16 bg-primary/5 rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Try EaterIQ free today. No credit card required. Upgrade anytime to unlock premium features and take control of your nutrition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#scanner">
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
            <Link href="/#scanner" className="group">
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
    </>
  );
}