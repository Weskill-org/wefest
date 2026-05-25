import { useEffect, useRef, type ReactNode } from "react";

interface AnimatedHeadlineProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function AnimatedHeadline({ children, className = "", as: Tag = "h1" }: AnimatedHeadlineProps) {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Get all word spans and stagger their animation
          const words = el.querySelectorAll<HTMLSpanElement>(".text-reveal-word");
          words.forEach((word, i) => {
            word.style.animationDelay = `${i * 0.08 + 0.2}s`;
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split children text into words, preserving React elements
  const processChildren = (children: ReactNode): ReactNode => {
    if (typeof children === "string") {
      return children.split(" ").map((word, i) => (
        <span key={i} className="text-reveal-word" style={{ animationDelay: `${i * 0.08 + 0.2}s` }}>
          {word}{" "}
        </span>
      ));
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === "string") {
          return child.split(" ").map((word, j) => (
            <span key={`${i}-${j}`} className="text-reveal-word" style={{ animationDelay: `${(i * 3 + j) * 0.08 + 0.2}s` }}>
              {word}{" "}
            </span>
          ));
        }
        return child;
      });
    }
    return children;
  };

  return (
    // @ts-expect-error ref type mismatch with dynamic tag
    <Tag ref={ref} className={className} style={{ perspective: "600px" }}>
      {processChildren(children)}
    </Tag>
  );
}
