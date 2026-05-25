import { useMemo } from "react";

const STREAK_COUNT = 5;

interface Streak {
  id: number;
  left: string;
  height: string;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export function LightStreaks() {
  const streaks = useMemo<Streak[]>(() => {
    return Array.from({ length: STREAK_COUNT }, (_, i) => ({
      id: i,
      left: `${15 + (i * 18) + Math.random() * 10}%`,
      height: `${120 + Math.random() * 180}px`,
      opacity: 0.04 + Math.random() * 0.06,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 8,
      color: i % 2 === 0
        ? "linear-gradient(180deg, transparent, oklch(0.72 0.22 320 / 0.4), transparent)"
        : "linear-gradient(180deg, transparent, oklch(0.78 0.18 200 / 0.3), transparent)",
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {streaks.map((s) => (
        <div
          key={s.id}
          className="light-streak"
          style={{
            left: s.left,
            height: s.height,
            background: s.color,
            opacity: s.opacity,
            animation: `streak-drift ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
