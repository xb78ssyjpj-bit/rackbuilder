// Barco — 2 devices
//
// PROVENANCE. Second entry from the Haiku subagent research pass. The figures
// — 484.1 x 66.2 x 409 mm, 6.21 kg, 151 W — come from that pass and have NOT
// been independently re-checked, by instruction. They are due a manual check.
// They do at least come from Barco's own spec sheet on assets.barco.com rather
// than a reseller, which the Pulse 4K's did not.
//
// The DRAWING is from Barco's PDS-4K user guide R5912621, section 4.1/4.2,
// Image 4-1 (front) and Image 4-2 (rear, "Model 1: HDMI only"). Those are
// TRUE ORTHOGRAPHIC LINE DRAWINGS, not photographs — which is why this rear is
// hand-placed at measured positions where the Analog Way Pulse 4K's is `auto`.
// A line drawing has no perspective to introduce error, so measuring x
// positions off it is honest.
//
// EVERY COORDINATE BELOW WAS RE-MEASURED IN v1.10.8. The v1.10.6 originals
// mapped the drawing onto x 62..938, which are EAR_L/EAR_R — the *inner* edges
// of the rack ears — and so drew the whole panel about 12% too narrow. The
// panel's full 482.6 mm is 0..1000, because MM = W / 482.6.
//
// The reference is the figure's own ink, not a guess:
//   - Both figures place the outermost ink — the rack-ear slots — at a span of
//     exactly 920 px (front 13..932, rear 18..937). Barco's own specification
//     says "Width: 19.06" (484.1mm) – Rack ear to Rack Ear", so that 920 px is
//     484.1 mm and x maps (px - edge) * 1000 / 920.
//   - The chassis body inside those slots is 908 px in both figures, i.e.
//     477.8 mm. This unit has almost no ear inset; it is very nearly a
//     full-width panel.
//   - y: the front bezel spans rows 84..209 (125 px) and the rear plate rows
//     82..211 (129 px), which at that scale are 65.8 mm and 67.9 mm against
//     Barco's stated 66.2 mm. Each face's own band maps onto the 150-unit box.
// The independent check is the mains inlet: the C14 aperture measures 51 px,
// which at 920 px = 484.1 mm is 26.8 mm against the IEC C14's real 27 mm.
//
// CONSEQUENCE WORTH KNOWING: measured properly, `MVR`, the TAKE button and the
// rear mains lettering all sit outside x 62..938. That is not an error — this
// app draws a 29.9 mm rack ear where a real 19" ear is 15.9 mm, so an
// edge-to-edge panel like this one overruns it. See TODO §8e.
//
// THE HEIGHT IS THE INTERESTING PART. Barco give 6.62 cm, which is 1.49 rack
// units, and this entry carries `ru: 1.5`. It is the first fractional-RU
// device in the library. See TODO §8d — the occupancy maths handles it (a 1.5U
// unit at U1 spans [1, 2.5) so U2 is correctly blocked), but the summary's
// "U used" totals the true panel height rather than the 2U of rack the unit
// actually costs you unless you deliberately pair two of them.
//
// MODEL 1 ONLY. Barco ship two: Model 1 (HDMI only) and Model 2 / PDS-4K SDI
// (HDMI and SDI). On Model 1 the IN 7, IN 8 and the four PGM SDI positions are
// BLANKED HOLES, which the line drawing shows clearly — they are not fitted
// connectors, so they are not drawn. Model 2 adds six 12G-SDI BNCs in those
// holes; its drawing is Image 4-3 in the same guide and it is a short job.

export const BARCO = [
  // 1.5U 4K presentation switcher, Event Master range.
  // 484.1 x 66.2 x 409 mm over the ears, 6.21 kg.
  //
  // POWER: Barco publish exactly one figure and do not label it — the spec
  // sheet says "Input power: 100-240 VAC 50/60Hz 151W" and the rear panel is
  // silkscreened "100-240V~ 50/60Hz, 2A". There is no idle/typical split. It
  // is recorded as `powerMax` and NOT as `power`, because a ceiling is the
  // only thing that single figure can honestly be, and under-stating a feed is
  // the dangerous direction. The rack therefore reads `0.0 A+` idle with the
  // `+` warning, which is the truthful answer: Barco do not publish an idle.
  //
  // THE OPTION SLOT IS DRAWN AS THE BLANKED VENTED APERTURE IT IS. Barco call
  // it "Option slot" and it takes Event Master cards. It is not modelled with
  // the option-card mechanism because the aperture has never been measured and
  // the card range was not established — same call as the Pulse 4K's audio
  // card. A slot at an invented size is what TODO §5 exists to prevent.
  //
  // The rear USB is drawn as USB-A. Barco's text says only "USB port", but it
  // is described as taking a USB stick for stills import, backup/restore and
  // firmware, or a WiFi/Bluetooth dongle — that is a host port, and the line
  // drawing shows the wider A shell.
  { id: 'barco-pds-4k', brand: 'Barco', model: 'PDS-4K',
    category: 'video', ru: 1.5, depth: 409, weight: 6.21, powerMax: 151,
    src: 'https://www.barco.com/en/product/pds-4k',
    // Image 4-1. x = (px - 13) * 1000/920, y = (px - 84) * 150/125.
    front: { elements: [
      // PWR and STBY indicators, below their lettering at the top of the face
      { t: 'led', x: 57.6, y: 22.8 },
      { t: 'led', x: 75, y: 22.8 },
      // Barco silkscreen this and the rear one both simply "USB", so the face
      // is added to keep the two socket names distinct — the same departure
      // the Pulse 4K's `IN #1 SDI` / `IN #1 HDMI` makes, and for the same
      // reason: an ambiguous patch list is a useless patch list.
      { t: 'usba', x: 64.7, y: 74.4, lbl: 'USB FRONT' },
      // display, ADJUST encoder (push to select), ESC
      { t: 'display', x: 192.9, y: 74.4, w: 138, h: 127.2 },
      { t: 'encoder', x: 310.3, y: 75, r: 19 },
      { t: 'button', x: 353.3, y: 74.4, w: 34.8, h: 38.4 },
      // source buttons, ten per row — top row drives screen 1, bottom screen 2
      { t: 'button', x: 397.8, y: 48, n: 10, gap: 43.84, w: 34.8, h: 38.4 },
      { t: 'button', x: 397.8, y: 102, n: 10, gap: 43.84, w: 34.8, h: 38.4 },
      // LOGO/MATTE, FREEZE, TAKE — one set per row
      { t: 'button', x: 835.9, y: 48, n: 3, gap: 52.17, w: 34.8, h: 38.4 },
      { t: 'button', x: 835.9, y: 102, n: 3, gap: 52.17, w: 34.8, h: 38.4 },
    ], labels: [
      { text: 'PDS-4K', x: 36.3, y: 129.6, size: 15, ls: 1 },
      { text: 'ADJUST', x: 293.5, y: 48, size: 9, ls: .3 },
      { text: 'ESC', x: 345.7, y: 51.6, size: 8, ls: .3 },
      // The source numbers are printed BETWEEN the two rows and serve both, so
      // they are centred on their button rather than offset to the left of it.
      { text: '1', x: 397.8, y: 79.2, size: 12, anchor: 'middle' },
      { text: '2', x: 441.6, y: 79.2, size: 12, anchor: 'middle' },
      { text: '3', x: 485.5, y: 79.2, size: 12, anchor: 'middle' },
      { text: '4', x: 529.3, y: 79.2, size: 12, anchor: 'middle' },
      { text: '5', x: 573.2, y: 79.2, size: 12, anchor: 'middle' },
      { text: '6', x: 617, y: 79.2, size: 12, anchor: 'middle' },
      { text: '7', x: 660.9, y: 79.2, size: 12, anchor: 'middle' },
      { text: '8', x: 704.7, y: 79.2, size: 12, anchor: 'middle' },
      { text: '9', x: 748.6, y: 79.2, size: 12, anchor: 'middle' },
      { text: '10', x: 792.4, y: 79.2, size: 12, anchor: 'middle' },
      { text: 'LOGO', x: 835.9, y: 78, size: 7, ls: .3, anchor: 'middle' },
      { text: 'FREEZE', x: 888.1, y: 78, size: 7, ls: .3, anchor: 'middle' },
      { text: 'TAKE', x: 940.2, y: 78, size: 7, ls: .3, anchor: 'middle' },
    ] },
    // Image 4-2. x = (px - 18) * 1000/920, y = (px - 82) * 150/129.
    rear: { elements: [
      { t: 'iec_in', x: 74.5, y: 111.6, lbl: 'MAINS IN' },
      { t: 'usba', x: 131, y: 119.2, lbl: 'USB REAR' },
      { t: 'rj45', x: 168.5, y: 120.3, lbl: 'ETHERNET' },
      // the Option slot — a blanked, vented aperture on this model
      { t: 'vent', x: 450, y: 48.8, w: 304, h: 95, pitch: 15 },
      // six HDMI 2.0 inputs
      { t: 'hdmi', x: 232.1, y: 128.5, n: 6, gap: 54.78,
        lbl: ['IN 1', 'IN 2', 'IN 3', 'IN 4', 'IN 5', 'IN 6'] },
      // four HDMI 2.0 programme outputs, in two pairs
      { t: 'hdmi', x: 670.1, y: 128.5, n: 2, gap: 55.43, lbl: ['PGM 1A', 'PGM 1B'] },
      { t: 'hdmi', x: 834.2, y: 128.5, n: 2, gap: 55.43, lbl: ['PGM 2A', 'PGM 2B'] },
      // multiviewer output — hard against the right-hand end of the face
      { t: 'hdmi', x: 944, y: 128.5, lbl: 'MVR' },
    ], labels: [
      { text: '100-240V~ 50/60Hz, 2A', x: 37, y: 57, size: 7, ls: .3 },
    ] } },

  // Barco Encore3 — 4U build-to-order presentation system.
  //
  // PROVENANCE. Researched from Barco's own HTML manual R5917615 and the rear
  // photograph on their product page. Figures NOT re-checked before entry —
  // TODO §8g lists them.
  //
  // HOW IT WAS OBTAINED, because it is the way past a wall that stopped an
  // earlier pass dead: Barco's PDF documentation sits behind a Cloudflare JS
  // challenge that defeats curl. The HTML manual does not —
  // `barco.com/manuals/R5917615/*.html` is a per-topic page each a few KB, and
  // **the figure images embedded in it are not gated at all**. So the route in
  // is: browser for the DOM, then curl the image URLs straight out of it.
  //
  // SEVEN BAYS, NOT ELEVEN, AND THEY ARE NOT INTERCHANGEABLE. One takes an
  // input or the link card, two take input cards only, four are flex. Barco's
  // spec sheet says "7 input-capable" and "4 output-capable"; those are
  // overlapping uses of the same seven, and reading them as two banks is the
  // obvious error. This is the first device here whose bays have roles, which
  // is why `accepts` exists — see panel.js `cardsFor`.
  //
  // NO CARDS ARE FITTED BY DEFAULT. Barco photograph a build they call the
  // "Standard Encore3 Configuration" — Quad 100G Link, 2 x HDMI Quad In,
  // DP Quad In, Tri-combo In, Tri-combo Out, HDMI Quad Out — but that is one
  // BTO build, not what the chassis is. Fit them from the inspector.
  //
  // POWER: "100-240Vac, 50/60Hz, 12-5A (x2), 1,100 W", unlabelled. Recorded as
  // `powerMax`, because a ceiling is the only thing a single unlabelled figure
  // can honestly be and under-stating a feed is the dangerous direction — the
  // same call the PDS-4K above got.
  //
  // DEPTH is Barco's 672.29 mm "overall", not the 590.54 mm "front panel to
  // rear panel without handles or connector protectors", matching the PDS-4K's
  // "front of knob to back of connector protectors". WIDTH is 431.8 mm body /
  // 485.3 mm over the handles, so a standard 19" panel and no `widthMM`.
  // HEIGHT is 175.5 mm, which is 3.95 U and fits a 4 U opening.
  //
  // The two AC inlets carry a red-tabbed locking-lever bracket in the
  // photograph rather than a bare socket. Barco name no locking-IEC series, so
  // they are drawn as plain `iec_in`. The CONTROL port's shell looks like an
  // etherCON in the photograph though the spec table says only "Ethernet
  // RJ-45"; drawn `ethercon` from the shell. Both are in TODO §8g.
  { id: 'barco-encore3', brand: 'Barco', model: 'Encore3',
    category: 'video', ru: 4, depth: 672, weight: 29, powerMax: 1100,
    approx: true,
    src: 'https://www.barco.com/en/product/encore3',
    slots: [
      { id: 'b1', name: 'Bay 1 — link or input', short: 'B1', fmt: 'barco-e3',
        accepts: ['link', 'in'] },
      { id: 'b2', name: 'Bay 2 — input', short: 'B2', fmt: 'barco-e3',
        accepts: ['in'] },
      { id: 'b3', name: 'Bay 3 — input', short: 'B3', fmt: 'barco-e3',
        accepts: ['in'] },
      { id: 'b4', name: 'Bay 4 — flex', short: 'B4', fmt: 'barco-e3' },
      { id: 'b5', name: 'Bay 5 — flex', short: 'B5', fmt: 'barco-e3' },
      { id: 'b6', name: 'Bay 6 — flex', short: 'B6', fmt: 'barco-e3' },
      { id: 'b7', name: 'Bay 7 — flex', short: 'B7', fmt: 'barco-e3' },
    ],
    front: { elements: [
      { t: 'handle', x: 70, y: 200 },
      { t: 'display', x: 330, y: 200, w: 300, h: 190 },
      { t: 'usba', x: 520, y: 200, lbl: 'USB' },
      { t: 'handle', x: 930, y: 200 },
    ], labels: [
      { text: 'Encore3', x: 620, y: 210, size: 24, ls: 2 },
    ] },
    // Hand-placed from Barco's own rear photograph. The chassis spans
    // 1732 px for their stated 485.3 mm over the handles, so
    // x = (px - 139) / 1732 * 1000 and y = (py - 90) / 775 * 400.
    //
    // `auto` cannot do this face: it bands by rack unit and would either split
    // the seven bays across rows or hang a 125 mm aperture off the edge. The
    // bays are a single row down the right-hand half with the chassis I/O to
    // their left, which is what the photograph shows.
    rear: { elements: [
      { t: 'iec_in', x: 110, y: 170, lbl: 'MAINS A' },
      { t: 'iec_in', x: 110, y: 284, lbl: 'MAINS B' },
      { t: 'ethercon', x: 208, y: 300, lbl: 'CONTROL' },
      { t: 'rj45', x: 266, y: 300, sig: 'dante', lbl: 'AUDIO NETWORK 1' },
      { t: 'rj45', x: 314, y: 300, sig: 'dante', lbl: 'AUDIO NETWORK 2' },
      { t: 'bnc', x: 363, y: 300, lbl: 'LTC IN' },
      { t: 'usbc', x: 413, y: 258, lbl: 'USB-C' },
      { t: 'bnc', x: 428, y: 300, lbl: 'GENLOCK IN' },
      { t: 'bnc', x: 462, y: 300, lbl: 'GENLOCK OUT' },
      { t: 'slot', slot: 'b1', x: 531, y: 237 },
      { t: 'slot', slot: 'b2', x: 595, y: 237 },
      { t: 'slot', slot: 'b3', x: 658, y: 237 },
      { t: 'slot', slot: 'b4', x: 722, y: 237 },
      { t: 'slot', slot: 'b5', x: 785, y: 237 },
      { t: 'slot', slot: 'b6', x: 849, y: 237 },
      { t: 'slot', slot: 'b7', x: 912, y: 237 },
    ], labels: [
      { text: 'Control', x: 208, y: 340, size: 7, ls: .2, anchor: 'middle' },
      { text: 'Audio Network', x: 290, y: 340, size: 7, ls: .2, anchor: 'middle' },
      { text: 'LTC', x: 363, y: 340, size: 7, ls: .2, anchor: 'middle' },
      { text: 'Genlock', x: 445, y: 340, size: 7, ls: .2, anchor: 'middle' },
    ] } },

  // Barco Event Master E2 / S3-4K / EX — the older, modular Event Master
  // generation. NOT the Encore3 above: a different chassis, a different card
  // aperture ('barco-em' / 'barco-ex-io', not 'barco-e3'), and — per Barco's
  // own documentation — no per-bay restriction the way Encore3's bays have
  // one, so every E2/S3-4K slot takes any card in the range. See TODO §5/§8g.
  //
  // PROVENANCE. Barco's PDF manuals sit behind a Cloudflare JS challenge that
  // defeats curl, same wall as the Encore3 hit — but the HTML manual's
  // embedded images are not gated at all, so the route in is the same: browser
  // for the DOM, then curl the image URLs straight out of it.
  // https://www.barco.com/manuals/R5905948/xmagz5rhquo7.html (section 4.2,
  // "Rear panel") carries Image 4-5 — E2 and S3-4K rear, together, as a true
  // orthographic line drawing with every slot numbered — and Image 4-7 is the
  // EX rear. Both were downloaded directly and read pixel-for-pixel; the
  // connector inventory and left-to-right order below come from that figure,
  // not from a spec-sheet table.
  //
  // DIMENSIONS ARE A RESEARCH-PASS FIGURE, NOT RE-CHECKED, same standing as
  // the Encore3's and every §8c/§8d/§8f/§8g entry before it: E2 178 x 432 x
  // 622 mm overall, 31 kg; S3-4K 132.6 x 432 x 540 mm, 24 kg; EX 43.7 x 484.1
  // x 404.1 mm, 5.53 kg. Owed a manual pass.
  //
  // POWER. E2 is "826 W", unlabelled — recorded as `powerMax`, the same call
  // as the Encore3 and PDS-4K: a single unlabelled figure can only honestly be
  // a ceiling, and under-stating a feed is the dangerous direction. S3-4K
  // carries NO power figure at all — none was found — so it is left off
  // entirely and the unit counts toward the summary's `+`. EX's 125 W is
  // explicitly stated "typical", so it is `power`, not `powerMax`.
  //
  // NO S3D CONNECTORS. Both E2 and S3-4K carry a bank of six S3D 3-pin
  // mini-DIN sockets on the chassis (4 in, 2 out) for stereoscopic sync. There
  // is no mini-DIN primitive in this library and none is invented — per
  // standing policy a lookalike (the closest shape here is the round MIDI
  // primitive, which is a 5-pin DIN, a visibly different connector) would be
  // worse than the omission. Left out of both rears; add a `minidin`
  // primitive to fix properly. See TODO §9b.
  { id: 'barco-e2', brand: 'Barco', model: 'Event Master E2',
    category: 'video', ru: 4, depth: 622, weight: 31, powerMax: 826,
    approx: true,
    src: 'https://www.barco.com/manuals/R5905948/xmagz5rhquo7.html',
    slots: [
      { id: 'b1', name: 'Bay 1', short: 'B1', fmt: 'barco-em' },
      { id: 'b2', name: 'Bay 2', short: 'B2', fmt: 'barco-em' },
      { id: 'b3', name: 'Bay 3', short: 'B3', fmt: 'barco-em' },
      { id: 'b4', name: 'Bay 4', short: 'B4', fmt: 'barco-em' },
      { id: 'b5', name: 'Bay 5', short: 'B5', fmt: 'barco-em' },
      { id: 'b6', name: 'Bay 6', short: 'B6', fmt: 'barco-em' },
      { id: 'b7', name: 'Bay 7', short: 'B7', fmt: 'barco-em' },
      { id: 'b8', name: 'Bay 8', short: 'B8', fmt: 'barco-em' },
      { id: 'b9', name: 'Bay 9', short: 'B9', fmt: 'barco-em' },
      { id: 'b10', name: 'Bay 10', short: 'B10', fmt: 'barco-em' },
      { id: 'b11', name: 'Bay 11', short: 'B11', fmt: 'barco-em' },
      { id: 'b12', name: 'Bay 12', short: 'B12', fmt: 'barco-em' },
      { id: 'b13', name: 'Bay 13', short: 'B13', fmt: 'barco-em' },
      { id: 'b14', name: 'Bay 14', short: 'B14', fmt: 'barco-em' },
    ],
    // Hand-placed from Barco's own orthographic rear figure (Image 4-5, top
    // half). `auto` cannot draw this face — it bands by rack unit, and a
    // 118 mm portrait card would either split across rows or hang off the
    // edge, the exact failure the Encore3's rear comment already documents.
    //
    // x = (px - 100) / 1358 * 1000, matched against the fourteen-slot row's
    // own measured pixel centres and linearly compressed just enough to clear
    // this app's L0/R0 hand-placement bounds (40..960) — the source drawing
    // puts bay 1 closer to the panel edge than this app allows any element to
    // sit. y = 148 for every bay, all one row; the mains/network strip below
    // is a separate band at y = 340.
    rear: { elements: [
      { t: 'iec_in', x: 83, y: 340, lbl: 'MAINS A' },
      { t: 'iec_in', x: 225, y: 340, lbl: 'MAINS B' },
      { t: 'ethercon', x: 435, y: 340, lbl: 'ETHERNET' },
      { t: 'bnc', x: 510, y: 340, lbl: 'GENLOCK IN' },
      { t: 'bnc', x: 558, y: 340, lbl: 'GENLOCK LOOP' },
      { t: 'slot', slot: 'b1', x: 72, y: 148 },
      { t: 'slot', slot: 'b2', x: 142, y: 148 },
      { t: 'slot', slot: 'b3', x: 206, y: 148 },
      { t: 'slot', slot: 'b4', x: 273, y: 148 },
      { t: 'slot', slot: 'b5', x: 339, y: 148 },
      { t: 'slot', slot: 'b6', x: 405, y: 148 },
      { t: 'slot', slot: 'b7', x: 470, y: 148 },
      { t: 'slot', slot: 'b8', x: 535, y: 148 },
      { t: 'slot', slot: 'b9', x: 601, y: 148 },
      { t: 'slot', slot: 'b10', x: 666, y: 148 },
      { t: 'slot', slot: 'b11', x: 732, y: 148 },
      { t: 'slot', slot: 'b12', x: 797, y: 148 },
      { t: 'slot', slot: 'b13', x: 863, y: 148 },
      { t: 'slot', slot: 'b14', x: 929, y: 148 },
    ] } },

  // S3-4K shares the E2's card range and card aperture, confirmed by the same
  // figure: its own 9-slot row measures 91.8 px/card against the E2's
  // 91.4 px/card, the cross-check that this really is one card family, not
  // two similar ones. What differs is the LAYOUT, not the parts — S3-4K is
  // only 3 U, too short to stack a mains/network strip below a 118 mm card
  // the way the E2 does, so Barco put it beside the cards instead: a two-row
  // cluster (mains above, network below) to the left of a single row of 9
  // bays. Bays 2 and 3 are VPU modules — Barco's own figure shows them as
  // blank apertures, no connectors, and nothing in the manual suggests they
  // are user-swappable, so they are drawn as fixed blanked bays rather than
  // declared as slots. Bay numbering below follows Barco's own silkscreen
  // (1, 4-9), not a renumbered 1-7, so a bay's id is legible against the unit.
  { id: 'barco-s3-4k', brand: 'Barco', model: 'Event Master S3-4K',
    category: 'video', ru: 3, depth: 540, weight: 24, approx: true,
    src: 'https://www.barco.com/manuals/R5905948/xmagz5rhquo7.html',
    slots: [
      { id: 's1', name: 'Bay 1', short: 'S1', fmt: 'barco-em' },
      { id: 's4', name: 'Bay 4', short: 'S4', fmt: 'barco-em' },
      { id: 's5', name: 'Bay 5', short: 'S5', fmt: 'barco-em' },
      { id: 's6', name: 'Bay 6', short: 'S6', fmt: 'barco-em' },
      { id: 's7', name: 'Bay 7', short: 'S7', fmt: 'barco-em' },
      { id: 's8', name: 'Bay 8', short: 'S8', fmt: 'barco-em' },
      { id: 's9', name: 'Bay 9', short: 'S9', fmt: 'barco-em' },
    ],
    // x = (px - 103) / 1352 * 1000, the same measure-and-compress approach as
    // the E2, calibrated against this chassis's own body width (1352 px for
    // the same 432 mm) rather than reusing the E2's scale.
    rear: { elements: [
      { t: 'iec_in', x: 100, y: 90, lbl: 'MAINS A' },
      { t: 'iec_in', x: 200, y: 90, lbl: 'MAINS B' },
      { t: 'ethercon', x: 100, y: 205, lbl: 'ETHERNET' },
      { t: 'bnc', x: 190, y: 215, lbl: 'GENLOCK IN' },
      { t: 'bnc', x: 250, y: 215, lbl: 'GENLOCK LOOP' },
      // Bays 2 and 3 — VPU. Fixed, no connectors, drawn at the same footprint
      // a card bay would occupy (30.9 x 118 mm) rather than as a real slot.
      { t: 'bar', x: 467, y: 150, w: 64, h: 266, rx: 3 },
      { t: 'bar', x: 533, y: 150, w: 64, h: 266, rx: 3 },
      { t: 'slot', slot: 's1', x: 402, y: 150 },
      { t: 'slot', slot: 's4', x: 598, y: 150 },
      { t: 'slot', slot: 's5', x: 663, y: 150 },
      { t: 'slot', slot: 's6', x: 728, y: 150 },
      { t: 'slot', slot: 's7', x: 793, y: 150 },
      { t: 'slot', slot: 's8', x: 858, y: 150 },
      { t: 'slot', slot: 's9', x: 924, y: 150 },
    ], labels: [
      { text: 'VPU', x: 467, y: 150, size: 9, ls: .3, anchor: 'middle' },
      { text: 'VPU', x: 533, y: 150, size: 9, ls: .3, anchor: 'middle' },
    ] } },

  // Barco Event Master EX — the smallest of the range, 1 U, and the simplest
  // rear: no card cage at all. Its two "flex" HDMI banks are FIXED hardware,
  // silkscreened "Input or Output" and "Input or Output or MVR" — a software
  // role choice, not a swap. Modelled as slots anyway, because that is
  // exactly what `accepts` is for: choosing a role from the inspector. The
  // second bay's extra MVR option is the whole reason `mvr` is its own role
  // rather than folded into `out` — nothing confirms the first bay can be a
  // multiviewer too, and the silkscreen says it cannot.
  //
  // LINK 1 / LINK 2 are on the CHASSIS here, not a card — one CXP each, fixed,
  // unlike the E2/S3-4K where the link is itself a card in the cage, and
  // stacked one above the other in a single column, not side by side — the
  // figure shows "Link 1" over "Link 2", the same arrangement the E2/S3-4K's
  // Expansion Link card uses for its own pair.
  //
  // HAND-PLACED, NOT `auto`. It looks like the simple case — everything here
  // is a normal 1U-height item — but `auto`'s layout put the second CXP and
  // the first flex slot on top of each other: the panel this dense (six
  // chassis connectors plus two 150 mm slots in one 482.6 mm row, ~411 mm of
  // real connector against 482.6 mm of panel) has almost no spare width for
  // `auto`'s fixed per-item padding to absorb. Exactly the trap TODO/README
  // describe: check.mjs proves elements sit inside the panel, never that they
  // clear each other, and the only way to catch it was to render this face
  // and look. x below is a manual sequential lay-out (minimal 5.5 mm gaps,
  // the same total connector width `auto` would have used) rather than a
  // photograph measurement.
  { id: 'barco-ex', brand: 'Barco', model: 'Event Master EX',
    category: 'video', ru: 1, depth: 404, weight: 5.53, power: 125,
    approx: true,
    src: 'https://www.barco.com/manuals/R5905948/xmagz5rhquo7.html',
    slots: [
      { id: 'io1', name: 'Bay — input or output', short: 'IO1', fmt: 'barco-ex-io',
        accepts: ['in', 'out'] },
      { id: 'io2', name: 'Bay — input, output or MVR', short: 'IO2', fmt: 'barco-ex-io',
        accepts: ['in', 'out', 'mvr'] },
    ],
    rear: { elements: [
      { t: 'iec_in', x: 68, y: 50, lbl: 'MAINS' },
      { t: 'ethercon', x: 132, y: 50, lbl: 'ETHERNET' },
      { t: 'bnc', x: 185, y: 50, lbl: 'GENLOCK IN' },
      { t: 'bnc', x: 230, y: 50, lbl: 'GENLOCK OUT' },
      { t: 'cxp', x: 287, y: 32, lbl: 'LINK 1' },
      { t: 'cxp', x: 287, y: 68, lbl: 'LINK 2' },
      { t: 'slot', slot: 'io1', x: 482, y: 50 },
      { t: 'slot', slot: 'io2', x: 804, y: 50 },
    ] } },

  // Barco ImagePRO-4K — a 1U scaler/switcher, NOT branded Event Master, but
  // card-compatible with it: it "comes loaded from the factory with a
  // Tri-Combo input/output card" and the spec sheet notes "future support
  // for 2nd generation Event Master input and output cards". That plural
  // "future support" is the only mention of any other card — there is no
  // second confirmed configuration, so this is drawn as a fixed rear, not
  // as a slots+cards device. Inventing a slot format from one vague sentence
  // is exactly the kind of guess this library refuses; if a second card
  // shows up in Barco's own documentation, this is the entry to convert.
  //
  // PROVENANCE. Entirely curl-able: no Cloudflare gate anywhere in this
  // pass. The QSG came from a third-party mirror (a rental house's site)
  // found by search, which gave the real document number, which found the
  // correct dedicated spec sheet at assets.barco.com. ONE TRAP WORTH
  // RECORDING: the first spec sheet a search surfaced
  // (.../ImagePRO-II-series-en-Spec-sheet.pdf) is a different, older
  // product — "ImagePRO-II", analog/DVI/HDMI/DP/3G-SDI, five sub-models —
  // whose own text never says 4K or Tri-Combo. Per the standing rule
  // against inferring one model's spec from a same-family sibling's, that
  // PDF was discarded entirely rather than treated as "close enough", and a
  // second, more specific search found the actual ImagePRO-4K sheet dated
  // 27 Nov 2025, which every figure below comes from.
  //
  // THE REAR PANEL BITMAP WAS TOO LOW-RESOLUTION TO READ, so labels are NOT
  // from it. The same QSG page carries the callouts as real extractable PDF
  // text next to the diagram, and that text is what is used here; the
  // bitmap itself was only good enough to confirm left-to-right grouping
  // (AC/Ethernet/Genlock, then the input card, then the output card) and
  // that "4x 12G SDI" per side is four distinct BNCs, not one quad block —
  // confirmed against the spec sheet's own connector-count table, since its
  // "2x 12G SDI 4K60p ... or 4x 3G SDI" line is a bandwidth-mode
  // description (full rate on 2 of the 4 physical BNCs, or reduced rate on
  // all 4), not a claim about how many sockets are there.
  //
  // THE FRONT PANEL BITMAP WAS legible, but only after finding it was
  // embedded upside down: a plain 180-degree rotation produced
  // backwards-reading glyphs, and what actually fixed it was a pure
  // vertical flip with no horizontal mirroring. Once corrected, "BARCO",
  // "ImagePRO | 4K", "ADJUST / PUSH TO SEL", "SOURCES" and "OUTPUTS" all
  // read correctly and confirm the SRC 1-8 / OUT 1-6 buttons and order —
  // but only the module-level layout, not pixel positions, so the front
  // below is a schematic grid, the same standing as the Ascender 48's.
  //
  // RU: Barco state 43.7 mm, 0.98 U — the same figure the EX carries, and
  // treated the same way: ordinary 1U manufacturing tolerance, not a
  // fractional rack unit worth modelling, so `ru: 1`.
  //
  // POWER: "100-240 VAC 50/60Hz 125W" is a bare "Input power" line with no
  // TYPICAL/MAXIMUM qualifier — the same ambiguity every Barco datasheet in
  // this library has had, resolved the same way: `powerMax`, not `power`,
  // because a single unlabelled figure can only honestly be a ceiling.
  //
  // WIDTH: 484.1 mm "incl. rack mount" is close enough to the standard
  // 482.6 mm that no `widthMM` is set, the same call as every other
  // full-width Barco entry here.
  //
  // NOT CONFIRMED, all left out or generic rather than guessed: whether the
  // 125 W figure is typical or peak; whether Ethernet is a plain RJ45 shell
  // or a locking one (the spec text says plain RJ-45 and is trusted over
  // the too-soft bitmap impression of a round shell); the AC inlet's exact
  // sub-type beyond a C14-shaped body with an integrated rocker; whether
  // the four front-panel buttons around the ADJUST encoder carry any
  // printed text beyond arrow icons (none legible, so left unlabelled);
  // the exact green LED bargraph segment count (drawn as 16, the pass's own
  // best count, not silkscreened anywhere so not load-bearing).
  { id: 'barco-imagepro-4k', brand: 'Barco', model: 'ImagePRO-4K',
    category: 'video', ru: 1, depth: 404, weight: 6.8, powerMax: 125,
    approx: true,
    src: 'https://assets.barco.com/m/3e8cdadf32d467c1/original/ImagePRO-4K-en-Spec-sheet.pdf',
    front: { elements: [
      { t: 'led', x: 65, y: 28 },
      { t: 'usba', x: 91, y: 28 },
      { t: 'display', x: 157, y: 28, w: 90, h: 40 },
      { t: 'encoder', x: 228, y: 28, r: 20, lbl: 'ADJUST' },
      { t: 'button', x: 263, y: 28, n: 4, gap: 24, w: 18, h: 16 },
      { t: 'button', x: 365, y: 28, n: 2, gap: 36, w: 30, h: 16,
        lbl: ['MENU / MON', 'LED Setup'] },
      { t: 'button', x: 437, y: 28, n: 2, gap: 36, w: 30, h: 16,
        lbl: ['ESC', 'TEST PATT'] },
      { t: 'led', x: 499, y: 28, n: 3, gap: 10.5 },
      { t: 'button', x: 72, y: 68, n: 8, gap: 30, w: 24, h: 18,
        lbl: ['SRC 1', 'SRC 2', 'SRC 3', 'SRC 4', 'SRC 5', 'SRC 6', 'SRC 7', 'SRC 8'] },
      { t: 'button', x: 322, y: 68, n: 6, gap: 30, w: 24, h: 18,
        lbl: ['OUT 1', 'OUT 2', 'OUT 3', 'OUT 4', 'OUT 5', 'OUT 6'] },
      { t: 'button', x: 512, y: 68, w: 24, h: 18, lbl: 'FRZ' },
      { t: 'button', x: 551, y: 68, w: 30, h: 18, lbl: 'TAKE' },
      { t: 'led', x: 587, y: 68, n: 16, gap: 9 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1, lbl: 'AC' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK OUT' },
      { t: 'displayport', n: 1, lbl: 'IN DP1.2' },
      { t: 'hdmi', n: 1, lbl: 'IN HDMI2.0' },
      { t: 'bnc', n: 4, lbl: 'IN SDI' },
      { t: 'displayport', n: 1, lbl: 'OUT DP1.2' },
      { t: 'hdmi', n: 1, lbl: 'OUT HDMI2.0' },
      { t: 'bnc', n: 4, lbl: 'OUT SDI' },
    ] } },
];
