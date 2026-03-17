"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { useProductLookup } from "@/hooks/useProductLookup";
import { ProductData } from "@/types/ProductData";

export default function ProductPage() {
  const { barcode } = useParams<{ barcode: string }>();
  const { lookupProduct, isLoading } = useProductLookup();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [showNoDataState, setShowNoDataState] = useState(false);

  useEffect(() => {
    if (!barcode) return;

    const load = async () => {
      const data = await lookupProduct(barcode, { mode: "view" });

      if (data) {
        setProduct(data);
      } else {
        setShowNoDataState(true);
      }
    };

    load();
  }, [barcode]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(var(--accent),0.12),transparent_28%),linear-gradient(180deg,rgb(var(--background)),rgba(var(--accent-soft),0.18))]">
      <div className="container px-4 py-8">
        <div className="mb-8 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[rgb(var(--accent-soft))]/28 to-[rgb(var(--accent))]/10 px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
          <p className="inline-flex items-center rounded-full border border-[rgb(var(--accent))]/20 bg-white/80 px-3 py-1 text-sm font-medium text-[rgb(var(--accent-foreground))]">
            Product breakdown
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Detailed product insights</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review ingredients, nutrition, and health context with the same clear card system used across the app.
          </p>
        </div>

        <ProductDetails
          product={product}
          isLoading={isLoading}
          showNoDataState={showNoDataState}
          scannedBarcode={barcode}
        />
      </div>
    </div>
  );
}
