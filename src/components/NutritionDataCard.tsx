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
  const marker = (item.score / 100) * 100;

  return (
    <div className="border border-gray-100 dark:border-gray-500 rounded-xl bg-white dark:bg-black p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span className="text-2xl">{getNutrientIcon(item.nutrient)}</span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {item.nutrient}
            </h3>
            <p className="text-sm text-gray-400 capitalize">
              {item.impact} impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">{item.value}</span>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: impactColor(item.impact) }}
          />
          <button
            onClick={() => toggle(item.nutrient)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {isOpen && (
        <div className="mt-4">
          <div className="relative mb-2">
            <div
              className="absolute -top-2"
              style={{ left: `${marker}%`, transform: "translateX(-50%)" }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: `8px solid ${impactColor(item.impact)}`,
                }}
              />
            </div>

            <div className="h-2.5 rounded-full overflow-hidden flex">
              <div className="w-1/4 bg-green-500" />
              <div className="w-1/4 bg-green-500" />
              <div className="w-1/4 bg-orange-400" />
              <div className="w-1/4 bg-red-500" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mb-3">
            {["0", "25", "50", "75", "100"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">{item.short_reason}</p>
        </div>
      )}
    </div>
  );
};
