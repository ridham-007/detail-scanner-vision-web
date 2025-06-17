
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scan, Smartphone, Sparkles, Target, Zap, Brain, Award, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDetails from '@/components/ProductDetails';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useProductLookup } from '@/hooks/useProductLookup';

gsap.registerPlugin(ScrollTrigger);

const IndexContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { lookupProduct, isLoading } = useProductLookup();

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl.from(heroRef.current?.querySelector('.hero-badge'), {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from(heroRef.current?.querySelector('.hero-title'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .from(heroRef.current?.querySelector('.hero-description'), {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2");

    // Features animation on scroll
    gsap.from(featuresRef.current?.querySelectorAll('.feature-card'), {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
      }
    });

    // Scanner card animation
    gsap.from(scannerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scannerRef.current,
        start: "top 80%",
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleScan = async (barcode: string) => {
    console.log('Barcode scanned:', barcode);
    setIsScanning(false);
    const product = await lookupProduct(barcode);
    setCurrentProduct(product);
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      setCurrentProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center mb-8 md:mb-12">
          <div className="hero-badge inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4 md:mb-6">
            <Brain className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI-Powered Food Intelligence</span>
          </div>
          <h1 className="hero-title text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-emerald-900 to-blue-900 dark:from-gray-100 dark:via-emerald-100 dark:to-blue-100 bg-clip-text text-transparent leading-tight">
            Scan. Analyze. Eat Smart.
          </h1>
          <p className="hero-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Transform any barcode into instant food insights with EaterIQ's advanced AI scanner.
            Get health scores, smart recommendations, and make informed food choices in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
          <div className="feature-card text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200/50 dark:border-emerald-700/50 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Scan className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-2">Smart Scanning</h3>
            <p className="text-sm text-muted-foreground">Advanced camera recognition for instant barcode detection</p>
          </div>

          <div className="feature-card text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Award className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-2">Health Scoring</h3>
            <p className="text-sm text-muted-foreground">AI-powered health analysis with instant scoring system</p>
          </div>

          <div className="feature-card text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-2">Smart Recommendations</h3>
            <p className="text-sm text-muted-foreground">Personalized food recommendations for healthier choices</p>
          </div>
        </div>

        {/* Scanner Section */}
        <Card ref={scannerRef} className="mb-6 md:mb-8 overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Smartphone size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-base md:text-xl">EaterIQ Scanner</span>
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm opacity-90 hidden md:inline">Ready</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <BarcodeScanner
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />

            <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex-shrink-0">
                  <AlertCircle size={18} className="text-emerald-600 dark:text-emerald-400 md:w-5 md:h-5" />
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-emerald-900 dark:text-emerald-100 text-sm md:text-base">Quick Start Guide:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-xs md:text-sm">Click "Start Scan" to activate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-xs md:text-sm">Point camera at barcode</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-xs md:text-sm">Keep within frame</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-xs md:text-sm">Get instant analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-6 md:mb-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Product Details Section */}
        <div className="px-4 md:px-0">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-emerald-900 dark:from-gray-100 dark:to-emerald-100 bg-clip-text text-transparent">
              AI-Powered Food Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              EaterIQ's advanced AI analyzes your scanned products to provide comprehensive health insights,
              nutritional breakdowns, and personalized recommendations for smarter eating.
            </p>
          </div>
          <ProductDetails product={currentProduct} isLoading={isLoading} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
