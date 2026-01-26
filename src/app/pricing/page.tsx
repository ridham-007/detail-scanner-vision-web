// app/pricing/page.tsx
import React from 'react';
import { Metadata } from 'next';
import PricingClient from '@/components/pricing/PricingClient';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Pricing - Affordable Plans for Your Health Journey | EaterIQ',
  description: 'Choose the right EaterIQ plan for your health journey. Free basics, Pro with unlimited scans, or Premium for families. Simple, transparent pricing.',
  keywords: ['EaterIQ pricing', 'food scanner subscription', 'nutrition app plans', 'health app pricing', 'food tracking subscription'],
  alternates: {
    canonical: 'https://www.eateriq.com/pricing',
  },
  openGraph: {
    type: 'website',
    title: 'Pricing - Affordable Plans | EaterIQ',
    description: 'Choose the perfect plan for your health journey. From free basic features to premium family plans.',
    url: 'https://www.eateriq.com/pricing',
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
            "price": "29",
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
          "description": "For families and health enthusiasts with family accounts, meal recommendations, and nutrition tracking",
          "offers": {
            "@type": "Offer",
            "price": "79",
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

      {/* Client Component for Interactive Functionality */}
      <PricingClient />
    </>
  );
}