import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import './LoginBackground.css';

export default function LoginBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Mouse tracking with spring physics
  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );

  const springConfig = { damping: 30, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch / coarse pointer
    const checkTouch = () => {
      const match = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(match);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (shouldReduceMotion) {
      return () => window.removeEventListener('resize', checkTouch);
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkTouch);
    };
  }, [mouseX, mouseY, shouldReduceMotion]);

  return (
    <div className="login-bg-container" aria-hidden="true">
      {/* 1px grid lines with radial fade mask */}
      <div className="login-bg-grid" />

      {/* Radial accent glow */}
      {shouldReduceMotion ? (
        <div className="login-bg-glow-static" />
      ) : isTouchDevice ? (
        <motion.div
          className="login-bg-glow-touch"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ) : (
        <motion.div
          className="login-bg-glow-mouse"
          style={{
            x: smoothX,
            y: smoothY,
          }}
        />
      )}
    </div>
  );
}
