import React, { Suspense } from "react";
import { generateCalculatorMetadata } from "@/utils/seo";
import { calculatorConfig } from "@/data/calculatorConfig";
import CalculatorLayoutWrapper from "@/components/calculator/CalculatorLayoutWrapper";
import ProteinCalculator from "@/components/calculators/ProteinCalculator";

export const generateMetadata = () => {
    const config = calculatorConfig.protein;
    return generateCalculatorMetadata({
        title: config.title,
        description: config.description,
        path: config.path,
        metaTitle: config.title, // Add these if you added them to CalculatorConfig type
        metaDescription: config.description,
    });
};

export default function ProteinCalculatorPage() {
    return (
        <Suspense>
        <CalculatorLayoutWrapper calculatorId="protein">
            <ProteinCalculator />
        </CalculatorLayoutWrapper>
        </Suspense>
    );
}
