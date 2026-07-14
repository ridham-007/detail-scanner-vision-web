"use client";

import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { FEATURE_FLAGS, FeatureKey, FeatureConfig } from "./featureFlags";

export interface FeatureAccess {
  featureKey: FeatureKey;
  config: FeatureConfig;
  isPro: boolean;
  canAccess: boolean;
  hasPreview: boolean;
  freeLimit?: number;
  paywallMessage: string;
  paywallSubtext?: string;
  openPaywall: () => void;
}

export const useFeatureAccess = (featureKey: FeatureKey): FeatureAccess => {
  const router = useRouter();
  const { tier } = useSubscription();

  const config = FEATURE_FLAGS[featureKey];

  const isPro = tier !== "free";
  const canAccess = !config.requiresPro || isPro;
  const hasPreview = !!config.freePreview;

  const openPaywall = () => {
    router.push("/download");
  };

  return {
    featureKey,
    config,
    isPro,
    canAccess,
    hasPreview,
    freeLimit: config.freeLimit,
    paywallMessage: config.paywallMessage,
    paywallSubtext: config.paywallSubtext,
    openPaywall,
  };
};
