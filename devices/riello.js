// Riello — 1 device

export const RIELLO = [
  // Riello are a common UK rack UPS. 2U, 30.5 kg, C20 in / 8x C13 + 1x C19 out.
  { id: 'riello-sdh2200', brand: 'Riello', model: 'Sentinel Dual SDH 2200',
    category: 'power', ru: 2, depth: 600, weight: 30.5, approx: true,
    src: 'https://www.riello-ups.co.uk/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'RIELLO', x: 100, y: 84, size: 16, ls: 1.2 },
      { text: 'SDH 2200', x: 100, y: 116, size: 10, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 9 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },
];
