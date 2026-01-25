// app/scanner/page.tsx
import React from 'react';
import { Metadata } from 'next';
import FoodScannerClient from '@/components/scanner/FoodScannerClient';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Food Scanner - Instant Barcode Nutrition Analysis | EaterIQ',
  description: 'Scan any food barcode to get instant nutrition insights, health scores, ingredient analysis, and personalized recommendations. Free to use.',
  keywords: ['food scanner', 'barcode scanner', 'nutrition analysis', 'health score', 'food insights', 'ingredient checker', 'calorie scanner', 'food label scanner'],
  alternates: {
    canonical: 'https://www.eateriq.com/scanner/',
  },
  openGraph: {
    type: 'website',
    title: 'Food Scanner - Instant Nutrition Analysis | EaterIQ',
    description: 'Scan any food barcode to get instant nutrition insights, health scores, and personalized recommendations.',
    url: 'https://www.eateriq.com/scanner/',
    siteName: 'EaterIQ',
    images: [
      {
        url: '/og-scanner.png',
        width: 1200,
        height: 630,
        alt: 'EaterIQ Food Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Food Scanner - Instant Nutrition Analysis | EaterIQ',
    description: 'Scan any food barcode to get instant nutrition insights and health scores.',
    images: ['/og-scanner.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Structured Data for the tool
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "EaterIQ Food Scanner",
  "description": "Scan any food barcode to get instant nutrition insights, health scores, ingredient analysis, and personalized recommendations.",
  "url": "https://www.eateriq.com/scanner/",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Barcode scanning",
    "Nutrition analysis",
    "Health score calculation",
    "Ingredient breakdown",
    "Personalized recommendations"
  ],
  "screenshot": "https://www.eateriq.com/scanner-screenshot.png",
  "author": {
    "@type": "Organization",
    "name": "EaterIQ",
    "url": "https://www.eateriq.com"
  }
};

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
      "name": "Food Scanner",
      "item": "https://www.eateriq.com/scanner/"
    }
  ]
};

// FAQ Schema for common questions
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the food scanner work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply point your camera at any food product barcode. EaterIQ analyzes the product's ingredients, nutritional information, and additives to provide you with a comprehensive health score and detailed breakdown."
      }
    },
    {
      "@type": "Question",
      "name": "Is the food scanner free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! EaterIQ's food scanner is free to use. You can scan products and get instant nutrition insights without any cost."
      }
    },
    {
      "@type": "Question",
      "name": "What information does the scanner provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The scanner provides health scores, ingredient analysis, nutritional breakdown, additive warnings, allergen information, and personalized recommendations based on your dietary preferences."
      }
    }
  ]
};

export default function FoodScannerPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Server-rendered SEO content (hidden visually but crawlable) */}
      <section className="sr-only">
        <h1>Food Scanner - Analyze Any Product Instantly</h1>
        <p>
          EaterIQ's free food scanner helps you make healthier food choices. 
          Scan any barcode to get instant nutrition insights, health scores, 
          ingredient analysis, and personalized recommendations.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Instant barcode scanning with your camera</li>
          <li>Comprehensive health score calculation</li>
          <li>Detailed ingredient breakdown and analysis</li>
          <li>Additive and allergen warnings</li>
          <li>Personalized dietary recommendations</li>
          <li>Access to 1M+ products database</li>
        </ul>
        <h2>How It Works</h2>
        <ol>
          <li>Point your camera at any food product barcode</li>
          <li>EaterIQ instantly analyzes the product</li>
          <li>Get a detailed health score and breakdown</li>
          <li>Make informed decisions about what you eat</li>
        </ol>
      </section>

      {/* Client Component for Interactive Functionality */}
      <FoodScannerClient />
    </>
  );
}