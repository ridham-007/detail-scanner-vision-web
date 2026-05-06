"use client";
import React, { useEffect } from "react";
import {
  Calculator,
  Info,
  Sparkles,
  Search,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { calculatorData } from "@/data/calculatorData";
import CalculatorSearch from "@/components/CalculatorSearch";
import RelatedCalculators from "@/components/RelatedCalculators";
import type { Metadata } from "next";
import { Link } from "@/lib/react-router-dom-shim";
import FoodBattle from "@/components/FoodBattleBanner";

/* ================= TYPES ================= */

interface FAQItem {
  question: string;
  answer: string;
}

interface ModernCalculatorLayoutProps {
  title: string;
  description: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  howToUse?: React.ReactNode;
  details?: {
    whatIs: string;
    howItWorks: string;
    tips?: string[];
  };
  faq?: FAQItem[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

/* ================= SEO HELPERS ================= */

const generateCalculatorKeywords = (title: string): string => {
  const baseTitle = title.replace(" Calculator", "").toLowerCase();
  return `${baseTitle} calculator, ${baseTitle} calculation, free ${baseTitle} calculator, online ${baseTitle} tool, ${baseTitle} formula, calculate ${baseTitle}`;
};

const BASE_URL = "https://calcifyai.com";

/* ================= RELATED CALCULATORS HELPER ================= */

const getRelatedCalculators = (path: string) => {
  let currentCategory: keyof typeof calculatorData | null = null;
  let currentIndex = -1;

  for (const [category, calcs] of Object.entries(calculatorData)) {
    const index = calcs.findIndex((c) => c.path === path);
    if (index !== -1) {
      currentCategory = category as keyof typeof calculatorData;
      currentIndex = index;
      break;
    }
  }

  if (!currentCategory || currentIndex === -1) return [];

  const categoryCalcs = calculatorData[currentCategory];
  const result: typeof categoryCalcs = [];

  for (let i = 1; i < categoryCalcs.length; i++) {
    const calc = categoryCalcs[(currentIndex + i) % categoryCalcs.length];
    if (calc.path !== path) {
      result.push(calc);
    }
    if (result.length === 4) break;
  }

  return result;
};

/* ================= METADATA GENERATOR ================= */

export function generateCalculatorMetadata({
  title,
  description,
  path,
  metaTitle,
  metaDescription,
  keywords,
}: Pick<
  ModernCalculatorLayoutProps,
  | "title"
  | "description"
  | "path"
  | "metaTitle"
  | "metaDescription"
  | "keywords"
>): Metadata {
  const fullUrl = `${BASE_URL}${path}`;
  const seoTitle = metaTitle || `${title} | Free Online Calculator - CalcifyAI`;
  const seoDescription =
    metaDescription ||
    `${description} Use our free ${title.toLowerCase()} for accurate, instant results.`;
  const seoKeywords = keywords || generateCalculatorKeywords(title);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: fullUrl,
      images: [`${BASE_URL}/og-image.png`],
      type: "website",
    },
  };
}

/* ================= JSON-LD COMPONENTS ================= */

function CalculatorJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url,
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "CalcifyAI",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function FAQJsonLd({ faq }: { faq: FAQItem[] }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  );
}

/* ================= COMPONENT ================= */

const ModernCalculatorLayout: React.FC<ModernCalculatorLayoutProps> = ({
  title,
  description,
  path,
  icon: Icon = Calculator,
  children,
  howToUse,
  details,
  faq,
  metaTitle,
  metaDescription,
  keywords,
}) => {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const fullUrl = `${BASE_URL}${path}`;
  const seoDescription =
    metaDescription ||
    `${description} Use our free ${title.toLowerCase()} for accurate, instant results.`;

  const relatedCalculators = getRelatedCalculators(path);

  return (
    <div className="min-h-screen">
      <CalculatorJsonLd
        title={title}
        description={seoDescription}
        url={fullUrl}
      />
      {faq && faq.length > 0 && <FAQJsonLd faq={faq} />}

      {/* HERO */}
      <section className="relative overflow-hidden pb-12 pt-12">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: "All Calculators", path: "/calculator" },
              { label: title },
            ]}
          />

          <div className="mx-auto rounded-[32px] border border-white/60 bg-white/82 px-6 py-10 text-center backdrop-blur-sm">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="rounded-[24px] bg-primary p-4 shadow-[var(--shadow-warm)]">
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl">
              {title}
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              {description}
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-4 py-2 text-orange-800">
                <Shield className="h-4 w-4 text-primary" />
                100% Free
              </span>

              <span className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-4 py-2 text-orange-800">
                <Zap className="h-4 w-4 text-primary" />
                Instant Results
              </span>

              <span className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-4 py-2 text-orange-800">
                <TrendingUp className="h-4 w-4 text-primary" />
                Accurate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="order-2 lg:order-1 lg:col-span-3 gap-6 flex flex-col">
              <CalculatorSearch />

              <div>
                {relatedCalculators.length > 0 && (
                  <RelatedCalculators
                    calculators={relatedCalculators.map((calc) => ({
                      path: calc.path,
                      title: calc.title,
                      iconName: calc.icon.name,
                    }))}
                  />
                )}
              </div>
              <FoodBattle />
            </div>

            {/* CENTER */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-product">
                <div className="border-b border-orange-100/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] p-6">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      Calculate Now
                    </h2>
                  </div>
                </div>

                <div className="p-6">{children}</div>
              </div>

              {howToUse && (
                <div className="mt-6 rounded-[28px] border border-white/70 bg-white/88 p-6 shadow-product">
                  {howToUse}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="order-3 lg:order-3 lg:col-span-3">
              {details && (
                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-product">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2 flex gap-2">
                      <Info className="text-primary" />
                      What is this?
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {details.whatIs}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-product">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                          How it works
                        </h3>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {details.howItWorks}
                      </p>
                    </div>
                  </div>

                  {details.tips && (
                    <div className="rounded-[28px] border border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] p-5 shadow-product">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3 flex gap-2">
                        <Sparkles className="text-primary" />
                        Tips
                      </h3>

                      <ul className="space-y-2">
                        {details.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-foreground"
                          >
                            <span className="flex h-6 min-h-[24px] w-6 min-w-[24px] flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                              {i + 1}
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="py-16 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[24px] border border-white/60 shadow-product transition-all hover:shadow-[var(--shadow-soft)] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full p-6 text-left flex justify-between items-center group"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.question}
                    </span>
                    <span className={`text-primary transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>

                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-muted-foreground animate-in fade-in slide-in-from-top-2">
                      <div className="pt-2 border-t border-orange-50">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernCalculatorLayout;
