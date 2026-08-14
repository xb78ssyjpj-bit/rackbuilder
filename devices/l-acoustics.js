// L-Acoustics — 7 devices

// Idle and peak mains draw, supplied by the user:
//
//   LA2Xi 27/1020 · LA4X 60/1600 · LA7.16 136/4300 · LA7.16i 136/4300
//   LA12X 141/5500
//
// NOT in the library and still owed: LA1.16i (70/1040), which has never had an
// RU height established, and LA8 (115/3100), which is not an entry here at all.
// The wattage is recorded here so it is ready when the chassis figures are.

export const L_ACOUSTICS = [
  // FRONT PANELS ARE NOT CONFIRMED for the amplified controllers. They are drawn
  // to the family grammar — display, encoder, per-channel LEDs, power — and
  // should be treated as indicative. The LS10's front IS from L-Acoustics' own
  // text: five etherCON, status LEDs and a recessed reset.
  //
  // No mains draw figure is published for any amplified controller; the output
  // ratings (LA12X 4x3300 W etc.) are output power and are deliberately NOT used.

  { id: 'lacoustics-la12x', brand: 'L-Acoustics', model: 'LA12X', category: 'audio',
    ru: 2, depth: 455, weight: 14.5, power: 141, powerMax: 5500, approx: true,
    src: 'https://www.l-acoustics.com/products/la12x/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 700, y: 76, n: 4, gap: 40 },
      { t: 'led', x: 700, y: 124, n: 4, gap: 40 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA12X', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la4x', brand: 'L-Acoustics', model: 'LA4X', category: 'audio',
    ru: 2, depth: 398, weight: 11.3, power: 60, powerMax: 1600, approx: true,
    src: 'https://www.l-acoustics.com/products/la4x/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 700, y: 76, n: 4, gap: 40 },
      { t: 'led', x: 700, y: 124, n: 4, gap: 40 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA4X', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  // 16 output channels over 8 NL4 — two channels per connector.
  { id: 'lacoustics-la716', brand: 'L-Acoustics', model: 'LA7.16', category: 'audio',
    ru: 2, depth: 465, weight: 17.5, power: 136, powerMax: 4300, approx: true,
    src: 'https://www.l-acoustics.com/products/la7-16/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 690, y: 76, n: 8, gap: 26 },
      { t: 'led', x: 690, y: 124, n: 8, gap: 26 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA7.16', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'nl4', n: 8 }, { t: 'ethercon', n: 2 },
      { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la716i', brand: 'L-Acoustics', model: 'LA7.16i', category: 'audio',
    ru: 2, depth: 465, weight: 17.5, power: 136, powerMax: 4300, approx: true,
    src: 'https://www.l-acoustics.com/products/la7-16i/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 690, y: 76, n: 8, gap: 26 },
      { t: 'led', x: 690, y: 124, n: 8, gap: 26 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA7.16i', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la2xi', brand: 'L-Acoustics', model: 'LA2Xi', category: 'audio',
    ru: 1, depth: 398, weight: 4.4, power: 27, powerMax: 1020, approx: true,
    src: 'https://www.l-acoustics.com/products/la2xi/',
    front: { elements: [
      { t: 'display', x: 300, y: 50, w: 180, h: 44 },
      { t: 'encoder', x: 430, y: 50, r: 16 },
      { t: 'led', x: 520, y: 38, n: 4, gap: 34 },
      { t: 'led', x: 520, y: 64, n: 4, gap: 34 },
      { t: 'button', x: 880, y: 50, w: 22, h: 26 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 82, y: 44, size: 10, ls: .8 },
      { text: 'LA2Xi', x: 82, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 8 }, { t: 'ethercon', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'lacoustics-p1', brand: 'L-Acoustics', model: 'P1', category: 'audio',
    ru: 1, depth: 300, weight: 4, approx: true,
    src: 'https://www.l-acoustics.com/products/p1/',
    front: { elements: [
      { t: 'display', x: 320, y: 50, w: 200, h: 44 },
      { t: 'encoder', x: 450, y: 50, r: 16 },
      { t: 'trs', x: 520, y: 50 },
      { t: 'knob', x: 580, y: 50, r: 13 },
      { t: 'button', x: 880, y: 50, w: 22, h: 26 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 82, y: 44, size: 10, ls: .8 },
      { text: 'P1', x: 82, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 8 }, { t: 'xlrm', n: 4 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  // Half-rack Milan/AVB switch. Front elements are from L-Acoustics' own text:
  // five etherCON, power and fault LEDs, per-port link LEDs, recessed reset.
  { id: 'lacoustics-ls10', brand: 'L-Acoustics', model: 'LS10', category: 'network',
    half: true, ears: true, ru: 1, depth: 250, weight: 1.5, power: 20, approx: true,
    src: 'https://www.l-acoustics.com/products/ls10/',
    front: { elements: [
      { t: 'ethercon', x: 120, y: 54, n: 5, gap: 56 },
      { t: 'led', x: 400, y: 34 },
      { t: 'led', x: 400, y: 70 },
      { t: 'button', x: 424, y: 54, w: 12, h: 12 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 24, y: 30, size: 8, ls: .5 },
      { text: 'LS10', x: 24, y: 50, size: 8, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 3 }, { t: 'sfp', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },
];
