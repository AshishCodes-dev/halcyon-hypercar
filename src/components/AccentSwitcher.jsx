import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import './AccentSwitcher.css';

export default function AccentSwitcher({ isMobile = false, onAccentChange = null }) {
  const { accent, setAccent, accents } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = (e, item) => {
    setAccent(item);
    if (onAccentChange) {
      const rect = e.currentTarget.getBoundingClientRect();
      onAccentChange({
        color: item.value,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  return (
    <div
      className={`accent-switcher-group ${isMobile ? 'is-mobile' : ''}`}
      role="group"
      aria-label="Accent color"
    >
      {accents.map((item) => {
        const isActive = accent.id === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`accent-dot-btn ${isActive ? 'is-active' : ''}`}
            onClick={(e) => handleSelect(e, item)}
            aria-label={`${item.name} accent`}
            aria-pressed={isActive}
            style={{ '--dot-color': item.value }}
          >
            <motion.span
              className="accent-dot-core"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.25 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            />
            {isActive && (
              <motion.span
                className="accent-dot-ring"
                layoutId={isMobile ? 'mobile-accent-ring' : 'desktop-accent-ring'}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
