// Green-GO — 7 devices

export const GREEN_GO = [
  // --------------------------------------------------------------- Green-GO ---
  // Element inventories are from Green-GO's own product pages; the ARRANGEMENT
  // is mine, laid out to fit 1U honestly rather than measured off a drawing —
  // their manual site blocks automated access. The MCX's own page confirms
  // "32 multicolour push-buttons, three full colour TFT touchscreens, an
  // internal loudspeaker, a 3-pin XLR microphone input, a 4-pin XLR headset
  // connector", and the product photography shows the two XLRs at the right-hand
  // end, which is what is drawn. Depths are from dealer listings and are the
  // least reliable figure here. None publish a wattage; most are PoE powered.

  // Three screen-and-button clusters: 5 keys above and 5 below each screen makes
  // 30, with the two navigation keys by the encoder making up the 32.
  { id: 'greengo-mcx', brand: 'Green-GO', model: 'MCX rack station', category: 'comms',
    ru: 1, depth: 155, weight: 1.74, approx: true,
    src: 'https://www.greengocom.com/products/mcx',
    front: { elements: [
      { t: 'button', x: 103, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 175, y: 50, w: 175, h: 30 },
      { t: 'button', x: 103, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 298, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 370, y: 50, w: 175, h: 30 },
      { t: 'button', x: 298, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 493, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 565, y: 50, w: 175, h: 30 },
      { t: 'button', x: 493, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 672, y: 30, w: 20, h: 16 },
      { t: 'button', x: 672, y: 70, w: 20, h: 16 },
      { t: 'encoder', x: 706, y: 50, r: 14 },
      { t: 'mesh', x: 748, y: 50, w: 40, h: 40 },
      { t: 'xlrf', x: 812, y: 52 },
      { t: 'xlrf', x: 878, y: 52 },
    ], labels: [
      { text: 'GREEN-GO', x: 748, y: 20, size: 7, ls: .5, anchor: 'middle' },
      { text: 'MIC', x: 812, y: 94, size: 6, ls: .3, anchor: 'middle' },
      { text: 'HEADSET', x: 878, y: 94, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'dsub', n: 1 }, { t: 'dcjack', n: 1 }] } },

  // Four clusters of 6 keys around a screen = the published 24 channels.
  { id: 'greengo-mcxext', brand: 'Green-GO', model: 'MCXEXT rack extension',
    category: 'comms', ru: 1, depth: 155, weight: 1.67, approx: true,
    src: 'https://www.greengocom.com/products/mcxext',
    front: { elements: [
      { t: 'button', x: 128, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 178, y: 50, w: 168, h: 30 },
      { t: 'button', x: 128, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 306, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 356, y: 50, w: 168, h: 30 },
      { t: 'button', x: 306, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 484, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 534, y: 50, w: 168, h: 30 },
      { t: 'button', x: 484, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 662, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 712, y: 50, w: 168, h: 30 },
      { t: 'button', x: 662, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'mesh', x: 866, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 866, y: 20, size: 7, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'dcjack', n: 1 }] } },

  { id: 'greengo-bridgex', brand: 'Green-GO', model: 'BridgeX', category: 'comms',
    ru: 1, depth: 150, weight: 1.4, approx: true,
    src: 'https://www.greengocom.com/products/bridgex',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'BridgeX', x: 110, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 4 }, { t: 'dcjack', n: 1 }] } },

  { id: 'greengo-intx', brand: 'Green-GO', model: 'INTERFACEX', category: 'comms',
    ru: 1, depth: 150, weight: 1.4, approx: true,
    src: 'https://www.greengocom.com/products/interfacex',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'button', x: 640, y: 50, w: 26, h: 18 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'INTERFACEX', x: 110, y: 66, size: 9, ls: .5 },
      { text: '220R', x: 640, y: 78, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 2 }, { t: 'xlrf', n: 3 }, { t: 'xlrm', n: 2 },
      { t: 'dsub', n: 2 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'greengo-q4wr', brand: 'Green-GO', model: 'Q4WR quad 4-wire', category: 'comms',
    ru: 1, depth: 160, weight: 2.45, power: 5, approx: true,
    src: 'https://www.greengocom.com/products/q4wr',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'Q4WR', x: 110, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 1 }, { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 },
      { t: 'dsub', n: 4 }, { t: 'dcjack', n: 1 },
    ] } },

  // Six front-loading bays for NRGP packs, each with its own two-colour LED.
  { id: 'greengo-bc6', brand: 'Green-GO', model: 'BC6 battery charger (6 way)',
    category: 'charging', ru: 1, depth: 150, weight: 2.25, approx: true,
    src: 'https://www.greengocom.com/products/bc6',
    front: { elements: [
      { t: 'bar', x: 210, y: 48, n: 6, gap: 116, w: 100, h: 62, rx: 4 },
      { t: 'led', x: 210, y: 84, n: 6, gap: 116 },
    ], labels: [
      { text: 'GREEN-GO', x: 78, y: 44, size: 9, ls: .6 },
      { text: 'BC6', x: 78, y: 64, size: 8, ls: .5 },
    ] },
    rear: { auto: [{ t: 'dcjack', n: 1 }] } },

  // 1U tray for the slimline interfaces (RDX etc.), which are far narrower than
  // half rack and so are not library entries in their own right.
  { id: 'greengo-sishelve', brand: 'Green-GO', model: 'SISHELVE 1U tray',
    category: 'comms', shelf: true, ru: 1, depth: 130, weight: 1.0, power: 0,
    approx: true,
    front: { elements: [{ t: 'line', x: 500, y: 72, w: 840 }] } },
];
