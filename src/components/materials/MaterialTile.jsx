import { useState, useRef, useEffect, useCallback } from 'react';
import CarbonWeave from './textures/CarbonWeave';
import ForgedAluminium from './textures/ForgedAluminium';
import NappaLeather from './textures/NappaLeather';
import AnodisedAccent from './textures/AnodisedAccent';

const TEXTURE_MAP = {
  CarbonWeave,
  ForgedAluminium,
  NappaLeather,
  AnodisedAccent,
};

export default function MaterialTile({ material, index, isEntered, onFirstInteraction }) {
  const tileRef = useRef(null);
  const [isLensVisible, setIsLensVisible] = useState(false);
  const [sweepTriggered, setSweepTriggered] = useState(false);

  // High-performance pointer / physics tracking without React re-renders on move
  const posRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    width: 300,
    height: 300,
    isHovered: false,
    isFocused: false,
    isTouch: false,
  });

  const rafIdRef = useRef(null);
  const isRunningRef = useRef(false);
  const touchTimeoutRef = useRef(null);

  const TextureComponent = TEXTURE_MAP[material.component] || CarbonWeave;

  // Measure tile bounding box
  const updateBounds = useCallback(() => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    posRef.current.width = rect.width;
    posRef.current.height = rect.height;
    if (posRef.current.currentX === 0 && posRef.current.currentY === 0) {
      posRef.current.currentX = rect.width / 2;
      posRef.current.currentY = rect.height / 2;
      posRef.current.targetX = rect.width / 2;
      posRef.current.targetY = rect.height / 2;
      tileRef.current.style.setProperty('--mx', `${(rect.width / 2).toFixed(2)}px`);
      tileRef.current.style.setProperty('--my', `${(rect.height / 2).toFixed(2)}px`);
    }
  }, []);

  const tickRef = useRef(null);

  // Main rAF animation loop: lerps lens position, sheen, and subtle 3D tilt
  const tick = useCallback(() => {
    if (!tileRef.current) {
      isRunningRef.current = false;
      return;
    }

    const pos = posRef.current;
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Automated gentle drift when keyboard focused
    if (pos.isFocused && !prefersReducedMotion) {
      const now = performance.now();
      pos.targetX = pos.width / 2 + Math.sin(now * 0.0012) * 22;
      pos.targetY = pos.height / 2 + Math.cos(now * 0.0016) * 16;
    }

    // Lerp smoothing (0.2 factor for crisp, fluid tracking)
    pos.currentX += (pos.targetX - pos.currentX) * 0.2;
    pos.currentY += (pos.targetY - pos.currentY) * 0.2;

    const el = tileRef.current;
    el.style.setProperty('--mx', `${pos.currentX.toFixed(2)}px`);
    el.style.setProperty('--my', `${pos.currentY.toFixed(2)}px`);

    const sheenX = ((pos.currentX / Math.max(1, pos.width)) * 100).toFixed(1);
    const sheenY = ((pos.currentY / Math.max(1, pos.height)) * 100).toFixed(1);
    el.style.setProperty('--sheen-x', `${sheenX}%`);
    el.style.setProperty('--sheen-y', `${sheenY}%`);

    // Subtle 3D tilt (desktop fine pointer only, disabled on touch and reduced motion)
    if (isFinePointer && !prefersReducedMotion) {
      const normX = (pos.currentX - pos.width / 2) / (pos.width / 2 || 1);
      const normY = (pos.currentY - pos.height / 2) / (pos.height / 2 || 1);
      const targetTiltX = pos.isHovered ? -normY * 4.2 : 0;
      const targetTiltY = pos.isHovered ? normX * 4.2 : 0;

      pos.currentTiltX += (targetTiltX - pos.currentTiltX) * 0.16;
      pos.currentTiltY += (targetTiltY - pos.currentTiltY) * 0.16;

      el.style.setProperty('--tilt-x', `${pos.currentTiltX.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${pos.currentTiltY.toFixed(2)}deg`);
    } else {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }

    // Settle condition to pause loop when idle
    const dist = Math.hypot(pos.targetX - pos.currentX, pos.targetY - pos.currentY);
    const tiltDist = Math.hypot(pos.currentTiltX, pos.currentTiltY);
    const isActive = pos.isHovered || pos.isFocused || pos.isTouch;

    if (!isActive && dist < 0.25 && tiltDist < 0.05) {
      isRunningRef.current = false;
      return;
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

  // Listen for tab visibility to pause loop
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (
        posRef.current.isHovered ||
        posRef.current.isFocused ||
        posRef.current.isTouch
      ) {
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopLoop();
    };
  }, [startLoop, stopLoop]);

  // Trigger one-time light sweep on section entrance
  useEffect(() => {
    if (isEntered && !sweepTriggered) {
      const timer = setTimeout(() => {
        setSweepTriggered(true);
      }, 550 + index * 120);
      return () => clearTimeout(timer);
    }
  }, [isEntered, sweepTriggered, index]);

  // Pointer event handlers
  const handlePointerEnter = (e) => {
    if (e.pointerType === 'touch') return;
    updateBounds();
    onFirstInteraction?.();
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    posRef.current.isHovered = true;
    posRef.current.targetX = x;
    posRef.current.targetY = y;
    setIsLensVisible(true);
    startLoop();
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;
    posRef.current.targetX = e.clientX - rect.left;
    posRef.current.targetY = e.clientY - rect.top;
    if (!isRunningRef.current) startLoop();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') return;
    posRef.current.isHovered = false;
    setIsLensVisible(false);
  };

  // Touch handlers (pan-y preserved, lens fades after 1.2s)
  const handlePointerDown = (e) => {
    if (e.pointerType !== 'touch') return;
    onFirstInteraction?.();
    updateBounds();
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);

    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    posRef.current.isTouch = true;
    posRef.current.currentX = x;
    posRef.current.currentY = y;
    posRef.current.targetX = x;
    posRef.current.targetY = y;
    setIsLensVisible(true);
    startLoop();
  };

  const handlePointerUp = (e) => {
    if (e.pointerType !== 'touch') return;
    posRef.current.isTouch = false;
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsLensVisible(false);
    }, 1200);
  };

  // Keyboard accessibility
  const handleFocus = () => {
    onFirstInteraction?.();
    updateBounds();
    posRef.current.isFocused = true;
    posRef.current.targetX = posRef.current.width / 2;
    posRef.current.targetY = posRef.current.height / 2;
    setIsLensVisible(true);
    startLoop();
  };

  const handleBlur = () => {
    posRef.current.isFocused = false;
    setIsLensVisible(false);
  };

  return (
    <div
      ref={tileRef}
      className={`material-tile ${isEntered ? 'is-entered' : ''} origin-${material.entranceOrigin}`}
      style={{
        '--tile-span': material.gridSpan,
        '--tile-height': material.height,
        '--tile-offset-y': material.offsetY,
        '--tile-delay': `${index * 0.1}s`,
      }}
      tabIndex={0}
      role="group"
      aria-label={`${material.name}: ${material.note}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* 3D Perspective Card Wrapper */}
      <div className="material-tile-card">
        {/* Layer 1: Base Static Texture */}
        <div className="material-texture-base" aria-hidden="true">
          <TextureComponent />
        </div>

        {/* Layer 2: Specular Cursor Highlight Sheen */}
        <div className="material-specular-sheen" aria-hidden="true" />

        {/* Layer 3: 2.4x Magnified Macro Lens Layer */}
        <div
          className={`material-lens-container ${isLensVisible ? 'is-visible' : ''}`}
          aria-hidden="true"
        >
          <div className="material-lens-zoom">
            <TextureComponent />
          </div>
        </div>

        {/* Layer 4: Lens Reticle Ring & Crosshair Frame */}
        <div
          className={`material-lens-reticle ${isLensVisible ? 'is-visible' : ''}`}
          aria-hidden="true"
        >
          <span className="reticle-tick tick-top" />
          <span className="reticle-tick tick-bottom" />
          <span className="reticle-tick tick-left" />
          <span className="reticle-tick tick-right" />
          <span className="reticle-center-dot" />
        </div>

        {/* Layer 5: Caption Readability Vignette Gradient */}
        <div className="material-caption-vignette" aria-hidden="true" />

        {/* Layer 6: One-Time Diagonal Light Sweep Animation */}
        <div
          className={`material-light-sweep ${sweepTriggered ? 'is-sweeping' : ''}`}
          aria-hidden="true"
        />

        {/* Real Accessible Caption Elements */}
        <div className="material-tile-caption">
          <span className="material-tile-number" aria-hidden="true">
            {material.number}
          </span>
          <div className="material-tile-info">
            <h3 className="material-tile-name">{material.name}</h3>
            <p className="material-tile-note">{material.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
