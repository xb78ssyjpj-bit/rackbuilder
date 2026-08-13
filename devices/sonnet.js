// Sonnet — 1 device

export const SONNET = [
  // ------------------------------------------------------------- computing ---
  // Physical specs from the NetBox devicetype-library (CC0-1.0). Their YAML
  // gives U height, weight and the power/console/interface lists exactly, but
  // says nothing about panel layout, so the faces below are drawn from what
  // these classes of device actually look like rather than from a drawing.

  { id: 'sonnet-rackmac-mini', brand: 'Sonnet', model: 'RackMac mini',
    category: 'computing', ru: 1, depth: 300, weight: 4.5, approx: true,
    src: 'https://www.sonnettech.com/product/rackmac-mini.html',
    front: { elements: [
      { t: 'bar', x: 330, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'bar', x: 680, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'mesh', x: 880, y: 50, w: 70, h: 60 },
    ], labels: [
      { text: 'SONNET', x: 80, y: 42, size: 10, ls: .8 },
      { text: 'RackMac mini', x: 80, y: 66, size: 8, ls: .4 },
    ] } },
];
