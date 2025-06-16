
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scan, Smartphone, Sparkles, Target, Zap } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDetails from '@/components/ProductDetails';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useProductLookup } from '@/hooks/useProductLookup';

const IndexContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { lookupProduct, isLoading } = useProductLookup();

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

  // Handle scan detection
  const onDetected = (data: any) => {
    if (data?.codeResult?.code) {
      const scannedCode = data.codeResult.code;
      console.log('Scanned:', scannedCode);
      setIsScanning(false); // stop scanning
      handleScan(scannedCode);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <AnimatedBackground />
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Product Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Scan. Analyze. Discover.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform any barcode into instant insights with our advanced AI scanner.
            Get nutritional analysis, smart recommendations, and detailed product information in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50 hover-scale animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Scan className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Scanning</h3>
            <p className="text-sm text-muted-foreground">Advanced camera recognition for instant barcode detection</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50 hover-scale animate-fade-in delay-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">Comprehensive product analysis powered by artificial intelligence</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/50 hover-scale animate-fade-in delay-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
            <p className="text-sm text-muted-foreground">Get detailed information and recommendations immediately</p>
          </div>
        </div>

        {/* Scanner Section */}
        <Card className="mb-8 overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Smartphone size={24} />
              </div>
              Camera Scanner
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm opacity-90">Ready</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <BarcodeScanner
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
              onDetected={onDetected}
            />

            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                  <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Quick Start Guide:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span>Click "Start Scan" to activate camera</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span>Point camera at any barcode</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span>Keep barcode within the frame</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span>Get instant AI analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Product Details Section */}
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-100 bg-clip-text text-transparent">
              AI-Powered Product Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI analyzes your scanned products to provide comprehensive insights,
              nutritional breakdowns, and personalized recommendations.
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
