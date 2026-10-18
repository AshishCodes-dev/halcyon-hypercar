/* ==========================================================================
   HALCYON NAPPA LEATHER TEXTURE
   Fine pebbled grain with diffused lighting & inset perimeter saddle-stitching.
   Zero hex/rgba literals.
   ========================================================================== */

export default function NappaLeather() {
  return (
    <div
      className="material-texture-surface nappa-leather-surface"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'color-mix(in srgb, var(--surface) 92%, var(--bg))',
        overflow: 'hidden',
      }}
    >
      {/* Pebbled Leather Grain with Diffuse Lighting */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          mixBlendMode: 'soft-light',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="halcyon-leather-turb" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              surfaceScale="1.4"
              diffuseConstant="0.85"
              result="light"
            >
              <feDistantLight azimuth="55" elevation="50" />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="color-mix(in srgb, var(--text) 25%, var(--bg))"
          filter="url(#halcyon-leather-turb)"
        />
      </svg>

      {/* Subtle Leather Soft Sheen & Depth Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 40% 30%, color-mix(in srgb, var(--text) 6%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Handcrafted Perimeter Saddle-Stitching Line */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 1px 1px color-mix(in srgb, var(--bg) 95%, transparent))',
        }}
      >
        <rect
          x="14"
          y="14"
          width="calc(100% - 28px)"
          height="calc(100% - 28px)"
          rx="12"
          ry="12"
          fill="none"
          stroke="color-mix(in srgb, var(--text) 55%, transparent)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
