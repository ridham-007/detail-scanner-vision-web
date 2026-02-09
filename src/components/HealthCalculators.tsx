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
import { calculatorConfig } from "../data/calculatorConfig";
// import BMI from "../app/calculators/bmi"
// import { useRouter } from "next/navigation";

export default function HealthCalculators() {
  const calculators = Object.values(calculatorConfig).slice(0, 3);

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

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {calculators.map((calc, index) => {
            const Icon = calc.icon;

            return (
              <Link key={index} href={calc.path}>
                <article
                  className="group relative bg-card rounded-2xl p-8 border-2 border-border 
                  hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 
                  cursor-pointer overflow-hidden h-full flex flex-col"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent 
                    to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10 flex flex-col flex-grow">
                    {/* ICON */}
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 
                      rounded-2xl flex items-center justify-center mb-6 
                      group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* TITLE */}
                    <h3
                      className="text-2xl font-bold text-foreground mb-3 
                      group-hover:text-primary transition-colors"
                    >
                      {calc.title}
                    </h3>

                    {/* DESCRIPTION - FIXED HEIGHT */}
                    <p
                      className="text-muted-foreground mb-6 leading-relaxed 
                      line-clamp-3 min-h-[72px]"
                    >
                      {calc.description}
                    </p>

                    {/* BENEFITS */}
                    <ul className="space-y-2 mb-6 min-h-[100px]">
                      {calc.howToUse?.benefits?.slice(0, 3).map((b, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* BUTTON BOTTOM */}
                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        <span>Open Calculator</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-10 -right-10 w-32 h-32 
                    bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 
                    transition-colors"
                  />
                </article>
              </Link>
            );
          })}
        </div>

        {/* FOOTER BUTTON */}
        <div className="text-center pt-8">
          <Link href="/calculators">
            <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-8 py-3 rounded-xl font-semibold text-md">
              <Calculator className="h-5 w-5" />
              <span>Show All Health Calculators</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            10+ more calculators available including protein intake, ideal
            weight, body fat percentage & more
          </p>
        </div>
      </div>
    </section>
  );
}
