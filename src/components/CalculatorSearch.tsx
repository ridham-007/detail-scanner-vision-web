"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { calculatorData } from "@/data/calculatorData";
import { Link } from "@/lib/react-router-dom-shim";

const CalculatorSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase();
        const allCalcs = Object.values(calculatorData).flat();

        return allCalcs
            .map((calc) => {
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
    }, [searchTerm]);

    return (
        <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center gap-2 mb-3">
                <Search className="h-5 w-5 text-[#84B44C]" />
                <h3 className="font-semibold">Search</h3>
            </div>

            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-xl p-3 mb-3"
                placeholder="Search calculators..."
            />

            {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((calc, index) => (
                        <Link
                            key={index}
                            to={calc.path}
                            className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="font-medium text-sm text-[#84B44C]">
                                {calc.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
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
