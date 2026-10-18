/* ==========================================================================
   HALCYON COLORS SECTION DATA
   Concept preview finishes matching site accents.
   NOTE: All finish names and descriptions are placeholder values.
   Colors are derived directly from themeConstants to eliminate duplicate hex values.
   ========================================================================== */

import { ACCENTS } from '../lib/themeConstants';

export const COLORS_HEADER = {
  eyebrow: '05 / COLORS',
  heading: 'Pick your signature.',
  disclaimer: 'Concept preview. Finish names are placeholder.',
  hint: 'Choosing a finish changes the whole site.',
};

// Map each finish to its corresponding accent from themeConstants
const getAccentValue = (id) => ACCENTS.find((a) => a.id === id)?.value;

export const FINISHES = [
  {
    id: 'green',
    number: '01',
    name: 'SIGNAL GREEN',
    color: getAccentValue('green'),
  },
  {
    id: 'red',
    number: '02',
    name: 'EMBER RED',
    color: getAccentValue('red'),
  },
  {
    id: 'orange',
    number: '03',
    name: 'SOLAR ORANGE',
    color: getAccentValue('orange'),
  },
  {
    id: 'blue',
    number: '04',
    name: 'ION BLUE',
    color: getAccentValue('blue'),
  },
  {
    id: 'violet',
    number: '05',
    name: 'NIGHTSHADE VIOLET',
    color: getAccentValue('violet'),
  },
];

// Reusable SVG paths for clean hypercar side silhouette outline
export const CAR_SILHOUETTE_PATHS = {
  body: 'M 68 248 Q 160 248, 222 238 A 48 48 0 0 1 318 238 Q 375 190, 485 145 Q 585 98, 715 98 Q 815 102, 888 162 L 928 220 L 918 248 A 48 48 0 0 1 822 248 L 722 248 L 318 248 L 222 248 L 68 248 Z',
  canopy: 'M 405 174 Q 495 136, 570 106 Q 665 102, 735 142 L 810 182',
  beltline: 'M 110 236 Q 230 226, 340 195 Q 460 152, 580 144 Q 720 148, 865 192',
};
