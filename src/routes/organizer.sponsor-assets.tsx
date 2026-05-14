import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Image as ImageIcon, Paintbrush, FileText, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/organizer/sponsor-assets")({
  component: OrganizerSponsorAssets,
});

function OrganizerSponsorAssets() {
  const ctx = Route.useRouteContext() as any;
  const user = ctx?.user;
  const membership = ctx?.membership;

  const { data: sharedAssets, isLoading } = useQuery({
    queryKey: ["organizer-shared-assets", user?.id],
    queryFn: async () => {
      // With RLS, we can just query shared_assets
      const { data, error } = await supabase
        .from("shared_assets")
        .select(`
          id, permissions, created_at,
          brand_assets (
            id, name, type, file_url, company_id,
            company_profiles (company_name)
          ),
          events (title)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="text-xs font-bold text-primary uppercase tracking-widest">Sponsorships</div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Brand Assets</h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Access logos, banners, and templates shared by your sponsors. Customize templates with your college details while strictly adhering to sponsor brand guidelines.
        </p>
      </div>

      {sharedAssets?.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center flex flex-col items-center border border-white/5">
          <ImageIcon className="h-12 w-12 text-white/20 mb-4" />
          <h3 className="text-lg font-bold mb-1">No shared assets yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            When sponsors accept your proposals, they can share their marketing materials here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sharedAssets?.map((sa: any) => {
            const asset = sa.brand_assets;
            if (!asset) return null;
            return (
              <div key={sa.id} className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col">
                <div className="aspect-video bg-black/50 relative flex items-center justify-center p-2">
                  <img src={asset.file_url} alt={asset.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm line-clamp-2">{asset.name}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase shrink-0 bg-white/5">{asset.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      Shared by <span className="font-semibold text-foreground">{asset.company_profiles?.company_name}</span> for {sa.events?.title}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {asset.type === 'banner' || asset.type === 'poster' ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-brand-gradient text-white shadow-glow"
                        onClick={() => {
                          setSelectedAsset({ ...asset, shared_id: sa.id });
                          setShowEditor(true);
                        }}
                      >
                        <Paintbrush className="h-3.5 w-3.5 mr-1.5" /> Customize
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = asset.file_url;
                          link.download = asset.name;
                          link.click();
                        }}
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                      </Button>
                    )}
                    <GuidelinesModal companyId={asset.company_id} companyName={asset.company_profiles?.company_name} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showEditor && selectedAsset && (
        <TemplateEditor
          asset={selectedAsset}
          onClose={() => {
            setShowEditor(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
}

function GuidelinesModal({ companyId, companyName }: { companyId: string, companyName: string }) {
  const { data: guidelines, isLoading } = useQuery({
    queryKey: ["brand-guidelines", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("brand_guidelines").select("*").eq("company_id", companyId).maybeSingle();
      return data;
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-9 w-9 shrink-0">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{companyName} Guidelines</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : !guidelines ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No specific guidelines provided.</div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Brand Colors</h4>
              <div className="flex gap-4">
                {guidelines.colors?.primary && (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md shadow-inner" style={{ backgroundColor: guidelines.colors.primary }} />
                    <span className="text-xs font-mono">{guidelines.colors.primary}</span>
                  </div>
                )}
                {guidelines.colors?.secondary && (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md shadow-inner" style={{ backgroundColor: guidelines.colors.secondary }} />
                    <span className="text-xs font-mono">{guidelines.colors.secondary}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Instructions</h4>
              <div className="bg-white/5 rounded-lg p-3 text-sm whitespace-pre-wrap">
                {guidelines.instructions || "Please maintain clear space around logos and do not distort images."}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TemplateEditor({ asset, onClose }: { asset: any, onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eventName, setEventName] = useState("WeFest 2026");
  const [collegeName, setCollegeName] = useState("IIT Bombay");
  const [date, setDate] = useState("15th Oct, 2026");
  const [venue, setVenue] = useState("Main Auditorium");
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
      drawCanvas();
    };
    img.src = asset.file_url;
  }, [asset.file_url]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Overlay settings (simulated smart placement for a demo)
    // We will draw a dark semi-transparent box at the bottom for text if it's a banner
    const isBanner = img.width > img.height;
    
    if (isBanner) {
      const boxHeight = 120;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      
      // Event Name & College
      ctx.font = "bold 40px sans-serif";
      ctx.fillText(eventName, 40, canvas.height - 70);
      
      ctx.font = "24px sans-serif";
      ctx.fillText(`Presented by ${collegeName}`, 40, canvas.height - 30);

      // Date & Venue (Right aligned)
      ctx.textAlign = "right";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(date, canvas.width - 40, canvas.height - 70);
      
      ctx.font = "24px sans-serif";
      ctx.fillText(venue, canvas.width - 40, canvas.height - 30);
    } else {
      // Poster format
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, canvas.height - 180, canvas.width, 180);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(eventName, canvas.width / 2, canvas.height - 110);
      
      ctx.font = "28px sans-serif";
      ctx.fillText(`at ${collegeName}`, canvas.width / 2, canvas.height - 65);
      
      ctx.font = "24px sans-serif";
      ctx.fillText(`${date} • ${venue}`, canvas.width / 2, canvas.height - 25);
    }
  };

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [eventName, collegeName, date, venue, imageLoaded]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `Customized_${asset.name}.png`;
    link.click();
    toast.success("Design downloaded successfully!");
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-white/10 max-w-4xl w-full p-0 overflow-hidden flex flex-col md:flex-row h-[80vh] max-h-[600px]">
        {/* Editor Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 bg-black/40 p-6 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Customize Template</h2>
            <p className="text-xs text-muted-foreground mt-1">Add your event details to the sponsor's asset.</p>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Event Name</Label>
              <Input value={eventName} onChange={e => setEventName(e.target.value)} className="glass bg-black/20 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">College Name</Label>
              <Input value={collegeName} onChange={e => setCollegeName(e.target.value)} className="glass bg-black/20 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Event Date</Label>
              <Input value={date} onChange={e => setDate(e.target.value)} className="glass bg-black/20 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Venue</Label>
              <Input value={venue} onChange={e => setVenue(e.target.value)} className="glass bg-black/20 h-9" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <Button className="w-full bg-brand-gradient text-white shadow-glow" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download Image
            </Button>
            <Button variant="ghost" className="w-full text-xs" onClick={onClose}>Cancel</Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-black/80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
