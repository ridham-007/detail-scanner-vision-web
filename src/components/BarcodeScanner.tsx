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
      } catch (error) {
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
    <div 
      className="relative h-72 w-full overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,250,244,0.9),rgba(255,237,213,0.4))]"
      role="region"
      aria-label="Barcode scanner"
      aria-live="polite"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-4 rounded-[24px] border-2 border-primary/40 bg-transparent">
        </div>

        <div
          ref={scannerRef}
          className="absolute inset-4 overflow-hidden rounded-[24px]"
          aria-hidden={!isScanning}
        >
          <div className="h-1.5 w-full animate-pulse bg-orange-500/90" aria-hidden="true"></div>
        </div>

        <div className="flex flex-col !items-center !justify-center">
          <div className="!flex flex-col">
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/78 backdrop-blur-[2px]">
                <div className="rounded-[24px] border border-white/70 bg-white/80 px-8 py-6 text-center shadow-[var(--shadow-soft)]">
                  <p className="text-lg font-semibold text-center text-foreground">Ready to Scan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isInitialized
                      ? 'Click "Start Scan" to begin'
                      : "Initializing..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-7 left-1/2 z-50 flex -translate-x-1/2 transform gap-2">
            <Button
              aria-label={isScanning ? "Stop Scan" : "Start Scan"}
              onClick={onToggleScanning}
              variant={isScanning ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-2 rounded-2xl shadow-[var(--shadow-warm)]"
              disabled={!isInitialized}
            >
              {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
              {isScanning ? "Stop" : "Start"} Scan
            </Button>

            {hasFlash && isScanning && (
              <Button
                aria-label="Toggle Flash"
                onClick={toggleFlash}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-2xl border-orange-100/80 bg-background/90 shadow-[var(--shadow-soft)]"
              >
                {flashOn ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
                Flash
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
