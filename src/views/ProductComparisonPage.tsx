"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, X, ArrowRightLeft } from 'lucide-react';
import { ProductData } from '@/types/ProductData';
import { useProductLookup } from '@/hooks/useProductLookup';
import { toast } from 'sonner';
import ProductSelectionModal from '@/components/ProductSelectionModal';

const ProductComparisonPage = () => {
    const [productA, setProductA] = useState<ProductData | null>(null);
    const [productB, setProductB] = useState<ProductData | null>(null);
    const [activeSlot, setActiveSlot] = useState<'A' | 'B' | null>(null);

    const { lookupProduct } = useProductLookup();

    // Debug: Log products when they change
    React.useEffect(() => {
        if (productA) console.log("Product A Data:", productA);
        if (productB) console.log("Product B Data:", productB);
    }, [productA, productB]);

    const handleSelectProduct = (product: ProductData) => {
        if (activeSlot === 'A') setProductA(product);
        else setProductB(product);
        setActiveSlot(null);
    };

    const clearSlot = (slot: 'A' | 'B') => {
        if (slot === 'A') setProductA(null);
        else setProductB(null);
    };

    // Helper to extract numeric value from string (e.g. "15 g" -> 15)
    const parseValue = (val: string | number | null | undefined): number | null => {
        if (typeof val === 'number') return val;
        if (!val) return null;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    }

    // Robust getter for nutrition values
    const getNutrientValue = (product: ProductData, key: string, fallbackKeys: string[] = []): number | null => {
        // 1. Try nutrition_per_100g
        const p100g = product.nutrition_per_100g as any;
        if (p100g?.[key] !== undefined && p100g?.[key] !== null) {
            return p100g[key];
        }

        // 2. Try simple aliases in nutrition_per_100g
        for (const k of fallbackKeys) {
            if (p100g?.[k] !== undefined && p100g?.[k] !== null) return p100g[k];
        }

        // 3. Try finding in nutrition_data array
        if (Array.isArray(product.nutrition_data)) {
            const item = product.nutrition_data.find(n => n.key === key || fallbackKeys.includes(n.key));
            if (item?.value) {
                return parseValue(item.value);
            }
        }

        return null;
    }

    // Configuration for all fields we want to compare
    const comparisonFields = [
        { label: "Energy (Calories)", key: "calories_kcal", fallbacks: ["energy", "energy_kcal", "calories", "energy-kcal", "kcal"], unit: "kcal", lowerIsBetter: true },
        { label: "Energy (kJ)", key: "energy_kj", fallbacks: ["energy_kj", "energy-kj", "kj"], unit: "kJ", lowerIsBetter: true },
        { label: "Carbohydrates", key: "carbohydrates_g", fallbacks: ["carbohydrates", "carbohydrate", "carbs", "total_carbohydrates", "total-carbohydrate"], unit: "g", lowerIsBetter: false }, // Moderation usually
        { label: "Sugars", key: "sugar_g", fallbacks: ["sugars", "sugar", "total_sugars", "total-sugars"], unit: "g", lowerIsBetter: true },
        { label: "Total Fat", key: "total_fat_g", fallbacks: ["fat", "total_fat", "total-fat", "fat_g"], unit: "g", lowerIsBetter: true },
        { label: "Saturated Fat", key: "saturated_fat_g", fallbacks: ["saturated-fat", "saturated_fat", "saturated", "saturates"], unit: "g", lowerIsBetter: true },
        { label: "Trans Fat", key: "trans_fat_g", fallbacks: ["trans-fat", "trans_fat", "trans"], unit: "g", lowerIsBetter: true },
        { label: "Proteins", key: "protein_g", fallbacks: ["proteins", "protein", "protein_g"], unit: "g", lowerIsBetter: false },
        { label: "Fiber", key: "fiber_g", fallbacks: ["fiber", "fibre", "dietary_fiber", "dietary-fiber"], unit: "g", lowerIsBetter: false },
        { label: "Salt", key: "salt_mg", fallbacks: ["salt", "salt_g"], unit: "mg", lowerIsBetter: true },
        { label: "Sodium", key: "sodium_mg", fallbacks: ["sodium", "sodium_g"], unit: "mg", lowerIsBetter: true },
        { label: "Cholesterol", key: "cholesterol_mg", fallbacks: ["cholesterol", "cholesterol_g"], unit: "mg", lowerIsBetter: true },
        { label: "Calcium", key: "calcium_mg", fallbacks: ["calcium", "calcium_g"], unit: "mg", lowerIsBetter: false },
        { label: "Iron", key: "iron_mg", fallbacks: ["iron", "iron_g"], unit: "mg", lowerIsBetter: false },
    ];

    const calculateWinner = () => {
        if (!productA || !productB) return null;
        let scoreA = 0;
        let scoreB = 0;

        // Iterate over our consolidated config
        comparisonFields.forEach(field => {
            const valA = getNutrientValue(productA, field.key, field.fallbacks);
            const valB = getNutrientValue(productB, field.key, field.fallbacks);

            if (valA === null || valB === null) return;
            // If units are vastly different (e.g. mg vs g) we assume our parser handles it or data is consistent.
            // For now assume generic number comparison is valid for "Winner" logic if data exists.
            if (valA === valB) return;

            if (field.lowerIsBetter) {
                if (valA < valB) scoreA++; else scoreB++;
            } else {
                if (valA > valB) scoreA++; else scoreB++;
            }
        });

        // Additives (fewer is better)
        const additivesA = productA.nutrition_per_100g?.additives?.length || 0;
        const additivesB = productB.nutrition_per_100g?.additives?.length || 0;
        if (additivesA < additivesB) scoreA++;
        else if (additivesB < additivesA) scoreB++;

        // Health Score (Higher is better)
        if (productA.health_score > productB.health_score) scoreA++;
        else if (productB.health_score > productA.health_score) scoreB++;

        if (scoreA > scoreB) return 'A';
        if (scoreB > scoreA) return 'B';
        return 'Tie';
    };

    const winner = calculateWinner();

    const EmptySlot = ({ slot }: { slot: 'A' | 'B' }) => (
        <Card className="h-full border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setActiveSlot(slot)}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Product {slot}</h3>
            <p className="text-muted-foreground text-sm">Tap to search or scan</p>
        </Card>
    );

    const ComparisonRow = ({ field }: { field: typeof comparisonFields[0] }) => {
        let valA = getNutrientValue(productA!, field.key, field.fallbacks);
        let valB = getNutrientValue(productB!, field.key, field.fallbacks);

        // FEATURE: Hide row if BOTH are missing
        if (valA === null && valB === null) return null;

        const isAWinner = valA !== null && valB !== null && valA !== valB && (field.lowerIsBetter ? valA < valB : valA > valB);
        const isBWinner = valA !== null && valB !== null && valA !== valB && (field.lowerIsBetter ? valB < valA : valB > valA);

        const displayA = valA !== null ? valA : '-';
        const displayB = valB !== null ? valB : '-';

        return (
            <div className="grid grid-cols-3 py-3 border-b last:border-0 pl-1">
                <div className={`text-center font-medium ${isAWinner ? 'text-green-600 bg-green-50 rounded' : ''}`}>
                    {displayA} <span className="text-xs text-muted-foreground">{valA !== null ? field.unit : ''}</span>
                </div>
                <div className="text-center text-sm font-semibold text-muted-foreground flex items-center justify-center gap-1">
                    {field.label}
                </div>
                <div className={`text-center font-medium ${isBWinner ? 'text-green-600 bg-green-50 rounded' : ''}`}>
                    {displayB} <span className="text-xs text-muted-foreground">{valB !== null ? field.unit : ''}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
                    <ArrowRightLeft className="w-8 h-8 text-primary" />
                    Food Battle
                </h1>
                <p className="text-muted-foreground">Compare two products and find the healthier choice</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                {/* Product A Slot */}
                <div className="relative">
                    {productA ? (
                        <Card className={`h-full border-2 ${winner === 'A' ? 'border-primary shadow-lg bg-primary/5' : ''}`}>
                            <div className="absolute top-2 right-2 z-10">
                                <Button variant="ghost" size="icon" onClick={() => clearSlot('A')} className="h-6 w-6 rounded-full bg-background/50">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            {winner === 'A' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                                    <Trophy className="w-4 h-4" /> Winner
                                </div>
                            )}
                            <CardHeader className="text-center pb-2">
                                {productA.images?.[0] && (
                                    <img src={productA.images[0]} alt={productA.name} className="w-24 h-24 object-contain mx-auto mb-2" />
                                )}
                                <CardTitle className="text-lg leading-tight">{productA.name}</CardTitle>
                                {/* <p className="text-xs text-muted-foreground">{productA.brands}</p> */}
                            </CardHeader>
                        </Card>
                    ) : (
                        <EmptySlot slot="A" />
                    )}
                </div>

                {/* Product B Slot */}
                <div className="relative">
                    {productB ? (
                        <Card className={`h-full border-2 ${winner === 'B' ? 'border-primary shadow-lg bg-primary/5' : ''}`}>
                            <div className="absolute top-2 right-2 z-10">
                                <Button variant="ghost" size="icon" onClick={() => clearSlot('B')} className="h-6 w-6 rounded-full bg-background/50">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            {winner === 'B' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                                    <Trophy className="w-4 h-4" /> Winner
                                </div>
                            )}
                            <CardHeader className="text-center pb-2">
                                {productB.images?.[0] && (
                                    <img src={productB.images[0]} alt={productB.name} className="w-24 h-24 object-contain mx-auto mb-2" />
                                )}
                                <CardTitle className="text-lg leading-tight">{productB.name}</CardTitle>
                                {/* <p className="text-xs text-muted-foreground">{productB.brands}</p> */}
                            </CardHeader>
                        </Card>
                    ) : (
                        <EmptySlot slot="B" />
                    )}
                </div>
            </div>

            {/* Comparison Table */}
            {productA && productB && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardContent className="p-6">
                        {comparisonFields.map(field => (
                            <ComparisonRow key={field.key} field={field} />
                        ))}

                        <div className="grid grid-cols-3 py-3 border-t mt-2 pt-4 bg-muted/10 rounded-b-lg">
                            <div className="text-center font-bold text-lg">
                                {productA.nutrition_per_100g?.additives?.length || 0}
                            </div>
                            <div className="text-center text-sm font-semibold text-muted-foreground flex items-center justify-center">
                                Additives
                            </div>
                            <div className="text-center font-bold text-lg">
                                {productB.nutrition_per_100g?.additives?.length || 0}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 py-3 border-t mt-2">
                            <div className="text-center font-bold text-lg text-primary">
                                {productA.health_score}
                            </div>
                            <div className="text-center text-sm font-semibold text-muted-foreground flex items-center justify-center">
                                Health Score
                            </div>
                            <div className="text-center font-bold text-lg text-primary">
                                {productB.health_score}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <ProductSelectionModal
                isOpen={!!activeSlot}
                slot={activeSlot}
                onClose={() => setActiveSlot(null)}
                onSelect={handleSelectProduct}
            />
        </div>
    );
};

export default ProductComparisonPage;
