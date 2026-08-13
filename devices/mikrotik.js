// MikroTik — 3 devices

import { switchFront } from './_lib.js';

export const MIKROTIK = [
  { id: 'mikrotik-crs326-24g-2s-rm', brand: 'MikroTik',
    model: 'CRS326-24G-2S+RM', category: 'network',
    ru: 1, depth: 250, weight: 1.08, power: 24, approx: true,
    front: switchFront({ rj45: 24, sfp: 2, brand: 'MikroTik', model: 'CRS326-24G-2S+RM' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'mikrotik-crs317-1g-16s-rm', brand: 'MikroTik',
    model: 'CRS317-1G-16S+RM', category: 'network',
    ru: 1, depth: 250, power: 44, approx: true,
    front: switchFront({ rj45: 1, sfp: 16, brand: 'MikroTik', model: 'CRS317-1G-16S+RM' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'mikrotik-crs309-1g-8s-in', brand: 'MikroTik',
    model: 'CRS309-1G-8S+IN', category: 'network',
    ru: 1, depth: 250, power: 23, approx: true,
    front: switchFront({ rj45: 1, sfp: 8, brand: 'MikroTik', model: 'CRS309-1G-8S+IN' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
];
