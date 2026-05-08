import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventsHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function EventsHero({ searchQuery, setSearchQuery }: EventsHeroProps) {
  const scrollToExplore = () => {
    const element = document.getElementById("explore-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[300px] w-[300px] rounded-full bg-brand-gradient opacity-10 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>India's Largest College Festival Network</span>
          </div>
          
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Discover College <br />
            <span className="text-gradient">Festivals Across India</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Explore cultural, tech, sports, business, and arts festivals from top colleges. 
            Connect, compete, and celebrate the spirit of campus life.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="group relative w-full max-w-md">
              <div className="absolute -inset-0.5 rounded-xl bg-brand-gradient opacity-20 blur transition duration-300 group-focus-within:opacity-40" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by festival, college, or city..."
                  className="h-14 rounded-xl border-border/50 bg-background/80 pl-12 pr-4 text-lg backdrop-blur-xl focus-visible:ring-primary/30"
                />
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={scrollToExplore}
              className="h-14 rounded-xl bg-brand-gradient px-8 text-base font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              Explore Events
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span>500+ Active Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span>200+ Verified Colleges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

