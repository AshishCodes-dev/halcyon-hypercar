import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { scrollToTarget } from '../hooks/useLenis';
import './ReserveButton.css';

export default function ReserveButton({
  isMobile = false,
  label = 'Reserve',
  onClick = null,
}) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  // Magnetic cursor physics
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 350, damping: 25, mass: 0.5 });
  const smoothY = useSpring(rawY, { stiffness: 350, damping: 25, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || isMobile || isTouch) return;
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist < 60) {
      const shift = 8 / 60;
      rawX.set(deltaX * shift);
      rawY.set(deltaY * shift);
    } else {
      rawX.set(0);
      rawY.set(0);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      e.preventDefault();
      scrollToTarget('#colors', -65);
    }
  };

  const easeLuxury = [0.16, 1, 0.3, 1];

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`halcyon-reserve-pill ${isMobile ? 'is-mobile' : ''} ${isHovered ? 'is-hovered' : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion || isMobile || isTouch ? 0 : smoothX,
        y: shouldReduceMotion || isMobile || isTouch ? 0 : smoothY,
      }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      aria-label="Reserve your Halcyon hypercar allocation"
    >
      {/* Idle expanding pulse ring (paused on hover and reduced motion) */}
      {!shouldReduceMotion && !isHovered && (
        <motion.span
          className="reserve-pulse-ring"
          animate={{
            scale: [1, 1.15],
            opacity: [0.35, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: 'easeOut',
          }}
          aria-hidden="true"
        />
      )}

      {/* Diagonal light sweep sheen on hover */}
      {!shouldReduceMotion && isHovered && (
        <motion.span
          className="reserve-sweep-beam"
          initial={{ x: '-140%', opacity: 0 }}
          animate={{ x: '160%', opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 0.65, ease: easeLuxury }}
          aria-hidden="true"
        />
      )}

      {/* Rolling Text Mask */}
      <span className="reserve-label-mask" aria-hidden="true">
        <motion.span
          className="reserve-label-roll"
          animate={isHovered && !shouldReduceMotion ? { y: '-50%' } : { y: '0%' }}
          transition={{ duration: 0.35, ease: easeLuxury }}
        >
          <span className="reserve-text-line">{label}</span>
          <span className="reserve-text-line">{label}</span>
        </motion.span>
      </span>

      {/* Screen-reader accessible label */}
      <span className="sr-only">{label}</span>

      {/* Right 30px Black Circle with Lucide ArrowUpRight */}
      <motion.span
        className="reserve-icon-circle"
        animate={
          isHovered && !shouldReduceMotion
            ? { rotate: 45, scale: 1.08 }
            : { rotate: 0, scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        aria-hidden="true"
      >
        <ArrowUpRight className="reserve-arrow-svg" size={17} strokeWidth={2.6} />
      </motion.span>
    </motion.button>
  );
}
