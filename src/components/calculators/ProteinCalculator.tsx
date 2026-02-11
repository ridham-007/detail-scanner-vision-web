"use client";
import React, { useState, useEffect } from "react";
import {
  Zap,
  User,
  Ruler,
  Heart,
  AlertCircle,
  TrendingUp,
  Activity,
  Calculator,
} from "lucide-react";

import { Bar } from "react-chartjs-2";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// ✅ TYPE DEFINITIONS
interface ProteinResults {
  dailyProtein: string;
  proteinPerMeal: string;
  proteinPercentage: string;
  totalCalories: string;
  proteinCalories: string;
  weight: number;
  activityLevel: string;
}

interface GuidelineType {
  ADA_min: string;
  ADA_max: string;
  CDC_min: string;
  CDC_max: string;
  WHO_safe: string;
}

const ProteinCalculator: React.FC = () => {
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<string>("male");
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");
  const [activityLevel, setActivityLevel] = useState<string>("light");
  const [results, setResults] = useState<ProteinResults | null>(null);

  // ✅ Hide result when any input changes
  useEffect(() => {
    setResults(null);
  }, [age, gender, height, weight, activityLevel]);

  const handleCalculate = (e: React.FormEvent): void => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (!weightNum || !heightNum || !ageNum) return;

    const baseProtein: Record<string, number> = {
      sedentary: 0.8,
      light: 1.0,
      moderate: 1.2,
      active: 1.4,
      athlete: 1.6,
    };

    const activityMultiplier = baseProtein[activityLevel] || 1.0;

    const dailyProtein = weightNum * activityMultiplier;
    const proteinPerMeal = dailyProtein / 4;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const activityBMRMultiplier: Record<string, number> = {
      sedentary: 1.2,
      light: 1.35,
      moderate: 1.45,
      active: 1.55,
      athlete: 1.75,
    };

    const totalCalories = bmr * (activityBMRMultiplier[activityLevel] || 1.35);

    const proteinCalories = dailyProtein * 4;
    const proteinPercentageOfCalories = (proteinCalories / totalCalories) * 100;

    const calculatedResults: ProteinResults = {
      dailyProtein: dailyProtein.toFixed(1),
      proteinPerMeal: proteinPerMeal.toFixed(1),
      proteinPercentage: proteinPercentageOfCalories.toFixed(1),
      totalCalories: totalCalories.toFixed(0),
      proteinCalories: proteinCalories.toFixed(0),
      weight: weightNum,
      activityLevel,
    };

    setResults(calculatedResults);
    toast.success("Protein calculation successful!");
  };

  // ✅ Clear Form
  const clearForm = (): void => {
    setAge("");
    setGender("male");
    setHeight("");
    setWeight("");
    setActivityLevel("light");
    setResults(null);
    toast.success("Form cleared successfully!");
  };

  // ✅ Guideline Function (TYPED)
  const getDynamicGuidelines = (
    weight: number,
    height: string,
    age: string,
    gender: string,
    activityLevel: string,
  ): GuidelineType | null => {
    const w = Number(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) return null;

    let ADA_min: string, ADA_max: string;

    if (activityLevel === "sedentary" || activityLevel === "light") {
      ADA_min = (w * 0.8).toFixed(0);
      ADA_max = (w * 1.0).toFixed(0);
    } else {
      ADA_min = (w * 1.0).toFixed(0);
      ADA_max = (w * 1.8).toFixed(0);
    }

    const WHO_safe = (w * 0.83).toFixed(0);

    let BMR: number;
    if (gender === "male") {
      BMR = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      BMR = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const calcNetFactor: Record<string, number> = {
      sedentary: 1.2,
      light: 1.35,
      moderate: 1.45,
      active: 1.55,
      athlete: 1.75,
    };

    const factor = calcNetFactor[activityLevel] || 1.45;
    const TDEE = BMR * factor;

    const CDC_min = ((TDEE * 0.1) / 4).toFixed(0);
    const CDC_max = ((TDEE * 0.35) / 4).toFixed(0);

    return { ADA_min, ADA_max, CDC_min, CDC_max, WHO_safe };
  };

  const getProteinCategory = (protein: string, weight: number): string => {
    const proteinPerKg = Number(protein) / weight;

    if (proteinPerKg < 0.8) return "Below recommended";
    if (proteinPerKg < 1.2) return "Adequate";
    if (proteinPerKg < 1.6) return "High";
    return "Very high";
  };

  const getProteinColor = (): string => {
    if (!results) return "text-primary";

    const proteinPerKg = Number(results.dailyProtein) / results.weight;

    if (proteinPerKg < 0.8) return "text-red-600";
    if (proteinPerKg < 1.2) return "text-green-600";
    if (proteinPerKg < 1.6) return "text-blue-600";

    return "text-purple-600";
  };

  const getProteinBgColor = (): string => {
    if (!results) return "bg-primary/5 border-primary/20";

    const proteinPerKg = Number(results.dailyProtein) / results.weight;

    if (proteinPerKg < 0.8) return "bg-red-50 border-red-200";
    if (proteinPerKg < 1.2) return "bg-green-50 border-green-200";
    if (proteinPerKg < 1.6) return "bg-blue-50 border-blue-200";

    return "bg-purple-50 border-purple-200";
  };

  const guideline = results
    ? getDynamicGuidelines(results.weight, height, age, gender, activityLevel)
    : null;

  const comparisonChartData = {
    labels: [
      "Your Requirement",
      "ADA Minimum",
      "ADA Maximum",
      "CDC Minimum",
      "CDC Maximum",
      "WHO Safe Limit",
    ],
    datasets: [
      {
        label: "Protein Intake (g/day)",
        data: guideline
          ? [
              results!.dailyProtein,
              guideline.ADA_min,
              guideline.ADA_max,
              guideline.CDC_min,
              guideline.CDC_max,
              guideline.WHO_safe,
            ]
          : [],
        backgroundColor: [
          "#a655f7",
          "#3690a0",
          "#aa2e6e",
          "#FFADE9",
          "#DB7AE1",
          "#B78BE5",
        ],
        borderRadius: 10,
        barThickness: 28,
      },
    ],
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-8">
      <div className="mt-4 space-y-6 text-foreground">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <User className="inline h-4 w-4 mr-2 text-primary" />
              Age (years)
            </label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              min="15"
              max="100"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Ruler className="inline h-4 w-4 mr-2 text-primary" />
              Height (cm)
            </label>
            <input
              type="number"
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              min="120"
              max="250"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Heart className="inline h-4 w-4 mr-2 text-primary" />
              Weight (kg)
            </label>
            <input
              type="number"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              min="30"
              max="200"
              step="0.1"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <User className="inline h-4 w-4 mr-2 text-primary" />
              Gender
            </label>
            <select
              value={gender}
              required
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="flex items-center text-sm font-semibold text-foreground mb-3">
            <Activity className="inline h-4 w-4 mr-2 text-primary" />
            Activity Level
          </label>
          <select
            value={activityLevel}
            required
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
          >
            <option value="sedentary">Sedentary (desk job, no exercise)</option>
            <option value="light">Light (exercise 1–3 times/week)</option>
            <option value="moderate">Moderate (exercise 3–5 times/week)</option>
            <option value="active">
              Active (daily exercise 3–4 times/week)
            </option>
            <option value="athlete">Athlete (intense or 2x/day)</option>
          </select>
        </div>
        <div className="flex gap-4 mt-6 py-2">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-sm xl:text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Calculator className="h-5 w-5" />
            Calculate
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="px-8 bg-gray-100 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold text-sm xl:text-lg transition-all duration-300"
          >
            Clear
          </button>
        </div>
        {results &&
          getDynamicGuidelines(
            results.weight,
            height,
            age,
            gender,
            activityLevel,
          ) &&
          (() => {
            const g = getDynamicGuidelines(
              results.weight,
              height,
              age,
              gender,
              activityLevel,
            );

            return (
              <div className="mt-4 space-y-2 p-6 rounded-2xl border-2 text-foreground">
                <p className="font-semibold text-green-700">
                  * Based on given information, the following are the basic
                  protein intake recommendations from multiple authoritative
                  institutions:
                </p>

                <p>
                  <strong>* American Dietetic Association (ADA):</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    at least {g?.ADA_min} – {g?.ADA_max} grams/day
                  </span>
                  .
                </p>

                <p>
                  <strong>
                    * The Centers for Disease Control and Prevention (CDC):
                  </strong>{" "}
                  <span className="text-green-700 font-semibold">
                    {g?.CDC_min} – {g?.CDC_max} grams/day
                  </span>{" "}
                  (10–35% of daily caloric intake).
                </p>

                <p>
                  <strong>* World Health Organization (WHO):</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    safe lower limit: {g?.WHO_safe} grams/day
                  </span>
                  .
                </p>
              </div>
            );
          })()}
        {results && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border-2 ${getProteinBgColor()}`}>
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Daily Protein Requirement
                </div>

                <div className={`text-4xl font-bold ${getProteinColor()}`}>
                  {results.dailyProtein}g
                </div>

                <div
                  className={`text-lg font-semibold mt-2 ${getProteinColor()}`}
                >
                  {getProteinCategory(results.dailyProtein, results.weight)}
                </div>

                <div className="text-sm text-muted-foreground mt-2">
                  {(Number(results.dailyProtein) / results.weight).toFixed(1)}g
                  per kg body weight
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results.proteinPerMeal}g
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Per Meal Target
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    Based on 4 meals/day
                  </div>
                </div>

                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results.proteinPercentage}%
                  </div>

                  <div className="text-sm text-muted-foreground">
                    of Total Calories
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {results.proteinCalories} cal from protein
                  </div>
                </div>
              </div>
            </div>

            {guideline && (
              <div className="bg-card border border-border/50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Protein Intake Comparison (Guidelines)
                </h3>

                <div className="h-80">
                  <Bar
                    data={comparisonChartData}
                    options={{
                      indexAxis: "y",
                      responsive: true,
                      maintainAspectRatio: false,

                      plugins: {
                        legend: { display: false },

                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.raw} g/day`,
                          },
                        },
                      },

                      scales: {
                        x: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Protein (grams/day)",
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
    </form>
  );
};

export default ProteinCalculator;
