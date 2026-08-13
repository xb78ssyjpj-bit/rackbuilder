// PreSonus — 1 device

export const PRESONUS = [
  // 1U, 483 x 44.45 x 178 mm, 2.7 kg. Eight combo inputs with gain knobs above,
  // phantom switches, monitor level and two headphone outs.
  { id: 'presonus-quantum-2626', brand: 'PreSonus', model: 'Quantum 2626',
    category: 'audio', ru: 1, depth: 178, weight: 2.7, power: 30, approx: true,
    src: 'https://www.presonus.com/products/quantum-2626',
    front: { elements: [
      { t: 'knob', x: 106, y: 24, n: 8, gap: 62, r: 10 },
      { t: 'combo', x: 106, y: 64, n: 8, gap: 62 },
      { t: 'button', x: 610, y: 26, w: 26, h: 14 },
      { t: 'button', x: 646, y: 26, w: 26, h: 14 },
      { t: 'knob', x: 706, y: 50, r: 18 },
      { t: 'trs', x: 790, y: 56 },
      { t: 'trs', x: 848, y: 56 },
      { t: 'knob', x: 790, y: 22, r: 9 },
      { t: 'knob', x: 848, y: 22, r: 9 },
    ], labels: [
      { text: '48V', x: 628, y: 52, size: 8, ls: .5, anchor: 'middle' },
      { text: 'MONITOR', x: 706, y: 82, size: 8, ls: .5, anchor: 'middle' },
      { text: 'PHONES', x: 819, y: 82, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear inventory per PreSonus: 8 line out, stereo monitor out, ch 1-2
    // preamp out / line return, MIDI I/O, S/PDIF on RCA, ADAT optical I/O,
    // wordclock BNC, Thunderbolt 3 (a USB-C shell) and the IEC inlet.
    // The jack bank runs two rows deep on the real unit, hence `stack`.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbc', n: 1 }, { t: 'bnc', n: 2 },
      { t: 'toslink', n: 2 }, { t: 'rca', n: 2 }, { t: 'midi', n: 2 },
      { t: 'trs', n: 14, stack: 2 },
    ] } },
];
