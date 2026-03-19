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
      {/* Upgrade Banner for Free Users */}
      <Breadcrumbs items={[{ label: 'Food Scanner' }]} />
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
          <h1 className="text-4xl md:text-5xl text-[1.5rem] font-bold leading-[1.02] tracking-tight text-foreground">
            Food{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Scanner
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Decode product quality in seconds with the same bright, practical
            guidance you see in the app.
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
            <div className="rounded-[22px] border border-orange-100/80 bg-orange-50/60 p-4">
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
            </div>
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

      {/* SEO-friendly content section (visible) */}
      <section className="border-t border-border/70 py-12">
  <div className="max-w-4xl mx-auto">
    <h2 className="mb-10 text-center text-3xl font-bold">
      How the Food Scanner Works
    </h2>

    <div className="relative flex flex-col md:flex-row items-stretch gap-0">
      {/* Connector line (desktop) */}
      <div className="hidden md:block absolute top-10 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0" />

      {[
        {
          step: "1",
          title: "Scan the Barcode",
          desc: "Point your camera at any food product barcode or enter it manually.",
          icon: (
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2v18H3V3zm4 0h1v18H7V3zm3 0h2v18h-2V3zm4 0h1v18h-1V3zm3 0h2v18h-2V3z" />
              <rect x="2" y="2" width="20" height="20" rx="3" strokeWidth={1.5} fill="none" />
            </svg>
          ),
        },
        {
          step: "2",
          title: "Instant Analysis",
          desc: "EaterIQ analyzes ingredients, nutrition facts, and additives in seconds.",
          icon: (
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 3" />
            </svg>
          ),
        },
        {
          step: "3",
          title: "Get Insights",
          desc: "Receive health scores, warnings, and personalized recommendations.",
          icon: (
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          ),
        },
      ].map((item, i) => (
        <div key={i} className="relative z-10 flex-1 flex flex-col items-center group">
          {/* Mobile connector */}
          {i < 2 && (
            <div className="md:hidden w-px h-8 bg-gradient-to-b from-orange-300 to-orange-100 my-1" />
          )}

          <div className="w-full rounded-[26px] border border-white/65 bg-white/82 p-6 text-center shadow-product transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
            {/* Step badge */}
            <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center">
              {/* Animated ring */}
              <span className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-30 group-hover:opacity-60" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 border border-orange-200 shadow-sm">
                {item.icon}
              </span>
              {/* Step number pill */}
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow">
                {item.step}
              </span>
            </div>

            <h3 className="font-semibold mb-2 text-base">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

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

      {/* Related Links for Internal Linking */}
      <section className="border-t border-border/70 py-8">
        <h2 className="text-xl font-bold mb-6 text-center">Explore More</h2>
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
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
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
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
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

      {/* FAQ Section (Visible, matches schema) */}
      <section className="border-t border-border/70 py-8">
        <h2 className="text-xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              How does the food scanner work?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Simply point your camera at any food product barcode. EaterIQ
              analyzes the product's ingredients, nutritional information, and
              additives to provide you with a comprehensive health score and
              detailed breakdown.
            </div>
          </details>
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              Is the food scanner free to use?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              Yes! EaterIQ's food scanner is free to use. You can scan products
              and get instant nutrition insights without any cost.
            </div>
          </details>
          <details className="group rounded-[22px] border border-white/65 bg-white/82 shadow-product">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
              What information does the scanner provide?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-muted-foreground">
              The scanner provides health scores, ingredient analysis,
              nutritional breakdown, additive warnings, allergen information,
              and personalized recommendations based on your dietary
              preferences.
            </div>
          </details>
        </div>
      </section>

      <div className="h-[10px]" />
    </div>
  );
}
