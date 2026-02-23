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
    <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 p-5">
      <span className="font-semibold mb-4 text-gray-900 dark:text-white">
        Related Calculators
      </span>

      <div className="grid grid-cols-2 gap-3">
        {calculators.map((calc, i) => (
          <Link
            key={i}
            to={calc.path}
            className="
              flex flex-col p-4 
              rounded-xl 
              border border-gray-100 dark:border-gray-700
              hover:border-gray-200 dark:hover:border-gray-600
              hover:shadow-sm 
              transition-all group 
              bg-white dark:bg-gray-800
            "
          >
            <div
              className="
                w-10 h-10 
                bg-green-50 dark:bg-gray-700
                text-[#84B44C] 
                rounded-xl 
                flex items-center justify-center 
                mb-3 
                group-hover:scale-105 
                transition-transform
              "
            >
              <Calculator className="h-5 w-5" />
            </div>

            <span
              className="
                text-sm font-semibold 
                text-gray-900 dark:text-gray-100
                group-hover:text-[#84B44C] 
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
