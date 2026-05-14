import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon, Plus, Loader2, Share2, Upload, Trash2, CheckCircle2,
  Palette, FileText, Settings2, Image as LucideImage
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/company/brand-assets")({
  component: CompanyBrandAssets,
});

function CompanyBrandAssets() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("company_profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    }
  });

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ["brand-assets", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const { data } = await supabase.from("brand_assets").select("*").eq("company_id", companyProfile!.id).order('created_at', { ascending: false });
      return data || [];
    }
  });

  const { data: guidelines, isLoading: guidelinesLoading } = useQuery({
    queryKey: ["brand-guidelines", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const { data } = await supabase.from("brand_guidelines").select("*").eq("company_id", companyProfile!.id).maybeSingle();
      return data;
    }
  });

  const { data: acceptedEvents } = useQuery({
    queryKey: ["company-accepted-events", companyProfile?.id],
    enabled: !!companyProfile?.id,
    queryFn: async () => {
      const { data: proposals } = await supabase
        .from("sponsorship_proposals")
        .select("event_id, events(title, college_name)")
        .eq("company_id", companyProfile!.id)
        .eq("status", "accepted");
      return proposals || [];
    }
  });

  const [uploading, setUploading] = useState(false);
  const [newAssetType, setNewAssetType] = useState("banner");
  const [newAssetName, setNewAssetName] = useState("");

  const [guidelineColors, setGuidelineColors] = useState({ primary: "#000000", secondary: "#ffffff" });
  const [guidelineInstructions, setGuidelineInstructions] = useState("");
  const [isEditingGuidelines, setIsEditingGuidelines] = useState(false);

  // Initialize guidelines from DB
  useState(() => {
    if (guidelines) {
      setGuidelineColors(guidelines.colors as any || { primary: "#000000", secondary: "#ffffff" });
      setGuidelineInstructions(guidelines.instructions || "");
    }
  });

  const uploadAsset = useMutation({
    mutationFn: async (fileDataUrl: string) => {
      if (!companyProfile?.id) throw new Error("No company profile");
      const { error } = await supabase.from("brand_assets").insert({
        company_id: companyProfile.id,
        name: newAssetName || "Untitled Asset",
        type: newAssetType,
        file_url: fileDataUrl, // In a real app, this would be a Supabase Storage URL
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Asset uploaded successfully");
      qc.invalidateQueries({ queryKey: ["brand-assets"] });
      setNewAssetName("");
    },
    onError: (e: any) => toast.error(e.message),
    onSettled: () => setUploading(false)
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64 for demo purposes (small images only)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large for demo. Please use an image under 2MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadAsset.mutate(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const deleteAsset = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brand_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Asset deleted");
      qc.invalidateQueries({ queryKey: ["brand-assets"] });
    }
  });

  const saveGuidelines = useMutation({
    mutationFn: async () => {
      if (!companyProfile?.id) throw new Error("No company profile");
      const { error } = await supabase.from("brand_guidelines").upsert({
        company_id: companyProfile.id,
        colors: guidelineColors,
        instructions: guidelineInstructions
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Guidelines saved successfully");
      setIsEditingGuidelines(false);
      qc.invalidateQueries({ queryKey: ["brand-guidelines"] });
    },
    onError: (e: any) => toast.error(e.message)
  });

  const shareAsset = useMutation({
    mutationFn: async ({ assetId, eventId }: { assetId: string, eventId: string }) => {
      const { error } = await supabase.from("shared_assets").insert({
        asset_id: assetId,
        event_id: eventId,
        permissions: "edit"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Asset shared with organizer!");
    },
    onError: (e: any) => toast.error(e.message)
  });

  if (assetsLoading || guidelinesLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div>
        <div className="text-xs font-bold text-primary uppercase tracking-widest">Brand Hub</div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Assets & Creativity</h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Manage your logos, banners, and merchandise templates. Share them directly with event organizers to ensure your brand is represented perfectly at every fest.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Column: Assets */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <LucideImage className="h-5 w-5 text-primary" /> Brand Assets
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-brand-gradient text-white shadow-glow">
                    <Upload className="h-4 w-4 mr-2" /> Upload Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/10 sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Asset</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Asset Name</Label>
                      <Input value={newAssetName} onChange={e => setNewAssetName(e.target.value)} placeholder="e.g., Primary Logo, Main Banner" className="glass bg-black/20" />
                    </div>
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select value={newAssetType} onValueChange={setNewAssetType}>
                        <SelectTrigger className="glass bg-black/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="glass bg-black/90">
                          <SelectItem value="logo">Logo</SelectItem>
                          <SelectItem value="banner">Banner Template</SelectItem>
                          <SelectItem value="poster">Poster</SelectItem>
                          <SelectItem value="merchandise">Merchandise Design</SelectItem>
                          <SelectItem value="other">Other Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2">
                      <Label className="cursor-pointer">
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-white/5">
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          ) : (
                            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                          )}
                          <span className="text-sm font-medium">Click to browse file</span>
                          <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</span>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </Label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {assets?.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center flex flex-col items-center border border-white/5">
                <ImageIcon className="h-12 w-12 text-white/20 mb-4" />
                <h3 className="text-lg font-bold mb-1">No assets uploaded yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Upload your brand logos and marketing banners to share with college organizers.
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Plus className="h-4 w-4 mr-2" /> Quick Upload
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {assets?.map((asset: any) => (
                  <div key={asset.id} className="glass rounded-xl overflow-hidden border border-white/10 group">
                    <div className="aspect-video bg-black/50 relative overflow-hidden flex items-center justify-center">
                      <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="h-8 w-full bg-white text-black hover:bg-white/90 font-semibold text-xs">
                                <Share2 className="h-3 w-3 mr-1" /> Share
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass border-white/10">
                              <DialogHeader>
                                <DialogTitle>Share Asset</DialogTitle>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <p className="text-sm text-muted-foreground">Select an accepted sponsorship event to share this asset with the organizer.</p>
                                {acceptedEvents?.length === 0 ? (
                                  <div className="p-4 bg-white/5 rounded-lg text-sm text-center">
                                    No accepted sponsorships found yet.
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {acceptedEvents?.map((pe: any) => (
                                      <div key={pe.event_id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="truncate pr-4">
                                          <div className="font-semibold text-sm truncate">{pe.events?.title}</div>
                                          <div className="text-xs text-muted-foreground truncate">{pe.events?.college_name}</div>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => shareAsset.mutate({ assetId: asset.id, eventId: pe.event_id })}
                                          disabled={shareAsset.isPending}
                                        >
                                          Share
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="destructive" className="h-8 w-8 p-0 shrink-0" onClick={() => deleteAsset.mutate(asset.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm truncate" title={asset.name}>{asset.name}</h3>
                        <Badge variant="outline" className="text-[10px] capitalize shrink-0">{asset.type}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Approved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Guidelines */}
        <div className="space-y-6">
          <section className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Brand Guidelines
              </h2>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingGuidelines(!isEditingGuidelines)}>
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>

            {isEditingGuidelines ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Brand Colors</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Primary Hex</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={guidelineColors.primary} onChange={e => setGuidelineColors(c => ({...c, primary: e.target.value}))} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <Input value={guidelineColors.primary} onChange={e => setGuidelineColors(c => ({...c, primary: e.target.value}))} className="h-8 text-xs glass bg-black/20" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Secondary Hex</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={guidelineColors.secondary} onChange={e => setGuidelineColors(c => ({...c, secondary: e.target.value}))} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <Input value={guidelineColors.secondary} onChange={e => setGuidelineColors(c => ({...c, secondary: e.target.value}))} className="h-8 text-xs glass bg-black/20" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Instructions for Organizers</Label>
                  <Textarea 
                    value={guidelineInstructions} 
                    onChange={e => setGuidelineInstructions(e.target.value)}
                    placeholder="E.g., Do not distort the logo. Maintain at least 20px padding around the logo..."
                    className="h-24 text-xs resize-none glass bg-black/20"
                  />
                </div>

                <Button className="w-full bg-brand-gradient text-white" onClick={() => saveGuidelines.mutate()} disabled={saveGuidelines.isPending}>
                  {saveGuidelines.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Guidelines"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">Brand Colors</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: guidelineColors.primary }} />
                      <div className="text-xs font-mono">{guidelineColors.primary}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: guidelineColors.secondary }} />
                      <div className="text-xs font-mono">{guidelineColors.secondary}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Instructions
                  </h3>
                  <div className="text-sm bg-white/5 rounded-xl p-4 text-white/80 whitespace-pre-wrap border border-white/5">
                    {guidelineInstructions || "No instructions provided."}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
