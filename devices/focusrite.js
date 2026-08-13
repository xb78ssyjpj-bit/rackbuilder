// Focusrite — 2 devices

export const FOCUSRITE = [
  // 1U, 482 x 265 x 45 mm, 3.3 kg. Eight preamps but only TWO combo inputs on
  // the front — the other six are on the rear, which is the thing worth knowing
  // when you plan the loom. The front is the gain and monitoring section.
  { id: 'focusrite-18i20-g2', brand: 'Focusrite', model: 'Scarlett 18i20 2nd gen',
    category: 'audio', ru: 1, depth: 265, weight: 3.3, power: 25, approx: true,
    src: 'https://downloads.focusrite.com/focusrite/scarlett-2nd-gen/scarlett-18i20-2nd-gen',
    front: { elements: [
      { t: 'combo', x: 108, y: 52, n: 2, gap: 58 },
      { t: 'button', x: 214, y: 32, w: 22, h: 14 },
      { t: 'button', x: 214, y: 70, w: 22, h: 14 },
      { t: 'knob', x: 250, y: 50, n: 8, gap: 50, r: 13 },
      { t: 'button', x: 645, y: 32, w: 28, h: 15 },
      { t: 'button', x: 645, y: 70, w: 28, h: 15 },
      { t: 'knob', x: 730, y: 50, r: 22 },
      { t: 'knob', x: 800, y: 28, r: 11 },
      { t: 'knob', x: 860, y: 28, r: 11 },
      { t: 'trs', x: 800, y: 72 },
      { t: 'trs', x: 860, y: 72 },
      { t: 'button', x: 910, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'focusrite', x: 246, y: 16, size: 9, ls: .5 },
      { text: 'Scarlett 18i20', x: 246, y: 94, size: 7, ls: .3 },
      { text: '48V', x: 645, y: 94, size: 6, ls: .3, anchor: 'middle' },
      { text: 'MONITOR', x: 730, y: 94, size: 6, ls: .3, anchor: 'middle' },
    ] },
    // Ordered mains-first, which is the end the IEC and USB actually sit on;
    // the six combo inputs are at the far end. autoLayout lays the list out
    // left to right AS SEEN FROM BEHIND, so declaration order is the panel order.
    // The ten line-output jacks sit two rows deep, as on the real unit.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbb', n: 1 }, { t: 'midi', n: 2 },
      { t: 'rca', n: 2 }, { t: 'toslink', n: 4 }, { t: 'bnc', n: 1 },
      { t: 'trs', n: 10, stack: 2 }, { t: 'combo', n: 6 },
    ] } },

  // ------------------------------------------------------------ half rack ---
  // Half-width devices are NOT rack-mounted: they sit on a shelf, and two of
  // them fit side by side in one U. Coordinates run 0..500 (= 241.3 mm) at the
  // same 2.07 units/mm as a full panel.

  { id: 'focusrite-18i8-g3', brand: 'Focusrite', model: 'Scarlett 18i8 3rd gen',
    category: 'audio', half: true,
    ru: 1, depth: 185, weight: 1.3, power: 10, approx: true,
    front: { elements: [
      { t: 'combo', x: 58, y: 52 },
      { t: 'combo', x: 116, y: 52 },
      { t: 'knob', x: 170, y: 30, r: 12 },
      { t: 'knob', x: 214, y: 30, r: 12 },
      { t: 'button', x: 256, y: 30, w: 22, h: 12 },
      { t: 'knob', x: 306, y: 50, r: 17 },
      { t: 'trs', x: 360, y: 56 },
      { t: 'trs', x: 400, y: 56 },
    ], labels: [
      { text: '18i8', x: 170, y: 76, size: 12, ls: 1 },
      { text: 'PHONES', x: 380, y: 24, size: 8, ls: .5, anchor: 'middle' },
    ] } },
];
