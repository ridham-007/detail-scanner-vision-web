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
      <Card className="w-full max-w-4xl mx-auto">
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading scan history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="hidden sm:flex h-6 w-6 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Total Scans</p>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="hidden sm:flex h-6 w-6  text-green-500" />
              <div>
                <p className="text-sm font-medium">Avg Score</p>
                <p className="text-2xl font-bold">{stats.averageHealthScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Calendar className="hidden sm:flex h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{stats.recentScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Scan History
          </CardTitle>
          {scanHistory.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
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
          {tier === "free" && scanHistory.length >= 10 && (
            <div className="mb-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  Showing your last 10 scans
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to Pro to unlock your full scan history.
                </p>
              </div>
              <Button size="sm" onClick={() => router.push("/pricing")}>
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
            <ScrollArea className="h-[460px] pr-4">
              <div className="space-y-3">
                {scanHistory.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex sm:items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="font-medium text-sm">
                            {item.product_name}
                          </span>
                          <Badge
                            variant={getHealthScoreBadgeVariant(
                              item.health_score,
                            )}
                            className={`
    w-fit font-semibold
    ${
      item.health_score && item.health_score < 60 ? "bg-red-600 text-white" : ""
    }
  `}
                          >
                            {item.health_score || "N/A"}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-muted-foreground">
                          <span>Barcode: {item.barcode}</span>
                          <span>
                            {format(
                              new Date(item.scanned_at),
                              "MMM d, yyyy HH:mm",
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete scan for ${item.product_name}`}
                        onClick={() => deleteScanHistoryItem(item.id)}
                        className="p-0 text-muted-foreground hover:text-destructive flex justify-end"
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
