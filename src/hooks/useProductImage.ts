import { useEffect, useState } from "react";
import { fetchProductImage } from "@/lib/api/productImage";

export const useProductImage = (
  barcode?: string,
  existingImages?: string[]
) => {
  const [apiImage, setApiImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!barcode) return;

      // If already have images from main API → skip
      if (existingImages && existingImages.length > 0) {
        return;
      }

      setImageLoading(true);

      const image = await fetchProductImage(barcode);

      setApiImage(image);
      setImageLoading(false);
    };

    load();
  }, [barcode, existingImages]);

  return { apiImage, imageLoading };
};
