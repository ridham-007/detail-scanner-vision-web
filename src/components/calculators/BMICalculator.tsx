"use client";
import React, { useState, useEffect } from "react";
import {
    User,
    Ruler,
    Heart,
    AlertCircle,
    TrendingUp,
    Calendar,
    Scale,
} from "lucide-react";
import { toast } from "sonner";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BMICalculator = () => {
    const [age, setAge] = useState("25");
    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState("180");
    const [weight, setWeight] = useState("65");
    const [bmi, setBmi] = useState<string | null>(null);
    const [bmiData, setBmiData] = useState<string[]>([]);

    // Hide result when any input changes
    useEffect(() => {
        setBmi(null);
    }, [age, gender, height, weight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const parsedAge = parseInt(age);
        if (parsedAge < 2 || parsedAge > 120) {
            toast.error("Age must be between 2 and 120.");
            return;
        }

        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (!gender) {
            toast.error("Please select a gender.");
            return;
        }

        if (h <= 0 || w <= 0) {
            toast.error("Please enter valid height and weight values.");
            return;
        }

        const heightInMeters = h / 100;
        const calculatedBmi = w / (heightInMeters * heightInMeters);
        setBmi(calculatedBmi.toFixed(2));

        const newBmiData = [...bmiData, calculatedBmi.toFixed(2)];
        if (newBmiData.length > 10) newBmiData.shift();
        setBmiData(newBmiData);

        toast.success("BMI calculated successfully!");
    };

    const handleClear = () => {
        setAge("");
        setGender("");
        setHeight("");
        setWeight("");
        setBmi(null);
        setBmiData([]);
        toast.success("Form cleared successfully!");
    };

    const getCategory = (bmiVal: number) => {
        if (bmiVal < 18.5) return "Underweight";
        if (bmiVal >= 18.5 && bmiVal < 24.9) return "Normal weight";
        if (bmiVal >= 25 && bmiVal < 29.9) return "Overweight";
        return "Obesity";
    };

    const getBMIColor = () => {
        const bmiNum = parseFloat(bmi || "0");
        if (bmiNum < 18.5) return "text-blue-600";
        if (bmiNum >= 18.5 && bmiNum < 25) return "text-green-600";
        if (bmiNum >= 25 && bmiNum < 30) return "text-yellow-600";
        return "text-red-600";
    };

    const getBMIBgColor = () => {
        const bmiNum = parseFloat(bmi || "0");
        if (bmiNum < 18.5) return "bg-blue-50 border-blue-200";
        if (bmiNum >= 18.5 && bmiNum < 25) return "bg-green-50 border-green-200";
        if (bmiNum >= 25 && bmiNum < 30) return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    // 🎨 Updated Chart Colors
    const chartData = {
        labels: Array.from({ length: bmiData.length }, (_, i) => `Entry ${i + 1}`),
        datasets: [
            {
                label: "BMI Progress",
                data: bmiData.map(Number),
                backgroundColor: bmiData.map((v) => {
                    const val = parseFloat(v);
                    if (val < 18.5) return "#3b82f6";
                    if (val < 25) return "#22c55e";
                    if (val < 30) return "#eab308";
                    return "#ef4444";
                }),
                borderRadius: 10,
                barThickness: 26,
                hoverBackgroundColor: "#a655f7",
            },
        ],
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div>
                        <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                            <Calendar className="inline h-4 w-4 mr-2 text-primary" />
                            Age (2 - 120)
                        </label>
                        <input
                            type="number"
                            aria-label="Age"
                            min="2"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                            <User className="inline h-4 w-4 mr-2 text-primary" />
                            Gender
                        </label>
                        <div className="flex gap-6 items-center">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                />
                                Male
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                />
                                Female
                            </label>
                        </div>
                    </div>

                    {/* Height */}
                    <div>
                        <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                            <Ruler className="inline h-4 w-4 mr-2 text-primary" />
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            aria-label="Height"
                            min="50"
                            max="250"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                            required
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                            <Scale className="inline h-4 w-4 mr-2 text-primary" />
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            aria-label="Weight"
                            min="10"
                            max="300"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-sm xl:text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
                    >
                        <Heart className="h-5 w-5" />
                        Calculate
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-8 bg-gray-100 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold text-sm xl:text-lg transition-all duration-300"
                    >
                        Clear
                    </button>
                </div>
            </form>

            {bmi && (
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border-2 ${getBMIBgColor()}`}>
                        <div className="text-center mb-4">
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                                Your BMI
                            </div>
                            <div
                                className={`text-4xl font-bold text-primary ${getBMIColor()}`}
                            >
                                {bmi}
                            </div>
                            <div className={`text-lg font-semibold mt-2 ${getBMIColor()}`}>
                                {getCategory(parseFloat(bmi))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/20 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            BMI Categories
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="font-medium">Underweight</span>
                                <span className="text-blue-600 font-semibold">Below 18.5</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                <span className="font-medium">Normal weight</span>
                                <span className="text-green-600 font-semibold">
                                    18.5 - 24.9
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <span className="font-medium">Overweight</span>
                                <span className="text-yellow-600 font-semibold">
                                    25.0 - 29.9
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                <span className="font-medium">Obese</span>
                                <span className="text-red-600 font-semibold">
                                    30.0 and above
                                </span>
                            </div>
                        </div>
                    </div>

                    {bmiData.length > 0 && (
                        <div className="bg-card border border-border/50 p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                BMI Progress Tracking
                            </h3>
                            <div className="h-64">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: "top",
                                            },
                                        },
                                        scales: {
                                            y: {
                                                min: 15,
                                                max: 40,
                                                title: {
                                                    display: true,
                                                    text: "BMI Value",
                                                },
                                                grid: {
                                                    color: "rgba(209, 213, 219, 0.3)",
                                                },
                                            },
                                            x: {
                                                grid: {
                                                    color: "rgba(209, 213, 219, 0.2)",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
