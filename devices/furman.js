// Furman — 2 devices

export const FURMAN = [
  // ---------------------------------------------------------------- Furman ---
  // The rear outlets are drawn as Schuko because that is what a UK/EU rack has;
  // the US models ship with NEMA, which this library has no primitive for. The
  // COUNT is the part that matters for planning and that is right either way.
  { id: 'furman-pl8c', brand: 'Furman', model: 'PL-8C', category: 'power',
    ru: 1, depth: 267, weight: 5.4, approx: true,
    src: 'https://furmanpower.com/products/pl-8c',
    front: { elements: [
      { t: 'button', x: 110, y: 52, w: 30, h: 26 },
      { t: 'knob', x: 170, y: 52, r: 14 },
      { t: 'bar', x: 430, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'bar', x: 620, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'socket_thru', x: 850, y: 52 },
    ], labels: [
      { text: 'FURMAN', x: 220, y: 44, size: 11, ls: 1 },
      { text: 'PL-8C', x: 220, y: 68, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'socket_thru', n: 8 }, { t: 'bnc', n: 1 }] } },

  { id: 'furman-plpro-dmc', brand: 'Furman', model: 'PL-PRO DMC', category: 'power',
    ru: 1, depth: 267, weight: 5.4, approx: true,
    src: 'https://furmanpower.com/products/pl-pro-dmc',
    front: { elements: [
      { t: 'button', x: 105, y: 52, w: 28, h: 26 },
      { t: 'display', x: 250, y: 52, w: 140, h: 40 },
      { t: 'button', x: 352, y: 52, w: 24, h: 20 },
      { t: 'bar', x: 480, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'bar', x: 640, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'socket_thru', x: 790, y: 52 },
      { t: 'usba', x: 890, y: 52 },
    ], labels: [
      { text: 'FURMAN  PL-PRO DMC', x: 105, y: 20, size: 8, ls: .5 },
    ] },
    rear: { auto: [{ t: 'socket_thru', n: 8 }, { t: 'bnc', n: 1 }] } },
];
