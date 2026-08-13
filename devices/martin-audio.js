// Martin Audio — 10 devices

export const MARTIN_AUDIO = [
  // ----------------------------------------------------- Martin Audio amps ---
  // The iKON and VIA amps share one 2U chassis (482 x 88 x 441, powerCON 32A);
  // rack ears are the optional RACKKITC rather than standard fit.
  //
  // The VIA and DX front panels ARE described concretely by Martin Audio — level
  // controls with signal/clip/protect metering, mute buttons per channel — so
  // those are drawn from that text. The iKON pages say only "intuitive front
  // panel interface", so its arrangement is inferred. No orthographic view was
  // obtained for any of them.
  //
  // Amps carry no mains draw: Martin Audio publish output power only, and their
  // datasheet PDFs are vector art with no extractable text. The DX processors DO
  // publish 30 W nominal, which is used.

  { id: 'martin-ik42', brand: 'Martin Audio', model: 'iKON iK42', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik42',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK42', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-ik41', brand: 'Martin Audio', model: 'iKON iK41', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik41',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK41', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // 8 output channels over 4 NL4 — an NL4 carries two channels, which is how the
  // "8-channel amp with 4 speakON" reading resolves rather than being an error.
  { id: 'martin-ik81', brand: 'Martin Audio', model: 'iKON iK81', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik81',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK81', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // VIA fronts follow Martin Audio's own description: a mains switch and one
  // level control per channel, each with signal / clip / protect metering.
  { id: 'martin-via2004', brand: 'Martin Audio', model: 'VIA2004', category: 'audio',
    ru: 2, depth: 441, weight: 8, approx: true,
    src: 'https://martin-audio.com/products/electronics/via2004',
    front: { elements: [
      { t: 'knob', x: 280, y: 80, n: 4, gap: 150, r: 24 },
      { t: 'led', x: 280, y: 134, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 158, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 182, n: 4, gap: 150 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA2004', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 240, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 240, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 240, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via5004', brand: 'Martin Audio', model: 'VIA5004', category: 'audio',
    ru: 2, depth: 441, weight: 10, approx: true,
    src: 'https://martin-audio.com/products/electronics/via5004',
    front: { elements: [
      { t: 'knob', x: 280, y: 80, n: 4, gap: 150, r: 24 },
      { t: 'led', x: 280, y: 134, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 158, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 182, n: 4, gap: 150 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA5004', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 240, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 240, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 240, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via2502', brand: 'Martin Audio', model: 'VIA2502', category: 'audio',
    ru: 2, depth: 441, weight: 8, approx: true,
    src: 'https://martin-audio.com/products/electronics/via2502',
    front: { elements: [
      { t: 'knob', x: 380, y: 80, n: 2, gap: 200, r: 24 },
      { t: 'led', x: 380, y: 134, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 158, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 182, n: 2, gap: 200 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA2502', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 340, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 340, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 340, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'nl4', n: 2 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via5002', brand: 'Martin Audio', model: 'VIA5002', category: 'audio',
    ru: 2, depth: 441, weight: 10, approx: true,
    src: 'https://martin-audio.com/products/electronics/via5002',
    front: { elements: [
      { t: 'knob', x: 380, y: 80, n: 2, gap: 200, r: 24 },
      { t: 'led', x: 380, y: 134, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 158, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 182, n: 2, gap: 200 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA5002', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 340, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 340, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 340, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'nl4', n: 2 },
      { t: 'powercon_in', n: 1 },
    ] } },

  // DX processors — 30 W nominal is published, so these carry a real figure.
  { id: 'martin-dx04', brand: 'Martin Audio', model: 'DX0.4', category: 'audio',
    ru: 1, depth: 230, weight: 3.0, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx0.4',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 420, y: 50, n: 6, gap: 40, w: 30, h: 20 },
      { t: 'meter', x: 700, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 730, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 760, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX0.4', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 4 }, { t: 'rj45', n: 3 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'martin-dx06', brand: 'Martin Audio', model: 'DX0.6', category: 'audio',
    ru: 1, depth: 230, weight: 3.0, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx0.6',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 420, y: 50, n: 8, gap: 40, w: 30, h: 20 },
      { t: 'meter', x: 760, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 790, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX0.6', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 6 }, { t: 'rj45', n: 3 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'martin-dx40', brand: 'Martin Audio', model: 'DX4.0', category: 'audio',
    ru: 1, depth: 184, weight: 2.7, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx4.0',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 430, y: 50, n: 4, gap: 44, w: 34, h: 20 },
      { t: 'meter', x: 700, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 730, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX4.0', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 8 }, { t: 'rj45', n: 4 },
      { t: 'iec_in', n: 1 },
    ] } },
];
