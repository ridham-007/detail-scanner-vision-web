"use client";

import React from "react";
import { Swords, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FoodBattleBanner() {
  return (
    <Link href="/compare">
      <div
        className="
        group cursor-pointer
        rounded-2xl border
        bg-gradient-to-br
        from-[#84B44C]/20 via-white to-[#84B44C]/20
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        hover:shadow-xl transition-all duration-300
        p-5
        flex flex-col
        gap-4
        max-w-full
      "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#84B44C] rounded-xl">
            <Swords className="h-6 w-6 text-white" />
          </div>

          <span className="text-lg font-bold dark:text-white">
            Food Battle
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Compare any two foods side-by-side and instantly discover which
          one wins in calories, protein, carbs and fat.
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <span className="text-[#84B44C] font-medium text-sm">
            Start Battle
          </span>

          <ArrowRight
            className="
            text-[#84B44C]
            group-hover:translate-x-1
            transition-transform
          "
          />
        </div>
      </div>
    </Link>
  );
}
