"use client";

import React, { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureKey } from "./featureFlags";
import { useFeatureAccess } from "./useFeatureAccess";

type GateMode = "block" | "teaser";

interface SubscriptionGateProps {
  feature: FeatureKey;
  mode?: GateMode;
  children: ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  feature,
  mode = "block",
  children,
}) => {
  const { canAccess, paywallMessage, paywallSubtext, openPaywall } =
    useFeatureAccess(feature);

  if (canAccess) {
    return <>{children}</>;
  }

  if (mode === "teaser") {
    return (
      <div className="space-y-4">
        {children}
        <Card className="border-dashed border-primary/40 bg-primary/5">
          <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{paywallMessage}</p>
                {paywallSubtext && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {paywallSubtext}
                  </p>
                )}
              </div>
            </div>
            <Button size="sm" onClick={openPaywall} className="whitespace-nowrap">
              Unlock with Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-dashed border-primary/40 bg-muted/40">
      <CardContent className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">{paywallMessage}</p>
            {paywallSubtext && (
              <p className="text-xs text-muted-foreground mt-1">
                {paywallSubtext}
              </p>
            )}
          </div>
        </div>
        <Button onClick={openPaywall} className="whitespace-nowrap">
          Unlock with Pro
        </Button>
      </CardContent>
    </Card>
  );
};

