import React from "react";
import { generateCalculatorMetadata } from "@/utils/seo";
import { calculatorConfig } from "@/data/calculatorConfig";
import CalculatorLayoutWrapper from "@/components/calculator/CalculatorLayoutWrapper";
import TdeeCalculator from "@/components/calculators/TDEECalculator";

export const generateMetadata = () => {
  const config = calculatorConfig.tdee;
  return generateCalculatorMetadata({
    title: config.title,
    description: config.description,
    path: config.path,
    metaTitle: config.title,
    metaDescription: config.description,
  });
};

export default function TdeeCalculatorPage() {
  return (
    <CalculatorLayoutWrapper calculatorId="tdee">
      <TdeeCalculator />
    </CalculatorLayoutWrapper>
  );
}
