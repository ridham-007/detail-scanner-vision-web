// app/pricing/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Sparkles,
  Users,
  Shield,
  Clock,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SubscribeButton from '@/components/pricing/SubscribeButton';
import FAQSection from '@/app/pricing/FAQSection';
import Breadcrumbs from '@/components/Breadcrumbs';

export const SUBSCRIPTION_PLANS = {
  pro_monthly: {
    planId:         'pro_monthly',
    amount:         280,
    razorpayPlanId: 'plan_SScmVPb0bTd8vZ',
  },
  pro_yearly: {
    planId:         'pro_yearly',
    amount:         1350,
    razorpayPlanId: 'plan_SSclqfflKDBytG',
  },
} as const;

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Pricing - Affordable Plans for Your Health Journey | EaterIQ',
  description:
    'Choose the right EaterIQ plan for your health journey. Free basics, Pro with unlimited scans, or Premium for families. Simple, transparent pricing.',
  keywords: [
    'EaterIQ pricing',
    'food scanner subscription',
    'nutrition app plans',
    'health app pricing',
    'food tracking subscription',
  ],
  alternates: { canonical: 'https://www.eateriq.com/pricing/' },
  openGraph: {
    type:        'website',
    title:       'Pricing - Affordable Plans | EaterIQ',
    description: 'Choose the perfect plan for your health journey.',
    url:         'https://www.eateriq.com/pricing/',
    siteName:    'EaterIQ',
    images: [{ url: '/og-pricing.png', width: 1200, height: 630, alt: 'EaterIQ Pricing Plans' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Pricing - Affordable Plans | EaterIQ',
    description: 'Choose the perfect plan for your health journey. Start free, upgrade anytime.',
    images:      ['/og-pricing.png'],
  },
  robots: { index: true, follow: true },
};

// ── Structured data ───────────────────────────────────────────────────────────
// const pricingSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'WebPage',
//   name: 'EaterIQ Pricing',
//   description: 'Choose the perfect EaterIQ plan for your health journey',
//   url: 'https://www.eateriq.com/pricing/',
//   mainEntity: {
//     '@type': 'ItemList',
//     itemListElement: [
//       {
//         '@type': 'ListItem', position: 1,
//         item: {
//           '@type': 'Product', name: 'EaterIQ Pro Monthly',
//           description: 'Unlimited scans, personalized insights, and ad-free experience',
//           offers: { '@type': 'Offer', price: SUBSCRIPTION_PLANS.pro_monthly.amount, priceCurrency: 'INR', billingIncrement: 'P1M', availability: 'https://schema.org/InStock' },
//         },
//       },
//       {
//         '@type': 'ListItem', position: 2,
//         item: {
//           '@type': 'Product', name: 'EaterIQ Pro Yearly',
//           description: 'Unlimited scans, personalized insights, and ad-free experience',
//           offers: { '@type': 'Offer', price: SUBSCRIPTION_PLANS.pro_yearly.amount, priceCurrency: 'INR', billingIncrement: 'P1Y', availability: 'https://schema.org/InStock' },
//         },
//       },
//     ],
//   },
// };

// const breadcrumbSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'BreadcrumbList',
//   itemListElement: [
//     { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.eateriq.com/' },
//     { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.eateriq.com/pricing/' },
//   ],
// };

// const faqSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'FAQPage',
//   mainEntity: [
//     {
//       '@type': 'Question', name: 'Can I cancel my EaterIQ subscription anytime?',
//       acceptedAnswer: { '@type': 'Answer', text: 'Yes! You can cancel your subscription anytime. Your access continues until the end of your billing period.' },
//     },
//     {
//       '@type': 'Question', name: 'What happens to my data if I downgrade?',
//       acceptedAnswer: { '@type': 'Answer', text: "Your scan history is preserved, but you'll only be able to view the most recent 7 days on the free plan." },
//     },
//     {
//       '@type': 'Question', name: 'Do you offer refunds?',
//       acceptedAnswer: { '@type': 'Answer', text: "We offer a 7-day money-back guarantee for new subscribers. Contact support if you're not satisfied." },
//     },
//     {
//       '@type': 'Question', name: 'How do family accounts work?',
//       acceptedAnswer: { '@type': 'Answer', text: 'Premium subscribers can invite up to 5 family members. Each member gets their own profile with personalized insights.' },
//     },
//     {
//       '@type': 'Question', name: 'What payment methods do you accept?',
//       acceptedAnswer: { '@type': 'Answer', text: 'We accept all major credit cards, debit cards, and UPI payments through our secure payment processor.' },
//     },
//   ],
// };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <>
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> */}

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <Breadcrumbs items={[{ label: 'Pricing' }]} />

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <header className="mb-10 sm:mb-14 text-center">
            <Badge
              className="mb-4 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-orange-700 text-xs font-medium gap-1.5 inline-flex items-center"
              variant="secondary"
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Simple, transparent pricing
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl  text-gray-900 mb-3 font-bold leading-[1.02] tracking-tight text-foreground ">
              Choose Your{' '}
              <span className="text-primary">Health Journey</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-500">
              Unlock powerful features to make informed food choices. Start free, upgrade anytime.
            </p>
          </header>

          {/* ── Single plan card ──────────────────────────────────────────────── */}
          <div className="mb-14 sm:mb-16">
            <SubscribeButton />
          </div>

          {/* ── Trust badges ──────────────────────────────────────────────────── */}
          <section className="text-center mb-14 sm:mb-16">
            <p className="text-sm font-semibold text-gray-500 mb-5 uppercase tracking-wide">
              Trusted by health-conscious people
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {[
                { icon: Shield, text: 'Secure payments' },
                { icon: Clock,  text: 'Cancel anytime' },
                { icon: Users,  text: '10,000+ users' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-500 text-sm">
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────────────────── */}
          <FAQSection />

          {/* ── CTA banner ────────────────────────────────────────────────────── */}
          <section className="mx-auto mb-14 sm:mb-16 max-w-3xl rounded-3xl border border-orange-100 bg-orange-50 p-6 sm:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
              Ready to Start Your Health Journey?
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm sm:text-base text-gray-500">
              Try EaterIQ free today. No credit card required. Upgrade anytime to unlock premium
              features and take control of your nutrition.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/#scanner" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm"
                >
                  <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
                  Try Free Scanner
                </Button>
              </Link>
              <Link href="/quiz/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-orange-200 text-gray-700 hover:bg-orange-50 font-semibold"
                >
                  <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
                  Take a Quiz
                </Button>
              </Link>
            </div>
          </section>

          {/* ── Explore links ─────────────────────────────────────────────────── */}
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-5 text-center">
              Explore EaterIQ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  href:    '/#scanner',
                  icon:    Scan,
                  title:   'Food Scanner',
                  sub:     'Scan any product',
                },
                {
                  href:    '/blog/',
                  icon:    BookOpen,
                  title:   'Nutrition Blog',
                  sub:     'Expert articles',
                },
                {
                  href:    '/quiz/',
                  icon:    Brain,
                  title:   'Quiz Hub',
                  sub:     'Test your knowledge',
                },
              ].map(({ href, icon: Icon, title, sub }) => (
                <Link key={href} href={href} className="group">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/40 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors truncate">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{sub}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}