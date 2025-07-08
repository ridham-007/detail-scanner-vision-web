
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Scan } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDetails from '@/components/ProductDetails';
import { useProductLookup } from '@/hooks/useProductLookup';
import { ProductData } from '@/types/ProductData';

const FoodScannerPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [showNoDataState, setShowNoDataState] = useState(false);
  const { lookupProduct, isLoading } = useProductLookup();
  const productDetailsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    setTimeout(() => {
      productDetailsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
      });
    }, 10);
  };

  const handleScan = async (scannedCode: string) => {
    console.log('Scanned barcode:', scannedCode);
    setIsScanning(false);
    setShowNoDataState(false);
    scrollToResults();
    
    const product = await lookupProduct(scannedCode);
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const handleManualLookup = async () => {
    if (!manualBarcode.trim()) return;
    
    setShowNoDataState(false);
    scrollToResults();
    
    const product = await lookupProduct(manualBarcode.trim());
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct(null);
      setShowNoDataState(true);
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Food Scanner</h2>
        <p className="text-muted-foreground">
          Scan barcodes or enter them manually to get detailed product information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Barcode Scanner
            </CardTitle>
            <CardDescription>
              Point your camera at a product barcode to scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarcodeScanner 
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />
          </CardContent>
        </Card>

        {/* Manual Entry Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Enter a barcode number manually if scanning doesn't work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter barcode number..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLookup()}
              />
              <Button 
                aria-label="Search"
                onClick={handleManualLookup}
                disabled={isLoading || !manualBarcode.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Try scanning: 8906000610077 (Crispy Potatoes) or 8906019779840 (Mix Dry Fruits)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Section */}
      <div ref={productDetailsRef}>
        <ProductDetails 
          product={currentProduct} 
          isLoading={isLoading} 
          showNoDataState={showNoDataState}
        />
      </div>
    </div>
  );
};

export default FoodScannerPage;
