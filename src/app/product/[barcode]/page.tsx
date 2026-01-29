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
    <div className="container pt-6">
      <ProductDetails
        product={product}
        isLoading={isLoading}
        showNoDataState={showNoDataState}
        scannedBarcode={barcode}
      />
    </div>
  );
}
