"use client";

import React from "react";
import {
  Calculator,
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
      className="py-14 sm:py-20"
      aria-labelledby="calculators-heading"
    >
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/82 px-4 py-2 shadow-[var(--shadow-soft)]">
            <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary">
              Health Tools
            </span>
          </div>

          <h2
            id="calculators-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4"
          >
            Free Health Calculators
          </h2>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Track your health metrics with our science-based calculators and get
            personalized insights
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {calculators.map((calc, index) => {
            const Icon = calc.icon;

            return (
              <Link key={index} href={calc.path}>
                <article
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[30px] border border-white/65 bg-white/84 p-6  transition-all duration-300 hover:-translate-y-1 hover:border-orange-200/80 hover:shadow-[var(--shadow-warm)] sm:p-8"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-transparent 
                    to-orange-50 opacity-0 transition-opacity duration-300 group-hover:opacity-80"
                  />

                  <div className="relative z-10 flex flex-col flex-grow">
                    {/* ICON */}
                    <div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#be7e59] via-[#c57e56] to-[#853d14] 
                      shadow-[var(--shadow-warm)] transition-transform duration-300 group-hover:scale-110"
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* TITLE */}
                    <h3
                      className="text-xl font-semibold tracking-tight mb-3 group-hover:text-primary transition-colors"
                    >
                      {calc.title}
                    </h3>

                    {/* DESCRIPTION - FIXED HEIGHT */}
                    <p
                      className="mb-6 text-muted-foreground leading-relaxed line-clamp-3 sm:min-h-[72px]"
                    >
                      {calc.description}
                    </p>

                    {/* BENEFITS */}
                    <ul className="mb-6 min-h-[unset] space-y-2 sm:min-h-[100px]">
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
                    bg-primary/10 rounded-full blur-xl group-hover:bg-primary/10 
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
            <button className="group relative inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-[var(--shadow-warm)] transition-transform hover:-translate-y-0.5">
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
