import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Users2, Award, Zap, TrendingUp, CheckCircle2, ArrowRight, Loader2,
  Sparkles, Instagram, Twitter, Linkedin, ChevronDown, ChevronUp,
  GraduationCap, Megaphone, Gift, Star, Quote, Rocket, Shield, Clock,
  BadgeCheck, Heart, Globe
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/ambassadors")({
  head: () => ({
    meta: [
      { title: "Campus Ambassador Program | WeFest" },
      { name: "description", content: "Become the face of festivals on your campus. Join the WeFest Campus Ambassador Program, earn perks, exclusive rewards, cash incentives, and internships." },
      { name: "keywords", content: "campus ambassador, college representative, student intern, college festivals, WeFest, campus marketing, college rewards" },
      { property: "og:title", content: "Campus Ambassador Program | WeFest" },
      { property: "og:description", content: "Become the face of festivals on your campus. Join the WeFest Campus Ambassador Program, earn perks, exclusive rewards, cash incentives, and internships." },
      { property: "og:url", content: "https://wefest.weskill.org/ambassadors" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Campus Ambassador Program | WeFest" },
      { name: "twitter:description", content: "Become the face of festivals on your campus. Earn perks, rewards, and internships." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org/ambassadors" },
    ],
  }),
  component: Ambassadors,
});

/* ─── FAQ Data ─── */
const faqItems = [
  {
    q: "Who can become a WeFest Campus Ambassador?",
    a: "Any currently enrolled college student in India can apply. Whether you're a first-year or a final-year student, if you're passionate about college culture, events, and have a knack for networking — you're a great fit. No prior experience required."
  },
  {
    q: "How much time do I need to commit?",
    a: "The program is flexible and designed around your college schedule. On average, ambassadors spend 3–5 hours per week on tasks like promoting events on social media, coordinating with peers, and distributing tickets. During fest season, activity may increase slightly."
  },
  {
    q: "What rewards and incentives do I get?",
    a: "Ambassadors earn commissions on every ticket sold through their referral link (typically 5–15% per ticket). Top performers receive free merchandise, VIP fest passes, cash bonuses, and official certificates. The best ambassadors also get internship offers and letters of recommendation."
  },
  {
    q: "Can I be an ambassador for multiple events?",
    a: "Absolutely! Many of our top ambassadors represent multiple fests across their region. Once you're part of the WeFest network, you can apply to any active ambassador program and manage all your campaigns from a single dashboard."
  },
  {
    q: "How does the referral and tracking system work?",
    a: "Each ambassador gets a unique referral link and tracking dashboard. When someone registers or buys a ticket through your link, you earn points and commissions automatically. The dashboard shows real-time stats — clicks, conversions, earnings — so you always know where you stand."
  },
  {
    q: "Is there a selection process?",
    a: "Yes, but it's lightweight. After you submit your application, the organizing team reviews your profile (social media presence, motivation, and campus involvement). Most applicants hear back within 48 hours. We look for enthusiasm and reach over experience."
  },
  {
    q: "Do I get a certificate?",
    a: "Yes. Every ambassador who completes a campaign receives a digitally verifiable certificate from WeFest, co-branded with the partner college or event. It's a great addition to your LinkedIn and resume."
  },
  {
    q: "What support will I receive?",
    a: "You'll get a dedicated campus manager, access to our private ambassador community on WhatsApp/Discord, ready-made promotional content (posters, captions, stories), and detailed guidelines for every campaign. You're never on your own."
  },
];

/* ─── How It Works Steps ─── */
const steps = [
  { icon: Rocket, title: "Apply Online", desc: "Fill out a quick application form with your college details and social media presence. Takes less than 2 minutes." },
  { icon: BadgeCheck, title: "Get Selected", desc: "Our team reviews your profile and sends you an onboarding kit with your unique referral link and campaign assets." },
  { icon: Megaphone, title: "Promote & Earn", desc: "Share events on social media, WhatsApp groups, and your campus network. Every ticket sold through your link earns you rewards." },
  { icon: Gift, title: "Unlock Rewards", desc: "Climb the leaderboard to unlock cash bonuses, VIP passes, certificates, internship offers, and exclusive merchandise." },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Priya Sharma", role: "Campus Ambassador", college: "IIT Delhi", content: "Being a WeFest ambassador connected me with organizers from 15+ colleges. The experience and networking alone were worth it — plus I earned ₹12,000 in commissions!" },
  { name: "Rohit Verma", role: "Top Ambassador 2025", college: "BITS Pilani", content: "I started as a first-year with zero event experience. WeFest gave me the platform, mentorship, and recognition. Now I lead campus marketing for three major fests." },
  { name: "Ananya Gupta", role: "Ambassador Lead", college: "Christ University", content: "The referral tracking dashboard is so transparent. I could see every click and conversion in real time. It felt like running my own micro-startup." },
];

function Ambassadors() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [social, setSocial] = useState("");
  const [motivation, setMotivation] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const programsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { data: programs, isLoading } = useQuery({
    queryKey: ["ambassador-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassador_programs")
        .select("*, event:event_id(title, cover)")
        .eq("status", "active");
      if (error) throw error;
      return data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async ({ programId, social, motivation }: { programId: string, social: string, motivation: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to apply");

      const { error } = await supabase.from("ambassador_applications").insert({
        program_id: programId,
        user_id: user.id,
        social_handle: social,
        motivation: motivation
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted!", { description: "The organizers will review your profile shortly." });
      setIsDialogOpen(false);
      setSocial("");
      setMotivation("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    }
  });

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-gradient opacity-[0.08] blur-[140px] -z-10 rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Zap className="h-3.5 w-3.5 fill-current" /> WeFest Campus Influencer Program
          </span>
          <h1 className="mt-8 font-display text-5xl font-black leading-tight md:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            Become the <span className="text-gradient">Face</span> of Festivals.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-900">
            Represent the biggest brands and festivals on your campus. Gain experience, earn exclusive rewards, and build a network that lasts a lifetime.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button
              size="lg"
              className="bg-brand-gradient hover:opacity-90 px-8 rounded-full shadow-glow"
              onClick={() => scrollTo(programsRef)}
            >
              Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() => scrollTo(faqRef)}
            >
              View FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Stats ─── */}
      <section className="container mx-auto px-6 -mt-4 mb-20">
        <div className="glass rounded-[2rem] border border-border/60 p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatBlock value="5,000+" label="Ambassadors Nationwide" icon={Users2} />
            <StatBlock value="120+" label="Partner Colleges" icon={GraduationCap} />
            <StatBlock value="₹25L+" label="Rewards Distributed" icon={Gift} />
            <StatBlock value="2.1M+" label="Students Reached" icon={Globe} />
          </div>
        </div>
      </section>

      {/* ─── Perks Section ─── */}
      <section className="container mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-primary">Why join us?</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Perks that <span className="text-gradient">actually matter</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            We don't just hand out certificates. Our ambassadors get real rewards, real experience, and real connections.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <PerkCard icon={Award} title="Verified Certificates" desc="Official recognition from top colleges and WeFest for your LinkedIn and Resume." />
          <PerkCard icon={TrendingUp} title="Incentive Rewards" desc="Earn commissions on ticket sales, free merchandise, and VIP festival passes." />
          <PerkCard icon={Users2} title="Networking" desc="Connect with national-level organizers, brands, and fellow influencers." />
          <PerkCard icon={Shield} title="Mentorship" desc="Get paired with a dedicated campus manager who guides your every step." />
          <PerkCard icon={Heart} title="Community" desc="Join an exclusive WhatsApp/Discord community of 5000+ student leaders." />
          <PerkCard icon={Sparkles} title="Internships" desc="Top performers get internship offers and recommendation letters from WeFest." />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="container mx-auto px-6 mb-24">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold text-primary">Step by step</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            How it <span className="text-gradient">works</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="mx-auto mb-6 relative">
                <div className="h-20 w-20 rounded-[1.5rem] bg-brand-gradient flex items-center justify-center text-white shadow-glow mx-auto group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Active Programs ─── */}
      <section ref={programsRef} className="container mx-auto px-6 mb-24 scroll-mt-24" id="programs">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-primary">Open opportunities</div>
            <h2 className="mt-1 font-display text-3xl font-bold">Active Programs</h2>
            <p className="text-sm text-muted-foreground mt-1">Join a program and start leading</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            [1, 2].map(i => <div key={i} className="h-48 glass rounded-3xl animate-pulse" />)
          ) : programs && programs.length > 0 ? (
            programs.map(p => (
              <div key={p.id} className="glass group overflow-hidden rounded-[2rem] border border-border/60 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className={`w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br ${(p.event as any)?.cover || 'from-slate-800 to-slate-900'} relative flex-shrink-0`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all duration-300" />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{(p.event as any)?.title}</div>
                      <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.perks?.slice(0, 3).map((perk: string) => (
                          <span key={perk} className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground border border-border/40">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">
                            {i}
                          </div>
                        ))}
                        <div className="ml-4 text-[10px] text-muted-foreground">+12 applied</div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedProgram(p);
                          setIsDialogOpen(true);
                        }}
                        className="bg-brand-gradient text-white rounded-full px-6 shadow-glow hover:opacity-90 transition-opacity"
                      >
                        Apply Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
              <Users2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-bold">No active programs right now</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">Check back soon for new ambassador opportunities, or sign up to get notified when new programs launch.</p>
              <Button asChild className="mt-6 bg-brand-gradient text-white rounded-full px-8 shadow-glow" size="lg">
                <Link to="/signup">Get Notified <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="container mx-auto px-6 mb-24">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold text-primary">From our ambassadors</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Hear from the <span className="text-gradient">community</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real stories from students who grew their network, skills, and earnings through the WeFest Ambassador Program.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-[2rem] p-8 relative border border-border/60 hover:border-primary/30 transition-all group">
              <Quote className="absolute top-6 right-8 h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="flex items-center gap-1 text-amber-400 mb-5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="text-base italic leading-relaxed text-foreground/90">"{t.content}"</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-gradient p-0.5 shrink-0">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
                    {t.name.slice(0, 1)}
                  </div>
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}, {t.college}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section ref={faqRef} className="container mx-auto px-6 mb-24 scroll-mt-24" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold text-primary">Got questions?</div>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about the Campus Ambassador Program.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`glass rounded-2xl border transition-all overflow-hidden ${
                  openFaq === i ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border/60 hover:border-border"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left gap-4"
                  aria-expanded={openFaq === i}
                  id={`faq-btn-${i}`}
                >
                  <span className="font-semibold text-sm md:text-base">{item.q}</span>
                  <span className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                    openFaq === i ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {openFaq === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="container mx-auto px-6 pb-24">
        <div className="overflow-hidden rounded-3xl bg-brand-gradient p-10 text-primary-foreground shadow-glow md:p-16 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-center relative z-10">
            <div>
              <h3 className="font-display text-3xl font-black md:text-5xl">
                Ready to lead your campus?
              </h3>
              <p className="mt-4 max-w-xl text-primary-foreground/80 text-lg">
                Join 5,000+ student ambassadors across India. Apply in 2 minutes, start earning in 48 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-foreground/90" /> Free to join</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-foreground/90" /> No experience needed</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-foreground/90" /> Flexible hours</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground w-full md:w-auto"
                onClick={() => scrollTo(programsRef)}
              >
                Browse Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 w-full md:w-auto"
              >
                <Link to="/signup">Create Account First</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Application Dialog ─── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Apply for {selectedProgram?.title}</DialogTitle>
            <DialogDescription>
              Tell us why you'd be a great ambassador for {(selectedProgram?.event as any)?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label>Social Media Presence</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="gap-2 text-xs"><Instagram className="h-3 w-3" /> Insta</Button>
                <Button variant="outline" className="gap-2 text-xs"><Twitter className="h-3 w-3" /> Twitter</Button>
                <Button variant="outline" className="gap-2 text-xs"><Linkedin className="h-3 w-3" /> LinkedIn</Button>
              </div>
              <Input 
                placeholder="Profile link or @handle" 
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                className="mt-2 bg-background/50 border-border/60"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Why should we pick you?</Label>
              <Textarea 
                placeholder="Mention your reach, society positions, or past experience..." 
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="bg-background/50 border-border/60 resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              disabled={applyMutation.isPending}
              onClick={() => applyMutation.mutate({ programId: selectedProgram.id, social, motivation })}
              className="bg-brand-gradient text-white"
            >
              {applyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Sub-Components ─── */

function StatBlock({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <div className="text-2xl md:text-3xl font-bold text-gradient">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function PerkCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass rounded-[2rem] p-8 border border-border/60 hover:border-primary/40 transition-all group md:col-span-1 lg:col-span-2">
      <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-glow mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
