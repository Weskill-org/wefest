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

  // Split children text into words, preserving React elements and proper spacing
  const processChildren = (children: ReactNode): ReactNode => {
    let wordIndex = 0;
    if (typeof children === "string") {
      const words = children.split(" ").filter(Boolean);
      const elements: ReactNode[] = [];
      words.forEach((word, i) => {
        elements.push(
          <span key={i} className="text-reveal-word" style={{ animationDelay: `${wordIndex * 0.08 + 0.2}s` }}>
            {word}
          </span>
        );
        wordIndex++;
        if (i < words.length - 1) {
          elements.push(" ");
        }
      });
      return elements;
    }
    if (Array.isArray(children)) {
      const elements: ReactNode[] = [];
      children.forEach((child, i) => {
        if (typeof child === "string") {
          const words = child.split(" ").filter(Boolean);
          words.forEach((word, j) => {
            elements.push(
              <span key={`${i}-${j}`} className="text-reveal-word" style={{ animationDelay: `${wordIndex * 0.08 + 0.2}s` }}>
                {word}
              </span>
            );
            wordIndex++;
            elements.push(" ");
          });
        } else {
          elements.push(child);
          elements.push(" ");
          const childObj = child as any;
          if (childObj && typeof childObj === "object" && childObj.props && typeof childObj.props.children === "string") {
            const innerWords = childObj.props.children.split(" ").filter(Boolean);
            wordIndex += innerWords.length;
          } else {
            wordIndex += 2;
          }
        }
      });
      // Trim the trailing space if any
      if (elements.length > 0 && elements[elements.length - 1] === " ") {
        elements.pop();
      }
      return elements;
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
