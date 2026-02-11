"use client";
import React, { useState, useEffect } from "react";
import {
    Droplets,
    Activity,
    Thermometer,
    Scale,
    Clock,
    Coffee,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const num = (v: string) => parseFloat(v) || 0;

const WaterIntakeCalculator = () => {
    const [weight, setWeight] = useState("70");
    const [weightUnit, setWeightUnit] = useState("kg");
    const [activityLevel, setActivityLevel] = useState("moderate");
    const [exerciseMinutes, setExerciseMinutes] = useState("30");
    const [climate, setClimate] = useState<"cold" | "temperate" | "warm" | "hot" | "humid">("temperate");
    const [caffeineIntake, setCaffeineIntake] = useState("2");
    const [isPregnant, setIsPregnant] = useState(false);
    const [isBreastfeeding, setIsBreastfeeding] = useState(false);

    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        setResults(null);
    }, [
        weight,
        weightUnit,
        activityLevel,
        exerciseMinutes,
        climate,
        caffeineIntake,
        isPregnant,
        isBreastfeeding,
    ]);

    const calculateWaterIntake = (e: React.FormEvent) => {
        e.preventDefault();

        let weightKg = num(weight);
        if (weightUnit === "lbs") {
            weightKg = weightKg * 0.453592;
        }

        if (weightKg <= 0) {
            toast.error("Please enter a valid weight.");
            return;
        }

        // Base calculation: 30-35ml per kg of body weight
        let baseIntake = weightKg * 33; // ml per day

        // Activity level adjustments
        const activityMultipliers: Record<string, number> = {
            sedentary: 0.9,
            light: 1.0,
            moderate: 1.1,
            active: 1.2,
            veryActive: 1.35,
        };
        baseIntake *= activityMultipliers[activityLevel] || 1;

        // Exercise adjustment: ~350ml (12oz) per 30 minutes of exercise
        const exerciseMins = num(exerciseMinutes);
        const exerciseAdjustment = (exerciseMins / 30) * 350;
        baseIntake += exerciseAdjustment;

        // Climate adjustments
        const climateAdjustments: Record<string, number> = {
            cold: -200,
            temperate: 0,
            warm: 300,
            hot: 500,
            humid: 400,
        };
        baseIntake += climateAdjustments[climate] || 0;

        // Caffeine adjustment: ~150ml per caffeinated drink
        const caffeineDrinks = num(caffeineIntake);
        const caffeineAdjustment = caffeineDrinks * 150;
        baseIntake += caffeineAdjustment;

        // Pregnancy/Breastfeeding adjustments
        if (isPregnant) baseIntake += 300;
        if (isBreastfeeding) baseIntake += 700;

        // Convert to different units
        const liters = baseIntake / 1000;
        const ounces = baseIntake * 0.033814;
        const cups = ounces / 8;
        const glasses = liters / 0.25; // 250ml glasses

        // Hourly intake (assuming 16 waking hours)
        const hourlyMl = baseIntake / 16;
        const hourlyOz = ounces / 16;

        // Create hydration schedule
        const schedule = [
            {
                time: "6:00 AM",
                event: "Wake up",
                amount: 500,
                note: "Start your day with a full glass",
            },
            {
                time: "8:00 AM",
                event: "Breakfast",
                amount: 250,
                note: "Drink with breakfast",
            },
            {
                time: "10:00 AM",
                event: "Mid-morning",
                amount: 350,
                note: "Keep a bottle at your desk",
            },
            {
                time: "12:00 PM",
                event: "Lunch",
                amount: 350,
                note: "Drink before and during lunch",
            },
            {
                time: "2:00 PM",
                event: "Afternoon",
                amount: 350,
                note: "Combat the afternoon slump",
            },
            {
                time: "4:00 PM",
                event: "Pre-workout",
                amount: 300,
                note: "Hydrate before exercise",
            },
            {
                time: "6:00 PM",
                event: "Dinner",
                amount: 300,
                note: "Drink with dinner",
            },
            {
                time: "8:00 PM",
                event: "Evening",
                amount: Math.max(200, baseIntake - 2400),
                note: "Light hydration before bed",
            },
        ];

        // Adjust schedule amounts to match total
        const scheduleTotal = schedule.reduce((sum, s) => sum + s.amount, 0);
        const adjustmentFactor = baseIntake / scheduleTotal;
        schedule.forEach((s: any) => {
            s.amount = Math.round(s.amount * adjustmentFactor);
            s.amountOz = Math.round(s.amount * 0.033814);
        });

        setResults({
            totalMl: Math.round(baseIntake),
            liters: liters.toFixed(2),
            ounces: Math.round(ounces),
            cups: cups.toFixed(1),
            glasses: Math.round(glasses),
            hourlyMl: Math.round(hourlyMl),
            hourlyOz: hourlyOz.toFixed(1),
            schedule,
            exerciseBonus: Math.round(exerciseAdjustment),
            climateBonus: climateAdjustments[climate] || 0,
            caffeineBonus: Math.round(caffeineAdjustment),
        });

        toast.success("Water intake calculated!");
    };

    const clearForm = () => {
        setWeight("");
        setActivityLevel("moderate");
        setExerciseMinutes("");
        setClimate("temperate");
        setCaffeineIntake("");
        setIsPregnant(false);
        setIsBreastfeeding(false);
        setResults(null);
        toast.success("Form cleared!");
    };

    const getHydrationLevel = (glasses: number) => {
        if (glasses >= 10)
            return {
                level: "Excellent",
                color: "text-emerald-600",
                bg: "bg-emerald-500",
            };
        if (glasses >= 8)
            return { level: "Good", color: "text-green-600", bg: "bg-green-500" };
        if (glasses >= 6)
            return { level: "Adequate", color: "text-blue-600", bg: "bg-blue-500" };
        return { level: "Low", color: "text-amber-600", bg: "bg-amber-500" };
    };

    return (
        <form onSubmit={calculateWaterIntake} className="space-y-8">
            {/* Weight Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Scale className="h-5 w-5" />
                    Body Weight
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Your Weight</Label>
                        <input
                            type="number"
                            min="20"
                            max="300"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter weight"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Unit</Label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setWeightUnit("kg")}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${weightUnit === "kg"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                                    }`}
                            >
                                Kilograms (kg)
                            </button>
                            <button
                                type="button"
                                onClick={() => setWeightUnit("lbs")}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${weightUnit === "lbs"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80"
                                    }`}
                            >
                                Pounds (lbs)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Activity Level */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Activity className="h-5 w-5" />
                    Activity Level
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                        { value: "sedentary", label: "Sedentary", desc: "Little exercise" },
                        { value: "light", label: "Light", desc: "1-2 days/week" },
                        { value: "moderate", label: "Moderate", desc: "3-5 days/week" },
                        { value: "active", label: "Active", desc: "6-7 days/week" },
                        { value: "veryActive", label: "Very Active", desc: "Athlete" },
                    ].map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => setActivityLevel(level.value)}
                            className={`p-3 rounded-xl text-center transition-all ${activityLevel === level.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                                }`}
                        >
                            <div className="font-medium text-sm">{level.label}</div>
                            <div className="text-xs opacity-70">{level.desc}</div>
                        </button>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Daily Exercise Duration (minutes)
                    </Label>
                    <input
                        type="number"
                        min="0"
                        max="300"
                        value={exerciseMinutes}
                        onChange={(e) => setExerciseMinutes(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="30"
                    />
                </div>
            </div>

            <Separator />

            {/* Environment */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Thermometer className="h-5 w-5" />
                    Environment & Climate
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                        { value: "cold", label: "Cold", icon: "❄️" },
                        { value: "temperate", label: "Temperate", icon: "🌤️" },
                        { value: "warm", label: "Warm", icon: "☀️" },
                        { value: "hot", label: "Hot", icon: "🔥" },
                        { value: "humid", label: "Humid", icon: "💧" },
                    ].map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setClimate(c.value as any)}
                            className={`p-3 rounded-xl text-center transition-all ${climate === c.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                                }`}
                        >
                            <div className="text-2xl mb-1">{c.icon}</div>
                            <div className="font-medium text-sm">{c.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Additional Factors */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Coffee className="h-5 w-5" />
                    Additional Factors
                </div>
                <div className="space-y-2">
                    <Label>Caffeinated Drinks per Day (coffee, tea, soda)</Label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        value={caffeineIntake}
                        onChange={(e) => setCaffeineIntake(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="2"
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPregnant}
                            onChange={(e) => setIsPregnant(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Pregnant</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isBreastfeeding}
                            onChange={(e) => setIsBreastfeeding(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="font-medium">Breastfeeding</span>
                    </label>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
                >
                    <Droplets className="h-5 w-5" />
                    Calculate Water Intake
                </button>
                <button
                    type="button"
                    onClick={clearForm}
                    className="px-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-4 rounded-xl font-semibold transition-all"
                >
                    Clear
                </button>
            </div>

            {/* Results */}
            {results && (
                <div className="space-y-6">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Droplets className="h-6 w-6 text-blue-500" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Daily Water Goal
                            </span>
                        </div>
                        <div className="text-4xl md:text-5xl font-bold text-blue-600">
                            {results.liters} L
                        </div>
                        <div className="text-xl mt-2 text-blue-500">
                            {results.ounces} oz • {results.glasses} glasses
                        </div>
                        <div
                            className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${getHydrationLevel(results.glasses).bg
                                }/20`}
                        >
                            <span
                                className={`font-semibold ${getHydrationLevel(results.glasses).color
                                    }`}
                            >
                                {getHydrationLevel(results.glasses).level} Hydration Target
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {results.totalMl}
                            </div>
                            <div className="text-sm text-muted-foreground">ml per day</div>
                        </div>
                        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-cyan-600">
                                {results.cups}
                            </div>
                            <div className="text-sm text-muted-foreground">cups (8oz)</div>
                        </div>
                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-teal-600">
                                {results.hourlyMl} ml
                            </div>
                            <div className="text-sm text-muted-foreground">per hour</div>
                        </div>
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-sky-600">
                                {results.hourlyOz} oz
                            </div>
                            <div className="text-sm text-muted-foreground">per hour</div>
                        </div>
                    </div>

                    {/* Adjustments Made */}
                    {(results.exerciseBonus > 0 ||
                        results.climateBonus !== 0 ||
                        results.caffeineBonus > 0) && (
                            <div className="bg-card border rounded-xl p-4">
                                <h4 className="font-semibold mb-3">Personalized Adjustments</h4>
                                <div className="space-y-2">
                                    {results.exerciseBonus > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Exercise ({exerciseMinutes} min)
                                            </span>
                                            <span className="font-medium text-green-600">
                                                +{results.exerciseBonus} ml
                                            </span>
                                        </div>
                                    )}
                                    {results.climateBonus !== 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Climate ({climate})
                                            </span>
                                            <span
                                                className={`font-medium ${results.climateBonus >= 0
                                                    ? "text-green-600"
                                                    : "text-amber-600"
                                                    }`}
                                            >
                                                {results.climateBonus >= 0 ? "+" : ""}
                                                {results.climateBonus} ml
                                            </span>
                                        </div>
                                    )}
                                    {results.caffeineBonus > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Caffeine offset ({caffeineIntake} drinks)
                                            </span>
                                            <span className="font-medium text-green-600">
                                                +{results.caffeineBonus} ml
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Hydration Schedule */}
                    <div className="bg-card border rounded-xl overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b">
                            <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Suggested Hydration Schedule
                            </h4>
                        </div>
                        <div className="divide-y">
                            {results.schedule.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {item.time} - {item.event}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.note}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-600">
                                            {item.amount} ml
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.amountOz} oz
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Progress */}
                    <div className="bg-card border rounded-xl p-4">
                        <h4 className="font-semibold mb-4">Daily Progress Tracker</h4>
                        <div className="space-y-3">
                            {[...Array(results.glasses)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground w-16">
                                        Glass {i + 1}
                                    </span>
                                    <Progress value={0} className="flex-1 h-3" />
                                    <span className="text-sm font-medium w-16 text-right">
                                        250 ml
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                            Check off each glass as you drink throughout the day!
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                        <strong>💧 Hydration Tips:</strong>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li>Start your day with a glass of water before coffee</li>
                            <li>Keep a water bottle visible on your desk</li>
                            <li>Set hourly reminders if you forget to drink</li>
                            <li>Eat water-rich foods like cucumbers and watermelon</li>
                        </ul>
                    </div>
                </div>
            )}
        </form>
    );
};

export default WaterIntakeCalculator;
