
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scan, Smartphone, Sparkles } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDetails from '@/components/ProductDetails';
import ThemeToggle from '@/components/ThemeToggle';
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

  const startNewScan = () => {
    setCurrentProduct(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background transition-all duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <Scan className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Barcode Scanner
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Scan products to get detailed information instantly
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Enhanced Scanner Section */}
        <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Smartphone size={20} className="text-primary" />
              Camera Scanner
              <Sparkles size={16} className="text-yellow-500 ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <BarcodeScanner 
                onScan={handleScan}
                isScanning={isScanning}
                onToggleScanning={toggleScanning}
              />
            </div>
            
            {/* Enhanced Instructions */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/50">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-2 text-foreground">How to scan:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Click "Start Scan" to activate camera
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Point camera at barcode
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Keep barcode within red frame
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Auto-detection & scanning
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Again Button */}
            {currentProduct && !isScanning && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={startNewScan}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Scan size={16} />
                  Scan Another Product
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="mb-6 sm:mb-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Enhanced Product Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Product Details</h2>
            {currentProduct && (
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                Scanned Successfully
              </div>
            )}
          </div>
          <ProductDetails product={currentProduct} isLoading={isLoading} />
        </div>

        {/* Enhanced Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-muted/30 to-muted/50 rounded-2xl border border-border/50">
            <div className="max-w-2xl mx-auto space-y-2">
              <p className="text-sm sm:text-base font-medium text-foreground">
                🚀 Scan any product barcode to get instant details and information
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Supports UPC, EAN, Code 128, and other common barcode formats
              </p>
            </div>
          </div>
        </div>
      </div>
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
