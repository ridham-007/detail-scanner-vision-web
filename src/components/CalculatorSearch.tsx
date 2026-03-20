"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { calculatorData } from "@/data/calculatorData";
import { Link, useLocation } from "@/lib/react-router-dom-shim";

const CalculatorSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 👉 Get current opened path
  const location = useLocation();
  const currentPath = location.pathname;

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const allCalcs = Object.values(calculatorData).flat();

    return allCalcs
      .map((calc) => {
        // 🚫 Skip current opened calculator
        if (calc.path === currentPath) return null;

        const title = calc.title.toLowerCase();
        const description = calc.description.toLowerCase();

        let score = 0;

        if (title === term) score = 100;
        else if (title.startsWith(term)) score = 80;
        else if (title.includes(term)) score = 40;
        else if (description.includes(term)) score = 20;

        return score > 0 ? { ...calc, score } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.score - a.score);
  }, [searchTerm, currentPath]);

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/88 p-4 shadow-product">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Search</span>
      </div>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full 
          border border-orange-100/80
          rounded-2xl
          p-3 mb-3
          bg-white
          text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/30
        "
        placeholder="Search calculators..."
      />

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map((calc, index) => (
            <Link
              key={index}
              to={calc.path}
              className="
                block p-2 
                hover:bg-orange-50/70
                rounded-[18px] transition-colors
              "
            >
              <div className="font-medium text-sm text-primary">
                {calc.title}
              </div>

              <div className="text-xs text-muted-foreground truncate">
                {calc.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculatorSearch;
