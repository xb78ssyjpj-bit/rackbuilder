// DiGiCo — 8 devices

export const DIGICO = [
  // 6U, 48 mic in / 24 out. The one entry here backed by genuine straight-on
  // front AND rear photographs in DiGiCo's datasheet: outputs in the top two
  // rows, inputs in the four below, and the Dante ports and BOTH mains inlets
  // on the front. Its rear really is a blank vented panel.
  { id: 'digico-dq-rack', brand: 'DiGiCo', model: 'DQ-Rack', category: 'audio',
    ru: 6, depth: 400, weight: 20, approx: true,
    src: 'https://digico.biz/racks/dq-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 80, w: 100, h: 64 },
      { t: 'button', x: 95, y: 150, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'button', x: 95, y: 190, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 260, r: 18 },
      { t: 'ethercon', x: 200, y: 360 },
      { t: 'ethercon', x: 200, y: 440 },
      { t: 'iec_in', x: 286, y: 360 },
      { t: 'iec_in', x: 286, y: 440 },
      { t: 'xlrm', x: 350, y: 70, n: 12, gap: 51 },
      { t: 'xlrm', x: 350, y: 160, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 250, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 340, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 430, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 520, n: 12, gap: 51 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 15, ls: 1 },
      { text: 'DQ-Rack', x: 82, y: 320, size: 11, ls: .6 },
      { text: 'OUTPUT', x: 350, y: 24, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 204, size: 10, ls: .8, anchor: 'middle' },
    ] },
    // Rear is a plain vented panel — no connectors at all.
    rear: { elements: [
      { t: 'mesh', x: 500, y: 300, w: 760, h: 480 },
    ], labels: [
      { text: 'DiGiCo', x: 500, y: 290, size: 20, ls: 1.4, anchor: 'middle' },
    ] } },

  // 10U card frame: 14 slots of 8 XLR, with the two hot-swap PSU modules and
  // the MADI pod across the top. Rear is fans and vents only.
  { id: 'digico-sd-rack', brand: 'DiGiCo', model: 'SD-Rack', category: 'audio',
    ru: 10, depth: 450, weight: 32, approx: true,
    src: 'https://digico.biz/racks/sd-rack/',
    front: { elements: [
      { t: 'iec_in', x: 120, y: 120 },
      { t: 'button', x: 190, y: 120, w: 26, h: 22 },
      { t: 'display', x: 480, y: 110, w: 180, h: 80 },
      { t: 'bnc', x: 600, y: 200, n: 4, gap: 48 },
      { t: 'usbb', x: 800, y: 200 },
      { t: 'iec_in', x: 830, y: 120 },
      { t: 'button', x: 890, y: 120, w: 26, h: 22 },
      { t: 'line', x: 500, y: 300, w: 856 },
      { t: 'xlrf', x: 100, y: 360, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 443, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 526, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 609, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 692, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 775, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 858, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 941, n: 14, gap: 62 },
    ], labels: [
      { text: 'DiGiCo', x: 300, y: 60, size: 18, ls: 1.2 },
      { text: 'SD-Rack', x: 300, y: 90, size: 13, ls: .6 },
      { text: 'PSU A', x: 120, y: 170, size: 9, ls: .5, anchor: 'middle' },
      { text: 'PSU B', x: 830, y: 170, size: 9, ls: .5, anchor: 'middle' },
    ] },
    rear: { elements: [
      { t: 'fan', x: 250, y: 500, n: 3, gap: 250, r: 90 },
    ], labels: [
      { text: 'SD-Rack', x: 500, y: 940, size: 16, ls: 1, anchor: 'middle' },
    ] } },

  // The MADI twin of the DQ-Rack — same 6U chassis and same 48 in / 24 out, with
  // MADI BNCs where the DQ has Dante etherCON. Layout follows the DQ-Rack, whose
  // front and rear WERE confirmed photographically.
  { id: 'digico-mq-rack', brand: 'DiGiCo', model: 'MQ-Rack', category: 'audio',
    ru: 6, depth: 400, weight: 20, approx: true,
    src: 'https://digico.biz/racks/mq-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 80, w: 100, h: 64 },
      { t: 'button', x: 95, y: 150, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'button', x: 95, y: 190, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 260, r: 18 },
      { t: 'bnc', x: 190, y: 350 },
      { t: 'bnc', x: 250, y: 350 },
      { t: 'bnc', x: 190, y: 420 },
      { t: 'bnc', x: 250, y: 420 },
      { t: 'iec_in', x: 220, y: 520 },
      { t: 'xlrm', x: 350, y: 70, n: 12, gap: 51 },
      { t: 'xlrm', x: 350, y: 160, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 250, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 340, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 430, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 520, n: 12, gap: 51 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 15, ls: 1 },
      { text: 'MQ-Rack', x: 82, y: 320, size: 11, ls: .6 },
      { text: 'MADI', x: 220, y: 470, size: 8, ls: .5, anchor: 'middle' },
      { text: 'OUTPUT', x: 350, y: 24, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 204, size: 10, ls: .8, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 300, w: 760, h: 480 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 290, size: 20, ls: 1.4, anchor: 'middle' }] } },

  // 9U, 48 in / 16 out, expandable to 32 out via two spare 8-channel slots.
  { id: 'digico-d2-rack', brand: 'DiGiCo', model: 'D2-Rack', category: 'audio',
    ru: 9, depth: 400, weight: 28, approx: true,
    src: 'https://digico.biz/racks/d2-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 90, w: 100, h: 64 },
      { t: 'button', x: 95, y: 170, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 250, r: 18 },
      { t: 'bnc', x: 190, y: 350 },
      { t: 'bnc', x: 250, y: 350 },
      { t: 'bnc', x: 190, y: 420 },
      { t: 'bnc', x: 250, y: 420 },
      { t: 'iec_in', x: 190, y: 540 },
      { t: 'iec_in', x: 190, y: 630 },
      { t: 'xlrm', x: 350, y: 90, n: 8, gap: 51 },
      { t: 'xlrm', x: 350, y: 200, n: 8, gap: 51 },
      { t: 'xlrf', x: 350, y: 310, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 420, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 530, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 640, n: 12, gap: 51 },
      // the two spare 8-channel output slots
      { t: 'bar', x: 480, y: 790, w: 250, h: 110, rx: 4 },
      { t: 'bar', x: 760, y: 790, w: 250, h: 110, rx: 4 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 40, size: 15, ls: 1 },
      { text: 'D2-Rack', x: 82, y: 310, size: 11, ls: .6 },
      { text: 'MADI', x: 220, y: 470, size: 8, ls: .5, anchor: 'middle' },
      { text: 'OUTPUT', x: 350, y: 44, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 264, size: 10, ls: .8, anchor: 'middle' },
      { text: 'SPARE SLOTS', x: 620, y: 872, size: 9, ls: .6, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 450, w: 760, h: 740 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 440, size: 20, ls: 1.4, anchor: 'middle' }] } },

  // 4U, four card slots, up to 32 I/O. Same card-slot family as the SD-Rack.
  { id: 'digico-sd-mini-rack', brand: 'DiGiCo', model: 'SD-MiNi Rack', category: 'audio',
    ru: 4, depth: 380, weight: 14, approx: true,
    src: 'https://digico.biz/racks/sd-mini-rack/',
    front: { elements: [
      { t: 'display', x: 140, y: 80, w: 100, h: 56 },
      { t: 'button', x: 118, y: 150, n: 2, gap: 44, w: 32, h: 20 },
      { t: 'bnc', x: 130, y: 240 },
      { t: 'bnc', x: 190, y: 240 },
      { t: 'usbb', x: 150, y: 320 },
      { t: 'iec_in', x: 250, y: 320 },
      { t: 'xlrf', x: 350, y: 65, n: 8, gap: 52 },
      { t: 'xlrf', x: 350, y: 155, n: 8, gap: 52 },
      { t: 'xlrm', x: 350, y: 245, n: 8, gap: 52 },
      { t: 'xlrm', x: 350, y: 335, n: 8, gap: 52 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 13, ls: 1 },
      { text: 'SD-MiNi Rack', x: 82, y: 210, size: 10, ls: .5 },
      { text: 'MADI', x: 160, y: 282, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 200, w: 760, h: 300 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 190, size: 18, ls: 1.2, anchor: 'middle' }] } },

  // 2U, two card slots, up to 16 I/O — the smallest of the SD family.
  { id: 'digico-sd-nano-rack', brand: 'DiGiCo', model: 'SD-NANO Rack', category: 'audio',
    ru: 2, depth: 340, weight: 8, approx: true,
    src: 'https://digico.biz/racks/sd-nano-rack/',
    front: { elements: [
      { t: 'display', x: 140, y: 60, w: 90, h: 46 },
      { t: 'bnc', x: 130, y: 145 },
      { t: 'bnc', x: 190, y: 145 },
      { t: 'xlrf', x: 320, y: 62, n: 4, gap: 52 },
      { t: 'xlrf', x: 320, y: 148, n: 4, gap: 52 },
      { t: 'xlrm', x: 600, y: 62, n: 4, gap: 52 },
      { t: 'xlrm', x: 600, y: 148, n: 4, gap: 52 },
      { t: 'iec_in', x: 880, y: 62 },
      { t: 'iec_in', x: 880, y: 148 },
    ], labels: [
      { text: 'DiGiCo  SD-NANO', x: 82, y: 26, size: 10, ls: .6 },
      { text: 'MADI', x: 160, y: 186, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 100, w: 760, h: 140 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 92, size: 14, ls: 1, anchor: 'middle' }] } },

  // 7U, 32 in / 8 out plus 8 optional modular outs. Tall and shallow — it is a
  // floor stagebox at heart (483 x 179 x 310 mm) and the 7U rack ears are an
  // option, not standard fit.
  { id: 'digico-d-rack', brand: 'DiGiCo', model: 'D-Rack', category: 'audio',
    ru: 7, depth: 179, weight: 14, approx: true,
    src: 'https://digico.biz/racks/d-rack/',
    front: { elements: [
      { t: 'xlrf', x: 180, y: 100, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 200, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 300, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 400, n: 8, gap: 80 },
      { t: 'xlrm', x: 180, y: 530, n: 8, gap: 80 },
      { t: 'display', x: 862, y: 100, w: 80, h: 50 },
      { t: 'ethercon', x: 862, y: 210 },
      { t: 'ethercon', x: 862, y: 300 },
      { t: 'iec_in', x: 862, y: 420 },
      { t: 'iec_in', x: 862, y: 530 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 44, size: 15, ls: 1 },
      { text: 'D-Rack', x: 82, y: 620, size: 12, ls: .6 },
      { text: 'MIC INPUT  1-32', x: 180, y: 62, size: 10, ls: .8 },
      { text: 'LINE OUT  1-8', x: 180, y: 486, size: 10, ls: .8 },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 350, w: 760, h: 560 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 340, size: 18, ls: 1.2, anchor: 'middle' }] } },

  // 2U DMI format converter. Dimensioned CAD drawing in the datasheet: two card
  // slots, wordclock and USB on the front, both PSUs on the REAR.
  { id: 'digico-orange-box', brand: 'DiGiCo', model: 'Orange Box', category: 'audio',
    ru: 2, depth: 263, weight: 5, approx: true,
    src: 'https://digico.biz/racks/orange-box/',
    front: { elements: [
      { t: 'bar', x: 240, y: 120, w: 240, h: 90, rx: 4 },
      { t: 'bnc', x: 430, y: 95 },
      { t: 'bnc', x: 430, y: 148 },
      { t: 'usbb', x: 510, y: 120 },
      { t: 'bar', x: 740, y: 120, w: 240, h: 90, rx: 4 },
    ], labels: [
      { text: 'DiGiCo  Orange Box', x: 500, y: 36, size: 15, ls: 1, anchor: 'middle' },
      { text: 'DMI 1', x: 240, y: 184, size: 9, ls: .5, anchor: 'middle' },
      { text: 'DMI 2', x: 740, y: 184, size: 9, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 2 }] } },
];
