/* ==========================================================================
   HALCYON DESIGN ANATOMY & BLUEPRINT DATA
   Concept preview descriptions and blueprint zoom targets.
   NOTE: All descriptions and dimension figures are placeholder values.
   ========================================================================== */

export const DESIGN_HEADER = {
  eyebrow: '03 / DESIGN',
  heading: 'Every line has a job.',
  disclaimer: 'Concept preview. Descriptions are placeholder copy.',
};

export const DIMENSIONS = {
  length: '4,780 mm',
  width: '2,040 mm',
  height: '1,120 mm',
};

export const OVERVIEW_VIEWBOX = {
  x: 0,
  y: 35,
  width: 1050,
  height: 325,
};

export const DESIGN_PARTS = [
  {
    id: 'light-signature',
    index: '01',
    name: 'LIGHT SIGNATURE',
    tagline: 'A single blade of light.',
    text: 'One continuous light blade replaces headlamps and draws air across the nose.',
    hotspot: { x: 135, y: 236 },
    leaderLine: {
      endX: 240,
      endY: 175,
    },
    viewBox: {
      x: 30,
      y: 140,
      width: 360,
      height: 180,
    },
    calloutPlacement: 'right',
  },
  {
    id: 'active-aero',
    index: '02',
    name: 'ACTIVE AERO',
    tagline: 'Air, rearranged.',
    text: 'A rear wing that rises with speed and flattens under braking.',
    hotspot: { x: 885, y: 112 },
    leaderLine: {
      endX: 790,
      endY: 145,
    },
    viewBox: {
      x: 680,
      y: 70,
      width: 340,
      height: 190,
    },
    calloutPlacement: 'left',
  },
  {
    id: 'canopy',
    index: '03',
    name: 'CANOPY',
    tagline: 'Almost no roof.',
    text: 'One wrap-around glass canopy that lowers the center of gravity.',
    hotspot: { x: 610, y: 102 },
    leaderLine: {
      endX: 720,
      endY: 170,
    },
    viewBox: {
      x: 380,
      y: 65,
      width: 440,
      height: 180,
    },
    calloutPlacement: 'right',
  },
  {
    id: 'wheels',
    index: '04',
    name: 'WHEELS',
    tagline: 'Forged, not fashioned.',
    text: 'Forged aluminium wheels with closed aero faces that cut drag at speed.',
    hotspot: { x: 270, y: 248 },
    leaderLine: {
      endX: 360,
      endY: 195,
    },
    viewBox: {
      x: 155,
      y: 165,
      width: 270,
      height: 155,
    },
    calloutPlacement: 'right',
  },
];
