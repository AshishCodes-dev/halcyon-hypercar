/* ==========================================================================
   HALCYON MATERIALS SECTION DATA
   Tactile material swatches and sensory macro previews.
   NOTE: Material notes and concept text below are placeholder copy.
   ========================================================================== */

export const MATERIALS_HEADER = {
  eyebrow: '07 / MATERIALS',
  heading: 'Made to be touched.',
  disclaimer: 'Concept preview. Material notes are placeholder copy.',
  desktopHint: 'Move over a tile to look closer',
  touchHint: 'Tap a tile to look closer',
};

export const MATERIALS = [
  {
    id: 'carbon-weave',
    number: '01',
    name: 'CARBON WEAVE',
    note: 'Structural, not decorative.',
    component: 'CarbonWeave',
    gridSpan: 'span 7',
    height: 'min(52svh, 460px)',
    offsetY: '0px',
    entranceOrigin: 'left',
  },
  {
    id: 'forged-aluminium',
    number: '02',
    name: 'FORGED ALUMINIUM',
    note: 'Milled from a single billet.',
    component: 'ForgedAluminium',
    gridSpan: 'span 5',
    height: 'min(42svh, 380px)',
    offsetY: '24px',
    entranceOrigin: 'top',
  },
  {
    id: 'nappa-leather',
    number: '03',
    name: 'NAPPA LEATHER',
    note: 'Stitched by hand, line by line.',
    component: 'NappaLeather',
    gridSpan: 'span 4',
    height: 'min(44svh, 390px)',
    offsetY: '-16px',
    entranceOrigin: 'bottom',
  },
  {
    id: 'anodised-accent',
    number: '04',
    name: 'ANODISED ACCENT',
    note: 'Coloured by the finish you choose.',
    component: 'AnodisedAccent',
    gridSpan: 'span 8',
    height: 'min(48svh, 430px)',
    offsetY: '0px',
    entranceOrigin: 'right',
  },
];
