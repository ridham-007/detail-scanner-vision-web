"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { AllergenAnalysis } from "@/types/ProductData";

interface AllergenAnalysisCardProps {
  allergens: AllergenAnalysis[];
}

/* -------------------- Helpers -------------------- */

const getSeverityMeta = (score: number) => {
  if (score >= 70)
    return {
      label: "High Risk",
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      badge: "bg-red-100 text-red-700",
      bar: "bg-red-500",
    };

  if (score >= 40)
    return {
      label: "Moderate Risk",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      badge:
        "bg-yellow-100 text-yellow-700",
      bar: "bg-yellow-500",
    };

  return {
    label: "Low Risk",
    icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
    badge:
      "bg-green-100 text-green-700",
    bar: "bg-green-500",
  };
};

/* -------------------- Component -------------------- */

export const AllergenAnalysisCard = ({
  allergens,
}: AllergenAnalysisCardProps) => {
  if (!allergens?.length) return null;

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Allergen Safety Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Understand how this product may affect people with allergies
        </p>
      </CardHeader>

      <CardContent className="flex flex-wrap -mx-2">
        {allergens.map((item, index) => {
          const meta = getSeverityMeta(item.severity_score);

          return (
            <div key={index} className="w-full md:w-1/2 px-2 mb-4">
              <div className="h-full rounded-2xl border border-border/70 bg-background p-5 transition-colors hover:bg-muted/20">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {meta.icon}
                    <h4 className="text-base font-semibold">{item.allergen}</h4>
                  </div>

                  <Badge className={meta.badge}>{meta.label}</Badge>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.short_reason}
                </p>

                {/* Severity Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Severity</span>
                    <span>{item.severity_score}/100</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.bar}`}
                      style={{ width: `${item.severity_score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
