// QSC — 20 devices

const pldFront = (model) => ({ elements: [
  { t: 'button', x: 88, y: 100, w: 26, h: 26 },                 // soft power
  { t: 'button', x: 172, y: 52, w: 30, h: 18, n: 4, gap: 62 },  // MUTE
  { t: 'led', x: 172, y: 80, n: 4, gap: 62 },                   // limiter
  { t: 'led', x: 172, y: 102, n: 4, gap: 62 },                  // -10 dB
  { t: 'led', x: 172, y: 124, n: 4, gap: 62 },                  // -20 dB / clip
  { t: 'button', x: 172, y: 152, w: 30, h: 18, n: 4, gap: 62 }, // SELECT
  { t: 'display', x: 566, y: 100, w: 250, h: 118 },             // 400 x 240 TFT
  { t: 'button', x: 740, y: 56, w: 42, h: 20 },                 // HOME
  { t: 'button', x: 740, y: 86, w: 42, h: 20 },                 // ENTER
  { t: 'button', x: 740, y: 116, w: 42, h: 20 },                // EXIT
  { t: 'button', x: 740, y: 146, w: 42, h: 20 },                // GAIN
  { t: 'knob', x: 846, y: 100, r: 30 },                         // MASTER CONTROL
], labels: [
  { text: 'QSC', x: 78, y: 40, size: 13, ls: .9 },
  { text: model, x: 78, y: 168, size: 10, ls: .5 },
  { text: 'A    B    C    D', x: 234, y: 182, size: 8, ls: .5, anchor: 'middle' },
  { text: 'MASTER', x: 846, y: 152, size: 8, ls: .5, anchor: 'middle' },
] });

// Rear order is QSC's own: USB, four inputs, four link outputs, four speaker
// outputs, the bridged pair, then the locking IEC.
const pldRear = () => ({ auto: [
  { t: 'usbb', n: 1 },
  { t: 'xlrf', n: 4, lbl: 'IN' },
  { t: 'xlrm', n: 4, lbl: 'LINK OUT' },
  { t: 'nl4', n: 4, lbl: 'OUT' },
  { t: 'nl4', n: 2, lbl: 'BRIDGED' },
  { t: 'iec_in', n: 1 },
] });

// The legacy QSC two-channel amps — PLX, PLX2 and RMX. All long discontinued
// and all still everywhere in hire stock, which is why they are here.
//
// Front panels: QSC state the inventory (AC switch, two detented gain knobs,
// power / signal / clip LEDs, and on the HD models a protect LED) but publish no
// orthographic front view for any of them, so POSITIONS ARE INDICATIVE — same
// standard as the d&b and L-Acoustics fronts, and a step below the PLD, whose
// front comes from a numbered figure.
const qscLegacyFront = (ru, model, protect = false) => {
  const cy = ru * 50;
  const leds = [
    { t: 'led', x: 596, y: cy - 17 }, { t: 'led', x: 596, y: cy + 17 },
    { t: 'led', x: 626, y: cy - 17 }, { t: 'led', x: 626, y: cy + 17 },
  ];
  if (protect) {
    leds.push({ t: 'led', x: 656, y: cy - 17 }, { t: 'led', x: 656, y: cy + 17 });
  }
  return { elements: [
    { t: 'button', x: 122, y: cy, w: 30, h: 26 },              // AC switch
    { t: 'led', x: 180, y: cy },                               // power, green
    { t: 'mesh', x: 380, y: cy, w: 250, h: ru * 100 - 48 },    // intake grille
    ...leds,
    { t: 'knob', x: 782, y: cy, r: 27 },
    { t: 'knob', x: 868, y: cy, r: 27 },
  ], labels: [
    { text: 'QSC', x: 78, y: cy - 24, size: 13, ls: .9 },
    { text: model, x: 78, y: cy + 32, size: 10, ls: .5 },
    { text: 'SIG  CLIP', x: 611, y: cy + 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CH 1', x: 782, y: cy + 46, size: 8, ls: .5, anchor: 'middle' },
    { text: 'CH 2', x: 868, y: cy + 46, size: 8, ls: .5, anchor: 'middle' },
  ] };
};

// PLX and PLX2 take XLR and a parallel 1/4" TRS per channel; RMX adds a
// detachable barrier strip. Both ranges put out speakON plus touch-proof
// binding posts — the posts have no primitive and are not drawn, which is why
// the output count reads two rather than four.
const qscAmpRear = (barrier = false) => ({ auto: [
  { t: 'iec_in', n: 1 },
  ...(barrier ? [{ t: 'euroblock', n: 2, lbl: 'BARRIER' }] : []),
  { t: 'trs', n: 2, lbl: 'IN TRS' },
  { t: 'xlrf', n: 2, lbl: 'IN' },
  { t: 'nl4', n: 2, lbl: 'OUT' },
] });

export const QSC = [
  // -------------------------------------------------- L-Acoustics amps ---
  // RU heights, depths and weights were confirmed separately — L-Acoustics
  // render their spec tables client-side and their PDFs are vector art, so none
  // of it came from the product pages directly.
  //
  // --- QSC PLD ------------------------------------------------------------
  // The best-documented amplifiers in the library, and the only ones whose rear
  // panel ORDER is verified rather than schematic: QSC's user manual numbers the
  // rear callouts left to right, so the declaration below is the panel. Front
  // panel is likewise from the manual's own numbered front-panel figure — the
  // metering and mute/select cluster on the left, LCD centre, navigation and the
  // MASTER CONTROL knob on the right — not the family grammar the d&b and
  // L-Acoustics fronts fall back on.
  //
  // Note the four XLR-M line OUTPUTS: the PLD loops its inputs through, which
  // the retail listings all omit. Six NL4, not four — the last two are the
  // bridged pair.
  //
  // No `power`, for the same reason as every other amp here: QSC publish heat
  // loss (BTU/hr at idle, 1/8, 1/3 and full power), not mains draw. That is more
  // than d&b, L-Acoustics or Martin give, and wall draw is recoverable from it
  // as output + heat loss — but it is a calculation, not a published figure, so
  // it is not asserted. The "AC Current: 7.2 A" seen in the manual is a mocked-up
  // LCD screenshot, not a rating.
  { id: 'qsc-pld4-2', brand: 'QSC', model: 'PLD4.2', category: 'audio',
    ru: 2, depth: 305, weight: 8.4,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.2'), rear: pldRear() },

  { id: 'qsc-pld4-3', brand: 'QSC', model: 'PLD4.3', category: 'audio',
    ru: 2, depth: 406, weight: 9.5,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.3'), rear: pldRear() },

  { id: 'qsc-pld4-5', brand: 'QSC', model: 'PLD4.5', category: 'audio',
    ru: 2, depth: 406, weight: 10.0,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.5'), rear: pldRear() },

  // --- QSC PLX / PLX2 / RMX -------------------------------------------------
  // These are the ONLY amplifiers in the library with a real mains figure.
  // QSC publish AC line current at 1/8 power pink noise into 4 ohms, which is
  // their own stated stand-in for typical maximum level, and that is what
  // `power` carries here (amps x 120 V, the voltage the tables are quoted at).
  //
  // Two things to know before trusting it. The RMX sheet also gives a "severe,
  // 1/3 power" row that is 1.5-2x higher — size a breaker from that, not from
  // this. And the figures are not monotonic with output power: the PLX1602
  // draws 10 A while the bigger PLX2402 draws 8 A, because 2402 and up are
  // Class H. That is QSC's own data, not a transcription error.
  //
  // The mains INLET type is not stated on any of the three spec sheets. C14 is
  // assumed. Note the RMX5050 ships with a NEMA 5-20 plug, so a plain 10 A C14
  // is unlikely on that one — see TODO.

  { id: 'qsc-plx1202', brand: 'QSC', model: 'PLX1202', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 720,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX1202'), rear: qscAmpRear() },

  { id: 'qsc-plx1602', brand: 'QSC', model: 'PLX1602', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1200,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX1602'), rear: qscAmpRear() },

  { id: 'qsc-plx2402', brand: 'QSC', model: 'PLX2402', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 960,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX2402'), rear: qscAmpRear() },

  { id: 'qsc-plx3002', brand: 'QSC', model: 'PLX3002', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1200,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX3002'), rear: qscAmpRear() },

  { id: 'qsc-plx3402', brand: 'QSC', model: 'PLX3402', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1440,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX3402'), rear: qscAmpRear() },

  // PLX2. The "04" pair is the short, light chassis (227 mm, 5.9 kg); the "02"
  // models are 326 mm and 9.5 kg. Only the 02s reach 2 ohms and add binding
  // posts alongside the speakON.
  { id: 'qsc-plx1104', brand: 'QSC', model: 'PLX1104', category: 'audio',
    ru: 2, depth: 227, weight: 5.9, power: 960,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1104'), rear: qscAmpRear() },

  { id: 'qsc-plx1804', brand: 'QSC', model: 'PLX1804', category: 'audio',
    ru: 2, depth: 227, weight: 5.9, power: 1128,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1804'), rear: qscAmpRear() },

  { id: 'qsc-plx1802', brand: 'QSC', model: 'PLX1802', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1044,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1802'), rear: qscAmpRear() },

  { id: 'qsc-plx2502', brand: 'QSC', model: 'PLX2502', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 900,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX2502'), rear: qscAmpRear() },

  { id: 'qsc-plx3102', brand: 'QSC', model: 'PLX3102', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1140,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX3102'), rear: qscAmpRear() },

  { id: 'qsc-plx3602', brand: 'QSC', model: 'PLX3602', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1380,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX3602'), rear: qscAmpRear() },

  // RMX. Four 2U models and two 3U. Depth is the weak figure — QSC only say
  // "less than 16 inches", never a number, so 400 mm is a ceiling not a
  // measurement. The HD models add a protect LED per channel.
  { id: 'qsc-rmx850', brand: 'QSC', model: 'RMX850', category: 'audio',
    ru: 2, depth: 400, weight: 15.9, power: 540, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX850'), rear: qscAmpRear(true) },

  { id: 'qsc-rmx1450', brand: 'QSC', model: 'RMX1450', category: 'audio',
    ru: 2, depth: 400, weight: 18.2, power: 720, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX1450'), rear: qscAmpRear(true) },

  { id: 'qsc-rmx1850hd', brand: 'QSC', model: 'RMX1850HD', category: 'audio',
    ru: 2, depth: 400, weight: 20.2, power: 732, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX1850HD', true), rear: qscAmpRear(true) },

  { id: 'qsc-rmx2450', brand: 'QSC', model: 'RMX2450', category: 'audio',
    ru: 2, depth: 400, weight: 20.2, power: 756, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX2450'), rear: qscAmpRear(true) },

  { id: 'qsc-rmx4050hd', brand: 'QSC', model: 'RMX4050HD', category: 'audio',
    ru: 3, depth: 400, weight: 30.8, power: 1200, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(3, 'RMX4050HD', true), rear: qscAmpRear(true) },

  { id: 'qsc-rmx5050', brand: 'QSC', model: 'RMX5050', category: 'audio',
    ru: 3, depth: 400, weight: 33.1, power: 1668, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(3, 'RMX5050', true), rear: qscAmpRear(true) },
];
