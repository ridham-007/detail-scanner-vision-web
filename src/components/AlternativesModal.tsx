"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageIcon, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductImage } from "../lib/api/productImage";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

interface Alternative {
  name: string;
  barcode: string;
  image?: string;
  health_score: number;
  score_improvement?: number;
  why_better?: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alternatives: Alternative[];
  loading: boolean;
}

function AlternativeSkeleton() {
  return (
    <div className="flex items-center gap-6 p-6 border border-[#76a63f]/30 rounded-2xl bg-background">
      <div className="w-24 h-24 rounded-xl bg-muted animate-pulse shrink-0" />

      <div className="flex-1 space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />

        <div className="flex items-center gap-4">
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          <div className="h-4 w-10 rounded bg-muted animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AlternativesModal({
  open,
  onOpenChange,
  alternatives,
  loading,
}: Props) {
  const router = useRouter();
  const { tier } = useSubscription();
  const isPro = tier !== "free";

  const [resolvedImages, setResolvedImages] = useState<
    Record<string, string | null>
  >({});

  // ================= IMAGE LOADER (FIXED) =================
  useEffect(() => {
    if (!open) return;

    alternatives.forEach(async (item) => {

      // ✅ IF IMAGE ALREADY EXISTS → DON’T CALL API
      if (item.image && item.image.startsWith("http")) {
        setResolvedImages((prev) => ({
          ...prev,
          [item.barcode]: item.image!,
        }));
        return;
      }

      // ✅ IF ALREADY FETCHED → DON’T CALL AGAIN
      if (resolvedImages[item.barcode]) {
        return;
      }

      console.log("🔁 Calling API only for:", item.barcode);

      const img = await fetchProductImage(item.barcode);

      setResolvedImages((prev) => ({
        ...prev,
        [item.barcode]: img,
      }));
    });
  }, [alternatives, open]);

  const handleProductClick = (barcode: string) => {
    onOpenChange(false);
    router.push(`/product/${barcode}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-[28px] p-4 sm:max-w-4xl sm:p-6 lg:max-w-7xl lg:p-10">

        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Healthier Alternatives
          </h1>
        </div>

        {/* Free users: show upgrade message instead of list */}
        {!isPro && !loading && (
          <div className="max-w-xl space-y-4">
            <p className="text-base font-medium">
              Want to see healthier alternatives tailored to you?
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro to unlock full access to better product suggestions
              with improved health scores and personalized recommendations.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Unlimited healthier alternatives
              </li>
              <li className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Rich product images and details
              </li>
            </ul>
            <Button
              className="mt-2 w-full sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                router.push("/pricing");
              }}
            >
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Pro users: show real alternatives */}
        {isPro && loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <AlternativeSkeleton key={i} />
            ))}
          </div>
        )}

        {isPro && !loading && alternatives.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {alternatives.map((item, index) => (
              <div
                key={item.barcode}
                onClick={() => handleProductClick(item.barcode)}
                className="
                  flex items-center gap-6 p-6
                  border border-[#76a63f] rounded-2xl
                  bg-background cursor-pointer
                  hover:shadow-lg hover:shadow-[#76a63f]/50
                  transition
                "
              >
                {/* IMAGE */}
                <div className="w-24 h-24 rounded-xl bg-muted border flex items-center justify-center overflow-hidden shrink-0">
                  {resolvedImages[item.barcode] ? (
                    <img
                      src={resolvedImages[item.barcode]!}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        setResolvedImages((prev) => ({
                          ...prev,
                          [item.barcode]: null,
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground gap-1">
                      <ImageIcon className="w-6 h-6 opacity-80" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {item.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-semibold">
                      {item.health_score}
                    </div>

                    {item.score_improvement !== undefined && (
                      <span className="text-sm font-medium text-emerald-600">
                        +{item.score_improvement}
                      </span>
                    )}
                  </div>

                  {item.why_better && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.why_better.slice(0, 2).map((reason, i) => (
                        <li key={i}>• {reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isPro && !loading && alternatives.length === 0 && (
          <p className="text-muted-foreground">
            No healthier alternatives found for this product.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
