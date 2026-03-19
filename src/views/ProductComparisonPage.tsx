"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trophy, X, ArrowRightLeft, Zap } from 'lucide-react';
import { ProductData } from '@/types/ProductData';
import { useProductLookup } from '@/hooks/useProductLookup';
import BarcodeScanner from '@/components/BarcodeScanner';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ProductSelectionModal from '@/components/ProductSelectionModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useFoodBattleLimit } from '@/hooks/useFoodBattleLimit';
import Breadcrumbs from '@/components/Breadcrumbs';

const ProductComparisonPage = () => {
    const [productA, setProductA] = useState<ProductData | null>(null);
    const [productB, setProductB] = useState<ProductData | null>(null);
    const [activeSlot, setActiveSlot] = useState<'A' | 'B' | null>(null);
    const [manualBarcode, setManualBarcode] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const { lookupProduct, isLoading } = useProductLookup();
    const { tier } = useSubscription();
    const router = useRouter();
    const {
        canBattle,
        battlesLeft,
        maxBattles,
        recordBattle,
    } = useFoodBattleLimit();

    const isPro = tier !== 'free';

    // Debug: Log products when they change
    React.useEffect(() => {
        if (productA) console.log("Product A Data:", productA);
        if (productB) console.log("Product B Data:", productB);
    }, [productA, productB]);

    const handleOpenSlot = (slot: 'A' | 'B') => {
        if (isPro || canBattle) {
            setActiveSlot(slot);
            return;
        }

        // No more free battles: go to paywall
        router.push('/pricing');
    };

    const handleLookup = async (barcode: string) => {
        if (!activeSlot) return;

        if (!isPro && !canBattle) {
            toast.error("You've used all Food Battles for today. Upgrade to Pro for unlimited battles.");
            return;
        }

        setIsScanning(false);
        const otherProduct = activeSlot === 'A' ? productB : productA;
        const currentHadProduct = activeSlot === 'A' ? !!productA : !!productB;

        const product = await lookupProduct(barcode);

        if (product) {
            if (activeSlot === 'A') setProductA(product);
            else setProductB(product);

            // Count a battle when a pair is completed for the first time
            if (!isPro && otherProduct && !currentHadProduct) {
                recordBattle();
            }

            setActiveSlot(null);
            setManualBarcode('');
        } else {
            toast.error("Product not found");
        }
    };

    const handleSelectProduct = (product: ProductData) => {
        if (!activeSlot) return;

        if (!isPro && !canBattle) {
            toast.error("You've used all Food Battles for today. Upgrade to Pro for unlimited battles.");
            return;
        }

        const otherProduct = activeSlot === 'A' ? productB : productA;
        const currentHadProduct = activeSlot === 'A' ? !!productA : !!productB;

        if (activeSlot === 'A') setProductA(product);
        else setProductB(product);

        if (!isPro && otherProduct && !currentHadProduct) {
            recordBattle();
        }

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
        const p100g = product.nutrition_per_100g as Record<string, unknown> | undefined;
        if (p100g?.[key] !== undefined && p100g?.[key] !== null) {
            return p100g[key] as number;
        }

        // 2. Try simple aliases in nutrition_per_100g
        for (const k of fallbackKeys) {
            if (p100g?.[k] !== undefined && p100g?.[k] !== null) return p100g[k] as number;
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
        <Card
            className="flex h-full cursor-pointer flex-col items-center justify-center rounded-[30px] border-2 border-dashed border-orange-200/80 bg-white/78 p-8 text-center shadow-[var(--shadow-soft)] transition-colors hover:bg-orange-50/80"
            onClick={() => handleOpenSlot(slot)}
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-orange-50 shadow-[var(--shadow-soft)]">
                <Plus className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xl font-semibold mb-2">Add Product {slot}</span>
            <p className="text-muted-foreground text-sm">Tap to search or scan</p>
        </Card>
    );

    const SelectionModal = () => {
        if (!activeSlot) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                <Card className="w-full max-w-md rounded-[30px] border-white/70 bg-white/95 shadow-product">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Select Product {activeSlot}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setActiveSlot(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Reuse Barcode Scanner if needed, or simple input for MVP */}
                        <div>
                            <div className="mb-4">
                                <BarcodeScanner
                                    isScanning={isScanning}
                                    onToggleScanning={() => setIsScanning(!isScanning)}
                                    onScan={handleLookup}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter barcode..."
                                    value={manualBarcode}
                                    onChange={(e) => setManualBarcode(e.target.value)}
                                    className="rounded-2xl border-orange-100/80 bg-white/90"
                                />
                                <Button onClick={() => handleLookup(manualBarcode)} disabled={isLoading} className="rounded-full shadow-[var(--shadow-warm)]">
                                    {isLoading ? '...' : 'Search'}
                                </Button>
                            </div>
                            <div className="mt-4 rounded-[18px] border border-orange-100/80 bg-orange-50/80 p-3 text-xs text-muted-foreground">
                                Samples: 8906000610077 (Chips), 8906019779840 (Nuts)
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const ComparisonRow = ({ field }: { field: typeof comparisonFields[0] }) => {
        const valA = getNutrientValue(productA!, field.key, field.fallbacks);
        const valB = getNutrientValue(productB!, field.key, field.fallbacks);

        // FEATURE: Hide row if BOTH are missing
        if (valA === null && valB === null) return null;

        const isAWinner = valA !== null && valB !== null && valA !== valB && (field.lowerIsBetter ? valA < valB : valA > valB);
        const isBWinner = valA !== null && valB !== null && valA !== valB && (field.lowerIsBetter ? valB < valA : valB > valA);

        const displayA = valA !== null ? valA : '-';
        const displayB = valB !== null ? valB : '-';

        return (
            <div className="grid grid-cols-3 border-b py-3 pl-1 last:border-0">
                <div className={`text-center font-medium ${isAWinner ? 'rounded-full bg-emerald-50 text-emerald-700' : ''}`}>
                    {displayA} <span className="text-xs text-muted-foreground">{valA !== null ? field.unit : ''}</span>
                </div>
                <div className="text-center text-sm font-semibold text-muted-foreground flex items-center justify-center gap-1">
                    {field.label}
                </div>
                <div className={`text-center font-medium ${isBWinner ? 'rounded-full bg-emerald-50 text-emerald-700' : ''}`}>
                    {displayB} <span className="text-xs text-muted-foreground">{valB !== null ? field.unit : ''}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: 'Food Battle' }]} />
            <div className="mb-8 flex flex-col items-center gap-4 ">
                <div className="text-center pt-4 pb-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2 text-sm font-semibold text-primary mb-5">
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Head-to-head comparison
                    </div>
                    <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-[1.02] tracking-tight text-foreground">
                        Food{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                            Battle
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Pit two products head‑to‑head and see which one wins for your health.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {isPro ? (
                        <Badge className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-warm)]">
                            PRO • Unlimited battles & ad‑free
                        </Badge>
                    ) : (
                        <>
                            <Badge variant="outline" className="flex items-center gap-1 rounded-full border-orange-200/80 bg-orange-50 text-xs text-orange-800">
                                <Zap className="w-3 h-3 text-primary" />
                                {typeof battlesLeft === 'number' && Number.isFinite(battlesLeft)
                                    ? `${battlesLeft} battle${battlesLeft === 1 ? '' : 's'} left today`
                                    : 'Daily battles available'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Free: {maxBattles}/day, Pro: unlimited
                            </span>
                        </>
                    )}
                </div>

                {/* Battles exhausted card for free users when limit is reached */}
                {!isPro && battlesLeft === 0 && (
                    <Card className="w-full max-w-xl rounded-[28px] border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,237,213,0.8),rgba(255,250,244,0.98))] shadow-product">
                        <CardHeader className="pb-3">
                            <div className="flex justify-center">
                                <Badge className="rounded-full bg-primary px-3 py-1 text-xs uppercase tracking-wide text-primary-foreground">
                                    Battles exhausted
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center pb-6">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Unlock Unlimited Battles
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                You&apos;ve used all of today&apos;s free Food Battles.
                                Go Pro to compare products head‑to‑head without limits.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                                    <Zap className="w-3 h-3 text-primary" />
                                    Unlimited battles
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                                    <ArrowRightLeft className="w-3 h-3 text-primary" />
                                    Full nutrition comparison
                                </Badge>
                            </div>
                            <Button
                                className="mt-2 w-full rounded-full shadow-[var(--shadow-warm)] sm:w-auto"
                                onClick={() => router.push('/pricing')}
                            >
                                Upgrade to Pro
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                {/* Product A Slot */}
                <div className="relative">
                    {productA ? (
                        <Card className={`h-full rounded-[30px] border-2 border-white/70 bg-white/88 shadow-product ${winner === 'A' ? 'border-orange-300 bg-orange-50/70 shadow-[var(--shadow-warm)]' : ''}`}>
                            <div className="absolute top-2 right-2 z-10">
                                <Button variant="ghost" size="icon" onClick={() => clearSlot('A')} className="h-6 w-6 rounded-full bg-white/90">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            {winner === 'A' && (
                                <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground shadow-[var(--shadow-warm)] animate-bounce sm:px-4 sm:text-sm">
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
                        <Card className={`h-full rounded-[30px] border-2 border-white/70 bg-white/88 shadow-product ${winner === 'B' ? 'border-orange-300 bg-orange-50/70 shadow-[var(--shadow-warm)]' : ''}`}>
                            <div className="absolute top-2 right-2 z-10">
                                <Button variant="ghost" size="icon" onClick={() => clearSlot('B')} className="h-6 w-6 rounded-full bg-white/90">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            {winner === 'B' && (
                                <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground shadow-[var(--shadow-warm)] animate-bounce sm:px-4 sm:text-sm">
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
                <Card className="animate-in fade-in slide-in-from-bottom-4 rounded-[30px] border-white/70 bg-white/90 shadow-product duration-500">
                    <CardContent className="overflow-x-auto p-4 sm:p-6">
                        {comparisonFields.map(field => (
                            <ComparisonRow key={field.key} field={field} />
                        ))}

                        <div className="mt-2 grid grid-cols-3 rounded-[22px] border border-orange-100/80 bg-orange-50/60 py-3 pt-4">
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
