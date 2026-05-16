import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Instagram, 
  MessageCircle,
  Smartphone,
  Sparkles,
  Link2,
  X as CloseIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventUrl: string;
  referralCode?: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

export function ShareEventDialog({ open, onOpenChange, eventTitle, eventUrl, referralCode }: ShareEventDialogProps) {
  const [copied, setCopied] = useState(false);

  // Append referral code if present
  const finalUrl = referralCode 
    ? `${eventUrl}${eventUrl.includes('?') ? '&' : '?'}ref=${encodeURIComponent(referralCode)}`
    : eventUrl;

  const shareData = {
    title: eventTitle,
    text: referralCode 
      ? `Join me at ${eventTitle}! Use my code ${referralCode} to get bonus WeCoins.`
      : `Check out ${eventTitle} on WeFest!`,
    url: finalUrl,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyLink();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const socialOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#25D366] hover:bg-[#20ba5a]",
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
        window.open(url, "_blank");
      }
    },
    {
      name: "X",
      icon: <XIcon className="h-4 w-4" />,
      color: "bg-white text-black hover:bg-zinc-200",
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(url, "_blank");
      }
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      action: () => {
        handleCopyLink();
        toast("Link copied for Instagram!", { icon: <Instagram className="h-4 w-4 text-pink-500" /> });
      }
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-[#0C0C0E] border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] rounded-[2rem] outline-none ring-0">
        <div className="p-8 pb-10">
          <DialogHeader className="text-left space-y-1 relative">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute -right-2 -top-2 p-2 rounded-xl hover:bg-white/5 text-zinc-500 transition-colors"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase">
              Share Event
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 font-medium">
              Invite your crew to <span className="text-zinc-200 font-bold">{eventTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-10 space-y-8">
            {/* Social Icons Row */}
            <div className="flex gap-5 items-start">
              {socialOptions.map((option) => (
                <div key={option.name} className="flex flex-col items-center gap-2.5">
                  <button
                    onClick={option.action}
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg",
                      option.color
                    )}
                  >
                    {option.icon}
                  </button>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>

            {/* URL Input Area - Dynamic Height & Wrapping */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 block ml-1">
                {referralCode ? "Your Referral Link" : "Event Link"}
              </span>
              <div className="group space-y-3">
                <div className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-start gap-3 transition-all hover:border-white/10 min-h-[56px]">
                  <Link2 className="h-4 w-4 text-zinc-600 mt-1 shrink-0 group-hover:text-zinc-400 transition-colors" />
                  <p className="text-[12px] font-medium text-zinc-400 break-all leading-relaxed select-all">
                    {finalUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-[11px] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider",
                    copied 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Link Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy {referralCode ? "Referral" : "Event"} Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full h-14 rounded-2xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-3 group uppercase tracking-widest"
              >
                <Smartphone className="h-4 w-4 transition-transform group-hover:scale-110" />
                More options
              </button>
            )}
          </div>
        </div>

        {/* Footer Branding */}
        <div className="px-8 py-5 bg-zinc-900/50 border-t border-white/5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-white uppercase tracking-tight">Earn 150 WeCoins</p>
            <p className="text-[10px] text-zinc-500 truncate">Per successful student invite</p>
          </div>
          <button className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors shrink-0">
            Terms
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
