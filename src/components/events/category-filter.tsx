interface CategoryFilterProps {
  categories: readonly string[];
  activeCategory: string;
  setActiveCategory: (category: any) => void;
}

export function CategoryFilter({ categories, activeCategory, setActiveCategory }: CategoryFilterProps) {
  return (
    <div className="flex w-full items-center justify-center overflow-x-auto pb-4 pt-2 no-scrollbar">
      <div className="flex items-center gap-3 px-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-brand-gradient text-white shadow-glow scale-105"
                  : "bg-background/50 backdrop-blur-md text-muted-foreground border border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
