"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Scan,
  TrendingUp,
  Brain,
  History,
  User,
  Settings,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  ChevronRight,
  Search,
  Heart,
  Calculator,
  PlusCircle,
  ListOrdered,
  Zap,
  ShieldCheck,
  Trophy,
  Bolt,
  Clock,
  Star,
  ChevronUp,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    description: "Learn the basics of EaterIQ and how to make the most of your nutrition companion."
  },
  {
    id: "food-scanner",
    title: "Food Scanner",
    icon: <Scan className="h-6 w-6 text-primary" />,
    description: "How to scan products and understand the health scores and analysis."
  },
  {
    id: "food-battle",
    title: "Food Battle",
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    description: "Compare products side-by-side to find the healthiest options for your diet."
  },
  {
    id: "health-quizzes",
    title: "Health Quizzes",
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    description: "Test your knowledge and learn about nutrition through interactive quizzes."
  },
  {
    id: "history-profile",
    title: "History & Profile",
    icon: <User className="h-6 w-6 text-orange-500" />,
    description: "Manage your scan history, favorite products, and account settings."
  },
  {
    id: "alternatives",
    title: "Healthier Alternatives",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "Discover better options for your favorite products automatically."
  },
  {
    id: "calculators",
    title: "Health Tools",
    icon: <Calculator className="h-6 w-6 text-teal-500" />,
    description: "Use our nutrition calculators to track BMI, calories, and more."
  },
  {
    id: "contributions",
    title: "Community",
    icon: <PlusCircle className="h-6 w-6 text-indigo-500" />,
    description: "Help grow the database by contributing new product data."
  },
  {
    id: "shopping-lists",
    title: "Shopping Lists",
    icon: <ListOrdered className="h-6 w-6 text-green-500" />,
    description: "Organize your healthy groceries and plan your next store visit."
  },
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    icon: <BookOpen className="h-6 w-6 text-pink-500" />,
    description: "Dive deep into nutrition science through our blog and cheat sheets."
  }
];

const scoreLevels = [
  { label: "Excellent", range: "80–100", score: "100", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-100", description: "Minimal additives, high nutritional value, and clean ingredients." },
  { label: "Good", range: "60–79", score: "79", color: "bg-yellow-400", textColor: "text-yellow-700", bgColor: "bg-yellow-50", borderColor: "border-yellow-100", description: "Generally healthy with some minor nutritional concerns." },
  { label: "Fair", range: "40–59", score: "59", color: "bg-orange-400", textColor: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-100", description: "Contains several concerning ingredients or low nutritional density." },
  { label: "Poor", range: "0–39", score: "39", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-100", description: "High in harmful additives, sugar, or ultra-processed ingredients." }
];

export default function UserGuidePage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">

        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium" aria-current="page">User Guide</li>
          </ol>
        </nav>

        {/* ── HERO HEADER ── */}
        {/* ── HERO HEADER ── */}
        <header className="mb-12 pt-4 pb-2 text-center">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Live Product Guide</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            Your Complete{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              User Guide
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Step-by-step playbooks to scan smarter, compare foods, and turn every grocery trip into healthier choices.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button
              onClick={() => scrollToSection("getting-started")}
              size="lg"
              className="w-full sm:w-auto rounded-full px-10 h-12 text-base font-bold shadow-lg shadow-primary/20"
            >
              Start in 3 Steps <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Link href="/support" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-10 h-12 text-base font-bold"
              >
                Talk to Support
              </Button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              10,000+ scans guided
            </div>
            <span className="text-border hidden sm:inline">•</span>
            <span>Updated for the latest E-numbers and nutrition science.</span>
          </div>
        </header>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Mobile sticky tab-bar */}
          <div className="lg:hidden sticky top-[56px] z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50 mb-8">
            <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar snap-x scroll-smooth">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold whitespace-nowrap snap-start hover:bg-primary/10 shadow-sm"
                >
                  <div className="text-primary">
                    {React.cloneElement(section.icon as React.ReactElement, { className: "h-3.5 w-3.5" })}
                  </div>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop sticky sidebar */}
          <aside className="lg:col-span-1 hidden lg:block animate-fade-in">
            <div className="sticky top-24 space-y-1 p-2 rounded-2xl bg-muted/30 border border-border shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3 mt-2 ml-4">
                Table of Contents
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white dark:hover:bg-background hover:shadow-sm text-muted-foreground hover:text-primary group text-left"
                >
                  <div className="transition-transform group-hover:scale-110 shrink-0">
                    {React.cloneElement(section.icon as React.ReactElement, { className: "h-4 w-4" })}
                  </div>
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* ── GUIDE CONTENT ── */}
          <div className="lg:col-span-3 space-y-24 max-w-4xl animate-fade-in">

            {/* ── 1. GETTING STARTED ── */}
            <section id="getting-started" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Getting Started</h2>
              </div>

              <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <p className="text-base leading-relaxed mb-8 font-medium text-foreground/80">
                  Welcome back! Maximize your <span className="text-primary font-bold">EaterIQ</span> experience with these three essential steps:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { step: 1, title: "Dietary Profile", desc: "Configure your needs in Settings for smart alerts.", icon: <User className="h-4 w-4" /> },
                    { step: 2, title: "Instant Scan", desc: "Point at any barcode for deep nutrition analysis.", icon: <Scan className="h-4 w-4" /> },
                    { step: 3, title: "Smart Swap", desc: "Identify better choices with our AI alternative engine.", icon: <TrendingUp className="h-4 w-4" /> }
                  ].map((item) => (
                    <div key={item.step} className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100 hover:border-yellow-200 transition-all hover:bg-yellow-50/80 relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 bg-yellow-200 text-yellow-700 rounded-xl flex items-center justify-center shadow-sm">
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-sm text-yellow-900">{item.title}</h4>
                      </div>
                      <p className="text-sm text-yellow-800/80 leading-relaxed font-medium">{item.desc}</p>
                      <div className="absolute top-3 right-4 text-lg font-black text-yellow-200">{item.step}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm text-primary/80 font-semibold">Privacy First: Your data stays locally on your device.</p>
                </div>
              </div>
            </section>

            {/* ── 2. FOOD SCANNER ── */}
            <section id="food-scanner" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/5 rounded-2xl shadow-sm border border-primary/10">
                  <Scan className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Food Scanner</h2>
              </div>

              <div className="space-y-10">
                {/* How to Analyze */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-5">How to Analyze</h3>
                    <div className="space-y-4">
                      {[
                        { s: 1, t: "Grant Permissions", d: "Enable camera access for instant scanning." },
                        { s: 2, t: "Point & Scan", d: "Hover over barcodes or ingredients labels." },
                        { s: 3, t: "Get Insights", d: "View scores, warnings, and alternatives." }
                      ].map((step) => (
                        <div key={step.s} className="flex gap-4 items-start p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm shadow-primary/20">
                            {step.s}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{step.t}</p>
                            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{step.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scanner mockup */}
                  <div className="order-1 md:order-2 bg-gradient-to-br from-muted/50 to-muted p-8 rounded-[2rem] border border-border/50 flex items-center justify-center">
                    <div className="relative w-full max-w-[200px] aspect-[9/16] bg-card rounded-[2rem] border-[4px] border-foreground/10 overflow-hidden shadow-xl">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <div className="relative mb-4">
                          <Scan className="h-12 w-12 text-primary animate-pulse" />
                          <div className="absolute -inset-3 bg-primary/15 blur-xl -z-10 rounded-full" />
                        </div>
                        <p className="text-xs font-black uppercase text-foreground tracking-wider">Scanner Active</p>
                        <div className="w-4/5 h-0.5 bg-primary/30 rounded-full mt-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Score Key */}
                <div>
                  <h3 className="text-xl font-bold mb-5">Global Health Scores</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scoreLevels.map((level) => (
                      <div key={level.label} className={`p-5 rounded-2xl border ${level.bgColor} ${level.borderColor} flex items-start gap-4`}>
                        <div className={`w-12 h-12 rounded-xl ${level.color} flex items-center justify-center text-white font-black text-base shrink-0`}>
                          {level.score}
                        </div>
                        <div>
                          <h4 className={`font-bold text-base mb-1 ${level.textColor}`}>{level.label}</h4>
                          <p className="text-sm text-foreground/70 leading-relaxed">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. FOOD BATTLE ── */}
            <section id="food-battle" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Food Battle</h2>
              </div>

              <div className="bg-blue-50 rounded-3xl p-6 md:p-10 relative overflow-hidden border border-blue-100 mb-6 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge className="bg-blue-100 text-blue-700 border-none py-1 px-3 text-xs font-bold uppercase tracking-widest">
                      VS Mode Engaged
                    </Badge>
                    <h4 className="font-black text-2xl md:text-3xl text-blue-900 leading-tight">Nutrient Duel</h4>
                    <p className="text-sm md:text-base text-blue-700 leading-relaxed font-medium">
                      Compare macros and additives head-to-head. Our AI selects the definitive winner.
                    </p>

                    <div className="flex items-center gap-6 bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-blue-200 shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-700 text-lg border border-blue-200 shadow-sm">A</div>
                        <span className="text-2xl font-black text-blue-300 italic uppercase tracking-tight">vs</span>
                        <div className="relative">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 text-lg shadow-md">B</div>
                          <div className="absolute -top-3 -right-3 h-5 px-2 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center shadow border-2 border-white">WIN</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block space-y-4">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Pro Features</p>
                    <ul className="space-y-4 list-none pl-0">
                      {["Direct Nutrient Comparison", "15+ Health Parameters", "Smart Highlight Engine"].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-blue-800">
                          <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 text-sm mb-2 text-blue-900">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Daily Limits
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Free users get <strong>3 battles per day</strong>. Upgrade to <strong>Pro</strong> for unlimited comparisons.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-muted/50 border border-border shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 text-sm mb-2 text-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    Green Highlights
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We highlight the winning nutrient in <strong className="text-foreground">green</strong> — lower for sugars, higher for protein.
                  </p>
                </div>
              </div>
            </section>

            {/* ── 4. HEALTH QUIZZES ── */}
            <section id="health-quizzes" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 rounded-2xl shadow-sm border border-purple-100">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Health Quizzes</h2>
              </div>

              {/* Lifelines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: <Zap className="h-5 w-5" />, title: "50:50", desc: "Removes 2 wrong answers to simplify your choice.", iconBg: "bg-purple-100", iconColor: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
                  { icon: <Bolt className="h-5 w-5" />, title: "Skip", desc: "Jump to the next question without a penalty.", iconBg: "bg-blue-100", iconColor: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                  { icon: <Clock className="h-5 w-5" />, title: "Time+", desc: "Add 15 seconds back to the countdown timer.", iconBg: "bg-amber-100", iconColor: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" }
                ].map((lifeline) => (
                  <div key={lifeline.title} className={`p-5 rounded-2xl border ${lifeline.bg} ${lifeline.border} flex items-start gap-4 hover:shadow-sm transition-shadow`}>
                    <div className={`p-2.5 ${lifeline.iconBg} rounded-xl ${lifeline.iconColor} shrink-0 shadow-sm`}>
                      {lifeline.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-foreground">{lifeline.title}</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{lifeline.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="bg-muted/30 border border-border/50 rounded-3xl p-6 md:p-8">
                <h4 className="font-bold mb-4 text-base text-foreground tracking-tight">Quiz Categories</h4>
                <div className="flex flex-wrap gap-2.5">
                  {["Nutrition Basics", "Food Safety", "Vitamins & Minerals", "Food Labels", "Superfoods", "Diet Myths"].map((cat) => (
                    <Badge key={cat} variant="outline" className="border-purple-200 text-purple-700 bg-white text-sm py-1.5 px-4 rounded-lg shadow-sm font-medium">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 5. HISTORY & PROFILE ── */}
            <section id="history-profile" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-orange-50 rounded-2xl shadow-sm border border-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">History & Profile</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 bg-card border border-orange-100 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold mb-2 text-foreground">Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Set your diet in Settings for targeted scanning alerts.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Vegan", "Halal", "Keto"].map((opt) => (
                        <Badge key={opt} className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1 text-sm rounded-full font-medium">
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-card border border-red-100 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold mb-2 text-foreground">Allergies</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Identify critical triggers before you buy. Warnings appear instantly on scan.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Nuts", "Dairy", "Soy"].map((opt) => (
                        <Badge key={opt} className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 py-1 text-sm rounded-full font-medium">
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-orange-900 font-bold text-base mb-1">Exclusive Pro Tools</h4>
                    <p className="text-sm text-orange-700 leading-relaxed">Unlimited history, deep reports, and ad-free labeling.</p>
                  </div>
                  <Link href="/pricing" className="w-full md:w-auto">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold px-8 h-11">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ── 6. HEALTHIER ALTERNATIVES ── */}
            <section id="alternatives" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Healthier Alternatives</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
                  <h4 className="font-black text-sm uppercase tracking-widest text-red-600 mb-4">AI Smart Swaps</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Instantly find products in the same category with cleaner labels and better nutritional metrics.
                  </p>
                  <ul className="space-y-4 list-none pl-0">
                    {[
                      { t: "Higher Scores", d: "Average +25 point health score boost." },
                      { t: "Clean Label", d: "Safe, verified additives only." },
                      { t: "Goal Match", d: "Tailored to your low-sugar or low-sodium goals." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.t}</p>
                          <p className="text-sm text-muted-foreground">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-red-100 text-red-700 border-none text-xs font-bold">Smart Reco</Badge>
                      <Star className="h-5 w-5 fill-red-400 text-red-400" />
                    </div>
                    <h4 className="text-2xl font-black mb-2 text-red-900">The Winner</h4>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Tap any alternative to see exactly why it beats your original scan.
                    </p>
                  </div>
                  <div className="mt-8 relative z-10">
                    <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-3/4" />
                    </div>
                    <p className="text-xs text-red-500 mt-2 uppercase font-bold tracking-widest">Score Accuracy: 99%</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 7. HEALTH TOOLS ── */}
            <section id="calculators" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-teal-50 rounded-2xl shadow-sm border border-teal-100">
                  <Calculator className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Health Tools</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { name: "BMI Tool", desc: "Check your body mass index." },
                  { name: "TDEE", desc: "Calculate your daily energy needs." },
                  { name: "Macro Tracker", desc: "Balance your protein and carbs." },
                  { name: "Water Intake", desc: "Track daily hydration goals." },
                  { name: "Goals", desc: "Set and monitor target weights." },
                  { name: "Wellness Tips", desc: "Personalised daily health advice." }
                ].map((calc, i) => (
                  <div key={i} className="p-5 bg-card border border-border/50 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                    <h4 className="font-bold text-sm mb-1.5 group-hover:text-teal-600 text-foreground">{calc.name}</h4>
                    <p className="text-sm text-muted-foreground leading-snug">{calc.desc}</p>
                  </div>
                ))}
              </div>

              <Link href="/calculators" className="block text-center mt-4">
                <Button variant="outline" className="w-full md:w-auto h-12 rounded-xl border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold text-sm px-8">
                  Launch All Tools <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </section>

            {/* ── 8. COMMUNITY ── */}
            <section id="contributions" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
                  <PlusCircle className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Community</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8">
                  <h4 className="font-bold text-base mb-5 text-foreground">Submission Pipeline</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Pending", labelColor: "bg-amber-100 text-amber-800", desc: "Manual verification is in progress." },
                      { label: "Approved", labelColor: "bg-emerald-100 text-emerald-800", desc: "Product is live! Points have been awarded." },
                      { label: "Revision", labelColor: "bg-blue-100 text-blue-800", desc: "New photos are needed for the barcode." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <Badge className={`${step.labelColor} border-none px-2.5 py-1 text-xs font-bold uppercase shrink-0`}>{step.label}</Badge>
                        <p className="text-sm text-muted-foreground leading-snug pt-0.5">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-sm">
                  <Trophy className="h-12 w-12 text-indigo-300 mb-4" />
                  <h4 className="text-xl font-black mb-2 text-indigo-900">Join the Heroes</h4>
                  <p className="text-sm text-indigo-700 mb-6 leading-relaxed">
                    Climb the global leaderboard and unlock exclusive contributor badges.
                  </p>
                  <Link href="/contributions" className="w-full">
                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold h-11">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ── 9. SHOPPING LISTS ── */}
            <section id="shopping-lists" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 rounded-2xl shadow-sm border border-green-100">
                  <ListOrdered className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shopping Lists</h2>
              </div>

              <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-5">
                    <h4 className="font-bold text-lg text-foreground">Dynamic Sync</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Turn scans into action. Organize lists by store, health goal, or diet cycle.
                    </p>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-50 rounded-lg shrink-0"><Plus className="h-4 w-4 text-green-600" /></div>
                        <p className="text-sm font-semibold text-foreground">Categories: Groceries, Gym, Cheat Meals</p>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-50 rounded-lg shrink-0"><History className="h-4 w-4 text-green-600" /></div>
                        <p className="text-sm font-semibold text-foreground">Real-time completion tracking</p>
                      </li>
                    </ul>
                  </div>

                  {/* List mockup */}
                  <div className="w-full lg:w-72 bg-muted/40 p-5 rounded-[2rem] border border-border/40">
                    <div className="space-y-2">
                      {[
                        { n: "Organic Peanut Butter", s: 85, checked: true },
                        { n: "Sugar-Free Oat Milk", s: 92, checked: false }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                          <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${item.checked ? "bg-primary border-primary" : "border-muted-foreground/30"} flex items-center justify-center`}>
                            {item.checked && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${!item.checked ? "text-muted-foreground" : "text-foreground"}`}>{item.n}</p>
                            <p className="text-xs text-muted-foreground">Score: {item.s}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-1/2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest text-center">Progress: 50%</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 10. KNOWLEDGE HUB ── */}
            <section id="knowledge-hub" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-pink-50 rounded-2xl shadow-sm border border-pink-100">
                  <BookOpen className="h-6 w-6 text-pink-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Knowledge Hub</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    icon: <ListOrdered className="h-6 w-6 text-pink-500" />,
                    title: "Cheat Sheets",
                    desc: "Downloadable guides for Vegan, Keto, and Paleo lifestyles.",
                    href: "/dietary-guides",
                    cta: "Launch Guides"
                  },
                  {
                    icon: <TrendingUp className="h-6 w-6 text-pink-500" />,
                    title: "Wellness Blog",
                    desc: "Regular articles on gut health, food science, and lifestyle tips.",
                    href: "/blog",
                    cta: "Read Articles"
                  }
                ].map((card) => (
                  <div key={card.title} className="p-6 md:p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:border-pink-200 transition-all hover:shadow-md group">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.desc}</p>
                    <Link href={card.href}>
                      <Button variant="link" className="p-0 h-auto text-pink-500 hover:text-pink-600 font-bold text-sm">
                        {card.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12 text-center border border-primary/10 shadow-inner">
              <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight text-foreground">Still have questions?</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Our support team is always ready to help you on your health journey. Check our FAQ or send us a message.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-3">
                <Link href="/support" className="w-full md:w-auto">
                  <Button size="lg" className="h-12 md:h-14 w-full md:w-auto rounded-xl px-10 font-bold shadow-lg shadow-primary/20">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/faq" className="w-full md:w-auto">
                  <Button variant="outline" size="lg" className="h-12 md:h-14 w-full md:w-auto rounded-xl px-10 font-bold hover:bg-white">
                    FAQ Center
                  </Button>
                </Link>
              </div>
            </section>

          </div>
        </div>

        {/* Scroll to top (mobile) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="lg:hidden fixed bottom-6 right-6 p-4 bg-primary text-white rounded-2xl shadow-2xl z-50 transition-opacity opacity-80 hover:opacity-100"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </main>
    </div>
  );
}