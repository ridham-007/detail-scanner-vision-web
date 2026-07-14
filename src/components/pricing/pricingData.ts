import type { LucideIcon } from "lucide-react";
import {
  Scan,
  TrendingUp,
  Swords,
  AlertTriangle,
  Trophy,
  Calculator,
  Heart,
  Ban,
} from "lucide-react";

export const SUBSCRIPTION_PLANS = {
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

export const SAVINGS_PERCENT = 58;

export const PRICING_FEATURES: Array<{ icon: LucideIcon; label: string }> = [
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

