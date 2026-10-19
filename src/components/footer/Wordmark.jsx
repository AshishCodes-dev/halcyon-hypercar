import { useEffect, useRef, useState, useCallback } from 'react';

export default function Wordmark({ isFooterInView }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const lightCircleRef = useRef(null);
  const rafIdRef = useRef(null);
  const isRunningRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);

  // SVG coordinate dimensions
  const viewBoxW = 1000;
  const viewBoxH = 135; // Bottom-cropped height
  const textBaselineY = 124;

  // Mouse physics (lerp 0.14)
  const posRef = useRef({
    currentX: 500,
    currentY: 70,
    targetX: 500,
    targetY: 70,
    isHovered: false,
    isTouch: false,
  });

  const tickRef = useRef(null);

  // Main animation loop: cursor tracking for fine pointers, gentle sinusoidal drift for touch
  const tick = useCallback(() => {
    if (!svgRef.current || !lightCircleRef.current) {
      isRunningRef.current = false;
      return;
    }

    const pos = posRef.current;
    const isCoarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      lightCircleRef.current.setAttribute('cx', '500');
      lightCircleRef.current.setAttribute('cy', '70');
      isRunningRef.current = false;
      return;
    }

    if (isCoarse) {
      // Touch drift: gentle ~9s sinusoidal path across letters
      const now = performance.now();
      const driftX = 500 + Math.sin(now * 0.0007) * 420;
      const driftY = 68 + Math.cos(now * 0.0014) * 22;
      lightCircleRef.current.setAttribute('cx', driftX.toFixed(1));
      lightCircleRef.current.setAttribute('cy', driftY.toFixed(1));
    } else {
      // Desktop fine pointer: smooth lerp 0.14
      pos.currentX += (pos.targetX - pos.currentX) * 0.14;
      pos.currentY += (pos.targetY - pos.currentY) * 0.14;
      lightCircleRef.current.setAttribute('cx', pos.currentX.toFixed(1));
      lightCircleRef.current.setAttribute('cy', pos.currentY.toFixed(1));

      // Settle check to sleep loop when idle
      const dist = Math.hypot(pos.targetX - pos.currentX, pos.targetY - pos.currentY);
      if (!pos.isHovered && dist < 0.25) {
        isRunningRef.current = false;
        return;
      }
    }

    if (tickRef.current) {
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, []);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const startLoop = useCallback(() => {
    if (!isRunningRef.current && tickRef.current) {
      isRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  // Handle visibility & touch loop start/stop
  useEffect(() => {
    const isCoarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches;

    if (isCoarse && isFooterInView) {
      startLoop();
    } else if (isCoarse && !isFooterInView) {
      stopLoop();
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isFooterInView && (isCoarse || posRef.current.isHovered)) {
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopLoop();
    };
  }, [isFooterInView, startLoop, stopLoop]);

  // Pointer tracking handlers
  const handlePointerEnter = (e) => {
    if (e.pointerType === 'touch') return;
    posRef.current.isHovered = true;
    setIsHovered(true);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = viewBoxW / rect.width;
      const scaleY = viewBoxH / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      posRef.current.targetX = x;
      posRef.current.targetY = y;
    }
    startLoop();
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBoxW / rect.width;
    const scaleY = viewBoxH / rect.height;
    posRef.current.targetX = (e.clientX - rect.left) * scaleX;
    posRef.current.targetY = (e.clientY - rect.top) * scaleY;
    if (!isRunningRef.current) startLoop();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') return;
    posRef.current.isHovered = false;
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className={`footer-wordmark-wrapper ${isFooterInView ? 'is-entered' : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Screen-reader accessible label */}
      <span className="sr-only">Halcyon</span>

      {/* SVG Wordmark with Dual Layers (Outline + Light Mask) */}
      <svg
        ref={svgRef}
        className="footer-wordmark-svg"
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        preserveAspectRatio="xMidYMin meet"
        aria-hidden="true"
      >
        <defs>
          {/* Accent radial gradient for the pointer/touch light beam */}
          <radialGradient
            id="footer-wordmark-light-grad"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
            <stop
              offset="45%"
              stopColor="color-mix(in srgb, var(--accent) 70%, transparent)"
              stopOpacity="0.75"
            />
            <stop
              offset="75%"
              stopColor="color-mix(in srgb, var(--accent) 25%, transparent)"
              stopOpacity="0.3"
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Letter Shape Mask: restricts light strictly inside the glyphs */}
          <mask id="footer-wordmark-mask">
            <text
              x="500"
              y={textBaselineY}
              textAnchor="middle"
              textLength="980"
              lengthAdjust="spacingAndGlyphs"
              fill="white"
              className="wordmark-mask-text"
            >
              HALCYON
            </text>
          </mask>
        </defs>

        {/* Layer 1: Base Stroke Outline (Self-drawing entrance via stroke-dashoffset) */}
        <text
          x="500"
          y={textBaselineY}
          textAnchor="middle"
          textLength="980"
          lengthAdjust="spacingAndGlyphs"
          className="wordmark-base-outline"
        >
          HALCYON
        </text>

        {/* One-Time Left-to-Right Entrance Sweep Fill */}
        <rect
          x="0"
          y="0"
          width="1000"
          height="140"
          mask="url(#footer-wordmark-mask)"
          className="wordmark-entrance-sweep"
          fill="var(--accent)"
        />

        {/* Layer 2: Interactive Light Layer (Clipped to letters, follows pointer) */}
        <g
          mask="url(#footer-wordmark-mask)"
          className={`wordmark-light-layer ${isHovered ? 'is-active' : ''}`}
        >
          <circle
            ref={lightCircleRef}
            cx="500"
            cy="70"
            r="260"
            fill="url(#footer-wordmark-light-grad)"
            className="wordmark-light-circle"
          />
        </g>
      </svg>
    </div>
  );
}
