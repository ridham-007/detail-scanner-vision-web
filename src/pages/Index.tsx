import React, { useEffect, useRef } from "react";
import {
  Brain,
  Scan,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
  Leaf,
  Award,
  CheckCircle,
  Play,
  QrCode,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import AnimatedBackground from "@/components/AnimatedBackground";
import FoodScannerPage from "./FoodScannerPage";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackCTAClick } from "@/utils/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const IndexPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quizzesRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch recent quizzes
  const { data: recentQuizzes } = useQuery({
    queryKey: ["recent-quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description, difficulty, created_at, slug")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  // Fetch recent blog posts
  const { data: recentBlogs } = useQuery({
    queryKey: ["recent-blogs-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          reading_time,
          published_at,
          author:profiles(full_name, avatar_url)
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  // Fetch product count
  const { data: productCount } = useQuery({
    queryKey: ["product-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("scanned_products")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      if (error) throw error;
      return (count || 0) + 23000;
    },
  });

  // Fetch user count
  const { data: userCount } = useQuery({
    queryKey: ["user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return (count || 0) + 14000;
    },
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  const scrollToScanner = () => {
    trackCTAClick("scroll_to_scanner");
    scannerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLearnMoreClick = () => {
    trackCTAClick("learn_more");
    howItWorksRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleGetStartedClick = () => {
    trackCTAClick("get_started_cta");
    scannerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-primary/20 text-primary";
      case "medium":
        return "bg-accent/20 text-accent-foreground";
      case "hard":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });

      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      });

      gsap.from(".scanner-section", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
      });

      gsap.from(".step-card", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".why-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: whyRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".blog-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: blogRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(".floating-icon", {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: "01",
      icon: "QrCode",
      title: "Scan & Discover",
      description:
        "Simply scan any barcode with your camera or search our database of millions of products. Our smart scanner recognizes products instantly.",
    },
    {
      step: "02",
      icon: "Brain",
      title: "AI-Powered Analysis",
      description:
        "Advanced AI analyzes ingredients, nutrition facts, additives, and allergens to provide comprehensive health insights tailored to your needs.",
    },
    {
      step: "03",
      icon: "TrendingUp",
      title: "Smart Recommendations",
      description:
        "Get personalized health scores, ingredient warnings, better alternatives, and actionable advice to make smarter food choices.",
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Science-Based Analysis",
      description: "Our health scores are calculated using peer-reviewed nutritional science and WHO dietary guidelines.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive nutritional analysis in seconds. No waiting, no complicated processes.",
    },
    {
      icon: Heart,
      title: "Personalized Insights",
      description: "Receive recommendations based on your dietary preferences, allergies, and health goals.",
    },
    {
      icon: Leaf,
      title: "Transparency First",
      description: "We decode confusing ingredient lists and reveal what's really in your food.",
    },
    {
      icon: Award,
      title: "Trusted by Thousands",
      description: "Join our growing community of health-conscious consumers making informed choices.",
    },
    {
      icon: CheckCircle,
      title: "100% Free Forever",
      description: "No hidden fees, no premium tiers for basic features. Everyone deserves access to food transparency.",
    },
  ];

  // Structured data for homepage
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EaterIQ",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "description": "AI-powered food scanner that analyzes nutrition, ingredients, and additives to help you make healthier food choices.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": userCount || 14000
    },
    "publisher": {
      "@type": "Organization",
      "name": "EaterIQ",
      "url": "https://www.eateriq.com"
    }
  };

  return (
    <>
      <SEOHead
        title="EaterIQ - AI Food Scanner for Healthier Choices | Free Nutrition Analysis"
        description="Scan any food product barcode and instantly get AI-powered nutrition analysis, health scores, ingredient warnings, and healthier alternatives. 100% free, no sign-up required."
        keywords="food scanner, nutrition analysis, healthy eating, barcode scanner, ingredient checker, health score, food additives, allergen detection, AI nutrition app"
        canonicalUrl="https://www.eateriq.com/"
        type="website"
        ogTitle="EaterIQ - Make Smarter Food Choices with AI"
        ogDescription="Free AI-powered food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly."
        structuredData={homeStructuredData}
      />
      
      <div className="min-h-screen bg-background">
        <AnimatedBackground />

        <main ref={heroRef} className="relative z-10">
          {/* Hero Section */}
          <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Left Content */}
                  <div className="space-y-8">
                    <div className="hero-badge">
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium rounded-full cursor-default hover:text-white">
                        <Sparkles className="mr-2 h-4 w-4" />
                        100% Free Forever
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      <h1 id="hero-heading" className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                        Make the right choices
                        <span className="block text-primary">for your health</span>
                      </h1>
                      
                      <p className="hero-subtitle text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                        Scan any product and instantly get detailed nutritional analysis, 
                        health insights, and smart recommendations — completely free.
                      </p>
                    </div>

                    <div className="hero-cta flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={scrollToScanner}
                      >
                        <Scan className="mr-3 h-5 w-5" />
                        Try It Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 py-4 text-base rounded-lg border-2 hover:bg-accent/10 transition-all duration-300"
                        onClick={handleLearnMoreClick}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Right Visual */}
                  <div className="relative flex justify-center lg:justify-end">
                    <div className="relative max-w-md w-full">
                      <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground border border-border">
                              eateriq.com
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-muted/20">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                              <Scan className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Scan Product</h3>
                            <div className="bg-accent/20 rounded-lg p-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Health Score</span>
                                <span className="font-semibold text-primary">8.5/10</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{width: '85%'}}></div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                                Low Sugar
                              </div>
                              <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                                High Protein
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scanner Section */}
          <section
            ref={scannerRef}
            id="scanner"
            className="scanner-section container mx-auto px-4 py-16"
            aria-labelledby="scanner-heading"
          >
            <h2 id="scanner-heading" className="sr-only">Food Product Scanner</h2>
            <div className="max-w-6xl mx-auto">
              <FoodScannerPage />
            </div>
          </section>

          {/* How It Works Section */}
          <section
            ref={howItWorksRef}
            id="how-it-works"
            className="relative bg-muted/20 py-20 overflow-hidden"
            aria-labelledby="how-it-works-heading"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-4">
              <header className="text-center mb-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                  How It Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Transform your food choices in three intelligent steps. Our AI-powered platform makes healthy eating simple and personalized.
                </p>
              </header>

              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon === 'QrCode' ? QrCode : 
                                        step.icon === 'Brain' ? Brain : 
                                        TrendingUp;
                    
                    return (
                      <article
                        key={index}
                        className="step-card group relative"
                      >
                        {index < steps.length - 1 && (
                          <div className="hidden lg:block absolute top-20 left-full w-12 h-0.5 bg-primary/50 transform translate-x-6"></div>
                        )}
                        
                        <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                          <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
                                <IconComponent className="h-8 w-8 text-primary" />
                              </div>
                              <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors duration-300">
                                {step.step}
                              </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                              {step.title}
                            </h3>
                            
                            <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                              {step.description}
                            </p>
                            
                            <div className="mt-6 w-12 h-1 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="text-center mt-16">
                <p className="text-muted-foreground mb-6">Ready to make smarter food choices?</p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={handleGetStartedClick}
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Start Scanning Now
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section ref={statsRef} className="container mx-auto px-4 py-16" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">EaterIQ Statistics</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="stat-item group">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {productCount ? formatNumber(productCount) : "4.7K+"}
                </div>
                <p className="text-muted-foreground text-lg">Products Analyzed</p>
              </div>
              <div className="stat-item group">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  99.9%
                </div>
                <p className="text-muted-foreground text-lg">Accuracy Rate</p>
              </div>
              <div className="stat-item group">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {userCount ? formatNumber(userCount) : "2.4K+"}
                </div>
                <p className="text-muted-foreground text-lg">Happy Users</p>
              </div>
            </div>
          </section>

          {/* Why Choose EaterIQ Section */}
          <section
            ref={whyRef}
            id="why-eateriq"
            className="bg-muted/30 py-20"
            aria-labelledby="why-heading"
          >
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h2 id="why-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why Choose EaterIQ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We're on a mission to make food transparency accessible to everyone
                </p>
              </header>

              <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyChooseUs.map((item, index) => (
                  <article
                    key={index}
                    className="why-card group bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Quizzes Section */}
          {recentQuizzes && recentQuizzes.length > 0 && (
            <section
              ref={quizzesRef}
              id="quizzes"
              className="py-16"
              aria-labelledby="quizzes-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h2 id="quizzes-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Test Your Food IQ
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Challenge yourself with our AI-generated nutrition quizzes and learn while having fun
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {recentQuizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="group relative overflow-hidden bg-card border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            className={`${getDifficultyColor(quiz.difficulty)} text-xs`}
                          >
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
                          <span>
                            {new Date(quiz.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <Link to={`/quiz/${quiz.slug}/`}>
                          <Button
                            onClick={() => trackCTAClick("play_quiz_from_home")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Play Quiz
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/quiz/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 rounded-full border-2 hover:bg-accent transition-all duration-300"
                    >
                      View All Quizzes
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Featured Blog Section */}
          {recentBlogs && recentBlogs.length > 0 && (
            <section
              ref={blogRef}
              id="blog"
              className="bg-muted/20 py-20"
              aria-labelledby="blog-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h2 id="blog-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Nutrition Insights & Tips
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Expert articles to help you understand nutrition and make healthier choices
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
                  {recentBlogs.map((blog: any) => (
                    <article
                      key={blog.id}
                      className="blog-card group bg-card rounded-xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {blog.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.featured_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          {blog.reading_time && (
                            <>
                              <Clock className="h-3 w-3" />
                              <span>{blog.reading_time} min read</span>
                            </>
                          )}
                          {blog.published_at && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>
                        
                        {blog.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {blog.excerpt}
                          </p>
                        )}
                        
                        <Link 
                          to={`/blog/${blog.slug}/`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/blog/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 rounded-full border-2 hover:bg-accent transition-all duration-300"
                    >
                      View All Articles
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Final CTA Section */}
          <section className="py-20" aria-labelledby="cta-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center bg-primary/5 rounded-3xl p-12 border border-primary/20">
                <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Start Making Healthier Choices Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of health-conscious consumers who use EaterIQ to understand what's really in their food. It's free, fast, and incredibly insightful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={scrollToScanner}
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Your First Product
                  </Button>
                  <Link to="/blog/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 rounded-full border-2 hover:bg-accent/10 transition-all duration-300"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Read Our Blog
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default IndexPage;
