/* ==========================================================================
   NIGHT TUNNEL SCENE
   One-point perspective tunnel with converging accent ceiling light strips,
   concentric portals, wet floor reflection streak, and two tiny distant taillights.
   Pure SVG + CSS with layered parallax shifts.
   ========================================================================== */

export default function NightTunnel({ isVisible = true }) {
  return (
    <div className={`scene-stage night-tunnel-scene ${isVisible ? 'is-active' : 'is-paused'}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg"
      >
        <defs>
          {/* Deep tunnel gradient */}
          <radialGradient id="tunnelDarkGrad" cx="50%" cy="54%" r="65%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 12%, var(--bg))" />
            <stop offset="60%" stopColor="var(--bg)" />
            <stop offset="100%" stopColor="var(--bg)" />
          </radialGradient>

          {/* Floor streak gradient */}
          <linearGradient id="tunnelFloorStreak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="40%" stopColor="color-mix(in srgb, var(--accent) 40%, transparent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Ceiling light gradient */}
          <linearGradient id="tunnelCeilingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: Deep Tunnel Background ================= */}
        <g className="scene-layer scene-layer-bg">
          <rect width="600" height="700" fill="url(#tunnelDarkGrad)" />
          {/* Concentric Portal Frames */}
          <rect
            x="270"
            y="355"
            width="60"
            height="52"
            rx="6"
            stroke="color-mix(in srgb, var(--text) 20%, transparent)"
            strokeWidth="1"
          />
          <rect
            x="230"
            y="320"
            width="140"
            height="122"
            rx="12"
            stroke="color-mix(in srgb, var(--text) 18%, transparent)"
            strokeWidth="1.2"
          />
          <rect
            x="175"
            y="270"
            width="250"
            height="222"
            rx="20"
            stroke="color-mix(in srgb, var(--text) 16%, transparent)"
            strokeWidth="1.5"
          />
        </g>

        {/* ================= LAYER 2: Mid-ground Portals & Converging Strips ================= */}
        <g className="scene-layer scene-layer-mid">
          <rect
            x="110"
            y="210"
            width="380"
            height="342"
            rx="30"
            stroke="color-mix(in srgb, var(--text) 14%, transparent)"
            strokeWidth="1.8"
          />
          <rect
            x="35"
            y="140"
            width="530"
            height="482"
            rx="42"
            stroke="color-mix(in srgb, var(--text) 12%, transparent)"
            strokeWidth="2"
          />

          {/* Converging Ceiling LED Light Strips */}
          <line
            x1="35"
            y1="140"
            x2="270"
            y2="355"
            stroke="url(#tunnelCeilingGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="tunnel-strip tunnel-strip-left"
          />
          <line
            x1="565"
            y1="140"
            x2="330"
            y2="355"
            stroke="url(#tunnelCeilingGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="tunnel-strip tunnel-strip-right"
          />
          <line
            x1="300"
            y1="140"
            x2="300"
            y2="355"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="tunnel-strip tunnel-strip-center"
          />
        </g>

        {/* ================= LAYER 3: Wet Floor Reflection & Distant Taillights ================= */}
        <g className="scene-layer scene-layer-fg">
          {/* Vanishing asphalt floor horizon line */}
          <line
            x1="0"
            y1="407"
            x2="600"
            y2="407"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
          />

          {/* Wet asphalt bright floor reflection streak */}
          <polygon
            points="300,381 245,700 355,700"
            fill="url(#tunnelFloorStreak)"
            className="tunnel-floor-glare"
          />

          {/* Lateral wet track reflection lines */}
          <line
            x1="285"
            y1="430"
            x2="315"
            y2="430"
            stroke="var(--accent)"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line
            x1="270"
            y1="475"
            x2="330"
            y2="475"
            stroke="color-mix(in srgb, var(--accent) 70%, transparent)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="250"
            y1="540"
            x2="350"
            y2="540"
            stroke="color-mix(in srgb, var(--accent) 50%, transparent)"
            strokeWidth="2.5"
            opacity="0.4"
          />

          {/* Two tiny distant light dots at the vanishing point */}
          <circle
            cx="296"
            cy="381"
            r="1.8"
            fill="var(--accent)"
            className="tunnel-far-dot"
          />
          <circle
            cx="304"
            cy="381"
            r="1.8"
            fill="var(--accent)"
            className="tunnel-far-dot"
          />
        </g>
      </svg>
    </div>
  );
}
