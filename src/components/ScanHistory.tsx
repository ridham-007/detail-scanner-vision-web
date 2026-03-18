"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  History,
  Trash2,
  Calendar,
  BarChart3,
  TrendingUp,
  Loader2,
  Sparkles,
  ArrowRight,
  Crown,
  ChevronRight,
  ScanLine,
  Clock,
} from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

const ScanHistory = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const router = useRouter();
  const {
    scanHistory,
    isLoading,
    error,
    deleteScanHistoryItem,
    clearAllHistory,
    stats,
  } = useScanHistory();

  if (!user) {
    return (
      <Card className="mx-auto w-full max-w-4xl rounded-[28px] border-white/70 bg-white/85 shadow-product">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <span className="text-lg font-medium mb-2">
              Sign in to view your scan history
            </span>
            <p className="text-muted-foreground">
              Track your scanned products and health insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <PageHeader />
          <div className="mt-10 flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary mr-3" />
            <span className="text-sm text-gray-500">Loading scan history...</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <PageHeader />
          <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">Error loading scan history</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getScoreBadgeClass = (score: number | null) => {
    if (!score) return "bg-gray-100 text-gray-500";
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-gray-700 font-medium">Scan History</li>
          </ol>
        </nav>

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <PageHeader />

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 text-center">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stats.totalScans}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Scans</p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 text-center">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stats.averageHealthScore}</p>
            <p className="text-xs text-gray-400 mt-0.5">Avg Score</p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 text-center">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stats.recentScans}</p>
            <p className="text-xs text-gray-400 mt-0.5">This Week</p>
          </div>
        </div>

        {/* ── Scan History List ────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm">

          {/* List header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <History className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Scan History</h2>
              {scanHistory.length > 0 && (
                <span className="text-sm *: text-black bg-gray-100 rounded-full px-2 py-0.5">
                  <p>total show history: {scanHistory.length}</p>
                </span>
              )}
            </div>
            {scanHistory.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full px-3 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear scan history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your scan history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAllHistory}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Upgrade banner for free users */}
          {tier === "free" && stats.totalScans >= 10 && (
            <div className="mx-4 sm:mx-6 mt-4 flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Crown className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Showing your latest scans only</p>
                  <p className="text-xs text-gray-500 mt-0.5">Upgrade to Pro to unlock your full scan history forever.</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/pricing")}
                className="rounded-full bg-primary hover:bg-primary/90 text-white text-xs flex-shrink-0"
              >
                Upgrade to Pro
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}

          {/* Empty state */}
          {scanHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                <ScanLine className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No scans yet</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Start scanning products to build your history and track your nutrition journey.
              </p>
              <Button
                size="sm"
                onClick={() => router.push("/scanner")}
                className="mt-5 rounded-full bg-primary hover:bg-primary/90 text-white"
              >
                <ScanLine className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] max-h-[500px]">
              <div className="px-4 sm:px-6 py-4 space-y-2">
                {scanHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 cursor-pointer hover:border-orange-200 hover:bg-orange-50/40 transition-all"
                    onClick={() => router.push(`/product/${item.barcode}`)}
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <ScanLine className="w-4 h-4 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                        {item.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(item.scanned_at), "MMM d, yyyy · HH:mm")}
                        </span>
                      </div>
                    </div>

                    {/* Score badge */}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${getScoreBadgeClass(item.health_score)}`}>
                      {item.health_score ?? "N/A"}
                    </span>

                    {/* Delete */}
                    <button
                      aria-label={`Delete scan for ${item.product_name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScanHistoryItem(item.id);
                      }}
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Arrow */}
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

      </div>
    </div>
  );
};

// ── Page Header component — matches other pages exactly ───────────────────────
function PageHeader() {
  return (
    <header className="mb-8 sm:mb-10 text-center">
      <Badge
        className="mb-4 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-orange-700 text-xs font-medium gap-1.5 inline-flex items-center"
      >
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        Your health journey
      </Badge>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-3">
        Scan <span className="text-primary">History</span>
      </h1>
      <p className="mx-auto max-w-md text-sm sm:text-base text-gray-500">
        Track every product you've scanned and monitor your nutrition journey over time.
      </p>
    </header>
  );
}

export default ScanHistory;