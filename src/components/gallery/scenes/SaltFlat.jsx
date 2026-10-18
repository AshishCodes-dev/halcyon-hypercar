/* ==========================================================================
   SALT FLAT SCENE
   Zero-horizon expanse with mirror-symmetric sky and ground,
   subtle perspective polygon crack fissures fanning forward,
   soft atmospheric haze band, and a single distant glowing dot on the horizon.
   Pure SVG + CSS with layered parallax.
   ========================================================================== */

export default function SaltFlat({ isVisible = true }) {
  return (
    <div className={`scene-stage salt-flat-scene ${isVisible ? 'is-active' : 'is-paused'}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg"
      >
        <defs>
          {/* Mirror-symmetric sky to ground gradient */}
          <linearGradient id="saltSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg)" />
            <stop offset="65%" stopColor="color-mix(in srgb, var(--accent) 10%, var(--bg))" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 25%, var(--bg))" />
          </linearGradient>

          <linearGradient id="saltGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 25%, var(--bg))" />
            <stop offset="35%" stopColor="color-mix(in srgb, var(--surface) 80%, var(--bg))" />
            <stop offset="100%" stopColor="var(--bg)" />
          </linearGradient>

          {/* Soft atmospheric haze band across middle horizon */}
          <linearGradient id="saltHazeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="color-mix(in srgb, var(--accent) 30%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: Minimalist Sky & Horizon Datum ================= */}
        <g className="scene-layer scene-layer-bg">
          {/* Upper Sky */}
          <rect width="600" height="350" fill="url(#saltSkyGrad)" />
          {/* Salt Ground Base */}
          <rect y="350" width="600" height="350" fill="url(#saltGroundGrad)" />

          {/* Soft Atmospheric Haze Band */}
          <rect y="310" width="600" height="80" fill="url(#saltHazeGrad)" opacity="0.75" />

          {/* Pin-sharp Infinite Horizon Line */}
          <line
            x1="0"
            y1="350"
            x2="600"
            y2="350"
            stroke="color-mix(in srgb, var(--text) 45%, transparent)"
            strokeWidth="1"
          />

          {/* Extremely distant subtle mountain mirage ridges on horizon */}
          <path
            d="M 60 350 Q 140 342, 210 345 Q 260 348, 290 350"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 330 350 Q 400 344, 480 346 Q 520 349, 550 350"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
            fill="none"
          />
        </g>

        {/* ================= LAYER 2: Perspective Salt Crust Fissure Lines ================= */}
        <g className="scene-layer scene-layer-mid">
          {/* Perspective Radial Lines fanning out from vanishing center (300, 350) */}
          <line x1="300" y1="350" x2="30" y2="700" stroke="color-mix(in srgb, var(--text) 16%, transparent)" strokeWidth="1" />
          <line x1="300" y1="350" x2="140" y2="700" stroke="color-mix(in srgb, var(--text) 18%, transparent)" strokeWidth="1.2" />
          <line x1="300" y1="350" x2="250" y2="700" stroke="color-mix(in srgb, var(--text) 20%, transparent)" strokeWidth="1.2" />
          <line x1="300" y1="350" x2="350" y2="700" stroke="color-mix(in srgb, var(--text) 20%, transparent)" strokeWidth="1.2" />
          <line x1="300" y1="350" x2="460" y2="700" stroke="color-mix(in srgb, var(--text) 18%, transparent)" strokeWidth="1.2" />
          <line x1="300" y1="350" x2="570" y2="700" stroke="color-mix(in srgb, var(--text) 16%, transparent)" strokeWidth="1" />

          {/* Transverse Salt Hexagonal Polygon Ring 1 (Distant) */}
          <path
            d="M 230 390 L 265 388 L 300 392 L 335 388 L 370 390"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
            fill="none"
          />

          {/* Transverse Salt Hexagonal Polygon Ring 2 (Mid) */}
          <path
            d="M 175 450 L 235 445 L 300 452 L 365 445 L 425 450"
            stroke="color-mix(in srgb, var(--text) 25%, transparent)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Transverse Salt Hexagonal Polygon Ring 3 (Near) */}
          <path
            d="M 100 540 L 200 532 L 300 544 L 400 532 L 500 540"
            stroke="color-mix(in srgb, var(--text) 28%, transparent)"
            strokeWidth="1.4"
            fill="none"
          />
        </g>

        {/* ================= LAYER 3: Single Distant Glowing Dot at Center Horizon ================= */}
        <g className="scene-layer scene-layer-fg">
          {/* Subtle floor light puddle from the dot */}
          <ellipse
            cx="300"
            cy="353"
            rx="24"
            ry="4"
            fill="color-mix(in srgb, var(--accent) 45%, transparent)"
            className="salt-dot-reflection"
          />

          {/* One solitary glowing dot on the zero horizon */}
          <circle
            cx="300"
            cy="350"
            r="3.2"
            fill="var(--accent)"
            className="salt-horizon-dot"
          />
        </g>
      </svg>
    </div>
  );
}
