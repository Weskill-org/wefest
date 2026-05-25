import { useMemo } from "react";

/* ──────────────────────────────────────────────────────────────────
   HeroScene — Cinematic 3D floating visual for the hero section
   All visuals are pure CSS 3D transforms + SVG, no WebGL required.
   ────────────────────────────────────────────────────────────────── */

export function HeroScene() {
  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[600px]" aria-hidden="true">
      {/* Layer 1: Background elements (slowest parallax) */}
      <div className="parallax-layer-1 absolute inset-0">
        <CityscapeSilhouette />
        <NeonRings />
      </div>

      {/* Layer 2: Mid-depth elements */}
      <div className="parallax-layer-2 absolute inset-0">
        <HolographicStage />
        <GlowingSpheres />
        <GlassCubes />
      </div>

      {/* Layer 3: Foreground elements (fastest parallax) */}
      <div className="parallax-layer-3 absolute inset-0">
        <HolographicVisualizer />
        <ConfettiSparks />
        <ParticleTrails />
      </div>
    </div>
  );
}

/* ── Holographic Festival Stage ─────────────────────────────────── */
function HolographicStage() {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ perspective: "600px" }}
    >
      <div
        className="relative w-[280px] h-[160px] md:w-[340px] md:h-[190px] scan-line"
        style={{
          transform: "rotateX(15deg) rotateY(-5deg)",
          animation: "float-gentle 8s ease-in-out infinite",
        }}
      >
        {/* Stage surface */}
        <div className="absolute inset-0 rounded-2xl holo-surface opacity-80" />

        {/* Stage border glow */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: "1px solid oklch(0.72 0.22 320 / 0.4)",
            boxShadow:
              "0 0 30px oklch(0.72 0.22 320 / 0.2), inset 0 0 30px oklch(0.72 0.22 320 / 0.05), 0 20px 60px oklch(0 0 0 / 0.4)",
          }}
        />

        {/* Stage label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60"
          >
            Main Stage
          </div>
          <div className="mt-1 text-shimmer text-lg md:text-xl font-black tracking-tight">
            WeFest 2026
          </div>
          <div className="mt-2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${12 + Math.random() * 16}px`,
                  background: `oklch(0.72 0.22 ${300 + i * 20} / 0.6)`,
                  animation: `float-gentle ${1 + Math.random() * 0.5}s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Glowing Music Spheres ──────────────────────────────────────── */
function GlowingSpheres() {
  const spheres = useMemo(() => [
    { size: 48, x: "15%", y: "25%", color: "oklch(0.72 0.22 320)", delay: 0, duration: 7 },
    { size: 32, x: "78%", y: "35%", color: "oklch(0.78 0.18 200)", delay: 2, duration: 9 },
    { size: 24, x: "65%", y: "70%", color: "oklch(0.85 0.2 160)", delay: 4, duration: 6 },
    { size: 18, x: "25%", y: "72%", color: "oklch(0.75 0.2 60)", delay: 1, duration: 8 },
  ], []);

  return (
    <>
      {spheres.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: `radial-gradient(circle at 35% 35%, oklch(1 0 0 / 0.3), ${s.color} 50%, transparent 70%)`,
            boxShadow: `0 0 ${s.size}px ${s.color}, 0 0 ${s.size * 2}px ${s.color.replace(")", " / 0.3)")}`,
            animation: `float-orbit ${s.duration}s ease-in-out ${s.delay}s infinite`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </>
  );
}

/* ── 3D Network Constellation & Floating Headphone ──────────────── */
function HolographicVisualizer() {
  const nodes = useMemo(() => [
    { x: -50, y: -45, z: 35, label: "IITB", color: "oklch(0.72 0.22 320)" },
    { x: 55, y: -35, z: -30, label: "BITS", color: "oklch(0.78 0.18 200)" },
    { x: -45, y: 50, z: -40, label: "DU", color: "oklch(0.85 0.2 160)" },
    { x: 50, y: 40, z: 50, label: "VIT", color: "oklch(0.80 0.12 60)" },
    { x: 0, y: -65, z: -15, label: "SRM", color: "oklch(0.75 0.20 350)" },
  ], []);

  const orbits = useMemo(() => [
    { rx: 35, ry: 65, rX: 55, rY: 35, rZ: 15 },
    { rx: 65, ry: 35, rX: 20, rY: 60, rZ: 35 },
    { rx: 45, ry: 45, rX: 40, rY: 25, rZ: 60 },
  ], []);

  const waves = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);

  return (
    <div
      className="absolute right-[4%] top-[10%] md:right-[8%] md:top-[8%]"
      style={{
        animation: "float-gentle 8s ease-in-out infinite",
        perspective: "1000px",
      }}
    >
      {/* HUD Frame / Grid Panel */}
      <div
        className="relative w-[210px] h-[210px] md:w-[250px] md:h-[250px] rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_oklch(0.72_0.22_320/0.08)] overflow-hidden"
        style={{
          transform: "rotateY(-15deg) rotateX(10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glowing grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Sweep scanner effect */}
        <div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-oklch(0.78_0.18_200/_0.4) to-transparent top-0"
          style={{
            animation: "scan-line 4s ease-in-out infinite",
          }}
        />

        {/* 3D Rotating Constellation Container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            animation: "spin-3d-node 25s linear infinite",
          }}
        >
          {/* Orbital path lines */}
          {orbits.map((orb, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                transform: `rotateX(${orb.rX}deg) rotateY(${orb.rY}deg) rotateZ(${orb.rZ}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="rounded-full border border-dashed border-white/15"
                style={{
                  width: `${orb.rx * 2}px`,
                  height: `${orb.ry * 2}px`,
                  boxShadow: "0 0 8px oklch(0.72 0.22 320 / 0.05)",
                }}
              />
            </div>
          ))}

          {/* Node Connections & Vertices */}
          {nodes.map((node, i) => (
            <div
              key={i}
              className="absolute flex items-center gap-1.5"
              style={{
                transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Glowing Node Point */}
              <div
                className="w-2 h-2 rounded-full relative shrink-0"
                style={{
                  background: node.color,
                  boxShadow: `0 0 8px ${node.color}, 0 0 16px ${node.color}`,
                  animation: `glow-pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
                }}
              >
                <div
                  className="absolute -inset-1 rounded-full border border-white/20 animate-ping opacity-60"
                  style={{ animationDuration: "2.5s" }}
                />
              </div>
              {/* College Label */}
              <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded px-1.5 py-0.5 shadow-md">
                <span className="text-[7px] font-black tracking-widest text-white/80 font-mono">
                  {node.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Floating Creative Headphone (integrated in the center) */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            animation: "headphone-bob 6s ease-in-out infinite",
            top: "52%",
          }}
        >
          {/* Headphone arc (headband) */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="absolute pointer-events-none"
            style={{
              transform: "translateY(-18px)",
              filter: "drop-shadow(0 0 6px oklch(0.72 0.22 320 / 0.5))",
            }}
          >
            <path
              d="M 15 50 A 26 26 0 0 1 65 50"
              fill="none"
              stroke="url(#headphone-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="headphone-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.72 0.22 320)" />
                <stop offset="50%" stopColor="oklch(0.78 0.18 200)" />
                <stop offset="100%" stopColor="oklch(0.72 0.22 320)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Left Earcup */}
          <div
            className="absolute rounded-xl"
            style={{
              width: "16px",
              height: "32px",
              left: "-38px",
              transform: "rotateY(10deg) translateZ(5px)",
              background: "oklch(1 0 0 / 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid oklch(1 0 0 / 0.15)",
              boxShadow: "0 0 12px oklch(0.72 0.22 320 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.1)",
            }}
          >
            {/* LED Glow dot */}
            <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            {/* Outer metallic hinge */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-1 w-3 h-2 rounded bg-white/20" />
            {/* Waveform indicator */}
            <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between h-3">
              {waves.map((w) => (
                <div
                  key={w}
                  className="w-[1.5px] rounded-full bg-primary"
                  style={{
                    height: "100%",
                    animation: `wave-pulse ${0.6 + w * 0.15}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Earcup */}
          <div
            className="absolute rounded-xl"
            style={{
              width: "16px",
              height: "32px",
              right: "-38px",
              transform: "rotateY(-10deg) translateZ(5px)",
              background: "oklch(1 0 0 / 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid oklch(1 0 0 / 0.15)",
              boxShadow: "0 0 12px oklch(0.72 0.22 320 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.1)",
            }}
          >
            {/* LED Glow dot */}
            <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            {/* Outer metallic hinge */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-1 w-3 h-2 rounded bg-white/20" />
            {/* Waveform indicator */}
            <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between h-3">
              {waves.map((w) => (
                <div
                  key={w}
                  className="w-[1.5px] rounded-full bg-primary"
                  style={{
                    height: "100%",
                    animation: `wave-pulse ${0.5 + w * 0.12}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry scrolling stats (glass plate HUD elements) */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[7px] font-mono text-white/35 pointer-events-none">
          <div>SYS STATUS: ACTIVE</div>
          <div>PEERS: 1,482</div>
          <div>SYNC: 100%</div>
        </div>

        {/* Ambient glow accent */}
        <div
          className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-primary/10 filter blur-2xl pointer-events-none"
        />
        <div
          className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-secondary/10 filter blur-2xl pointer-events-none"
        />
      </div>

      {/* 3D depth shadow underneath */}
      <div
        className="absolute -bottom-4 left-[15%] right-[15%] h-3 rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse, oklch(0 0 0 / 0.25), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

/* ── Glass Cubes ────────────────────────────────────────────────── */
function GlassCubes() {
  const cubes = useMemo(() => [
    { size: 40, x: "8%", y: "55%", speed: 15, delay: 0 },
    { size: 28, x: "82%", y: "58%", speed: 20, delay: 3 },
    { size: 22, x: "45%", y: "80%", speed: 18, delay: 6 },
  ], []);

  return (
    <>
      {cubes.map((cube, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: cube.x,
            top: cube.y,
            width: cube.size,
            height: cube.size,
            animation: `float-bob ${cube.speed * 0.6}s ease-in-out ${cube.delay}s infinite`,
          }}
        >
          <div
            className="cube-3d w-full h-full"
            style={{
              "--cube-size": `${cube.size / 2}px`,
              animationDuration: `${cube.speed}s`,
              animationDelay: `${cube.delay}s`,
            } as React.CSSProperties}
          >
            <div className="cube-face cube-face-front" />
            <div className="cube-face cube-face-back" />
            <div className="cube-face cube-face-right" />
            <div className="cube-face cube-face-left" />
            <div className="cube-face cube-face-top" />
            <div className="cube-face cube-face-bottom" />
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Neon Rings ─────────────────────────────────────────────────── */
function NeonRings() {
  return (
    <>
      {/* Large outer ring */}
      <svg
        className="neon-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hero-scene-mobile-hide"
        width="420"
        height="420"
        viewBox="0 0 420 420"
        style={{ animationDuration: "25s", opacity: 0.3 }}
      >
        <circle cx="210" cy="210" r="200" stroke="oklch(0.72 0.22 320)" strokeWidth="1" />
      </svg>

      {/* Medium inner ring */}
      <svg
        className="neon-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ animationDuration: "18s", animationDirection: "reverse", opacity: 0.25 }}
      >
        <circle cx="150" cy="150" r="140" stroke="oklch(0.78 0.18 200)" strokeWidth="1" />
      </svg>

      {/* Small core ring */}
      <svg
        className="neon-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hero-scene-mobile-hide"
        width="180"
        height="180"
        viewBox="0 0 180 180"
        style={{ animationDuration: "12s", opacity: 0.2 }}
      >
        <circle cx="90" cy="90" r="80" stroke="oklch(0.85 0.2 160)" strokeWidth="0.5" />
      </svg>
    </>
  );
}

/* ── Confetti Sparks ────────────────────────────────────────────── */
function ConfettiSparks() {
  const sparks = useMemo(() => {
    const colors = [
      "oklch(0.72 0.22 320)",
      "oklch(0.78 0.18 200)",
      "oklch(0.85 0.2 160)",
      "oklch(0.80 0.12 60)",
      "oklch(0.75 0.20 350)",
    ];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: `${10 + Math.random() * 80}%`,
      y: `${20 + Math.random() * 60}%`,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 6,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute hero-scene-mobile-hide"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size * 0.6,
            background: s.color,
            borderRadius: "1px",
            opacity: 0.5,
            transform: `rotate(${s.rotate}deg)`,
            animation: `confetti-fall ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ── Particle Trails ────────────────────────────────────────────── */
function ParticleTrails() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      color: i % 3 === 0
        ? "oklch(0.72 0.22 320 / 0.5)"
        : i % 3 === 1
          ? "oklch(0.78 0.18 200 / 0.4)"
          : "oklch(0.85 0.2 160 / 0.3)",
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full hero-scene-mobile-hide"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `particle-twinkle ${p.duration * 0.3}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ── Cityscape Silhouette ───────────────────────────────────────── */
function CityscapeSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[120px] md:h-[160px] cityscape-glow overflow-hidden opacity-30">
      <svg
        viewBox="0 0 800 160"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
        className="absolute bottom-0 w-full"
      >
        <defs>
          <linearGradient id="city-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.22 320)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="oklch(0.60 0.18 280)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.40 0.12 270)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0 160 L0 120 L30 120 L30 90 L45 90 L45 70 L55 70 L55 90 L70 90 L70 100 L90 100 L90 60 L100 60 L100 50 L110 50 L110 60 L120 60 L120 80 L140 80 L140 110 L160 110 L160 75 L170 75 L170 55 L180 45 L190 55 L190 75 L200 75 L200 95 L220 95 L220 65 L235 65 L235 40 L245 35 L255 40 L255 65 L270 65 L270 85 L290 85 L290 100 L310 100 L310 70 L320 70 L320 50 L330 45 L340 50 L340 70 L350 70 L350 90 L370 90 L370 110 L390 110 L390 80 L400 80 L400 55 L410 50 L420 55 L420 80 L440 80 L440 95 L460 95 L460 75 L475 75 L475 45 L485 40 L495 45 L495 75 L510 75 L510 90 L530 90 L530 105 L550 105 L550 70 L560 70 L560 55 L575 55 L575 40 L585 35 L595 40 L595 55 L605 55 L605 70 L620 70 L620 90 L640 90 L640 100 L660 100 L660 85 L680 85 L680 95 L700 95 L700 110 L720 110 L720 100 L740 100 L740 115 L760 115 L760 105 L780 105 L780 120 L800 120 L800 160 Z"
          fill="url(#city-gradient)"
        />
        {/* Window lights */}
        {[
          { x: 38, y: 96 }, { x: 48, y: 78 }, { x: 95, y: 66 }, { x: 105, y: 56 },
          { x: 175, y: 62 }, { x: 240, y: 48 }, { x: 325, y: 56 }, { x: 405, y: 62 },
          { x: 480, y: 52 }, { x: 565, y: 48 }, { x: 580, y: 62 }, { x: 655, y: 78 },
        ].map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="3"
            height="4"
            fill="oklch(0.85 0.15 60)"
            opacity={0.4 + Math.random() * 0.4}
          >
            <animate
              attributeName="opacity"
              values={`${0.3 + Math.random() * 0.3};${0.6 + Math.random() * 0.4};${0.3 + Math.random() * 0.3}`}
              dur={`${2 + Math.random() * 3}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
}
