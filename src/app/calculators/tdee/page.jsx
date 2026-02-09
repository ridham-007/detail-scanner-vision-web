"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Activity,
  Calculator,
  AlertCircle,
  User,
  Target,
  Zap,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

import ModernCalculatorLayout from "@/components/Moderncalculatorlayout";
import { calculatorConfig } from "@/data/calculatorConfig";
import HowToUse from "@/components/calculator/HowToUse";

const CHART_COLORS = {
  trad: "#DB7AE1", // Initial deposit / main purple
  roth: "#B78BE5", // Contributions / medium purple
  taxable: "#FFADE9", // Interest / pink
  lineAlt: "#a655f7", // alternate deep purple
};

const TDEECalculator = () => {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.375");
  const [finalAmount, setFinalAmount] = useState(null);
  const [tdeeData, setTdeeData] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  // Hide results when any input changes
  useEffect(() => {
    setFinalAmount(null);
  }, [weight, height, age, gender, activity]);

  // Clear all form fields
  const clearForm = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("male");
    setActivity("1.375");
    setFinalAmount(null);
    setDataPoints([]);
    setTdeeData([]);
    toast.success("Form cleared successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!weight || !height || !age) {
      toast.error("Please fill all required fields!");
      return;
    }

    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseFloat(age);
    const activityLevels = [1.2, 1.375, 1.55, 1.725, 1.9];

    let data = [];
    for (let i = 0; i < activityLevels.length; i++) {
      let bmr;
      if (gender === "male") {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
      }
      const tdee = bmr * activityLevels[i];
      data.push({ level: i + 1, value: tdee });
    }

    setDataPoints(data);

    let bmr;
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
    }

    const tdee = bmr * parseFloat(activity);
    const maintenance = tdee;
    const weightLoss = Math.max(1200, tdee - 500);
    const extremeWeightLoss = Math.max(1200, tdee - 1000);
    const weightGain = tdee + 500;

    const activityLabels = {
      1.2: "Sedentary",
      1.375: "Lightly Active",
      1.55: "Moderately Active",
      1.725: "Very Active",
      1.9: "Extra Active",
    };

    const result = {
      bmr,
      tdee,
      maintenance,
      weightLoss,
      extremeWeightLoss,
      weightGain,
      activityLevel: activityLabels[activity],
      weight: weightInKg,
      height: heightInCm,
      age: ageInYears,
      gender,
    };

    setFinalAmount(result);

    const newTdeeData = [...tdeeData, tdee.toFixed(0)];
    if (newTdeeData.length > 10) newTdeeData.shift();
    setTdeeData(newTdeeData);

    toast.success("TDEE calculated successfully!");
  };

  const getCalorieDifference = () => {
    if (finalAmount) {
      return (finalAmount.tdee - finalAmount.bmr).toFixed(0);
    }
    return 0;
  };

  const getEarningsColor = () => {
    return "text-green-600";
  };

  const getEarningsBgColor = () => {
    return "bg-green-50 border-green-200";
  };

  const chartData = {
    labels: dataPoints.map((dp) => `Level ${dp.level}`),
    datasets: [
      {
        label: "TDEE by Activity Level",
        data: dataPoints.map((dp) => dp.value),
        borderColor: CHART_COLORS.lineAlt,
        backgroundColor: CHART_COLORS.roth + "33",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.trad,
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const historyChartData = {
    labels: Array.from({ length: tdeeData.length }, (_, i) => `Entry ${i + 1}`),
    datasets: [
      {
        label: "TDEE Calculations",
        data: tdeeData,
        borderColor: CHART_COLORS.trad,
        backgroundColor: CHART_COLORS.taxable + "33",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.lineAlt,
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const calculatorContent = (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <DollarSign className="inline h-4 w-4 mr-2 text-primary" />
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="30"
              max="300"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Activity className="inline h-4 w-4 mr-2 text-primary" />
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="50"
              max="350"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Calendar className="inline h-4 w-4 mr-2 text-primary" />
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="15"
              max="100"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <User className="inline h-4 w-4 mr-2 text-primary" />
              Gender
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Target className="inline h-4 w-4 mr-2 text-primary" />
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            >
              <option value="1.2">Sedentary (little/no exercise)</option>
              <option value="1.375">Lightly Active (1-3 days/week)</option>
              <option value="1.55">Moderately Active (3-5 days/week)</option>
              <option value="1.725">Very Active (6-7 days/week)</option>
              <option value="1.9">Extra Active (2x/day, intense)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-sm xl:text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Calculator className="h-5 w-5" />
            Calculate TDEE
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="px-8 bg-gray-100 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold text-sm xl:text-lg transition-all duration-300"
          >
            Clear
          </button>
        </div>
      </div>

      {finalAmount && (
        <div className="space-y-6 mt-6">
          <div className={`p-6 rounded-2xl border-2 ${getEarningsBgColor()}`}>
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Daily Energy Expenditure
              </div>
              <div
                className={`text-4xl font-bold text-primary ${getEarningsColor()}`}
              >
                {finalAmount.tdee.toFixed(0)} cal/day
              </div>
              <div className={`text-lg font-semibold mt-2 text-blue-600`}>
                Activity Calories: {getCalorieDifference()} cal
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Energy Expenditure Breakdown
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-medium">Basal Metabolic Rate (BMR)</span>
                <span className="text-blue-600 font-semibold">
                  {finalAmount.bmr.toFixed(0)} cal
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="font-medium">
                  Total Daily Energy Expenditure
                </span>
                <span className="text-green-600 font-semibold">
                  {finalAmount.tdee.toFixed(0)} cal
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="font-medium">Activity Level</span>
                <span className="text-purple-600 font-semibold">
                  {finalAmount.activityLevel}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="font-medium">Gender & Age</span>
                <span className="text-orange-600 font-semibold">
                  {finalAmount.gender === "male" ? "Male" : "Female"},{" "}
                  {finalAmount.age}y
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="font-medium">Body Stats</span>
                <span className="text-gray-600 font-semibold">
                  {finalAmount.weight}kg, {finalAmount.height}cm
                </span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Calorie Goals by Objective
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                <div className="font-semibold text-red-800 mb-1">
                  Extreme Loss
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {finalAmount.extremeWeightLoss.toFixed(0)}
                </div>
                <div className="text-sm text-red-600">-2 lbs/week</div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                <div className="font-semibold text-orange-800 mb-1">
                  Weight Loss
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {finalAmount.weightLoss.toFixed(0)}
                </div>
                <div className="text-sm text-orange-600">-1 lb/week</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                <div className="font-semibold text-blue-800 mb-1">
                  Maintenance
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {finalAmount.maintenance.toFixed(0)}
                </div>
                <div className="text-sm text-blue-600">Current weight</div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <div className="font-semibold text-green-800 mb-1">
                  Weight Gain
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {finalAmount.weightGain.toFixed(0)}
                </div>
                <div className="text-sm text-green-600">+1 lb/week</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataPoints.length > 0 && (
              <div className="bg-card border border-border/50 p-4 sm:p-6 rounded-2xl overflow-hidden w-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  TDEE by Activity Level
                </h3>
                <div className="h-64 sm:h-64 flex items-center justify-center">
                  <Line data={chartData} options={{ responsive: true }} />
                </div>
              </div>
            )}

            {tdeeData.length > 0 && (
              <div className="bg-card border border-border/50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  TDEE Calculation History
                </h3>
                <div className="h-64 sm:h-64 flex items-center justify-center">
                  <Line
                    data={historyChartData}
                    options={{ responsive: true }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
  const tdeeConfig = calculatorConfig.tdee;
  return (
    <ModernCalculatorLayout
      title={tdeeConfig.title}
      description={tdeeConfig.description}
      icon={Activity}
      path={tdeeConfig.path}
      details={tdeeConfig.details}
      faq={tdeeConfig.faqs}
      howToUse={<HowToUse {...tdeeConfig.howToUse} />}
    >
      {calculatorContent}
    </ModernCalculatorLayout>
  );
};

export default TDEECalculator;
