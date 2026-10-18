import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { scrollToTarget, lockScroll, unlockScroll } from '../hooks/useLenis';
import HalcyonMark from './HalcyonMark';
import AccentSwitcher from './AccentSwitcher';
import ReserveButton from './ReserveButton';
import './Navbar.css';

const navLinks = [
  { id: 'models', label: 'Models' },
  { id: 'design', label: 'Design' },
  { id: 'performance', label: 'Performance' },
  { id: 'colors', label: 'Colors' },
  { id: 'gallery', label: 'Gallery' },
];

const mobileNavLinks = [
  ...navLinks,
  { id: 'materials', label: 'Materials' },
];

const allSections = [
  { id: 'top', label: 'Home' },
  ...navLinks,
  { id: 'materials', label: 'Materials' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Active section for breadcrumb & links
  const [activeSection, setActiveSection] = useState('Home');
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isBrandHovered, setIsBrandHovered] = useState(false);

  // Scroll states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Menu, dropdown, & ripple effects
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [ripple, setRipple] = useState(null);

  // Refs for accessibility & focus trapping
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const avatarDropdownRef = useRef(null);
  const avatarBtnRef = useRef(null);
  const headerRef = useRef(null);

  // Smooth scroll progress line with spring physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  // Dynamic Breadcrumb via IntersectionObserver
  useEffect(() => {
    const sectionElements = allSections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = allSections.find((s) => s.id === entry.target.id);
            if (match) {
              setActiveSection(match.label);
            }
          }
        });
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll visibility (hide on down, show on up) & background styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state (> 24px triggers capsule on desktop)
      setIsScrolled(currentScrollY > 24);

      // Hide / show logic past 160px
      if (isMobileMenuOpen || isAvatarOpen) {
        setIsVisible(true);
      } else if (currentScrollY > 160) {
        if (currentScrollY > lastScrollY.current + 4) {
          // Scrolling down
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 4) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, isAvatarOpen]);

  // Click outside and Escape listener for avatar dropdown
  useEffect(() => {
    if (!isAvatarOpen) return;

    const handleClickOutside = (e) => {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(e.target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target)
      ) {
        setIsAvatarOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAvatarOpen(false);
        avatarBtnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAvatarOpen]);

  // Mobile menu scroll lock and focus management
  useEffect(() => {
    if (isMobileMenuOpen) {
      lockScroll();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
          hamburgerRef.current?.focus();
          return;
        }

        // Trap focus inside mobile menu
        if (e.key === 'Tab' && mobileMenuRef.current) {
          const focusables = mobileMenuRef.current.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockScroll();
      };
    } else {
      unlockScroll();
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    scrollToTarget(`#${sectionId}`, -65);
  };

  const handleSignOut = async () => {
    setIsAvatarOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const handleRipple = ({ color, x, y }) => {
    if (shouldReduceMotion) return;
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setRipple({
        color,
        relX: x - rect.left,
        relY: y - rect.top,
        id: Date.now(),
      });
    }
  };

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  const userFirstName = user?.displayName
    ? user.displayName.split(' ')[0]
    : 'Client';

  const easeLuxury = [0.16, 1, 0.3, 1];

  // Page load link stagger variants
  const linkItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: shouldReduceMotion ? 0 : 0.38 + i * 0.06,
        ease: easeLuxury,
      },
    }),
  };

  return (
    <>
      {/* Skip to Content for keyboard accessibility */}
      <a
        href="#top"
        className="navbar-skip-link"
        onClick={(e) => handleNavClick(e, 'top')}
      >
        Skip to content
      </a>

      {/* Main Header Bar (slides down with fade on load) */}
      <motion.header
        ref={headerRef}
        className={`navbar-header ${isScrolled ? 'navbar-capsule' : ''}`}
        initial={{ y: shouldReduceMotion ? 0 : -40, opacity: 0 }}
        animate={{
          y: shouldReduceMotion ? 0 : isVisible ? 0 : -100,
          opacity: shouldReduceMotion ? (isVisible ? 1 : 0) : isVisible ? 1 : 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.55,
          ease: easeLuxury,
        }}
        role="banner"
      >
        {/* Satisfying accent ripple across navbar */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              className="navbar-accent-ripple"
              style={{
                left: ripple.relX,
                top: ripple.relY,
                backgroundColor: ripple.color,
              }}
              initial={{ scale: 0, opacity: 0.28 }}
              animate={{ scale: 28, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: easeLuxury }}
              onAnimationComplete={() => setRipple(null)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <div className="navbar-container">
          {/* ================= ZONE 1: LEFT ================= */}
          <div className="navbar-left">
            <a
              href="#top"
              className="navbar-brand-link"
              onClick={(e) => handleNavClick(e, 'top')}
              onMouseEnter={() => setIsBrandHovered(true)}
              onMouseLeave={() => setIsBrandHovered(false)}
              aria-label="Halcyon Homepage"
            >
              <HalcyonMark isHovered={isBrandHovered} />
            </a>

            <span className="navbar-breadcrumb-divider" aria-hidden="true">
              /
            </span>

            {/* Dynamic Breadcrumb with popLayout animation */}
            <nav className="navbar-breadcrumb" aria-label="Breadcrumb">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={activeSection}
                  className="navbar-breadcrumb-item"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { y: 9, opacity: 0, filter: 'blur(4px)' }
                  }
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                  }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { y: -9, opacity: 0, filter: 'blur(4px)' }
                  }
                  transition={{
                    duration: 0.28,
                    ease: easeLuxury,
                  }}
                >
                  {activeSection}
                </motion.span>
              </AnimatePresence>
            </nav>
          </div>

          {/* ================= ZONE 2: CENTER ================= */}
          <nav className="navbar-center" aria-label="Primary">
            <ul
              className="navbar-links-list"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.label;

                return (
                  <motion.li
                    key={link.id}
                    className="navbar-link-item"
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={linkItemVariants}
                  >
                    <a
                      href={`#${link.id}`}
                      className={`navbar-link ${isActive ? 'navbar-link-active' : ''}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      onMouseEnter={() => setHoveredLink(link.id)}
                      onFocus={() => setHoveredLink(link.id)}
                      onBlur={() => setHoveredLink(null)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {/* Vercel-style shared hover pill */}
                      {hoveredLink === link.id && !shouldReduceMotion && (
                        <motion.span
                          layoutId="navbar-hover-pill"
                          className="navbar-hover-pill"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 34,
                          }}
                          aria-hidden="true"
                        />
                      )}

                      <span className="navbar-link-text">{link.label}</span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-dot"
                          className="navbar-active-dot"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 34,
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* ================= ZONE 3: RIGHT ================= */}
          <div className="navbar-right">
            {/* Desktop Accent Switcher */}
            <AccentSwitcher onAccentChange={handleRipple} />

            {/* Reserve Button */}
            <ReserveButton onClick={(e) => handleNavClick(e, 'colors')} />

            {/* Auth State: Sign in OR Avatar Dropdown */}
            {user ? (
              <div className="navbar-avatar-wrapper">
                <button
                  ref={avatarBtnRef}
                  type="button"
                  className="navbar-avatar-btn"
                  onClick={() => setIsAvatarOpen((prev) => !prev)}
                  aria-expanded={isAvatarOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  {user.photoURL && !avatarImgError ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="navbar-avatar-img"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarImgError(true)}
                    />
                  ) : (
                    <span className="navbar-avatar-initial" aria-hidden="true">
                      {userInitial}
                    </span>
                  )}
                </button>

                {/* Desktop Avatar Dropdown */}
                <AnimatePresence>
                  {isAvatarOpen && (
                    <motion.div
                      ref={avatarDropdownRef}
                      className="navbar-dropdown-panel"
                      role="menu"
                      initial={{ opacity: 0, scale: 0.94, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 6 }}
                      transition={{ duration: 0.2, ease: easeLuxury }}
                    >
                      <div className="navbar-dropdown-header">
                        <span className="navbar-dropdown-name">
                          {user.displayName || 'Authorized Client'}
                        </span>
                        {user.email && (
                          <span className="navbar-dropdown-email">
                            {user.email}
                          </span>
                        )}
                      </div>
                      <div className="navbar-dropdown-divider" />
                      <button
                        type="button"
                        className="navbar-dropdown-signout"
                        onClick={handleSignOut}
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="navbar-signin-link">
                Sign in
              </Link>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              ref={hamburgerRef}
              type="button"
              className={`navbar-hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <span className="hamburger-line top" aria-hidden="true" />
              <span className="hamburger-line bottom" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 1px Bottom Edge Gradient Line with soft glow beneath */}
        <div className="navbar-bottom-glow-edge" aria-hidden="true" />

        {/* 1px Accent Scroll Progress Line with glowing head */}
        <div className="navbar-progress-track" aria-hidden="true">
          <motion.div className="navbar-scroll-progress" style={{ scaleX }}>
            <span className="navbar-progress-head" />
          </motion.div>
        </div>
      </motion.header>

      {/* ================= FULLSCREEN MOBILE MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            ref={mobileMenuRef}
            className="navbar-mobile-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { clipPath: 'circle(0% at calc(100% - 32px) 32px)' }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { clipPath: 'circle(150% at calc(100% - 32px) 32px)' }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { clipPath: 'circle(0% at calc(100% - 32px) 32px)' }
            }
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.55,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Mobile Menu Content Container */}
            <div className="mobile-menu-container">
              {/* Mobile Links List */}
              <nav aria-label="Mobile Primary">
                <ul className="mobile-links-list">
                  {mobileNavLinks.map((link, idx) => (
                    <motion.li
                      key={link.id}
                      className="mobile-link-item"
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                      transition={{
                        duration: 0.45,
                        delay: shouldReduceMotion ? 0 : 0.15 + idx * 0.07,
                        ease: easeLuxury,
                      }}
                    >
                      <a
                        href={`#${link.id}`}
                        className={`mobile-nav-link ${
                          activeSection === link.label ? 'is-active' : ''
                        }`}
                        onClick={(e) => handleNavClick(e, link.id)}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Actions: Accent Switcher + Reserve + Auth */}
              <motion.div
                className="mobile-menu-actions"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: shouldReduceMotion ? 0 : 0.45,
                  ease: easeLuxury,
                }}
              >
                {/* Mobile Accent Switcher */}
                <div className="mobile-switcher-wrapper">
                  <span className="mobile-switcher-label">Signature Finish</span>
                  <AccentSwitcher isMobile={true} onAccentChange={handleRipple} />
                </div>

                <ReserveButton
                  isMobile={true}
                  label="Reserve Your Halcyon"
                  onClick={(e) => handleNavClick(e, 'colors')}
                />

                {user ? (
                  <div className="mobile-user-status">
                    <div className="mobile-user-info">
                      {user.photoURL && !avatarImgError ? (
                        <img
                          src={user.photoURL}
                          alt=""
                          className="mobile-avatar-img"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="mobile-avatar-initial" aria-hidden="true">
                          {userInitial}
                        </span>
                      )}
                      <span className="mobile-user-name">{userFirstName}</span>
                    </div>
                    <button
                      type="button"
                      className="mobile-signout-btn"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="mobile-signin-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in with Google
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
