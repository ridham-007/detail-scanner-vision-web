
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scan, Brain } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import QuizzesPage from './QuizzesPage';
import FoodScannerPage from './FoodScannerPage';

const IndexPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("scanner");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Food Scanner
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <FoodScannerPage />
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <QuizzesPage />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default IndexPage;
