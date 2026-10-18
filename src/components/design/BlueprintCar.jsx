/* ==========================================================================
   BLUEPRINT CAR SVG COMPONENT
   Technical blueprint drawing of the Halcyon hypercar with animated viewBox
   camera zoom, construction & dimension lines, active hotspot rings,
   leader lines, and subtle floor glow.
   ========================================================================== */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { OVERVIEW_VIEWBOX, DIMENSIONS } from '../../data/design';

export default function BlueprintCar({
  activePart,
  isOverview = false,
  isEntered = true,
}) {
  const shouldReduceMotion = useReducedMotion();
  const svgRef = useRef(null);

  // Target viewBox calculation
  const targetViewBox = isOverview || !activePart ? OVERVIEW_VIEWBOX : activePart.viewBox;

  // Mutable viewBox coordinates for GSAP tweening
  const curViewBoxRef = useRef({
    x: OVERVIEW_VIEWBOX.x,
    y: OVERVIEW_VIEWBOX.y,
    w: OVERVIEW_VIEWBOX.width,
    h: OVERVIEW_VIEWBOX.height,
  });

  // Animate SVG viewBox smoothly when active part or overview changes
  useEffect(() => {
    const cur = curViewBoxRef.current;
    const target = {
      x: targetViewBox.x,
      y: targetViewBox.y,
      w: targetViewBox.width,
      h: targetViewBox.height,
    };

    if (shouldReduceMotion) {
      curViewBoxRef.current = target;
      if (svgRef.current) {
        svgRef.current.setAttribute(
          'viewBox',
          `${target.x} ${target.y} ${target.w} ${target.h}`
        );
      }
      return;
    }

    const tween = gsap.to(cur, {
      x: target.x,
      y: target.y,
      w: target.w,
      h: target.h,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (svgRef.current) {
          svgRef.current.setAttribute(
            'viewBox',
            `${cur.x.toFixed(2)} ${cur.y.toFixed(2)} ${cur.w.toFixed(2)} ${cur.h.toFixed(2)}`
          );
        }
      },
    });

    return () => tween.kill();
  }, [targetViewBox, shouldReduceMotion]);

  return (
    <div className="blueprint-stage-viewport" aria-hidden="true">
      {/* Soft Elliptical Accent Floor Glow Pool */}
      <div className="blueprint-floor-glow" />

      {/* Blueprint SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`${OVERVIEW_VIEWBOX.x} ${OVERVIEW_VIEWBOX.y} ${OVERVIEW_VIEWBOX.width} ${OVERVIEW_VIEWBOX.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`blueprint-svg ${isEntered ? 'is-entered' : ''}`}
      >
        <defs>
          {/* Subtle linear gradient for blueprint construction line strokes */}
          <linearGradient id="blueprintLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--text) 45%, transparent)" />
            <stop offset="50%" stopColor="color-mix(in srgb, var(--text) 80%, transparent)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--text) 45%, transparent)" />
          </linearGradient>

          <linearGradient id="accentBladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ================= 1. CONSTRUCTION & REFERENCE LINES ================= */}
        <g className="blueprint-construction-lines">
          {/* Ground Reference Datum Line */}
          <line
            x1="20"
            y1="292"
            x2="1020"
            y2="292"
            stroke="color-mix(in srgb, var(--text) 25%, transparent)"
            strokeWidth="1"
          />

          {/* Longitudinal Centerline Reference */}
          <line
            x1="30"
            y1="195"
            x2="960"
            y2="195"
            stroke="color-mix(in srgb, var(--text) 20%, transparent)"
            strokeWidth="1"
            strokeDasharray="6 6"
          />

          {/* Front Axle Vertical Reference Line (x=270) */}
          <line
            x1="270"
            y1="165"
            x2="270"
            y2="305"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Rear Axle Vertical Reference Line (x=770) */}
          <line
            x1="770"
            y1="165"
            x2="770"
            y2="305"
            stroke="color-mix(in srgb, var(--text) 22%, transparent)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </g>

        {/* ================= 2. DIMENSION LINES & LABELS ================= */}
        <g className="blueprint-dimension-group">
          {/* Length Dimension Line (below car: x=44 to x=952 at y=320) */}
          <g className="dimension-length">
            <line
              x1="44"
              y1="320"
              x2="952"
              y2="320"
              stroke="color-mix(in srgb, var(--text) 45%, transparent)"
              strokeWidth="1"
            />
            {/* End Ticks */}
            <line x1="44" y1="313" x2="44" y2="327" stroke="color-mix(in srgb, var(--text) 55%, transparent)" strokeWidth="1.2" />
            <line x1="952" y1="313" x2="952" y2="327" stroke="color-mix(in srgb, var(--text) 55%, transparent)" strokeWidth="1.2" />
            {/* Length Label */}
            <text
              x="498"
              y="336"
              textAnchor="middle"
              className="dimension-text"
              fill="var(--muted)"
            >
              {DIMENSIONS.length}
            </text>
          </g>

          {/* Height Dimension Line (right side of car: y=96 to y=292 at x=985) */}
          <g className="dimension-height">
            <line
              x1="985"
              y1="96"
              x2="985"
              y2="292"
              stroke="color-mix(in srgb, var(--text) 45%, transparent)"
              strokeWidth="1"
            />
            {/* End Ticks */}
            <line x1="978" y1="96" x2="992" y2="96" stroke="color-mix(in srgb, var(--text) 55%, transparent)" strokeWidth="1.2" />
            <line x1="978" y1="292" x2="992" y2="292" stroke="color-mix(in srgb, var(--text) 55%, transparent)" strokeWidth="1.2" />
            {/* Height Label */}
            <text
              x="1000"
              y="198"
              textAnchor="start"
              className="dimension-text"
              fill="var(--muted)"
            >
              {DIMENSIONS.height}
            </text>
          </g>

          {/* Width Label near front nose (small label) */}
          <g className="dimension-width">
            <text
              x="52"
              y="218"
              textAnchor="start"
              className="dimension-text"
              fill="var(--muted)"
            >
              W / {DIMENSIONS.width}
            </text>
            <line x1="52" y1="223" x2="110" y2="223" stroke="color-mix(in srgb, var(--text) 30%, transparent)" strokeWidth="1" />
          </g>
        </g>

        {/* ================= 3. HYPERCAR BLUEPRINT OUTLINE ================= */}
        {/* Main Aerodynamic Body Contour */}
        <path
          d="M 68 248 
             Q 160 248, 222 238
             A 48 48 0 0 1 318 238
             Q 375 190, 485 145
             Q 585 98, 715 98
             Q 815 102, 888 162
             L 928 220
             L 918 248
             A 48 48 0 0 1 822 248
             L 722 248
             L 318 248
             L 222 248
             L 68 248 Z"
          stroke="color-mix(in srgb, var(--text) 70%, transparent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blueprint-body-path"
        />

        {/* Cockpit Wrap-Around Glass Canopy */}
        <path
          d="M 405 174 
             Q 495 136, 570 106 
             Q 665 102, 735 142 
             L 810 182"
          stroke="color-mix(in srgb, var(--text) 60%, transparent)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          className="blueprint-canopy-path"
        />

        {/* Canopy A-Pillar & Inner Glass Flow Line */}
        <path
          d="M 445 160 Q 520 128, 620 112 Q 710 115, 775 155"
          stroke="color-mix(in srgb, var(--text) 30%, transparent)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 3"
        />

        {/* Side Door Venturi Air Channel */}
        <path
          d="M 480 205 Q 560 195, 690 195 Q 730 195, 760 220"
          stroke="color-mix(in srgb, var(--text) 35%, transparent)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Rear Diffuser Cutout Tunnel */}
        <path
          d="M 870 248 L 924 235 L 920 248 Z"
          stroke="color-mix(in srgb, var(--text) 45%, transparent)"
          strokeWidth="1.2"
        />

        {/* Front Splitter Aero Plate */}
        <path
          d="M 44 252 L 180 252 L 180 248 L 52 248 Z"
          fill="color-mix(in srgb, var(--text) 65%, transparent)"
          stroke="color-mix(in srgb, var(--text) 80%, transparent)"
          strokeWidth="1.2"
        />
        <path
          d="M 46 252 L 48 232 Q 72 238, 110 245"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Active Rear Wing Assembly */}
        {/* Struts */}
        <path
          d="M 845 200 L 852 110 L 860 110 L 856 200 Z"
          fill="color-mix(in srgb, var(--text) 55%, transparent)"
          stroke="color-mix(in srgb, var(--text) 75%, transparent)"
          strokeWidth="1.2"
        />
        <path
          d="M 885 208 L 892 110 L 900 110 L 895 208 Z"
          fill="color-mix(in srgb, var(--text) 55%, transparent)"
          stroke="color-mix(in srgb, var(--text) 75%, transparent)"
          strokeWidth="1.2"
        />
        {/* Main Wing Airfoil Blade */}
        <path
          d="M 825 110 Q 885 100, 946 112 L 944 116 Q 885 106, 825 116 Z"
          fill="color-mix(in srgb, var(--text) 80%, transparent)"
          stroke="var(--text)"
          strokeWidth="1.4"
        />
        {/* Endplates */}
        <path d="M 822 96 L 826 128 L 832 128 L 828 96 Z" fill="var(--accent)" />
        <path d="M 942 98 L 946 132 L 952 132 L 948 98 Z" fill="var(--accent)" />

        {/* Continuous LED Light Signature Blade (Front nose) */}
        <path
          d="M 82 236 L 195 236"
          stroke="var(--accent)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="blueprint-light-blade"
        />
        {/* Dynamic Accent Beltline Contour Line */}
        <path
          d="M 110 236 
             Q 230 226, 340 195 
             Q 460 152, 580 144 
             Q 720 148, 865 192"
          stroke="url(#accentBladeGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          className="blueprint-beltline-blade"
        />
        {/* Rear Light Blade */}
        <line
          x1="895"
          y1="202"
          x2="926"
          y2="220"
          stroke="var(--accent)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* ================= 4. WHEEL ASSEMBLIES ================= */}
        {/* Front Forged Aero Wheel (Center: 270, 248) */}
        <g className="blueprint-wheel-front">
          {/* Outer Tire */}
          <circle cx="270" cy="248" r="44" stroke="color-mix(in srgb, var(--text) 75%, transparent)" strokeWidth="2.2" fill="var(--bg)" />
          {/* Machined Rim Lip */}
          <circle cx="270" cy="248" r="30" stroke="color-mix(in srgb, var(--text) 45%, transparent)" strokeWidth="1.4" fill="var(--surface)" />
          {/* Closed Aero Face Spokes */}
          <line x1="270" y1="220" x2="270" y2="276" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
          <line x1="242" y1="248" x2="298" y2="248" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
          <line x1="250" y1="228" x2="290" y2="268" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
          <line x1="290" y1="228" x2="250" y2="268" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
          {/* Center Hub */}
          <circle cx="270" cy="248" r="8" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" />
        </g>

        {/* Rear Forged Aero Wheel (Center: 770, 248) */}
        <g className="blueprint-wheel-rear">
          <circle cx="770" cy="248" r="45" stroke="color-mix(in srgb, var(--text) 75%, transparent)" strokeWidth="2.2" fill="var(--bg)" />
          <circle cx="770" cy="248" r="31" stroke="color-mix(in srgb, var(--text) 45%, transparent)" strokeWidth="1.4" fill="var(--surface)" />
          <line x1="770" y1="219" x2="770" y2="277" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
          <line x1="741" y1="248" x2="799" y2="248" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
          <line x1="749" y1="227" x2="791" y2="269" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
          <line x1="791" y1="227" x2="749" y2="269" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
          <circle cx="770" cy="248" r="8" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" />
        </g>

        {/* ================= 5. ACTIVE PART HOTSPOT & LEADER LINE ================= */}
        {!isOverview && activePart && (
          <g className="blueprint-active-hotspot-group">
            {/* Leader Line to text block direction */}
            <path
              d={`M ${activePart.hotspot.x} ${activePart.hotspot.y} L ${activePart.leaderLine.endX} ${activePart.leaderLine.endY}`}
              stroke="color-mix(in srgb, var(--accent) 70%, transparent)"
              strokeWidth="1.4"
              strokeDasharray="4 3"
              className="hotspot-leader-line"
            />
            {/* Leader Line End Anchor Ring */}
            <circle
              cx={activePart.leaderLine.endX}
              cy={activePart.leaderLine.endY}
              r="2.5"
              fill="var(--accent)"
            />

            {/* Hotspot Outer Pulsing Ring */}
            <circle
              cx={activePart.hotspot.x}
              cy={activePart.hotspot.y}
              r="10"
              stroke="color-mix(in srgb, var(--accent) 70%, transparent)"
              strokeWidth="1.5"
              fill="none"
              className="hotspot-pulse-ring"
            />
            {/* Hotspot Center Core Dot */}
            <circle
              cx={activePart.hotspot.x}
              cy={activePart.hotspot.y}
              r="3.5"
              fill="var(--accent)"
              className="hotspot-core-dot"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
