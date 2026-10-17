import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import GoogleButton from './GoogleButton';
import './LoginPanel.css';

export default function LoginPanel() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const easeLuxury = [0.16, 1, 0.3, 1];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signInWithGoogle();

      if (res.success) {
        setIsSuccess(true);
        // Short exit animation before redirecting
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 360);
      } else if (res.error) {
        setErrorMessage(res.error);
        setIsLoading(false);
      } else {
        // User closed popup or cancelled: no error
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: shouldReduceMotion ? 0.08 : 1.02,
        ease: easeLuxury,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -18,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
      transition: {
        duration: 0.35,
        ease: easeLuxury,
      },
    },
  };

  return (
    <motion.div
      className="login-panel-container"
      initial="hidden"
      animate={isSuccess ? 'exit' : 'visible'}
      variants={panelVariants}
    >
      <div className="login-panel-card-border">
        {/* Slowly rotating accent conic gradient glow on the 1px border */}
        {!shouldReduceMotion && (
          <motion.div
            className="login-panel-conic-glow"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            aria-hidden="true"
          />
        )}

        <div className="login-panel-card-inner">
          <header className="login-panel-header">
            <h2 className="login-panel-title">Welcome back</h2>
            <p className="login-panel-subtext">
              Sign in with your authorized Google account to view your allocation.
            </p>
          </header>

          <div className="login-panel-actions">
            <GoogleButton
              onClick={handleGoogleSignIn}
              loading={isLoading}
              disabled={isSuccess}
            />

            {/* Error feedback area */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  className="login-panel-error"
                  role="alert"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.25, ease: easeLuxury }}
                >
                  <span className="login-panel-error-dot" aria-hidden="true" />
                  <span className="login-panel-error-text">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="login-panel-footer">
            <p className="login-panel-legal">
              By continuing you agree to the terms and privacy policy.
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
