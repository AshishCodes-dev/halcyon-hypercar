/* ==========================================================================
   HALCYON COLORS SECTION COMPONENT
   Interactive 5-panel finish selector driving the global site accent.
   Desktop: Smooth flex-grow expansion with cursor spotlight tracking.
   Mobile: Responsive vertical accordion stack.
   Two-way sync with navbar AccentSwitcher and persistent ThemeContext.
   ========================================================================== */

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../hooks/useTheme';
import { COLORS_HEADER, FINISHES } from '../../data/colors';
import FinishPanel from './FinishPanel';
import ReserveButton from '../ReserveButton';
import './Colors.css';

export default function Colors() {
  const shouldReduceMotion = useReducedMotion();
  const { accent, setAccent } = useTheme();

  // Active finish is synchronized directly with global ThemeContext
  const activeFinishId = accent?.id || FINISHES[0].id;
  const [isEntered, setIsEntered] = useState(false);

  const sectionRef = useRef(null);
  const panelRefs = useRef([]);

  // Viewport entrance observer for heading reveal and panel stagger
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

  // Refresh ScrollTrigger pins when this section mounts or viewport resizes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Panel selection handler
  const handleSelectFinish = (id) => {
    setActiveFinishId(id);
    setAccent(id);
  };

  // Keyboard navigation for roving tablist / radiogroup
  const handleKeyDown = (e) => {
    const currentIndex = FINISHES.findIndex((f) => f.id === activeFinishId);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % FINISHES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + FINISHES.length) % FINISHES.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = FINISHES.length - 1;
    } else {
      return;
    }

    const nextFinish = FINISHES[nextIndex];
    if (nextFinish) {
      handleSelectFinish(nextFinish.id);
      panelRefs.current[nextIndex]?.focus();
    }
  };

  const activeFinish =
    FINISHES.find((f) => f.id === activeFinishId) || FINISHES[0];
  const isEnteredStage = isEntered || Boolean(shouldReduceMotion);
  const headingWords = COLORS_HEADER.heading.split(' ');

  return (
    <section
      id="colors"
      ref={sectionRef}
      className={`colors-section ${isEnteredStage ? 'is-entered' : ''}`}
      aria-label="Halcyon Bespoke Finishes"
    >
      {/* 1. Header Block */}
      <div className="colors-header-block">
        <div className="colors-eyebrow">
          <span className="colors-eyebrow-accent" aria-hidden="true" />
          <span>{COLORS_HEADER.eyebrow}</span>
        </div>

        <h2 className="colors-heading">
          {headingWords.map((word, idx) => (
            <span key={idx} className="colors-heading-mask">
              <span className={`colors-heading-inner word-delay-${idx}`}>
                {word}
              </span>
            </span>
          ))}
        </h2>

        <div className="colors-subtitles">
          <p className="colors-disclaimer">{COLORS_HEADER.disclaimer}</p>
          <p className="colors-hint">{COLORS_HEADER.hint}</p>
        </div>
      </div>

      {/* 2. Expanding Finish Panels (Radiogroup) */}
      <div
        className="colors-panels-group"
        role="radiogroup"
        aria-label="Finish"
        onKeyDown={handleKeyDown}
      >
        {FINISHES.map((finish, idx) => {
          const isActive = finish.id === activeFinishId;
          return (
            <FinishPanel
              key={finish.id}
              finish={finish}
              isActive={isActive}
              index={idx}
              isEntered={isEnteredStage}
              onSelect={handleSelectFinish}
              panelRef={(el) => (panelRefs.current[idx] = el)}
            />
          );
        })}
      </div>

      {/* 3. Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        Selected finish: {activeFinish.name}
      </div>

      {/* 4. Reserve Button CTA with Active Finish Label */}
      <div className="colors-reserve-cta">
        <ReserveButton label={`Reserve in ${activeFinish.name}`} />
      </div>
    </section>
  );
}
