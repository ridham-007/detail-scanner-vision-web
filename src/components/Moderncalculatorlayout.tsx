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
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
    "
    >
      <CalculatorJsonLd
        title={title}
        description={seoDescription}
        url={fullUrl}
      />
      {faq && faq.length > 0 && <FAQJsonLd faq={faq} />}

      {/* HERO */}
      <section className="pt-12 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: "All Calculators", path: "/calculators" },
              { label: title },
            ]}
          />

          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-4 bg-[#84B44C] rounded-2xl">
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              {title}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {description}
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 border dark:border-gray-700 rounded-full flex items-center gap-2 dark:text-gray-200">
                <Shield className="h-4 w-4 text-[#84B44C]" />
                100% Free
              </span>

              <span className="px-4 py-2 border dark:border-gray-700 rounded-full flex items-center gap-2 dark:text-gray-200">
                <Zap className="h-4 w-4 text-[#84B44C]" />
                Instant Results
              </span>

              <span className="px-4 py-2 border dark:border-gray-700 rounded-full flex items-center gap-2 dark:text-gray-200">
                <TrendingUp className="h-4 w-4 text-[#84B44C]" />
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
              <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-6 border-b dark:border-gray-700 bg-[#84B44C]/20 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-[#84B44C]" />
                    <h2 className="text-xl font-semibold dark:text-white">
                      Calculate Now
                    </h2>
                  </div>
                </div>

                <div className="p-6 dark:text-gray-200">{children}</div>
              </div>

              {howToUse && (
                <div className="mt-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-700 dark:text-gray-200">
                  {howToUse}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="order-3 lg:order-3 lg:col-span-3">
              {details && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 p-5">
                    <h3 className="font-semibold mb-2 flex gap-2 dark:text-white">
                      <Info className="text-[#84B44C]" />
                      What is this?
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {details.whatIs}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-5 w-5 text-[#84B44C]" />
                        <h3 className="font-bold dark:text-white">
                          How it works
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {details.howItWorks}
                      </p>
                    </div>
                  </div>

                  {details.tips && (
                    <div className="bg-[#84B44C]/20 dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700">
                      <h3 className="font-semibold mb-3 flex gap-2 dark:text-white">
                        <Sparkles className="text-[#84B44C]" />
                        Tips
                      </h3>

                      <ul className="space-y-2">
                        {details.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm dark:text-gray-200"
                          >
                            <span className="w-6 h-6 min-w-[24px] min-h-[24px] flex-shrink-0 bg-[#84B44C] text-white rounded-full flex items-center justify-center text-xs font-medium">
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
        <section className="py-16 bg-[#84B44C]/40 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full p-6 text-left flex justify-between dark:text-white"
                  >
                    <span>{item.question}</span>
                    <span className="text-[#84B44C]">↓</span>
                  </button>

                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                      {item.answer}
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
