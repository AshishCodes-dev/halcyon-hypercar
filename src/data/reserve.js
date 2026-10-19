/* ==========================================================================
   HALCYON RESERVE SECTION DATA
   Production allocation, reservation metrics, and configuration options.
   NOTE: Production allocation numbers, finishes, and specs are placeholder copy.
   ========================================================================== */

export const RESERVE_HEADER = {
  eyebrow: '08 / RESERVE',
  heading: 'Hold your place in the line.',
  disclaimer: 'Concept preview. Numbers are placeholder values. Nothing is saved or sent.',
  ringLabel: 'Production run 01',
};

export const ALLOCATION_DATA = {
  total: 500,
  initialClaimed: 312,
};

export const MODEL_OPTIONS = [
  { id: 'core', label: 'CORE' },
  { id: 'apex', label: 'APEX' },
  { id: 'trackline', label: 'TRACKLINE' },
];

export const DEFAULT_MODEL = 'apex';

export const FORM_STRINGS = {
  nameLabel: 'Full name',
  emailLabel: 'Email',
  modelLabel: 'Model',
  finishLabel: 'Finish',
  submitLabel: 'Reserve my place',
  nameError: 'Please enter your name.',
  emailError: 'Please enter a valid email.',
  successMuted: 'Demo only. Nothing was saved or sent.',
  resetButton: 'Reserve another place',
};
