import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      if (typeof window !== 'undefined') {
        window.__halcyon_lenis = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      window.__halcyon_lenis = lenis;
    }

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        window.__halcyon_lenis = null;
      }
    };
  }, [shouldReduceMotion]);

  return children;
}
