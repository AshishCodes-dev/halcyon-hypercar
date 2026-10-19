import { useEffect, useRef, useMemo } from 'react';

// SVG Geometry Constants
const SIZE = 420;
const CENTER = SIZE / 2;
const OUTER_R = 196;
const TICK_LENGTH_NORMAL = 14;
const TICK_LENGTH_LONG = 19;
const MASK_RADIUS = 186.5;
const CIRCUMFERENCE = 2 * Math.PI * MASK_RADIUS;

export default function TickRing({
  claimedCount,
  totalCount = 500,
  isEntered,
  hasNewlyClaimed = false,
}) {
  const countRef = useRef(null);
  const maskCircleRef = useRef(null);
  const scannerRef = useRef(null);
  const rafIdRef = useRef(null);
  const hasAnimatedEntranceRef = useRef(false);

  // Precompute tick geometry for high performance (one path per group)
  const {
    unclaimedPath,
    claimedPath,
    glowTicksPath,
    lastTickCoords,
  } = useMemo(() => {
    let unclaimD = '';
    let claimD = '';
    let glowD = '';
    let lastCoords = null;

    for (let i = 0; i < totalCount; i++) {
      const angle = (i / totalCount) * 2 * Math.PI - Math.PI / 2;
      const isLong = i % 50 === 0;
      const isGlow = i % 10 === 0;
      const rInner = OUTER_R - (isLong ? TICK_LENGTH_LONG : TICK_LENGTH_NORMAL);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = (CENTER + rInner * cos).toFixed(2);
      const y1 = (CENTER + rInner * sin).toFixed(2);
      const x2 = (CENTER + OUTER_R * cos).toFixed(2);
      const y2 = (CENTER + OUTER_R * sin).toFixed(2);

      const segment = `M ${x1} ${y1} L ${x2} ${y2} `;

      if (i < claimedCount) {
        claimD += segment;
        if (isGlow) {
          glowD += segment;
        }
        if (i === claimedCount - 1) {
          lastCoords = { x1, y1, x2, y2 };
        }
      } else {
        unclaimD += segment;
      }
    }

    return {
      unclaimedPath: unclaimD,
      claimedPath: claimD,
      glowTicksPath: glowD,
      lastTickCoords: lastCoords,
    };
  }, [claimedCount, totalCount]);

  // Entrance sweep animation: sequential tick reveal and count-up
  useEffect(() => {
    if (!isEntered || hasAnimatedEntranceRef.current) return;
    hasAnimatedEntranceRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targetFraction = claimedCount / totalCount;
    const targetOffset = CIRCUMFERENCE * (1 - targetFraction);

    if (prefersReducedMotion) {
      if (maskCircleRef.current) {
        maskCircleRef.current.style.strokeDashoffset = `${targetOffset}px`;
      }
      if (countRef.current) {
        countRef.current.textContent = claimedCount;
      }
      if (scannerRef.current) {
        scannerRef.current.style.display = 'none';
      }
      return;
    }

    const duration = 1800; // 1.8s as specified
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Smooth cubic-bezier deceleration
      const progress = 1 - Math.pow(1 - rawProgress, 3);

      const currentOffset = CIRCUMFERENCE - progress * (CIRCUMFERENCE - targetOffset);
      if (maskCircleRef.current) {
        maskCircleRef.current.style.strokeDashoffset = `${currentOffset}px`;
      }

      const currentCount = Math.min(claimedCount, Math.round(progress * claimedCount));
      if (countRef.current) {
        countRef.current.textContent = currentCount;
      }

      // Scanner sweep head rotation
      if (scannerRef.current) {
        const sweepDeg = progress * (claimedCount / totalCount) * 360;
        scannerRef.current.setAttribute('transform', `rotate(${sweepDeg} ${CENTER} ${CENTER})`);
        const scannerOpacity = rawProgress < 0.9 ? 1 : (1 - rawProgress) * 10;
        scannerRef.current.style.opacity = Math.max(0, scannerOpacity).toString();
      }

      if (rawProgress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        if (countRef.current) countRef.current.textContent = claimedCount;
        if (scannerRef.current) scannerRef.current.style.display = 'none';
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isEntered, claimedCount, totalCount]);

  // Synchronize count number immediately on session updates (e.g. after reservation submission)
  useEffect(() => {
    if (hasAnimatedEntranceRef.current && countRef.current) {
      countRef.current.textContent = claimedCount;
    }
    if (hasAnimatedEntranceRef.current && maskCircleRef.current) {
      const targetOffset = CIRCUMFERENCE * (1 - claimedCount / totalCount);
      maskCircleRef.current.style.strokeDashoffset = `${targetOffset}px`;
    }
  }, [claimedCount, totalCount]);

  return (
    <div className={`tick-ring-wrapper ${isEntered ? 'is-in-view' : ''}`}>
      {/* Screen-reader accessible live announcement */}
      <span className="sr-only" aria-live="polite">
        {claimedCount} of {totalCount} places claimed
      </span>

      <div className="tick-ring-container">
        <svg
          className="tick-ring-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <defs>
            {/* Circular reveal mask driving sequential entrance sweep */}
            <mask id="ring-reveal-mask">
              <circle
                ref={maskCircleRef}
                cx={CENTER}
                cy={CENTER}
                r={MASK_RADIUS}
                fill="none"
                stroke="white"
                strokeWidth="32"
                strokeDasharray={CIRCUMFERENCE}
                style={{
                  strokeDashoffset: `${CIRCUMFERENCE}px`,
                  transition: 'none',
                }}
                strokeLinecap="butt"
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              />
            </mask>
          </defs>

          {/* Group 1: Unclaimed Ticks */}
          <path
            d={unclaimedPath}
            className="tick-path-unclaimed"
            stroke="color-mix(in srgb, var(--text) 18%, transparent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Group 2: Claimed Ticks (Masked for Entrance Reveal) */}
          <g mask="url(#ring-reveal-mask)">
            <path
              d={claimedPath}
              className="tick-path-claimed"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Subtle glow layer for every 10th tick */}
            <path
              d={glowTicksPath}
              className="tick-path-glow"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 3px var(--accent))"
            />

            {/* Last Claimed Tick with continuous soft pulse */}
            {lastTickCoords && (
              <line
                x1={lastTickCoords.x1}
                y1={lastTickCoords.y1}
                x2={lastTickCoords.x2}
                y2={lastTickCoords.y2}
                className={`tick-last-pulse ${hasNewlyClaimed ? 'new-tick-flash' : ''}`}
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Entrance Scanner Sweep Head */}
          <g ref={scannerRef} className="ring-scanner-head" style={{ opacity: 0 }}>
            <line
              x1={CENTER}
              y1={CENTER - OUTER_R - 4}
              x2={CENTER}
              y2={CENTER - OUTER_R + TICK_LENGTH_LONG + 4}
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px var(--accent))"
            />
          </g>
        </svg>

        {/* Center Readout */}
        <div className="tick-ring-center-content">
          <span ref={countRef} className="tick-ring-number">
            0
          </span>
          <span className="tick-ring-sub">of {totalCount} claimed</span>
        </div>
      </div>

      {/* Production run label below ring */}
      <span className="tick-ring-run-label">Production run 01</span>
    </div>
  );
}
