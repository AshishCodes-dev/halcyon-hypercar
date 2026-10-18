/* ==========================================================================
   SUMMIT ROAD SCENE
   High-altitude alpine pass with 5 stacked mountain ridges in stepping tones,
   two drifting mist bands, a thin winding mountain road climbing the front ridge,
   and delicate night stars.
   Pure SVG + CSS with layered parallax.
   ========================================================================== */

const STARS = [
  { cx: 80, cy: 65, r: 1.2, o: 0.7 },
  { cx: 140, cy: 95, r: 1.5, o: 0.8 },
  { cx: 210, cy: 45, r: 1.0, o: 0.5 },
  { cx: 290, cy: 80, r: 1.6, o: 0.9 },
  { cx: 370, cy: 55, r: 1.2, o: 0.6 },
  { cx: 450, cy: 90, r: 1.4, o: 0.75 },
  { cx: 520, cy: 40, r: 1.8, o: 0.85 },
  { cx: 570, cy: 75, r: 1.1, o: 0.6 },
];

export default function SummitRoad({ isVisible = true }) {
  return (
    <div className={`scene-stage summit-road-scene ${isVisible ? 'is-active' : 'is-paused'}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg"
      >
        <defs>
          {/* Night sky gradient */}
          <linearGradient id="summitSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg)" />
            <stop offset="55%" stopColor="color-mix(in srgb, var(--surface) 50%, var(--bg))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 15%, var(--bg))" />
          </linearGradient>

          {/* Drifting mist band 1 */}
          <linearGradient id="summitMist1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="color-mix(in srgb, var(--text) 18%, transparent)" />
            <stop offset="70%" stopColor="color-mix(in srgb, var(--accent) 22%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Drifting mist band 2 */}
          <linearGradient id="summitMist2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="color-mix(in srgb, var(--text) 24%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: Deep Sky & Starfield ================= */}
        <g className="scene-layer scene-layer-bg">
          <rect width="600" height="700" fill="url(#summitSkyGrad)" />

          {/* Distant Star Dots */}
          {STARS.map((s, idx) => (
            <circle
              key={idx}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="color-mix(in srgb, var(--text) 85%, transparent)"
              opacity={s.o}
              className="summit-star"
            />
          ))}

          {/* Ridge 1 (Deepest background peaks) */}
          <polygon
            points="0,320 120,240 240,290 380,210 500,280 600,230 600,700 0,700"
            fill="color-mix(in srgb, var(--text) 8%, var(--bg))"
          />

          {/* Ridge 2 (Distant jagged ridge) */}
          <polygon
            points="0,380 90,340 180,360 290,290 410,350 530,310 600,340 600,700 0,700"
            fill="color-mix(in srgb, var(--text) 12%, var(--bg))"
          />
        </g>

        {/* ================= LAYER 2: Mid Ridges & Drifting Mist Bands ================= */}
        <g className="scene-layer scene-layer-mid">
          {/* Mist Band 1 (Slow drifting between ridges) */}
          <rect
            x="-60"
            y="330"
            width="720"
            height="55"
            fill="url(#summitMist1)"
            className="summit-mist-band mist-drift-left"
          />

          {/* Ridge 3 (Mid-ground mountain ridge) */}
          <polygon
            points="0,440 130,400 230,430 350,370 470,410 600,380 600,700 0,700"
            fill="color-mix(in srgb, var(--text) 16%, var(--bg))"
          />

          {/* Ridge 4 (Near mountain silhouette) */}
          <polygon
            points="0,520 160,470 280,510 420,450 540,490 600,470 600,700 0,700"
            fill="color-mix(in srgb, var(--text) 22%, var(--bg))"
          />

          {/* Mist Band 2 (Lower drift) */}
          <rect
            x="-40"
            y="470"
            width="680"
            height="45"
            fill="url(#summitMist2)"
            className="summit-mist-band mist-drift-right"
          />
        </g>

        {/* ================= LAYER 3: Foreground Pass & Thin Winding Road ================= */}
        <g className="scene-layer scene-layer-fg">
          {/* Ridge 5 (Foreground steep pass slope) */}
          <polygon
            points="0,580 180,560 320,600 480,540 600,570 600,700 0,700"
            fill="color-mix(in srgb, var(--text) 28%, var(--bg))"
            stroke="color-mix(in srgb, var(--text) 34%, transparent)"
            strokeWidth="1.2"
          />

          {/* Thin Winding Road Line climbing the front ridge */}
          <path
            d="M 60 700 
               Q 140 660, 220 665 
               T 340 635 
               Q 410 620, 390 595 
               Q 360 575, 430 565 
               L 480 545"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="summit-road-ribbon"
          />

          {/* Road edge guardrail dashed markings */}
          <path
            d="M 64 700 
               Q 144 657, 224 662 
               T 344 632 
               Q 414 617, 394 592 
               Q 364 572, 434 562"
            stroke="color-mix(in srgb, var(--text) 30%, transparent)"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Two tiny headlights cresting the mountain switchback */}
          <circle cx="430" cy="565" r="1.8" fill="color-mix(in srgb, var(--accent) 80%, var(--text))" />
          <circle cx="436" cy="564" r="1.8" fill="color-mix(in srgb, var(--accent) 80%, var(--text))" />
        </g>
      </svg>
    </div>
  );
}
