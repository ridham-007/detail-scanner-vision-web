"use client";

import React from "react";
import {
  Calculator,
  Activity,
  Zap,
  Droplet,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
// import BMI from "../app/calculators/bmi"
// import { useRouter } from "next/navigation";

export default function HealthCalculators() {
  //   const router = useRouter();

  return (
    <section
      id="health-calculators"
      className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20"
      aria-labelledby="calculators-heading"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary">
              Health Tools
            </span>
          </div>

          <h2
            id="calculators-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Free Health Calculators
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your health metrics with our science-based calculators and get
            personalized insights
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          {/* ================= BMI Calculator Card ================= */}
          <Link href="/calculators/bmi">
            <article className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  BMI Calculator
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Calculate your Body Mass Index and understand if you're in a
                  healthy weight range based on your height and weight.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Instant BMI calculation</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Health category classification</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Personalized recommendations</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>Calculate Now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
            </article>
          </Link>

          <Link href="/calculators/calorie">
            <article className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  Calorie Calculator
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Determine your daily calorie needs based on your age, gender,
                  activity level, and fitness goals.
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>TDEE calculation</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Goal-based targets</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Macro breakdowns</span>
                  </li>
                </ul>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>Calculate Now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
            </article>
          </Link>

          {/* ================= Water Intake Card ================= */}
          <article
            // onClick={() => router.push("/water-calculator")}
            className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110">
                <Droplet className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-3">Water Intake</h3>

              <p className="text-muted-foreground mb-6">
                Find out how much water you should drink daily.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Personalized hydration goals
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <span>Calculate Now</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
          </article>
        </div>

        {/* FOOTER BUTTON */}
        <div className="text-center">
          <button
            // onClick={() => router.push("/calculators")}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-8 py-4 rounded-xl font-semibold text-lg"
          >
            <Calculator className="h-6 w-6" />
            <span>Show All Health Calculators</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="text-sm text-muted-foreground mt-4">
            10+ more calculators available including protein intake, ideal
            weight, body fat percentage & more
          </p>
        </div>
      </div>
    </section>
  );
}
