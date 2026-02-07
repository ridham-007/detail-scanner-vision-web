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
// import { Link, useNavigate } from '@/lib/react-router-dom-shim';
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import { useMeta } from "@/lib/useMeta";
// import { calculatorData } from "@/data/calculatorData";
// import Breadcrumbs from "@/components/Breadcrumbs";

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

/* ================= CATEGORY MAPPING ================= */

// const getCategoryInfo = (path: string): { name: string; path: string } | null => {
//   const categoryMap: Record<string, { name: string; path: string }> = {
//     financial: { name: "Finance", path: "/finance" },
//     health: { name: "Health", path: "/health" },
//     business: { name: "Business", path: "/business-tools" },
//     utility: { name: "Utility", path: "/utility" },
//   };

//   for (const [category, calcs] of Object.entries(calculatorData)) {
//     if (calcs.some((c) => c.path === path)) {
//       return categoryMap[category] || null;
//     }
//   }
//   return null;
// };

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
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  // const navigate = useNavigate();

  /* 🔎 SEARCH RESULTS */
  // const searchResults = React.useMemo(() => {
  //   if (!searchTerm.trim()) return [];

  //   const term = searchTerm.toLowerCase();
  //   // const allCalcs = Object.values(calculatorData).flat();

  //   return allCalcs
  //     .map((calc) => {
  //       const title = calc.title.toLowerCase();
  //       const description = calc.description.toLowerCase();

  //       let score = 0;

  //       if (title === term) score = 100;
  //       else if (title.startsWith(term)) score = 80;
  //       else if (new RegExp(`\\b${term}\\b`).test(title)) score = 60;
  //       else if (title.includes(term)) score = 40;
  //       else if (description.includes(term)) score = 20;

  //       return score > 0 ? { ...calc, score } : null;
  //     })
  //     .filter(Boolean)
  //     .sort((a, b) => b.score - a.score);
  // }, [searchTerm]);

  /* 🔗 RELATED CALCULATORS */
  // const relatedCalculators = React.useMemo(() => {
  //   let currentCategory: keyof typeof calculatorData | null = null;
  //   let currentIndex = -1;

  //   Object.entries(calculatorData).forEach(([category, calcs]) => {
  //     const index = calcs.findIndex((c) => c.path === path);
  //     if (index !== -1) {
  //       currentCategory = category as keyof typeof calculatorData;
  //       currentIndex = index;
  //     }
  //   });

  //   if (!currentCategory || currentIndex === -1) return [];

  //   const categoryCalcs = calculatorData[currentCategory];
  //   const result = [];

  //   for (let i = 1; i < categoryCalcs.length; i++) {
  //     const calc = categoryCalcs[(currentIndex + i) % categoryCalcs.length];
  //     if (calc.path !== path) {
  //       result.push(calc);
  //     }
  //     if (result.length === 4) break;
  //   }

  //   return result;
  // }, [path]);

  const fullUrl = `${BASE_URL}${path}`;
  const seoTitle = metaTitle || `${title} | Free Online Calculator - CalcifyAI`;
  const seoDescription =
    metaDescription ||
    `${description} Use our free ${title.toLowerCase()} for accurate, instant results.`;
  const seoKeywords = keywords || generateCalculatorKeywords(title);

  // useMeta({
  //   title: seoTitle,
  //   description: seoDescription,
  //   keywords: seoKeywords,
  //   canonical: fullUrl,
  //   ogTitle: seoTitle,
  //   ogDescription: seoDescription,
  //   ogImage: `${BASE_URL}/og-image.png`,
  //   ogType: "website",
  // });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* <Header /> */}

      {/* ================= HERO ================= */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* <Breadcrumbs /> */}

          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-4 bg-[#84B44C] rounded-2xl">
                <Icon className="h-10 w-10 text-white" />
              </div>

              <span className="px-4 py-2 bg-[#84B44C] text-white rounded-full text-sm">
                Free Tool
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {description}
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 border rounded-full flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#84B44C]" />
                100% Free
              </span>

              <span className="px-4 py-2 border rounded-full flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#84B44C]" />
                Instant Results
              </span>

              <span className="px-4 py-2 border rounded-full flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#84B44C]" />
                Accurate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="h-5 w-5 text-[#84B44C]" />
                  <h3 className="font-semibold">Search</h3>
                </div>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-xl p-3"
                  placeholder="Search calculators..."
                />
              </div>

              {/* SEARCH RESULTS COMMENTED CODE PRESERVED */}
            </div>

            {/* CENTER */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border shadow-sm">
                <div className="p-6 border-b bg-green-50">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-[#84B44C]" />
                    <h2 className="text-xl font-semibold">Calculate Now</h2>
                  </div>
                </div>

                <div className="p-6">{children}</div>
              </div>

              {howToUse && (
                <div className="mt-6 bg-white p-6 rounded-2xl border">
                  {howToUse}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-3">
              {details && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border p-5">
                    <h3 className="font-semibold mb-2 flex gap-2">
                      <Info className="text-[#84B44C]" />
                      What is this?
                    </h3>

                    <p className="text-sm text-gray-600">{details.whatIs}</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-border/50 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-5 w-5 text-[#84B44C]" />
                        <h3 className="font-bold text-foreground">
                          How it works
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        
                        {details.howItWorks}
                      </p>
                    </div>
                  </div>

                  {details.tips && (
                    <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                      <h3 className="font-semibold mb-3 flex gap-2">
                        <Sparkles className="text-[#84B44C]" />
                        Tips
                      </h3>

                      <ul className="space-y-2">
                        {details.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="w-5 h-5 bg-[#84B44C] text-white rounded-full flex items-center justify-center text-xs">
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

      {/* FAQ SECTION PRESERVED */}
      {faq && faq.length > 0 && (
        <section className="py-16 bg-green-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl border">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full p-6 text-left flex justify-between"
                  >
                    <span>{item.question}</span>
                    <span className="text-[#84B44C]">↓</span>
                  </button>

                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-gray-600">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* <Footer /> */}
    </div>
  );
};

export default ModernCalculatorLayout;
