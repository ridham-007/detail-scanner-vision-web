// app/privacy/page.tsx
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Lock,
  Database,
  ArrowLeft,
  Cookie,
  Clock,
  UserCheck,
  Mail,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data | EaterIQ",
  description:
    "Learn how EaterIQ protects your privacy and personal data. Read our privacy policy covering data collection, security, cookies, and your rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "EaterIQ privacy",
    "personal data",
    "GDPR",
    "data security",
    "cookie policy",
  ],
  alternates: {
    canonical: "https://www.eateriq.com/privacy",
  },
  openGraph: {
    type: "website",
    title: "Privacy Policy | EaterIQ",
    description:
      "Learn how EaterIQ protects your privacy and handles your personal data.",
    url: "https://www.eateriq.com/privacy/",
    siteName: "EaterIQ",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | EaterIQ",
    description:
      "Learn how EaterIQ protects your privacy and handles your personal data.",
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
      name: "Privacy Policy",
      item: "https://www.eateriq.com/privacy/",
    },
  ],
};

// WebPage schema for privacy policy
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EaterIQ Privacy Policy",
  description:
    "Learn how EaterIQ protects your privacy and handles your personal data",
  url: "https://www.eateriq.com/privacy/",
  lastReviewed: "2026-03-12",
  mainContentOfPage: {
    "@type": "WebPageElement",
    cssSelector: "main",
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", "h3"],
  },
  publisher: {
    "@type": "Organization",
    name: "EaterIQ",
    url: "https://www.eateriq.com/",
  },
};

export default function PrivacyPage() {
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
        <main className="container mx-auto px-4 py-8 relative z-10">
          {/* Breadcrumb */}
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

          {/* Header */}
          <header className="mb-10 rounded-[32px] border border-white/60 bg-white/82 px-6 py-10 text-center backdrop-blur-sm">
            <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              How we protect and handle your data
            </p>
          </header>

          {/* Content */}
          <div className="space-y-6">
            {/* Overview */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Data Protection Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  At EaterIQ, we are committed to protecting your privacy and
                  ensuring the security of your personal information. This
                  privacy policy explains how we collect, use, and safeguard
                  your data when you use our food analysis platform and quiz
                  services.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> January 25, 2026
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <span className="font-semibold mb-2">
                    Account Information
                  </span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Email address and profile information</li>
                    <li>• Username and display name</li>
                    <li>
                      • Authentication data (handled securely by Supabase)
                    </li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Food Scanning Data</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Barcode scan results and product information</li>
                    <li>• Health scores and nutritional analysis</li>
                    <li>• Scanning history and preferences</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2">Quiz Activity</span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Quiz scores and completion rates</li>
                    <li>• Created quizzes and their content</li>
                    <li>• Leaderboard rankings and achievements</li>
                  </ul>
                </section>
                <section>
                  <span className="font-semibold mb-2 text-foreground">
                    Subscription & Purchase Data
                  </span>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>
                      • We collect information regarding your subscription
                      status (e.g., Premium vs. Free).
                    </li>
                    <li>
                      • Transaction records are processed securely via Apple’s
                      In-App Purchase system.
                    </li>
                    <li>
                      • We do not store or have access to your credit card or
                      billing details.
                    </li>
                  </ul>
                </section>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>
                    <strong>Service Provision:</strong> To provide barcode
                    scanning, health analysis, and quiz functionality
                  </li>
                  <li>
                    <strong>Personalization:</strong> To offer personalized food
                    recommendations and quiz suggestions
                  </li>
                  <li>
                    <strong>Performance:</strong> To improve our analysis tools
                    and user experience
                  </li>
                  <li>
                    <strong>Communication:</strong> To send important updates
                    about your account and our services
                  </li>
                  <li>
                    <strong>Analytics:</strong> To understand usage patterns and
                    improve our platform
                  </li>
                  <li>
                    <strong>Account Linking:</strong> Subscription status and
                    food scanning history are linked to your identity to provide
                    a consistent experience across your devices.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                  Data Security & Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We use industry-standard security measures to protect your
                  data:
                </p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in
                    transit and at rest
                  </li>
                  <li>
                    <strong>Secure Infrastructure:</strong> Hosted on Supabase
                    with enterprise-grade security
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict authentication and
                    authorization protocols
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> Continuous monitoring and
                    security assessments
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie
                    className="h-5 w-5 text-amber-600"
                    aria-hidden="true"
                  />
                  Cookies & Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar technologies to enhance your
                  experience:
                </p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic site
                    functionality and security
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    visitors interact with our site (with your consent)
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings
                    and preferences
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can manage your cookie preferences through our cookie
                  consent banner or your browser settings.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock
                    className="h-5 w-5 text-orange-600"
                    aria-hidden="true"
                  />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We retain your personal data only for as long as necessary:
                </p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>
                    <strong>Account Data:</strong> Retained until you delete
                    your account
                  </li>
                  <li>
                    <strong>Scan History:</strong> Retained for 2 years or until
                    account deletion
                  </li>
                  <li>
                    <strong>Analytics Data:</strong> Anonymized and retained for
                    up to 26 months
                  </li>
                  <li>
                    <strong>Support Inquiries:</strong> Retained for 3 years for
                    quality assurance
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Note: Deleting your account does not automatically cancel
                  active App Store subscriptions. Please manage subscriptions
                  through your Apple ID settings.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct your
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a
                    machine-readable format
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Withdraw consent for data
                    processing
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  To exercise these rights, please contact us through our
                  support page.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  EaterIQ is not intended for children under 13 years of age. We
                  do not knowingly collect personal information from children
                  under 13. If you are a parent or guardian and believe your
                  child has provided us with personal information, please
                  contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new privacy policy on
                  this page and updating the "Last updated" date. You are
                  advised to review this privacy policy periodically for any
                  changes.
                </p>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about this privacy policy or how we
                  handle your data, please don't hesitate to contact us through
                  our{" "}
                  <Link
                    href="/support/"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    support page
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Related Links */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-center">
              Related Pages
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link href="/terms/" className="group">
                <Card className="h-full rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                      <Shield
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold group-hover:text-primary transition-colors">
                        Terms of Service
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Read our terms and conditions
                      </p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/support/" className="group">
                <Card className="h-full rounded-[28px] border-white/70 bg-white/88 transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                      <Mail
                        className="h-5 w-5 text-accent-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold group-hover:text-primary transition-colors">
                        Contact Support
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Get help with your account
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

          {/* Explore More */}
          <section className="mt-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-center">
              Explore EaterIQ
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link href="/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Scan
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Food Scanner
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/20">
                      <BookOpen
                        className="h-4 w-4 text-accent-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Nutrition Blog
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/quiz/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary/20">
                      <Brain
                        className="h-4 w-4 text-secondary-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                        Quiz Hub
                      </span>
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
