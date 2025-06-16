import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, CameraOff, Flashlight, FlashlightOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  isScanning,
  onToggleScanning,
}) => {
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef<boolean>(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    setIsInitialized(true);

    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [isScanning]);

  const startScanning = async () => {
    if (!codeReader.current || scanningRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: 1280,
          height: 720,
        },
      });

      streamRef.current = stream;
      scanningRef.current = true;

      // Attach stream directly to scannerRef div using Object URL
      if (scannerRef.current) {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("autoplay", "true");
        video.setAttribute("muted", "true");
        video.setAttribute("playsinline", "true");
        video.style.width = "100%";
        // video.style.height = "100%";
        scannerRef.current.innerHTML = "";
        scannerRef.current.appendChild(video);

        video.addEventListener("loadeddata", () => {
          detectLoop(video);
        });

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if (capabilities && "torch" in capabilities) {
          setHasFlash(true);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Error",
        description: "Please allow camera permission or check device camera.",
        variant: "destructive",
      });
      onToggleScanning();
    }
  };

  const detectLoop = async (video: HTMLVideoElement) => {
    if (!codeReader.current) return;

    while (scanningRef.current) {
      try {
        const result = await codeReader.current.decodeFromVideoElement(video);
        if (result) {
          scanningRef.current = false;
          onScan(result.getText());
          toast({
            title: "Scanned!",
            description: `Code: ${result.getText()}`,
          });
          onToggleScanning();
          break;
        }
      } catch (error: any) {
        if (error?.name !== "NotFoundException") {
          console.error("Detection error:", error);
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  };

  const stopScanning = () => {
    scanningRef.current = false;
    codeReader.current?.reset();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (scannerRef.current) {
      scannerRef.current.innerHTML = "";
    }
    setFlashOn(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !flashOn } as MediaTrackConstraintSet],
      });
      setFlashOn(!flashOn);
      toast({
        title: flashOn ? "Flash Off" : "Flash On",
        description: flashOn ? "Flash disabled" : "Flash enabled",
      });
    } catch (error) {
      console.error("Flash error:", error);
      toast({
        title: "Flash Error",
        description: "Unable to toggle flash",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-4 border-2 border-primary/80 rounded-lg bg-transparent">
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-destructive rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-destructive rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-destructive rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-destructive rounded-br-lg"></div>
        </div>

        <div
          ref={scannerRef}
          className="absolute inset-4 overflow-hidden rounded-lg"
        >
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-80 animate-pulse"></div>
        </div>

        {!isScanning && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
            <p className="text-lg font-medium mb-2">Ready to Scan</p>
            <p className="text-sm text-muted-foreground">
              {isInitialized
                ? 'Click "Start Scan" to begin'
                : "Initializing..."}
            </p>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
          <Button
            onClick={onToggleScanning}
            variant={isScanning ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2 shadow-lg"
            disabled={!isInitialized}
          >
            {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
            {isScanning ? "Stop" : "Start"} Scan
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
      </div>
    </div>
  );
};

export default BarcodeScanner;
