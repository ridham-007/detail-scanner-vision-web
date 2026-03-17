"use client";

import React from "react";
import { Swords, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FoodBattleBanner() {
  return (
    <Link href="/compare">
      <div
        className="
        group flex max-w-full cursor-pointer flex-col gap-4 rounded-[28px] border border-orange-200/80
        bg-[linear-gradient(180deg,rgba(255,237,213,0.78),rgba(255,250,244,0.98))]
        p-5 shadow-product transition-all duration-300 hover:shadow-[var(--shadow-warm)]
      "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 shadow-[var(--shadow-warm)]">
            <Swords className="h-6 w-6 text-white" />
          </div>

          <span className="text-lg font-bold text-foreground">
            Food Battle
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          Compare any two foods side-by-side and instantly discover which
          one wins in calories, protein, carbs and fat.
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            Start Battle
          </span>

          <ArrowRight
            className="
            text-primary
            group-hover:translate-x-1
            transition-transform
          "
          />
        </div>
      </div>
    </Link>
  );
}
