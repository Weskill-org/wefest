import React from "react";
import { ShieldCheck, Award, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CertificateProps {
  studentName: string;
  eventName: string;
  date: string;
  certificateId: string;
  collegeName?: string;
}

/**
 * ULTRA-PREMIUM CERTIFICATE COMPONENT (V2)
 * High-fidelity assets integrated for maximum authenticity.
 */

export function CertificateTemplate({ studentName, eventName, date, certificateId, collegeName }: CertificateProps) {
  return (
    <div 
      className="certificate-outer bg-[#0a0a0c] p-8 md:p-12 flex items-center justify-center min-h-screen font-display"
      style={{ perspective: "2000px" }}
    >
      <div 
        id="certificate-print-area"
        className="certificate-inner relative bg-[#fffdfa] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] overflow-hidden transition-transform duration-700 hover:rotate-x-0"
        style={{ 
          width: "297mm", 
          height: "210mm",
          border: "25px solid #0f172a",
          transform: "rotateX(5deg) translateY(-20px)",
          transformStyle: "preserve-3d",
          boxShadow: "0 0 0 10px #D4AF37, 0 80px 160px -40px rgba(0,0,0,0.4)"
        }}
      >
        {/* ─── SECURITY BACKGROUND PATTERN ─── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%">
            <pattern id="guilloche" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 0, 50 50 T 100 50" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <path d="M0 60 Q 25 10, 50 60 T 100 60" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#guilloche)" />
          </svg>
        </div>

        {/* ─── GOLD FILIGREE CORNERS ─── */}
        <div className="absolute top-4 left-4 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-3xl" />
        <div className="absolute top-4 right-4 w-32 h-32 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr-3xl" />
        <div className="absolute bottom-4 left-4 w-32 h-32 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl-3xl" />
        <div className="absolute bottom-4 right-4 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-3xl" />

        {/* ─── MAIN CONTENT ─── */}
        <div className="relative z-10 h-full p-16 flex flex-col items-center">
          
          {/* Header: Large Gold Logo */}
          <div className="w-full flex flex-col items-center mb-10">
            <div className="relative h-28 w-28 mb-4 drop-shadow-xl animate-float">
              <img src="/logo-gold.png" alt="WeFest Logo" className="h-full w-full object-contain" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full pointer-events-none" />
            </div>
            <div className="flex flex-col items-center">
               <h3 className="text-4xl font-black text-[#0f172a] uppercase tracking-[0.2em] italic">WEFEST</h3>
               <div className="flex items-center gap-4 mt-2">
                 <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                 <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">OFFICIAL CREDENTIAL</p>
                 <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
               </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 flex flex-col items-center text-center max-w-4xl pt-4">
             <h1 className="text-[80px] font-serif font-black text-[#0f172a] italic mb-4 tracking-tighter leading-none drop-shadow-sm">
                Certificate of Merit
             </h1>
             
             <div className="flex items-center gap-8 mb-8 w-full justify-center">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <span className="text-2xl font-serif italic text-slate-500">This high distinction is conferred upon</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
             </div>

             <div className="mb-8">
                <h2 className="text-[100px] font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-4 animate-glow">
                   {studentName}
                </h2>
                <div className="flex items-center justify-center gap-3 py-2 px-6 bg-slate-50/50 rounded-full border border-slate-100 backdrop-blur-sm">
                   <Award className="text-[#D4AF37]" size={24} />
                   <p className="text-2xl font-serif text-slate-700 italic">
                      In recognition of outstanding performance representing <span className="font-bold text-[#0f172a] not-italic">{collegeName || "Our Participating Institution"}</span>
                   </p>
                </div>
             </div>

             <div className="max-w-3xl mb-8">
                <p className="text-[22px] text-slate-700 leading-relaxed font-serif italic">
                   For demonstrating exemplary leadership and excellence during the official festival
                </p>
                <div className="mt-4 relative group">
                   <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f172a] via-[#D4AF37] to-[#0f172a] uppercase tracking-tighter italic">
                      {eventName}
                   </span>
                   <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
             </div>
          </div>

          {/* Footer: Triple Authentication System */}
          <div className="w-full mt-auto grid grid-cols-3 items-end pb-8">
             
             {/* 1. Official Gold Seal */}
             <div className="flex flex-col items-center">
                <div className="relative h-44 w-44 -mb-8 drop-shadow-2xl hover:scale-110 transition-transform duration-500 cursor-help">
                   <img src="/seal-gold.png" alt="Gold Seal" className="h-full w-full object-contain" />
                </div>
                <p className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest mt-6">Office of the Registrar</p>
             </div>

             {/* 2. Institutional Stamp & Signatures */}
             <div className="flex flex-col items-center gap-8">
                <div className="h-20 opacity-90 hover:opacity-100 transition-opacity">
                   <img src="/stamp-college.png" alt="College Stamp" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col items-center text-center">
                   <div className="h-12 flex items-end mb-1 border-b border-slate-300 w-64 justify-center">
                      <span className="text-4xl font-signature text-[#0f172a] opacity-80">
                         WeFest Executive Board
                      </span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Authorized Signature</p>
                </div>
             </div>

             {/* 3. Holographic Security Seal */}
             <div className="flex flex-col items-end">
                <div className="relative h-40 w-40 -mb-6 drop-shadow-2xl hover:brightness-125 transition-all">
                   <img src="/seal-holographic.png" alt="Holographic Seal" className="h-full w-full object-contain" />
                   {/* Overlay QR Code for Scannability */}
                   <div className="absolute inset-0 flex items-center justify-center pt-2">
                     <div className="bg-white p-1 rounded-sm shadow-sm scale-75 opacity-80 hover:opacity-100 transition-opacity">
                        <QRCodeSVG value={`https://wefest.io/verify/${certificateId}`} size={48} level="M" />
                     </div>
                   </div>
                </div>
                <div className="text-right mt-6 pr-4">
                   <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest mb-1">
                      <ShieldCheck size={12} /> SECURE CRYPTOGRAPHIC ID
                   </div>
                   <p className="text-[8px] font-mono text-slate-400">DOC_ID: {certificateId}</p>
                   <p className="text-[8px] font-mono text-slate-400">ISSUED: {date}</p>
                </div>
             </div>

          </div>

        </div>

        {/* ─── FINAL POLISH ─── */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        {/* Massive Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none select-none rotate-[-35deg]">
           <span className="text-[240px] font-black uppercase tracking-[0.4em] text-[#0f172a]">VERIFIED</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@1,900&display=swap');
        
        .font-signature {
          font-family: 'Dancing Script', cursive;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 0px rgba(212,175,55,0); }
          50% { text-shadow: 0 0 20px rgba(212,175,55,0.2); }
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }

        @media print {
          .certificate-outer {
            padding: 0;
            background: white;
            min-height: 0;
          }
          .certificate-inner {
            box-shadow: none !important;
            transform: none !important;
            border-width: 15px !important;
          }
          .animate-float, .animate-glow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

