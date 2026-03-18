// app/pricing/page.tsx
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
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
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/pricing/SubscribeButton";
import FAQSection from "@/app/pricing/FAQSection";

export const SUBSCRIPTION_PLANS = {
  pro: {
    planId: "pro_yearly",
    amount: 14.99, // $14.99/year
    razorpayPlanId: "plan_RyBotV05u0dtMH",
  },
  premium: {
    planId: "premium_yearly",
    amount: 29.99, // $29.99/year
    razorpayPlanId: "plan_RyBqWY2wYKtXMX",
  },
} as const;
// Static metadata for SEO
export const metadata: Metadata = {
  title: "Pricing - Affordable Plans for Your Health Journey | EaterIQ",
  description:
    "Choose the right EaterIQ plan for your health journey. Free basics, Pro with unlimited scans, or Premium for families. Simple, transparent pricing.",
  keywords: [
    "EaterIQ pricing",
    "food scanner subscription",
    "nutrition app plans",
    "health app pricing",
    "food tracking subscription",
  ],
  alternates: {
    canonical: "https://www.eateriq.com/pricing/",
  },
  openGraph: {
    type: "website",
    title: "Pricing - Affordable Plans | EaterIQ",
    description:
      "Choose the perfect plan for your health journey. From free basic features to premium family plans.",
    url: "https://www.eateriq.com/pricing/",
    siteName: "EaterIQ",
    images: [
      {
        url: "/og-pricing.png",
        width: 1200,
        height: 630,
        alt: "EaterIQ Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Affordable Plans | EaterIQ",
    description:
      "Choose the perfect plan for your health journey. Start free, upgrade anytime.",
    images: ["/og-pricing.png"],
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
  name: "EaterIQ Pricing",
  description: "Choose the perfect EaterIQ plan for your health journey",
  url: "https://www.eateriq.com/pricing/",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "EaterIQ Free",
          description:
            "Perfect for trying out EaterIQ with 5 scans per day and basic health scores",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "EaterIQ Pro",
          description:
            "For health-conscious individuals with unlimited scans, personalized insights, and ad-free experience",
          offers: {
            "@type": "Offer",
            price: SUBSCRIPTION_PLANS.pro.amount,
            priceCurrency: "USD",
            billingIncrement: "P1Y",
            availability: "https://schema.org/InStock",
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "EaterIQ Premium",
          description:
            "For families and health enthusiasts with family accounts, and nutrition tracking",
          offers: {
            "@type": "Offer",
            price: SUBSCRIPTION_PLANS.premium.amount,
            priceCurrency: "USD",
            billingIncrement: "P1Y",
            availability: "https://schema.org/InStock",
          },
        },
      },
    ],
  },
};

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.eateriq.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: "https://www.eateriq.com/pricing/",
    },
  ],
};

// FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I cancel my EaterIQ subscription anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can cancel your subscription anytime. Your access continues until the end of your billing period.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my data if I downgrade?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your scan history is preserved, but you'll only be able to view the most recent 7 days on the free plan.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer refunds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a 7-day money-back guarantee for new subscribers. Contact support if you're not satisfied.",
      },
    },
    {
      "@type": "Question",
      name: "How do family accounts work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept all major credit cards, debit cards, and UPI payments through our secure payment processor.",
      },
    },
  ],
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
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium" aria-current="page">
              Pricing
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="mb-12 rounded-[32px] border border-white/60 bg-white/82 px-5 py-8 text-center backdrop-blur-sm sm:px-6 sm:py-10">
          <Badge
            className="mb-4 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-orange-800"
            variant="secondary"
          >
            <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
            Simple, transparent pricing
          </Badge>
          <h1 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Choose Your Health Journey
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Unlock powerful features to make informed food choices. Start free,
            upgrade anytime.
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Free Plan */}
          <Card className="relative flex flex-col rounded-[30px] border-white/70 bg-white/88 shadow-product">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
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
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">5 scans per day</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">7-day scan history</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Basic health scores</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Standard ingredient breakdown</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Community support</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-center"
                    aria-hidden="true"
                  >
                    −
                  </span>
                  <span className="text-sm">Limited history</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-center"
                    aria-hidden="true"
                  >
                    −
                  </span>
                  <span className="text-sm">No personalized insights</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/#scanner">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-orange-200/80 bg-white/90"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative flex flex-col rounded-[30px] border-orange-300/80 bg-[linear-gradient(180deg,rgba(255,237,213,0.75),rgba(255,250,244,0.88))] shadow-[var(--shadow-warm)] lg:scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="rounded-full bg-primary px-4 py-1 text-primary-foreground shadow-[var(--shadow-warm)]">
                Most Popular
              </Badge>
            </div>

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-[var(--shadow-soft)]">
                <Star className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>
                For health-conscious individuals
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    ${SUBSCRIPTION_PLANS.pro.amount}
                  </span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  That&apos;s just $
                  {(SUBSCRIPTION_PLANS.pro.amount / 12).toFixed(2)}/month
                </p>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Unlimited scans</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Full scan history forever</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Personalized health insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Allergy &amp; dietary alerts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Shopping list integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Export scan data</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Ad-free experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
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
          <Card className="relative flex flex-col rounded-[30px] border-white/70 bg-white/88 shadow-product">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
                <Crown className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>
                For families &amp; health enthusiasts
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    ${SUBSCRIPTION_PLANS.premium.amount}
                  </span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  That&apos;s just $
                  {(SUBSCRIPTION_PLANS.premium.amount / 12).toFixed(2)}/month
                </p>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Family accounts (up to 5)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Nutrition goal tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Progress reports</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Product comparison tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Early access to new features</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">2x contribution point rewards</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
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
          <h2 className="text-lg font-semibold mb-6">
            Trusted by health-conscious people
          </h2>
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
        <section className="mx-auto mb-16 max-w-5xl">
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Compare Plans
          </h2>

          <div className="overflow-x-auto rounded-[12px] border border-white/40 bg-white/70 backdrop-blur-md shadow-sm">
            <table className="min-w-[680px] w-full border-collapse text-sm sm:text-base">
              {/* HEADER */}
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="text-left py-4 px-5 font-medium">Feature</th>

                  <th className="text-center py-4 px-5 font-medium">Free</th>

                  <th className="text-center py-4 px-5">
                    <div className="inline-flex flex-col items-center">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 mb-1">
                        Most Popular
                      </span>
                      <span className="font-semibold text-foreground">Pro</span>
                    </div>
                  </th>

                  <th className="text-center py-4 px-5 font-medium">Premium</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {[
                  ["Daily Scans", "5", "Unlimited", "Unlimited"],
                  ["Scan History", "7 days", "Forever", "Forever"],
                  ["Personalized Insights", "−", "check", "check"],
                  ["Allergy & Dietary Alerts", "−", "check", "check"],
                  ["Family Accounts", "−", "−", "Up to 5"],
                  ["Priority Support", "−", "check", "check"],
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/40 hover:bg-muted/30 transition"
                  >
                    <td className="py-4 px-5 font-medium text-foreground">
                      {row[0]}
                    </td>

                    {/* Free */}
                    <td className="text-center py-4 px-5 text-muted-foreground">
                      {row[1]}
                    </td>

                    {/* Pro (highlighted) */}
                    <td className="text-center py-4 px-5 bg-orange-50/50 font-semibold text-primary">
                      {row[2] === "check" ? (
                        <Check className="w-4 h-4 mx-auto" />
                      ) : (
                        row[2]
                      )}
                    </td>

                    {/* Premium */}
                    <td className="text-center py-4 px-5">
                      {row[3] === "check" ? (
                        <Check className="w-4 h-4 mx-auto text-primary" />
                      ) : (
                        row[3]
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <section className="mx-auto mb-16 max-w-4xl rounded-[32px] border border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] p-6 text-center shadow-product sm:p-8">
          <h2 className="mb-4 text-2xl font-bold">
            Ready to Start Your Health Journey?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Try EaterIQ free today. No credit card required. Upgrade anytime to
            unlock premium features and take control of your nutrition.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/#scanner" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full rounded-full bg-primary shadow-[var(--shadow-warm)] hover:bg-primary/90"
              >
                <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
                Try Free Scanner
              </Button>
            </Link>
            <Link href="/quiz/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-orange-200/80 bg-white/90"
              >
                <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
                Take a Quiz
              </Button>
            </Link>
          </div>
        </section>

        {/* Related Links */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">
            Explore EaterIQ
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/#scanner" className="group">
              <Card className="h-full rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
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
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/" className="group">
              <Card className="h-full rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                    <BookOpen
                      className="h-5 w-5 text-accent-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      Nutrition Blog
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Expert articles
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>

            <Link href="/quiz/" className="group">
              <Card className="h-full rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                    <Brain
                      className="h-5 w-5 text-secondary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      Quiz Hub
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Test your knowledge
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
