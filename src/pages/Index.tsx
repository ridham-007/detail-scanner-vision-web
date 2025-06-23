
import React, { useEffect, useRef } from 'react';
import { Brain, Scan, Target, Zap, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import FoodScannerPage from './FoodScannerPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const IndexPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const scrollToScanner = () => {
    scannerRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out"
      });

      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out"
      });

      // Scanner section animation
      gsap.from(".scanner-section", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.out"
      });

      // How it works animations
      gsap.from(".step-card", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      // Stats animations (removed problematic counter animation)
      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // CTA section animation
      gsap.from(".cta-content", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Floating elements animation
      gsap.to(".floating-icon", {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: "01",
      title: "Scan or Search",
      description: "Use your camera to scan a barcode or manually search for products in our extensive database"
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our AI processes the product data and analyzes nutritional content against your personal health profile"
    },
    {
      step: "03",
      title: "Get Insights",
      description: "Receive detailed health scores, recommendations, ingredient analysis, and alternative suggestions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />
      
      <main ref={heroRef} className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="floating-icon relative p-4 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <Brain className="h-12 w-12 text-white" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="hero-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              EaterIQ
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform the way you make food choices with AI-powered nutrition analysis and smart barcode scanning
            </p>
            
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={scrollToScanner}
              >
                Start Scanning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 hover:bg-accent transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Scanner Section */}
        <section ref={scannerRef} className="scanner-section container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <FoodScannerPage />
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to smarter food choices
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="step-card flex items-center mb-12 last:mb-0">
                  <div className="floating-icon flex-shrink-0 w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-8">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="stat-item group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                4,700+
              </div>
              <p className="text-muted-foreground text-lg">Products Analyzed</p>
            </div>
            <div className="stat-item group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <p className="text-muted-foreground text-lg">Accuracy Rate</p>
            </div>
            <div className="stat-item group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                2,400+
              </div>
              <p className="text-muted-foreground text-lg">Happy Users</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="container mx-auto px-4 py-16">
          <div className="cta-content max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Food Choices?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are making smarter, healthier decisions with EaterIQ
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={scrollToScanner}
            >
              Get Started Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
