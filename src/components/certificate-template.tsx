import React from "react";
import { Award, ShieldCheck, Sparkles } from "lucide-react";

interface CertificateProps {
  studentName: string;
  eventName: string;
  date: string;
  certificateId: string;
}

export function CertificateTemplate({ studentName, eventName, date, certificateId }: CertificateProps) {
  return (
    <div className="certificate-container p-12 bg-white text-slate-900 font-serif border-[16px] border-double border-slate-200 relative overflow-hidden" id="certificate-print-area">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32 opacity-50" />
      
      <div className="relative z-10 border-4 border-slate-100 p-12 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white mx-auto shadow-xl">
            <Award className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-slate-800 mb-2">Certificate</h1>
        <h2 className="text-xl font-medium text-slate-500 mb-12">OF PARTICIPATION</h2>

        <p className="text-lg italic text-slate-500 mb-2">This is to certify that</p>
        <h3 className="text-5xl font-black text-slate-900 mb-8 font-display">{studentName}</h3>
        
        <p className="text-lg text-slate-600 max-w-lg mb-12">
          has successfully participated in the <span className="font-bold text-slate-800">{eventName}</span> 
          organized by WeFest on <span className="font-bold text-slate-800">{date}</span>. 
          Your contribution to the vibrant festival ecosystem is highly valued.
        </p>

        <div className="flex justify-between w-full mt-12 pt-12 border-t border-slate-100">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <ShieldCheck className="h-4 w-4" /> VERIFIED BY WEFEST
            </div>
            <p className="text-[10px] text-slate-400 font-mono">ID: {certificateId}</p>
          </div>
          
          <div className="text-right">
            <div className="font-bold text-slate-800 underline decoration-slate-300 underline-offset-8">Antigravity</div>
            <p className="text-xs text-slate-500 mt-2">Lead AI, WeFest</p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 left-4">
        <Sparkles className="h-6 w-6 text-slate-200" />
      </div>
    </div>
  );
}
