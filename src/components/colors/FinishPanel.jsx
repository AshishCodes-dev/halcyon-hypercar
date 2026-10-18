/* ==========================================================================
   HALCYON FINISH PANEL COMPONENT
   Interactive expanding panel representing a bespoke hypercar finish.
   Sets a localized --finish CSS variable so each panel displays its own
   distinct accent gradient, glow, and silhouette light blade.
   Desktop spotlight tracking is hardware accelerated via requestAnimationFrame.
   ========================================================================== */

import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CAR_SILHOUETTE_PATHS } from '../../data/colors';

export default function FinishPanel({
  finish,
  isActive,
  index,
  isEntered,
  onSelect,
  panelRef: externalRef,
}) {
  const shouldReduceMotion = useReducedMotion();
  const internalRef = useRef(null);
  const panelRef = externalRef || internalRef;
  const rafIdRef = useRef(null);

  // Desktop spotlight mouse movement handler (updates CSS variables directly)
  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      panel.style.setProperty('--mx', `${x.toFixed(1)}px`);
      panel.style.setProperty('--my', `${y.toFixed(1)}px`);
    });
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      role="radio"
      aria-checked={isActive}
      tabIndex={isActive ? 0 : -1}
      id={`finish-panel-${finish.id}`}
      aria-label={`${finish.number} ${finish.name}`}
      className={`finish-panel ${isActive ? 'is-active' : 'is-collapsed'} ${isEntered ? 'is-entered' : ''}`}
      style={{
        '--finish': finish.color,
        '--stagger-delay': `${index * 0.08}s`,
      }}
      onClick={() => onSelect(finish.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Subtle 1px Technical Grid Overlay */}
      <div className="finish-panel-grid" aria-hidden="true" />

      {/* 2. Ambient Bottom / Center Radial Glow */}
      <div className="finish-panel-glow" aria-hidden="true" />

      {/* 3. Interactive Cursor Spotlight (Fine pointers only) */}
      {!shouldReduceMotion && (
        <div className="finish-panel-spotlight" aria-hidden="true" />
      )}

      {/* 4. Top Header: Index Number & Active Indicator Dot */}
      <div className="finish-panel-top">
        <span className="finish-number">{finish.number}</span>
        {isActive && (
          <span className="finish-active-dot" aria-hidden="true" />
        )}
      </div>

      {/* 5. Center Graphic: Side-Profile Hypercar Outline */}
      <div className="finish-car-container" aria-hidden="true">
        <svg
          viewBox="0 0 1000 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="finish-car-svg"
        >
          {/* Main Aerodynamic Monocoque Body */}
          <path
            d={CAR_SILHOUETTE_PATHS.body}
            stroke="color-mix(in srgb, var(--text) 70%, transparent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="finish-car-body"
          />

          {/* Glasshouse Canopy */}
          <path
            d={CAR_SILHOUETTE_PATHS.canopy}
            stroke="color-mix(in srgb, var(--text) 50%, transparent)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Dynamic Beltline LED Contour in finish color */}
          <path
            d={CAR_SILHOUETTE_PATHS.beltline}
            stroke="var(--finish)"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="finish-light-blade"
          />

          {/* Front Light Blade Strip */}
          <line
            x1="82"
            y1="236"
            x2="195"
            y2="236"
            stroke="var(--finish)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Rear Light Blade Strip */}
          <line
            x1="895"
            y1="202"
            x2="926"
            y2="220"
            stroke="var(--finish)"
            strokeWidth="3.0"
            strokeLinecap="round"
          />

          {/* Front Forged Aero Wheel */}
          <circle
            cx="270"
            cy="248"
            r="44"
            stroke="color-mix(in srgb, var(--text) 75%, transparent)"
            strokeWidth="2"
            fill="var(--bg)"
          />
          <circle
            cx="270"
            cy="248"
            r="8"
            fill="var(--surface)"
            stroke="var(--finish)"
            strokeWidth="1.6"
          />

          {/* Rear Forged Aero Wheel */}
          <circle
            cx="770"
            cy="248"
            r="45"
            stroke="color-mix(in srgb, var(--text) 75%, transparent)"
            strokeWidth="2"
            fill="var(--bg)"
          />
          <circle
            cx="770"
            cy="248"
            r="8"
            fill="var(--surface)"
            stroke="var(--finish)"
            strokeWidth="1.6"
          />
        </svg>
      </div>

      {/* 6. Bottom Typography: Finish Name */}
      <div className="finish-panel-bottom">
        <h3 className="finish-name">
          {finish.name}
        </h3>
      </div>
    </div>
  );
}
