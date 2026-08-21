// Behringer — 6 devices

export const BEHRINGER = [
  // 3U, 483 x 132 x 287 mm, 6.5 kg. 5" TFT flanked by button columns, six
  // encoders beneath it, big knobs and power to the right.
  // Derived from a product photo at a mild angle — layout is confident,
  // exact positions are within a few mm.
  { id: 'behringer-x32-rack', brand: 'Behringer', model: 'X32 RACK', category: 'audio',
    ru: 3, depth: 287, weight: 6.5, power: 45, approx: true,
    src: 'https://www.thomannmusic.com/behringer_x32_rack.htm',
    front: { elements: [
      { t: 'usba', x: 108, y: 145 },
      { t: 'meter', x: 190, y: 100, n: 10, h: 86 },
      { t: 'button', x: 168, y: 178, w: 26, h: 18 },
      { t: 'button', x: 208, y: 178, w: 26, h: 18 },
      { t: 'knob', x: 190, y: 240, r: 24 },
      // left function column
      { t: 'button', x: 268, y: 92, w: 46, h: 20 },
      { t: 'button', x: 268, y: 122, w: 46, h: 20 },
      { t: 'button', x: 268, y: 152, w: 46, h: 20 },
      { t: 'button', x: 268, y: 182, w: 46, h: 20 },
      { t: 'button', x: 268, y: 212, w: 46, h: 20 },
      // 5" TFT
      { t: 'display', x: 425, y: 148, w: 250, h: 168 },
      { t: 'meter', x: 578, y: 148, n: 14, h: 160 },
      // right function column
      { t: 'button', x: 642, y: 100, w: 52, h: 20 },
      { t: 'button', x: 642, y: 130, w: 52, h: 20 },
      { t: 'button', x: 642, y: 160, w: 52, h: 20 },
      { t: 'button', x: 642, y: 190, w: 52, h: 20 },
      { t: 'button', x: 642, y: 220, w: 52, h: 20 },
      // six encoders under the screen
      { t: 'encoder', x: 318, y: 262, n: 6, gap: 44, r: 18 },
      // navigation cluster
      { t: 'button', x: 596, y: 252, w: 18, h: 13 },
      { t: 'button', x: 596, y: 272, w: 18, h: 13 },
      { t: 'button', x: 574, y: 262, w: 18, h: 13 },
      { t: 'button', x: 618, y: 262, w: 18, h: 13 },
      // right-hand section
      { t: 'knob', x: 735, y: 112, r: 21 },
      { t: 'knob', x: 848, y: 118, r: 21 },
      { t: 'trs', x: 848, y: 200 },
      { t: 'button', x: 735, y: 196, w: 54, h: 20 },
      { t: 'knob', x: 735, y: 252, r: 24 },
      { t: 'button', x: 872, y: 262, w: 30, h: 34 },
    ], labels: [
      { text: 'X32 RACK', x: 78, y: 60, size: 19, ls: 1 },
      { text: 'DATA / AUDIO', x: 78, y: 172, size: 8, ls: .5 },
      { text: 'CHANNEL LEVEL', x: 190, y: 210, size: 8, ls: .5, anchor: 'middle' },
      { text: 'TALK', x: 735, y: 84, size: 9, ls: .5, anchor: 'middle' },
      { text: 'MONITOR', x: 848, y: 90, size: 9, ls: .5, anchor: 'middle' },
      { text: 'MAIN LR', x: 735, y: 222, size: 9, ls: .5, anchor: 'middle' },
      { text: 'POWER', x: 872, y: 232, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear per the X32 RACK manual: 16 XLR mic in, 8 XLR out, 6 aux sends and
    // 6 aux returns on balanced 1/4" TRS, AES50 A and B on etherCON, one
    // ULTRANET (P-16), one RJ45 for remote control, and MIDI in/out.
    // Deliberately NOT here: an AES/EBU output — the full X32 console has one,
    // this rack version does not. The expansion card slot is a slot, not a
    // socket, so the fitted card's own connector is not modelled.
    // The USB type-A is on the front panel, where it is already drawn.
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'rj45', n: 1, sig: 'ultranet', lbl: 'ULTRANET' },
      { t: 'rj45', n: 1, lbl: 'REMOTE' },
      { t: 'ethercon', n: 2, sig: 'aes50', lbl: ['AES50 A', 'AES50 B'] },
      { t: 'trs', n: 12, lbl: 'AUX' },
      { t: 'xlrm', n: 8, lbl: 'OUT' }, { t: 'xlrf', n: 16, lbl: 'IN' },
    ] } },

  // 2U, 482 x 225 x 89 mm, 4.7 kg. Everything is on the front: 16 XLR-F in
  // (2 rows of 8), control section, then 8 XLR-M out along the bottom right.
  { id: 'behringer-s16', brand: 'Behringer', model: 'S16', category: 'audio',
    ru: 2, depth: 225, weight: 4.7, power: 40, approx: true,
    src: 'https://www.thomannmusic.com/behringer_s16.htm',
    front: { elements: [
      { t: 'xlrf', x: 106, y: 48, n: 8, gap: 50 },
      { t: 'xlrf', x: 106, y: 118, n: 8, gap: 50 },
      { t: 'led', x: 82, y: 158 },
      { t: 'vline', x: 492, y: 100, h: 170 },
      // control section
      { t: 'display', x: 652, y: 68, w: 46, h: 28 },
      { t: 'led', x: 590, y: 42, n: 5, gap: 18 },
      { t: 'button', x: 606, y: 112, w: 26, h: 16 },
      { t: 'button', x: 646, y: 112, w: 26, h: 16 },
      { t: 'button', x: 692, y: 112, w: 30, h: 16 },
      { t: 'encoder', x: 748, y: 82, r: 17 },
      { t: 'meter', x: 792, y: 82, n: 6, h: 46 },
      { t: 'knob', x: 838, y: 82, r: 17 },
      { t: 'trs', x: 892, y: 82 },
      // 8 XLR-M returns
      { t: 'xlrm', x: 524, y: 162, n: 8, gap: 53 },
    ], labels: [
      { text: 'S16', x: 512, y: 96, size: 22, ls: 1 },
      { text: 'PHANTOM', x: 96, y: 162, size: 8, ls: .5 },
      { text: 'HA CONTROL', x: 748, y: 52, size: 8, ls: .5, anchor: 'middle' },
      { text: 'PHONES', x: 892, y: 52, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear per the S16 manual's connector table: AES50 A and B on NEUTRIK
    // etherCON, one ULTRANET (P-16) port, two ADAT TOSLINK outs carrying 16
    // channels between them, MIDI in and out on 5-pin DIN, and a USB type-B
    // for firmware. The manual's table does not name the mains inlet; C14 is
    // the fitting on the unit and every other box of this class here.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbb', n: 1 },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'toslink', n: 2, lbl: ['ADAT OUT 1-8', 'ADAT OUT 9-16'] },
      { t: 'rj45', n: 1, sig: 'ultranet', lbl: 'ULTRANET' },
      { t: 'ethercon', n: 2, sig: 'aes50', lbl: ['AES50 A', 'AES50 B'] },
    ] } },

  // 1U, 44 x 483 x 189 mm, 1.9 kg, 35 W. Two main-input level knobs, then
  // eight channel strips: mode switches, level knob, 1/4" TRS out.
  { id: 'behringer-ha8000v2', brand: 'Behringer', model: 'POWERPLAY HA8000 V2',
    category: 'audio', ru: 1, depth: 189, weight: 1.9, power: 35,
    src: 'https://www.behringer.com/en/products/0835-AAI',
    front: { elements: [
      { t: 'knob', x: 104, y: 50, r: 14 },
      { t: 'knob', x: 152, y: 50, r: 14 },
      { t: 'vline', x: 186, y: 50, h: 60 },
      // eight channel strips
      { t: 'button', x: 206, y: 34, n: 8, gap: 88, w: 15, h: 11 },
      { t: 'button', x: 206, y: 62, n: 8, gap: 88, w: 15, h: 11 },
      { t: 'knob', x: 236, y: 50, n: 8, gap: 88, r: 13 },
      { t: 'trs', x: 270, y: 50, n: 8, gap: 88 },
    ], labels: [
      { text: 'MAIN 1', x: 104, y: 82, size: 8, ls: .5, anchor: 'middle' },
      { text: 'MAIN 2', x: 152, y: 82, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear: two stereo MAIN inputs feeding two independent mixes, a DIRECT
    // input per channel, and a second PHONES output per channel mirroring the
    // front — which is the point of the V2, sixteen pairs of headphones off one
    // box. Everything is 6.3 mm; the mains is an IEC inlet on a 100-240 V
    // switching supply.
    //
    // The one inference: "2 stereo main inputs" is taken as four jacks, L and R
    // apiece, because Behringer's own instruction is to use "TRS or TS" cables
    // into MAIN INPUTS (L/R) — a single stereo TRS could not take a TS cable.
    // The DIRECT inputs are one stereo TRS per channel, which is the standard
    // arrangement for a headphone distribution amp.
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'trs', n: 4, lbl: ['MAIN A L', 'MAIN A R', 'MAIN B L', 'MAIN B R'] },
      { t: 'trs', n: 8, lbl: 'DIRECT IN' },
      { t: 'trs', n: 8, lbl: 'PHONES OUT' },
    ] } },

  // 4U 48-channel rackmount mixing engine. 9.5 kg, 130 W typical, IEC inlet.
  //
  // PROVENANCE. Haiku research pass over Behringer's own Quick Start Guide
  // (QSG_BE_0604-AAE). Figures NOT re-checked before entry, by instruction —
  // TODO §8f. Two things in that QSG needed resolving before this could be
  // entered at all, and both are recorded here because neither is settled by
  // the document:
  //
  // 1. THE DIMENSION TABLE CONTRADICTS THE PRODUCT ITSELF. It reads
  //    "Dimensions (H x W x D) 183 x 326 x 486 mm (7.2 x 12.8 x 19.1")", which
  //    makes the unit 326 mm wide — not a 19" panel, on a product whose own
  //    title is "Rackmount 48 Channel ... Mixing Engine". The QSG contains no
  //    occurrence of "19 inch", "rack unit", "rack ear" or "RU", has no
  //    mounting section, and shows no figure of it in a rack. The only
  //    self-consistent reading is that the header is transposed and it is
  //    H x D x W: 486 mm being the 19.1" panel and 326 mm the depth. THE 4U
  //    HEIGHT IS THE USER'S, NOT BEHRINGER'S — 183 mm is 4.12 U, so their
  //    figure includes feet. Marked `approx` for that reason.
  //
  // 2. THE PHONES COUNT IS 5, AND BOTH OF BEHRINGER'S NUMBERS WERE RIGHT. The
  //    spec table says "Phones output (1/4" TRS, stereo) 5"; the rear-panel
  //    text says "Four stereo headphones can be used for monitoring". Per the
  //    user, who has one: the four on the REAR are stereo IEM sends, and the
  //    fifth is a headphone output on the FRONT. The QSG never mentions the
  //    front socket, which is why the two figures looked like a contradiction.
  //
  // THE MIC INPUTS ARE COMBO, NOT XLR. The spec table lists them as "(XLR) 24"
  // but the prose says "24 Midas PRO series microphone preamps with combo jack
  // connectors". The prose describes the socket, so combo is what is drawn.
  //
  // GENDERS ARE THIS LIBRARY'S CONVENTION, NOT BEHRINGER'S. The QSG states no
  // gender for any XLR. Inputs are drawn female and outputs male, as every
  // other unit here is, including the X32 RACK above. The StageConnect port is
  // the weakest of them: the QSG gives "StageConnect HOST (Master) I/O (12 V /
  // 18 W power supplied, XLR, 32 channels) 1" and nothing about which way round
  // it is. Drawn male on the grounds that it is named an output-side host.
  //
  // BOTH FACES ARE `auto`. The QSG carries no numbered or captioned panel
  // figure, so the inventory and the connector sizes are real and the
  // left-to-right order is the layout engine's. The front is a confirmed
  // element inventory at unconfirmed positions.
  { id: 'behringer-wing-rack', brand: 'Behringer', model: 'WING Rack',
    category: 'audio', ru: 4, depth: 326, weight: 9.5, power: 130, approx: true,
    src: 'https://www.behringer.com/products/wing-rack',
    front: { elements: [
      { t: 'display', x: 330, y: 200, w: 380, h: 230 },
      { t: 'encoder', x: 580, y: 150, n: 4, gap: 62, r: 20 },
      { t: 'button', x: 580, y: 240, n: 4, gap: 62, w: 40, h: 26 },
      { t: 'knob', x: 800, y: 180, r: 30 },
      { t: 'usba', x: 800, y: 280, lbl: 'USB' },
      { t: 'trs', x: 880, y: 280, lbl: 'PHONES' },
    ], labels: [
      { text: 'WING RACK', x: 90, y: 120, size: 22, ls: 2 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'combo', n: 24, lbl: 'MIC' },
      { t: 'xlrm', n: 8, lbl: 'OUT' },
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES3 OUT' },
      { t: 'xlrm', n: 1, lbl: 'STAGECONNECT' },
      { t: 'ethercon', n: 3, sig: 'aes50', lbl: ['AES50 A', 'AES50 B', 'AES50 C'] },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'trs', n: 4, lbl: 'IEM' },
      { t: 'trs', n: 2, lbl: 'GPIO' },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'usbb', n: 1 },
    ] } },

  // 3U, 483 x 137 x 210 mm, 4.9 kg. 32 Midas preamps in, 16 out.
  //
  // THE FACE ASSIGNMENT IS THE USER'S, NOT BEHRINGER'S. Asked directly, they
  // said the S32 matches the S16: XLR I/O on the front, digital and network on
  // the rear. That is the one thing retailer listings never give and the one
  // thing this entry was blocked on, so it is drawn on their word and marked
  // as theirs. The RJ45 is labelled ULTRANET on the same authority.
  //
  // BOTH FACES ARE `auto`, because what was confirmed is which face carries
  // what, NOT where anything sits on it. No panel figure has been seen.
  //
  // Behringer's own documentation could not be reached — behringer.com renders its
  // Downloads tab client-side, so the cdn-media.empowertribe.com PDF links are
  // not fetchable without a browser, and two research passes failed on it. The
  // dimensions and weight above are from Thomann and are flagged `approx`, the
  // same standing as the X32 RACK and S16 entries above.
  //
  // WHAT IS MISSING IS THE FACE, AND THAT IS WHY NOTHING IS DRAWN. Retailer
  // listings give an inventory — 2 x AES50, 2 x ADAT out, MIDI in/out, USB,
  // one RJ45 — but not which face carries what, nor the XLR counts and
  // genders. The S16 two entries above puts ALL of its I/O on the front, which
  // is unusual, and assuming the S32 copies it would be fitting the family
  // grammar and calling it a spec. It gets rack space, weight and depth, which
  // is most of what a rack drawing needs; the panel waits for the manual.
  // TODO §8f.
  { id: 'behringer-s32', brand: 'Behringer', model: 'S32', category: 'audio',
    ru: 3, depth: 210, weight: 4.9, approx: true,
    src: 'https://www.thomannmusic.com/behringer_s32.htm',
    // Hand-placed as three rows of 16 rather than left to `auto`, because auto
    // balanced them 12/12/24 and drew the last row overlapping — connectors at
    // less than true size, which is the one thing this drawing must not do.
    // 48 XLRs genuinely fit a 3U face (16 x 24 mm = 384 mm per row, three rows
    // of 31 mm in 133 mm), and rows-of-16 is the S16's confirmed grammar
    // scaled, which is what the user said this unit follows.
    front: { elements: [
      { t: 'xlrf', x: 104, y: 60, n: 16, gap: 52.75 },
      { t: 'xlrf', x: 104, y: 150, n: 16, gap: 52.75 },
      { t: 'xlrm', x: 104, y: 240, n: 16, gap: 52.75 },
    ], labels: [
      { text: 'IN 1-32', x: 78, y: 26, size: 11, ls: .8 },
      { text: 'OUT 1-16', x: 78, y: 206, size: 11, ls: .8 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbb', n: 1 },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'toslink', n: 2, lbl: ['ADAT OUT 1-8', 'ADAT OUT 9-16'] },
      { t: 'rj45', n: 1, sig: 'ultranet', lbl: 'ULTRANET' },
      { t: 'ethercon', n: 2, sig: 'aes50', lbl: ['AES50 A', 'AES50 B'] },
    ] } },

  // X AIR XR18. 333 mm wide — NARROWER THAN A RACK, and drawn that way.
  //
  // Behringer supply the rack hardware, and per the user it racks centrally
  // with the body at its true width and filler either side. That is what
  // `widthMM` does: the panel draws a 333 mm body in the middle of the U with
  // blanking plate to each side, and the device still claims the whole row,
  // because the filler is physically there. See panel.js `isNarrow`.
  //
  // PROVENANCE: Behringer's own X AIR X18/XR18 Quick Start Guide
  // (QSG_BE_0605-AAA), whose specification table carries both models in
  // parallel columns. The I/O below is the XR18 column verbatim.
  //
  // THE AXIS ORDER IS DERIVED, NOT LABELLED. The table gives "409 x 357 x 110
  // mm" for the X18 and "333 x 149 x 140 mm" for the XR18 with no H/W/D
  // header. 357 mm cannot be a height, so the order is W x D x H — which makes
  // the XR18 333 wide, 149 deep and 140 tall. 140 mm is 3.15 U, recorded as
  // `ru: 3.2`; Behringer state no rack-unit height anywhere, and the QSG
  // contains no occurrence of "19 inch", "rack unit" or "rack ear" at all.
  // Everything here is therefore `approx`.
  //
  // THE CONNECTOR FACE IS UNCONFIRMED. The QSG's specification table lists
  // what the sockets are but never which face carries them, and a racked XR18
  // is not in the same orientation as a desktop one. Drawn on the front, which
  // is where you would patch it from in a rack. Worth one look. TODO §8f.
  { id: 'behringer-xr18', brand: 'Behringer', model: 'XR18', category: 'audio',
    ru: 3.2, depth: 149, weight: 3.2, power: 30, widthMM: 333, approx: true,
    src: 'https://www.behringer.com/products/xr18',
    front: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'combo', n: 16, lbl: 'IN' },
      { t: 'trs', n: 2, lbl: ['AUX IN L', 'AUX IN R'] },
      { t: 'xlrm', n: 2, lbl: ['MAIN L', 'MAIN R'] },
      { t: 'xlrm', n: 6, lbl: 'AUX OUT' },
      { t: 'trs', n: 1, lbl: 'PHONES' },
      { t: 'rj45', n: 1, sig: 'ultranet', lbl: 'ULTRANET' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'usbb', n: 1 },
    ] } },
];
