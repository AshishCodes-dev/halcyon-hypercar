import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { MODEL_OPTIONS, DEFAULT_MODEL, FORM_STRINGS } from '../../data/reserve';
import { FINISHES } from '../../data/colors';
import ReserveButton from '../ReserveButton';

export default function ReserveForm({ claimedCount, onReserveSuccess }) {
  const { user } = useAuth();
  const { accent, setAccent, accents } = useTheme();

  // Form Fields State (pre-filled with authenticated user if available)
  const [name, setName] = useState(() => user?.displayName || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [model, setModel] = useState(DEFAULT_MODEL);

  // Focus & Validation State
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({ name: false, email: false });
  const [errors, setErrors] = useState({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Element Refs for keyboard navigation & focusing errors
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const modelRefs = useRef([]);
  const finishRefs = useRef([]);

  // Sync state if user auth resolves after initial mount
  const [syncedUser, setSyncedUser] = useState(user);
  if (user && user !== syncedUser) {
    setSyncedUser(user);
    if (user.displayName && !name) {
      setName(user.displayName);
    }
    if (user.email && !email) {
      setEmail(user.email);
    }
  }

  // Active finish name lookup (e.g. SIGNAL GREEN, EMBER RED)
  const currentFinishName =
    FINISHES.find((f) => f.id === accent.id)?.name || accent.name.toUpperCase();

  // Field validation functions
  const validateField = (field, value) => {
    if (field === 'name') {
      if (!value.trim()) {
        return FORM_STRINGS.nameError;
      }
      return null;
    }
    if (field === 'email') {
      if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return FORM_STRINGS.emailError;
      }
      return null;
    }
    return null;
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'name' ? name : email;
    const error = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateField('name', val) }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) }));
    }
  };

  // Keyboard navigation for Model Radiogroup (arrow keys roving tabindex)
  const handleModelKeyDown = (e, index) => {
    const count = MODEL_OPTIONS.length;
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    }

    if (nextIndex !== null) {
      const nextOpt = MODEL_OPTIONS[nextIndex];
      setModel(nextOpt.id);
      modelRefs.current[nextIndex]?.focus();
    }
  };

  // Keyboard navigation for Finish Radiogroup (arrow keys roving tabindex)
  const handleFinishKeyDown = (e, index) => {
    const count = accents.length;
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    }

    if (nextIndex !== null) {
      const nextItem = accents[nextIndex];
      setAccent(nextItem);
      finishRefs.current[nextIndex]?.focus();
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all fields
    const nameErr = validateField('name', name);
    const emailErr = validateField('email', email);

    setTouched({ name: true, email: true });
    setErrors({ name: nameErr, email: emailErr });

    // Focus first invalid field on failure
    if (nameErr) {
      nameInputRef.current?.focus();
      return;
    }
    if (emailErr) {
      emailInputRef.current?.focus();
      return;
    }

    // Begin simulated submission (900ms)
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onReserveSuccess();
      setIsSubmitted(true);
    }, 900);
  };

  // Reset form handler for reserving another place
  const handleReset = () => {
    setIsSubmitted(false);
    if (!user) {
      setName('');
      setEmail('');
    }
    setTouched({ name: false, email: false });
    setErrors({});
  };

  const easeLuxury = [0.16, 1, 0.3, 1];

  return (
    <div className="reserve-form-wrapper">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="reserve-form-active"
            className="reserve-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: easeLuxury }}
          >
            {/* Field 1: Full Name */}
            <div
              className={`form-field ${
                focusedField === 'name' || name.length > 0 ? 'is-active' : ''
              } ${errors.name ? 'has-error' : ''}`}
            >
              <label htmlFor="reserve-name" className="form-label">
                {FORM_STRINGS.nameLabel}
              </label>
              <input
                ref={nameInputRef}
                id="reserve-name"
                name="name"
                type="text"
                autoComplete="name"
                className="form-input"
                value={name}
                onChange={handleNameChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => handleBlur('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'reserve-name-error' : undefined}
                disabled={isSubmitting}
              />
              <span className="field-border-base" aria-hidden="true" />
              <span className="field-border-accent" aria-hidden="true" />
              {errors.name && (
                <span
                  id="reserve-name-error"
                  className="field-error-message"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.name}
                </span>
              )}
            </div>

            {/* Field 2: Email */}
            <div
              className={`form-field ${
                focusedField === 'email' || email.length > 0 ? 'is-active' : ''
              } ${errors.email ? 'has-error' : ''}`}
            >
              <label htmlFor="reserve-email" className="form-label">
                {FORM_STRINGS.emailLabel}
              </label>
              <input
                ref={emailInputRef}
                id="reserve-email"
                name="email"
                type="email"
                autoComplete="email"
                className="form-input"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => handleBlur('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'reserve-email-error' : undefined}
                disabled={isSubmitting}
              />
              <span className="field-border-base" aria-hidden="true" />
              <span className="field-border-accent" aria-hidden="true" />
              {errors.email && (
                <span
                  id="reserve-email-error"
                  className="field-error-message"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field 3: Model Selector (Segmented Pill Radiogroup) */}
            <div className="form-group-block">
              <span className="form-group-title" id="reserve-model-label">
                {FORM_STRINGS.modelLabel}
              </span>
              <div
                className="model-radiogroup"
                role="radiogroup"
                aria-labelledby="reserve-model-label"
              >
                {MODEL_OPTIONS.map((opt, idx) => {
                  const isChecked = model === opt.id;
                  return (
                    <button
                      key={opt.id}
                      ref={(el) => (modelRefs.current[idx] = el)}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`model-pill-btn ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => setModel(opt.id)}
                      onKeyDown={(e) => handleModelKeyDown(e, idx)}
                      disabled={isSubmitting}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Finish Swatches (Bi-directional Theme Sync Radiogroup) */}
            <div className="form-group-block">
              <div className="finish-group-header">
                <span className="form-group-title" id="reserve-finish-label">
                  {FORM_STRINGS.finishLabel}
                </span>
                <span className="finish-name-display" aria-live="polite">
                  {currentFinishName}
                </span>
              </div>
              <div
                className="finish-radiogroup"
                role="radiogroup"
                aria-labelledby="reserve-finish-label"
              >
                {accents.map((accItem, idx) => {
                  const isChecked = accent.id === accItem.id;
                  return (
                    <button
                      key={accItem.id}
                      ref={(el) => (finishRefs.current[idx] = el)}
                      type="button"
                      role="radio"
                      aria-label={accItem.name}
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`finish-swatch-btn ${isChecked ? 'is-selected' : ''}`}
                      style={{ '--finish': accItem.value }}
                      onClick={() => setAccent(accItem)}
                      onKeyDown={(e) => handleFinishKeyDown(e, idx)}
                      disabled={isSubmitting}
                    >
                      <span className="swatch-color-dot" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="form-submit-row">
              <ReserveButton
                type="submit"
                label={FORM_STRINGS.submitLabel}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="reserve-success-card"
            className="reserve-success-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: easeLuxury }}
          >
            <h3 className="success-heading">
              Place {claimedCount} of 500 is held for you.
            </h3>
            <p className="success-muted">{FORM_STRINGS.successMuted}</p>
            <button
              type="button"
              className="reserve-reset-btn"
              onClick={handleReset}
            >
              {FORM_STRINGS.resetButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
