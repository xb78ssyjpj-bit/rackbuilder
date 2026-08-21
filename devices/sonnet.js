// Sonnet — 1 device

export const SONNET = [
  // ------------------------------------------------------------- computing ---
  // Physical specs from the NetBox devicetype-library (CC0-1.0). Their YAML
  // gives U height, weight and the power/console/interface lists exactly, but
  // says nothing about panel layout, so the faces below are drawn from what
  // these classes of device actually look like rather than from a drawing.

  // THE TRAY IS A CARRIER, SO ITS PORTS ARE THE MACHINES' PORTS. It had none
  // of its own, which meant it never appeared on the signal-flow canvas at all
  // — correct for a shelf, wrong for this, because a racked Mac mini is
  // something you patch. Per the user it only ever holds Mac minis, so the two
  // bays are option-card slots and you pick the generation from the inspector,
  // exactly as you fit an I/O card to an SQ-Rack. Sonnet state the tray
  // exposes the machines' ports at the REAR, which is where the bays are.
  //
  // THIS IS THE 1U TRAY, so it takes the 197 mm chassis: the 2018 Intel, the
  // M1 and the M2. The M4 (2024) is a different, smaller chassis and needs
  // Sonnet's 2U tray, which is not in this library — so no M4 card is offered
  // here rather than one that would not physically fit.
  { id: 'sonnet-rackmac-mini', brand: 'Sonnet', model: 'RackMac mini',
    category: 'computing', ru: 1, depth: 300, weight: 4.5, approx: true,
    src: 'https://www.sonnettech.com/product/rackmacmini.html',
    slots: [
      { id: 'bay1', name: 'Bay 1', short: 'B1', fmt: 'sonnet-macmini' },
      { id: 'bay2', name: 'Bay 2', short: 'B2', fmt: 'sonnet-macmini' },
    ],
    rear: { auto: [
      { t: 'slot', slot: 'bay1' },
      { t: 'slot', slot: 'bay2' },
    ] },
    front: { elements: [
      { t: 'bar', x: 330, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'bar', x: 680, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'mesh', x: 880, y: 50, w: 70, h: 60 },
    ], labels: [
      { text: 'SONNET', x: 80, y: 42, size: 10, ls: .8 },
      { text: 'RackMac mini', x: 80, y: 66, size: 8, ls: .4 },
    ] } },
];
