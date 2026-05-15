import { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
}

export function QRScanner({ 
  onScanSuccess, 
  onScanFailure, 
  fps = 10, 
  qrbox = 250,
  aspectRatio = 1.0
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // When the component mounts, initialize the scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps, 
        qrbox, 
        aspectRatio,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      },
      /* verbose= */ false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.error("Failed to clear html5QrcodeScanner", err);
        });
      }
    };
  }, [onScanSuccess, onScanFailure, fps, qrbox, aspectRatio]);

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <div id="qr-reader" className="w-full" />
    </div>
  );
}
