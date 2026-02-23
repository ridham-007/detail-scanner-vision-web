// app/terms/page.tsx
import React from 'react';
import Link from "next/link";
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  ArrowLeft,
  Lock,
  RefreshCw,
  Mail,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
  Gavel,
  Globe,
  CreditCard
} from 'lucide-react';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Terms of Service - User Agreement | EaterIQ',
  description: 'Read EaterIQ\'s Terms of Service. Understand your rights and responsibilities when using our food analysis platform, quiz services, and community features.',
  keywords: ['terms of service', 'user agreement', 'EaterIQ terms', 'legal', 'terms and conditions', 'user rights'],
  alternates: {
    canonical: 'https://www.eateriq.com/terms',
  },
  openGraph: {
    type: 'website',
    title: 'Terms of Service | EaterIQ',
    description: 'Read EaterIQ\'s Terms of Service. Understand your rights and responsibilities when using our platform.',
    url: 'https://www.eateriq.com/terms/',
    siteName: 'EaterIQ',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | EaterIQ',
    description: 'Read EaterIQ\'s Terms of Service. Understand your rights and responsibilities.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      "name": "Terms of Service",
      "item": "https://www.eateriq.com/terms/"
    }
  ]
};

// WebPage schema for terms page
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "EaterIQ Terms of Service",
  "description": "Terms and conditions for using EaterIQ's food analysis platform and quiz services",
  "url": "https://www.eateriq.com/terms/",
  "lastReviewed": "2025-01-25",
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "cssSelector": "main"
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", "h3"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "EaterIQ",
    "url": "https://www.eateriq.com"
  }
};

export default function TermsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">Terms of Service</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Your agreement with EaterIQ
            </p>
          </header>

          {/* Content */}
          <div className="space-y-6">
            {/* Agreement Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  Agreement Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Welcome to EaterIQ! These Terms of Service ("Terms") govern your
                  use of our food analysis platform and quiz services. By accessing 
                  or using EaterIQ, you agree to be bound by these Terms.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> January 25, 2026
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  User Accounts & Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <span className="font-semibold mb-2">Account Creation</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• You must provide accurate and complete information</li>
                    <li>• You are responsible for maintaining account security</li>
                    <li>• One account per person is permitted</li>
                    <li>• You must be at least 13 years old to use our service</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Acceptable Use</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Use EaterIQ for personal, non-commercial purposes</li>
                    <li>• Do not share false or misleading information</li>
                    <li>• Respect other users and maintain a positive community</li>
                    <li>• Do not attempt to reverse engineer or hack our services</li>
                  </ul>
                </section>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" aria-hidden="true" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <span className="font-semibold mb-2">Food Intelligence Features</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Barcode scanning and product analysis</li>
                    <li>• Health scores and nutritional information</li>
                    <li>• Personalized food recommendations</li>
                    <li>• Scanning history and progress tracking</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Quiz Platform</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Educational quizzes on nutrition and food topics</li>
                    <li>• User-created quiz content</li>
                    <li>• Scoring system and leaderboards</li>
                    <li>• Social features and community interaction</li>
                  </ul>
                </section>
              </CardContent>
            </Card>

            {/* Subscription & Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" aria-hidden="true" />
                  Subscription & Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <section>
                  <span className="font-semibold mb-2">Free & Paid Plans</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• EaterIQ offers both free and paid subscription plans</li>
                    <li>• Paid subscriptions are billed annually</li>
                    <li>• You may cancel your subscription at any time</li>
                    <li>• Refunds are available within 7 days of purchase</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Pricing Changes</span>
                  <p className="text-sm text-muted-foreground">
                    We reserve the right to modify our pricing. Existing subscribers 
                    will be notified at least 30 days before any price changes affect 
                    their subscription.
                  </p>
                </section>
              </CardContent>
            </Card>

            {/* Content & Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                  Content & Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <span className="font-semibold mb-2">User-Generated Content</span>
                  <p className="text-sm text-muted-foreground mb-2">
                    When you create quizzes or submit content to EaterIQ:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• You retain ownership of your original content</li>
                    <li>• You grant us a license to use, display, and distribute your content</li>
                    <li>• You are responsible for ensuring your content doesn't infringe others' rights</li>
                    <li>• We may remove content that violates our community guidelines</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Our Intellectual Property</span>
                  <p className="text-sm text-muted-foreground">
                    EaterIQ's technology, algorithms, design, and branding are our
                    intellectual property. You may not copy, modify, or redistribute 
                    our proprietary technology without written permission.
                  </p>
                </section>
              </CardContent>
            </Card>

            {/* Disclaimers & Limitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-red-600" aria-hidden="true" />
                  Disclaimers & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <span className="font-semibold mb-2">Health Information Disclaimer</span>
                  <p className="text-sm text-muted-foreground">
                    EaterIQ provides nutritional information and health scores for
                    educational purposes only. Our analysis should not be considered 
                    medical advice. Always consult healthcare professionals for 
                    dietary and health decisions.
                  </p>
                </section>
                <section>
                  <span className="font-semibold mb-2">Service Availability</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• We strive for 99% uptime but cannot guarantee uninterrupted service</li>
                    <li>• Features may be added, modified, or removed with notice</li>
                    <li>• We are not liable for temporary service interruptions</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Limitation of Liability</span>
                  <p className="text-sm text-muted-foreground">
                    To the maximum extent permitted by law, EaterIQ shall not be
                    liable for any indirect, incidental, special, or consequential
                    damages resulting from your use of our service.
                  </p>
                </section>
              </CardContent>
            </Card>

            {/* Privacy & Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Privacy & Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your privacy is important to us. Please review our{' '}
                  <Link
                    href="/privacy/"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your personal
                  information.
                </p>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You agree not to engage in any of the following:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                  <li>• Using the service for any illegal purpose</li>
                  <li>• Harassing, threatening, or intimidating other users</li>
                  <li>• Uploading malicious code or attempting to hack the platform</li>
                  <li>• Creating fake accounts or impersonating others</li>
                  <li>• Scraping or collecting user data without permission</li>
                  <li>• Circumventing any security measures</li>
                  <li>• Using automated tools to access the service without authorization</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Either party may terminate this agreement at any time:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                  <li>• You may delete your account through the settings page</li>
                  <li>• We may suspend or terminate accounts that violate these terms</li>
                  <li>• Upon termination, your access to the service will be discontinued</li>
                  <li>• Some provisions of these terms may survive termination</li>
                  <li>• You may request a copy of your data before account deletion</li>
                </ul>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-600" aria-hidden="true" />
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with 
                  the laws of India, without regard to its conflict of law provisions. 
                  Any disputes arising from these Terms shall be resolved through 
                  arbitration in accordance with applicable law.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We may update these Terms periodically. Significant changes will
                  be communicated through our platform or via email. Continued use
                  of EaterIQ after changes constitutes acceptance of the updated
                  Terms. We encourage you to review this page regularly.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Questions about these Terms? Contact us through our{' '}
                  <Link
                    href="/support/"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    support page
                  </Link>
                  . We're here to help!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Related Links */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold mb-6 text-center">Related Pages</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link href="/privacy/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Privacy Policy
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        How we protect your data
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/support/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <Mail className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Contact Support
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Get help with your account
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Explore More */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-6 text-center">Explore EaterIQ</h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link href="/scanner/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Scan className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Food Scanner
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/20">
                      <BookOpen className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Nutrition Blog
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/quiz/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary/20">
                      <Brain className="h-4 w-4 text-secondary-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Quiz Hub
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}