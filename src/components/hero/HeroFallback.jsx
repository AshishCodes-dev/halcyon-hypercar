/* ==========================================================================
   HERO FALLBACK
   Rendered when WebGL is unsupported, context is lost, or during initial load.
   Preserves full layout, typography, specs, and a static accent glow silhouette.
   ========================================================================== */

export default function HeroFallback({ isInitialLoading = false }) {
  return (
    <div className="hero-fallback-root" aria-hidden={isInitialLoading}>
      {/* Static Accent Glow behind the car position */}
      <div className="hero-fallback-glow" aria-hidden="true" />

      {/* Concept Car Silhouette Graphic for no-WebGL devices */}
      {!isInitialLoading && (
        <div className="hero-fallback-silhouette" aria-hidden="true">
          <svg
            viewBox="0 0 960 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hero-fallback-svg"
          >
            {/* Aerodynamic Hypercar Body Contour */}
            <path
              d="M 80 240 Q 180 240 260 215 Q 380 180 500 135 Q 600 95 720 95 Q 820 100 890 160 L 920 220 L 910 245 L 80 245 Z"
              fill="rgba(14, 14, 14, 0.85)"
              stroke="color-mix(in srgb, var(--accent) 30%, transparent)"
              strokeWidth="1.5"
            />
            {/* Cockpit Canopy Line */}
            <path
              d="M 380 180 Q 480 140 560 105 Q 660 100 740 140"
              stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
              strokeWidth="2"
              fill="none"
            />
            {/* Front Light Blade */}
            <line
              x1="90"
              y1="230"
              x2="220"
              y2="230"
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Rear Light Blade */}
            <line
              x1="860"
              y1="190"
              x2="920"
              y2="215"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Wheel Arch Cutouts */}
            <circle cx="280" cy="245" r="48" fill="#050505" stroke="var(--line)" strokeWidth="2" />
            <circle cx="280" cy="245" r="30" fill="#0d0d0d" stroke="var(--accent)" strokeWidth="1" />
            <circle cx="760" cy="245" r="50" fill="#050505" stroke="var(--line)" strokeWidth="2" />
            <circle cx="760" cy="245" r="32" fill="#0d0d0d" stroke="var(--accent)" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}
