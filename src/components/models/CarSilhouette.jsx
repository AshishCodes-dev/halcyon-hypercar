/* ==========================================================================
   CAR SILHOUETTE COMPONENT
   Precision SVG side profile of the Halcyon hypercar with 3 variant specs:
   - CORE: Clean, pure aerodynamic outline
   - APEX: Lowered stance, dynamic body beltline accent light blade
   - TRACKLINE: Swan-neck GT rear wing, extended front track splitter & aero fins
   Includes wipe-in clip-path transitions, spinning wheels, entrance draw-on,
   faint floor reflection, and soft accent glow pool.
   ========================================================================== */

import { useReducedMotion } from 'framer-motion';

export default function CarSilhouette({ activeModel, isEntered = true }) {
  const shouldReduceMotion = useReducedMotion();

  const variant = activeModel.variant || 'core';
  const isApex = variant === 'apex';
  const isTrackline = variant === 'trackline';

  // Stance height adjustment for variants
  const stanceTranslateY = isTrackline ? 6 : isApex ? 3 : 0;

  return (
    <div
      className="silhouette-stage"
      aria-label={`Halcyon ${activeModel.name} side profile silhouette`}
    >
      {/* Soft Elliptical Accent Floor Glow Pool */}
      <div className="silhouette-floor-glow" aria-hidden="true" />

      {/* Main Silhouette Container with Clip-Path Wipe */}
      <div
        key={activeModel.id}
        className={`silhouette-graphic-wrapper ${shouldReduceMotion ? 'no-motion' : 'wipe-active'} ${isEntered ? 'is-entered' : ''}`}
        style={{
          transform: `translate3d(0, ${stanceTranslateY}px, 0)`,
          transition: shouldReduceMotion ? 'none' : 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        <svg
          viewBox="0 0 1000 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="silhouette-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Linear gradient for stroke draw and accent fades */}
            <linearGradient id="bodyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--text) 45%, transparent)" />
              <stop offset="35%" stopColor="color-mix(in srgb, var(--text) 85%, transparent)" />
              <stop offset="85%" stopColor="color-mix(in srgb, var(--text) 75%, transparent)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--text) 40%, transparent)" />
            </linearGradient>

            <linearGradient id="accentGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* ================= 1. BASE HYPERCAR CHASSIS ================= */}
          {/* Main Aerodynamic Outer Body Contour */}
          <path
            d="M 68 248 
               Q 160 248, 222 238
               M 318 238
               Q 350 200, 480 148
               Q 580 98, 715 98
               Q 815 102, 888 162
               L 928 220
               L 918 248
               M 822 248
               Q 822 238, 722 238
               M 722 248 L 318 248
               M 222 248 L 68 248 Z"
            stroke="url(#bodyLineGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="silhouette-draw-path"
          />

          {/* Continuous Full Monocoque Silhouette Line for Draw-On Entrance */}
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
            className="silhouette-outline-primary"
          />

          {/* Cockpit Canopy & Side Window Greenhouse */}
          <path
            d="M 405 174 
               Q 495 136, 570 106 
               Q 665 102, 735 142 
               L 810 182"
            stroke="color-mix(in srgb, var(--text) 55%, transparent)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Subtle B-Pillar Aero Partition */}
          <line
            x1="640"
            y1="104"
            x2="655"
            y2="182"
            stroke="color-mix(in srgb, var(--text) 30%, transparent)"
            strokeWidth="1.2"
          />

          {/* Aerodynamic Side Door Scoop & Vent Channel */}
          <path
            d="M 480 205 Q 560 195, 690 195 Q 730 195, 760 220"
            stroke="color-mix(in srgb, var(--text) 35%, transparent)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Underbody Venturi Rear Diffuser Tunnel */}
          <path
            d="M 870 248 L 924 235 L 920 248 Z"
            stroke="color-mix(in srgb, var(--text) 40%, transparent)"
            strokeWidth="1.2"
            fill="rgba(10, 10, 10, 0.6)"
          />

          {/* Front Headlight Housing Blade */}
          <line
            x1="82"
            y1="236"
            x2="195"
            y2="236"
            stroke="color-mix(in srgb, var(--text) 75%, transparent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Rear Taillight Blade Housing */}
          <line
            x1="895"
            y1="202"
            x2="926"
            y2="220"
            stroke="color-mix(in srgb, var(--text) 70%, transparent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* ================= 2. APEX VARIANT DETAILS ================= */}
          {isApex && (
            <g className="variant-apex-details">
              {/* Dynamic Accent Beltline LED Contour */}
              <path
                d="M 110 236 
                   Q 230 226, 340 195 
                   Q 460 152, 580 144 
                   Q 720 148, 865 192"
                stroke="url(#accentGlowGrad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Front Emissive Accent DRL Light Strip */}
              <line
                x1="82"
                y1="236"
                x2="195"
                y2="236"
                stroke="var(--accent)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Rear Emissive Accent Light Blade */}
              <line
                x1="895"
                y1="202"
                x2="926"
                y2="220"
                stroke="var(--accent)"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ================= 3. TRACKLINE VARIANT DETAILS ================= */}
          {isTrackline && (
            <g className="variant-trackline-details">
              {/* Aggressive Carbon GT Swan-Neck Rear Wing */}
              {/* Wing Pylons / Struts */}
              <path
                d="M 845 200 L 852 110 L 860 110 L 856 200 Z"
                fill="color-mix(in srgb, var(--text) 60%, transparent)"
                stroke="color-mix(in srgb, var(--text) 80%, transparent)"
                strokeWidth="1.2"
              />
              <path
                d="M 885 208 L 892 110 L 900 110 L 895 208 Z"
                fill="color-mix(in srgb, var(--text) 60%, transparent)"
                stroke="color-mix(in srgb, var(--text) 80%, transparent)"
                strokeWidth="1.2"
              />
              {/* Main Wing Airfoil Blade */}
              <path
                d="M 825 110 Q 885 100, 946 112 L 944 116 Q 885 106, 825 116 Z"
                fill="color-mix(in srgb, var(--text) 85%, transparent)"
                stroke="var(--text)"
                strokeWidth="1.4"
              />
              {/* Wing Endplates */}
              <path
                d="M 822 96 L 826 128 L 832 128 L 828 96 Z"
                fill="var(--accent)"
              />
              <path
                d="M 942 98 L 946 132 L 952 132 L 948 98 Z"
                fill="var(--accent)"
              />

              {/* Extended Front Track Splitter with Canard / Dive-Plane */}
              <path
                d="M 44 252 L 180 252 L 180 248 L 52 248 Z"
                fill="color-mix(in srgb, var(--text) 65%, transparent)"
                stroke="var(--text)"
                strokeWidth="1.2"
              />
              <path
                d="M 46 252 L 48 230 Q 72 236, 110 244 L 110 248 Z"
                fill="color-mix(in srgb, var(--accent) 40%, transparent)"
                stroke="var(--accent)"
                strokeWidth="1.4"
              />

              {/* Lower Aero Skirt Sill Extension */}
              <path
                d="M 318 253 L 722 253"
                stroke="var(--accent)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Full Accent Strip on Front & Rear Blades */}
              <line
                x1="82"
                y1="236"
                x2="195"
                y2="236"
                stroke="var(--accent)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <line
                x1="895"
                y1="202"
                x2="926"
                y2="220"
                stroke="var(--accent)"
                strokeWidth="3.0"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ================= 4. WHEEL ASSEMBLIES ================= */}
          {/* Front Wheel Assembly (Center: 270, 248) */}
          <g className="silhouette-wheel wheel-front">
            {/* Outer Tire */}
            <circle cx="270" cy="248" r="44" stroke="color-mix(in srgb, var(--text) 75%, transparent)" strokeWidth="2.2" fill="#050505" />
            {/* Rim Lip */}
            <circle cx="270" cy="248" r="30" stroke="color-mix(in srgb, var(--text) 45%, transparent)" strokeWidth="1.4" fill="#080808" />
            {/* Multi-Spoke Turbine Pattern */}
            <line x1="270" y1="220" x2="270" y2="276" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
            <line x1="242" y1="248" x2="298" y2="248" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
            <line x1="250" y1="228" x2="290" y2="268" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
            <line x1="290" y1="228" x2="250" y2="268" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
            {/* Center Hub */}
            <circle cx="270" cy="248" r="8" fill="#141414" stroke="var(--accent)" strokeWidth="1.4" />
          </g>

          {/* Rear Wheel Assembly (Center: 770, 248) */}
          <g className="silhouette-wheel wheel-rear">
            {/* Outer Tire */}
            <circle cx="770" cy="248" r="45" stroke="color-mix(in srgb, var(--text) 75%, transparent)" strokeWidth="2.2" fill="#050505" />
            {/* Rim Lip */}
            <circle cx="770" cy="248" r="31" stroke="color-mix(in srgb, var(--text) 45%, transparent)" strokeWidth="1.4" fill="#080808" />
            {/* Multi-Spoke Turbine Pattern */}
            <line x1="770" y1="219" x2="770" y2="277" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
            <line x1="741" y1="248" x2="799" y2="248" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.5" />
            <line x1="749" y1="227" x2="791" y2="269" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
            <line x1="791" y1="227" x2="749" y2="269" stroke="color-mix(in srgb, var(--text) 50%, transparent)" strokeWidth="1.2" />
            {/* Center Hub */}
            <circle cx="770" cy="248" r="8" fill="#141414" stroke="var(--accent)" strokeWidth="1.4" />
          </g>
        </svg>
      </div>

      {/* Faint Flipped Ground Reflection with Fade-out Mask */}
      <div
        className="silhouette-reflection-wrapper"
        aria-hidden="true"
        style={{
          transform: `translate3d(0, ${stanceTranslateY}px, 0)`,
          transition: shouldReduceMotion ? 'none' : 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        <svg
          viewBox="0 0 1000 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="silhouette-reflection-svg"
        >
          {/* Flipped Outline Silhouette Copy */}
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
            stroke="color-mix(in srgb, var(--text) 45%, transparent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Flipped Wheels */}
          <circle cx="270" cy="248" r="44" stroke="color-mix(in srgb, var(--text) 40%, transparent)" strokeWidth="1.5" />
          <circle cx="770" cy="248" r="45" stroke="color-mix(in srgb, var(--text) 40%, transparent)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
