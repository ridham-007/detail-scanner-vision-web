"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Calendar,
  Loader2,
  Sparkles,
  TrendingUp,
  ListChecks,
  ChevronDown,
  Star,
  Package,
  BarChart3,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/Breadcrumbs";

const MAX_FREE_FAVORITES = 10;
type SortOption = "recent" | "score-high" | "score-low" | "name";

const getScoreTier = (score: number | null): "high" | "med" | "low" | "na" => {
  if (!score) return "na";
  if (score >= 80) return "high";
  if (score >= 60) return "med";
  return "low";
};

const scoreTierConfig = {
  high: {
    accentBar: "bg-gradient-to-b from-emerald-400 to-teal-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
    label: "Great",
    distBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    countColor: "text-emerald-600",
    miniScore: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    ring: "ring-emerald-100",
  },
  med: {
    accentBar: "bg-gradient-to-b from-orange-300 to-orange-500",
    badge: "bg-orange-50 text-orange-600 border border-orange-200",
    dot: "bg-orange-400",
    label: "Okay",
    distBar: "bg-gradient-to-r from-orange-300 to-orange-500",
    countColor: "text-orange-500",
    miniScore: "bg-orange-50 text-orange-600 border border-orange-100",
    ring: "ring-orange-100",
  },
  low: {
    accentBar: "bg-gradient-to-b from-rose-400 to-pink-500",
    badge: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-400",
    label: "Poor",
    distBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    countColor: "text-rose-600",
    miniScore: "bg-rose-50 text-rose-700 border border-rose-100",
    ring: "ring-rose-100",
  },
  na: {
    accentBar: "bg-zinc-200",
    badge: "bg-zinc-100 text-zinc-400 border border-zinc-200",
    dot: "bg-zinc-300",
    label: "N/A",
    distBar: "bg-zinc-200",
    countColor: "text-zinc-400",
    miniScore: "bg-zinc-100 text-zinc-400 border border-zinc-200",
    ring: "ring-zinc-100",
  },
};

// ─── Loading / Auth States ─────────────────────────────────────────────────

const SignInPrompt = () => (
  <div className="w-full flex flex-col items-center justify-center py-28 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 border border-orange-100">
      <Heart className="w-7 h-7 text-orange-400" />
    </div>
    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-1">
      Sign in to view favorites
    </h3>
    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
      Save your favorite products and access them instantly.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="w-full flex items-center justify-center py-28 gap-3">
    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
    <span className="text-sm text-muted-foreground font-medium">Loading favorites…</span>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[28px] border border-orange-100">
    <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-5 border border-orange-100">
      <Heart className="w-9 h-9 text-orange-200" />
    </div>
    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
      No favorites yet
    </h3>
    <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
      Scan a product and tap the heart icon to save it here.
    </p>
  </div>
);

// ─── Favorite Row ──────────────────────────────────────────────────────────

const FavoriteRow = ({
  favorite,
  onRemove,
}: {
  favorite: {
    id: string;
    barcode: string;
    product_name: string;
    health_score: number | null;
    created_at: string;
  };
  onRemove: (barcode: string) => void;
}) => {
  const tier = getScoreTier(favorite.health_score);
  const cfg = scoreTierConfig[tier];

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-[22px] border border-orange-100 px-4 sm:px-5 py-4 hover:border-orange-200 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)] transition-all duration-200">
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full", cfg.accentBar)} />

      {/* Top row (mobile) */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        {/* Score block */}
        <div className="flex items-center sm:flex-col sm:items-center gap-2 sm:gap-0 shrink-0 w-auto sm:w-11 pl-1">
          <span className={cn("text-sm font-bold rounded-lg px-2 py-1 min-w-[36px] text-center tabular-nums", cfg.badge)}>
            {favorite.health_score ?? "–"}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground sm:mt-1">
            {cfg.label}
          </span>
        </div>
        {/* Delete — mobile */}
        <div className="flex sm:hidden">
          <button
            onClick={() => onRemove(favorite.barcode)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground border border-orange-100 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Divider (hide on mobile) */}
      <div className="hidden sm:block w-px h-8 bg-orange-100 shrink-0" />

      {/* Product info */}
      <div className="flex-1 min-w-0 w-full">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-orange-500 transition-colors">
          {favorite.product_name}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="font-mono text-xs bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded-md">
            {favorite.barcode}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(favorite.created_at), "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Delete — desktop hover */}
      <div className="hidden sm:flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onRemove(favorite.barcode)}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 border border-orange-100 hover:border-rose-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Sidebar Panels ────────────────────────────────────────────────────────

const ScoreDistributionPanel = ({
  favorites,
}: {
  favorites: Array<{ health_score: number | null }>;
}) => {
  const counts = {
    high: favorites.filter((f) => getScoreTier(f.health_score) === "high").length,
    med: favorites.filter((f) => getScoreTier(f.health_score) === "med").length,
    low: favorites.filter((f) => getScoreTier(f.health_score) === "low").length,
    na: favorites.filter((f) => getScoreTier(f.health_score) === "na").length,
  };
  const total = favorites.length || 1;

  const rows: { label: string; tier: keyof typeof scoreTierConfig; count: number }[] = [
    { label: "Great (80+)", tier: "high", count: counts.high },
    { label: "Okay (60–79)", tier: "med", count: counts.med },
    { label: "Poor (<60)", tier: "low", count: counts.low },
    { label: "No score", tier: "na", count: counts.na },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-orange-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Score breakdown</h3>
      </div>
      <div className="space-y-4">
        {rows.map((r) => {
          const cfg = scoreTierConfig[r.tier];
          return (
            <div key={r.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{r.label}</span>
                <span className={cn("text-xs font-bold", cfg.countColor)}>{r.count}</span>
              </div>
              <div className="h-1.5 bg-orange-50 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", cfg.distBar)}
                  style={{ width: `${(r.count / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecentActivityPanel = ({
  favorites,
}: {
  favorites: Array<{ product_name: string; created_at: string; health_score: number | null }>;
}) => {
  const recent = [...favorites]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="bg-white rounded-[24px] border border-orange-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Recently added</h3>
      </div>
      <div className="divide-y divide-orange-50">
        {recent.map((f, i) => {
          const tier = getScoreTier(f.health_score);
          const cfg = scoreTierConfig[tier];
          return (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
              <div className="flex-1 min-w-0 w-full">
                <p className="text-xs font-semibold text-foreground truncate">{f.product_name}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(f.created_at), "MMM d")}</p>
              </div>
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-lg shrink-0", cfg.miniScore)}>
                {f.health_score ?? "–"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TopScorePanel = ({
  favorites,
}: {
  favorites: Array<{ product_name: string; health_score: number | null }>;
}) => {
  const top = [...favorites]
    .filter((f) => f.health_score)
    .sort((a, b) => (b.health_score ?? 0) - (a.health_score ?? 0))
    .slice(0, 3);

  return (
    <div className="bg-white rounded-[24px] border border-orange-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
          <Star className="w-4 h-4 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Top picks</h3>
      </div>
      {top.length === 0 ? (
        <p className="text-xs text-muted-foreground">No scored products yet.</p>
      ) : (
        <div className="divide-y divide-orange-50">
          {top.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <span className="text-xs font-bold text-orange-200 w-5 shrink-0">#{i + 1}</span>
              <p className="flex-1 text-xs font-semibold text-foreground truncate">{f.product_name}</p>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                {f.health_score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickTipsPanel = () => (
  <div className="bg-orange-50 rounded-[24px] border border-orange-100 p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-xl bg-white border border-orange-200 flex items-center justify-center">
        <AlertCircle className="w-4 h-4 text-orange-500" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">Quick tips</h3>
    </div>
    <ul className="space-y-2.5">
      {[
        "Aim for products scoring 80 or above",
        "Check ingredients on low-score items",
        "Use shopping lists to plan healthy meals",
      ].map((tip, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-orange-800 leading-snug">
          <span className="mt-0.5 w-[18px] h-[18px] rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
            {i + 1}
          </span>
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

const Favorites = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const router = useRouter();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();
  const [sort, setSort] = useState<SortOption>("recent");

  if (!user) return <SignInPrompt />;
  if (isLoading) return <LoadingState />;

  const isFreeTier = tier === "free";
  const limitReached = isFreeTier && favorites.length >= MAX_FREE_FAVORITES;
  const usagePercent = Math.min((favorites.length / MAX_FREE_FAVORITES) * 100, 100);

  const avgScore =
    favorites.filter((f) => f.health_score).length > 0
      ? Math.round(
          favorites.filter((f) => f.health_score).reduce((a, f) => a + (f.health_score ?? 0), 0) /
            favorites.filter((f) => f.health_score).length,
        )
      : null;

  const sorted = [...favorites].sort((a, b) => {
    if (sort === "score-high") return (b.health_score ?? 0) - (a.health_score ?? 0);
    if (sort === "score-low") return (a.health_score ?? 0) - (b.health_score ?? 0);
    if (sort === "name") return a.product_name.localeCompare(b.product_name);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const stats = [
    {
      icon: Heart,
      label: "Total saved",
      value: favorites.length,
      sub: isFreeTier ? `of ${MAX_FREE_FAVORITES} free slots` : "unlimited plan",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      iconBorder: "border-orange-200",
      accentColor: "text-orange-500",
    },
    {
      icon: TrendingUp,
      label: "Average score",
      value: avgScore ?? "–",
      sub: avgScore ? (avgScore >= 70 ? "Looking healthy!" : "Room to improve") : "No scores yet",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      iconBorder: "border-emerald-200",
      accentColor: "text-emerald-500",
    },
    {
      icon: ListChecks,
      label: "High-score items",
      value: favorites.filter((f) => getScoreTier(f.health_score) === "high").length,
      sub: "scored 80 or above",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-400",
      iconBorder: "border-orange-200",
      accentColor: "text-orange-400",
    },
    {
      icon: Package,
      label: "Needs attention",
      value: favorites.filter((f) => getScoreTier(f.health_score) === "low").length,
      sub: "scored below 60",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      iconBorder: "border-rose-200",
      accentColor: "text-rose-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Favourites' }]} />

      {/* ── Page Header ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 mb-4">
          <Heart className="h-3.5 w-3.5 text-orange-500 fill-orange-400" />
          <span className="text-xs font-semibold text-orange-500 tracking-wide">Your Saved Products</span>
        </div>
        <h1 className="text-[2rem] font-bold leading-[1.02] tracking-tight text-foreground mb-1">
          Your Favourites
        </h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "product" : "products"} saved
        </p>

        {/* Free tier usage bar */}
        {isFreeTier && (
          <div className="inline-flex items-center gap-4 bg-white border border-orange-100 rounded-2xl px-5 py-3 mt-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {favorites.length} / {MAX_FREE_FAVORITES} free slots
              </p>
              <div className="w-32 h-1.5 bg-orange-50 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    usagePercent >= 100 ? "bg-rose-400" : usagePercent >= 70 ? "bg-orange-400" : "bg-emerald-400",
                  )}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            {limitReached && (
              <button
                onClick={() => router.push("/pricing")}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group bg-white rounded-[24px] border border-orange-100 px-5 py-5 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] transition-all duration-300 flex items-start gap-3.5"
          >
            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6", s.iconBg, s.iconBorder)}>
              <s.icon className={cn("w-5 h-5", s.iconColor)} />
            </div>
            <div>
              <p className="text-[26px] font-bold leading-[1.02] tracking-tight text-foreground">{s.value}</p>
              <p className={cn("text-xs font-bold uppercase tracking-wider mt-0.5", s.accentColor)}>{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body: List + Sidebar ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* Main list */}
        <div className="flex-1 min-w-0">
          {favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {sorted.length} items
                </p>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="appearance-none text-xs font-medium text-foreground bg-white border border-orange-200 rounded-xl pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-orange-400"
                  >
                    <option value="recent">Most recent</option>
                    <option value="score-high">Highest score</option>
                    <option value="score-low">Lowest score</option>
                    <option value="name">Name A–Z</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {sorted.map((favorite) => (
                  <FavoriteRow key={favorite.id} favorite={favorite} onRemove={removeFromFavorites} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        {favorites.length > 0 && (
          <div className="w-full lg:w-[272px] xl:w-[296px] shrink-0 flex flex-col gap-4">
            <ScoreDistributionPanel favorites={favorites} />
            <RecentActivityPanel favorites={favorites} />
            <TopScorePanel favorites={favorites} />
            <QuickTipsPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;