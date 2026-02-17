import React, { Suspense } from "react";
import { generateCalculatorMetadata } from "@/utils/seo";
import { calculatorConfig } from "@/data/calculatorConfig";
import CalculatorLayoutWrapper from "@/components/calculator/CalculatorLayoutWrapper";
import CalorieCalculator from "@/components/calculators/CalorieCalculator";

export const generateMetadata = () => {
    const config = calculatorConfig.calorie;
    return generateCalculatorMetadata({
        title: config.title,
        description: config.description,
        path: config.path,
        metaTitle: config.title, // Add these if you added them to CalculatorConfig type
        metaDescription: config.description,
    });
};

export default function CalorieCalculatorPage() {
    return (
        <Suspense>
        <CalculatorLayoutWrapper calculatorId="calorie">
            <CalorieCalculator />
        </CalculatorLayoutWrapper>
        </Suspense>
    );
}
