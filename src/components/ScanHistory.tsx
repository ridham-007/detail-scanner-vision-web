import React from "react";
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
} from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

const TotalScansStrip = ({ totalScans }: { totalScans: number }) => {
  const milestones = [10, 25, 50, 100, 250, 500, 1000];
  const nextMilestone =
    milestones.find((m) => m > totalScans) ?? milestones[milestones.length - 1];
  const prevMilestone = milestones[milestones.indexOf(nextMilestone) - 1] ?? 0;
  const progress = Math.min(
    ((totalScans - prevMilestone) / (nextMilestone - prevMilestone)) * 100,
    100
  );
  const segmentCount = 7;
  const filledSegments = Math.floor((progress / 100) * segmentCount);
  const partialFill =
    ((progress / 100) * segmentCount - filledSegments) * 100;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: segmentCount }).map((_, i) => (
          <div
            key={i}
            className="relative h-2 flex-1 overflow-hidden rounded-full bg-orange-100"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-orange-500 transition-all duration-700"
              style={{
                width:
                  i < filledSegments
                    ? "100%"
                    : i === filledSegments
                      ? `${partialFill}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {totalScans} scanned
        </span>
        <span className="text-xs font-semibold text-orange-500">
          Next: {nextMilestone}
        </span>
      </div>
    </div>
  );
};

const WeekCalendarStrip = ({ recentScans }: { recentScans: number }) => {
  const today = new Date();
  const todayIndex = today.getDay();
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1;
  const daysElapsed = todayMapped + 1;
  const activeDays = Math.min(recentScans, daysElapsed);

  return (
    <div className="mt-4 flex items-end justify-between gap-1">
      {days.map((day, i) => {
        const isToday = i === todayMapped;
        const isFuture = i > todayMapped;
        const isActive = !isFuture && i < activeDays;

        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-md transition-all duration-300 ${isToday
                  ? "h-5 bg-orange-500 shadow-sm shadow-orange-200"
                  : isActive
                    ? "h-3.5 bg-orange-300"
                    : isFuture
                      ? "h-2 bg-orange-50"
                      : "h-2 bg-orange-100"
                }`}
            />
            <span
              className={`text-xs font-semibold leading-none ${isToday
                  ? "text-orange-500"
                  : isFuture
                    ? "text-muted-foreground/30"
                    : "text-muted-foreground"
                }`}
            >
              {day}
            </span>
            {isToday && (
              <span className="h-1 w-1 animate-pulse rounded-full bg-orange-500" />
            )}
          </div>
        );
      })}
    </div>
  );
};

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
      <Card className="w-full rounded-[28px] border-orange-100 bg-white shadow-product">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <span className="text-2xl font-bold leading-[1.02] tracking-tight text-foreground">
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
      <Card className="w-full rounded-[28px] border-orange-100 bg-white shadow-product">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2">Loading scan history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full rounded-[28px] border-orange-100 bg-white shadow-product">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-destructive mb-2">
              Error loading scan history
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHealthScoreBadgeVariant = (score: number | null) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="w-full  mx-auto space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Scans */}
        <Card className="group relative overflow-hidden rounded-[24px] border-orange-100 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 blur-2xl transition-all duration-500 group-hover:scale-150" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Total Scans
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground ">
                  {stats.totalScans}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">
                    ↑ All time
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 transition-transform duration-300 group-hover:rotate-6">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <TotalScansStrip totalScans={stats.totalScans} />
          </CardContent>
        </Card>

        {/* Avg Score */}
        <Card className="group relative overflow-hidden rounded-[24px] border-orange-100 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 blur-2xl transition-all duration-500 group-hover:scale-150" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Avg Score
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {stats.averageHealthScore}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">
                    ↑ Health index
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 transition-transform duration-300 group-hover:rotate-6">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-700"
                  style={{
                    width: `${Math.min((stats.averageHealthScore / 100) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">0</span>
                <span className="text-xs font-semibold text-orange-500">
                  {stats.averageHealthScore}/100
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card className="group relative overflow-hidden rounded-[24px] border-orange-100 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 blur-2xl transition-all duration-500 group-hover:scale-150" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  This Week
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {stats.recentScans}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">
                    ↑ Last 7 days
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 transition-transform duration-300 group-hover:rotate-6">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <WeekCalendarStrip recentScans={stats.recentScans} />
          </CardContent>
        </Card>

      </div>

      {/* Scan History */}
      <Card className="rounded-[28px] border-orange-100 bg-white shadow-product">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Scan History
          </CardTitle>
          {scanHistory.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-orange-200 bg-white shadow-[var(--shadow-soft)]"
                >
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear scan history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your scan history. This
                    action cannot be undone.
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
        </CardHeader>
        <CardContent>
          {tier === "free" && stats.totalScans >= 10 && (
            <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-dashed border-orange-200 bg-orange-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Showing your latest unique scans
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to Pro to unlock your full scan history.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/pricing")}
                className="rounded-full shadow-[var(--shadow-soft)]"
              >
                Upgrade to Pro
              </Button>
            </div>
          )}
          {scanHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <span className="text-lg font-medium mb-2">No scans yet</span>
              <p className="text-muted-foreground">
                Start scanning products to build your history
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] max-h-[460px] pr-2 sm:pr-4">
              <div className="space-y-3">
                {scanHistory.map((item, index) => (
                  <div key={item.id}>
                    <div
                      className="group flex cursor-pointer flex-col gap-3 rounded-[22px] border border-orange-100 bg-white p-3 transition-colors hover:bg-orange-50 sm:flex-row sm:items-center sm:justify-between"
                      onClick={() => router.push(`/product/${item.barcode}`)}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="font-medium text-sm group-hover:text-orange-500 transition-colors">
                            {item.product_name}
                          </span>
                          <Badge
                            variant={getHealthScoreBadgeVariant(
                              item.health_score
                            )}
                            className={`w-fit font-semibold ${item.health_score && item.health_score < 60
                                ? "bg-red-600 text-white"
                                : ""
                              }`}
                          >
                            {item.health_score || "N/A"}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-muted-foreground">
                          <span>Barcode: {item.barcode}</span>
                          <span>
                            {format(
                              new Date(item.scanned_at),
                              "MMM d, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete scan for ${item.product_name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScanHistoryItem(item.id);
                        }}
                        className="flex justify-end p-0 text-muted-foreground hover:text-destructive sm:self-start"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    {index < scanHistory.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanHistory;