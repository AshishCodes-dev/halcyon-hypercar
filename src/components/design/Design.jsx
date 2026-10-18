/* ==========================================================================
   HALCYON DESIGN ANATOMY COMPONENT
   Cinematic technical blueprint section with desktop GSAP ScrollTrigger
   camera zoom (400svh), soft snapping to part centers, interactive hotspots,
   SVG viewBox tweening, Lenis integration, and keyboard navigation.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis, scrollToTarget } from '../../hooks/useLenis';
import { DESIGN_HEADER, DESIGN_PARTS } from '../../data/design';
import BlueprintCar from './BlueprintCar';
import './Design.css';

// Ensure GSAP ScrollTrigger plugin is registered
gsap.registerPlugin(ScrollTrigger);

export default function Design() {
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isOverview, setIsOverview] = useState(false);
  const isOverviewRef = useRef(false);

  const [isEntered, setIsEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 860
  );

  // Layout & DOM references
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const railFillRef = useRef(null);
  const scrollTriggerInstanceRef = useRef(null);
  const touchStartXRef = useRef(0);

  // Resize listener for desktop vs mobile pinning
  useEffect(() => {
    const handleResize = () => {
      const mobileState = window.innerWidth <= 860;
      setIsMobile(mobileState);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Viewport entrance observer for initial stroke draw-on and title animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsEntered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger Pinned Scrub & Lenis integration (Desktop only)
  useEffect(() => {
    if (isMobile || shouldReduceMotion) {
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
      return;
    }

    const activeLenis = lenis || (typeof window !== 'undefined' ? window.__halcyon_lenis : null);
    let lenisHandler = null;

    if (activeLenis) {
      lenisHandler = () => ScrollTrigger.update();
      activeLenis.on('scroll', lenisHandler);
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageRef.current,
        invalidateOnRefresh: true,
        // Soft snap to the exact CENTER of each segment (0.125, 0.375, 0.625, 0.875)
        snap: {
          snapTo: [0.125, 0.375, 0.625, 0.875],
          duration: { min: 0.25, max: 0.55 },
          delay: 0.15,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const p = self.progress;

          // Segment mapping for 4 parts:
          // 0 - 0.25 -> Part 01 (center 0.125)
          // 0.25 - 0.50 -> Part 02 (center 0.375)
          // 0.50 - 0.75 -> Part 03 (center 0.625)
          // 0.75 - 1.0 -> Part 04 (center 0.875)
          let nextIndex = 0;
          let nextOverview = false;

          if (p < 0.04) {
            nextOverview = true;
            nextIndex = 0;
          } else if (p < 0.25) {
            nextIndex = 0;
          } else if (p < 0.50) {
            nextIndex = 1;
          } else if (p < 0.75) {
            nextIndex = 2;
          } else if (p <= 0.96) {
            nextIndex = 3;
          } else {
            nextOverview = true;
            nextIndex = 3;
          }

          // Update React state ONLY when active index or overview mode transitions
          if (nextIndex !== activeIndexRef.current || nextOverview !== isOverviewRef.current) {
            activeIndexRef.current = nextIndex;
            isOverviewRef.current = nextOverview;
            setActiveIndex(nextIndex);
            setIsOverview(nextOverview);
          }

          // Direct DOM transform update on bottom progress rail without React re-renders
          if (railFillRef.current) {
            railFillRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
          }
        },
      });

      scrollTriggerInstanceRef.current = trigger;
    }, sectionRef);

    // Initial refresh after pinning configuration
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      if (activeLenis && lenisHandler) {
        activeLenis.off('scroll', lenisHandler);
      }
      ctx.revert();
      scrollTriggerInstanceRef.current = null;
    };
  }, [isMobile, shouldReduceMotion, lenis]);

  // Model part navigation by clicking left tab button or rail step
  const handleSelectPart = (index) => {
    if (index === activeIndex && !isOverview) return;

    if (isMobile || shouldReduceMotion) {
      activeIndexRef.current = index;
      isOverviewRef.current = false;
      setActiveIndex(index);
      setIsOverview(false);
      return;
    }

    const st = scrollTriggerInstanceRef.current;
    if (st) {
      // Targets correspond to the centers of the 4 segments: 0.125, 0.375, 0.625, 0.875
      const segmentCenters = [0.125, 0.375, 0.625, 0.875];
      const targetScroll = st.start + segmentCenters[index] * (st.end - st.start);
      scrollToTarget(targetScroll, 0);
    } else {
      activeIndexRef.current = index;
      isOverviewRef.current = false;
      setActiveIndex(index);
      setIsOverview(false);
    }
  };

  // Keyboard navigation for tablist
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (activeIndex + 1) % DESIGN_PARTS.length;
      handleSelectPart(next);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (activeIndex - 1 + DESIGN_PARTS.length) % DESIGN_PARTS.length;
      handleSelectPart(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSelectPart(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSelectPart(DESIGN_PARTS.length - 1);
    }
  };

  // Mobile horizontal swipe gestures
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -45 && activeIndex < DESIGN_PARTS.length - 1) {
      handleSelectPart(activeIndex + 1);
    } else if (deltaX > 45 && activeIndex > 0) {
      handleSelectPart(activeIndex - 1);
    }
  };

  const activePart = DESIGN_PARTS[activeIndex];

  return (
    <section
      id="design"
      ref={sectionRef}
      className={`design-scroll-container ${(isMobile || shouldReduceMotion) ? 'is-unpinned' : ''}`}
      aria-label="Halcyon Design Anatomy"
    >
      <div ref={stageRef} className="design-stage">
        {/* Header Block */}
        <div className="design-header-block">
          <div className="design-eyebrow">
            <span className="design-eyebrow-accent" aria-hidden="true" />
            <span>{DESIGN_HEADER.eyebrow}</span>
          </div>
          <h2 className="design-heading">{DESIGN_HEADER.heading}</h2>
          <p className="design-disclaimer">{DESIGN_HEADER.disclaimer}</p>
        </div>

        {/* Mobile Horizontally Scrollable Chips */}
        <div
          className="design-mobile-chips"
          role="tablist"
          aria-label="Hypercar anatomy components"
        >
          {DESIGN_PARTS.map((part, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={part.id}
                type="button"
                role="tab"
                id={`mobile-design-tab-${part.id}`}
                aria-selected={isActive}
                aria-controls={`design-panel-${part.id}`}
                className={`design-mobile-chip-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectPart(index)}
              >
                <span>{part.index}</span>
                <span>{part.name}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Main Anatomy Area (Two Columns) */}
        <div className="design-main-area">
          {/* Left Column: Vertical List of 4 Part Names */}
          <div
            className="design-parts-nav"
            role="tablist"
            aria-label="Hypercar blueprint parts"
            onKeyDown={handleKeyDown}
          >
            {DESIGN_PARTS.map((part, index) => {
              const isActive = index === activeIndex && !isOverview;
              return (
                <button
                  key={part.id}
                  type="button"
                  role="tab"
                  id={`desktop-design-tab-${part.id}`}
                  aria-selected={isActive}
                  aria-controls={`design-panel-${part.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`design-part-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectPart(index)}
                >
                  <span className="design-part-marker" aria-hidden="true" />
                  <span className="design-part-btn-index">{part.index}</span>
                  <span className="design-part-btn-name">{part.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Area: Blueprint Stage & Overlaid Callout HUD */}
          <div
            className="design-blueprint-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* SVG Blueprint with Animated Camera Zoom */}
            <BlueprintCar
              activePart={activePart}
              isOverview={isOverview}
              isEntered={isEntered}
            />

            {/* Desktop Overlaid Callout HUD (Sits on empty side of stage) */}
            {!isOverview && (
              <div
                key={activePart.id}
                id={`design-panel-${activePart.id}`}
                role="tabpanel"
                aria-labelledby={`desktop-design-tab-${activePart.id}`}
                className={`design-callout-hud placement-${activePart.calloutPlacement}`}
              >
                <div className="design-callout-header">
                  <span className="design-callout-index">{activePart.index}</span>
                  <span className="design-callout-name">{activePart.name}</span>
                </div>
                <h3 className="design-callout-tagline">“{activePart.tagline}”</h3>
                <p className="design-callout-text">{activePart.text}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Part Callout (Rendered beneath stage on <= 860px) */}
        <div
          className="design-mobile-callout"
          role="region"
          aria-live="polite"
        >
          <div className="design-callout-header">
            <span className="design-callout-index">{activePart.index}</span>
            <span className="design-callout-name">{activePart.name}</span>
          </div>
          <h3 className="design-callout-tagline">“{activePart.tagline}”</h3>
          <p className="design-callout-text">{activePart.text}</p>
        </div>

        {/* Bottom Pinned Progress Rail with Direct-DOM Bar and Step Navigation */}
        <div className="design-rail-container" aria-hidden="true">
          <div className="design-rail-track">
            <div ref={railFillRef} className="design-rail-fill" />
          </div>
          <div className="design-rail-steps">
            {DESIGN_PARTS.map((part, index) => {
              const isActive = index === activeIndex && !isOverview;
              return (
                <button
                  key={part.id}
                  type="button"
                  tabIndex={-1}
                  className={`design-rail-step-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectPart(index)}
                >
                  <span className="design-rail-step-accent" />
                  <span>{part.index} {part.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
