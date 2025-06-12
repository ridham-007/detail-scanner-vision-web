
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
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning && videoRef.current && codeReader.current) {
      startScanning();
    } else if (!isScanning && codeReader.current) {
      codeReader.current.reset();
    }
  }, [isScanning]);

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      videoRef.current.srcObject = stream;
      
      // Check if device has flash
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      setHasFlash('torch' in capabilities);

      codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          console.log('Barcode scanned:', result.getText());
          onScan(result.getText());
          toast({
            title: "Barcode Scanned",
            description: `Code: ${result.getText()}`,
          });
        }
        if (error && error.name !== 'NotFoundException') {
          console.error('Scanning error:', error);
        }
      });
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleFlash = async () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn }]
        });
        setFlashOn(!flashOn);
      } catch (error) {
        console.error('Flash toggle error:', error);
      }
    }
  };

  return (
    <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Scanning overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-4 border-2 border-primary rounded-lg">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
        </div>
        
        {/* Scanning line animation */}
        {isScanning && (
          <div className="absolute inset-4 overflow-hidden rounded-lg">
            <div className="animate-pulse w-full h-0.5 bg-red-500 shadow-lg shadow-red-500/50 animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          onClick={onToggleScanning}
          variant={isScanning ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
          {isScanning ? 'Stop' : 'Start'} Scan
        </Button>
        
        {hasFlash && isScanning && (
          <Button
            onClick={toggleFlash}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {flashOn ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
            Flash
          </Button>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
