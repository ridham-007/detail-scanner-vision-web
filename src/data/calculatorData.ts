import { calculatorConfig, CalculatorConfig } from "./calculatorConfig";

// Helper to group calculators by category
const groupByCategory = () => {
    const grouped: Record<string, CalculatorConfig[]> = {};

    Object.values(calculatorConfig).forEach((calc) => {
        if (!grouped[calc.category]) {
            grouped[calc.category] = [];
        }
        grouped[calc.category].push(calc);
    });

    return grouped;
};

export const calculatorData = groupByCategory();
