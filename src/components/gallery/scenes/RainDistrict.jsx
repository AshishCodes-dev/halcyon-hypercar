/* ==========================================================================
   RAIN DISTRICT SCENE
   Moody cyberpunk city silhouettes with lit architectural windows,
   40+ falling diagonal rain streaks, and vertical blurred accent wet road reflections.
   Pure SVG + CSS with layered parallax.
   ========================================================================== */

const RAIN_DROPS = Array.from({ length: 48 }, (_, i) => {
  const x = (i * 13.5 + 7) % 600;
  const y = (i * 29.3 + 15) % 700;
  const len = 18 + (i % 5) * 6;
  const dur = 1.4 + (i % 4) * 0.3;
  const delay = ((i * 0.17) % 1.5).toFixed(2);
  const opacity = 0.25 + (i % 3) * 0.2;
  return { id: i, x, y, len, dur, delay, opacity };
});

const WINDOWS = [
  // Building 1 (x: 40-120)
  { x: 55, y: 220, w: 5, h: 8, accent: true },
  { x: 75, y: 240, w: 5, h: 8, accent: false },
  { x: 95, y: 210, w: 5, h: 8, accent: false },
  { x: 55, y: 280, w: 5, h: 8, accent: false },
  { x: 95, y: 270, w: 5, h: 8, accent: true },
  { x: 75, y: 310, w: 5, h: 8, accent: false },
  // Building 2 (x: 130-220, tall)
  { x: 145, y: 150, w: 6, h: 9, accent: true },
  { x: 165, y: 170, w: 6, h: 9, accent: false },
  { x: 195, y: 140, w: 6, h: 9, accent: false },
  { x: 145, y: 210, w: 6, h: 9, accent: false },
  { x: 175, y: 230, w: 6, h: 9, accent: true },
  { x: 195, y: 250, w: 6, h: 9, accent: false },
  { x: 155, y: 290, w: 6, h: 9, accent: false },
  // Building 3 (Center background x: 230-330)
  { x: 250, y: 280, w: 5, h: 7, accent: false },
  { x: 275, y: 260, w: 5, h: 7, accent: true },
  { x: 300, y: 290, w: 5, h: 7, accent: false },
  { x: 265, y: 330, w: 5, h: 7, accent: false },
  { x: 290, y: 340, w: 5, h: 7, accent: true },
  // Building 4 (x: 340-450, mid height)
  { x: 365, y: 190, w: 6, h: 9, accent: false },
  { x: 395, y: 180, w: 6, h: 9, accent: true },
  { x: 420, y: 210, w: 6, h: 9, accent: false },
  { x: 375, y: 240, w: 6, h: 9, accent: false },
  { x: 410, y: 260, w: 6, h: 9, accent: true },
  // Building 5 (Right x: 470-580)
  { x: 490, y: 240, w: 6, h: 8, accent: true },
  { x: 520, y: 220, w: 6, h: 8, accent: false },
  { x: 550, y: 250, w: 6, h: 8, accent: false },
  { x: 510, y: 290, w: 6, h: 8, accent: true },
  { x: 540, y: 320, w: 6, h: 8, accent: false },
];

export default function RainDistrict({ isVisible = true }) {
  return (
    <div className={`scene-stage rain-district-scene ${isVisible ? 'is-active' : 'is-paused'}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg"
      >
        <defs>
          {/* Overcast night sky */}
          <linearGradient id="rainSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg)" />
            <stop offset="60%" stopColor="color-mix(in srgb, var(--surface) 60%, var(--bg))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 18%, var(--bg))" />
          </linearGradient>

          {/* Wet asphalt reflection columns */}
          <linearGradient id="wetReflectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
            <stop offset="40%" stopColor="color-mix(in srgb, var(--accent) 30%, transparent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* ================= LAYER 1: Deep Sky & Background Towers ================= */}
        <g className="scene-layer scene-layer-bg">
          <rect width="600" height="700" fill="url(#rainSkyGrad)" />

          {/* Distant skyline towers */}
          <rect x="70" y="180" width="75" height="340" fill="color-mix(in srgb, var(--text) 8%, var(--bg))" />
          <rect x="220" y="120" width="95" height="400" fill="color-mix(in srgb, var(--text) 9%, var(--bg))" />
          <rect x="420" y="160" width="80" height="360" fill="color-mix(in srgb, var(--text) 8%, var(--bg))" />
        </g>

        {/* ================= LAYER 2: Foreground Skyline & Lit Windows ================= */}
        <g className="scene-layer scene-layer-mid">
          {/* Main City Skyline Blocks */}
          <rect x="30" y="200" width="90" height="320" fill="color-mix(in srgb, var(--text) 14%, var(--bg))" />
          <rect x="125" y="130" width="105" height="390" fill="color-mix(in srgb, var(--text) 16%, var(--bg))" />
          <polygon points="125,130 177,80 230,130" fill="color-mix(in srgb, var(--text) 16%, var(--bg))" />
          <line x1="177" y1="80" x2="177" y2="40" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx="177" cy="40" r="2.5" fill="var(--accent)" />

          <rect x="235" y="240" width="100" height="280" fill="color-mix(in srgb, var(--text) 12%, var(--bg))" />
          <rect x="340" y="170" width="115" height="350" fill="color-mix(in srgb, var(--text) 15%, var(--bg))" />
          <rect x="460" y="210" width="110" height="310" fill="color-mix(in srgb, var(--text) 13%, var(--bg))" />

          {/* Glowing Windows */}
          {WINDOWS.map((w, idx) => (
            <rect
              key={idx}
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              fill={w.accent ? 'var(--accent)' : 'color-mix(in srgb, var(--text) 70%, transparent)'}
              opacity={w.accent ? 0.9 : 0.6}
            />
          ))}
        </g>

        {/* ================= LAYER 3: Wet Asphalt & Blurred Accent Reflections ================= */}
        <g className="scene-layer scene-layer-fg">
          {/* Street Baseline */}
          <rect y="520" width="600" height="180" fill="color-mix(in srgb, var(--bg) 95%, var(--surface))" />
          <line x1="0" y1="520" x2="600" y2="520" stroke="color-mix(in srgb, var(--text) 24%, transparent)" strokeWidth="1.2" />

          {/* Blurred Vertical Neon Reflections on Wet Road */}
          <rect x="160" y="520" width="34" height="150" fill="url(#wetReflectGrad)" filter="url(#neonBlur)" opacity="0.6" />
          <rect x="380" y="520" width="40" height="160" fill="url(#wetReflectGrad)" filter="url(#neonBlur)" opacity="0.75" />
          <rect x="495" y="520" width="28" height="130" fill="url(#wetReflectGrad)" filter="url(#neonBlur)" opacity="0.5" />

          {/* Wet asphalt horizontal sheen tracks */}
          <line x1="140" y1="550" x2="220" y2="550" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />
          <line x1="360" y1="575" x2="430" y2="575" stroke="var(--accent)" strokeWidth="2" opacity="0.7" />
          <line x1="330" y1="630" x2="450" y2="630" stroke="var(--accent)" strokeWidth="2.5" opacity="0.4" />

          {/* Distant car hint: two tiny red/accent taillights on the road */}
          <circle cx="395" cy="530" r="1.6" fill="var(--accent)" />
          <circle cx="403" cy="530" r="1.6" fill="var(--accent)" />
        </g>

        {/* ================= LAYER 4: Falling Rain Streaks ================= */}
        <g className="scene-layer scene-layer-rain">
          {RAIN_DROPS.map((drop) => (
            <line
              key={drop.id}
              x1={drop.x}
              y1={drop.y}
              x2={drop.x - 7}
              y2={drop.y + drop.len}
              stroke="color-mix(in srgb, var(--text) 45%, transparent)"
              strokeWidth="1"
              strokeLinecap="round"
              className="rain-streak-line"
              style={{
                '--rain-dur': `${drop.dur}s`,
                '--rain-delay': `${drop.delay}s`,
                opacity: drop.opacity,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
