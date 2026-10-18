/* ==========================================================================
   HALCYON GALLERY SECTION COMPONENT
   Horizontal Chapters gallery featuring 5 scenic environments.
   - Native snap scroll container with Lenis prevention for horizontal gestures
   - Momentum drag-to-scroll for mouse pointers
   - Hardware-accelerated parallax (--p) updated in requestAnimationFrame
   - Active index state updated ONLY on chapter transitions
   - Accessible arrow navigation, counter, and direct-DOM progress rail
   ========================================================================== */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_HEADER, CHAPTERS } from '../../data/gallery';
import ChapterCard from './ChapterCard';
import './Gallery.css';

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isEntered, setIsEntered] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // DOM Refs
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const railFillRef = useRef(null);

  // Drag interaction states
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafIdRef = useRef(null);

  // Measure card positions and update parallax variable --p
  const updateParallax = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = cardCenter - centerX;
      const absDist = Math.abs(dist);

      if (absDist < minDistance) {
        minDistance = absDist;
        closestIndex = idx;
      }

      // Parallax ratio between -1.5 and 1.5
      if (!shouldReduceMotion) {
        const p = Math.max(-1.5, Math.min(1.5, dist / (trackRect.width / 2)));
        card.style.setProperty('--p', p.toFixed(3));
      }
    });

    // Update active index state ONLY when active chapter changes
    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }

    // Direct DOM transform update for bottom progress rail
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0 && railFillRef.current) {
      const scrollRatio = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));
      const railScale = 0.2 + scrollRatio * 0.8;
      railFillRef.current.style.transform = `scaleX(${railScale.toFixed(3)})`;
    }
  }, [shouldReduceMotion]);

  // Track scroll listener
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(updateParallax);
  }, [updateParallax]);

  // Center a specific card
  const scrollToChapter = useCallback((index) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetScroll =
      track.scrollLeft +
      (cardRect.left - trackRect.left) -
      (trackRect.width / 2 - cardRect.width / 2);

    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setShowHint(false);
  }, []);

  // Keyboard navigation on track
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeIndex < CHAPTERS.length - 1) {
        scrollToChapter(activeIndex + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeIndex > 0) {
        scrollToChapter(activeIndex - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToChapter(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToChapter(CHAPTERS.length - 1);
    }
  };

  // Pointer drag-to-scroll handlers (desktop mouse only)
  const handlePointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftRef.current = track.scrollLeft;

    track.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 5) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        track.classList.add('is-dragging');
        setShowHint(false);
      }
      track.scrollLeft = scrollLeftRef.current - dx;
    }
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    const track = trackRef.current;
    isPointerDownRef.current = false;

    if (track) {
      track.classList.remove('is-dragging');
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already been released
      }
    }
  };

  // Prevent card click if mouse was dragging
  const handleCardClick = (index) => {
    if (hasDraggedRef.current) return;
    scrollToChapter(index);
  };

  // Entrance Observer
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

  // Initial calculation and window resize listener
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParallax();
    }, 200);

    const handleResize = () => {
      updateParallax();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateParallax]);

  const isEnteredStage = isEntered || Boolean(shouldReduceMotion);
  const headingWords = GALLERY_HEADER.heading.split(' ');
  const activeChapterNumber = String(activeIndex + 1).padStart(2, '0');
  const totalChapters = String(CHAPTERS.length).padStart(2, '0');

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery-section ${isEnteredStage ? 'is-entered' : ''}`}
      aria-label="Halcyon Chapters Gallery"
    >
      {/* 1. Header Block */}
      <div className="gallery-header-block">
        <div className="gallery-eyebrow">
          <span className="gallery-eyebrow-accent" aria-hidden="true" />
          <span>{GALLERY_HEADER.eyebrow}</span>
        </div>

        <h2 className="gallery-heading">
          {headingWords.map((word, idx) => (
            <span key={idx} className="gallery-heading-mask">
              <span className={`gallery-heading-inner word-delay-${idx}`}>
                {word}
              </span>
            </span>
          ))}
        </h2>

        <div className="gallery-disclaimer-row">
          <p className="gallery-disclaimer">{GALLERY_HEADER.disclaimer}</p>
          <span
            className={`gallery-desktop-hint ${!showHint ? 'is-faded' : ''}`}
            aria-hidden="true"
          >
            {GALLERY_HEADER.hint}
          </span>
        </div>
      </div>

      {/* 2. Horizontal Scroll Track (Lenis prevented for native horizontal gestures) */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Gallery chapters"
        data-lenis-prevent="true"
        className="gallery-track"
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {CHAPTERS.map((chapter, idx) => (
          <ChapterCard
            key={chapter.id}
            ref={(el) => (cardRefs.current[idx] = el)}
            chapter={chapter}
            index={idx}
            isActive={idx === activeIndex}
            isEntered={isEnteredStage}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* 3. Bottom Controls Bar (Counter, Rail, Arrow Buttons) */}
      <div className="gallery-controls-bar">
        <div className="gallery-counter-rail-group">
          {/* Chapter Counter */}
          <span
            className="gallery-counter-readout"
            aria-label={`Chapter ${activeChapterNumber} of ${totalChapters}`}
          >
            {activeChapterNumber} / {totalChapters}
          </span>

          {/* Thin Progress Rail */}
          <div className="gallery-rail-track" aria-hidden="true">
            <div ref={railFillRef} className="gallery-rail-fill" />
          </div>
        </div>

        {/* Previous / Next Arrow Navigation */}
        <div className="gallery-nav-buttons">
          <button
            type="button"
            className="gallery-arrow-btn"
            aria-label="Previous chapter"
            disabled={activeIndex === 0}
            onClick={() => scrollToChapter(activeIndex - 1)}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            className="gallery-arrow-btn"
            aria-label="Next chapter"
            disabled={activeIndex === CHAPTERS.length - 1}
            onClick={() => scrollToChapter(activeIndex + 1)}
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
