import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Scan } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDetails from '@/components/ProductDetails';
import { useProductLookup } from '@/hooks/useProductLookup';

interface ProductData {
  barcode: string;
  name: string;
  health_score: number;
  unit: string;
  nutrition_per_100g: {
    calories_kcal: number | null;
    total_fat_g: number | null;
    saturated_fat_g: number | null;
    trans_fat_g: number | null;
    cholesterol_mg: number | null;
    carbohydrates_g: number | null;
    sugar_g: number | null;
    fiber_g: number | null;
    protein_g: number | null;
    salt_mg: number | null;
    vitamin_a_iu: number | null;
    vitamin_c_mg: number | null;
    calcium_mg: number | null;
    iron_mg: number | null;
    potassium_mg: number | null;
    magnesium_mg: number | null;
    zinc_mg: number | null;
    allergens: string[];
    additives: string[];
  };
  positives: string[];
  concerns: string[];
  recommendations: string[];
  images: string[];
}

const FoodScannerPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [showNoDataState, setShowNoDataState] = useState(false);
  const { lookupProduct, isLoading } = useProductLookup();

  const handleScan = async (scannedCode: string) => {
    console.log('Scanned barcode:', scannedCode);
    setIsScanning(false);
    setShowNoDataState(false);
    
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
                onClick={handleManualLookup}
                disabled={isLoading || !manualBarcode.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Try scanning: 3017620422003 (Nutella) or 7622202225512 (Oreo)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Section */}
      <ProductDetails 
        product={currentProduct} 
        isLoading={isLoading} 
        showNoDataState={showNoDataState}
      />
    </div>
  );
};

export default FoodScannerPage;
