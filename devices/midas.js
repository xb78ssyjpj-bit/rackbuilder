// Midas — 5 devices

export const MIDAS = [
  // Midas front-connector stageboxes.
  { id: 'midas-dl16', brand: 'Midas', model: 'DL16', category: 'audio',
    ru: 2, depth: 225, weight: 4.7, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ACJ',
    front: { elements: [
      { t: 'xlrf', x: 110, y: 58, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 145, n: 8, gap: 50 },
      { t: 'vline', x: 500, y: 100, h: 170 },
      { t: 'xlrm', x: 545, y: 58, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 145, n: 4, gap: 55 },
      { t: 'display', x: 792, y: 58, w: 58, h: 34 },
      { t: 'encoder', x: 792, y: 145, r: 16 },
      { t: 'trs', x: 872, y: 100 },
    ], labels: [
      { text: 'MIDAS', x: 84, y: 24, size: 11, ls: 1 },
      { text: 'DL16', x: 906, y: 24, size: 11, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 2 }, { t: 'toslink', n: 2 }, { t: 'rj45', n: 1 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'midas-dl32', brand: 'Midas', model: 'DL32', category: 'audio',
    ru: 3, depth: 300, weight: 5.7, power: 55, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ACR',
    front: { elements: [
      { t: 'xlrf', x: 110, y: 50, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 118, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 186, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 254, n: 8, gap: 50 },
      { t: 'vline', x: 500, y: 150, h: 260 },
      { t: 'xlrm', x: 545, y: 50, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 118, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 186, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 254, n: 4, gap: 55 },
      { t: 'button', x: 820, y: 100, w: 44, h: 24 },
      { t: 'led', x: 820, y: 180, n: 2, gap: 30 },
    ], labels: [
      { text: 'MIDAS  DL32', x: 800, y: 40, size: 11, ls: .6, anchor: 'middle' },
      { text: 'MUTE ALL', x: 820, y: 140, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'iec_in', n: 1 }] } },

  // Midas REAR-connector I/O racks: the front carries only an LCD and status
  // LEDs, which is why these look so bare next to the DL16/DL32 above.
  { id: 'midas-dl251', brand: 'Midas', model: 'DL251', category: 'audio',
    ru: 5, depth: 414, weight: 10, power: 110, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-AAU',
    front: { elements: [
      { t: 'button', x: 200, y: 200, n: 6, gap: 60, w: 40, h: 26 },
      { t: 'led', x: 620, y: 200, n: 6, gap: 34 },
      { t: 'mesh', x: 500, y: 380, w: 760, h: 150 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 90, size: 18, ls: 1.2 },
      { text: 'DL251', x: 90, y: 124, size: 13, ls: .6 },
      { text: 'All I/O on rear panel', x: 906, y: 124, size: 9, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 48 }, { t: 'xlrm', n: 16 }, { t: 'ethercon', n: 3 },
      { t: 'iec_in', n: 2 },
    ] } },

  { id: 'midas-dl153', brand: 'Midas', model: 'DL153', category: 'audio',
    ru: 2, depth: 416, weight: 6.9, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ABQ',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 190, h: 60 },
      { t: 'button', x: 440, y: 100, n: 3, gap: 46, w: 34, h: 22 },
      { t: 'led', x: 640, y: 100, n: 6, gap: 30 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 80, size: 14, ls: 1 },
      { text: 'DL153', x: 90, y: 118, size: 11, ls: .5 },
      { text: 'All I/O on rear panel', x: 906, y: 118, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 16 }, { t: 'xlrm', n: 8 }, { t: 'ethercon', n: 2 },
      { t: 'dsub', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'midas-dl152', brand: 'Midas', model: 'DL152', category: 'audio',
    ru: 2, depth: 416, weight: 6.9, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ABP',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 190, h: 60 },
      { t: 'button', x: 440, y: 100, n: 3, gap: 46, w: 34, h: 22 },
      { t: 'led', x: 640, y: 100, n: 6, gap: 30 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 80, size: 14, ls: 1 },
      { text: 'DL152', x: 90, y: 118, size: 11, ls: .5 },
      { text: 'All I/O on rear panel', x: 906, y: 118, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrm', n: 24 }, { t: 'ethercon', n: 3 }, { t: 'iec_in', n: 1 },
    ] } },
];
