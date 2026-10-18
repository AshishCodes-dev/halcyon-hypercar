/* ==========================================================================
   HALCYON FORGED ALUMINIUM TEXTURE
   Horizontally brushed billet metal with anisotropic light bands & turbulence.
   Zero hex/rgba literals.
   ========================================================================== */

export default function ForgedAluminium() {
  return (
    <div
      className="material-texture-surface forged-aluminium-surface"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'color-mix(in srgb, var(--text) 12%, var(--bg))',
        overflow: 'hidden',
      }}
    >
      {/* Fine Repeating Horizontal Brush Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(180deg, color-mix(in srgb, var(--text) 18%, transparent) 0px, color-mix(in srgb, var(--text) 18%, transparent) 1px, transparent 1px, transparent 3px, color-mix(in srgb, var(--text) 12%, transparent) 3px, color-mix(in srgb, var(--text) 12%, transparent) 4px, transparent 4px, transparent 7px, color-mix(in srgb, var(--text) 15%, transparent) 7px, color-mix(in srgb, var(--text) 15%, transparent) 8px, transparent 8px, transparent 11px)',
          opacity: 0.85,
        }}
      />

      {/* SVG Horizontally Stretched Grain Turbulence Layer */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          mixBlendMode: 'overlay',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="halcyon-forged-turb" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.002 0.85"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.4 0"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="color-mix(in srgb, var(--text) 10%, var(--bg))"
          filter="url(#halcyon-forged-turb)"
        />
      </svg>

      {/* Soft Vertical Anisotropic Light Bands */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--text) 10%, transparent) 22%, transparent 40%, color-mix(in srgb, var(--text) 18%, transparent) 60%, transparent 75%, color-mix(in srgb, var(--text) 8%, transparent) 95%)',
        }}
      />
    </div>
  );
}
