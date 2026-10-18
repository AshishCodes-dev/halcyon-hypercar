/* ==========================================================================
   SPEC READOUT COMPONENT
   Displays animated count-up metrics, relative power bar (transform: scaleX),
   tagline, concept disclaimer, and model-specific ReserveButton.
   ========================================================================== */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import ReserveButton from '../ReserveButton';
import { MAX_HORSEPOWER } from '../../data/models';

export default function SpecReadout({ activeModel }) {
  const shouldReduceMotion = useReducedMotion();

  // DOM node references for direct GSAP numeric tweening (zero React state re-renders)
  const powerNumRef = useRef(null);
  const accelNumRef = useRef(null);
  const rangeNumRef = useRef(null);

  // Previous numeric values for smooth transition
  const prevValsRef = useRef({
    power: activeModel.power,
    accel: activeModel.acceleration,
    range: activeModel.range,
  });

  useEffect(() => {
    const prev = prevValsRef.current;
    const target = {
      power: activeModel.power,
      accel: activeModel.acceleration,
      range: activeModel.range,
    };

    if (shouldReduceMotion) {
      if (powerNumRef.current) powerNumRef.current.textContent = target.power.toLocaleString();
      if (accelNumRef.current) accelNumRef.current.textContent = target.accel.toFixed(1);
      if (rangeNumRef.current) rangeNumRef.current.textContent = target.range.toLocaleString();
      prevValsRef.current = target;
      return;
    }

    const tweenObj = { ...prev };

    const tween = gsap.to(tweenObj, {
      power: target.power,
      accel: target.accel,
      range: target.range,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: () => {
        if (powerNumRef.current) {
          powerNumRef.current.textContent = Math.round(tweenObj.power).toLocaleString();
        }
        if (accelNumRef.current) {
          accelNumRef.current.textContent = tweenObj.accel.toFixed(1);
        }
        if (rangeNumRef.current) {
          rangeNumRef.current.textContent = Math.round(tweenObj.range).toLocaleString();
        }
      },
      onComplete: () => {
        prevValsRef.current = target;
      },
    });

    return () => tween.kill();
  }, [activeModel, shouldReduceMotion]);

  // Relative power ratio (max 1400 hp)
  const powerRatio = Math.min(1, Math.max(0, activeModel.power / MAX_HORSEPOWER));
  const reserveLabel = `Reserve H1 ${activeModel.name.charAt(0) + activeModel.name.slice(1).toLowerCase()}`;

  return (
    <div className="spec-readout-container">
      {/* Active Model Tagline */}
      <div className="spec-tagline-wrap">
        <p className="spec-tagline">“{activeModel.tagline}”</p>
        <p className="spec-description">{activeModel.description}</p>
      </div>

      {/* 3-Column Telemetry Spec Row */}
      <div className="spec-metrics-grid" role="region" aria-label="Performance specifications">
        {/* Metric 1: Power */}
        <div className="spec-metric-card">
          <span className="spec-metric-label">Power</span>
          <div className="spec-metric-value-wrap">
            <span ref={powerNumRef} className="spec-metric-number">
              {activeModel.power.toLocaleString()}
            </span>
            <span className="spec-metric-unit">{activeModel.powerUnit}</span>
          </div>
        </div>

        {/* Metric 2: 0-100 km/h */}
        <div className="spec-metric-card">
          <span className="spec-metric-label">0-100 km/h</span>
          <div className="spec-metric-value-wrap">
            <span ref={accelNumRef} className="spec-metric-number">
              {activeModel.acceleration.toFixed(1)}
            </span>
            <span className="spec-metric-unit">{activeModel.accelUnit}</span>
          </div>
        </div>

        {/* Metric 3: Range */}
        <div className="spec-metric-card">
          <span className="spec-metric-label">Range</span>
          <div className="spec-metric-value-wrap">
            <span ref={rangeNumRef} className="spec-metric-number">
              {activeModel.range.toLocaleString()}
            </span>
            <span className="spec-metric-unit">{activeModel.rangeUnit}</span>
          </div>
        </div>
      </div>

      {/* Relative Power Output Bar (Animated with transform: scaleX only) */}
      <div className="spec-power-bar-wrap" aria-hidden="true">
        <div className="spec-power-bar-meta">
          <span className="spec-power-bar-title">Platform Output</span>
          <span className="spec-power-bar-ratio">
            {activeModel.power} / {MAX_HORSEPOWER} HP
          </span>
        </div>
        <div className="spec-power-bar-track">
          <div
            className="spec-power-bar-fill"
            style={{
              transform: `scaleX(${powerRatio})`,
              transition: shouldReduceMotion
                ? 'none'
                : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Reserve CTA Button & Concept Note */}
      <div className="spec-actions-row">
        <ReserveButton label={reserveLabel} />
        <span className="spec-disclaimer">
          Concept preview. All figures are placeholder values.
        </span>
      </div>
    </div>
  );
}
