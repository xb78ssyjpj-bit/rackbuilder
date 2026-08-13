// Dell — 1 device

export const DELL = [
  { id: 'dell-poweredge-r650', brand: 'Dell', model: 'PowerEdge R650',
    category: 'computing', ru: 1, depth: 450, weight: 21, approx: true,
    src: 'https://www.dell.com/',
    front: { elements: [
      { t: 'bar', x: 330, y: 50, n: 10, gap: 42, w: 32, h: 64, rx: 2 },
      { t: 'usba', x: 800, y: 50 },
      { t: 'led', x: 848, y: 50 },
      { t: 'button', x: 890, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'DELL', x: 90, y: 44, size: 12, ls: 1 },
      { text: 'PowerEdge R650', x: 90, y: 68, size: 7, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 3 }, { t: 'dsub', n: 1 }, { t: 'iec_in', n: 2 },
    ] } },
];
