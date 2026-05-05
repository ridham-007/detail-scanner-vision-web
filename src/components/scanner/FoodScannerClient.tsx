// components/scanner/FoodScannerClient.tsx
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Scan,
  BookOpen,
  Brain,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductDetails from "@/components/ProductDetails";
import { useProductLookup } from "@/hooks/useProductLookup";
import { ProductData } from "@/types/ProductData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent, trackScanAttempt } from "@/utils/analytics";
import UpgradeBanner from "@/components/UpgradeBanner";
import { useDailyScans } from "@/hooks/useDailyScans";

export default function FoodScannerClient() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(
    null,
  );
  const [showNoDataState, setShowNoDataState] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string>("");
  const { lookupProduct, isLoading } = useProductLookup();
  const productDetailsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { scansRemaining, maxScans, canScan, incrementScan, isUnlimited } =
    useDailyScans();

  const scrollToResults = () => {
    setTimeout(() => {
      productDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 10);
  };

  const handleScan = async (scannedCode: string) => {
    if (!canScan) {
      toast.error(
        "You've reached your daily scan limit. Upgrade to Pro for unlimited scans!",
      );
      return;
    }

    trackScanAttempt();

    setIsScanning(false);
    setShowNoDataState(false);
    setLastScannedBarcode(scannedCode);
    scrollToResults();

    if (user) {
      const { data, error } = await supabase
        .from("scan_history")
        .select("barcode")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching scan history:", error);
      } else {
        const alreadyScanned = data?.some(
          (entry) => entry.barcode === scannedCode,
        );
        if (alreadyScanned) {
          toast.info(
            "You've already scanned this product. Check your history for details!",
          );
          return;
        }
      }
    }

    const product = await lookupProduct(scannedCode);

    if (product) {
      setCurrentProduct(product);
      incrementScan();

      if (user) {
        await supabase.from("scan_history").insert([
          {
            user_id: user.id,
            barcode: scannedCode,
            product_name: product.name,
            health_score: product.health_score ?? null,
            scanned_at: new Date().toISOString(),
          },
        ]);
      }
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const handleManualLookup = async () => {
    const trimmedBarcode = manualBarcode.trim();
    if (!trimmedBarcode) return;

    if (!canScan) {
      toast.error(
        "You've reached your daily scan limit. Upgrade to Pro for unlimited scans!",
      );
      return;
    }

    trackEvent("manual_barcode_entry", { barcode: trimmedBarcode });

    setShowNoDataState(false);
    setLastScannedBarcode(trimmedBarcode);
    scrollToResults();

    let alreadyScanned = false;

    if (user) {
      const { data, error } = await supabase
        .from("scan_history")
        .select("barcode")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching scan history:", error);
      } else {
        alreadyScanned =
          data?.some((entry) => entry?.barcode === trimmedBarcode) || false;
      }
    }

    const product = await lookupProduct(trimmedBarcode);

    if (product) {
      setCurrentProduct(product);
      incrementScan();

      if (user && !alreadyScanned) {
        await supabase.from("scan_history").insert([
          {
            user_id: user.id,
            barcode: trimmedBarcode,
            product_name: product.name,
            health_score: product.health_score ?? null,
            scanned_at: new Date().toISOString(),
          },
        ]);
      }
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="space-y-8 pt-4 container mx-auto px-4">
      {/* <Breadcrumbs items={[{ label: "Food Scanner" }]} /> */}

      {!isUnlimited && (
        <UpgradeBanner
          scansRemaining={scansRemaining as number}
          maxScans={maxScans as number}
          variant="compact"
        />
      )}

      {/* Breadcrumb */}

      {/* Hero Section */}
      <header className="mb-12 pt-4 pb-2 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-primary shadow-[var(--shadow-soft)]">
            <Sparkles className="h-4 w-4" />
            Scanner built for quick, confident choices
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.02] tracking-tight text-foreground">
            Food{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Scanner
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Scan Any Food Product & Instantly Know What You’re Eating
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Use EaterIQ’s powerful food barcode scanner to check ingredients,
            nutrition facts, and health scores instantly. This smart food
            scanner app helps you make better food choices in seconds.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            No signup required • Instant results • Trusted product scanner app
          </p>
        </div>

        {/* Quick stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="min-w-[112px] rounded-[22px] border border-orange-100/80 bg-orange-50/70 px-5 py-4 text-center">
            <div className="text-2xl font-bold text-primary">1M+</div>
            <div className="text-sm text-muted-foreground">Products</div>
          </div>
          <div className="min-w-[112px] rounded-[22px] border border-orange-100/80 bg-orange-50/70 px-5 py-4 text-center">
            <div className="text-2xl font-bold text-primary">10s</div>
            <div className="text-sm text-muted-foreground">Analysis</div>
          </div>
          <div className="min-w-[112px] rounded-[22px] border border-orange-100/80 bg-orange-50/70 px-5 py-4 text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Free</div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Scanner Section */}
        <Card className="overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] shadow-product">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="rounded-2xl bg-white/70 p-3 shadow-[var(--shadow-soft)]">
                <Scan className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              Instant Scan
            </CardTitle>
            <CardDescription className="text-base">
              Point your camera at any barcode for instant analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <BarcodeScanner
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />
          </CardContent>
        </Card>

        {/* Manual Entry Section */}
        <Card className="overflow-hidden rounded-[30px] border border-white/60 bg-white/84 shadow-product">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                <Search className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              Manual Entry
            </CardTitle>
            <CardDescription className="text-base">
              Enter a barcode number manually if camera doesn't work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter barcode number..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
                className="rounded-2xl border-2 border-orange-100/80 bg-[rgba(255,250,244,0.94)] py-6 text-base"
                aria-label="Barcode number"
              />
              <Button
                aria-label="Search product"
                onClick={handleManualLookup}
                disabled={isLoading || !manualBarcode.trim()}
                size="lg"
                className="rounded-2xl bg-foreground px-6 py-6 text-primary-foreground shadow-[var(--shadow-warm)] hover:bg-foreground/92"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
            {/* <div className="rounded-[22px] border border-orange-100/80 bg-orange-50/60 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">
                  Try these samples:
                </span>
              </p>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => setManualBarcode("8906000610077")}
                  className="block text-sm font-semibold text-primary hover:underline"
                >
                  8906000610077 (Crispy Potatoes)
                </button>
                <button
                  onClick={() => setManualBarcode("8906019779840")}
                  className="block text-sm font-semibold text-primary hover:underline"
                >
                  8906019779840 (Mix Dry Fruits)
                </button>
              </div>
            </div> */}
            <div className="flex items-start gap-3 rounded-[22px] border border-orange-100/80 bg-white/80 p-4">
              <div className="mt-0.5 rounded-full bg-orange-50 p-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                The scanner stays lightweight and fast, then opens the richer
                ingredient and nutrition breakdown below.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Section */}
      <div ref={productDetailsRef} className="mb-[50px]">
        <ProductDetails
          product={currentProduct}
          isLoading={isLoading}
          showNoDataState={showNoDataState}
          scannedBarcode={lastScannedBarcode}
        />
      </div>

      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
                What is the EaterIQ Scanner?
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                EaterIQ is an advanced food scanning app designed to help you
                understand what’s inside your packaged food. With just a quick
                scan, this intelligent food scanner reveals detailed insights
                about ingredients, nutrition values, and overall product
                quality.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Whether you call it a product scanner, ingredient checker, or
                food barcode scanner, EaterIQ gives you all the information you
                need in one place, fast, simple, and easy to understand.
              </p>
            </div>

            {/* Right Highlight Card */}
            <div className="rounded-[28px] bg-gradient-to-br from-orange-50 to-white border shadow-product p-6">
              <p className="font-semibold text-lg mb-3">Why it matters</p>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✔ Understand what you eat</li>
                <li>✔ Decode ingredients instantly</li>
                <li>✔ Make smarter food decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEO-friendly content section (visible) */}
      <section className="border-t border-border/70 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-10 text-center">
            How the Food Scanner Works
          </h2>

          <div className="relative flex flex-col md:flex-row items-stretch gap-0">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0" />

            {[
              {
                step: "1",
                title: "Open the Food Scanner",
                desc: "Launch the EaterIQ food scanner app directly from your browser.",
                icon: (
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2v18H3V3zm4 0h1v18H7V3zm3 0h2v18h-2V3zm4 0h1v18h-1V3zm3 0h2v18h-2V3z"
                    />
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="3"
                      strokeWidth={1.5}
                      fill="none"
                    />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Scan the Barcode",
                desc: "Use your camera to scan any packaged product barcode.",
                icon: (
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 7v5l3 3" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Analyze Instantly",
                desc: "Get a complete breakdown using our smart ingredient checker food system.",
                icon: (
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z"
                    />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex-1 flex flex-col items-center group"
              >
                {/* Mobile connector */}
                {i < 2 && (
                  <div className="md:hidden w-px h-8 bg-gradient-to-b from-orange-300 to-orange-100 my-1" />
                )}

                <div className="w-full rounded-[26px] border border-white/65 bg-white/82 p-6 text-center shadow-product transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  {/* Step badge */}
                  <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                    {/* Animated ring */}
                    <span className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-30 group-hover:opacity-80" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 border border-orange-200 shadow-sm">
                      {item.icon}
                    </span>
                    {/* Step number pill */}
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bottom progress bar */}
                  <div className="mt-5 h-1 w-full rounded-full bg-orange-50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-300 to-primary transition-all duration-700 group-hover:w-full"
                      style={{ width: `${33.3 * (i + 1)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-2">
        <h2 className="text-3xl font-bold text-center mb-10">
          What You’ll Discover
        </h2>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Ingredient Transparency */}
          <div className="p-6 rounded-2xl bg-white shadow-product">
            <h3 className="text-xl font-semibold mb-3">
              Ingredient Transparency (Ingredient Checker)
            </h3>
            <p className="text-muted-foreground mb-3">
              Our advanced ingredient checker breaks down every ingredient into
              simple terms.
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Understand complex names and hidden additives</li>
              <li>Identify artificial preservatives, colors, and chemicals</li>
              <li>Know exactly what you’re consuming</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              This makes EaterIQ one of the most powerful tools for ingredient
              checker food analysis.
            </p>
          </div>

          {/* Harmful Ingredients */}
          <div className="p-6 rounded-2xl bg-white shadow-product">
            <h3 className="text-xl font-semibold mb-3">
              Harmful Ingredients & Alerts
            </h3>
            <p className="text-muted-foreground mb-3">
              Not all ingredients are created equal. Our food scanner
              highlights:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>High-risk additives and controversial ingredients</li>
              <li>Excess sugar, sodium, or unhealthy fats</li>
              <li>Allergens like gluten, dairy, or nuts</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Get instant alerts so you can avoid products that don’t align with
              your health goals.
            </p>
          </div>

          {/* Nutrition */}
          <div className="p-6 rounded-2xl bg-white shadow-product">
            <h3 className="text-xl font-semibold mb-3">
              Complete Nutrition Breakdown
            </h3>
            <p className="text-muted-foreground mb-3">
              Go beyond basic labels with detailed insights from our food
              scanning app:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Calories per serving</li>
              <li>Protein, carbs, fats, and fiber</li>
              <li>Sugar and sodium levels</li>
              <li>Daily value percentages</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Everything is presented in a clean, easy-to-read format.
            </p>
          </div>

          {/* Health Score */}
          <div className="p-6 rounded-2xl bg-white shadow-product">
            <h3 className="text-xl font-semibold mb-3">Smart Health Score</h3>
            <p className="text-muted-foreground">
              Each product is given a simple health rating based on its
              ingredients and nutrition. This feature of our product scanner app
              helps you quickly decide whether a product is a good or bad
              choice.
            </p>
          </div>

          {/* Alternatives */}
          <div className="p-6 rounded-2xl bg-white shadow-product">
            <h3 className="text-xl font-semibold mb-3">
              Better Alternatives (Future-Ready)
            </h3>
            <p className="text-muted-foreground">
              Our system can suggest healthier alternatives to scanned products,
              helping you upgrade your diet effortlessly using the food scanner
              app.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto rounded-[30px] bg-orange-50/50 border p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Use EaterIQ Food Scanner?
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>✔ Make smarter food decisions instantly</div>
            <div>✔ Save time reading complex labels</div>
            <div>✔ Avoid harmful ingredients using our ingredient checker</div>
            <div>✔ Ideal for fitness, dieting, and clean eating</div>
            <div>✔ Works as a complete product scanner for daily use</div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features of EaterIQ Scanner
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Instant Barcode Scanning",
                desc: "Scan any packaged product within seconds using our fast and accurate food scanner app.",
              },
              {
                title: "Advanced Ingredient Checker",
                desc: "Our AI-powered ingredient checker food system analyzes every ingredient in detail, helping you make informed decisions.",
              },
              {
                title: "Deep Nutrition Insights",
                desc: "Get a complete nutritional profile with easy-to-understand visuals—powered by our smart food scanning app.",
              },
              {
                title: "Smart Warnings & Alerts",
                desc: "Receive real-time alerts about harmful ingredients, allergens, and unhealthy components using our product scanner app.",
              },
              {
                title: "Simple Health Score System",
                desc: "Understand product quality at a glance with an easy health rating generated by our food barcode scanner.",
              },
              {
                title: "Mobile-Friendly Experience",
                desc: "Use EaterIQ seamlessly on any device—no download required. It works like a powerful food scanner app directly in your browser.",
              },
              {
                title: "Privacy First",
                desc: "Your scans are private and secure. We don’t store personal data, making it a safe and reliable product scanner.",
              },
              {
                title: "Continuous Database Updates",
                desc: "Our food scanning app constantly updates its database to support more products and provide accurate results.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-[24px] bg-white border p-5 shadow-product"
              >
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Who Is It For?</h2>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Health-conscious individuals",
              "Fitness enthusiasts and athletes",
              "People with dietary restrictions (vegan, gluten-free, etc.)",
              "Parents checking food quality for kids",
              "Anyone looking for a reliable food scanner",
            ].map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-white border text-sm shadow-product"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links for Internal Linking */}

      {/* FAQ Section (Visible, matches schema) */}
      <section className="border-t border-border/70 py-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              <h3>Is this food scanner free to use?</h3>
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Yes, EaterIQ’s food barcode scanner is completely free.
            </div>
          </details>
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              <h3>Do I need to install an app?</h3>
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              No, it works directly in your browser as a food scanning app.
            </div>
          </details>
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              <h3>How accurate is the ingredient checker?</h3>
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Our ingredient checker food system uses a continuously updated
              database for high accuracy.
            </div>
          </details>
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              <h3>Can I scan any product?</h3>
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Yes, our product scanner app supports a wide range of packaged
              food items.
            </div>
          </details>
        </div>
      </section>

      <section className="border-t border-border/70 py-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-center">
          Explore More
        </h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Link href="/blog/" className="group">
            <Card className="h-full rounded-[24px] border-white/65 bg-white/82 shadow-product transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    Nutrition Blog
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expert articles on healthy eating
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
            <Card className="h-full rounded-[24px] border-white/65 bg-white/82 shadow-product transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <Brain
                    className="h-5 w-5 text-accent-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    Nutrition Quizzes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Test your food knowledge
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

      <div className="h-[10px]" />
    </div>
  );
}
