import { useEffect, useState } from "react";
import { fetchProductImage } from "@/lib/api/productImage";
import { useAuth } from "@/contexts/AuthContext";

export const useProductImage = (
  barcode?: string,
  existingImages?: string[]
) => {
  const [apiImage, setApiImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const {session, deviceId} = useAuth();

  const hasValidExistingImage =
    existingImages?.some(
      (image) => typeof image === "string" && image.trim().length > 0,
    ) ?? false;

  useEffect(() => {
    const load = async () => {
      if (!barcode) return;

      // Skip the API lookup only when we already have a real image URL.
      if (hasValidExistingImage) {
        return;
      }
      
      setImageLoading(true);
      try {
        const image = await fetchProductImage(
          barcode,
          deviceId,
          session?.access_token,
        );
        setApiImage(image);
      } finally {
        setImageLoading(false);
      }
    };

    load();
  }, [barcode, hasValidExistingImage, deviceId, session?.access_token]);

  return { apiImage, imageLoading };
};
