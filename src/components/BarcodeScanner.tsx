
import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-barcode-scanner';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, isScanning, onToggleScanning }) => {
  const [scanError, setScanError] = useState<string>('');
  const { toast } = useToast();

  console.log('BarcodeScanner render - isScanning:', isScanning);

  const handleScan = (result: string) => {
    if (result && result.trim()) {
      console.log('Barcode detected:', result);
      
      onScan(result);
      toast({
        title: "Barcode Scanned Successfully!",
        description: `Code: ${result}`,
      });
      
      // Stop scanning after successful scan
      onToggleScanning();
    }
  };

  const handleError = (error: any) => {
    console.error('Scanner error:', error);
    const errorMessage = error?.message || 'Scanner error occurred';
    setScanError(errorMessage);
    
    toast({
      title: "Scanner Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleToggleClick = () => {
    console.log('Toggle button clicked, current isScanning:', isScanning);
    setScanError('');
    onToggleScanning();
  };

  return (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      {isScanning ? (
        <div className="w-full h-full">
          <BarcodeScannerComponent
            width="100%"
            height="100%"
            onUpdate={(err, result) => {
              if (err) {
                handleError(err);
                return;
              }
              if (result) {
                handleScan(result.text);
              }
            }}
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 border-2 border-primary/80 rounded-lg bg-transparent">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-destructive rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-destructive rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-destructive rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-destructive rounded-br-lg"></div>
            </div>
            
            <div className="absolute inset-4 overflow-hidden rounded-lg">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-80 animate-pulse"></div>
            </div>
          </div>

          {/* Scanning status */}
          <div className="absolute top-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-medium border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Scanning...
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
          <div className="text-center p-6">
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Ready to Scan</p>
            <p className="text-sm text-muted-foreground">
              Click "Start Scan" to begin
            </p>
            {scanError && (
              <p className="text-sm text-destructive mt-2">
                {scanError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Control button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={handleToggleClick}
          variant={isScanning ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
          {isScanning ? 'Stop' : 'Start'} Scan
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
