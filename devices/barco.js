// Barco — 1 device
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
];
