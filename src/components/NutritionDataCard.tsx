"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import { NutritionDataItem } from "@/types/ProductData";
import { useState } from "react";

interface NutritionDataCardProps {
  nutritionData: NutritionDataItem[];
}

/* ---------------- Helpers ---------------- */

const getNutrientIcon = (nutrient: string) => {
  const icons: Record<string, string> = {
    protein: "🐟",
    carbohydrates: "🍞",
    energy: "⚡",
    salt: "🧂",
    calories: "🔥",
    sugar: "📦",
    sodium: "🧂",
    fat: "💧",
    fiber: "🌿",
    alcohol: "🍷",
  };

  const key = nutrient.toLowerCase();
  for (const k in icons) {
    if (key.includes(k)) return icons[k];
  }
  return "📊";
};

const impactColor = (impact: string) =>
  impact === "positive"
    ? "#22c55e"
    : impact === "negative"
    ? "#ef4444"
    : "#fb923c";

type Impact = "positive" | "negative" | "neutral";

type NutrientReference = {
  low: number;
  moderate: number;
  high: number;
  beneficial: boolean;
  unit: string;
  displayMax: number;
};

const NUTRIENT_REFERENCE: Record<string, NutrientReference> = {
  energy: { low: 100, moderate: 250, high: 400, beneficial: false, unit: "kcal", displayMax: 400 },
  "energy-kcal": { low: 100, moderate: 250, high: 400, beneficial: false, unit: "kcal", displayMax: 400 },
  carbohydrate: { low: 25, moderate: 50, high: 75, beneficial: false, unit: "g", displayMax: 100 },
  carbohydrates: { low: 25, moderate: 50, high: 75, beneficial: false, unit: "g", displayMax: 100 },
  carbs: { low: 25, moderate: 50, high: 75, beneficial: false, unit: "g", displayMax: 100 },
  carb: { low: 25, moderate: 50, high: 75, beneficial: false, unit: "g", displayMax: 100 },
  fat: { low: 3, moderate: 17.5, high: 17.5, beneficial: false, unit: "g", displayMax: 20 },
  "saturated-fat": { low: 1.5, moderate: 5, high: 5, beneficial: false, unit: "g", displayMax: 10 },
  sugar: { low: 5, moderate: 12.5, high: 22.5, beneficial: false, unit: "g", displayMax: 25 },
  sugars: { low: 5, moderate: 12.5, high: 22.5, beneficial: false, unit: "g", displayMax: 25 },
  sodium: { low: 0.12, moderate: 0.36, high: 0.6, beneficial: false, unit: "g", displayMax: 0.75 },
  salt: { low: 0.3, moderate: 0.9, high: 1.5, beneficial: false, unit: "g", displayMax: 1.9 },
  fiber: { low: 1.5, moderate: 3, high: 6, beneficial: true, unit: "g", displayMax: 20 },
  fibre: { low: 1.5, moderate: 3, high: 6, beneficial: true, unit: "g", displayMax: 20 },
  protein: { low: 4, moderate: 8, high: 16, beneficial: true, unit: "g", displayMax: 20 },
  proteins: { low: 4, moderate: 8, high: 16, beneficial: true, unit: "g", displayMax: 20 },
};

const normalizeKey = (item: NutritionDataItem) =>
  (item.key || item.nutrient)
    .toLowerCase()
    .replace(/\s+/g, "-");

const parseNumericValue = (value: string) => {
  const match = value.replace(/,/g, ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Segment = { cls: string; width: number };

const getReference = (item: NutritionDataItem) =>
  NUTRIENT_REFERENCE[normalizeKey(item)];

const getValueNumber = (item: NutritionDataItem) => {
  const numericValue = parseNumericValue(item.value);
  return numericValue !== null && !Number.isNaN(numericValue) ? numericValue : null;
};

const getMarkerPosition = (item: NutritionDataItem, reference?: NutrientReference) => {
  const numericValue = getValueNumber(item);
  const score = Number.isFinite(item.score) ? item.score : null;

  if (reference && numericValue !== null) {
    return clamp((numericValue / reference.displayMax) * 100, 0, 100);
  }

  if (score !== null) return clamp(score, 0, 100);
  return 50;
};

const resolveImpact = (item: NutritionDataItem): Impact => {
  const reference = getReference(item);
  const numericValue = parseNumericValue(item.value);

  if (!reference || numericValue === null || Number.isNaN(numericValue)) {
    return item.impact;
  }

  if (reference.beneficial) {
    if (numericValue >= reference.moderate) return "positive";
    if (numericValue >= reference.low) return "neutral";
    return "negative";
  }

  if (numericValue <= reference.low) return "positive";
  if (numericValue < reference.high) return "neutral";
  return "negative";
};

const getBarSegments = (reference?: NutrientReference): Segment[] => {
  if (!reference) {
    return [
      { cls: "bg-green-500", width: 0.25 },
      { cls: "bg-lime-500", width: 0.25 },
      { cls: "bg-amber-400", width: 0.25 },
      { cls: "bg-red-500", width: 0.25 },
    ];
  }

  const first = reference.low / reference.displayMax;
  const second = Math.max(0, (reference.moderate - reference.low) / reference.displayMax);
  const third = Math.max(0, (reference.high - reference.moderate) / reference.displayMax);
  const fourth = Math.max(0, 1 - reference.high / reference.displayMax);

  return reference.beneficial
    ? [
        { cls: "bg-red-500", width: first },
        { cls: "bg-amber-400", width: second },
        { cls: "bg-lime-500", width: third },
        { cls: "bg-green-700", width: fourth },
      ]
    : [
        { cls: "bg-green-700", width: first },
        { cls: "bg-lime-500", width: second },
        { cls: "bg-amber-400", width: third },
        { cls: "bg-red-500", width: fourth },
      ];
};

const formatThresholdLabel = (value: number, unit: string) =>
  unit === "g" && Number.isInteger(value)
    ? `${value}${unit}`
    : unit === "g"
    ? `${Number(value.toFixed(value < 1 ? 2 : 1))}${unit}`
    : `${Math.round(value)}${unit}`;

const getScaleLabels = (reference?: NutrientReference) => {
  if (!reference) return ["0", "25", "50", "75", "100"];

  const nutrient = reference.unit === "g" && reference.displayMax === 100 ? "carb" : "";
  if (nutrient === "carb") {
    return ["0", "25", "50", "75"];
  }

  const { low, moderate, high, unit } = reference;
  return [
    "0",
    formatThresholdLabel(low, unit),
    formatThresholdLabel(moderate, unit),
    formatThresholdLabel(high, unit),
  ];
};

const getSummaryText = (item: NutritionDataItem, reference?: NutrientReference) => {
  const nutrient = item.nutrient.toLowerCase();
  const resolvedImpact = resolveImpact(item);

  if (reference?.beneficial) {
    if (resolvedImpact === "positive") return `Good source of ${nutrient}.`;
    if (resolvedImpact === "neutral") return `Moderate ${nutrient} content.`;
    return `Low ${nutrient} content.`;
  }

  if (resolvedImpact === "negative") return `High ${nutrient} content.`;
  if (resolvedImpact === "neutral") return `Moderate ${nutrient} content.`;
  return `Low ${nutrient} content.`;
};

/* ---------------- Component ---------------- */

export const NutritionDataCard = ({
  nutritionData,
}: NutritionDataCardProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (!nutritionData?.length) return null;

  const left = nutritionData.filter((_, i) => i % 2 === 0);
  const right = nutritionData.filter((_, i) => i % 2 === 1);

  return (
    <Card>
      <CardContent className="p-6">
        {/* MOBILE = ONE COLUMN */}
        <div className="flex flex-col gap-6 sm:hidden">
          {nutritionData.map((item) => (
            <ItemCard
              key={item.nutrient}
              item={item}
              expanded={expanded}
              toggle={toggle}
            />
          ))}
        </div>

        {/* DESKTOP = TWO FLEX COLUMNS */}
        <div className="hidden sm:flex gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 flex-1">
            {left.map((item) => (
              <ItemCard
                key={item.nutrient}
                item={item}
                expanded={expanded}
                toggle={toggle}
              />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6 flex-1">
            {right.map((item) => (
              <ItemCard
                key={item.nutrient}
                item={item}
                expanded={expanded}
                toggle={toggle}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------------- Item Card ---------------- */

const ItemCard = ({
  item,
  expanded,
  toggle,
}: {
  item: NutritionDataItem;
  expanded: Set<string>;
  toggle: (k: string) => void;
}) => {
  const isOpen = expanded.has(item.nutrient);
  const reference = getReference(item);
  const resolvedImpact = resolveImpact(item);
  const marker = getMarkerPosition(item, reference);
  const barSegments = getBarSegments(reference);
  const scaleLabels = getScaleLabels(reference);
  const markerColor = impactColor(resolvedImpact);

  return (
    <div className="border border-gray-100 rounded-xl bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span className="text-2xl">{getNutrientIcon(item.nutrient)}</span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {item.nutrient}
            </h3>
            <p className="text-sm text-gray-400 capitalize">
              {resolvedImpact} impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">{item.value}</span>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: markerColor }}
          />
          <button
            onClick={() => toggle(item.nutrient)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4">
          <div className="relative">
            <div
              className="absolute -top-2"
              style={{ left: `${marker}%`, transform: "translateX(-50%)" }}
            >
              <div
                className="mx-auto h-0 w-0"
                style={{ backgroundColor: markerColor }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: `8px solid ${markerColor}`,
                }}
              />
            </div>

            <div className="h-2.5 rounded-full overflow-hidden flex">
              {barSegments.map((segment, index) => (
                <div
                  key={index}
                  className={segment.cls}
                  style={{ width: `${segment.width * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mb-3">
            {scaleLabels.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>

          <p className="text-sm text-gray-600">{item.short_reason}</p>
        </div>
      )}
    </div>
  );
};
