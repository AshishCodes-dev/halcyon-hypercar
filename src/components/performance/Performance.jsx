/* ==========================================================================
   HALCYON PERFORMANCE SECTION COMPONENT
   Cinematic launch run section driving acceleration from 0 to 400 km/h.
   Desktop: 300svh GSAP ScrollTrigger scrub with hold at 400 km/h.
   Mobile: One-shot 3.8s launch run animation triggered on 40% viewport entry.
   Zero React state updates per tick, all driven via direct DOM manipulation.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../../hooks/useLenis';
import {
  PERFORMANCE_HEADER,
  MILESTONES,
} from '../../data/performance';
import SpeedGauge, {
  GAUGE_RADIUS,
  GAUGE_CENTER_X,
  GAUGE_CENTER_Y,
  GAUGE_ARC_LENGTH,
} from './SpeedGauge';
import PowerCurve from './PowerCurve';
import './Performance.css';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Acceleration easing formula: power2.inOut
function easeInOutPower2(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Pre-defined deterministic speed lines across background
const SPEED_LINES = [
  { top: '9%', width: '130px', dur: '2.3s', delay: '0s' },
  { top: '16%', width: '190px', dur: '1.9s', delay: '0.4s' },
  { top: '24%', width: '90px', dur: '2.6s', delay: '0.9s' },
  { top: '32%', width: '230px', dur: '1.7s', delay: '0.2s' },
  { top: '41%', width: '150px', dur: '2.1s', delay: '1.1s' },
  { top: '50%', width: '270px', dur: '1.5s', delay: '0.5s' },
  { top: '58%', width: '120px', dur: '2.5s', delay: '0.8s' },
  { top: '67%', width: '200px', dur: '1.8s', delay: '0.3s' },
  { top: '75%', width: '160px', dur: '2.0s', delay: '1.2s' },
  { top: '83%', width: '240px', dur: '1.6s', delay: '0.6s' },
  { top: '91%', width: '110px', dur: '2.8s', delay: '1.0s' },
  { top: '96%', width: '180px', dur: '1.9s', delay: '0.7s' },
];

export default function Performance() {
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();

  // Screen size detection
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 860
  );
  const [isEntered, setIsEntered] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  // References for direct DOM updates
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const speedLinesRef = useRef(null);
  const speedTextRef = useRef(null);
  const gaugeArcRef = useRef(null);
  const gaugeDotRef = useRef(null);
  const gaugeTrackRef = useRef(null);
  const curvePathRef = useRef(null);
  const curveDotRef = useRef(null);
  const curveClipRef = useRef(null);
  const milestoneElementsRef = useRef([]);

  // Stored measurements
  const curveTotalLengthRef = useRef(545);
  const mobileAnimRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // Measure power curve path total length on mount
  useEffect(() => {
    if (curvePathRef.current) {
      try {
        const len = curvePathRef.current.getTotalLength();
        if (len > 0) {
          curveTotalLengthRef.current = len;
        }
      } catch {
        // Fallback length 545px
      }
    }
  }, []);

  // Update direct DOM elements based on speed factor (0..1)
  const applyRunProgress = (speedFactor) => {
    const clampedFactor = Math.max(0, Math.min(1, speedFactor));
    const speed = Math.round(400 * clampedFactor);

    // 1. Center Speed Text (0..400)
    if (speedTextRef.current) {
      speedTextRef.current.textContent = speed;
    }

    // 2. Gauge Arc Stroke Dashoffset
    if (gaugeArcRef.current) {
      const offset = GAUGE_ARC_LENGTH * (1 - clampedFactor);
      gaugeArcRef.current.style.strokeDashoffset = offset.toFixed(2);
    }

    // 3. Gauge Tip Dot (rides arc angle from 135 deg to 405 deg)
    if (gaugeDotRef.current) {
      const rad = ((135 + clampedFactor * 270) * Math.PI) / 180;
      const x = GAUGE_CENTER_X + GAUGE_RADIUS * Math.cos(rad);
      const y = GAUGE_CENTER_Y + GAUGE_RADIUS * Math.sin(rad);
      gaugeDotRef.current.setAttribute('cx', x.toFixed(2));
      gaugeDotRef.current.setAttribute('cy', y.toFixed(2));
      gaugeDotRef.current.style.opacity = speed > 0 ? '1' : '0.4';
    }

    // 4. Power Curve Reveal and Tip Dot
    if (curvePathRef.current && curveDotRef.current && curveClipRef.current) {
      try {
        const targetLen = clampedFactor * curveTotalLengthRef.current;
        const pt = curvePathRef.current.getPointAtLength(targetLen);
        curveDotRef.current.setAttribute('cx', pt.x.toFixed(2));
        curveDotRef.current.setAttribute('cy', pt.y.toFixed(2));
        curveClipRef.current.setAttribute('width', Math.max(0, pt.x - 35).toFixed(2));
        curveDotRef.current.style.opacity = speed > 0 ? '1' : '0';
      } catch {
        // Fallback linear width
        curveClipRef.current.setAttribute('width', (clampedFactor * 535).toFixed(2));
      }
    }

    // 5. Milestones Activation & Accent Flash
    milestoneElementsRef.current.forEach((el, idx) => {
      if (!el) return;
      const threshold = MILESTONES[idx]?.speed || 400;
      const isReached = speed >= threshold;
      const wasReached = el.classList.contains('is-reached');

      if (isReached !== wasReached) {
        el.classList.toggle('is-reached', isReached);
        if (isReached) {
          el.classList.add('just-reached');
          setTimeout(() => {
            if (el) el.classList.remove('just-reached');
          }, 500);
        }
      }
    });

    // 6. Speed Lines Opacity & Intensity
    if (speedLinesRef.current) {
      const linesOpacity = 0.04 + clampedFactor * 0.45;
      speedLinesRef.current.style.setProperty(
        '--speed-line-opacity',
        linesOpacity.toFixed(3)
      );
    }
  };

  // Resize listener for desktop vs mobile layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 860;
      setIsMobile(mobile);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Entrance Observer for title word reveal and gauge track draw-in
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

  // Initial render for reduced-motion: show full 400 km/h completed state
  useEffect(() => {
    if (shouldReduceMotion) {
      applyRunProgress(1);
    }
  }, [shouldReduceMotion]);

  // Mobile launch run animation controller
  const startMobileRun = () => {
    setShowReplay(false);
    applyRunProgress(0);

    if (mobileAnimRef.current) {
      mobileAnimRef.current.kill();
    }

    const state = { progress: 0 };
    mobileAnimRef.current = gsap.to(state, {
      progress: 1,
      duration: 3.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        applyRunProgress(state.progress);
      },
      onComplete: () => {
        setShowReplay(true);
      },
    });
  };

  // Desktop Pinned Scroll with GSAP ScrollTrigger (>=861px)
  useEffect(() => {
    if (isMobile || shouldReduceMotion) {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
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
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Hold the final state (400 km/h) for the last 8% of the scroll
          const normalized = Math.min(1, p / 0.92);
          const speedFactor = easeInOutPower2(normalized);
          applyRunProgress(speedFactor);
        },
      });

      scrollTriggerRef.current = trigger;
    }, sectionRef);

    // Refresh after pin layout registration
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (activeLenis && lenisHandler) {
        activeLenis.off('scroll', lenisHandler);
      }
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [isMobile, shouldReduceMotion, lenis]);

  // Mobile One-Shot 3.8s Run Animation Trigger (<=860px)
  useEffect(() => {
    if (!isMobile || shouldReduceMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            observer.disconnect();
            startMobileRun();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (mobileAnimRef.current) {
        mobileAnimRef.current.kill();
      }
    };
  }, [isMobile, shouldReduceMotion]);

  const handleReplayClick = () => {
    startMobileRun();
  };

  const isEnteredStage = isEntered || Boolean(shouldReduceMotion);
  const headingWords = PERFORMANCE_HEADER.heading.split(' ');

  return (
    <section
      id="performance"
      ref={sectionRef}
      className={`performance-scroll-container ${(isMobile || shouldReduceMotion) ? 'is-unpinned' : ''}`}
      aria-label="Halcyon Launch Run Performance"
    >
      <div
        ref={stageRef}
        className={`performance-stage ${isEnteredStage ? 'is-entered' : ''}`}
      >
        {/* Speed Lines Background */}
        {!shouldReduceMotion && (
          <div
            ref={speedLinesRef}
            className="speed-lines-container"
            aria-hidden="true"
          >
            {SPEED_LINES.map((line, idx) => (
              <div
                key={idx}
                className="speed-streak-line"
                style={{
                  top: line.top,
                  width: line.width,
                  '--streak-dur': line.dur,
                  '--streak-delay': line.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Top Header Block */}
        <div className="performance-header-block">
          <div className="performance-eyebrow">
            <span className="performance-eyebrow-accent" aria-hidden="true" />
            <span>{PERFORMANCE_HEADER.eyebrow}</span>
          </div>

          <h2 className="performance-heading">
            {headingWords.map((word, idx) => (
              <span key={idx} className="heading-word-mask">
                <span className={`heading-word-inner word-delay-${idx}`}>
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p className="performance-disclaimer">
            {PERFORMANCE_HEADER.disclaimer}
          </p>
        </div>

        {/* Center Main Run Stage: Gauge (Left) & Milestones (Right) */}
        <div className="performance-main-stage">
          {/* Gauge Pane */}
          <div className="performance-gauge-pane">
            <SpeedGauge
              initialSpeed={shouldReduceMotion ? 400 : 0}
              speedTextRef={speedTextRef}
              gaugeArcRef={gaugeArcRef}
              gaugeDotRef={gaugeDotRef}
              gaugeTrackRef={gaugeTrackRef}
            />
          </div>

          {/* Milestones Pane */}
          <div className="performance-milestones-pane">
            <ul
              className="performance-milestones-list"
              aria-label="Acceleration and speed milestones"
            >
              {MILESTONES.map((milestone, idx) => (
                <li
                  key={milestone.id}
                  ref={(el) => (milestoneElementsRef.current[idx] = el)}
                  className={`performance-milestone-item ${shouldReduceMotion ? 'is-reached' : ''}`}
                >
                  <span className="milestone-accent-indicator" aria-hidden="true" />
                  <span className="milestone-flash" aria-hidden="true" />
                  <span className="milestone-label">{milestone.label}</span>
                  <span className="milestone-value">{milestone.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Pane: Power Curve & Mobile Replay Button */}
        <div className="performance-bottom-pane">
          <PowerCurve
            initialProgress={shouldReduceMotion ? 1 : 0}
            curvePathRef={curvePathRef}
            curveDotRef={curveDotRef}
            curveClipRef={curveClipRef}
          />

          {/* Mobile Replay Button (Appears after mobile run completes) */}
          {isMobile && !shouldReduceMotion && showReplay && (
            <button
              type="button"
              className="performance-replay-btn"
              onClick={handleReplayClick}
            >
              Replay Launch
            </button>
          )}
        </div>

        {/* Accessibility Hidden Milestones List */}
        <div className="sr-only">
          <h3>Performance Milestones</h3>
          <ul>
            <li>0 to 100 km/h: 1.9 seconds</li>
            <li>0 to 200 km/h: 4.8 seconds</li>
            <li>0 to 300 km/h: 9.6 seconds</li>
            <li>Top speed: 400 km/h</li>
            <li>Power delivery: 1,100 hp peak</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
