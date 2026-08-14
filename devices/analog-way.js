// Analog Way — 1 device
//
// PROVENANCE, because this is the first entry gathered by the Haiku research
// pass rather than by hand. The figures below — RU, dimensions, weight, the
// 80 W maximum, the C14 inlet — come from that pass and have NOT been
// independently re-checked, by explicit instruction. They are due a manual
// check.
//
// The DRAWING is not from the research pass. Both faces are hand-placed from
// Analog Way's own Quick Start Guide for the Pulse 4K (ref. PLS-4K), page 2,
// "FRONT & REAR PANELS DESCRIPTION" — a straight-on photograph of each face
// with every connector called out and the silkscreen legible. That is the
// standard the rest of this library is held to, and it is what the socket
// names below are read off.
//
// Only the Pulse 4K is here. Pulse², Pulse²-3G and Pulse²-H are all
// discontinued, and this library does not carry discontinued lines — see the
// Martin Audio note in TODO §7. They also need connector primitives that do
// not exist yet (HD15, DVI-D, DVI-I, and Analog Way's 5-pin MCO audio
// connector), so they are a separate job rather than four more entries.

export const ANALOG_WAY = [
  // 2U 4K60 multi-layer mixer / seamless presentation switcher.
  // 440 x 88 x 434 mm body, 7.6 kg. Ships with a rack mount kit stowed in the
  // packaging foam, so it racks properly rather than sitting on a shelf.
  //
  // POWER: `power` is deliberately absent. Analog Way publish one figure and
  // label it "max consumption: 80W" — printed on the rear panel beside the
  // inlet in their own QSG — so it is a powerMax and nothing else. There is no
  // published idle or typical draw, so this unit counts toward the summary's
  // `+` tally rather than pretending 80 W is what it sits at.
  //
  // THE AUDIO CARD IS OPTIONAL AND IS DRAWN AS FITTED. The LINE IN / LINE OUT
  // minijacks and the two Dante RJ45s are the "Analog & Dante audio card
  // (optional)" — Analog Way's own words. The unit they photographed has it
  // in, so the panel drawing has it in. A base unit without the card has a
  // blanked aperture there and four fewer sockets. This is a candidate for the
  // option-card slot mechanism; it is not modelled as one because the aperture
  // has never been measured and a slot at an invented size is exactly what
  // this library refuses to do.
  //
  // SOCKET NAMES are the panel silkscreen verbatim, with one departure: the
  // panel marks both an input's BNC and its HDMI `IN #1`, because they are one
  // selectable input with two plugs. Two sockets on a device may not share a
  // label, so those read `IN #1 SDI` / `IN #1 HDMI`. The `2K` / `4K` marks
  // beside each are Analog Way's own and are kept.
  //
  // The rear is `auto` rather than hand-placed on purpose. The QSG photograph
  // is slightly perspective — you can see the top surface of the case — so
  // pixel-measuring x positions off it would produce coordinates less accurate
  // than the layout engine's own. What the photo DOES settle is the left-to-
  // right ORDER, and for an auto rear the declaration order is the panel
  // order, so that is what it buys.
  { id: 'analogway-pulse-4k', brand: 'Analog Way', model: 'Pulse 4K',
    category: 'video', ru: 2, depth: 434, weight: 7.6, powerMax: 80,
    src: 'https://www.analogway.com/products/pulse-4k',
    front: { elements: [
      // left cluster — standby, monitor select, USB host
      { t: 'button', x: 141, y: 92, w: 24, h: 24 },
      { t: 'button', x: 141, y: 130, w: 26, h: 18 },
      { t: 'usba', x: 141, y: 166, lbl: 'USB' },
      // 480 x 272 colour LCD
      { t: 'display', x: 264, y: 120, w: 184, h: 104 },
      // menu scroll knob, with Exit/Menu and Enter below it
      { t: 'knob', x: 395, y: 112, r: 30 },
      { t: 'button', x: 375, y: 172, w: 30, h: 18 },
      { t: 'button', x: 413, y: 172, w: 30, h: 18 },
      // SCREEN 1 — BKG Set, Layer 1, Layer 2, Image, Load Preset
      { t: 'button', x: 468, y: 82, n: 5, gap: 33, w: 28, h: 20 },
      // MASTER (PGM PRW, Load Preset) then AUX (Input, Screen PGM, Load Preset)
      { t: 'button', x: 468, y: 120, n: 5, gap: 33, w: 28, h: 20 },
      // SCREEN 2 — same five as SCREEN 1
      { t: 'button', x: 468, y: 158, n: 5, gap: 33, w: 28, h: 20 },
      // SELECT keypad, 1-5 over 6-10
      { t: 'button', x: 652, y: 82, n: 5, gap: 33, w: 28, h: 20 },
      { t: 'button', x: 652, y: 120, n: 5, gap: 33, w: 28, h: 20 },
      // SHORTCUTS — Clear, Freeze, Quick Preset, right-aligned under the keypad
      { t: 'button', x: 784, y: 158, n: 3, gap: 33, w: 28, h: 20 },
      // TAKE, sitting directly above Quick Preset
      { t: 'button', x: 850, y: 82, w: 32, h: 20 },
      { t: 'vent', x: 600, y: 38, w: 560, h: 16, pitch: 22 },
    ], labels: [
      { text: 'ANALOG WAY', x: 150, y: 42, size: 11, ls: .8 },
      { text: 'Pulse 4K', x: 300, y: 188, size: 9, ls: .3 },
      { text: 'SCREEN 1', x: 448, y: 64, size: 6, ls: .4 },
      { text: 'MASTER', x: 448, y: 102, size: 6, ls: .4 },
      { text: 'SCREEN 2', x: 448, y: 140, size: 6, ls: .4 },
      { text: 'SELECT', x: 632, y: 64, size: 6, ls: .4 },
      { text: 'SHORTCUTS', x: 758, y: 140, size: 6, ls: .4 },
      { text: 'PLS-4K', x: 880, y: 188, size: 7, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1, lbl: 'MAINS IN' },
      // Inputs 1 & 2 — HDMI 1.4 and 3G-SDI (2K), selectable active plug
      { t: 'bnc', n: 2, lbl: ['IN #1 SDI 2K', 'IN #2 SDI 2K'] },
      { t: 'hdmi', n: 2, lbl: ['IN #1 HDMI 2K', 'IN #2 HDMI 2K'] },
      // Inputs 3 & 4 — 12G-SDI
      { t: 'bnc', n: 2, lbl: ['IN #3 4K', 'IN #4 4K'] },
      // Input 5 — HDMI 2.0 with loop
      { t: 'hdmi', n: 2, lbl: ['IN #5 4K', 'IN #5 LOOP'] },
      // the optional Analog & Dante audio card — see the note above
      { t: 'minijack', n: 2, lbl: ['LINE IN #1', 'LINE IN #2'] },
      { t: 'minijack', n: 2, lbl: ['LINE OUT #1', 'LINE OUT #2'] },
      { t: 'rj45', n: 2, lbl: ['DANTE PRIMARY', 'DANTE SECONDARY'] },
      // Inputs 6 & 7 — HDMI 2.0
      { t: 'hdmi', n: 2, lbl: ['IN #6 4K', 'IN #7 4K'] },
      // Input 8 — HDMI 2.0 with loop
      { t: 'hdmi', n: 2, lbl: ['IN #8 4K', 'IN #8 LOOP'] },
      // Inputs 9 & 10 — DisplayPort 1.2
      { t: 'displayport', n: 2, lbl: ['IN #9 4K', 'IN #10 4K'] },
      // Outputs 1 and 2 — HDMI 2.0 and 12G-SDI, usable at the same time
      { t: 'hdmi', n: 2, lbl: ['OUT #1 HDMI', 'OUT #2 HDMI'] },
      { t: 'bnc', n: 2, lbl: ['OUT #1 SDI', 'OUT #2 SDI'] },
      // Multiviewer out — HDMI 1.4 and 3G-SDI, usable at the same time
      { t: 'hdmi', n: 1, lbl: 'MVW HDMI' },
      { t: 'bnc', n: 1, lbl: 'MVW SDI' },
      // Genlock loop-through (tri-level or black burst) or sync generator
      { t: 'bnc', n: 2, lbl: ['GENLOCK', 'GENLOCK LOOP'] },
      // Neutrik etherCON, for the Web RCS or the API
      { t: 'ethercon', n: 1, lbl: 'CONTROL' },
    ] } },
];
