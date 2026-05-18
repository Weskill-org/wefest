import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Loader2, AlertTriangle } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
}

const scanStyles = `
@keyframes scan-line-movement {
  0% { top: 5%; }
  50% { top: 95%; }
  100% { top: 5%; }
}
.animate-scan-line {
  position: absolute;
  left: 5%;
  width: 90%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #a855f7, transparent);
  box-shadow: 0 0 8px #a855f7, 0 0 12px #a855f7;
  animation: scan-line-movement 2.5s ease-in-out infinite;
  pointer-events: none;
}
`;

export function QRScanner({ 
  onScanSuccess, 
  onScanFailure, 
  fps = 10, 
  qrbox = 250,
  aspectRatio = 1.0
}: QRScannerProps) {
  const [cameraState, setCameraState] = useState<"initializing" | "active" | "error">("initializing");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const elementId = "qr-reader-container";

  useEffect(() => {
    let isMounted = true;
    let qrScannerInstance: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        // Short delay to ensure Radix UI Dialog open animation finishes and mounts element in DOM
        await new Promise((resolve) => setTimeout(resolve, 350));
        
        if (!isMounted) return;

        // Create new instance of Html5Qrcode
        const scanner = new Html5Qrcode(elementId);
        qrCodeRef.current = scanner;
        qrScannerInstance = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps,
            qrbox: (width, height) => {
              // Custom responsive qrbox function to support small screens perfectly
              const minDim = Math.min(width, height);
              const size = Math.min(minDim * 0.7, qrbox);
              return { width: size, height: size };
            },
            aspectRatio,
          },
          (decodedText) => {
            if (isMounted) {
              onScanSuccess(decodedText);
            }
          },
          (errorMessage) => {
            if (isMounted && onScanFailure) {
              onScanFailure(errorMessage);
            }
          }
        );

        if (isMounted) {
          setCameraState("active");
        }
      } catch (err: any) {
        console.error("Failed to start QR scanner:", err);
        if (isMounted) {
          setCameraState("error");
          setErrorMsg(err?.message || "Could not access camera. Please check permissions.");
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      const stopScanner = async () => {
        if (qrScannerInstance) {
          try {
            if (qrScannerInstance.isScanning) {
              await qrScannerInstance.stop();
            }
          } catch (stopErr) {
            console.error("Failed to stop QR scanner during cleanup:", stopErr);
          }
        }
      };
      stopScanner();
    };
  }, [onScanSuccess, onScanFailure, fps, qrbox, aspectRatio]);

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 aspect-square relative flex flex-col items-center justify-center shadow-2xl">
      <style>{scanStyles}</style>

      {/* Target Container for HTML5 QR Code */}
      <div 
        id={elementId} 
        className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full [&_video]:rounded-2xl" 
      />

      {/* Loading Overlay */}
      {cameraState === "initializing" && (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold tracking-wider uppercase animate-pulse">Starting Camera...</p>
        </div>
      )}

      {/* Error Overlay */}
      {cameraState === "error" && (
        <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-destructive">Camera Error</p>
          <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
            {errorMsg || "Camera access was denied or no camera device was found."}
          </p>
        </div>
      )}

      {/* Modern Overlay HUD when Active */}
      {cameraState === "active" && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
          {/* Top Status */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Scan</span>
          </div>

          {/* Target Box Border Markers */}
          <div className="w-[70%] h-[70%] relative flex items-center justify-center shrink-0">
            {/* Top-Left Corner */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
            {/* Top-Right Corner */}
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
            {/* Bottom-Left Corner */}
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
            {/* Bottom-Right Corner */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md" />

            {/* Glowing Scan Line Animation */}
            <div className="animate-scan-line" />
          </div>

          {/* Bottom Hint */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 shadow-md">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Position QR inside frame</p>
          </div>
        </div>
      )}
    </div>
  );
}
