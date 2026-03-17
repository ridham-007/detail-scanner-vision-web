"use client";

import React from "react";
import { Link } from "@/lib/react-router-dom-shim";
import { Calculator } from "lucide-react";

interface RelatedCalculatorsProps {
  calculators: Array<{
    path: string;
    title: string;
    iconName?: string;
  }>;
}

const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({
  calculators,
}) => {
  if (calculators.length === 0) return null;

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-product">
      <span className="mb-4 font-semibold text-foreground">
        Related Calculators
      </span>

      <div className="grid grid-cols-2 gap-3">
        {calculators.map((calc, i) => (
          <Link
            key={i}
            to={calc.path}
            className="
              flex flex-col p-4 
              rounded-[22px]
              border border-orange-100/70
              hover:border-orange-200/80
              hover:shadow-[var(--shadow-soft)]
              transition-all group
              bg-orange-50/35
            "
          >
            <div
              className="
                w-10 h-10 
                bg-orange-50
                text-primary
                rounded-2xl
                flex items-center justify-center 
                mb-3 
                group-hover:scale-105 
                transition-transform shadow-[var(--shadow-soft)]
              "
            >
              <Calculator className="h-5 w-5" />
            </div>

            <span
              className="
                text-sm font-semibold 
                text-foreground
                group-hover:text-primary
                transition-colors leading-tight
              "
            >
              {calc.title.replace(" Calculator", "")} <br />
              Calculator
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedCalculators;
