import React from "react";
import {
  Brain,
  Scan,
  Zap,
  Shield,
  Heart,
  Leaf,
  Award,
  CheckCircle,
  Play,
  QrCode,
  TrendingUp,
  Calendar,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  AlertTriangle,
  ListChecks,
  Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AnimatedBackground from "@/components/AnimatedBackground";
import FoodScannerPage from "./FoodScannerPage";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackCTAClick } from "@/utils/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const IndexPage: React.FC = () => {
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
    document.getElementById("scanner")?.scrollIntoView({
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

  const features = [
    {
      icon: BarChart3,
      title: "Health Score Analysis",
      description: "Get instant health scores based on nutritional content, additives, and processing level.",
    },
    {
      icon: AlertTriangle,
      title: "Additive Detection",
      description: "Identify harmful additives, preservatives, and artificial ingredients in your food.",
    },
    {
      icon: ListChecks,
      title: "Allergen Alerts",
      description: "Automatic detection of common allergens like gluten, dairy, nuts, and more.",
    },
    {
      icon: TrendingUp,
      title: "Better Alternatives",
      description: "Discover healthier product alternatives in the same category.",
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
    "description": "Food scanner that analyzes nutrition, ingredients, and additives to help you make healthier food choices.",
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
        title="EaterIQ - Food Scanner for Healthier Choices | Free Nutrition Analysis"
        description="Scan any food product barcode and instantly get nutrition analysis, health scores, ingredient warnings, and healthier alternatives. 100% free, no sign-up required."
        keywords="food scanner, nutrition analysis, healthy eating, barcode scanner, ingredient checker, health score, food additives, allergen detection, nutrition app"
        canonicalUrl="https://www.eateriq.com/"
        type="website"
        ogTitle="EaterIQ - Make Smarter Food Choices"
        ogDescription="Free food scanner. Analyze nutrition, detect harmful additives, and find healthier alternatives instantly."
        structuredData={homeStructuredData}
      />
      
      <div className="min-h-screen bg-background">
        <AnimatedBackground />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
                
                {/* Left Column - Content */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center">
                  <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-4">
                    Know What's in{" "}
                    <span className="text-primary">Your Food</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                    Scan any product barcode to get instant health scores, ingredient analysis, and healthier alternatives.
                  </p>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base font-semibold rounded-xl"
                      onClick={scrollToScanner}
                    >
                      <Scan className="mr-2 h-5 w-5" />
                      Try It Free
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span>No Sign-up</span>
                    </div>
                  </div>

                  {/* App Store Badges */}
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <a
                      href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download on the App Store"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                        alt="Download on the App Store"
                        className="h-[36px]"
                        loading="lazy"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.eateriq"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Get it on Google Play"
                      className="transition-opacity hover:opacity-80"
                    >
                      <img
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt="Get it on Google Play"
                        className="h-[54px] -my-[9px]"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </div>

                {/* Right Column - Phone Mockup with Food Background */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 order-1 lg:order-2 flex justify-center items-center relative overflow-hidden">
                  {/* Food Background Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 text-4xl opacity-[0.06]">🥗</div>
                    <div className="absolute top-1/4 right-6 text-3xl opacity-[0.05]">🍎</div>
                    <div className="absolute bottom-1/3 left-8 text-3xl opacity-[0.05]">🥑</div>
                    <div className="absolute bottom-8 right-10 text-4xl opacity-[0.06]">🥕</div>
                    <div className="absolute top-1/2 left-1/4 text-2xl opacity-[0.04]">🍇</div>
                    <div className="absolute bottom-1/4 right-1/4 text-2xl opacity-[0.04]">🥦</div>
                  </div>

                  <div className="relative animate-fade-in z-10">
                    {/* Phone Frame */}
                    <div className="relative w-[240px] md:w-[260px] bg-foreground rounded-[2.5rem] p-2 shadow-2xl">
                      <div className="bg-background rounded-[2.2rem] overflow-hidden">
                        {/* Status Bar */}
                        <div className="h-6 bg-background px-5 flex items-center justify-between">
                          <span className="text-[9px] font-medium text-foreground">9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-[2px]">
                              <div className="w-[2px] h-[8px] bg-foreground rounded-sm" />
                              <div className="w-[2px] h-[6px] bg-foreground rounded-sm" />
                              <div className="w-[2px] h-[5px] bg-foreground rounded-sm" />
                              <div className="w-[2px] h-[3px] bg-muted-foreground rounded-sm" />
                            </div>
                            <div className="w-5 h-2.5 border border-foreground rounded-sm relative ml-1">
                              <div className="absolute inset-[1px] right-0.5 bg-primary rounded-[1px]" />
                              <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-[3px] bg-foreground rounded-r-sm" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Dynamic Island */}
                        <div className="flex justify-center -mt-0.5 mb-1.5">
                          <div className="w-20 h-6 bg-foreground rounded-full" />
                        </div>
                        
                        {/* App Content Preview */}
                        <div className="px-3 pb-3">
                          {/* App Header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-foreground">EaterIQ</span>
                            <div className="w-6 h-6 bg-muted rounded-full" />
                          </div>

                          {/* Product Card Preview */}
                          <div className="bg-card border border-border rounded-xl p-3 mb-2 shadow-sm">
                            <div className="flex items-start gap-2 mb-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-6 h-8 bg-muted-foreground/20 rounded" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-foreground mb-0.5 truncate">Organic Granola</div>
                                <div className="text-[10px] text-muted-foreground">Nature Valley</div>
                              </div>
                            </div>
                            
                            {/* Health Score */}
                            <div className="flex items-center justify-between bg-primary/10 rounded-lg p-2">
                              <span className="text-[10px] font-medium text-foreground">Health Score</span>
                              <div className="flex items-center gap-0.5">
                                <span className="text-lg font-bold text-primary">85</span>
                                <span className="text-[8px] text-muted-foreground">/100</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Info Tags */}
                          <div className="flex gap-1.5 mb-2">
                            <div className="flex-1 bg-card border border-border rounded-lg py-1.5 px-2 text-center">
                              <Leaf className="h-3 w-3 text-primary mx-auto mb-0.5" />
                              <span className="text-[8px] text-muted-foreground block">Organic</span>
                            </div>
                            <div className="flex-1 bg-card border border-border rounded-lg py-1.5 px-2 text-center">
                              <CheckCircle className="h-3 w-3 text-primary mx-auto mb-0.5" />
                              <span className="text-[8px] text-muted-foreground block">Low Sugar</span>
                            </div>
                            <div className="flex-1 bg-card border border-border rounded-lg py-1.5 px-2 text-center">
                              <Shield className="h-3 w-3 text-primary mx-auto mb-0.5" />
                              <span className="text-[8px] text-muted-foreground block">Safe</span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="bg-primary rounded-lg py-2 text-center">
                            <span className="text-[10px] font-semibold text-primary-foreground">View Full Analysis</span>
                          </div>
                        </div>
                        
                        {/* Home Indicator */}
                        <div className="flex justify-center pb-1.5">
                          <div className="w-24 h-1 bg-foreground/30 rounded-full" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Stats Badges */}
                    <div className="absolute -bottom-2 -left-2 bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-medium text-foreground">
                          {productCount ? formatNumber(productCount) : "23K+"} Products
                        </span>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-medium text-foreground">
                          {userCount ? formatNumber(userCount) : "14K+"} Users
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scanner Section */}
          <section
            id="scanner"
            className="container mx-auto px-4 py-16 scroll-mt-20"
            aria-labelledby="scanner-heading"
          >
            <h2 id="scanner-heading" className="sr-only">Food Product Scanner</h2>
            <div className="max-w-6xl mx-auto">
              <FoodScannerPage />
            </div>
          </section>

          {/* How It Works Section */}
          <section
            id="how-it-works"
            className="bg-muted/30 py-20"
            aria-labelledby="how-it-works-heading"
          >
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  How EaterIQ Works
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Three simple steps to make informed food choices
                </p>
              </header>

              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    icon: QrCode,
                    title: "Scan Barcode",
                    description: "Use your camera to scan any product barcode, or search by name in our database of millions of products.",
                  },
                  {
                    step: "2",
                    icon: Search,
                    title: "Detailed Analysis",
                    description: "Our system analyzes ingredients, nutrition facts, additives, and allergens to calculate a comprehensive health score.",
                  },
                  {
                    step: "3",
                    icon: TrendingUp,
                    title: "Get Insights",
                    description: "Receive personalized health insights, ingredient warnings, and recommendations for healthier alternatives.",
                  },
                ].map((item, index) => (
                  <article key={index} className="relative text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </article>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  onClick={scrollToScanner}
                >
                  Try It Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>


          {/* Why Choose EaterIQ Section */}
          <section
            id="why-eateriq"
            className="bg-muted/20 py-20"
            aria-labelledby="why-heading"
          >
            <div className="container mx-auto px-4">
              <header className="text-center mb-16">
                <h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose EaterIQ?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We're on a mission to make food transparency accessible to everyone
                </p>
              </header>

              <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyChooseUs.map((item, index) => (
                  <article
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
              id="quizzes"
              className="py-16"
              aria-labelledby="quizzes-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-12">
                  <h2 id="quizzes-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Test Your Food Knowledge
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Challenge yourself with our nutrition quizzes and learn while having fun
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {recentQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="bg-card border-2 shadow-md">
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
                    <Button variant="outline" size="lg" className="px-8 border-2">
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
              id="blog"
              className="bg-muted/30 py-20"
              aria-labelledby="blog-heading"
            >
              <div className="container mx-auto px-4">
                <header className="text-center mb-12">
                  <h2 id="blog-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Nutrition Insights & Tips
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Expert articles to help you understand nutrition and make healthier choices
                  </p>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
                  {recentBlogs.map((blog: any) => (
                    <article
                      key={blog.id}
                      className="bg-card rounded-xl overflow-hidden border border-border shadow-md"
                    >
                      {blog.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.featured_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
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
                        
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          <Link to={`/blog/${blog.slug}/`} className="hover:text-primary">
                            {blog.title}
                          </Link>
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
                          Read Article
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/blog/">
                    <Button variant="outline" size="lg" className="px-8 border-2">
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
              <div className="max-w-4xl mx-auto text-center bg-primary/5 rounded-2xl p-12 border border-primary/20">
                <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Start Making Healthier Choices Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of health-conscious consumers who use EaterIQ to understand what's really in their food. 
                  It's free, fast, and incredibly insightful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg"
                    onClick={scrollToScanner}
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Your First Product
                  </Button>
                  <Link to="/quiz/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg rounded-xl border-2"
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Take a Quiz
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
