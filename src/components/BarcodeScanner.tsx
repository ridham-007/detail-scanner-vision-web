import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, CameraOff, Flashlight, FlashlightOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Quagga from "@ericblade/quagga2";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
  onDetected: (data: any) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  isScanning,
  onToggleScanning,
  onDetected,
}) => {
  const [scanError, setScanError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  const scannerRef = useRef<HTMLDivElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef<boolean>(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  console.log(
    "BarcodeScanner render - isScanning:",
    isScanning,
    "isInitialized:",
    isInitialized
  );

  useEffect(() => {
    console.log("Initializing BarcodeScanner...");
    codeReader.current = new BrowserMultiFormatReader();
    setIsInitialized(true);

    return () => {
      console.log("Cleaning up BarcodeScanner...");
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      if (scannerRef.current) {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                facingMode: "environment",
              },
            },
            decoder: {
              readers: [
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
                "code_128_reader",
              ],
            },
          },
          (err) => {
            if (err) {
              console.error("Quagga init failed:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected(onDetected);
      }
    }
    // Clean up on stop
    return () => {
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
  }, [isScanning]);

  useEffect(() => {
    console.log("isScanning changed:", isScanning);
    if (isScanning && videoRef.current && codeReader.current && isInitialized) {
      startScanning();
    } else if (!isScanning) {
      stopScanning();
    }
  }, [isScanning, isInitialized]);

  const startScanning = async () => {
    console.log("startScanning called");
    if (!codeReader.current || !videoRef.current || scanningRef.current) {
      console.error("Scanner not available or already scanning");
      return;
    }

    try {
      console.log("Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      console.log("Camera stream obtained");
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      scanningRef.current = true;

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities && "torch" in capabilities) {
        setHasFlash(true);
        console.log("Flash capability detected");
      }

      // Wait for video to load and then start scanning
      const startBarcodeDetection = () => {
        console.log("Starting barcode detection...");

        if (codeReader.current && videoRef.current && scanningRef.current) {
          // Use decodeOnceFromVideoDevice for better control
          const scanLoop = async () => {
            while (
              scanningRef.current &&
              videoRef.current &&
              codeReader.current
            ) {
              try {
                const result =
                  await codeReader.current.decodeOnceFromVideoDevice(
                    undefined,
                    videoRef.current
                  );
                if (result && scanningRef.current) {
                  console.log("Barcode detected:", result.getText());

                  // Stop scanning immediately after detection
                  scanningRef.current = false;

                  onScan(result.getText());
                  toast({
                    title: "Barcode Scanned Successfully!",
                    description: `Code: ${result.getText()}`,
                  });

                  // Stop the scanning process
                  onToggleScanning();
                  break;
                }
              } catch (error: any) {
                // NotFoundException is expected when no barcode is found
                if (error.name !== "NotFoundException") {
                  console.log("Scanner error:", error.name);
                }
                // Continue scanning only if still active
                if (scanningRef.current) {
                  await new Promise((resolve) => setTimeout(resolve, 100));
                }
              }
            }
          };

          scanLoop();
        }
      };

      // Start detection when video is ready
      if (videoRef.current.readyState >= 2) {
        startBarcodeDetection();
      } else {
        videoRef.current.addEventListener("loadeddata", startBarcodeDetection, {
          once: true,
        });
      }

      toast({
        title: "Camera Started",
        description: "Point your camera at a barcode to scan",
      });
    } catch (error) {
      console.error("Camera access error:", error);
      scanningRef.current = false;
      let errorMessage = "Unable to access camera. ";

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage += "Please allow camera permission and try again.";
        } else if (error.name === "NotFoundError") {
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
    console.log("Stopping scanner...");
    scanningRef.current = false;

    if (codeReader.current) {
      codeReader.current.reset();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setFlashOn(false);
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
        description: `Flash ${flashOn ? "disabled" : "enabled"}`,
      });
    } catch (error) {
      console.error("Flash toggle error:", error);
      toast({
        title: "Flash Error",
        description: "Unable to control flash on this device",
        variant: "destructive",
      });
    }
  };

  const handleToggleClick = () => {
    console.log(
      "Toggle button clicked, current isScanning:",
      isScanning,
      "isInitialized:",
      isInitialized
    );
    setScanError('');
    if (isInitialized) {
      onToggleScanning();
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

      <div className="absolute inset-0">
        <div className="absolute inset-4 border-2 border-primary/80 rounded-lg bg-transparent">
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-destructive rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-destructive rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-destructive rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-destructive rounded-br-lg"></div>
        </div>

        {isScanning && (
          <div>
            <div
              ref={scannerRef}
              className="absolute inset-4 overflow-hidden rounded-lg"
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-80 animate-pulse"></div>
            </div>

            <div className="absolute top-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-medium border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                Scanning...
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
          <Button
            onClick={handleToggleClick}
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

        {!isScanning && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
            <div ref={scannerRef} className="text-center p-6">
              {/* <Camera size={48} className="mx-auto mb-4 text-muted-foreground" /> */}
              <p className="text-lg font-medium mb-2">Ready to Scan</p>
              <p className="text-sm text-muted-foreground">
                {!isInitialized
                  ? "Initializing..."
                  : 'Click "Start Scan" to begin'}
              </p>
              {scanError && (
                <p className="text-sm text-destructive mt-2">{scanError}</p>
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
            {isScanning ? "Stop" : "Start"} Scan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
