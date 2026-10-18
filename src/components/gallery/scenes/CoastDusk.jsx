/* ==========================================================================
   COAST AT DUSK SCENE
   Atmospheric coastal twilight with gradient sky, half-sunk sun at the horizon,
   layered coastal headland ridges, ocean horizon datum, and shimmering water reflection.
   Pure SVG + CSS with layered parallax.
   ========================================================================== */

export default function CoastDusk({ isVisible = true }) {
  return (
    <div className={`scene-stage coast-dusk-scene ${isVisible ? 'is-active' : 'is-paused'}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg"
      >
        <defs>
          {/* Twilight sky gradient from accent twilight mix at horizon to black sky */}
          <linearGradient id="duskSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg)" />
            <stop offset="45%" stopColor="color-mix(in srgb, var(--accent) 15%, var(--bg))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 35%, var(--bg))" />
          </linearGradient>

          {/* Sun atmospheric glow */}
          <radialGradient id="duskSunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
            <stop offset="40%" stopColor="color-mix(in srgb, var(--accent) 50%, transparent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Water reflection column */}
          <linearGradient id="duskWaterColumn" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="45%" stopColor="color-mix(in srgb, var(--accent) 25%, transparent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: Twilight Sky & Half-Sunk Sun ================= */}
        <g className="scene-layer scene-layer-bg">
          {/* Upper Sky */}
          <rect width="600" height="420" fill="url(#duskSkyGrad)" />

          {/* Large soft sun sitting on the ocean horizon at y=420 */}
          <circle
            cx="300"
            cy="420"
            r="82"
            fill="url(#duskSunGlow)"
            className="dusk-sun-orb"
          />
          <circle
            cx="300"
            cy="420"
            r="40"
            fill="color-mix(in srgb, var(--accent) 80%, var(--text))"
            opacity="0.85"
          />
        </g>

        {/* ================= LAYER 2: Distant Ocean Horizon & Headland ================= */}
        <g className="scene-layer scene-layer-mid">
          {/* Sea Base */}
          <rect y="420" width="600" height="280" fill="color-mix(in srgb, var(--bg) 92%, var(--surface))" />

          {/* Thin Ocean Horizon Datum */}
          <line
            x1="0"
            y1="420"
            x2="600"
            y2="420"
            stroke="color-mix(in srgb, var(--accent) 45%, var(--text))"
            strokeWidth="1.2"
          />

          {/* Shimmering Sun Reflection Column on Sea */}
          <polygon
            points="290,420 310,420 345,700 255,700"
            fill="url(#duskWaterColumn)"
            className="dusk-reflection-column"
          />

          {/* Horizontal Sea Ripple Lines */}
          <line x1="280" y1="435" x2="320" y2="435" stroke="var(--accent)" strokeWidth="1.2" opacity="0.7" />
          <line x1="270" y1="460" x2="330" y2="460" stroke="var(--accent)" strokeWidth="1.5" opacity="0.55" />
          <line x1="255" y1="500" x2="345" y2="500" stroke="var(--accent)" strokeWidth="1.8" opacity="0.4" />
          <line x1="240" y1="560" x2="360" y2="560" stroke="var(--accent)" strokeWidth="2.2" opacity="0.25" />

          {/* Distant Coastal Headland Silhouette */}
          <path
            d="M 0 420 Q 80 405, 160 412 Q 220 418, 250 420 L 0 420 Z"
            fill="color-mix(in srgb, var(--surface) 60%, var(--bg))"
          />
        </g>

        {/* ================= LAYER 3: Mid & Foreground Coastal Hills ================= */}
        <g className="scene-layer scene-layer-fg">
          {/* Mid Ridge (Right) */}
          <path
            d="M 370 420 Q 450 380, 520 395 Q 570 405, 600 420 L 600 460 L 370 420 Z"
            fill="color-mix(in srgb, var(--text) 18%, var(--bg))"
          />

          {/* Foreground Cliff / Winding Coastal Edge (Left) */}
          <path
            d="M 0 490 Q 70 465, 140 480 Q 210 500, 260 550 L 260 700 L 0 700 Z"
            fill="color-mix(in srgb, var(--text) 10%, var(--bg))"
            stroke="color-mix(in srgb, var(--text) 16%, transparent)"
            strokeWidth="1.2"
          />

          {/* Foreground Headland Promontory (Right) */}
          <path
            d="M 380 700 Q 440 570, 530 540 Q 570 535, 600 550 L 600 700 Z"
            fill="color-mix(in srgb, var(--text) 7%, var(--bg))"
            stroke="color-mix(in srgb, var(--text) 14%, transparent)"
            strokeWidth="1.2"
          />

          {/* Two tiny light points along distant coastal road */}
          <circle cx="175" cy="485" r="1.5" fill="var(--accent)" opacity="0.9" />
          <circle cx="182" cy="486" r="1.5" fill="var(--accent)" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
