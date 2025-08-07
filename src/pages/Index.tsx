import React, { useEffect, useRef, useState } from 'react';
import { Brain, Scan, Target, Zap, Shield, Users, ArrowRight, Sparkles, Clock, Rocket, Bell, Calendar, Utensils, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import FoodScannerPage from './FoodScannerPage';
import EarlyAccessModal from '@/components/EarlyAccessModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackCTAClick } from '@/utils/analytics';
import Logo from '../assets/download.svg';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const IndexPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quizzesRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const navigate = useNavigate();

  // Fetch recent quizzes
  const { data: recentQuizzes } = useQuery({
    queryKey: ['recent-quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, description, difficulty, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch product count
  const { data: productCount } = useQuery({
    queryKey: ['product-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('scanned_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);
      
      if (error) throw error;
      return (count || 0) + 4700; // Base count + DB count
    },
  });

  // Fetch user count
  const { data: userCount } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return (count || 0) + 2400; // Base count + DB count
    },
  });

  // Format numbers with K, M abbreviations
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const scrollToScanner = () => {
    trackCTAClick('scroll_to_scanner');
    scannerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleLearnMoreClick = () => {
    trackCTAClick('learn_more');
    howItWorksRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleGetStartedClick = () => {
    trackCTAClick('get_started_cta');
    scannerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleEarlyAccessClick = () => {
    trackCTAClick('early_access_modal');
    setShowEarlyAccessModal(true);
  };

  const handleQuizPlay = (quizId: string) => {
    trackCTAClick('play_quiz_from_landing');
    navigate(`/quiz/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
    <div className="min-h-screen bg-background">
      <AnimatedBackground />

      <main ref={heroRef} className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8 lg:space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-3 bg-primary/10 rounded-full px-4 py-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">AI-Powered Nutrition</span>
                  </div>
                  
                  <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    Make
                    <span className="block text-primary">
                      Smarter Food
                    </span>
                    <span className="block">Choices</span>
                  </h1>
                  
                  <h2 className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                    Discover what's really in your food with instant barcode scanning and AI-powered health insights
                  </h2>
                </div>

                <div className="hero-cta flex flex-col sm:flex-row gap-4">
                  <Button
                    aria-label="Start Scanning Now"
                    size="lg"
                    className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    onClick={scrollToScanner}
                  >
                    <span className="relative z-10 flex items-center">
                      <Scan className="mr-2 h-5 w-5" />
                      Start Scanning
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                  
                  <Button
                    aria-label="Watch Demo"
                    variant="outline"
                    size="lg"
                    className="group px-8 py-4 h-auto rounded-xl border-2 border-border hover:border-primary transition-all duration-300"
                    onClick={handleLearnMoreClick}
                  >
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Watch Demo
                  </Button>
                </div>

                {/* Stats Preview */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {productCount ? formatNumber(productCount) : '4.7K+'}
                    </div>
                    <div className="text-sm text-muted-foreground">Products Scanned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {userCount ? formatNumber(userCount) : '2.4K+'}
                    </div>
                    <div className="text-sm text-muted-foreground">Happy Users</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative lg:ml-8">
                <div className="relative z-10">
                  {/* Phone Mockup */}
                  <div className="mx-auto w-72 h-96 bg-card rounded-3xl shadow-2xl border-8 border-border/20 overflow-hidden">
                    <div className="h-full bg-muted flex flex-col">
                      {/* Phone Header */}
                      <div className="p-6 text-center border-b border-border/20">
                        <img src={Logo} alt="EaterIQ logo" className="h-16 w-16 mx-auto mb-3" />
                        <h3 className="font-bold text-foreground">EaterIQ Scanner</h3>
                      </div>
                      
                      {/* Scanner Interface */}
                      <div className="flex-1 p-6 flex flex-col justify-center">
                        <div className="aspect-square bg-primary/20 rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center mb-4">
                          <Scan className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <p className="text-center text-muted-foreground text-sm">
                          Point camera at barcode
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-8 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-lg"></div>
                
                {/* Floating Icons */}
                <div className="absolute top-1/4 -left-8 floating-icon">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-3/4 -right-8 floating-icon">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-8 floating-icon">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
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
                  <div className="floating-icon flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg mr-4 sm:mr-8">
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
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {productCount ? formatNumber(productCount) : '4.7K+'}
              </div>
              <p className="text-muted-foreground text-lg">Products Analyzed</p>
            </div>
            <div className="stat-item group">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                99.9%
              </div>
              <p className="text-muted-foreground text-lg">Accuracy Rate</p>
            </div>
            <div className="stat-item group">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {userCount ? formatNumber(userCount) : '2.4K+'}
              </div>
              <p className="text-muted-foreground text-lg">Happy Users</p>
            </div>
          </div>
        </section>

        {/* Recent Quizzes Section */}
        {recentQuizzes && recentQuizzes.length > 0 && (
          <section ref={quizzesRef} className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 mx-auto">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  Test Your Food IQ
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Challenge yourself with our latest AI-generated nutrition quizzes
                </p>
              </div>

              <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {recentQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getDifficultyColor(quiz.difficulty)} text-xs`}>
                          {quiz.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2 capitalize">
                        {quiz.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleQuizPlay(quiz.id)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/quizzes')}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 rounded-full border-2 hover:bg-accent transition-all duration-300"
                >
                  View All Quizzes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Coming Soon Section - Fixed for proper visibility */}
        <section ref={comingSoonRef} className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 mx-auto">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl sm:h-16 font-bold text-primary ">
                What's Coming Next
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ">
                We're constantly innovating to make your healthy eating journey even more powerful
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
              <Card className="coming-soon-card group relative overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 opacity-100">
                {/* <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    Q1 2025
                  </Badge>
                </div> */}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mx-auto mb-4 w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Utensils className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Meal Planner
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center px-6 pb-8">
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Get personalized weekly meal plans based on your dietary preferences and health goals
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="coming-soon-card group relative overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 opacity-100">
                {/* <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Q2 2025
                  </Badge>
                </div> */}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mx-auto mb-4 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Food Community
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center px-6 pb-8">
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Connect with health-conscious food lovers and share your discoveries
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="coming-soon-card group relative overflow-hidden bg-white dark:bg-gray-800 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 opacity-100">
                {/* <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    Q1 2025
                  </Badge>
                </div>
                 */}
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mx-auto mb-4 w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Bell className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Smart Reminders
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center px-6 pb-8">
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Intelligent notifications for meal timing and nutrition tracking
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Be the First to Know</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                Join our community and get early access to these exciting new features when they launch.
              </p>
              <Button
                aria-label="Get Early Access"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleEarlyAccessClick}
              >
                <Bell className="mr-2 h-5 w-5" />
                Get Early Access
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="container mx-auto px-4 py-16">
          <div className="cta-content max-w-4xl mx-auto text-center bg-primary rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Food Choices?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are making smarter, healthier decisions with EaterIQ
            </p>
            <Button
              aria-label="Get Started Today"
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-muted px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleGetStartedClick}
            >
              Get Started Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <EarlyAccessModal
        open={showEarlyAccessModal}
        onOpenChange={setShowEarlyAccessModal}
      />
    </div>
  );
};

export default IndexPage;
