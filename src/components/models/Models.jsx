/* ==========================================================================
   MODELS LINEUP COMPONENT
   Cinematic showcase for Halcyon Core, Apex, and Trackline hypercars.
   Features desktop GSAP ScrollTrigger pinning (300svh), soft snapping,
   progress rail, interactive SVG silhouettes, and telemetry readouts.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis, scrollToTarget } from '../../hooks/useLenis';
import { MODELS_DATA, MODELS_SECTION_HEADER } from '../../data/models';
import CarSilhouette from './CarSilhouette';
import SpecReadout from './SpecReadout';
import './Models.css';

// Ensure GSAP ScrollTrigger plugin is registered
gsap.registerPlugin(ScrollTrigger);

export default function Models() {
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
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

  // Track viewport resize for mobile vs desktop pinning
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
        snap: {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.25, max: 0.5 },
          delay: 0.15,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const p = self.progress;

          // Scrub-free segment mapping:
          // 0 - 0.33 -> Index 0 (CORE)
          // 0.33 - 0.66 -> Index 1 (APEX)
          // 0.66 - 1.0 -> Index 2 (TRACKLINE)
          let nextIndex = 0;
          if (p > 0.66) {
            nextIndex = 2;
          } else if (p > 0.33) {
            nextIndex = 1;
          }

          // Update React state ONLY when active index actually transitions
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }

          // Direct DOM transform on the progress rail without triggering React renders
          if (railFillRef.current) {
            railFillRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
          }
        },
      });

      scrollTriggerInstanceRef.current = trigger;
    }, sectionRef);

    // Initial refresh after pinning setup
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

  // Handle model selection by clicking stacked tabs or rail steps
  const handleSelectModel = (index) => {
    if (index === activeIndex) return;

    if (isMobile || shouldReduceMotion) {
      activeIndexRef.current = index;
      setActiveIndex(index);
      return;
    }

    const st = scrollTriggerInstanceRef.current;
    if (st) {
      // Targets correspond to the centers of the 3 thirds: Core=0.05, Apex=0.5, Trackline=0.95
      const segmentProgress = [0.05, 0.5, 0.95];
      const targetScroll = st.start + segmentProgress[index] * (st.end - st.start);
      scrollToTarget(targetScroll, 0);
    } else {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  // Keyboard navigation for tab list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (activeIndex + 1) % MODELS_DATA.length;
      handleSelectModel(next);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (activeIndex - 1 + MODELS_DATA.length) % MODELS_DATA.length;
      handleSelectModel(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSelectModel(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSelectModel(MODELS_DATA.length - 1);
    }
  };

  // Mobile horizontal touch swipe gestures
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -45 && activeIndex < MODELS_DATA.length - 1) {
      handleSelectModel(activeIndex + 1);
    } else if (deltaX > 45 && activeIndex > 0) {
      handleSelectModel(activeIndex - 1);
    }
  };

  const activeModel = MODELS_DATA[activeIndex];

  return (
    <section
      id="models"
      ref={sectionRef}
      className={`models-scroll-container ${(isMobile || shouldReduceMotion) ? 'is-unpinned' : ''}`}
      aria-label="Halcyon Models Lineup"
    >
      <div ref={stageRef} className="models-stage">
        {/* Main 2-Column Content Grid */}
        <div className="models-grid">
          {/* Left Column: Eyebrow, Heading, Stacked Tab Buttons */}
          <div className="models-col-left">
            <div className="models-header-block">
              <div className="models-eyebrow">
                <span className="models-eyebrow-accent" aria-hidden="true" />
                <span>{MODELS_SECTION_HEADER.eyebrow}</span>
              </div>
              <h2 className="models-heading">{MODELS_SECTION_HEADER.heading}</h2>
            </div>

            {/* Mobile Tab Bar */}
            <div
              className="models-mobile-nav"
              role="tablist"
              aria-label="Hypercar model selection"
            >
              {MODELS_DATA.map((model, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={model.id}
                    type="button"
                    role="tab"
                    id={`mobile-tab-${model.id}`}
                    aria-selected={isActive}
                    aria-controls={`model-panel-${model.id}`}
                    className={`models-mobile-tab-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectModel(index)}
                  >
                    <span>{model.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Stacked Model Names Tablist */}
            <div
              className="models-tab-list"
              role="tablist"
              aria-label="Hypercar lineup tiers"
              onKeyDown={handleKeyDown}
            >
              {MODELS_DATA.map((model, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={model.id}
                    type="button"
                    role="tab"
                    id={`desktop-tab-${model.id}`}
                    aria-selected={isActive}
                    aria-controls={`model-panel-${model.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`models-tab-button ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectModel(index)}
                  >
                    <span className="models-tab-marker" aria-hidden="true" />
                    <span className="models-tab-name">{model.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Silhouette Stage & Telemetry Spec Readout */}
          <div
            className="models-col-right"
            id={`model-panel-${activeModel.id}`}
            role="tabpanel"
            aria-labelledby={isMobile ? `mobile-tab-${activeModel.id}` : `desktop-tab-${activeModel.id}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Precision Outline Silhouette with Animated Wipe & Spinning Wheels */}
            <CarSilhouette activeModel={activeModel} isEntered={isEntered} />

            {/* Live Count-Up Telemetry Specs & Power Output Bar */}
            <SpecReadout activeModel={activeModel} />
          </div>
        </div>

        {/* Bottom Pinned Progress Rail with Direct-DOM Bar and Step Navigation */}
        <div className="models-rail-container" aria-hidden="true">
          <div className="models-rail-track">
            <div ref={railFillRef} className="models-rail-fill" />
          </div>
          <div className="models-rail-steps">
            {MODELS_DATA.map((model, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={model.id}
                  type="button"
                  tabIndex={-1}
                  className={`models-rail-step-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectModel(index)}
                >
                  <span className="models-rail-step-accent" />
                  <span>{model.index} {model.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
