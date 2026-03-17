"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Scan, ShieldCheck } from "lucide-react";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductDetails from "@/components/ProductDetails";
import { useProductLookup } from "@/hooks/useProductLookup";
import { ProductData } from "@/types/ProductData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  trackEvent,
  trackScanAttempt,
  trackScanSuccess,
  trackScanError,
  trackProductView,
} from "@/utils/analytics";
import UpgradeBanner from "@/components/UpgradeBanner";
import { useDailyScans } from "@/hooks/useDailyScans";
import SEOHead from "@/components/SEOHead";

const FoodScannerPage: React.FC = () => {
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
    // Check scan limit for free users
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

    // Only check scan history if user is authenticated
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
      incrementScan(); // Track the scan
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const handleManualLookup = async () => {
    const trimmedBarcode = manualBarcode.trim();
    if (!trimmedBarcode) return;

    // Check scan limit for free users
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

    const product = await lookupProduct(trimmedBarcode);

    if (product) {
      setCurrentProduct(product);
      incrementScan(); // Track the scan
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <>
      <div className="space-y-8 pt-4 container">
        {/* Upgrade Banner for Free Users */}
        {!isUnlimited && (
          <UpgradeBanner
            scansRemaining={scansRemaining as number}
            maxScans={maxScans as number}
            variant="compact"
          />
        )}
        {/* Hero Section - Yuka Style */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Food Scanner
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Decode product quality in seconds. Get instant nutrition insights
              and make informed food choices.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10s</div>
              <div className="text-sm text-muted-foreground">Analysis</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Scanner Section - Enhanced */}
          <Card className="overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))] shadow-product">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <div className="p-3 rounded-full bg-primary/10">
                  <Scan className="h-6 w-6 text-primary" />
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

          {/* Manual Entry Section - Enhanced */}
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

        <div className="h-[10px]" />
      </div>
    </>
  );
};

export default FoodScannerPage;
