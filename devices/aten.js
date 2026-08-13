// ATEN — 2 devices

export const ATEN = [
  // 1U pull-out console: LCD and keyboard live inside, so the closed face is a
  // drawer front with a pull handle.
  { id: 'aten-cl1308', brand: 'ATEN', model: 'CL1308 KVM console',
    category: 'computing', ru: 1, depth: 480, weight: 12.6, power: 30, approx: true,
    src: 'https://www.aten.com/',
    front: { elements: [
      { t: 'line', x: 500, y: 20, w: 830 },
      { t: 'line', x: 500, y: 82, w: 830 },
      { t: 'bar', x: 500, y: 50, w: 180, h: 26, rx: 6 },
      { t: 'led', x: 820, y: 50, n: 3, gap: 24 },
    ], labels: [
      { text: 'ATEN  CL1308', x: 120, y: 56, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 8 }, { t: 'iec_in', n: 1 }] } },

  { id: 'aten-cs1308', brand: 'ATEN', model: 'CS1308 KVM switch',
    category: 'computing', ru: 1, depth: 200, weight: 1.9, approx: true,
    src: 'https://www.aten.com/',
    front: { elements: [
      { t: 'led', x: 250, y: 22, n: 8, gap: 60 },
      { t: 'button', x: 250, y: 56, n: 8, gap: 60, w: 34, h: 24 },
      { t: 'button', x: 800, y: 56, w: 30, h: 24 },
    ], labels: [
      { text: 'ATEN', x: 90, y: 40, size: 11, ls: .8 },
      { text: 'CS1308', x: 90, y: 64, size: 9, ls: .5 },
      { text: 'RESET', x: 800, y: 26, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'dsub', n: 8 }, { t: 'iec_in', n: 1 }] } },
];
