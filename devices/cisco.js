// Cisco — 2 devices

import { switchFront } from './_lib.js';

export const CISCO = [
  { id: 'cisco-catalyst-9200-24p', brand: 'Cisco',
    model: 'Catalyst 9200-24P', category: 'network',
    ru: 1, depth: 250, weight: 5.5, approx: true,
    front: switchFront({ rj45: 24, mgmt: 1, brand: 'Cisco', model: 'Catalyst 9200-24P' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'cisco-catalyst-9200-48p', brand: 'Cisco',
    model: 'Catalyst 9200-48P', category: 'network',
    ru: 1, depth: 250, weight: 5.5, approx: true,
    front: switchFront({ rj45: 48, mgmt: 1, brand: 'Cisco', model: 'Catalyst 9200-48P' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
];
