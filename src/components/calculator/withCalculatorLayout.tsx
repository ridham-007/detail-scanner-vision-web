"use client";
import React from "react";
import ModernCalculatorLayout from "@/components/Moderncalculatorlayout";
import { calculatorConfig } from "@/data/calculatorConfig";
import HowToUse from "@/components/calculator/HowToUse";

/**
 * Higher-Order Component to wrap calculator components with the ModernCalculatorLayout.
 * 
 * @param Component The calculator component to wrap.
 * @param calculatorKey The key corresponding to the calculator in calculatorConfig.
 */
export const withCalculatorLayout = <P extends object>(
    Component: React.ComponentType<P>,
    calculatorKey: string
) => {
    const WrappedComponent = (props: P) => {
        const config = calculatorConfig[calculatorKey];

        if (!config) {
            console.warn(`Calculator config not found for key: ${calculatorKey}`);
            return <Component {...props} />;
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
                <Component {...props} />
            </ModernCalculatorLayout>
        );
    };

    WrappedComponent.displayName = `WithCalculatorLayout(${getDisplayName(Component)})`;
    return WrappedComponent;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent: React.ComponentType<any>) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
