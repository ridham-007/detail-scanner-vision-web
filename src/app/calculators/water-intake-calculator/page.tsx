import React, { Suspense } from "react";
import { generateCalculatorMetadata } from "@/utils/seo";
import { calculatorConfig } from "@/data/calculatorConfig";
import CalculatorLayoutWrapper from "@/components/calculator/CalculatorLayoutWrapper";
import WaterIntakeCalculator from "@/components/calculators/WaterIntakeCalculator";

export const generateMetadata = () => {
    const config = calculatorConfig.waterintake;
    return generateCalculatorMetadata({
        title: config.title,
        description: config.description,
        path: config.path,
        metaTitle: config.title,
        metaDescription: config.description,
    });
};

export default function WaterIntakeCalculatorPage() {
    return (
        <Suspense>
        <CalculatorLayoutWrapper calculatorId="waterintake">
            <WaterIntakeCalculator />
        </CalculatorLayoutWrapper>
        </Suspense>
    );
}
