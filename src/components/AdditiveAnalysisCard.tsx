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
    ring: "ring-green-200",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200",
  },
  negative: {
    label: "Risky",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    ring: "ring-red-200",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200",
  },
  neutral: {
    label: "Moderate",
    icon: Minus,
    iconColor: "text-yellow-500",
    ring: "ring-yellow-200",
    badgeClass:
      "bg-yellow-50 text-yellow-700 border-yellow-200",
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
    <Card className="overflow-hidden border border-border/60 shadow-sm">
      {/* ---------- Header ---------- */}
      <CardHeader className="bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
          <div className="rounded-lg border border-border/70 bg-background p-2">
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
              className="group relative h-full overflow-hidden rounded-xl border border-border/70 bg-background p-4 transition-colors hover:bg-muted/20 sm:p-5"
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
                      <code className="rounded-md border border-border bg-muted px-2 py-1 text-xs sm:text-xs font-mono text-muted-foreground">
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

            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
