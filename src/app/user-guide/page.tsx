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
  { label: "Excellent", range: "80-100", color: "bg-health-excellent", description: "Minimal additives, high nutritional value, and clean ingredients." },
  { label: "Good", range: "60-79", color: "bg-health-good", description: "Generally healthy with some minor nutritional concerns." },
  { label: "Fair", range: "40-59", color: "bg-health-fair", description: "Contains several concerning ingredients or low nutritional density." },
  { label: "Poor", range: "0-39", color: "bg-health-poor", description: "High in harmful additives, sugar, or ultra-processed ingredients." }
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
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden border-b border-border animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-left md:text-center">
            <Badge variant="outline" className="mb-4 py-1 px-4 border-primary/20 bg-primary/5 text-primary animate-scale-in text-[10px] md:text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              User Guide
            </Badge>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-4 md:mb-8 leading-tight">
              Master <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-500">EaterIQ</span>
            </h1>
            <p className="text-base md:text-2xl text-muted-foreground leading-relaxed mb-6 md:mb-10 max-w-2xl mx-auto">
              Decipher labels, compare nutrients, and track your health in real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-start md:justify-center gap-4">
              <Button onClick={() => scrollToSection('getting-started')} size="lg" className="rounded-xl md:rounded-2xl px-8 md:px-10 h-12 md:h-14 text-sm md:text-base font-bold shadow-lg shadow-primary/10 hover-scale bg-primary">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Link href="/support">
                <Button variant="outline" size="lg" className="rounded-xl md:rounded-2xl px-8 h-12 md:h-14 text-sm md:text-base font-bold hover-scale border-border bg-background/50">
                  Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Mobile Navigation (Sticky on small screens) */}
          <div className="lg:hidden sticky top-[56px] z-30 -mx-4 px-4 py-3 bg-background/60 backdrop-blur-xl border-b border-border/50 mb-8 overflow-hidden">
            <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar snap-x scroll-smooth">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-bold whitespace-nowrap snap-start hover:bg-primary/10 shadow-sm"
                >
                  <div className="text-primary">
                    {React.cloneElement(section.icon as React.ReactElement, { className: "h-3 w-3" })}
                  </div>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar Nav (Desktop only) */}
          <aside className="lg:col-span-1 hidden lg:block animate-fade-in">
            <div className="sticky top-24 space-y-1 p-2 rounded-2xl bg-muted/30 border border-border shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 mt-2 ml-4">Table of Contents</p>
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

          {/* Guide Content */}
          <div className="lg:col-span-3 space-y-24 max-w-4xl animate-fade-in">

            {/* Getting Started Section */}
            <section id="getting-started" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-yellow-50 rounded-xl md:rounded-2xl shadow-sm border border-yellow-100">
                  <Zap className="h-5 w-5 md:h-8 md:w-8 text-yellow-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Getting Started</h2>
              </div>

              <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <p className="text-sm md:text-lg leading-relaxed mb-8 font-medium text-foreground/80">
                  Welcome back! Maximize your <span className="text-primary font-bold">EaterIQ</span> experience with these three essential steps:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { step: 1, title: 'Dietary Profile', desc: 'Configure your needs in Settings for smart alerts.', icon: <User className="h-3 w-3" /> },
                    { step: 2, title: 'Instant Scan', desc: 'Point at any barcode for deep nutrition analysis.', icon: <Scan className="h-3 w-3" /> },
                    { step: 3, title: 'Smart Swap', desc: 'Identify better choices with our AI alternative engine.', icon: <TrendingUp className="h-3 w-3" /> }
                  ].map((item) => (
                    <div key={item.step} className="p-5 bg-yellow-50/50 rounded-2xl border border-yellow-100 hover:border-yellow-200 transition-all hover:bg-yellow-50 relative group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm">
                           {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4" })}
                        </div>
                        <h4 className="font-bold text-sm m-0 text-yellow-900">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-yellow-800/70 m-0 leading-relaxed font-medium">{item.desc}</p>
                      <div className="absolute top-3 right-3 text-[10px] font-black text-yellow-500/20">{item.step}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-[11px] md:text-sm text-primary/80 m-0 font-semibold italic">Privacy First: Your data stays locally on your device.</p>
                </div>
              </div>
            </section>

            <section id="food-scanner" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-primary/5 rounded-xl md:rounded-2xl shadow-sm border border-primary/10">
                  <Scan className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Food Scanner</h2>
              </div>

              <div className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-lg md:text-2xl font-bold mb-4">How to Analyze</h3>
                    <div className="space-y-4">
                      {[
                        { s: 1, t: 'Grant Permissions', d: 'Enable camera access for instant scanning.' },
                        { s: 2, t: 'Point & Scan', d: 'Hover over barcodes or ingredients labels.' },
                        { s: 3, t: 'Get Insights', d: 'View scores, warnings, and alternatives.' }
                      ].map((step) => (
                        <div key={step.s} className="flex gap-4 items-start p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shadow-sm shadow-primary/20">
                            {step.s}
                          </div>
                          <div>
                            <p className="text-sm font-bold m-0 text-primary-foreground/90">{step.t}</p>
                            <p className="text-[10px] text-primary/70 m-0 font-medium leading-tight">{step.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="order-1 md:order-2 bg-gradient-to-br from-muted/50 to-muted p-4 sm:p-8 rounded-[2rem] border border-border/50 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full max-w-[140px] sm:max-w-[240px] aspect-[9/16] bg-card rounded-[2rem] border-[4px] border-foreground/10 overflow-hidden shadow-xl">
                       <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <div className="relative mb-4">
                            <Scan className="h-10 w-10 text-primary animate-pulse" />
                            <div className="absolute -inset-2 bg-primary/20 blur-xl -z-10 rounded-full" />
                          </div>
                          <p className="text-[10px] font-black uppercase text-foreground">Scanner Active</p>
                          <div className="w-4/5 h-0.5 bg-primary/30 rounded-full mt-2" />
                       </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Global Health Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                    {scoreLevels.map((level) => (
                      <div key={level.label} className="p-3 md:p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                        <div className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl ${level.color} flex items-center justify-center text-white font-black text-xs md:text-xl mb-3`}>
                          {level.range.split('-')[1]}
                        </div>
                        <h4 className="font-bold text-xs md:text-lg mb-1">{level.label}</h4>
                        <p className="text-[9px] md:text-sm text-muted-foreground m-0 leading-tight md:leading-relaxed truncate md:whitespace-normal">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Food Battle Section */}
            <section id="food-battle" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-blue-50 rounded-xl md:rounded-2xl shadow-sm border border-blue-100">
                  <TrendingUp className="h-5 w-5 md:h-8 md:w-8 text-blue-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Food Battle</h2>
              </div>
              
              <div className="bg-blue-50/50 rounded-3xl p-6 md:p-10 relative overflow-hidden border border-blue-100 mb-6 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-blue-900">
                  <div className="space-y-4">
                    <Badge className="bg-blue-100 text-blue-700 border-none py-1 px-3 text-[10px] font-bold uppercase tracking-widest">Vs Mode Engaged</Badge>
                    <h4 className="font-black text-2xl md:text-4xl m-0 leading-tight">Nutrient Duel</h4>
                    <p className="text-xs md:text-base text-blue-800/70 leading-relaxed font-medium">Compare macros and additives head-to-head. Our AI selects the definitive winner.</p>
                    
                    <div className="flex items-center gap-6 bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100/50 rounded-xl flex items-center justify-center font-black text-blue-700 text-sm md:text-xl border border-blue-200 shadow-sm">A</div>
                        <span className="text-2xl md:text-3xl font-black text-blue-300 italic uppercase tracking-tighter">vs</span>
                        <div className="relative">
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 text-sm md:text-xl shadow-[0_0_25px_rgba(255,255,255,0.7)]">B</div>
                          <div className="absolute -top-3 -right-3 h-5 px-1.5 bg-yellow-400 text-black text-[8px] font-black rounded-full flex items-center shadow-lg border-2 border-white">WINNER</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="space-y-4">
                       <p className="text-sm font-bold text-blue-400 uppercase tracking-widest m-0">Pro Features</p>
                       <ul className="space-y-4 list-none pl-0">
                          {['Direct Nutrient Comparison', '15+ Health Parameters', 'Smart Highlight Engine'].map((f, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm font-bold text-blue-800/90">
                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                                {f}
                             </li>
                          ))}
                       </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 text-sm mb-3 text-blue-900">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Daily Limits
                  </h4>
                  <p className="text-[11px] text-blue-800/70 m-0 leading-relaxed font-medium">
                    Free users get <strong>3 battles per day</strong>. Upgrade to <strong>Pro</strong> for unlimited comparisons.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 text-sm mb-3">
                    <Info className="h-4 w-4 text-primary" />
                    Green Highlights
                  </h4>
                  <p className="text-[11px] text-muted-foreground m-0 leading-relaxed font-medium">
                    We highlight the winning nutrient in <strong>green</strong> (Lower for Sugars, Higher for Protein).
                  </p>
                </div>
              </div>
            </section>

            {/* Health Quizzes Section */}
            <section id="health-quizzes" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-purple-50 rounded-xl md:rounded-2xl shadow-sm border border-purple-100">
                  <Brain className="h-5 w-5 md:h-8 md:w-8 text-purple-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Quiz Hub</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                {[
                  { icon: <Zap className="h-4 w-4" />, title: '50:50', desc: 'Removes 2 wrong answers.', color: 'purple' },
                  { icon: <Bolt className="h-4 w-4" />, title: 'Skip', desc: 'Jump to next question.', color: 'blue' },
                  { icon: <Clock className="h-4 w-4" />, title: 'Time+', desc: 'Add 15s to the timer.', color: 'amber' }
                ].map(lifeline => (
                  <div key={lifeline.title} className={`p-4 rounded-2xl border bg-${lifeline.color}-50/30 border-${lifeline.color}-100 flex items-center gap-4 hover:shadow-sm transition-shadow`}>
                    <div className={`p-2 bg-${lifeline.color}-100 rounded-lg text-${lifeline.color}-600 shrink-0 shadow-sm`}>
                      {lifeline.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm m-0">{lifeline.title}</h4>
                      <p className="text-[10px] text-muted-foreground m-0 leading-tight font-medium">{lifeline.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 border border-border/50 rounded-3xl p-6 md:p-8 mb-8">
                <h4 className="font-bold mb-4 text-sm md:text-base tracking-tight">Quiz Categories</h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {['Nutrition Basics', 'Food Safety', 'Vitamins & Minerals', 'Food Labels', 'Superfoods', 'Diet Myths'].map(cat => (
                    <Badge key={cat} variant="outline" className="border-purple-200 text-purple-600 bg-white text-[10px] md:text-xs py-1 px-3 rounded-lg shadow-sm">{cat}</Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* History & Profile Section */}
            <section id="history-profile" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-orange-50 rounded-xl md:rounded-2xl shadow-sm border border-orange-100">
                  <User className="h-5 w-5 md:h-8 md:w-8 text-orange-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Account & Profile</h2>
              </div>

              <div className="space-y-6 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
                  <div className="p-6 bg-card border border-orange-100 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold mb-3">Preferences</h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground mb-4">Set your diet in Settings for targeted scanning alerts.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Vegan', 'Halal', 'Keto'].map(opt => (
                        <Badge key={opt} className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 text-[10px] rounded-full">{opt}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-card border border-red-100 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold mb-3">Allergies</h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground mb-4">Identify critical triggers before you buy. Warnings appear instantly.</p>
                    <div className="flex flex-wrap gap-2">
                       {['Nuts', 'Dairy', 'Soy'].map(opt => (
                          <Badge key={opt} className="bg-red-50 text-red-700 hover:bg-red-100 border-none px-3 py-1 text-[10px] rounded-full">{opt}</Badge>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-orange-900 font-bold mb-2">Exclusive Pro Tools</h4>
                    <p className="text-xs md:text-sm text-orange-800/70 mb-0">Unlimited history, deep reports, and ad-free labeling.</p>
                  </div>
                  <Link href="/pricing" className="w-full md:w-auto">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-8">UPGRADE NOW</Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Healthier Alternatives Section */}
            <section id="alternatives" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-red-50 rounded-xl md:rounded-2xl shadow-sm border border-red-100">
                  <Heart className="h-5 w-5 md:h-8 md:w-8 text-red-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Better Choices</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
                <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
                  <h4 className="font-black text-sm uppercase tracking-widest text-red-600 mb-4">AI Smart Swaps</h4>
                  <p className="text-[11px] md:text-base text-muted-foreground/80 leading-relaxed mb-6 font-medium">Instantly find products in the same category with cleaner labels and better metrics.</p>
                  <ul className="space-y-4 list-none pl-0">
                    {[
                      { t: 'High Scores', d: 'Average +25 point boost.' },
                      { t: 'Clean Label', d: 'Safe, verified additives.' },
                      { t: 'Goal Match', d: 'Low sugar/sodium focus.' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="text-xs font-bold m-0">{item.t}</p>
                          <p className="text-[10px] text-muted-foreground m-0">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/40 rounded-full -mr-16 -mt-16 blur-3xl" />
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-red-100 text-red-700 border-none text-[10px] font-bold">SMART RECO</Badge>
                        <Star className="h-5 w-5 fill-red-500 text-red-500" />
                      </div>
                      <h4 className="text-2xl font-black mb-2 text-red-900">The Winner</h4>
                      <p className="text-xs md:text-sm text-red-800/70 leading-relaxed font-medium">Tap any alternative to see why it specifically beats your original scan.</p>
                   </div>
                   <div className="mt-8 relative z-10">
                      <div className="w-full h-1 bg-red-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-3/4 shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                      </div>
                      <p className="text-[10px] text-red-600/60 mt-2 uppercase font-black tracking-widest">Score Accuracy: 99%</p>
                   </div>
                </div>
              </div>
            </section>

            {/* Health Calculators Section */}
            <section id="calculators" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-teal-50 rounded-xl md:rounded-2xl shadow-sm border border-teal-100">
                  <Calculator className="h-5 w-5 md:h-8 md:w-8 text-teal-600" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Health Tools</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                {[
                  { name: 'BMI Tool', desc: 'Weight check.' },
                  { name: 'TDEE', desc: 'Energy needs.' },
                  { name: 'Macro', desc: 'Protein tracker.' },
                  { name: 'Water', desc: 'Hydration.' },
                  { name: 'Goals', desc: 'Target weights.' },
                  { name: 'Support', desc: 'Wellness tips.' }
                ].map((calc, i) => (
                  <div key={i} className="p-4 bg-card border border-border/50 rounded-2xl hover:border-teal-400 transition-all shadow-sm group text-center md:text-left">
                    <h4 className="font-bold text-[11px] md:text-sm mb-1 group-hover:text-teal-600 m-0">{calc.name}</h4>
                    <p className="text-[9px] md:text-xs text-muted-foreground m-0 leading-tight font-medium">{calc.desc}</p>
                  </div>
                ))}
              </div>

              <Link href="/calculators" className="block text-center mt-6">
                <Button variant="outline" className="w-full md:w-auto h-12 rounded-xl border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 font-bold text-sm">
                  Launch All Tools <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </section>

            {/* Community Contributions Section */}
            <section id="contributions" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-indigo-50 rounded-xl md:rounded-2xl shadow-sm border border-indigo-100">
                  <PlusCircle className="h-5 w-5 md:h-8 md:w-8 text-indigo-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Contributions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
                <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8">
                  <h4 className="font-bold text-sm mb-4 m-0">Submission Pipeline</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Pending', color: 'bg-amber-100 text-amber-800', desc: 'Manual verification in progress.' },
                      { label: 'Approved', color: 'bg-emerald-100 text-emerald-800', desc: 'Product live! Points awarded.' },
                      { label: 'Revision', color: 'bg-blue-100 text-blue-800', desc: 'New photos needed for barcode.' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <Badge className={`${step.color} border-none px-2 py-0.5 text-[8px] font-black uppercase`}>{step.label}</Badge>
                        <p className="text-[10px] md:text-xs text-muted-foreground m-0 font-medium">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-sm">
                  <Trophy className="h-10 w-10 text-indigo-500/50 mb-4" />
                  <h4 className="text-xl font-black mb-2 m-0 text-indigo-900">Join the Heroes</h4>
                  <p className="text-xs text-indigo-800/70 mb-6 m-0 leading-relaxed font-medium">Climb the global leaderboard and unlock exclusive badges.</p>
                  <Link href="/contributions" className="w-full">
                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold">DASHBOARD</Button>
                  </Link>
                </div>
              </div>
            </section>
            {/* Shopping Lists Section */}
            <section id="shopping-lists" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-green-50 rounded-xl md:rounded-2xl shadow-sm border border-green-100">
                  <ListOrdered className="h-5 w-5 md:h-8 md:w-8 text-green-600" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Smart Lists</h2>
              </div>

              <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4">
                       <h4 className="font-bold text-lg m-0">Dynamic Sync</h4>
                       <p className="text-xs md:text-base text-muted-foreground leading-relaxed font-medium">Turn scans into action. Organize lists by store, health goal, or diet cycle.</p>
                       <ul className="space-y-3 list-none pl-0">
                          <li className="flex items-center gap-3">
                             <div className="p-1.5 bg-green-50 rounded-lg"><Plus className="h-3 w-3 text-green-600" /></div>
                             <p className="text-[11px] md:text-sm font-bold m-0">Categories: Groceries, Gym, Cheat Meals</p>
                          </li>
                          <li className="flex items-center gap-3">
                             <div className="p-1.5 bg-green-50 rounded-lg"><History className="h-3 w-3 text-green-600" /></div>
                             <p className="text-[11px] md:text-sm font-bold m-0">Real-time completion tracking.</p>
                          </li>
                       </ul>
                    </div>
                    <div className="w-full lg:w-72 bg-muted/40 p-6 rounded-[2rem] border border-border/40 relative">
                        <div className="space-y-2">
                           {[
                              { n: 'Organic Peanut Butter', s: 85, c: true },
                              { n: 'Sugar-Free Oat Milk', s: 92, c: false }
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50 shadow-sm">
                                 <div className={`h-4 w-4 rounded-full border-2 ${item.c ? 'bg-primary border-primary' : 'border-muted-foreground/30'} flex items-center justify-center`}>
                                    {item.c && <CheckCircle2 className="h-2 w-2 text-white" />}
                                 </div>
                                 <div className="flex-1">
                                    <p className={`text-[10px] font-bold m-0 ${!item.c && 'text-muted-foreground'}`}>{item.n}</p>
                                    <p className="text-[8px] text-muted-foreground m-0">Score: {item.s}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/40">
                           <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-1/2" />
                           </div>
                           <p className="text-[8px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest text-center">Progress: 50%</p>
                        </div>
                    </div>
                </div>
              </div>
            </section>

            {/* Knowledge Hub Section */}
            <section id="knowledge-hub" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-pink-50 rounded-xl md:rounded-2xl shadow-sm border border-pink-100">
                  <BookOpen className="h-5 w-5 md:h-8 md:w-8 text-pink-500" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold m-0 tracking-tight">Knowledge Hub</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                 <div className="p-6 md:p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:border-pink-200 transition-all hover:shadow-md group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <ListOrdered className="h-5 w-5 md:h-6 md:w-6 text-pink-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold m-0 mb-2">Cheat Sheets</h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground m-0 mb-4 leading-relaxed font-medium">Downloadable guides for Vegan, Keto, and Paleo lifestyles.</p>
                    <Link href="/dietary-guides">
                       <Button variant="link" className="p-0 h-auto text-pink-500 hover:text-pink-600 font-bold text-xs">
                          Launch Guides <ArrowRight className="h-3 w-3 ml-1" />
                       </Button>
                    </Link>
                 </div>
                 <div className="p-6 md:p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:border-pink-200 transition-all hover:shadow-md group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-pink-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold m-0 mb-2">Wellness Blog</h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground m-0 mb-4 leading-relaxed font-medium">Regular articles on gut health, food science, and lifestyle tips.</p>
                    <Link href="/blog">
                       <Button variant="link" className="p-0 h-auto text-pink-500 hover:text-pink-600 font-bold text-xs">
                          Read Articles <ArrowRight className="h-3 w-3 ml-1" />
                       </Button>
                    </Link>
                 </div>
              </div>
            </section>
            {/* Ending Help */}
            <section className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12 text-center border border-primary/10 shadow-inner">
              <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">Still have questions?</h2>
              <p className="text-xs md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-medium leading-relaxed">
                Our support team is always ready to help you on your health journey.
                Check our FAQ or send us a message.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-3">
                <Link href="/support" className="w-full md:w-auto">
                  <Button size="lg" className="h-12 md:h-14 w-full md:w-auto rounded-xl px-10 font-bold shadow-lg shadow-primary/20">Contact Support</Button>
                </Link>
                <Link href="/faq" className="w-full md:w-auto">
                  <Button variant="outline" size="lg" className="h-12 md:h-14 w-full md:w-auto rounded-xl px-10 font-bold hover:bg-white">FAQ Center</Button>
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Floating Scroll to Top (Mobile only) */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="lg:hidden fixed bottom-6 right-6 p-4 bg-primary text-white rounded-2xl shadow-2xl z-50 animate-bounce transition-opacity opacity-80 hover:opacity-100"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
}
