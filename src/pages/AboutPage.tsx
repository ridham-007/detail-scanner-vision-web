"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Target,
  Users,
  Shield,
  Leaf,
  Award,
  Mail,
  Globe,
} from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description:
        "We believe everyone deserves to know exactly what's in their food. No hidden ingredients, no confusing labels.",
    },
    {
      icon: Heart,
      title: "Health First",
      description:
        "Our mission is to empower healthier choices by providing clear, actionable nutritional insights.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built by health enthusiasts, for health enthusiasts. Our community helps improve our database every day.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "We promote awareness of sustainable food choices and their impact on personal and environmental health.",
    },
  ];

  const stats = [
    { value: "23,000+", label: "Products Analyzed" },
    { value: "14,000+", label: "Active Users" },
    { value: "99.9%", label: "Analysis Accuracy" },
    { value: "50+", label: "Countries Served" },
  ];

  // Structured data for About page
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EaterIQ",
    url: "https://www.eateriq.com",
    logo: "https://www.eateriq.com/eater-iq.png",
    description:
      "EaterIQ is a food intelligence platform that helps consumers make healthier food choices through barcode scanning, nutritional analysis, and health scoring.",
    foundingDate: "2024",
    sameAs: [
      "https://apps.apple.com/sg/app/eateriq/id6757137222",
      "https://play.google.com/store/apps/details?id=com.eateriq",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@eateriq.com",
      contactType: "customer service",
    },
  };

  return (
    <>
      <SEOHead
        title="About EaterIQ | Our Mission to Transform Food Transparency"
        description="Learn about EaterIQ's mission to help consumers make healthier food choices. Discover our story, values, and commitment to food transparency."
        keywords="about EaterIQ, food transparency, nutrition app, health technology, food scanner company"
        canonicalUrl="https://www.eateriq.com/about/"
        structuredData={aboutStructuredData}
      />
      <div className="min-h-screen bg-background">
        <AnimatedBackground />

        <main className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About <span className="text-primary">EaterIQ</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make food transparency accessible to
              everyone, empowering healthier choices one scan at a time.
            </p>
          </section>

          {/* Mission Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                EaterIQ was founded with a simple belief: everyone deserves to
                know what's really in their food. In a world of confusing food
                labels and hidden ingredients, we provide clarity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform analyzes food products using comprehensive
                nutritional databases and proprietary algorithms to deliver
                easy-to-understand health scores, ingredient breakdowns, and
                personalized recommendations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're managing dietary restrictions, pursuing fitness
                goals, or simply want to make healthier choices for your family,
                EaterIQ puts the power of informed decision-making in your
                hands.
              </p>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
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
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What We Offer Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="h-6 w-6 text-primary" />
                What We Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Barcode Scanning:</strong> Instantly analyze any
                    food product by scanning its barcode
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Health Scores:</strong> Clear 0-100 ratings based on
                    nutritional content, additives, and processing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Ingredient Analysis:</strong> Detailed breakdown of
                    every ingredient and its health implications
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Allergen Detection:</strong> Automatic alerts for
                    common allergens like gluten, dairy, and nuts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Healthier Alternatives:</strong> Discover better
                    options in the same product category
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Educational Quizzes:</strong> Test and expand your
                    nutrition knowledge with interactive quizzes
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Mail className="h-6 w-6 text-primary" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We'd love to hear from you! Whether you have questions,
                feedback, or partnership inquiries, our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/support">
                  <Button className="w-full sm:w-auto">
                    Contact Support
                  </Button>
                </Link>
                <a href="mailto:hello@eateriq.com">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    hello@eateriq.com
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Globe className="h-6 w-6 text-primary" />
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
        </main>
      </div>
    </>
  );
};

export default AboutPage;
