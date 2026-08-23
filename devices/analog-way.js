// Analog Way — 4 devices (Midra 4K range)
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
// THE 440 mm BODY WIDTH IS CONFIRMED, and an earlier doubt here was wrong.
// Measuring the QSG photograph put the body between the ears at 2096 px =
// 454 mm, which this comment previously flagged as contradicting the recorded
// 440. It does not: the Eikos 4K, QuickMatriX 4K and QuickVu 4K datasheets all
// state 440 x 88 x 434 mm for the same Midra 4K chassis, so 440 is Analog
// Way's figure across the range and the photograph reading was the outlier —
// most likely because what I took for the ear outer edge was soft. Recorded
// because a retracted doubt is worth as much as a raised one.
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

  // ---------------------------------------------------------------------------
  // THE REST OF THE MIDRA 4K RANGE — and why these three are near-copies of the
  // Pulse 4K rather than sloppy duplicates.
  //
  // All four are ONE CHASSIS with different firmware. That is not inferred from
  // the family name; it is read off Analog Way's own Quick Start Guides, page 2
  // of each, in the same "FRONT & REAR PANELS DESCRIPTION" figure the Pulse 4K
  // was drawn from:
  //
  //   - identical I/O on every one: Inputs 1&2 (HDMI 1.4 + 3G-SDI, selectable),
  //     3&4 (12G-SDI), 5 (HDMI 2.0 + loop), 6&7 (HDMI 2.0), 8 (HDMI 2.0 +
  //     loop), 9&10 (DisplayPort 1.2), Outputs 1&2 (HDMI 2.0 + 12G-SDI
  //     simultaneously), multiviewer, genlock loop, control Ethernet, and the
  //     same optional Analog & Dante audio card;
  //   - identical fascia: On/Off, Monitor, USB, 480x272 LCD, menu knob,
  //     Exit/Menu, Enter, Screen 1 / Master / Aux / Screen 2 / Select /
  //     Shortcuts / TAKE;
  //   - identical 440 x 88 x 434 mm and "max consumption: 80W".
  //
  // So the front geometry below is the Pulse 4K's, RE-MEASURED FROM SOURCE in
  // v1.10.8 — reused because the QSGs show the same fascia, not because they
  // are siblings. Only the model lettering differs.
  //
  // POWER IS THE ONE CONFLICT. Every QSG says "max consumption: 80W" verbatim,
  // which is suspicious across four models and may be boilerplate; a research
  // pass reported 95 W from the datasheets for these three. 80 W is recorded
  // because it is the figure actually read here, but it may UNDER-state the
  // ceiling, which is the dangerous direction. TODO §8g.

  // Eikos 4K — 4K60 multi-layer mixer, ref. EKS-4K.
  { id: 'analogway-eikos-4k', brand: 'Analog Way', model: 'Eikos 4K',
    category: 'video', ru: 2, depth: 434, weight: 7.6, powerMax: 80,
    src: 'https://www.analogway.com/products/eikos-4k',
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
      { text: 'Eikos 4K', x: 266.3, y: 181, size: 12, ls: 1 },
      { text: 'SCREEN 1', x: 441.4, y: 46.9, size: 9, ls: .7 },
      { text: 'MASTER', x: 441.4, y: 90, size: 9, ls: .5 },
      { text: 'AUX', x: 518.6, y: 90, size: 9, ls: .5 },
      { text: 'SCREEN 2', x: 441.4, y: 133.6, size: 9, ls: .7 },
      { text: 'SELECT', x: 658.3, y: 46.9, size: 9, ls: .5 },
      { text: 'SHORTCUTS', x: 806, y: 133.6, size: 9, ls: .5 },
      { text: 'EKS-4K', x: 903.9, y: 179.6, size: 8, ls: .5 },
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

  // QuickMatriX 4K — matrix-mode switcher, ref. QMX-4K.
  { id: 'analogway-quickmatrix-4k', brand: 'Analog Way', model: 'QuickMatriX 4K',
    category: 'video', ru: 2, depth: 434, weight: 7.6, powerMax: 80,
    src: 'https://www.analogway.com/products/quickmatrix-4k',
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
      { text: 'QuickMatriX 4K', x: 266.3, y: 181, size: 12, ls: 1 },
      { text: 'SCREEN 1', x: 441.4, y: 46.9, size: 9, ls: .7 },
      { text: 'MASTER', x: 441.4, y: 90, size: 9, ls: .5 },
      { text: 'AUX', x: 518.6, y: 90, size: 9, ls: .5 },
      { text: 'SCREEN 2', x: 441.4, y: 133.6, size: 9, ls: .7 },
      { text: 'SELECT', x: 658.3, y: 46.9, size: 9, ls: .5 },
      { text: 'SHORTCUTS', x: 806, y: 133.6, size: 9, ls: .5 },
      { text: 'QMX-4K', x: 903.9, y: 179.6, size: 8, ls: .5 },
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

  // QuickVu 4K — 1 PGM + 1 AUX switcher, ref. QVU-4K.
  { id: 'analogway-quickvu-4k', brand: 'Analog Way', model: 'QuickVu 4K',
    category: 'video', ru: 2, depth: 434, weight: 7.6, powerMax: 80,
    src: 'https://www.analogway.com/products/quickvu-4k',
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
      { text: 'QuickVu 4K', x: 266.3, y: 181, size: 12, ls: 1 },
      { text: 'SCREEN 1', x: 441.4, y: 46.9, size: 9, ls: .7 },
      { text: 'MASTER', x: 441.4, y: 90, size: 9, ls: .5 },
      { text: 'AUX', x: 518.6, y: 90, size: 9, ls: .5 },
      { text: 'SCREEN 2', x: 441.4, y: 133.6, size: 9, ls: .7 },
      { text: 'SELECT', x: 658.3, y: 46.9, size: 9, ls: .5 },
      { text: 'SHORTCUTS', x: 806, y: 133.6, size: 9, ls: .5 },
      { text: 'QVU-4K', x: 903.9, y: 179.6, size: 8, ls: .5 },
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

  // ---------------------------------------------------------------------------
  // Ascender 48 (ref. ASC4806) — a much larger, older LiveCore switcher, not
  // part of the Midra 4K family above. 12 seamless inputs, 4 outputs, 3U.
  //
  // PROVENANCE. Read directly off Analog Way's own Quick Start Guide
  // (ascender48-quickt-start-guide.pdf, "FRONT & REAR PANELS DESCRIPTION",
  // page 2) — two full-resolution photographs with every socket
  // silkscreened, extracted via pdfimages rather than OCR. No Cloudflare/JS
  // gating anywhere in this pass: dwn01.analogway.com is a plain asset host.
  // Dimensions/weight/power are from the current datasheet
  // (ASC4806-UK-12/03/2015), found by grepping analogway.com's product page
  // HTML for .pdf hrefs after the old datasheet URL 404'd — same "current
  // URL, not the one that used to work" problem the Behringer pass hit.
  //
  // TWO NEW PRIMITIVES, because this device needed them and using the
  // existing `dsub` (DB25) for either would have been a lookalike — see
  // panel.js. `hd15` is the VGA/E-shell (30.9 x 16.3 mm, sourced off an
  // Amphenol DB9 datasheet — DB9 and HD15 share the E shell). `dvi` covers
  // both DVI-I and DVI-D with one shape (36.8 x 17.8 mm, Omron XM4M) — the
  // pins that make an -I an -I sit inside the shell and don't change the
  // panel footprint, the same reasoning `jack` already uses for TRS vs TS.
  // This also retroactively unblocks the Pulse² family noted above, though
  // they are not added here — that note was about discontinued product,
  // this device is not.
  //
  // RU: Analog Way state 177 mm, which is 3.98 U — near enough to 4 U (as
  // the Encore3's 3.95 U was) that `ru: 4` is used rather than a fractional
  // figure that would model essentially zero real rack space.
  //
  // POWER: 285 W, unlabelled — "Power Supply: 100-240 VAC; 4.8A; 50/60Hz;
  // 285W" with no idle/typical split, so `powerMax`, not `power`, the same
  // call as every other unlabelled single figure in this library (PDS-4K,
  // Encore3, Pulse 4K's "max consumption").
  //
  // WIDTH: 444.8 mm is the bare chassis without rack ears — standard for a
  // 19" unit, so no `widthMM`, the same convention the Barco entries use.
  //
  // INPUT NUMBERING. Analog Way's marketing "12 seamless inputs / 42 input
  // plugs" figure is a SIGNAL count (an HD15 socket's analog pins counted as
  // a second logical plug on top of the physical DVI-I shell it shares),
  // not a connector-shell count — the panel photo shows 6 physical
  // Universal-Analog shells, not 12. The list below is the physical,
  // cable-relevant one. Each of the 12 numbered SDI inputs sits beside its
  // own alternate-format plug(s), read left to right off the photo: inputs
  // 1/3/5/7/9/11 each carry Analog + DVI-I + HDMI beside their SDI; inputs
  // 2/6/10 carry a Dual DVI-D beside theirs; inputs 4/8/12 carry a
  // DisplayPort beside theirs. The panel's own silkscreen reads "DUAL DVI-D"
  // on those three modules specifically — kept verbatim rather than folded
  // into the datasheet's generic "DVI-I" for all nine, since DVI-D and DVI-I
  // are physically different connectors and the photo is the more specific
  // source for that one socket.
  //
  // NOT MODELLED AS TRUE. `dcjack` on the chassis GROUND point is the
  // closest shape in this vocabulary, not a claim that a DC barrel jack is
  // there — it is a captive ground lug. The AC inlet has a green
  // locking-lever accessory moulded around a standard shell in the photo;
  // no locking-IEC series is named anywhere, so it is drawn as plain
  // `iec_in`. The three LINK connectors are Analog Way's proprietary
  // LiveCore™ Link Cable interconnect (OPT-LINK / OPT-KIT3xLINK in the
  // options list) — mapped to `qsfp` only as the closest-shaped multi-pin
  // cage in this vocabulary, not a literal claim of QSFP. `euroblock` x 9 on
  // TALLY/GPI-O draws nine 3-pin blocks at the one continuous terminal
  // strip's position — this library has no single-strip N-pole terminal
  // primitive, so nine is the closest honest approximation of the pole
  // count; the exact per-pin silkscreen could not be read at the source
  // image's resolution. See TODO §9b for both.
  //
  // FRONT PANEL — inventory confirmed from the same photograph, but ONLY
  // the front's one real connector (USB) is placed at a real position;
  // every button/display/encoder position below is a SCHEMATIC GRID, not
  // measured off the photograph the way the Pulse 4K's front was — this
  // pass captured which controls exist and what they are labelled, not
  // their pixel coordinates. That is the same standing the Spectera Base
  // Station's front has: confirmed inventory, unconfirmed layout. A future
  // pass with the source image can replace this with real positions.
  { id: 'analogway-ascender-48', brand: 'Analog Way', model: 'Ascender 48',
    category: 'video', ru: 4, depth: 544, weight: 19, powerMax: 285,
    approx: true,
    src: 'https://www.analogway.com/products/ascender-48',
    front: { elements: [
      { t: 'display', x: 180, y: 50, w: 220, h: 90 },
      { t: 'button', x: 490, y: 50, n: 4, gap: 40, w: 30, h: 24 },
      { t: 'encoder', x: 150, y: 140, r: 30, lbl: 'PUSH → FINE-TUNING' },
      { t: 'button', x: 260, y: 140, n: 2, gap: 40, w: 30, h: 24,
        lbl: ['EXIT/MENU', 'ENTER'] },
      { t: 'button', x: 326, y: 200, n: 4, gap: 36, w: 30, h: 22,
        lbl: ['#1', '#2', '#3', '#4'] },
      { t: 'button', x: 540, y: 200, n: 2, gap: 40, w: 34, h: 22,
        lbl: ['PREVIEW', 'PROGRAM'] },
      { t: 'button', x: 695, y: 200, n: 6, gap: 34, w: 28, h: 22,
        lbl: ['A', 'B', 'C', 'D', 'E', 'F'] },
      { t: 'button', x: 410, y: 250, n: 3, gap: 90, w: 80, h: 22,
        lbl: ['NATIVE BKG', 'CLEAR', 'ASPECT IMAGE LAYER'] },
      { t: 'button', x: 329, y: 310, n: 10, gap: 38, w: 30, h: 22,
        lbl: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      { t: 'button', x: 170, y: 360, n: 5, gap: 40, w: 34, h: 22,
        lbl: ['11', '12', 'COLOR', 'FRAME LOGO', 'FREEZE'] },
      { t: 'button', x: 460, y: 360, n: 2, gap: 40, w: 34, h: 22,
        lbl: ['LOAD', 'SAVE'] },
      { t: 'button', x: 600, y: 360, n: 2, gap: 40, w: 34, h: 22,
        lbl: ['STEP BACK', 'TAKE'] },
      { t: 'button', x: 720, y: 360, w: 30, h: 22 },
      { t: 'usba', x: 800, y: 360, lbl: 'USB' },
    ], labels: [
      { text: 'Ascender 48', x: 90, y: 393, size: 10, ls: 1 },
    ] },
    // HAND-PLACED, NOT `auto` — the rear carries ~60 sockets, and `auto`'s
    // row wrapping is hard-capped at exactly `ru` rows (panel.js autoLayout:
    // `rows.length < ru - 1`); once that cap is hit everything left over is
    // dumped into the last row with no further check that it fits. The
    // first version of this entry used `auto` and passed check.mjs clean —
    // check.mjs only proves elements sit inside the panel, never that they
    // clear each other — while the actual render had the last row's ~40
    // sockets stacked on top of one another. Caught only by rendering the
    // face and measuring it, exactly the trap the README warns about.
    //
    // The fix is more (shorter) rows than `auto` would ever produce: every
    // socket here is well under half a U tall, so seven rows of ~20-30 mm
    // pitch fit comfortably in the 4 U this device actually has, where
    // `auto` insisted on exactly four ~44 mm bands and ran out on the
    // fourth. Positions are a computed sequential layout (each item's real
    // mm width, converted to panel units, plus a small fixed gap) — not
    // measured off a photograph, since the QSG's panel photo was used for
    // inventory and left-to-right order, not for pixel coordinates.
    rear: { elements: [
      // Input 1 — full quad: Universal Analog, DVI-I, HDMI, SDI
      { t: 'hd15', x: 122, y: 37, lbl: 'IN #1 ANALOG' },
      { t: 'dvi', x: 199, y: 37, lbl: 'IN #1 DVI-I' },
      { t: 'hdmi', x: 266, y: 37, lbl: 'IN #1 HDMI' },
      { t: 'bnc', x: 312, y: 37, lbl: 'IN #1 SDI' },
      // Input 2 — Dual DVI-D + SDI
      { t: 'dvi', x: 374, y: 37, lbl: 'IN #2 DUAL DVI-D' },
      { t: 'bnc', x: 435, y: 37, lbl: 'IN #2 SDI' },
      // Input 3 — full quad
      { t: 'hd15', x: 492, y: 37, lbl: 'IN #3 ANALOG' },
      { t: 'dvi', x: 569, y: 37, lbl: 'IN #3 DVI-I' },
      { t: 'hdmi', x: 635, y: 37, lbl: 'IN #3 HDMI' },
      { t: 'bnc', x: 682, y: 37, lbl: 'IN #3 SDI' },
      // Input 4 — DisplayPort + SDI
      { t: 'displayport', x: 731, y: 37, lbl: 'IN #4 DP' },
      { t: 'bnc', x: 780, y: 37, lbl: 'IN #4 SDI' },
      // Input 5 — full quad
      { t: 'hd15', x: 122, y: 95, lbl: 'IN #5 ANALOG' },
      { t: 'dvi', x: 199, y: 95, lbl: 'IN #5 DVI-I' },
      { t: 'hdmi', x: 266, y: 95, lbl: 'IN #5 HDMI' },
      { t: 'bnc', x: 312, y: 95, lbl: 'IN #5 SDI' },
      // Input 6 — Dual DVI-D + SDI
      { t: 'dvi', x: 374, y: 95, lbl: 'IN #6 DUAL DVI-D' },
      { t: 'bnc', x: 435, y: 95, lbl: 'IN #6 SDI' },
      // Input 7 — full quad
      { t: 'hd15', x: 492, y: 95, lbl: 'IN #7 ANALOG' },
      { t: 'dvi', x: 569, y: 95, lbl: 'IN #7 DVI-I' },
      { t: 'hdmi', x: 635, y: 95, lbl: 'IN #7 HDMI' },
      { t: 'bnc', x: 682, y: 95, lbl: 'IN #7 SDI' },
      // Input 8 — DisplayPort + SDI
      { t: 'displayport', x: 731, y: 95, lbl: 'IN #8 DP' },
      { t: 'bnc', x: 780, y: 95, lbl: 'IN #8 SDI' },
      // Input 9 — full quad
      { t: 'hd15', x: 122, y: 153, lbl: 'IN #9 ANALOG' },
      { t: 'dvi', x: 199, y: 153, lbl: 'IN #9 DVI-I' },
      { t: 'hdmi', x: 266, y: 153, lbl: 'IN #9 HDMI' },
      { t: 'bnc', x: 312, y: 153, lbl: 'IN #9 SDI' },
      // Input 10 — Dual DVI-D + SDI
      { t: 'dvi', x: 374, y: 153, lbl: 'IN #10 DUAL DVI-D' },
      { t: 'bnc', x: 435, y: 153, lbl: 'IN #10 SDI' },
      // Input 11 — full quad
      { t: 'hd15', x: 492, y: 153, lbl: 'IN #11 ANALOG' },
      { t: 'dvi', x: 569, y: 153, lbl: 'IN #11 DVI-I' },
      { t: 'hdmi', x: 635, y: 153, lbl: 'IN #11 HDMI' },
      { t: 'bnc', x: 682, y: 153, lbl: 'IN #11 SDI' },
      // Input 12 — DisplayPort + SDI
      { t: 'displayport', x: 731, y: 153, lbl: 'IN #12 DP' },
      { t: 'bnc', x: 780, y: 153, lbl: 'IN #12 SDI' },
      // Output 1 — Analog, SDI, Dual DVI-I, Optical SDI
      { t: 'hd15', x: 122, y: 207, lbl: 'OUT #1 ANALOG' },
      { t: 'bnc', x: 178, y: 207, lbl: 'OUT #1 SDI' },
      { t: 'dvi', x: 240, y: 207, lbl: 'OUT #1 DUAL DVI-I' },
      { t: 'sfp', x: 306, y: 207, lbl: 'OUT #1 OPTICAL SDI' },
      // Output 2 — Analog, DVI-I only
      { t: 'hd15', x: 366, y: 207, lbl: 'OUT #2 ANALOG' },
      { t: 'dvi', x: 443, y: 207, lbl: 'OUT #2 DVI-I' },
      // Output 3 — Analog, SDI, Dual DVI-I, Optical SDI
      { t: 'hd15', x: 520, y: 207, lbl: 'OUT #3 ANALOG' },
      { t: 'bnc', x: 577, y: 207, lbl: 'OUT #3 SDI' },
      { t: 'dvi', x: 638, y: 207, lbl: 'OUT #3 DUAL DVI-I' },
      { t: 'sfp', x: 704, y: 207, lbl: 'OUT #3 OPTICAL SDI' },
      // Output 4 — Analog, DVI-I only
      { t: 'hd15', x: 765, y: 207, lbl: 'OUT #4 ANALOG' },
      { t: 'dvi', x: 842, y: 207, lbl: 'OUT #4 DVI-I' },
      // Monitoring/preview — a fifth, separate Dual DVI-I output — plus the
      // analog monitor out (component/composite/S-Video on 4 BNC)
      { t: 'dvi', x: 127, y: 263, lbl: 'MONITORING DUAL DVI-I' },
      { t: 'bnc', x: 189, y: 263, lbl: 'R/Pr / LUMA' },
      { t: 'bnc', x: 230, y: 263, lbl: 'G/Y / CVBS' },
      { t: 'bnc', x: 271, y: 263, lbl: 'B/Pb / CHROMA' },
      { t: 'bnc', x: 312, y: 263, lbl: 'S' },
      { t: 'iec_in', x: 364, y: 263, lbl: 'MAINS IN' },
      { t: 'fan', x: 418, y: 263, r: 18 },
      { t: 'dcjack', x: 455, y: 263, lbl: 'GROUND' },
      { t: 'usba', x: 490, y: 263, n: 4, gap: 39, lbl: 'USB' },
      // Chassis I/O — sync, frame lock, GPI, service ports, network, links
      { t: 'rj45', x: 106, y: 316, n: 2, gap: 39, lbl: ['DEVICES SYNC IN', 'DEVICES SYNC OUT'] },
      { t: 'bnc', x: 185, y: 316, n: 2, gap: 41, lbl: ['FRAME LOCK IN', 'FRAME LOCK OUT'] },
      { t: 'euroblock', x: 267, y: 316, n: 9, gap: 41, lbl: 'TALLY/GPI-O' },
      { t: 'dsub', x: 674, y: 316, lbl: 'MAINTENANCE' },
      { t: 'dsub', x: 794, y: 316, lbl: 'DISPLAY' },
      { t: 'rj45', x: 106, y: 363, lbl: 'ETHERNET' },
      { t: 'qsfp', x: 152, y: 363, n: 3, gap: 54, lbl: ['LINK 1', 'LINK 2', 'LINK 3'] },
    ] } },
];
