import { useRef, type ReactNode, type MouseEvent } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
}

export function FloatingCard({ children, className = "" }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt values: max ±8 degrees
    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;

    inner.style.setProperty("--tilt-x", String(tiltX));
    inner.style.setProperty("--tilt-y", String(tiltY));
    inner.style.setProperty("--card-glow-x", `${(x / rect.width) * 100}%`);
    inner.style.setProperty("--card-glow-y", `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.setProperty("--tilt-x", "0");
    inner.style.setProperty("--tilt-y", "0");
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="tilt-card-inner glass-panel p-6 h-full">
        {children}
      </div>
    </div>
  );
}
