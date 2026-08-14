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
    front: { elements: [
      // PWR and STBY indicators over the USB host port
      { t: 'led', x: 103, y: 44 },
      { t: 'led', x: 127, y: 44 },
      // Barco silkscreen this and the rear one both simply "USB", so the face
      // is added to keep the two socket names distinct — the same departure
      // the Pulse 4K's `IN #1 SDI` / `IN #1 HDMI` makes, and for the same
      // reason: an ambiguous patch list is a useless patch list.
      { t: 'usba', x: 114, y: 78, lbl: 'USB FRONT' },
      // display, ADJUST encoder (push to select), ESC
      { t: 'display', x: 229, y: 71, w: 122, h: 92 },
      { t: 'encoder', x: 330, y: 80, r: 17 },
      { t: 'button', x: 366, y: 80, w: 22, h: 18 },
      // source buttons, ten per row — top row drives screen 1, bottom screen 2
      { t: 'button', x: 409, y: 54, n: 10, gap: 38.7, w: 30, h: 32 },
      { t: 'button', x: 409, y: 109, n: 10, gap: 38.7, w: 30, h: 32 },
      // LOGO/MATTE, FREEZE, TAKE — one set per row
      { t: 'button', x: 798, y: 54, n: 3, gap: 43.5, w: 30, h: 32 },
      { t: 'button', x: 798, y: 109, n: 3, gap: 43.5, w: 30, h: 32 },
    ], labels: [
      { text: 'PDS-4K', x: 88, y: 112, size: 11, ls: .6 },
      { text: 'ADJUST', x: 313, y: 52, size: 5, ls: .3 },
      { text: 'ESC', x: 358, y: 52, size: 5, ls: .3 },
      // the source numbers are printed BETWEEN the two rows and serve both
      { text: '1', x: 406, y: 88, size: 6 }, { text: '2', x: 445, y: 88, size: 6 },
      { text: '3', x: 484, y: 88, size: 6 }, { text: '4', x: 522, y: 88, size: 6 },
      { text: '5', x: 561, y: 88, size: 6 }, { text: '6', x: 600, y: 88, size: 6 },
      { text: '7', x: 638, y: 88, size: 6 }, { text: '8', x: 677, y: 88, size: 6 },
      { text: '9', x: 716, y: 88, size: 6 }, { text: '10', x: 752, y: 88, size: 6 },
      { text: 'LOGO', x: 786, y: 88, size: 5, ls: .2 },
      { text: 'FREEZE', x: 826, y: 88, size: 5, ls: .2 },
      { text: 'TAKE', x: 874, y: 88, size: 5, ls: .2 },
    ] },
    // Hand-placed from Image 4-2, measured against the 19" ear-to-ear span.
    rear: { elements: [
      { t: 'iec_in', x: 119, y: 104, lbl: 'MAINS IN' },
      { t: 'usba', x: 173, y: 115, lbl: 'USB REAR' },
      { t: 'rj45', x: 208, y: 114, lbl: 'ETHERNET' },
      // the Option slot — a blanked, vented aperture on this model
      { t: 'vent', x: 455, y: 49, w: 262, h: 84, pitch: 14 },
      // six HDMI 2.0 inputs
      { t: 'hdmi', x: 265, y: 121, n: 6, gap: 48.4,
        lbl: ['IN 1', 'IN 2', 'IN 3', 'IN 4', 'IN 5', 'IN 6'] },
      // four HDMI 2.0 programme outputs, in two pairs
      { t: 'hdmi', x: 651, y: 121, n: 2, gap: 49, lbl: ['PGM 1A', 'PGM 1B'] },
      { t: 'hdmi', x: 798, y: 121, n: 2, gap: 49, lbl: ['PGM 2A', 'PGM 2B'] },
      // multiviewer output
      { t: 'hdmi', x: 896, y: 121, lbl: 'MVR' },
    ], labels: [
      { text: '100-240V~ 50/60Hz, 2A', x: 76, y: 62, size: 5, ls: .2 },
    ] } },
];
