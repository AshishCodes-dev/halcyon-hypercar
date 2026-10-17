import { motion, useReducedMotion } from 'framer-motion';
import './HalcyonMark.css';

export default function HalcyonMark({ isHovered = false }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="halcyon-brand-lockup" aria-label="Halcyon">
      <motion.span
        className="halcyon-triangle-mark"
        aria-hidden="true"
        animate={{
          rotate: isHovered && !shouldReduceMotion ? 8 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 24,
        }}
      />
      <span className="halcyon-wordmark">HALCYON</span>
    </div>
  );
}
