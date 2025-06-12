
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, CameraOff, Flashlight, FlashlightOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, isScanning, onToggleScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning && videoRef.current && codeReader.current) {
      startScanning();
    } else if (!isScanning) {
      stopScanning();
    }
  }, [isScanning]);

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return;

    try {
      // Request camera permission with better constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      // Check if device has flash
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      setHasFlash(!!(capabilities as any).torch);

      // Start barcode detection with better error handling
      codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          console.log('Barcode detected:', result.getText());
          onScan(result.getText());
          toast({
            title: "Barcode Scanned Successfully!",
            description: `Code: ${result.getText()}`,
          });
          // Stop scanning after successful scan
          onToggleScanning();
        }
        // Only log errors that aren't "NotFoundException" (normal when no barcode is visible)
        if (error && error.name !== 'NotFoundException') {
          console.log('Scanner error (non-critical):', error.name);
        }
      });

      toast({
        title: "Camera Started",
        description: "Point your camera at a barcode to scan",
      });

    } catch (error) {
      console.error('Camera access error:', error);
      let errorMessage = "Unable to access camera. ";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += "Please allow camera permission and try again.";
        } else if (error.name === 'NotFoundError') {
          errorMessage += "No camera found on this device.";
        } else {
          errorMessage += "Please check camera permissions.";
        }
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset scanning state on error
      onToggleScanning();
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setFlashOn(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    
    const track = streamRef.current.getVideoTracks()[0];
    try {
      // Use proper constraint format for torch
      await track.applyConstraints({
        advanced: [{ torch: !flashOn } as any]
      });
      setFlashOn(!flashOn);
      toast({
        title: flashOn ? "Flash Off" : "Flash On",
        description: `Flash ${flashOn ? 'disabled' : 'enabled'}`,
      });
    } catch (error) {
      console.error('Flash toggle error:', error);
      toast({
        title: "Flash Error",
        description: "Unable to control flash on this device",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Scanning overlay with improved visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-4 border-2 border-primary/80 rounded-lg bg-transparent">
          {/* Corner indicators */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-destructive rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-destructive rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-destructive rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-destructive rounded-br-lg"></div>
        </div>
        
        {/* Animated scanning line */}
        {isScanning && (
          <div className="absolute inset-4 overflow-hidden rounded-lg">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-80 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Enhanced status indicator */}
      {isScanning && (
        <div className="absolute top-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-medium border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            Scanning...
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          onClick={onToggleScanning}
          variant={isScanning ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
          {isScanning ? 'Stop' : 'Start'} Scan
        </Button>
        
        {hasFlash && isScanning && (
          <Button
            onClick={toggleFlash}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 shadow-lg bg-background/90"
          >
            {flashOn ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
            Flash
          </Button>
        )}
      </div>

      {/* Instructions overlay when not scanning */}
      {!isScanning && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
          <div className="text-center p-6">
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Ready to Scan</p>
            <p className="text-sm text-muted-foreground">Click "Start Scan" to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
