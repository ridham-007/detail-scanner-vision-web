"use client";
import React, { useState, useEffect } from "react";
import { Baby, Calendar, Clock, AlertCircle, Calculator } from "lucide-react";
import { toast } from "sonner";
import ScheduleModal from "../../components/ui/ScheduleModal";

const MAX_DATE = "2028-12-31";

// ---------- Helpers ----------
const days = (n: number): number => n * 24 * 60 * 60 * 1000;
const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

const fmt = (d: Date): string =>
  d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// calendar-months + days diff
type MonthDayDiff = {
  months: number;
  days: number;
};

const diffMonthsDays = (start: Date, end: Date): MonthDayDiff => {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  let daysLeft = end.getDate() - start.getDate();

  if (daysLeft < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    daysLeft += prevMonth.getDate();
    months -= 1;
  }

  return { months, days: daysLeft };
};

// ---------- TYPES ----------
interface TableRow {
  week: number;
  start: Date;
  end: Date;
  trimesterLabel: string;
  milestone?: string;
  isCurrent: boolean;
}

interface ResultType {
  dueDate: string;
  dueDateRaw: Date;
  lmpDate: Date;
  currentWeek: number;
  currentDay: number;
  remainingWeeks: number;
  remainingDays: number;
  trimester: number;
  progressPercentage: number;
  nextMilestone?: { week: number; event: string };
  isOverdue: boolean;
  daysSinceLMP: number;
  conceptionDate: Date;
  table: TableRow[];
}

// ---------- DATA ----------
const milestoneMap: Record<number, string> = {
  4: "Missed period",
  5: "Pregnancy test positive",
  6: "Heartbeat detectable by ultrasound",
  8: "Major organs form",
  12: "End of first trimester",
  13: "Second trimester begins",
  16: "Gender may be determined",
  20: "Halfway point",
  24: "Viability milestone",
  28: "Third trimester begins",
  32: "Baby gaining fat",
  34: "Premature baby may survive",
  37: "Full Term",
  40: "Due week",
};

// ---------- FETAL DATA ----------
type FetalInfo = {
  in: number;
  cm: number;
  lb: number;
  g: number;
};

const fetalDataByWeek: Record<number, FetalInfo> = {
  12: { in: 2.13, cm: 5.4, lb: 0.14, g: 64 },
  13: { in: 2.91, cm: 7.4, lb: 0.18, g: 81 },
  14: { in: 3.42, cm: 8.7, lb: 0.25, g: 113 },
  15: { in: 3.98, cm: 10.1, lb: 0.31, g: 141 },
  16: { in: 4.57, cm: 11.6, lb: 0.35, g: 158 },
  17: { in: 5.12, cm: 13.0, lb: 0.44, g: 200 },
  18: { in: 5.59, cm: 14.2, lb: 0.5, g: 227 },
  19: { in: 6.02, cm: 15.3, lb: 0.6, g: 273 },
  20: { in: 6.46, cm: 16.4, lb: 0.72, g: 326 },
  21: { in: 10.51, cm: 26.7, lb: 0.88, g: 398 },
  22: { in: 11.02, cm: 28.0, lb: 1.02, g: 460 },
  23: { in: 11.38, cm: 28.9, lb: 1.1, g: 501 },
  24: { in: 11.81, cm: 30.0, lb: 1.32, g: 600 },
  25: { in: 13.62, cm: 34.6, lb: 1.46, g: 662 },
  26: { in: 14.02, cm: 35.6, lb: 1.68, g: 760 },
  27: { in: 14.41, cm: 36.6, lb: 1.93, g: 875 },
  28: { in: 14.8, cm: 37.6, lb: 2.22, g: 1005 },
  29: { in: 15.2, cm: 38.6, lb: 2.54, g: 1152 },
  30: { in: 15.71, cm: 39.9, lb: 2.91, g: 1320 },
  31: { in: 16.18, cm: 41.1, lb: 3.31, g: 1502 },
  32: { in: 16.69, cm: 42.4, lb: 3.75, g: 1702 },
  33: { in: 17.2, cm: 43.7, lb: 4.23, g: 1918 },
  34: { in: 17.72, cm: 45.0, lb: 4.73, g: 2146 },
  35: { in: 18.19, cm: 46.2, lb: 5.25, g: 2383 },
  36: { in: 18.66, cm: 47.4, lb: 5.78, g: 2622 },
  37: { in: 19.13, cm: 48.6, lb: 6.3, g: 2859 },
  38: { in: 19.61, cm: 49.8, lb: 6.8, g: 3083 },
  39: { in: 19.96, cm: 50.7, lb: 7.25, g: 3288 },
  40: { in: 20.16, cm: 51.2, lb: 7.63, g: 3462 },
};


const PregnancyCalculator: React.FC = () => {
  const [calcType, setCalcType] = useState<string>("lmp");
  const [inputDate, setInputDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [ultraWeeks, setUltraWeeks] = useState<string>("12");
  const [ultraDays, setUltraDays] = useState<string>("0");
  const [embryoAge, setEmbryoAge] = useState<string>("5");

  const [results, setResults] = useState<ResultType | null>(null);

  useEffect(() => {
    setResults(null);
  }, [calcType, inputDate, cycleLength, ultraWeeks, ultraDays, embryoAge]);

  // ---------- BUILD TABLE ----------
  const buildWeeksTable = (
    lmpDate: Date,
    currentGAinDays: number,
  ): TableRow[] => {
    const table: TableRow[] = [];

    for (let wk = 1; wk <= 40; wk++) {
      const start = new Date(lmpDate.getTime() + days((wk - 1) * 7));
      const end = new Date(lmpDate.getTime() + days(wk * 7 - 1));

      const trimesterLabel = wk <= 12 ? "first" : wk <= 27 ? "second" : "third";

      const milestone = milestoneMap[wk];

      const isCurrent =
        Math.floor(currentGAinDays / 7) + 1 === wk &&
        currentGAinDays >= 0 &&
        currentGAinDays <= 280;

      table.push({
        week: wk,
        start,
        end,
        trimesterLabel,
        milestone,
        isCurrent,
      });
    }

    return table;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDate) return;

    const baseDate = new Date(inputDate);
    let lmpDate: Date;

    switch (calcType) {
      case "due":
        lmpDate = new Date(baseDate.getTime() - days(280));
        break;

      case "conception":
        lmpDate = new Date(baseDate.getTime() - days(14));
        break;

      case "ultrasound": {
        const w = clamp(parseInt(ultraWeeks || "0", 10), 0, 45);
        const d = clamp(parseInt(ultraDays || "0", 10), 0, 6);
        const gaDays = w * 7 + d;
        lmpDate = new Date(baseDate.getTime() - days(gaDays));
        break;
      }

      case "ivf": {
        const addDays = embryoAge === "3" ? 263 : embryoAge === "5" ? 261 : 260;

        const edd = new Date(baseDate.getTime() + days(addDays));
        lmpDate = new Date(edd.getTime() - days(280));
        break;
      }

      default:
        lmpDate = baseDate;
    }

    let due = new Date(lmpDate.getTime() + days(280));

    if (calcType === "lmp") {
      const diff = clamp(parseInt(cycleLength || "28", 10), 20, 45) - 28;

      due = new Date(due.getTime() + days(diff));
    }

    const today = new Date();

    const daysElapsed = Math.floor(
      (today.getTime() - lmpDate.getTime()) / days(1),
    );

    const weeksElapsed = Math.floor(daysElapsed / 7);
    const daysInCurrentWeek = ((daysElapsed % 7) + 7) % 7;

    const remainingDays = Math.max(0, 280 - daysElapsed);
    const remainingWeeks = Math.max(0, 40 - weeksElapsed);

    const progressPercentage = Math.min(
      100,
      Math.max(0, (daysElapsed / 280) * 100),
    );

    let trimester = 1;
    if (weeksElapsed >= 13) trimester = 2;
    if (weeksElapsed >= 27) trimester = 3;

    const milestones = [
      { week: 4, event: "Missed period" },
      { week: 6, event: "Heart starts beating" },
      { week: 8, event: "Major organs form" },
      { week: 12, event: "End of first trimester" },
      { week: 16, event: "Gender can be determined" },
      { week: 20, event: "Halfway point" },
      { week: 24, event: "Viability milestone" },
      { week: 28, event: "Third trimester begins" },
      { week: 37, event: "Full term" },
    ];

    const nextMilestone = milestones.find((m) => m.week > weeksElapsed);

    const conceptionDate = new Date(due.getTime() - days(266));

    const table = buildWeeksTable(lmpDate, daysElapsed);

    const resultData: ResultType = {
      dueDate: due.toLocaleDateString(),
      dueDateRaw: due,
      lmpDate,
      currentWeek: weeksElapsed,
      currentDay: daysInCurrentWeek,
      remainingWeeks,
      remainingDays,
      trimester,
      progressPercentage,
      nextMilestone,
      isOverdue: daysElapsed > 280,
      daysSinceLMP: daysElapsed,
      conceptionDate,
      table,
    };

    setResults(resultData);
    toast.success("Calculation successful!");
  };

  const clearForm = () => {
    setCalcType("lmp");
    setInputDate("");
    setCycleLength("28");
    setUltraWeeks("12");
    setUltraDays("0");
    setEmbryoAge("5");
    setResults(null);

    toast.success("Form cleared successfully!");
  };

  const getTrimesterColor = (): string => {
    if (!results) return "text-primary";
    if (results.trimester === 1) return "text-blue-600";
    if (results.trimester === 2) return "text-green-600";
    return "text-purple-600";
  };

  const getTrimesterBgColor = (): string => {
    if (!results) return "bg-primary/10 border-primary/20";
    if (results.trimester === 1) return "bg-blue-50 border-blue-200";
    if (results.trimester === 2) return "bg-green-50 border-green-200";
    return "bg-purple-50 border-purple-200";
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Calculate Based On */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Calculate Based On
          </label>
          <select
            value={calcType}
            aria-label="Calculate Based On"
            onChange={(e) => setCalcType(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            required
          >
            <option value="lmp">Last Period</option>
            <option value="due">Due Date</option>
            <option value="conception">Conception Date</option>
            <option value="ultrasound">Ultrasound</option>
            <option value="ivf">IVF Transfer Date</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        {calcType === "lmp" && (
          <>
            <div>
              <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                <Calendar className="inline h-4 w-4 mr-2 text-primary" />
                First Day of Your Last Period
              </label>
              <input
                type="date"
                aria-label="First Day of Your Last Period"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                min={"2010-01-01"}
                max={MAX_DATE}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Average Length of Your Cycles
              </label>
              <select
                value={cycleLength}
                aria-label="Average Length of Your Cycles"
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                required
              >
                {Array.from({ length: 26 }, (_, i) => 20 + i).map((d) => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {calcType === "due" && (
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Calendar className="inline h-4 w-4 mr-2 text-primary" />
              Your Due Date
            </label>
            <input
              type="date"
              aria-label="Your Due Date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              required
              min={"2010-01-01"}
              max={MAX_DATE}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>
        )}

        {calcType === "conception" && (
          <div>
            <label className="flex items-center text-sm font-semibold text-foreground mb-3">
              <Calendar className="inline h-4 w-4 mr-2 text-primary" />
              Conception Date
            </label>
            <input
              type="date"
              aria-label="Conception Date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              required
              min={"2010-01-01"}
              max={MAX_DATE}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>
        )}

        {calcType === "ultrasound" && (
          <>
            <div>
              <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                <Calendar className="inline h-4 w-4 mr-2 text-primary" />
                Ultrasound Date
              </label>
              <input
                type="date"
                aria-label="Ultrasound Date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                min={"2010-01-01"}
                max={MAX_DATE}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Length of Pregnancy at the Time (weeks)
                </label>
                <input
                  type="number"
                  aria-label="Length of Pregnancy at the Time (weeks)"
                  inputMode="numeric"
                  min={0}
                  max={45}
                  value={ultraWeeks}
                  onChange={(e) => setUltraWeeks(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Days (0–6)
                </label>
                <input
                  type="number"
                  aria-label="Days (0–6)"
                  inputMode="numeric"
                  min={0}
                  max={6}
                  value={ultraDays}
                  onChange={(e) => setUltraDays(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                />
              </div>
            </div>
          </>
        )}

        {calcType === "ivf" && (
          <>
            <div>
              <label className="flex items-center text-sm font-semibold text-foreground mb-3">
                <Calendar className="inline h-4 w-4 mr-2 text-primary" />
                Transfer Date
              </label>
              <input
                type="date"
                aria-label="Transfer Date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                min={"2010-01-01"}
                max={MAX_DATE}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Embryo Age
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="embryoAge"
                    value="3"
                    checked={embryoAge === "3"}
                    onChange={() => setEmbryoAge("3")}
                    required
                  />
                  <span>day 3</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="embryoAge"
                    value="5"
                    checked={embryoAge === "5"}
                    onChange={() => setEmbryoAge("5")}
                    required
                  />
                  <span>day 5</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="embryoAge"
                    value="6"
                    checked={embryoAge === "6"}
                    onChange={() => setEmbryoAge("6")}
                    required
                  />
                  <span>day 6</span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
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
      </form>

      {/* RESULTS */}
      {results && (
        <div className="space-y-6">
          {/* ================= SUMMARY BLOCK ================= */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <p className="text-xl text-primary font-semibold mb-2">
              You are currently at week #{Math.max(0, results.currentWeek)} (
              {Math.max(0, results.currentWeek)} weeks {results.currentDay} days
              or {diffMonthsDays(results.lmpDate, new Date()).months} months{" "}
              {diffMonthsDays(results.lmpDate, new Date()).days} days) of
              pregnancy.
            </p>

            <p className="mb-1">
              The estimated due date is{" "}
              <span className="font-semibold">{fmt(results.dueDateRaw)}</span>.
            </p>

            <p className="mb-1">
              You are in the{" "}
              <span className="font-semibold">
                {results.trimester === 1
                  ? "first"
                  : results.trimester === 2
                    ? "second"
                    : "third"}
              </span>{" "}
              trimester.
            </p>

            {/* ===== BABY SIZE INFO ===== */}
            {fetalDataByWeek[
              Math.max(12, Math.min(40, Math.max(0, results.currentWeek)))
            ] && (
              <p className="mb-1">
                On average, your baby is around{" "}
                <span className="font-semibold">
                  {fetalDataByWeek[
                    Math.max(12, Math.min(40, Math.max(0, results.currentWeek)))
                  ].in.toFixed(2)}{" "}
                  inches (
                  {fetalDataByWeek[
                    Math.max(12, Math.min(40, Math.max(0, results.currentWeek)))
                  ].cm.toFixed(1)}{" "}
                  cm)
                </span>{" "}
                long and weighs around{" "}
                <span className="font-semibold">
                  {fetalDataByWeek[
                    Math.max(12, Math.min(40, Math.max(0, results.currentWeek)))
                  ].lb.toFixed(1)}{" "}
                  pounds (
                  {
                    fetalDataByWeek[
                      Math.max(
                        12,
                        Math.min(40, Math.max(0, results.currentWeek)),
                      )
                    ].g
                  }{" "}
                  grams)
                </span>
                .
              </p>
            )}

            <p className="mb-2">
              Your baby was likely conceived on{" "}
              <span className="font-semibold">
                {fmt(results.conceptionDate)}
              </span>
              .
            </p>
          </div>

          {/* ================ PROGRESS CARD ================ */}
          <div className={`p-6 rounded-2xl border-2 ${getTrimesterBgColor()}`}>
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Current Progress
              </div>

              <div
                className={`text-4xl font-bold text-primary ${getTrimesterColor()}`}
              >
                {results.currentWeek}w {results.currentDay}d
              </div>

              <div
                className={`text-lg font-semibold mt-2 ${getTrimesterColor()}`}
              >
                Trimester {results.trimester}
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${results.progressPercentage}%` }}
                  ></div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {results.progressPercentage.toFixed(1)}% complete
                </p>
              </div>
            </div>
          </div>

          {/* ============== DUE DATE + DAYS SINCE ============== */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Due Date
                </div>

                <div className="text-2xl text-primary font-bold">
                  {results.dueDate}
                </div>

                {results.isOverdue ? (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                    Overdue
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    {results.remainingDays} days remaining
                  </p>
                )}
              </div>
            </div>

            {/* Days Since LMP */}
            <div className="bg-card border border-border/50 p-6 rounded-2xl">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Days Since LMP
                </div>

                <div className="text-2xl text-primary font-bold">
                  {results.daysSinceLMP}
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  Total days elapsed
                </p>
              </div>
            </div>
          </div>

          {/* ============== NEXT MILESTONE ============== */}
          {results.nextMilestone && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Next Milestone
              </h3>

              <p className="font-medium">
                Week {results.nextMilestone.week}: {results.nextMilestone.event}
              </p>
            </div>
          )}

          {/* ============== TRIMESTER INFO ============== */}
          <div className="bg-secondary/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Trimester Information
            </h3>

            <div className="space-y-3">
              {/* 1st */}
              <div
                className={`flex justify-between items-center p-4 rounded-lg ${
                  results.trimester === 1
                    ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div>
                  <span className="font-medium text-primary">
                    1st Trimester
                  </span>
                  <div className="text-sm text-primary">Weeks 1–12</div>
                </div>
                <span className="text-primary font-semibold">Formation</span>
              </div>

              {/* 2nd */}
              <div
                className={`flex justify-between items-center p-4 rounded-lg ${
                  results.trimester === 2
                    ? "bg-green-50 border-2 border-green-300 shadow-sm"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <div>
                  <span className="font-medium text-green-900">
                    2nd Trimester
                  </span>
                  <div className="text-sm text-green-700">Weeks 13–27</div>
                </div>
                <span className="text-green-600 font-semibold">Growth</span>
              </div>

              {/* 3rd */}
              <div
                className={`flex justify-between items-center p-4 rounded-lg ${
                  results.trimester === 3
                    ? "bg-purple-50 border-2 border-purple-300 shadow-sm"
                    : "bg-purple-50 border border-purple-200"
                }`}
              >
                <div>
                  <span className="font-medium text-purple-900">
                    3rd Trimester
                  </span>
                  <div className="text-sm text-purple-700">Weeks 28–40</div>
                </div>
                <span className="text-purple-600 font-semibold">
                  Maturation
                </span>
              </div>
            </div>
          </div>

          {/* Week-by-Week Table */}
          {results.table && (
            <div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary">
                  Week-by-Week Schedule
                </h3>
                <p className="text-sm text-muted-foreground">
                  You are currently at week #{Math.max(0, results.currentWeek)}{" "}
                  ({Math.max(0, results.currentWeek)} weeks {results.currentDay}{" "}
                  days).
                </p>
              </div>
              <div className="flex flex-wrap gap-3 p-4 justify-center">
                <ScheduleModal
                  triggerLabel="Schedule"
                  triggerIcon={Calendar}
                  title="Schedule"
                  fullWidth
                  headers={[
                    "Week",
                    "Dates",
                    "Trimester",
                    "Important Milestones",
                  ]}
                  rows={results.table.map((row) => ({
                    week: row.week,
                    dates: `${fmt(row.start)} – ${fmt(row.end)}`,
                    trimester: row.trimesterLabel,
                    milestones: row.milestone,
                  }))}
                  format={() => {}}
                />
              </div>
              <div className="p-4  text-xs text-muted-foreground">
                Note: This schedule is for a single pregnancy; dates are
                estimates.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PregnancyCalculator;
