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
import { Search, Scan } from "lucide-react";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductDetails from "@/components/ProductDetails";
import { useProductLookup } from "@/hooks/useProductLookup";
import { ProductData } from "@/types/ProductData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { rateLimitedQuery } from "@/utils/rateLimitedSupabase";

const FoodScannerPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(
    null
  );
  const [showNoDataState, setShowNoDataState] = useState(false);
  const { lookupProduct, isLoading } = useProductLookup();
  const productDetailsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToResults = () => {
    // setTimeout(() => {
    //   productDetailsRef.current?.scrollIntoView({
    //     behavior: "smooth",
    //     block: "center",
    //   });
    // }, 10);
  };

  const handleScan = async (scannedCode: string) => {
    await rateLimitedQuery("scanHistory", async () => {
      setIsScanning(false);
      setShowNoDataState(false);
      scrollToResults();

      const { data, error } = await supabase
        .from("scan_history")
        .select("barcode")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching scan history:", error);
        return;
      }
      const alreadyScanned = data?.some(
        (entry) => entry.barcode === scannedCode
      );

      if (alreadyScanned) {
        toast.info(
          "You’ve already scanned this product. Check your history for details!"
        );
        return;
      }

      const product = await lookupProduct(scannedCode);

      if (product) {
        setCurrentProduct(product);

        await supabase.from("scan_history").insert([
          {
            user_id: user.id,
            barcode: scannedCode,
            product_name: product.name,
            health_score: product.health_score ?? null,
            scanned_at: new Date().toISOString(),
          },
        ]);
      } else {
        setCurrentProduct(null);
        setShowNoDataState(true);
      }
    });
  };

  const handleManualLookup = async () => {
    return rateLimitedQuery("scanHistory", async () => {
      const trimmedBarcode = manualBarcode.trim();
      if (!trimmedBarcode) return;

      setShowNoDataState(false);
      scrollToResults();

      const { data, error } = await supabase
        .from("scan_history")
        .select("barcode")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching scan history:", error);
        return;
      }

      const alreadyScanned = data?.some(
        (entry) => entry.barcode === trimmedBarcode
      );

      if (alreadyScanned) {
        toast.info(
          "You’ve already scanned this product. Check your history for details!"
        );
        return;
      }

      const product = await lookupProduct(trimmedBarcode);

      if (product) {
        setCurrentProduct(product);
        await supabase.from("scan_history").insert([
          {
            user_id: user.id,
            barcode: trimmedBarcode,
            product_name: product.name,
            health_score: product.health_score ?? null,
            scanned_at: new Date().toISOString(),
          },
        ]);
      } else {
        setCurrentProduct(null);
        setShowNoDataState(true);
      }
    });
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Food Scanner
        </h2>
        <p className="text-muted-foreground">
          Scan barcodes or enter them manually to get detailed product
          information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Barcode Scanner
            </CardTitle>
            <CardDescription>
              Point your camera at a product barcode to scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarcodeScanner
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />
          </CardContent>
        </Card>

        {/* Manual Entry Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Enter a barcode number manually if scanning doesn't work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter barcode number..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualLookup()}
              />
              <Button
                aria-label="Search"
                onClick={handleManualLookup}
                disabled={isLoading || !manualBarcode.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Try scanning: 8906000610077 (Crispy Potatoes) or 8906019779840
              (Mix Dry Fruits)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Section */}
      <div ref={productDetailsRef}>
        <ProductDetails
          product={currentProduct}
          isLoading={isLoading}
          showNoDataState={showNoDataState}
        />
      </div>
    </div>
  );
};

export default FoodScannerPage;
