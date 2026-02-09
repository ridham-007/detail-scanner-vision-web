"use client";
import { useState, useEffect } from "react";
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
import { Calculator } from "lucide-react";
import { toast } from "sonner";
import ModernCalculatorLayout from "@/components/Moderncalculatorlayout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function CalorieCalculator() {
  // Basic inputs
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");

  // Units
  const [unitType, setUnitType] = useState("metric"); // 'us' | 'metric'

  // Metric height/weight
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");

  // US height/weight
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLb, setWeightLb] = useState("154");

  // Activity (matches   factors)
  const [activity, setActivity] = useState("1.2");

  // Advanced settings toggle
  const [showSettings, setShowSettings] = useState(false);

  // BMR formula + body fat (for Katch-McArdle)
  const [bmrFormula, setBmrFormula] = useState("mifflin"); // 'mifflin' | 'harris' | 'katch'
  const [bodyFat, setBodyFat] = useState(""); // %

  // Result unit
  const [resultUnit, setResultUnit] = useState("kcal"); // 'kcal' | 'kj'

  const [results, setResults] = useState(null);

  // Hide results whenever any real input changes (but NOT on pure unit toggle)
  useEffect(() => {
    if (results) setResults(null);
  }, [
    age,
    gender,
    unitType,
    heightCm,
    weightKg,
    heightFt,
    heightIn,
    weightLb,
    activity,
    bmrFormula,
    bodyFat,
    showSettings,
  ]);

  // When turning OFF advanced settings, force unit back to kcal
  useEffect(() => {
    if (!showSettings && resultUnit !== "kcal") {
      setResultUnit("kcal");
    }
  }, [showSettings, resultUnit]);

  // Activity options
  const ACTIVITY_OPTIONS = [
    { value: "1.2", label: "Sedentary: little or no exercise" },
    { value: "1.375", label: "Light: exercise 1–3 times/week" },
    { value: "1.465", label: "Moderate: exercise 4–5 times/week" },
    {
      value: "1.55",
      label: "Active: daily exercise or intense exercise 3–4 times/week",
    },
    {
      value: "1.725",
      label: "Very Active: intense exercise 6–7 times/week",
    },
    {
      value: "1.9",
      label: "Extra Active: very intense exercise daily, or physical job",
    },
  ];

  const KJ_PER_KCAL = 4.1868;

  // Convert inputs to metric
  const getMetricValues = () => {
    let hCm;
    let wKg;

    if (unitType === "metric") {
      hCm = parseFloat(heightCm);
      wKg = parseFloat(weightKg);
    } else {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn);
      const lb = parseFloat(weightLb);

      hCm = ft * 30.48 + inch * 2.54;
      wKg = lb * 0.45359237;
    }

    return { hCm, wKg };
  };

  // Generic BMR calc using selected formula
  const calculateBMR = (formula, wKg, hCm, ageYears, bfValue) => {
    const A = ageYears;
    const W = wKg;
    const H = hCm;

    if (formula === "mifflin") {
      // Mifflin-St Jeor
      if (gender === "male") {
        return 10 * W + 6.25 * H - 5 * A + 5;
      } else {
        return 10 * W + 6.25 * H - 5 * A - 161;
      }
    }

    if (formula === "harris") {
      // Revised Harris-Benedict
      if (gender === "male") {
        return 13.397 * W + 4.799 * H - 5.677 * A + 88.362;
      } else {
        return 9.247 * W + 3.098 * H - 4.33 * A + 447.593;
      }
    }

    if (formula === "katch") {
      const bf = bfValue;
      if (isNaN(bf) || bf <= 0 || bf >= 70) {
        toast.error(
          "Please enter a valid body fat percentage (0–70) for Katch-McArdle.",
        );
        return null;
      }
      const F = bf / 100;
      // Katch-McArdle: BMR = 370 + 21.6(1 - F)W
      return 370 + 21.6 * (1 - F) * W;
    }

    return null;
  };

  const calculateCalories = (e) => {
    e.preventDefault();

    const ageNum = parseInt(age, 10);

    if (isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      toast.error("Age must be between 15 and 80.");
      return;
    }

    const { hCm, wKg } = getMetricValues();

    if (!hCm || !wKg || isNaN(hCm) || isNaN(wKg)) {
      toast.error("Please enter a valid height and weight.");
      return;
    }

    // Use settings only if checkbox is checked
    const effectiveFormula = showSettings ? bmrFormula : "mifflin";
    const effectiveBodyFat =
      showSettings && effectiveFormula === "katch" ? parseFloat(bodyFat) : null;

    const bmr = calculateBMR(
      effectiveFormula,
      wKg,
      hCm,
      ageNum,
      effectiveBodyFat,
    );
    if (bmr === null || isNaN(bmr)) return;

    const activityFactor = parseFloat(activity);
    const tdee = bmr * activityFactor;

    const maintenance = tdee;
    const loseHalfKg = tdee - 500;
    const loseOneKg = tdee - 1000;
    const gainHalfKg = tdee + 500;
    const gainOneKg = tdee + 1000;

    setResults({
      bmr,
      maintenance,
      loseHalfKg,
      loseOneKg,
      gainHalfKg,
      gainOneKg,
    });

    toast.success("Calories calculated successfully!");
  };

  const clearForm = () => {
    setAge("");
    setGender("male");
    setUnitType("metric");
    setHeightCm("");
    setWeightKg("");
    setHeightFt("");
    setHeightIn("");
    setWeightLb("");
    setActivity("1.2");
    setShowSettings(false);
    setBmrFormula("mifflin");
    setBodyFat("");
    setResultUnit("kcal");
    setResults(null);
    toast.success("Form cleared successfully!");
  };

  const formatValue = (value) => {
    if (value == null || isNaN(value)) return "-";
    // If advanced settings off, always show kcal
    const useKj = showSettings && resultUnit === "kj";
    const v = useKj ? Math.round(value * KJ_PER_KCAL) : Math.round(value);
    return v.toLocaleString();
  };

  const unitLabel =
    showSettings && resultUnit === "kj" ? "kJ/day" : "Calories/day";

  const CHART_COLORS = {
    bmr: "#DB7AE1",
    maintain: "#B78BE5",
    lose: "#FFADE9",
    gain: "#a655f7",
  };

  const details = {
    whatIs:
      "This calorie calculator estimates your daily calorie needs using standard BMR equations and your activity level, similar to the calculator from  .",
    howItWorks:
      "By default it uses the Mifflin–St Jeor equation in Calories per day. You can optionally enable advanced settings to choose a different BMR formula, use body fat %, and show results in kilojoules.",
    tips: [
      "A daily deficit of ~500 Calories is often associated with ~0.5 kg/week weight loss (approximate).",
      "A daily surplus of ~500 Calories is often associated with ~0.5 kg/week weight gain (approximate).",
      "Use the same units consistently when tracking weight over time.",
      "Talk to a healthcare professional before making large changes to your diet or activity level.",
    ],
  };

  return (
    <ModernCalculatorLayout
      title="Calorie Calculator"
      description="Calculate your daily caloric needs for weight maintenance, loss, or gain"
      path="/calculators/calorie"
      details={details}
    >
      <div className="w-full">
        <form onSubmit={calculateCalories}>
          <div className="space-y-6">

            {/* Units + Age + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Unit Type */}
              <div className="space-y-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={unitType === "metric"}
                      onChange={() => setUnitType("metric")}
                    />
                    Metric (cm, kg)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={unitType === "us"}
                      onChange={() => setUnitType("us")}
                    />
                    US (ft/in, lb)
                  </label>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label>Age (15–80)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label>Gender</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Height / Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unitType === "metric" ? (
                <>
                  <div>
                    <label>Height (cm)</label>
                    <input
                      className="w-full border p-2 rounded"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Weight (kg)</label>
                    <input
                      className="w-full border p-2 rounded"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label>Height (ft / in)</label>
                    <div className="flex gap-2">
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="ft"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                      />

                      <input
                        className="w-full border p-2 rounded"
                        placeholder="in"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label>Weight (lb)</label>
                    <input
                      className="w-full border p-2 rounded"
                      value={weightLb}
                      onChange={(e) => setWeightLb(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Activity */}
            <div>
              <label>Activity Level</label>
              <select
                className="w-full border p-2 rounded"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSettings}
                onChange={(e) => setShowSettings(e.target.checked)}
              />
              <label>Use advanced settings</label>
            </div>

            {showSettings && (
              <div className="border rounded p-4 bg-gray-50 space-y-4">

                <div>
                  <label>BMR Formula</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={bmrFormula}
                    onChange={(e) => setBmrFormula(e.target.value)}
                  >
                    <option value="mifflin">Mifflin–St Jeor</option>
                    <option value="harris">Revised Harris–Benedict</option>
                    <option value="katch">Katch–McArdle</option>
                  </select>
                </div>

                <div>
                  <label>Result Unit</label>
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        checked={resultUnit === "kcal"}
                        onChange={() => setResultUnit("kcal")}
                      />
                      Calories
                    </label>

                    <label>
                      <input
                        type="radio"
                        checked={resultUnit === "kj"}
                        onChange={() => setResultUnit("kj")}
                      />
                      kJ
                    </label>
                  </div>
                </div>

                {bmrFormula === "katch" && (
                  <div>
                    <label>Body Fat %</label>
                    <input
                      className="w-full border p-2 rounded"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded"
              >
                Calculate
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="px-8 bg-gray-200 py-4 rounded"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {results && (
          <div className="space-y-4 py-6">
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Your Daily Calorie Needs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        BMR (at rest)
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {formatValue(results.bmr)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Maintenance
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {formatValue(results.maintenance)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Goal guideline (approx.)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ±500 and ±1000 Calories/day ≈ ±0.5 kg and ±1 kg per week
                      </p>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Lose 0.5 kg/week (approx.)
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        {formatValue(results.loseHalfKg)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Lose 1 kg/week (approx.)
                      </p>
                      <p className="text-xl font-bold text-red-700">
                        {formatValue(results.loseOneKg)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Gain 0.5 kg/week (approx.)
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {formatValue(results.gainHalfKg)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Gain 1 kg/week (approx.)
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {formatValue(results.gainOneKg)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {unitLabel}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Chart */}
                <div className="h-64">
                  <Bar
                    data={{
                      labels: [
                        "BMR",
                        "Maintenance",
                        "Lose 1 kg/week",
                        "Gain 1 kg/week",
                      ],
                      datasets: [
                        {
                          label:
                            showSettings && resultUnit === "kj"
                              ? "Daily energy (kJ)"
                              : "Daily energy (Calories)",
                          data: [
                            showSettings && resultUnit === "kj"
                              ? results.bmr * KJ_PER_KCAL
                              : results.bmr,
                            showSettings && resultUnit === "kj"
                              ? results.maintenance * KJ_PER_KCAL
                              : results.maintenance,
                            showSettings && resultUnit === "kj"
                              ? results.loseOneKg * KJ_PER_KCAL
                              : results.loseOneKg,
                            showSettings && resultUnit === "kj"
                              ? results.gainOneKg * KJ_PER_KCAL
                              : results.gainOneKg,
                          ],
                          backgroundColor: [
                            CHART_COLORS.bmr,
                            CHART_COLORS.maintain,
                            CHART_COLORS.lose,
                            CHART_COLORS.gain,
                          ],
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              try {
                                return value.toLocaleString();
                              } catch {
                                return value;
                              }
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ModernCalculatorLayout>
  );
}
