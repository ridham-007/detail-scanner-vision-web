
import React from 'react';
import { Brain, Scan, Zap, Shield, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import FoodScannerPage from './FoodScannerPage';

const IndexPage: React.FC = () => {
  const features = [
    {
      icon: Scan,
      title: "Smart Barcode Scanner",
      description: "Instantly scan any food product barcode to get detailed nutritional information and health insights."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI analyzes ingredients and provides personalized recommendations for better eating choices."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive health scores and recommendations in seconds, not minutes."
    },
    {
      icon: Shield,
      title: "Health Focused",
      description: "Identify potential allergens, additives, and nutritional concerns before you consume."
    }
  ];

  const benefits = [
    "Make informed food choices instantly",
    "Discover hidden ingredients and additives",
    "Get personalized health recommendations",
    "Track your food choices over time",
    "Learn through interactive quizzes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-emerald-600 mr-4" />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                EaterIQ
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-2">
                Smart Food Intelligence & AI-Powered Quizzes
              </p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform any barcode into instant food insights. Get AI-powered health scores, 
            ingredient analysis, and personalized recommendations to make smarter eating choices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
              Start Scanning Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
              Take a Quiz
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose EaterIQ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Scan the Barcode</h3>
                    <p className="text-muted-foreground">Use your camera to scan any food product barcode quickly and easily.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Analysis</h3>
                    <p className="text-muted-foreground">Our AI instantly analyzes ingredients, nutrition, and health impact.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Insights</h3>
                    <p className="text-muted-foreground">Receive detailed health scores and personalized recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">What You'll Discover:</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Scanner Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to make smarter food choices? Scan your first product below and see the power of EaterIQ in action.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FoodScannerPage />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Eating Habits?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making smarter food choices with EaterIQ's AI-powered insights.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700">
            Get Started Today
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
