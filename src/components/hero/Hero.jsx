/* ==========================================================================
   HALCYON HERO COMPONENT
   Cinematic 3D Hypercar stage with GSAP ScrollTrigger scrub timeline,
   Lenis integration, Lazy-loaded WebGL canvas, and responsive fallback.
   ========================================================================== */

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../hooks/useTheme';
import { useLenis } from '../../hooks/useLenis';
import HeroFallback from './HeroFallback';
import './Hero.css';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Lazy-load the heavy 3D Three.js canvas so initial page load stays lightweight
const HeroScene = lazy(() => import('./HeroScene'));

// Utility: check if WebGL is supported by current browser/device
function isWebGLSupported() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Hero() {
  const { accent } = useTheme();
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();

  // Container refs for GSAP ScrollTrigger
  const heroWrapperRef = useRef(null);
  const stageRef = useRef(null);
  const wordmarkRef = useRef(null);
  const headlineGroupRef = useRef(null);
  const specsRowRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Mutable animation state references read directly in useFrame
  const scrollProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Component states
  const [hasWebGLError, setHasWebGLError] = useState(() => !isWebGLSupported());
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);

  // Derived percent: immediately 100% when ready or fallback active
  const displayPercent = isSceneReady || hasWebGLError ? 100 : loadPercent;

  // Active hex color for Three.js WebGL canvas
  const activeAccentHex = accent?.value || '#2BFF88';

  // Simulated smooth loading progress while 3D chunk / assets load
  useEffect(() => {
    if (isSceneReady || hasWebGLError) {
      return;
    }

    const interval = setInterval(() => {
      setLoadPercent((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15 + 8);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isSceneReady, hasWebGLError]);

  // Pointer position tracking for car/camera cursor tilt (desktop only)
  useEffect(() => {
    if (shouldReduceMotion) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handlePointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [shouldReduceMotion]);

  // Viewport intersection observer to pause render loop when scrolled offscreen
  useEffect(() => {
    const wrapper = heroWrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsOnScreen(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger scrub timeline & Lenis integration
  useEffect(() => {
    // If reduced motion is requested, keep standard 100svh section without scrub pinning
    if (shouldReduceMotion) return;

    // Connect existing Lenis instance with ScrollTrigger updates
    let lenisScrollHandler = null;
    const activeLenis = lenis || (typeof window !== 'undefined' ? window.__halcyon_lenis : null);

    if (activeLenis) {
      lenisScrollHandler = () => ScrollTrigger.update();
      activeLenis.on('scroll', lenisScrollHandler);
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroWrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // Parallax and fade on giant background wordmark
          if (wordmarkRef.current) {
            const wordmarkY = (p * 70).toFixed(1);
            const wordmarkOpacity = Math.max(0.18, 0.85 - p * 1.5).toFixed(2);
            wordmarkRef.current.style.transform = `translate(-50%, calc(-50% + ${wordmarkY}px))`;
            wordmarkRef.current.style.opacity = wordmarkOpacity;
          }

          // Headline & Specs fade and lift in phase 2 (progress 0.35 -> 0.75)
          if (headlineGroupRef.current) {
            if (p > 0.35) {
              const headP = Math.min(1, (p - 0.35) / 0.35);
              headlineGroupRef.current.style.opacity = (1 - headP).toFixed(2);
              headlineGroupRef.current.style.transform = `translate3d(0, -${(headP * 40).toFixed(1)}px, 0)`;
            } else {
              headlineGroupRef.current.style.opacity = '1';
              headlineGroupRef.current.style.transform = 'translate3d(0, 0, 0)';
            }
          }

          if (specsRowRef.current) {
            if (p > 0.38) {
              const specsP = Math.min(1, (p - 0.38) / 0.35);
              specsRowRef.current.style.opacity = (1 - specsP).toFixed(2);
              specsRowRef.current.style.transform = `translate3d(0, -${(specsP * 35).toFixed(1)}px, 0)`;
            } else {
              specsRowRef.current.style.opacity = '1';
              specsRowRef.current.style.transform = 'translate3d(0, 0, 0)';
            }
          }

          // Fade scroll indicator immediately on initial scroll
          if (scrollIndicatorRef.current) {
            const indOpacity = Math.max(0, 1 - p * 6).toFixed(2);
            scrollIndicatorRef.current.style.opacity = indOpacity;
          }
        },
      });
    }, heroWrapperRef);

    // Refresh ScrollTrigger on resize and after initial layout
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial refresh after microtask
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (activeLenis && lenisScrollHandler) {
        activeLenis.off('scroll', lenisScrollHandler);
      }
      ctx.revert();
    };
  }, [shouldReduceMotion, lenis, isSceneReady]);

  // Entrance animations when 3D scene finishes loading
  useEffect(() => {
    if (!isSceneReady || shouldReduceMotion) return;

    // Refresh ScrollTrigger so pinning dimensions are calculated accurately
    ScrollTrigger.refresh();

    // Animate wordmark, headline words, and specs into view
    gsap.fromTo(
      wordmarkRef.current,
      { opacity: 0, y: 35, scale: 0.96 },
      { opacity: 0.85, y: 0, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      headlineGroupRef.current,
      { opacity: 0, y: 25, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.4 }
    );

    gsap.fromTo(
      specsRowRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', delay: 0.7 }
    );
  }, [isSceneReady, shouldReduceMotion]);

  return (
    <section
      id="top"
      ref={heroWrapperRef}
      className={`hero-scroll-container ${shouldReduceMotion ? 'reduced-motion' : ''}`}
      aria-label="Halcyon Hypercar Overview"
    >
      <div ref={stageRef} className="hero-stage">
        {/* Screen Reader Accessible Summary */}
        <span className="sr-only">
          Illustration of the Halcyon electric hypercar with interactive 3D rotation and aerodynamic specification highlights.
        </span>

        {/* Minimal Progress Loader */}
        <div
          className={`hero-loader-overlay ${(isSceneReady || hasWebGLError) ? 'loaded' : ''}`}
          aria-hidden={isSceneReady || hasWebGLError}
        >
          <div className="hero-loader-track">
            <div className="hero-loader-bar" style={{ width: `${displayPercent}%` }} />
          </div>
          <div className="hero-loader-meta">
            <span>Halcyon Telemetry</span>
            <span className="hero-loader-percent">{displayPercent}%</span>
          </div>
        </div>

        {/* Giant Outlined Wordmark Behind the Car */}
        <div ref={wordmarkRef} className="hero-bg-wordmark" aria-hidden="true">
          HALCYON
        </div>

        {/* 3D WebGL Canvas Scene or Fallback Graphic */}
        {!hasWebGLError ? (
          <Suspense fallback={<HeroFallback isInitialLoading={true} />}>
            <HeroScene
              accentColor={activeAccentHex}
              scrollProgressRef={scrollProgressRef}
              pointerRef={pointerRef}
              shouldReduceMotion={shouldReduceMotion}
              isOnScreen={isOnScreen}
              onSceneReady={() => setIsSceneReady(true)}
              onWebGLError={() => setHasWebGLError(true)}
            />
          </Suspense>
        ) : (
          <HeroFallback isInitialLoading={false} />
        )}

        {/* Typographic HUD Layer (Overlaid on top of 3D Scene) */}
        <div className="hero-hud-layer">
          {/* Eyebrow Label (Top-Left) */}
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-accent" aria-hidden="true" />
            <span>H1 / 2026 / ELECTRIC HYPERCAR</span>
          </div>

          {/* Main Headline (Bottom-Left) */}
          <div ref={headlineGroupRef} className="hero-headline-group">
            <h1 className="hero-headline">Silence, at 400 km/h.</h1>
            <p className="hero-subtitle">
              Concept preview. Numbers below are placeholder values.
            </p>
          </div>

          {/* Spec Row (Bottom-Right) */}
          <div ref={specsRowRef} className="hero-specs-row">
            <div className="hero-spec-item">
              <span className="hero-spec-label">0-100 km/h</span>
              <span className="hero-spec-value">1.9 s</span>
            </div>
            <div className="hero-spec-item">
              <span className="hero-spec-label">Power</span>
              <span className="hero-spec-value">1,100 hp</span>
            </div>
            <div className="hero-spec-item">
              <span className="hero-spec-label">Range</span>
              <span className="hero-spec-value">480 km</span>
            </div>
          </div>

          {/* Scroll Indicator (Bottom-Center) */}
          <div ref={scrollIndicatorRef} className="hero-scroll-indicator" aria-hidden="true">
            <span>Scroll</span>
            <div className="hero-scroll-line">
              <div className="hero-scroll-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
