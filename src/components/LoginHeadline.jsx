import { motion, useReducedMotion } from 'framer-motion';
import HalcyonMark from './HalcyonMark';
import './LoginHeadline.css';

const headlineText = "Sign in to reserve your place in the line.";
const words = headlineText.split(" ");

export default function LoginHeadline() {
  const shouldReduceMotion = useReducedMotion();

  // Premium agency easing curve (smooth, calm, zero bounce)
  const easeLuxury = [0.16, 1, 0.3, 1];

  const wordVariants = {
    hidden: {
      y: '110%',
      opacity: 0,
      filter: 'blur(8px)',
    },
    visible: (i) => ({
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        delay: 0.12 + i * 0.045,
        ease: easeLuxury,
      },
    }),
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: (customDelay) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: shouldReduceMotion ? 0.05 : customDelay,
        ease: easeLuxury,
      },
    }),
  };

  return (
    <div className="login-headline-wrapper">
      {/* Brand Mark Lockup */}
      <motion.div
        className="login-brand-container"
        initial="hidden"
        animate="visible"
        custom={0.05}
        variants={fadeVariants}
      >
        <HalcyonMark />
      </motion.div>

      {/* Eyebrow Label */}
      <motion.div
        className="login-eyebrow"
        initial="hidden"
        animate="visible"
        custom={0.7}
        variants={fadeVariants}
      >
        HALCYON / ACCESS
      </motion.div>

      {/* Main Headline */}
      <h1 className="login-headline" aria-label={headlineText}>
        {shouldReduceMotion ? (
          <span className="login-headline-static">{headlineText}</span>
        ) : (
          words.map((word, index) => (
            <span key={index} className="login-word-mask" aria-hidden="true">
              <motion.span
                className="login-word"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
              >
                {word}
              </motion.span>
              {index < words.length - 1 && <span className="login-word-space">&nbsp;</span>}
            </span>
          ))
        )}
      </h1>

      {/* Subtitle */}
      <motion.p
        className="login-subtext"
        initial="hidden"
        animate="visible"
        custom={0.85}
        variants={fadeVariants}
      >
        Launching 2026. Limited to a few hundred owners.
      </motion.p>
    </div>
  );
}
