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
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-brand-gradient text-primary-foreground shadow-glow scale-105"
                  : "bg-muted/50 text-muted-foreground border border-border/40 hover:bg-muted hover:text-foreground hover:border-border"
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
