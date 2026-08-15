// Behringer — 3 devices

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
];
