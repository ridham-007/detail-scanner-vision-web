"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Minus,
} from "lucide-react";
import { AdditiveAnalysis } from "@/types/ProductData";

interface AdditiveAnalysisCardProps {
  additives: AdditiveAnalysis[];
}

/* -------------------- Impact Config -------------------- */

const impactStyles = {
  positive: {
    label: "Safe",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    ring: "ring-green-200 dark:ring-green-800",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  },
  negative: {
    label: "Risky",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    ring: "ring-red-200 dark:ring-red-800",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  },
  neutral: {
    label: "Moderate",
    icon: Minus,
    iconColor: "text-yellow-500",
    ring: "ring-yellow-200 dark:ring-yellow-800",
    badgeClass:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
  },
};

const getScoreGradient = (score: number) => {
  if (score >= 60) return "from-green-400 to-green-600";
  if (score >= 30) return "from-yellow-400 to-yellow-600";
  return "from-red-400 to-red-600";
};

/* -------------------- Component -------------------- */

export const AdditiveAnalysisCard = ({
  additives,
}: AdditiveAnalysisCardProps) => {
  if (!additives?.length) return null;

  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-800">
      {/* ---------- Header ---------- */}
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-green-700 dark:text-green-300">
          <div className="rounded-lg bg-green-100 dark:bg-green-900/50 p-2">
            <FlaskConical className="h-5 w-5" />
          </div>
          Additive Analysis
        </CardTitle>
        <p className="ml-11 text-sm text-muted-foreground">
          Detailed ingredient-level safety insights
        </p>
      </CardHeader>

      {/* ---------- Content (2-Column Grid) ---------- */}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {additives.map((additive, index) => {
          const impact =
            impactStyles[additive.impact] ?? impactStyles.neutral;
          const Icon = impact.icon;

          return (
            <div
              key={index}
              className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-green-300 dark:hover:border-green-700"
            >
              {/* ---------- Row 1 ---------- */}
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left */}
                <div className="flex flex-1 items-start gap-3 min-w-0">
                  <div
                    className={`rounded-full p-1.5 bg-background ring-2 ring-offset-2 ${impact.ring}`}
                  >
                    <Icon className={`h-4 w-4 ${impact.iconColor}`} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm sm:text-base font-semibold text-foreground">
                        {additive.name}
                      </span>
                      <code className="rounded-md border border-border bg-muted px-2 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground">
                        {additive.code}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  <Badge
                    variant="outline"
                    className={`${impact.badgeClass} border px-3 py-1 font-medium`}
                  >
                    {impact.label}
                  </Badge>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-xl sm:text-2xl font-bold ${impact.iconColor}`}
                      >
                        {additive.score}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        /100
                      </span>
                    </div>

                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full bg-gradient-to-r ${getScoreGradient(
                          additive.score
                        )}`}
                        style={{ width: `${additive.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------- Row 2 ---------- */}
              <div className="flex items-start gap-3 sm:pl-11">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {additive.short_reason}
                </p>
              </div>

              {/* ---------- Decorative Accent ---------- */}
              <div
                className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${getScoreGradient(
                  additive.score
                )} opacity-0 transition-opacity group-hover:opacity-100`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
