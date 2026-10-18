/* ==========================================================================
   HALCYON POWER CURVE COMPONENT
   Sparse technical SVG power curve showing electric hypercar power delivery,
   rising to 1,100 hp peak with subtle vertical datum line, faint gradient fill,
   3 horizontal guide datums, and a leading indicator dot.
   Updated via DOM refs for scrub performance.
   ========================================================================== */

import { forwardRef } from 'react';
import { POWER_CURVE_CONFIG } from '../../data/performance';

export const POWER_CURVE_PATH =
  'M 40 118 C 140 118, 240 45, 420 42 C 480 41, 530 47, 570 50';

export const POWER_AREA_PATH =
  'M 40 118 C 140 118, 240 45, 420 42 C 480 41, 530 47, 570 50 L 570 118 Z';

const PowerCurve = forwardRef(function PowerCurve(
  {
    initialProgress = 0,
    curvePathRef,
    curveDotRef,
    curveClipRef,
  },
  _ref
) {
  // Approximate starting coordinates at 0 progress
  const initialX = 40;
  const initialY = 118;
  const initialWidth = initialProgress > 0 ? (initialProgress * 535).toFixed(2) : 0;

  return (
    <div className="power-curve-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 600 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="power-curve-svg"
      >
        <defs>
          {/* Faint accent gradient fill under the curve */}
          <linearGradient id="powerCurveAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>

          {/* Clip path revealing curve line and area seamlessly with progress */}
          <clipPath id="powerCurveProgressClip">
            <rect
              ref={curveClipRef}
              x="36"
              y="0"
              width={initialWidth}
              height="140"
            />
          </clipPath>

          {/* Subtle glow for the indicator dot */}
          <filter id="curveDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--accent)" />
          </filter>
        </defs>

        {/* 1. Header Label */}
        <text
          x="40"
          y="22"
          className="power-curve-title-label"
          fill="var(--muted)"
        >
          {POWER_CURVE_CONFIG.label}
        </text>

        {/* 2. Three Faint Horizontal Guide Lines & Baseline */}
        <g className="power-curve-guides">
          <line
            x1="40"
            y1="42"
            x2="570"
            y2="42"
            stroke="color-mix(in srgb, var(--text) 12%, transparent)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="67"
            x2="570"
            y2="67"
            stroke="color-mix(in srgb, var(--text) 12%, transparent)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="92"
            x2="570"
            y2="92"
            stroke="color-mix(in srgb, var(--text) 12%, transparent)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          {/* Baseline Datum */}
          <line
            x1="40"
            y1="118"
            x2="570"
            y2="118"
            stroke="color-mix(in srgb, var(--text) 24%, transparent)"
            strokeWidth="1"
          />
        </g>

        {/* 3. Peak Marker (1,100 hp peak at x=420) */}
        <g className="power-curve-peak-marker">
          <line
            x1="420"
            y1="42"
            x2="420"
            y2="118"
            stroke="color-mix(in srgb, var(--text) 28%, transparent)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <circle
            cx="420"
            cy="42"
            r="2"
            fill="color-mix(in srgb, var(--text) 60%, transparent)"
          />
          <text
            x="420"
            y="30"
            textAnchor="middle"
            className="power-curve-peak-label"
            fill="var(--muted)"
          >
            {POWER_CURVE_CONFIG.peakLabel}
          </text>
        </g>

        {/* 4. Revealing Area & Stroke clipped to progress */}
        <g clipPath="url(#powerCurveProgressClip)">
          {/* Faint Gradient Fill Area */}
          <path
            d={POWER_AREA_PATH}
            fill="url(#powerCurveAreaGrad)"
            className="power-curve-area"
          />
          {/* Accent Stroke Curve */}
          <path
            ref={curvePathRef}
            d={POWER_CURVE_PATH}
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="power-curve-line"
          />
        </g>

        {/* Hidden reference path to compute getPointAtLength reliably */}
        <path
          d={POWER_CURVE_PATH}
          fill="none"
          stroke="none"
          style={{ visibility: 'hidden' }}
        />

        {/* 5. Leading Indicator Dot */}
        <circle
          ref={curveDotRef}
          cx={initialX}
          cy={initialY}
          r="4"
          fill="var(--accent)"
          filter="url(#curveDotGlow)"
          className="power-curve-dot"
          style={{ opacity: initialProgress > 0 ? 1 : 0 }}
        />
      </svg>
    </div>
  );
});

export default PowerCurve;
