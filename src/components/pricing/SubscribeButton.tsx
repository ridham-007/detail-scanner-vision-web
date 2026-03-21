"use client";

import React, { useState } from "react";
import {
  Scan,
  TrendingUp,
  Swords,
  AlertTriangle,
  Trophy,
  Calculator,
  Heart,
  Ban,
  Star,
  Check,
  Zap,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

// ── Plans ─────────────────────────────────────────────────────────────────────
const NEW_PLANS = {
  monthly: {
    planId: "pro_monthly",
    razorpayPlanId: "plan_SScmVPb0bTd8vZ",
    amount: 2.99,
    display: "$2.99",
    period: "month",
  },
  yearly: {
    planId: "pro_yearly",
    razorpayPlanId: "plan_SSclqfflKDBytG",
    amount: 14.99,
    display: "$14.99",
    period: "year",
  },
} as const;

const SAVINGS_PERCENT = 58;
const MONTHLY_EQUIV = (NEW_PLANS.yearly.amount / 12).toFixed(2);

const PRO_FEATURES = [
  { icon: Scan, label: "Unlimited product scans" },
  { icon: TrendingUp, label: "Full nutrition breakdown & allergen flags" },
  { icon: Swords, label: "Food Battle — compare any two products" },
  {
    icon: AlertTriangle,
    label: "Exact ingredient flagging from your preferences",
  },
  { icon: Trophy, label: "Unlimited quizzes + create your own" },
  { icon: Calculator, label: "Detailed health calculator analysis" },
  { icon: Heart, label: "Unlimited favourites & full scan history" },
  { icon: Ban, label: "Ad-free experience" },
];

export default function SubscribeButton() {
  const { user, session } = useAuth();
  const router = useRouter();
  const { tier, subscribed, platform, checkSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">(
    "yearly",
  );
  const [processing, setProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const selectedPlan = NEW_PLANS[billingCycle];
  const isCurrentPlan = tier === "pro" && subscribed;

  // ✅ NEW: External subscription handling
  const isExternalSubscription = subscribed && platform && platform !== "web";

  const platformLabel =
    platform === "ios"
      ? "App Store"
      : platform === "android"
        ? "Play Store"
        : "";

  const handleSubscribe = async () => {
    if (isExternalSubscription) {
      toast.error(`Manage your subscription from ${platformLabel}`);
      return;
    }

    if (!user || !session) {
      setShowAuthModal(true);
      return;
    }

    setProcessing(true);
    try {
      const loaded = await new Promise<boolean>((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });

      if (!loaded) throw new Error("Failed to load payment gateway");

      const { data, error } = await supabase.functions.invoke(
        "razorpay-create-subscription",
        {
          body: {
            planId: selectedPlan.planId,
            razorpayPlanId: selectedPlan.razorpayPlanId,
          },
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      if (error) throw error;
      if (!data?.subscriptionId)
        throw new Error("Failed to create subscription");

      await new Promise<void>((resolve, reject) => {
        const options = {
          key: data.keyId,
          subscription_id: data.subscriptionId,
          name: "EaterIQ",
          description: `EaterIQ Pro — ${billingCycle}`,
          prefill: { email: data.userEmail ?? "", name: data.userName ?? "" },
          theme: { color: "#f97316" },
          handler: async () => {
            await new Promise((r) => setTimeout(r, 2000));
            await checkSubscription();
            window.location.href = "/subscription-success";
            resolve();
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              reject(new Error("Payment cancelled"));
            },
          },
        };
        new window.Razorpay(options).open();
      });
    } catch (err) {
      if (err instanceof Error && err.message !== "Payment cancelled") {
        console.error(err);
        toast.error("Failed to process payment. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-primary/20 overflow-hidden shadow-sm hover:shadow-md transition">
        {/* ── Header ───────────────── */}
        <div className="bg-gradient-to-b from-primary/20 to-white px-6 pt-8 pb-6 text-center border-b border-orange-100">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <Star className="w-7 h-7 text-white" fill="white" />
          </div>

          <Badge className="mb-3 rounded-full border border-orange-200 bg-white text-orange-700 px-3 py-1 text-xs font-medium gap-1.5 inline-flex items-center">
            <Zap className="w-3 h-3" />
            Most Popular
          </Badge>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            EaterIQ Pro
          </h2>

          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Make smarter food choices with advanced insights
          </p>

          {/* ✅ External badge */}
          {isExternalSubscription && (
            <div className="mt-3">
              <Badge variant="secondary">Managed on {platformLabel}</Badge>
            </div>
          )}
        </div>

        {/* ── Features ───────────────── */}
        <div className="px-5 sm:px-8 py-5 border-b border-orange-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {PRO_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <Check className="w-4 h-4 text-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Billing ───────────────── */}
        <div className="px-5 sm:px-8 py-6 space-y-3">
          {/* Yearly */}
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`w-full flex justify-between rounded-2xl border-2 px-4 py-3 transition ${
              billingCycle === "yearly"
                ? "border-primary bg-orange-50"
                : "border-gray-200 hover:bg-orange-50/30"
            }`}
            disabled={isExternalSubscription}
          >
            <div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">Yearly</span>
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  SAVE {SAVINGS_PERCENT}%
                </span>
              </div>
              <p className="text-xs text-gray-500 text-left">
                ${MONTHLY_EQUIV}/month
              </p>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg text-primary">
                {NEW_PLANS.yearly.display}
              </span>
              <p className="text-xs text-gray-500">/year</p>
            </div>
          </button>

          {/* Monthly */}
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`w-full flex justify-between rounded-2xl border-2 px-4 py-3 transition ${
              billingCycle === "monthly"
                ? "border-primary bg-orange-50"
                : "border-gray-200 hover:bg-orange-50/30"
            }`}
            disabled={isExternalSubscription}
          >
            <div className="text-left">
              <span className="font-semibold text-left">Monthly</span>
              <p className="text-xs text-gray-500">Billed monthly</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg text-primary">
                {NEW_PLANS.monthly.display}
              </span>
              <p className="text-xs text-gray-500">/month</p>
            </div>
          </button>

          {/* CTA */}
          <div className="pt-2">
            {isCurrentPlan && !isExternalSubscription ? (
              <Button
                variant="outline"
                className="w-full rounded-full h-12"
                disabled
              >
                ✓ Current Plan
              </Button>
            ) : isExternalSubscription ? (
              <Button
                variant="outline"
                className="w-full rounded-full h-12"
                disabled
              >
                Manage on {platformLabel}
              </Button>
            ) : (
              <Button
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition"
              >
                {processing
                  ? "Processing..."
                  : `Get Pro · ${selectedPlan.display}/${selectedPlan.period}`}
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-gray-500">
            Cancel anytime · 7-day money-back guarantee
          </p>
        </div>
      </div>
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            {/* Icon */}
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-center mb-1">
              Sign in required
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center mb-5">
              Please sign in to continue and unlock Pro features
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/auth")}
                className="rounded-3xl text-white bg-primary p-3 flex-1 flex items-center justify-center w-full hover:bg-primary/50 hover:!text-foreground"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
              <button
                className="w-full p-3 border border-gray-200 flex-1 rounded-full"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
