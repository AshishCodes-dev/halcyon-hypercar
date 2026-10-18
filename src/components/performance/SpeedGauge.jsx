/* ==========================================================================
   HALCYON SPEED GAUGE COMPONENT
   270-degree technical arc gauge with tick marks every 20 km/h,
   major numeric ticks every 100 km/h, animated filled accent arc,
   live arc-tip dot, and large tabular center readout.
   Updated directly via DOM refs to avoid React re-render overhead.
   ========================================================================== */

import { forwardRef } from 'react';
import { SPEED_CONFIG } from '../../data/performance';

// Arc constants
export const GAUGE_RADIUS = 114;
export const GAUGE_CENTER_X = 160;
export const GAUGE_CENTER_Y = 160;
// Arc from 135 deg to 405 deg (270 degrees total)
export const GAUGE_ARC_LENGTH = GAUGE_RADIUS * 1.5 * Math.PI; // ~537.212

// Pre-calculate tick marks: 21 ticks from 0 to 400 km/h (every 20 km/h)
const TICKS = Array.from({ length: 21 }, (_, i) => {
  const speed = i * 20;
  const fraction = i / 20;
  const angleDeg = 135 + fraction * 270;
  const rad = (angleDeg * Math.PI) / 180;
  const isMajor = i % 5 === 0; // 0, 100, 200, 300, 400

  const rInner = isMajor ? 123 : 125;
  const rOuter = isMajor ? 136 : 131;
  const rLabel = 148;

  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return {
    speed,
    isMajor,
    x1: (GAUGE_CENTER_X + rInner * cos).toFixed(2),
    y1: (GAUGE_CENTER_Y + rInner * sin).toFixed(2),
    x2: (GAUGE_CENTER_X + rOuter * cos).toFixed(2),
    y2: (GAUGE_CENTER_Y + rOuter * sin).toFixed(2),
    labelX: isMajor ? (GAUGE_CENTER_X + rLabel * cos).toFixed(2) : null,
    labelY: isMajor ? (GAUGE_CENTER_Y + rLabel * sin + 3.5).toFixed(2) : null,
  };
});

const SpeedGauge = forwardRef(function SpeedGauge(
  {
    initialSpeed = 0,
    speedTextRef,
    gaugeArcRef,
    gaugeDotRef,
    gaugeTrackRef,
  },
  _ref
) {
  const initialFraction = initialSpeed / SPEED_CONFIG.maxSpeed;
  const initialOffset = (GAUGE_ARC_LENGTH * (1 - initialFraction)).toFixed(2);
  const initialRad = ((135 + initialFraction * 270) * Math.PI) / 180;
  const initialDotX = (GAUGE_CENTER_X + GAUGE_RADIUS * Math.cos(initialRad)).toFixed(2);
  const initialDotY = (GAUGE_CENTER_Y + GAUGE_RADIUS * Math.sin(initialRad)).toFixed(2);

  // SVG arc path from 135 deg to 405 deg (radius 114)
  // x1 = 160 - 114 * 0.7071068 = 79.39
  // y1 = 160 + 114 * 0.7071068 = 240.61
  // x2 = 160 + 114 * 0.7071068 = 240.61
  // y2 = 160 + 114 * 0.7071068 = 240.61
  const arcPathData = 'M 79.39 240.61 A 114 114 0 1 1 240.61 240.61';

  return (
    <div className="speed-gauge-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="speed-gauge-svg"
      >
        <defs>
          {/* Subtle drop-shadow filter for the filled accent arc */}
          <filter id="gaugeArcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor="color-mix(in srgb, var(--accent) 60%, transparent)"
            />
          </filter>

          {/* Core glow for tip dot */}
          <filter id="gaugeDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="var(--accent)"
            />
          </filter>
        </defs>

        {/* 1. Track Arc (Muted stroke) */}
        <path
          ref={gaugeTrackRef}
          d={arcPathData}
          stroke="color-mix(in srgb, var(--text) 18%, transparent)"
          strokeWidth="3"
          strokeLinecap="round"
          className="gauge-track-path"
        />

        {/* 2. Filled Progress Arc (Accent with glow) */}
        <path
          ref={gaugeArcRef}
          d={arcPathData}
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={GAUGE_ARC_LENGTH}
          strokeDashoffset={initialOffset}
          filter="url(#gaugeArcGlow)"
          className="gauge-progress-path"
        />

        {/* 3. Tip Dot (Rides arc head) */}
        <circle
          ref={gaugeDotRef}
          cx={initialDotX}
          cy={initialDotY}
          r="4.5"
          fill="var(--accent)"
          filter="url(#gaugeDotGlow)"
          className="gauge-tip-dot"
          style={{ opacity: initialSpeed > 0 ? 1 : 0.4 }}
        />

        {/* 4. Fine & Major Ticks */}
        <g className="gauge-ticks-group">
          {TICKS.map((t) => (
            <g key={t.speed} className={`gauge-tick ${t.isMajor ? 'is-major' : ''}`}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={
                  t.isMajor
                    ? 'color-mix(in srgb, var(--text) 55%, transparent)'
                    : 'color-mix(in srgb, var(--text) 22%, transparent)'
                }
                strokeWidth={t.isMajor ? '1.5' : '1'}
                strokeLinecap="round"
              />
              {t.isMajor && (
                <text
                  x={t.labelX}
                  y={t.labelY}
                  textAnchor="middle"
                  className="gauge-tick-label"
                  fill="var(--muted)"
                >
                  {t.speed}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* 5. Center Speed Number & Unit */}
        <g className="gauge-center-readout">
          <text
            ref={speedTextRef}
            x={GAUGE_CENTER_X}
            y={GAUGE_CENTER_Y - 4}
            textAnchor="middle"
            className="gauge-speed-val"
          >
            {initialSpeed}
          </text>
          <text
            x={GAUGE_CENTER_X}
            y={GAUGE_CENTER_Y + 28}
            textAnchor="middle"
            className="gauge-unit-label"
          >
            {SPEED_CONFIG.unit}
          </text>
        </g>
      </svg>
    </div>
  );
});

export default SpeedGauge;
