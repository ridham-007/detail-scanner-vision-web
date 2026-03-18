// app/about/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Target,
  Users,
  Shield,
  Leaf,
  Award,
  Mail,
  Globe,
  ArrowLeft,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'About EaterIQ - Our Mission to Transform Food Transparency',
  description: 'Learn about EaterIQ’s mission to help people make healthier food choices. Discover our story, values, and commitment to food transparency through barcode scanning.',
  keywords: ['about EaterIQ', 'food transparency', 'nutrition app', 'health technology', 'food scanner company', 'healthy eating', 'food analysis'],
  alternates: {
    canonical: 'https://www.eateriq.com/about',
  },
  openGraph: {
    type: 'website',
    title: 'About EaterIQ - Our Mission to Transform Food Transparency',
    description: 'Learn about EaterIQ\'s mission to help consumers make healthier food choices through barcode scanning and nutritional analysis.',
    url: 'https://www.eateriq.com/about/',
    siteName: 'EaterIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About EaterIQ - Our Mission to Transform Food Transparency',
    description: 'Learn about EaterIQ\'s mission to help consumers make healthier food choices.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EaterIQ",
  "url": "https://www.eateriq.com",
  "logo": "https://www.eateriq.com/eater-iq.png",
  "description": "EaterIQ is a food intelligence platform that helps consumers make healthier food choices through barcode scanning, nutritional analysis, and health scoring.",
  "foundingDate": "2024",
  "sameAs": [
    "https://apps.apple.com/sg/app/eateriq/id6757137222",
    "https://play.google.com/store/apps/details?id=com.eateriq"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@eateriq.com",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  }
};

// About page schema
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About EaterIQ",
  "description": "Learn about EaterIQ's mission to help consumers make healthier food choices",
  "url": "https://www.eateriq.com/about/",
  "mainEntity": {
    "@type": "Organization",
    "name": "EaterIQ"
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
      "name": "About",
      "item": "https://www.eateriq.com/about/"
    }
  ]
};

// Stats data
const stats = [
  { value: "23,000+", label: "Products Analyzed" },
  { value: "14,000+", label: "Active Users" },
  { value: "99.9%", label: "Analysis Accuracy" },
  { value: "50+", label: "Countries Served" }
];

export default function AboutPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">About</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="mb-16 pt-4 pb-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-primary mb-5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Empowering Healthier Choices
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl font-black tracking-tight text-foreground">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                EaterIQ
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We&apos;re on a mission to make food transparency accessible to everyone,
              empowering healthier choices one scan at a time.
            </p>
          </header>

          {/* Mission Section */}
          <Card className="mb-12 rounded-[30px] border-white/70 bg-white/88 shadow-product">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-primary" aria-hidden="true" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                EaterIQ was founded with a simple belief: everyone deserves to know
                what&apos;s really in their food. In a world of confusing food labels and
                hidden ingredients, we provide clarity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform analyzes food products using comprehensive nutritional
                databases and proprietary algorithms to deliver easy-to-understand
                health scores, ingredient breakdowns, and personalized recommendations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re managing dietary restrictions, pursuing fitness goals,
                or simply want to make healthier choices for your family, EaterIQ puts
                the power of informed decision-making in your hands.
              </p>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <section className="mb-12" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">EaterIQ Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="rounded-[28px] border-white/70 bg-white/88 text-center shadow-product">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12" aria-labelledby="values-heading">
            <h2 id="values-heading" className="text-2xl font-bold text-foreground text-center mb-8">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Transparency */}
              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
                      <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Transparency</h3>
                      <p className="text-sm text-muted-foreground">
                        We believe everyone deserves to know exactly what&apos;s in their food. No hidden ingredients, no confusing labels.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health First */}
              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
                      <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Health First</h3>
                      <p className="text-sm text-muted-foreground">
                        Our mission is to empower healthier choices by providing clear, actionable nutritional insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Driven */}
              <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 shadow-[var(--shadow-soft)]">
                      <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                      <p className="text-sm text-muted-foreground">
                        Built by health enthusiasts, for health enthusiasts. Our community helps improve our database every day.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Sustainability</h3>
                      <p className="text-sm text-muted-foreground">
                        We promote awareness of sustainable food choices and their impact on personal and environmental health.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What We Offer Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="h-6 w-6 text-primary" aria-hidden="true" />
                What We Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Barcode Scanning</h3>
                    <p className="text-sm text-muted-foreground">Instantly analyze any food product by scanning its barcode</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Health Scores</h3>
                    <p className="text-sm text-muted-foreground">Clear 0-100 ratings based on nutritional content, additives, and processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Ingredient Analysis</h3>
                    <p className="text-sm text-muted-foreground">Detailed breakdown of every ingredient and its health implications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Allergen Detection</h3>
                    <p className="text-sm text-muted-foreground">Automatic alerts for common allergens like gluten, dairy, and nuts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Healthier Alternatives</h3>
                    <p className="text-sm text-muted-foreground">Discover better options in the same product category</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">Educational Quizzes</h3>
                    <p className="text-sm text-muted-foreground">Test and expand your nutrition knowledge with interactive quizzes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Story Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                EaterIQ started in 2024 when our founders, frustrated by misleading
                food labels and complex nutritional information, decided to create
                a solution that would make food transparency simple and accessible.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What began as a simple barcode scanner has evolved into a comprehensive
                food intelligence platform used by thousands of health-conscious
                consumers worldwide. We&apos;ve analyzed over 23,000 products and continue
                to grow our database every day.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, EaterIQ is more than just an app—it&apos;s a community of people
                committed to making healthier food choices and helping others do the same.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We&apos;d love to hear from you! Whether you have questions, feedback,
                or partnership inquiries, our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/support/">
                  <Button className="w-full sm:w-auto">
                    Contact Support
                  </Button>
                </Link>
                <a href="mailto:hello@eateriq.com">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                    hello@eateriq.com
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Download Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
                Available Everywhere
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                EaterIQ is available on web, iOS, and Android. Start making
                healthier food choices today!
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                    alt="Download on the App Store"
                    className="h-[40px]"
                    loading="lazy"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.eateriq"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get it on Google Play"
                  className="transition-opacity hover:opacity-80"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    className="h-[60px] -my-[10px]"
                    loading="lazy"
                  />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <section className="mb-12 pt-8 border-t">
            <h2 className="text-xl font-bold mb-6 text-center">Learn More</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link href="/privacy/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
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

              <Link href="/terms/" className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <Award className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        Terms of Service
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our user agreement
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Explore EaterIQ */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-center">Explore EaterIQ</h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
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
        </main>
      </div>
    </>
  );
}
