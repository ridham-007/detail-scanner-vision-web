"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
      {/* IMAGE SKELETON */}
      <div className="w-24 h-24 rounded-xl bg-muted animate-pulse shrink-0" />

      {/* CONTENT */}
      <div className="flex-1 space-y-4">
        {/* TITLE */}
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />

        {/* SCORE */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          <div className="h-4 w-10 rounded bg-muted animate-pulse" />
        </div>

        {/* WHY BETTER */}
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

  const handleProductClick = (barcode: string) => {
    onOpenChange(false); // close modal
    router.push(`/product/${barcode}`); // navigate
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-10">
        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">
            Healthier Alternatives
          </h1>
        </div>

        {/* ================= LOADER ================= */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <AlternativeSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ================= CONTENT ================= */}
        {!loading && (
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
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No image
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 space-y-3">
                  {/* NAME */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  {/* SCORE */}
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

                  {/* WHY BETTER */}
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

        {/* ================= EMPTY ================= */}
        {!loading && alternatives.length === 0 && (
          <p className="text-muted-foreground">
            No healthier alternatives found for this product.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
