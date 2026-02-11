"use client";

import React from "react";
import ModernCalculatorLayout from "@/components/Moderncalculatorlayout";
import { calculatorConfig } from "@/data/calculatorConfig";
import HowToUse from "@/components/calculator/HowToUse";

interface CalculatorLayoutWrapperProps {
    calculatorId: string;
    children: React.ReactNode;
}

const CalculatorLayoutWrapper: React.FC<CalculatorLayoutWrapperProps> = ({
    calculatorId,
    children,
}) => {
    const config = calculatorConfig[calculatorId];

    if (!config) {
        return <>{children}</>;
    }

    return (
        <ModernCalculatorLayout
            title={config.title}
            description={config.description}
            icon={config.icon}
            path={config.path}
            details={config.details}
            faq={config.faqs}
            howToUse={<HowToUse {...config.howToUse} />}
        >
            {children}
        </ModernCalculatorLayout>
    );
};

export default CalculatorLayoutWrapper;
