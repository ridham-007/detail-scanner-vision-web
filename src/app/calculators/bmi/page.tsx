import React from "react";
import { generateCalculatorMetadata } from "@/utils/seo";
import { calculatorConfig } from "@/data/calculatorConfig";
import CalculatorLayoutWrapper from "@/components/calculator/CalculatorLayoutWrapper";
import BMICalculator from "@/components/calculators/BMICalculator";

export const generateMetadata = () => {
    const config = calculatorConfig.bmi;
    return generateCalculatorMetadata({
        title: config.title,
        description: config.description,
        path: config.path,
        metaTitle: config.title, // Add these if you added them to CalculatorConfig type
        metaDescription: config.description,
    });
};

export default function BMICalculatorPage() {
    return (
        <CalculatorLayoutWrapper calculatorId="bmi">
            <BMICalculator />
        </CalculatorLayoutWrapper>
    );
}
