// Netgear — 3 devices

import { switchFront } from './_lib.js';

export const NETGEAR = [
  // --------------------------------------------------------------- network ---
  // Imported from the NetBox devicetype-library (CC0-1.0) with
  // tools/netbox-import.py. Port counts, weights and maximum power draw come
  // straight from their YAML and are exact; DEPTH does not — the schema only
  // records full-depth as a boolean, so it comes out as a 250/450 mm bracket.
  // Panels are re-drawn by switchFront() at true connector pitch rather than
  // using the library's elevation photographs, which are raster and would not
  // sit with the rest of the line art.
  //
  // Ports are assumed to be on the FRONT, which is right for access switches;
  // a data-centre switch with rear ports would need that flipped by hand.

  { id: 'netgear-m4250-26g4xf-poe-gsm4230p', brand: 'Netgear',
    model: 'M4250-26G4XF-PoE+ (GSM4230P)', category: 'network',
    ru: 1, depth: 250, weight: 6.8, power: 556, approx: true,
    front: switchFront({ rj45: 26, sfp: 4, brand: 'Netgear', model: 'M4250-26G4XF-PoE+ (GSM4230P)' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'netgear-m4350-24g4xf', brand: 'Netgear',
    model: 'M4350-24G4XF', category: 'network',
    ru: 1, depth: 250, weight: 6.41, approx: true,
    front: switchFront({ rj45: 24, sfp: 4, mgmt: 1, brand: 'Netgear', model: 'M4350-24G4XF' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  { id: 'netgear-m4300-12x12f', brand: 'Netgear',
    model: 'M4300-12X12F', category: 'network',
    ru: 1, depth: 250, power: 250, approx: true,
    front: switchFront({ rj45: 12, sfp: 12, brand: 'Netgear', model: 'M4300-12X12F' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
];
