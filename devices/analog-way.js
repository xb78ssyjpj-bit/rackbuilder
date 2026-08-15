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
// THE FRONT WAS RE-MEASURED IN v1.10.8. The v1.10.5 originals mapped the
// photograph onto x 62..938, which are EAR_L/EAR_R — the *inner* edges of the
// rack ears — and so drew the face about 12% too narrow. The panel's full
// 482.6 mm is 0..1000, because MM = W / 482.6.
//
// The QSG image is 2443 px wide at 300 dpi and shows the unit with its rack
// ears fitted, so the ear-to-ear span is directly measurable: the outermost
// ink runs x 117..2344 over every row the ears occupy (y 220..500), a span of
// 2227 px, and that span is a 19" panel by definition — an ear that did not
// reach 482.6 mm would not bolt to a rack. The face runs y 113..534 (422 px),
// which at the same scale is 91.4 mm. So x = (px - 117) * 1000/2227 and
// y = (px - 113) * 200/422. The rear is `auto` and carries no coordinates,
// so it was never affected.
//
// The photograph has almost no horizontal keystone to correct for: the face
// measures 2227 px wide at y 220 and 2226 px at y 500, drifting 2-3 px right
// down the face, which is a fraction of a degree of roll rather than
// perspective. The vertical IS foreshortened — the top surface of the case is
// visible — which is why the rear was left `auto` and why only the front's
// left-to-right order was ever taken from it.
//
// ONE FIGURE THE RE-MEASURE PUTS IN DOUBT: at 2227 px = 482.6 mm the chassis
// body between the ears measures 2096 px = 454 mm, against the 440 mm recorded
// above from the research pass. A photograph is not a specification, but 440
// is one of the numbers §8c already says is owed a manual check.
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
      { t: 'button', x: 90.7, y: 61.6, w: 23.3, h: 23.7 },
      { t: 'button', x: 90.7, y: 118, w: 23.3, h: 21.8 },
      { t: 'usba', x: 90.7, y: 162.6, lbl: 'USB' },
      // 480 x 272 colour LCD — the glass measures 447 x 254 px, which is 16:9
      { t: 'display', x: 228.3, y: 99.8, w: 200.7, h: 120.4 },
      // menu scroll knob, with Exit/Menu and Enter below it
      { t: 'knob', x: 392, y: 87.7, r: 44.9 },
      { t: 'button', x: 367.8, y: 145.3, w: 29.6, h: 30.3 },
      { t: 'button', x: 405.9, y: 145.3, w: 29.6, h: 30.3 },
      // SCREEN 1 — BKG Set, Layer 1, Layer 2, Image, Load Preset
      { t: 'button', x: 467.9, y: 65.4, n: 5, gap: 37.7, w: 29.6, h: 31.3 },
      // MASTER (PGM PRW, Load Preset) then AUX (Input, Screen PGM, Load Preset)
      { t: 'button', x: 467.9, y: 108.5, n: 5, gap: 37.7, w: 29.6, h: 31.3 },
      // SCREEN 2 — same five as SCREEN 1
      { t: 'button', x: 467.9, y: 152.1, n: 5, gap: 37.7, w: 29.6, h: 31.3 },
      // SELECT keypad, 1-5 over 6-10
      { t: 'button', x: 680.5, y: 65.2, n: 5, gap: 37.4, w: 29.6, h: 31.3 },
      { t: 'button', x: 680.5, y: 108.3, n: 5, gap: 37.4, w: 29.6, h: 31.3 },
      // SHORTCUTS — Clear, Freeze, Quick Preset, right-aligned under the keypad
      { t: 'button', x: 830, y: 150.5, n: 3, gap: 37, w: 29.6, h: 31.3 },
      // TAKE, sitting directly above Quick Preset
      { t: 'button', x: 904.4, y: 64.2, w: 29.6, h: 31.3 },
      // Ventilation. These are eleven long horizontal slots on a 135 px pitch,
      // not the fine vertical louvre `vent` draws, so they are eleven `bar`
      // rounded rectangles at the measured pitch — the shape the panel has.
      // TOP BAND ONLY: the face carries three bands of these. See TODO §8e.
      { t: 'bar', x: 301.3, y: 20.9, n: 11, gap: 60.7, w: 53.9, h: 8.5, rx: 4 },
    ], labels: [
      { text: 'ANALOG WAY', x: 149.5, y: 31.3, size: 15, ls: 1.5 },
      { text: 'Pulse 4K', x: 266.3, y: 181, size: 12, ls: 1 },
      { text: 'SCREEN 1', x: 441.4, y: 46.9, size: 9, ls: .7 },
      { text: 'MASTER', x: 441.4, y: 90, size: 9, ls: .5 },
      { text: 'AUX', x: 518.6, y: 90, size: 9, ls: .5 },
      { text: 'SCREEN 2', x: 441.4, y: 133.6, size: 9, ls: .7 },
      { text: 'SELECT', x: 658.3, y: 46.9, size: 9, ls: .5 },
      { text: 'SHORTCUTS', x: 806, y: 133.6, size: 9, ls: .5 },
      { text: 'PLS-4K', x: 903.9, y: 179.6, size: 8, ls: .5 },
      { text: 'MONITOR', x: 73.2, y: 101.9, size: 8, ls: .5 },
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
      { t: 'rj45', n: 2, sig: 'dante', lbl: ['DANTE PRIMARY', 'DANTE SECONDARY'] },
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
