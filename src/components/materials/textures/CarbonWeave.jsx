/* ==========================================================================
   HALCYON CARBON WEAVE TEXTURE
   Photorealistic 2x2 twill carbon fiber weave with clearcoat gloss highlight.
   Uses SVG pattern and CSS gradients. Zero hex/rgba literals.
   ========================================================================== */

export default function CarbonWeave() {
  return (
    <div
      className="material-texture-surface carbon-weave-surface"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'color-mix(in srgb, var(--text) 4%, var(--bg))',
        overflow: 'hidden',
      }}
    >
      {/* 2x2 Twill SVG Pattern Layer */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <pattern
            id="carbon-twill-2x2"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            {/* Background of unit */}
            <rect
              width="24"
              height="24"
              fill="color-mix(in srgb, var(--text) 4%, var(--bg))"
            />

            {/* Row 0: Warp, Warp, Weft, Weft */}
            {/* Block (0, 0) - Warp (vertical striations) */}
            <line x1="1" y1="0" x2="1" y2="6" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="color-mix(in srgb, var(--text) 8%, var(--bg))" strokeWidth="1" />
            <line x1="5" y1="0" x2="5" y2="6" stroke="color-mix(in srgb, var(--text) 12%, var(--bg))" strokeWidth="1" />

            {/* Block (6, 0) - Warp (vertical striations) */}
            <line x1="7" y1="0" x2="7" y2="6" stroke="color-mix(in srgb, var(--text) 13%, var(--bg))" strokeWidth="1" />
            <line x1="9" y1="0" x2="9" y2="6" stroke="color-mix(in srgb, var(--text) 7%, var(--bg))" strokeWidth="1" />
            <line x1="11" y1="0" x2="11" y2="6" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />

            {/* Block (12, 0) - Weft (horizontal striations) */}
            <line x1="12" y1="1" x2="18" y2="1" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />
            <line x1="12" y1="3" x2="18" y2="3" stroke="color-mix(in srgb, var(--text) 5%, var(--bg))" strokeWidth="1" />
            <line x1="12" y1="5" x2="18" y2="5" stroke="color-mix(in srgb, var(--text) 9%, var(--bg))" strokeWidth="1" />

            {/* Block (18, 0) - Weft (horizontal striations) */}
            <line x1="18" y1="1" x2="24" y2="1" stroke="color-mix(in srgb, var(--text) 11%, var(--bg))" strokeWidth="1" />
            <line x1="18" y1="3" x2="24" y2="3" stroke="color-mix(in srgb, var(--text) 6%, var(--bg))" strokeWidth="1" />
            <line x1="18" y1="5" x2="24" y2="5" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />

            {/* Row 1: Weft, Warp, Warp, Weft */}
            {/* Block (0, 6) - Weft */}
            <line x1="0" y1="7" x2="6" y2="7" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />
            <line x1="0" y1="9" x2="6" y2="9" stroke="color-mix(in srgb, var(--text) 5%, var(--bg))" strokeWidth="1" />
            <line x1="0" y1="11" x2="6" y2="11" stroke="color-mix(in srgb, var(--text) 9%, var(--bg))" strokeWidth="1" />

            {/* Block (6, 6) - Warp */}
            <line x1="7" y1="6" x2="7" y2="12" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />
            <line x1="9" y1="6" x2="9" y2="12" stroke="color-mix(in srgb, var(--text) 8%, var(--bg))" strokeWidth="1" />
            <line x1="11" y1="6" x2="11" y2="12" stroke="color-mix(in srgb, var(--text) 12%, var(--bg))" strokeWidth="1" />

            {/* Block (12, 6) - Warp */}
            <line x1="13" y1="6" x2="13" y2="12" stroke="color-mix(in srgb, var(--text) 13%, var(--bg))" strokeWidth="1" />
            <line x1="15" y1="6" x2="15" y2="12" stroke="color-mix(in srgb, var(--text) 7%, var(--bg))" strokeWidth="1" />
            <line x1="17" y1="6" x2="17" y2="12" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />

            {/* Block (18, 6) - Weft */}
            <line x1="18" y1="7" x2="24" y2="7" stroke="color-mix(in srgb, var(--text) 11%, var(--bg))" strokeWidth="1" />
            <line x1="18" y1="9" x2="24" y2="9" stroke="color-mix(in srgb, var(--text) 6%, var(--bg))" strokeWidth="1" />
            <line x1="18" y1="11" x2="24" y2="11" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />

            {/* Row 2: Weft, Weft, Warp, Warp */}
            {/* Block (0, 12) - Weft */}
            <line x1="0" y1="13" x2="6" y2="13" stroke="color-mix(in srgb, var(--text) 11%, var(--bg))" strokeWidth="1" />
            <line x1="0" y1="15" x2="6" y2="15" stroke="color-mix(in srgb, var(--text) 6%, var(--bg))" strokeWidth="1" />
            <line x1="0" y1="17" x2="6" y2="17" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />

            {/* Block (6, 12) - Weft */}
            <line x1="6" y1="13" x2="12" y2="13" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />
            <line x1="6" y1="15" x2="12" y2="15" stroke="color-mix(in srgb, var(--text) 5%, var(--bg))" strokeWidth="1" />
            <line x1="6" y1="17" x2="12" y2="17" stroke="color-mix(in srgb, var(--text) 9%, var(--bg))" strokeWidth="1" />

            {/* Block (12, 12) - Warp */}
            <line x1="13" y1="12" x2="13" y2="18" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />
            <line x1="15" y1="12" x2="15" y2="18" stroke="color-mix(in srgb, var(--text) 8%, var(--bg))" strokeWidth="1" />
            <line x1="17" y1="12" x2="17" y2="18" stroke="color-mix(in srgb, var(--text) 12%, var(--bg))" strokeWidth="1" />

            {/* Block (18, 12) - Warp */}
            <line x1="19" y1="12" x2="19" y2="18" stroke="color-mix(in srgb, var(--text) 13%, var(--bg))" strokeWidth="1" />
            <line x1="21" y1="12" x2="21" y2="18" stroke="color-mix(in srgb, var(--text) 7%, var(--bg))" strokeWidth="1" />
            <line x1="23" y1="12" x2="23" y2="18" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />

            {/* Row 3: Warp, Weft, Weft, Warp */}
            {/* Block (0, 18) - Warp */}
            <line x1="1" y1="18" x2="1" y2="24" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />
            <line x1="3" y1="18" x2="3" y2="24" stroke="color-mix(in srgb, var(--text) 8%, var(--bg))" strokeWidth="1" />
            <line x1="5" y1="18" x2="5" y2="24" stroke="color-mix(in srgb, var(--text) 12%, var(--bg))" strokeWidth="1" />

            {/* Block (6, 18) - Weft */}
            <line x1="6" y1="19" x2="12" y2="19" stroke="color-mix(in srgb, var(--text) 11%, var(--bg))" strokeWidth="1" />
            <line x1="6" y1="21" x2="12" y2="21" stroke="color-mix(in srgb, var(--text) 6%, var(--bg))" strokeWidth="1" />
            <line x1="6" y1="23" x2="12" y2="23" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />

            {/* Block (12, 18) - Weft */}
            <line x1="12" y1="19" x2="18" y2="19" stroke="color-mix(in srgb, var(--text) 10%, var(--bg))" strokeWidth="1" />
            <line x1="12" y1="21" x2="18" y2="21" stroke="color-mix(in srgb, var(--text) 5%, var(--bg))" strokeWidth="1" />
            <line x1="12" y1="23" x2="18" y2="23" stroke="color-mix(in srgb, var(--text) 9%, var(--bg))" strokeWidth="1" />

            {/* Block (18, 18) - Warp */}
            <line x1="19" y1="18" x2="19" y2="24" stroke="color-mix(in srgb, var(--text) 13%, var(--bg))" strokeWidth="1" />
            <line x1="21" y1="18" x2="21" y2="24" stroke="color-mix(in srgb, var(--text) 7%, var(--bg))" strokeWidth="1" />
            <line x1="23" y1="18" x2="23" y2="24" stroke="color-mix(in srgb, var(--text) 14%, var(--bg))" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#carbon-twill-2x2)" />
      </svg>

      {/* Clearcoat Gloss Diagonal Highlight Band */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(135deg, transparent 20%, color-mix(in srgb, var(--text) 5%, transparent) 40%, color-mix(in srgb, var(--text) 13%, transparent) 50%, color-mix(in srgb, var(--text) 5%, transparent) 60%, transparent 80%)',
        }}
      />
    </div>
  );
}
