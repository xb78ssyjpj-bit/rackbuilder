// Eaton — 1 device

export const EATON = [
  { id: 'eaton-5px3000irt2u', brand: 'Eaton', model: '5PX3000iRT2U',
    category: 'power', ru: 2, depth: 600, weight: 38, approx: true,
    src: 'https://www.eaton.com/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'EATON', x: 100, y: 84, size: 16, ls: 1.2 },
      { text: '5PX3000iRT2U', x: 100, y: 116, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 9 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },
];
