import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import './SiteBackground.css';

export default function SiteBackground({ variant = 'site' }) {
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  // ================= LOGIN VARIANT =================
  const loginMouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const loginMouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  const loginSpringConfig = { damping: 30, stiffness: 180, mass: 0.6 };
  const loginSmoothX = useSpring(loginMouseX, loginSpringConfig);
  const loginSmoothY = useSpring(loginMouseY, loginSpringConfig);

  useEffect(() => {
    if (variant !== 'login' || shouldReduceMotion) return;

    const handleMouseMove = (e) => {
      loginMouseX.set(e.clientX);
      loginMouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [variant, shouldReduceMotion, loginMouseX, loginMouseY]);

  // ================= SITE VARIANT =================
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (variant !== 'site' || shouldReduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let glowX = targetX;
    let glowY = targetY;
    let rafId = null;
    let isRunning = false;
    let hasInteracted = isTouchDevice; // Touch devices start drifting immediately

    if (isTouchDevice) {
      container.style.setProperty('--lit-opacity', '1');
      container.style.setProperty('--glow-opacity', '1');
    }

    const loop = () => {
      if (isTouchDevice) {
        // Slow auto-drift on touch along a gentle path
        const t = performance.now() * 0.00045;
        targetX = window.innerWidth * 0.5 + Math.sin(t) * (window.innerWidth * 0.28);
        targetY = window.innerHeight * 0.4 + Math.cos(t * 0.75) * (window.innerHeight * 0.2);
      }

      // Smooth lerp (~0.12) for cursor-lit grid mask (zero React state / re-renders)
      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * 0.12;
      curY += dy * 0.12;

      container.style.setProperty('--mx', `${curX.toFixed(1)}px`);
      container.style.setProperty('--my', `${curY.toFixed(1)}px`);

      // Soft glow follows with extra lag (~0.05 lerp)
      const gdx = curX - glowX;
      const gdy = curY - glowY;
      glowX += gdx * 0.05;
      glowY += gdy * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(glowX - 260).toFixed(1)}px, ${(glowY - 260).toFixed(1)}px, 0)`;
      }

      // On desktop, pause loop when movement converges to eliminate idle CPU usage
      if (
        !isTouchDevice &&
        Math.abs(dx) < 0.05 &&
        Math.abs(dy) < 0.05 &&
        Math.abs(gdx) < 0.05 &&
        Math.abs(gdy) < 0.05
      ) {
        isRunning = false;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!isRunning && !document.hidden) {
        isRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        isRunning = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const handlePointerMove = (e) => {
      if (!hasInteracted) {
        hasInteracted = true;
        targetX = e.clientX;
        targetY = e.clientY;
        curX = targetX;
        curY = targetY;
        glowX = targetX;
        glowY = targetY;
        container.style.setProperty('--mx', `${curX.toFixed(1)}px`);
        container.style.setProperty('--my', `${curY.toFixed(1)}px`);
        container.style.setProperty('--lit-opacity', '1');
        container.style.setProperty('--glow-opacity', '1');
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${(glowX - 260).toFixed(1)}px, ${(glowY - 260).toFixed(1)}px, 0)`;
        }
      } else {
        targetX = e.clientX;
        targetY = e.clientY;
      }
      startLoop();
    };

    if (!isTouchDevice) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    } else {
      startLoop();
    }

    // Pause animation when tab is not visible to prevent background battery/CPU drain
    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isTouchDevice || hasInteracted) {
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopLoop();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [variant, shouldReduceMotion, isTouchDevice]);

  // Render Login Variant
  if (variant === 'login') {
    return (
      <div className="login-bg-container" aria-hidden="true">
        {/* 1px grid lines with radial fade mask */}
        <div className="login-bg-grid" />

        {/* Radial accent glow */}
        {shouldReduceMotion ? (
          <div className="login-bg-glow-static" />
        ) : isTouchDevice ? (
          <motion.div
            className="login-bg-glow-touch"
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -35, 25, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <motion.div
            className="login-bg-glow-mouse"
            style={{
              x: loginSmoothX,
              y: loginSmoothY,
            }}
          />
        )}
      </div>
    );
  }

  // Render Site Variant
  return (
    <div
      ref={containerRef}
      className="site-bg-container"
      aria-hidden="true"
    >
      {/* Layer a: Base Faint Grid with Radial Edge Mask */}
      <div className="site-bg-grid-base" />

      {/* Layer b: Cursor-Lit Accent Grid (280px radius mask driven by --mx and --my) */}
      {!shouldReduceMotion && (
        <div className="site-bg-grid-lit" />
      )}

      {/* Layer c1: Very Faint Static Top Center Accent Glow (6%) */}
      <div className="site-bg-top-glow" />

      {/* Layer c2: One Soft Accent Radial Glow (520px, 14%) Following Smoothed Mouse */}
      {!shouldReduceMotion && (
        <div ref={glowRef} className="site-bg-cursor-glow" />
      )}
    </div>
  );
}
