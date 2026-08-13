// Clear-Com — 7 devices

export const CLEAR_COM = [
  // ------------------------------------------------------------- Clear-Com ---
  // The Eclipse HX frames are card-based and their datasheets carry straight-on
  // front views, so the slot counts and their groupings are from source. Note
  // the frames are REAR-connector: the front is card edges and PSUs.

  { id: 'clearcom-hx-median', brand: 'Clear-Com', model: 'Eclipse HX-Median',
    category: 'comms', ru: 6, depth: 410, weight: 20, power: 300, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 76, y: 320, n: 8, gap: 22, w: 18, h: 480, rx: 2 },
      { t: 'bar', x: 262, y: 320, w: 38, h: 480, rx: 2 },
      { t: 'bar', x: 306, y: 320, w: 38, h: 480, rx: 2 },
      { t: 'bar', x: 353, y: 320, n: 7, gap: 56, w: 50, h: 480, rx: 2 },
      { t: 'display', x: 830, y: 130, w: 150, h: 70 },
      { t: 'bar', x: 830, y: 300, w: 200, h: 160, rx: 4 },
      { t: 'bar', x: 830, y: 480, w: 200, h: 160, rx: 4 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 16, ls: 1.2 },
      { text: 'Eclipse HX-Median', x: 420, y: 50, size: 13, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 4 }, { t: 'dsub', n: 4 }, { t: 'iec_in', n: 2 },
    ] } },

  { id: 'clearcom-hx-omega', brand: 'Clear-Com', model: 'Eclipse HX-Omega',
    category: 'comms', ru: 6, depth: 410, weight: 20, power: 300, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 90, y: 320, w: 34, h: 480, rx: 2 },
      { t: 'bar', x: 130, y: 320, w: 34, h: 480, rx: 2 },
      { t: 'bar', x: 175, y: 320, n: 15, gap: 46, w: 40, h: 480, rx: 2 },
      { t: 'bar', x: 890, y: 300, w: 80, h: 160, rx: 4 },
      { t: 'bar', x: 890, y: 480, w: 80, h: 160, rx: 4 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 16, ls: 1.2 },
      { text: 'Eclipse HX-Omega', x: 420, y: 50, size: 13, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'rj45', n: 3 }, { t: 'dsub', n: 4 },
      { t: 'iec_in', n: 2 },
    ] } },

  { id: 'clearcom-hx-delta', brand: 'Clear-Com', model: 'Eclipse HX-Delta',
    category: 'comms', ru: 3, depth: 445, weight: 12, power: 144, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 100, y: 175, n: 3, gap: 55, w: 48, h: 200, rx: 2 },
      { t: 'bar', x: 262, y: 175, w: 38, h: 200, rx: 2 },
      { t: 'bar', x: 306, y: 175, w: 38, h: 200, rx: 2 },
      { t: 'bar', x: 380, y: 175, n: 4, gap: 118, w: 100, h: 200, rx: 2 },
      { t: 'fan', x: 870, y: 175, r: 44 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 14, ls: 1.2 },
      { text: 'Eclipse HX-Delta', x: 420, y: 50, size: 11, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 4 }, { t: 'dsub', n: 4 }, { t: 'dcjack', n: 2 },
    ] } },

  // HelixNet main station — 1U, four keyset displays with their call/talk keys.
  { id: 'clearcom-hms-4x', brand: 'Clear-Com', model: 'HelixNet HMS-4X',
    category: 'comms', ru: 1, depth: 320, weight: 2.65, power: 250, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'xlrf', x: 100, y: 40 },
      { t: 'usba', x: 160, y: 30 },
      { t: 'display', x: 300, y: 30, n: 4, gap: 120, w: 100, h: 30 },
      { t: 'button', x: 300, y: 66, n: 4, gap: 120, w: 60, h: 20 },
      { t: 'button', x: 760, y: 30, w: 44, h: 20 },
      { t: 'button', x: 760, y: 66, w: 44, h: 20 },
      { t: 'knob', x: 840, y: 48, r: 14 },
      { t: 'knob', x: 895, y: 48, r: 14 },
    ], labels: [
      { text: 'CLEAR-COM  HMS-4X', x: 300, y: 94, size: 7, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 3 }, { t: 'xlrm', n: 1 }, { t: 'jack', n: 1 },
      { t: 'dsub', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'clearcom-fse-base', brand: 'Clear-Com', model: 'FreeSpeak Edge Base',
    category: 'comms', ru: 1, depth: 353, weight: 3.3, power: 160, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'xlrf', x: 105, y: 52 },
      { t: 'usba', x: 172, y: 34 },
      { t: 'button', x: 172, y: 74, w: 30, h: 18 },
      { t: 'encoder', x: 260, y: 52, r: 16 },
      { t: 'display', x: 420, y: 52, w: 180, h: 50 },
      { t: 'display', x: 620, y: 52, w: 180, h: 50 },
      { t: 'encoder', x: 762, y: 52, r: 16 },
      { t: 'led', x: 820, y: 52 },
      { t: 'encoder', x: 880, y: 52, r: 16 },
    ], labels: [
      { text: 'FreeSpeak Edge', x: 420, y: 94, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'rj45', n: 12 }, { t: 'sfp', n: 4 },
      { t: 'dsub', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'clearcom-lq-r2w4', brand: 'Clear-Com', model: 'LQ-R2W4-4W4',
    category: 'comms', ru: 1, depth: 224, weight: 1.95, power: 60, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'display', x: 450, y: 52, w: 160, h: 44 },
      { t: 'button', x: 580, y: 52, n: 5, gap: 42, w: 32, h: 22 },
    ], labels: [
      { text: 'CLEAR-COM', x: 100, y: 44, size: 10, ls: .8 },
      { text: 'LQ SERIES', x: 100, y: 68, size: 8, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'ethercon', n: 4 }, { t: 'rj45', n: 2 },
      { t: 'dcjack', n: 2 },
    ] } },

  { id: 'clearcom-arcadia', brand: 'Clear-Com', model: 'Arcadia Central Station',
    category: 'comms', ru: 1, depth: 350, weight: 4, approx: true,
    // Clear-Com publish no dimensions or rear connector counts for Arcadia.
    src: 'https://www.clearcom.com/Products/Products-By-Name/Station-IC/arcadia-central-station',
    front: { elements: [
      { t: 'xlrf', x: 100, y: 52 },
      { t: 'encoder', x: 175, y: 52, r: 15 },
      { t: 'encoder', x: 232, y: 52, r: 15 },
      { t: 'display', x: 400, y: 52, w: 170, h: 48 },
      { t: 'display', x: 590, y: 52, w: 170, h: 48 },
      { t: 'encoder', x: 722, y: 52, r: 15 },
      { t: 'encoder', x: 779, y: 52, r: 15 },
      { t: 'mesh', x: 870, y: 52, w: 60, h: 42 },
    ], labels: [
      { text: 'Arcadia', x: 400, y: 94, size: 7, ls: .4, anchor: 'middle' },
    ] } },
];
