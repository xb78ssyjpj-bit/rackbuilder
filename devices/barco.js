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
];
