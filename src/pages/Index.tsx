
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scan, Smartphone } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Scan className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI-Powered Barcode Scanner</h1>
              <p className="text-muted-foreground">Scan products for AI-enhanced details, ratings, and buying suggestions</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Scanner Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={20} />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarcodeScanner 
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">How to scan:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Click "Start Scan" to activate the camera</li>
                    <li>• Point your camera at a barcode</li>
                    <li>• Keep the barcode within the red frame</li>
                    <li>• The app will automatically detect and scan the code</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-8" />

        {/* Product Details Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Product Analysis & Buying Guide
          </h2>
          <ProductDetails product={currentProduct} isLoading={isLoading} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Scan any product barcode to get instant AI-powered analysis, ratings, and buying recommendations.</p>
          <p className="mt-1">Supports UPC, EAN, and other common barcode formats with ChatGPT integration.</p>
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
