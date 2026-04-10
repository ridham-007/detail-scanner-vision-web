// app/support/page.tsx
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Mail,
  Bug,
  Lightbulb,
  ArrowLeft,
  Clock,
  Shield,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import ContactForm from "@/components/support/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "Support Center - Get Help & Contact Us | EaterIQ",
  description:
    "Get help with EaterIQ. Contact our support team, report bugs, request features, or browse our comprehensive FAQ section for quick answers.",
  keywords: [
    "support",
    "help",
    "FAQ",
    "contact",
    "bug report",
    "feature request",
    "EaterIQ help",
    "customer support",
  ],
  alternates: {
    canonical: "https://www.eateriq.com/support",
  },
  openGraph: {
    type: "website",
    title: "Support Center | EaterIQ",
    description:
      "Get help with EaterIQ. Contact our support team or browse FAQs.",
    url: "https://www.eateriq.com/support/",
    siteName: "EaterIQ",
  },
  twitter: {
    card: "summary",
    title: "Support Center | EaterIQ",
    description:
      "Get help with EaterIQ. Contact our support team or browse FAQs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// FAQ items for both display and schema
const faqItems = [
  {
    question: "How does the barcode scanner work?",
    answer:
      "Our barcode scanner analyzes product information and provides instant health scores. Simply point your camera at any barcode, and our system will process the nutritional data to give you personalized insights and recommendations.",
  },
  {
    question: "How are health scores calculated?",
    answer:
      "Health scores are calculated using our proprietary algorithm that analyzes multiple factors including nutritional content, ingredient quality, processing level, and dietary guidelines. The score ranges from 1-100, with higher scores indicating healthier choices.",
  },
  {
    question: "Can I create custom quizzes?",
    answer:
      "Yes! Registered users can create custom quizzes using our quiz generator. Simply provide a topic or prompt, choose the difficulty level, and the system will generate engaging questions for you.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use enterprise-grade security measures including end-to-end encryption, secure cloud infrastructure, and strict access controls. Your personal data is never shared with third parties without your consent.",
  },
  {
    question:
      "What should I do if a barcode scan returns incorrect information?",
    answer:
      "If you encounter incorrect product information, please report it through this support page. We continuously improve our database and appreciate user feedback to maintain accuracy.",
  },
  {
    question: "How do leaderboards work in quizzes?",
    answer:
      "Leaderboards rank users based on their total quiz scores and completion rates. Scores are calculated based on correct answers, quiz difficulty, and completion time. Rankings are updated in real-time.",
  },
  {
    question: "Can I use EaterIQ offline?",
    answer:
      "Currently, EaterIQ requires an internet connection for barcode scanning and product analysis. We're exploring offline capabilities for future updates.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can delete your account through the Settings page. Once deleted, all your data including scan history and quiz scores will be permanently removed within 30 days.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and UPI payments for Pro and Premium subscriptions. All payments are processed securely.",
  },
];

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
      name: "Support",
      item: "https://www.eateriq.com/support/",
    },
  ],
};

// FAQ Schema for rich snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// Contact page schema
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "EaterIQ Support Center",
  description:
    "Get help with EaterIQ. Contact our support team, report bugs, or request features.",
  url: "https://www.eateriq.com/support/",
  mainEntity: {
    "@type": "Organization",
    name: "EaterIQ",
    url: "https://www.eateriq.com/",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"],
      areaServed: "Worldwide",
    },
  },
};

export default function SupportPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Breadcrumbs items={[{ label: "Support" }]} />

          {/* Header */}
          <header className="mb-12 pt-4 pb-2 text-center">
            {/* Badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5">
                <span className="text-xs font-semibold text-primary tracking-wide">We're here to help</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl  mb-4 font-bold leading-[1.02] tracking-tight text-foreground">
              Support{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Center
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Get help with EaterIQ — we're here to assist you every step of the way.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form Section */}
            <div className="space-y-6">
              {/* Client Component for Contact Form */}
              <ContactForm />

              {/* Other Ways to Reach Us - Server Rendered */}
              <Card className="rounded-[30px] border-white/70 bg-white/88 shadow-product">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    Other Ways to Reach Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Bug
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="font-semibold">Bug Reports</span>
                      <p className="text-sm text-muted-foreground">
                        Found a bug? Help us improve by reporting it with
                        detailed steps to reproduce.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Lightbulb
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="font-semibold">Feature Requests</span>
                      <p className="text-sm text-muted-foreground">
                        Have an idea for a new feature? We'd love to hear your
                        suggestions!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare
                      className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="font-semibold">General Inquiries</span>
                      <p className="text-sm text-muted-foreground">
                        Questions about pricing, features, or partnerships?
                        We're happy to help.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                      <strong className="text-sm">Response Time</strong>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24 hours during business days.
                      For urgent issues, please mark your message as "Technical
                      Issue" for faster processing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield
                        className="h-4 w-4 text-green-600"
                        aria-hidden="true"
                      />
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock
                        className="h-4 w-4 text-blue-600"
                        aria-hidden="true"
                      />
                      <span>24hr Response</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section - Server Rendered */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <HelpCircle
                      className="h-5 w-5 text-purple-600"
                      aria-hidden="true"
                    />
                    Frequently Asked Questions
                  </h2>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/user-guide/"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → User Guide
                  </Link>
                  <Link
                    href="/dietary-guides/"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Dietary Cheat Sheets
                  </Link>
                  <Link
                    href="/pricing/"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Pricing & Plans
                  </Link>
                  <Link
                    href="/privacy/"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Privacy Policy
                  </Link>
                  <Link
                    href="/terms/"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Terms of Service
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Explore More */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-center">
              Explore EaterIQ
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link href="/scanner/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Scan
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
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
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <BookOpen
                        className="h-5 w-5 text-accent-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
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
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-secondary/20">
                      <Brain
                        className="h-5 w-5 text-secondary-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
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
        </main>
      </div>
    </>
  );
}
