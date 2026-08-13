// Ubiquiti — 3 devices

import { switchFront } from './_lib.js';

export const UBIQUITI = [
  { id: 'ubiquiti-edgeswitch-24-250w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 24 250W', category: 'network',
    ru: 1, depth: 250, weight: 4.7, power: 250, approx: true,
    front: switchFront({ rj45: 24, sfp: 2, brand: 'Ubiquiti', model: 'EdgeSwitch 24 250W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'ubiquiti-edgeswitch-48-500w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 48 500W', category: 'network',
    ru: 1, depth: 250, weight: 6.1, power: 500, approx: true,
    front: switchFront({ rj45: 48, sfp: 4, brand: 'Ubiquiti', model: 'EdgeSwitch 48 500W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'ubiquiti-edgeswitch-16-150w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 16 150W', category: 'network',
    ru: 1, depth: 250, weight: 2.9, power: 150, approx: true,
    front: switchFront({ rj45: 16, sfp: 2, brand: 'Ubiquiti', model: 'EdgeSwitch 16 150W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
];
