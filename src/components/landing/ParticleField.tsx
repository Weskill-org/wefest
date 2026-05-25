import { useMemo } from "react";

const PARTICLE_COUNT = 40;

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

const COLORS = [
  "oklch(0.72 0.22 320)",  // brand purple
  "oklch(0.78 0.18 200)",  // cyan
  "oklch(0.85 0.2 160)",   // neon green
  "oklch(0.65 0.15 280)",  // indigo
  "oklch(0.80 0.12 60)",   // warm accent
];

export function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
      drift: (Math.random() - 0.5) * 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-twinkle ${p.duration * 0.4}s ease-in-out ${p.delay}s infinite`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
