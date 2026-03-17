"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { calculatorConfig } from "../../data/calculatorConfig";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AllCalculatorsPage() {
  const calculators = Object.values(calculatorConfig);

  return (
    <section className="min-h-screen py-20">
      <div className="container mx-auto px-4">

        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "All Calculators" },
            ]}
          />
        </div>

        {/* HEADER */}
        <header className="mb-16 rounded-[32px] border border-white/60 bg-white/82 px-6 py-10 text-center shadow-product backdrop-blur-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              All Tools
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            All Health Calculators
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of science-based calculators to
            track your health, fitness and wellness goals.
          </p>
        </header>

        {/* CALCULATOR GRID */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {calculators.map((calc, index) => {
            const Icon = calc.icon;

            return (
              <Link key={index} href={calc.path}>
                <article
                  className="group relative h-full cursor-pointer overflow-hidden rounded-[30px] border border-white/70
                  bg-white/90 p-8 shadow-product transition-all duration-300 hover:border-orange-200/80 hover:shadow-[var(--shadow-warm)]
                  cursor-pointer overflow-hidden h-full flex flex-col"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent 
                    to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10 flex flex-col flex-grow">
                    {/* ICON */}
                    <div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary
                      shadow-[var(--shadow-warm)] group-hover:scale-110 transition-transform duration-300"
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* TITLE */}
                    <span className="text-2xl font-bold text-foreground mb-3 
                      group-hover:text-primary transition-colors">
                      {calc.title}
                    </span>

                    {/* DESCRIPTION - FIXED HEIGHT */}
                    <p className="text-muted-foreground mb-6 leading-relaxed 
                      line-clamp-3 min-h-[72px]">
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
                    bg-orange-100/70 rounded-full blur-2xl group-hover:bg-orange-200/70
                    transition-colors"
                  />
                </article>
              </Link>
            );
          })}
        </div>

        {/* BOTTOM INFO */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            More calculators coming soon including protein intake, ideal weight,
            body fat percentage & wellness tools
          </p>
        </div>
      </div>
    </section>
  );
}
