/* ==========================================================================
   HALCYON ANODISED ACCENT TEXTURE
   Brushed metal tinted live with var(--accent), with high-lustre anodised sheen.
   Follows active theme accent dynamically via CSS variables. Zero hex/rgba literals.
   ========================================================================== */

export default function AnodisedAccent() {
  return (
    <div
      className="material-texture-surface anodised-accent-surface"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor:
          'color-mix(in srgb, var(--accent) 55%, color-mix(in srgb, var(--surface) 65%, var(--bg)))',
        overflow: 'hidden',
      }}
    >
      {/* Fine Repeating Horizontal Brush Lines tinted with accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(180deg, color-mix(in srgb, var(--accent) 70%, var(--text)) 0px, color-mix(in srgb, var(--accent) 70%, var(--text)) 1px, transparent 1px, transparent 3px, color-mix(in srgb, var(--accent) 40%, var(--bg)) 3px, color-mix(in srgb, var(--accent) 40%, var(--bg)) 4px, transparent 4px, transparent 7px, color-mix(in srgb, var(--accent) 60%, var(--text)) 7px, color-mix(in srgb, var(--accent) 60%, var(--text)) 8px, transparent 8px, transparent 11px)',
          opacity: 0.75,
        }}
      />

      {/* SVG Stretched Horizontal Grain Layer */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          mixBlendMode: 'overlay',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="halcyon-anodised-turb" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.002 0.85"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.35 0"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="color-mix(in srgb, var(--accent) 40%, var(--surface))"
          filter="url(#halcyon-anodised-turb)"
        />
      </svg>

      {/* Lighter Anodised Specular Sheen Band */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 0.45,
          background:
            'linear-gradient(105deg, transparent 15%, color-mix(in srgb, var(--accent) 35%, transparent) 38%, color-mix(in srgb, var(--text) 80%, var(--accent)) 48%, color-mix(in srgb, var(--text) 90%, transparent) 50%, color-mix(in srgb, var(--accent) 40%, transparent) 54%, transparent 80%)',
        }}
      />
    </div>
  );
}
