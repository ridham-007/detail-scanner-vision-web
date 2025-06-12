
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
    <div className="relative w-full h-64 sm:h-72 lg:h-80 bg-muted rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-border/50">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Enhanced scanning overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-3 sm:inset-4 border-2 border-primary/70 rounded-xl bg-transparent shadow-lg">
          {/* Enhanced corner indicators */}
          <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 border-destructive rounded-tl-xl shadow-md"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 border-destructive rounded-tr-xl shadow-md"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 border-destructive rounded-bl-xl shadow-md"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 border-destructive rounded-br-xl shadow-md"></div>
        </div>
        
        {/* Enhanced animated scanning line */}
        {isScanning && (
          <div className="absolute inset-3 sm:inset-4 overflow-hidden rounded-xl">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-90 animate-pulse shadow-lg"></div>
          </div>
        )}
      </div>

      {/* Enhanced status indicator */}
      {isScanning && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-background/95 text-foreground px-3 py-2 rounded-full text-xs sm:text-sm font-medium border border-border/50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse shadow-sm"></div>
            <span className="hidden sm:inline">Scanning for barcode...</span>
            <span className="sm:hidden">Scanning...</span>
          </div>
        </div>
      )}

      {/* Enhanced controls */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        <button
          onClick={onToggleScanning}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
            isScanning 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
          <span className="hidden sm:inline">{isScanning ? 'Stop' : 'Start'} Scan</span>
          <span className="sm:hidden">{isScanning ? 'Stop' : 'Start'}</span>
        </button>
        
        {hasFlash && isScanning && (
          <button
            onClick={toggleFlash}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full font-medium shadow-xl bg-background/95 hover:bg-background text-foreground border border-border/50 backdrop-blur-sm transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
          >
            {flashOn ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
            <span className="hidden sm:inline">Flash</span>
          </button>
        )}
      </div>

      {/* Enhanced instructions overlay when not scanning */}
      {!isScanning && (
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-muted/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-4 sm:p-6 max-w-sm">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4 border border-primary/20">
              <Camera size={32} className="sm:w-12 sm:h-12 text-primary" />
            </div>
            <p className="text-lg sm:text-xl font-semibold mb-2">Ready to Scan</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click "Start Scan" to activate your camera and begin scanning barcodes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
