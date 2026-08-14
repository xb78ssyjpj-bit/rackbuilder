// d&b audiotechnik — 12 devices

// Idle and peak mains draw across the amplifier range, supplied by the user.
// D20 (48 W idle / 2200 W peak) and D80 (180 / 7000) match d&b's own manuals
// exactly, which is the check on the rest of it.
//
//   5D 50/550 · 10D 48/1300 · D20 48/2200 · 30D 48/2200
//   D40 130/2900 · 40D 130/2900 · D90 160/3650 · D80 180/7000
//
// The pairs are the same platform in mobile and installation dress — D20/30D,
// D40/40D — which is why their figures match.
//
// NOT in the library: 5DM (550/50), D25 and 25D (2275/130). A power figure
// alone is not a device; no RU, depth, weight or connector face is established.
//
// D90's `power` was 1775 W until this pass — a CF 12 dB realistic-programme row
// off d&b's power balance table, which is not idle. Replaced with the stated
// 160 W so the field means the same thing on every amp.
//
// D6 (215 W) and D12 (640 W) are the exception left standing: they are the
// older generation, absent from the supplied table, and their figures are still
// programme rows rather than idle. Flagged in TODO section 7.

export const D_B_AUDIOTECHNIK = [
  // Hand-placed from the manufacturer's orthographic front view.
  // 2 RU x 19" x 460 mm, 10.8 kg. Front: 3.5" TFT upper left, SCROLL/EDIT
  // encoder on the lower recessed step, POWER rotary far right.
  // Power is from d&b's manual 1.9, Technical specifications: standby 9 W,
  // idle 48 W, max 2.2 kW short term RMS. The 400 W that stood here before was
  // never sourced and is not any of those numbers.
  { id: 'db-d20', brand: 'd&b audiotechnik', model: 'D20', category: 'audio',
    ru: 2, depth: 460, weight: 10.8, power: 48, powerMax: 2200, approx: true,
    src: 'https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-manual-d20-1.9-en.pdf',
    front: { elements: [
      { t: 'display', x: 161, y: 88, w: 154, h: 110 },
      // the recessed lower section runs right across the panel
      { t: 'line', x: 615, y: 128, w: 630 },
      { t: 'knob', x: 304, y: 165, r: 19 },
      { t: 'knob', x: 889, y: 165, r: 17 },
    ], labels: [
      { text: 'D20', x: 252, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 330, y: 160, size: 10, ls: .5 },
      { text: 'EDIT', x: 330, y: 172, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 170, size: 10, ls: .5, anchor: 'end' },
      { text: 'OFF', x: 866, y: 140, size: 9, ls: .5, anchor: 'end' },
      { text: 'ON', x: 906, y: 140, size: 9, ls: .5 },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrf', n: 2 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // ------------------------------------------------ d&b audiotechnik amps ---
  // Physical specs, mains connector and rear I/O are from d&b's own product
  // pages. Front panels are NOT — d&b publish no orthographic front view, so
  // these follow the house grammar of the D20 above, which WAS drawn from their
  // orthographic view: display upper left, a recessed step across the panel, the
  // encoder on it, and the power control far right.
  //
  // NO d&b AMPLIFIER HAS A MAINS DRAW FIGURE. d&b publish output power but not
  // consumption, and their brochure PDFs are image-only. Every one of these
  // therefore counts toward the summary's "publish no power figure" tally rather
  // than carrying a made-up number — which matters, because in an amp rack these
  // are the whole electrical load. See TODO.

  // --- d&b D90, D12, D6 ----------------------------------------------------
  // All three from d&b's own hardware manuals, which — unlike the D20's — do
  // extract. That matters twice over: the connector lists are stated rather
  // than inferred from the house grammar, AND every one carries a real mains
  // figure, because d&b publish a power balance table (input power against
  // crest factor) that nobody else in the amplifier section does.
  //
  // `power` takes the realistic-programme row so it is comparable with the QSC
  // amps' 1/8-power figure: CF 4.0 for the D6, CF 3.5 for the D12, and d&b's
  // own CF 12 dB reference for the D90. Drive any of them into heavy clipping
  // and the draw is 2-3x that — the manuals give those rows too.
  //
  // Note the D12 is THREE rack units. Retail listings routinely say two.

  // 2 RU x 19" x 465 mm, 18.8 kg. 4 x 2700 W into 8 ohm.
  // Mains: powerCON-HC, a 32 A connector the library has no primitive for —
  // drawn as a standard powerCON, which is the closest honest thing.
  { id: 'db-d90', brand: 'd&b audiotechnik', model: 'D90', category: 'audio',
    ru: 2, depth: 465, weight: 18.8, power: 160, powerMax: 3650,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d90/',
    front: { elements: [
      { t: 'display', x: 250, y: 100, w: 200, h: 92 },
      { t: 'encoder', x: 380, y: 100, r: 22 },
      { t: 'button', x: 560, y: 62, w: 40, h: 20, n: 4, gap: 58 },
      { t: 'button', x: 560, y: 138, w: 40, h: 20, n: 4, gap: 58 },
      { t: 'led', x: 560, y: 100, n: 4, gap: 58 },
      { t: 'button', x: 880, y: 100, w: 30, h: 30 },
    ], labels: [
      { text: 'D90', x: 90, y: 88, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 120, size: 9, ls: .4 },
      { text: 'A     B     C     D', x: 647, y: 182, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'ethercon', n: 2, lbl: 'NETWORK' },
      { t: 'xlrf', n: 4, lbl: 'IN A' },
      { t: 'xlrm', n: 4, lbl: 'LINK A' },
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: ['IN D1/2', 'IN D3/4'] },
      { t: 'xlrm', n: 2, sig: 'aes3', lbl: ['OUT D1/2', 'OUT D3/4'] },
      { t: 'nl4', n: 4, lbl: 'OUT' },
      { t: 'nl4', n: 2, lbl: ['MIX A/B', 'MIX C/D'] },
    ] } },

  // 3 RU x 19" x 353 mm, 13 kg. Two channels. Speaker outputs ship as EP5, NL4
  // or NL8 depending on the loudspeaker — NL4 is drawn as the common case.
  { id: 'db-d12', brand: 'd&b audiotechnik', model: 'D12', category: 'audio',
    ru: 3, depth: 353, weight: 13, power: 640,
    src: 'https://www.dbaudio.com/global/en/products/heritage/d12/',
    front: { elements: [
      { t: 'display', x: 300, y: 150, w: 160, h: 60 },
      { t: 'encoder', x: 420, y: 150, r: 20 },
      { t: 'button', x: 560, y: 120, w: 44, h: 22, n: 2, gap: 74 },
      { t: 'led', x: 560, y: 176, n: 2, gap: 74 },
      { t: 'led', x: 596, y: 176, n: 2, gap: 74 },
      { t: 'button', x: 880, y: 150, w: 30, h: 30 },
    ], labels: [
      { text: 'D12', x: 90, y: 138, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 170, size: 9, ls: .4 },
      { text: 'A          B', x: 597, y: 208, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'rj45', n: 2, lbl: 'REMOTE' },
      { t: 'xlrf', n: 2, lbl: ['IN A', 'IN B'] },
      { t: 'xlrm', n: 2, lbl: ['LINK A', 'LINK B'] },
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES3 LINK' },
      { t: 'nl4', n: 2, lbl: ['OUT A', 'OUT B'] },
    ] } },

  // 2 RU x 19" x 351 mm, 8 kg. Two channels, the small one of the family.
  { id: 'db-d6', brand: 'd&b audiotechnik', model: 'D6', category: 'audio',
    ru: 2, depth: 351, weight: 8, power: 215,
    src: 'https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-manual-hardware-d6-1.9-en.pdf',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 150, h: 52 },
      { t: 'encoder', x: 410, y: 100, r: 20 },
      { t: 'button', x: 560, y: 74, w: 44, h: 22, n: 2, gap: 74 },
      { t: 'led', x: 560, y: 128, n: 2, gap: 74 },
      { t: 'led', x: 596, y: 128, n: 2, gap: 74 },
      { t: 'button', x: 880, y: 100, w: 30, h: 30 },
    ], labels: [
      { text: 'D6', x: 90, y: 88, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 120, size: 9, ls: .4 },
      { text: 'A          B', x: 597, y: 160, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'rj45', n: 2, lbl: 'REMOTE' },
      { t: 'xlrf', n: 2, lbl: ['IN A', 'IN B'] },
      { t: 'xlrm', n: 2, lbl: ['LINK A', 'LINK B'] },
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES3 LINK' },
      { t: 'nl4', n: 2, lbl: ['OUT A', 'OUT B'] },
    ] } },

  // Manual 1.14, Technical specifications: powerCON-HC, 208-240 V high range,
  // standby 9 W, idle 180 W, max 7000 W short term RMS. That maximum is 30 A at
  // 230 V, which is why it is on a 32 A connector.
  { id: 'db-d80', brand: 'd&b audiotechnik', model: 'D80', category: 'audio',
    ru: 2, depth: 530, weight: 19, power: 180, powerMax: 7000, approx: true,
    src: 'https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-manual-d80-1.14-en.pdf',
    front: { elements: [
      { t: 'display', x: 200, y: 85, w: 190, h: 120 },
      { t: 'line', x: 615, y: 140, w: 630 },
      { t: 'encoder', x: 440, y: 170, r: 19 },
      { t: 'knob', x: 889, y: 170, r: 17 },
    ], labels: [
      { text: 'D80', x: 310, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 470, y: 165, size: 10, ls: .5 },
      { text: 'EDIT', x: 470, y: 177, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 175, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 6 }, { t: 'nl8', n: 1 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'db-d40', brand: 'd&b audiotechnik', model: 'D40', category: 'audio',
    ru: 2, depth: 512, weight: 13.8, power: 130, powerMax: 2900, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d40/',
    front: { elements: [
      { t: 'display', x: 210, y: 85, w: 210, h: 120 },
      { t: 'line', x: 615, y: 140, w: 630 },
      { t: 'encoder', x: 450, y: 170, r: 19 },
      { t: 'knob', x: 889, y: 170, r: 17 },
    ], labels: [
      { text: 'D40', x: 330, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 480, y: 165, size: 10, ls: .5 },
      { text: 'EDIT', x: 480, y: 177, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 175, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 6 }, { t: 'xlrm', n: 3 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  // The xD install amps use Euroblock throughout rather than XLR and speakON —
  // worth knowing before you plan a loom off one of these.
  { id: 'db-40d', brand: 'd&b audiotechnik', model: '40D', category: 'audio',
    ru: 2, depth: 465, weight: 13.3, power: 130, powerMax: 2900, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/40d/',
    front: { elements: [
      { t: 'display', x: 220, y: 100, w: 210, h: 110 },
      { t: 'led', x: 400, y: 100, n: 4, gap: 30 },
      { t: 'knob', x: 889, y: 100, r: 17 },
    ], labels: [
      { text: '40D', x: 100, y: 60, size: 22, ls: 1 },
      { text: 'POWER', x: 843, y: 105, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'db-30d', brand: 'd&b audiotechnik', model: '30D', category: 'audio',
    ru: 2, depth: 435, weight: 10.6, power: 48, powerMax: 2200, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/30d/',
    front: { elements: [
      { t: 'led', x: 250, y: 84, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 114, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 144, n: 4, gap: 140 },
      { t: 'led', x: 880, y: 114 },
    ], labels: [
      { text: '30D', x: 96, y: 60, size: 22, ls: 1 },
      { text: 'ISP', x: 210, y: 88, size: 9, ls: .4, anchor: 'end' },
      { text: 'GR', x: 210, y: 118, size: 9, ls: .4, anchor: 'end' },
      { text: 'OVL', x: 210, y: 148, size: 9, ls: .4, anchor: 'end' },
      { text: 'A', x: 250, y: 62, size: 10, anchor: 'middle' },
      { text: 'B', x: 390, y: 62, size: 10, anchor: 'middle' },
      { text: 'C', x: 530, y: 62, size: 10, anchor: 'middle' },
      { text: 'D', x: 670, y: 62, size: 10, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'rj45', n: 4 }, { t: 'powercon_in', n: 1 },
    ] } },

  // Same chassis as the 30D — d&b publish identical dimensions and weight for
  // the pair; they differ in output power, not in the box.
  { id: 'db-10d', brand: 'd&b audiotechnik', model: '10D', category: 'audio',
    ru: 2, depth: 435, weight: 10.6, power: 48, powerMax: 1300, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/10d/',
    front: { elements: [
      { t: 'led', x: 250, y: 84, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 114, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 144, n: 4, gap: 140 },
      { t: 'led', x: 880, y: 114 },
    ], labels: [
      { text: '10D', x: 96, y: 60, size: 22, ls: 1 },
      { text: 'ISP', x: 210, y: 88, size: 9, ls: .4, anchor: 'end' },
      { text: 'GR', x: 210, y: 118, size: 9, ls: .4, anchor: 'end' },
      { text: 'OVL', x: 210, y: 148, size: 9, ls: .4, anchor: 'end' },
      { text: 'A', x: 250, y: 62, size: 10, anchor: 'middle' },
      { text: 'B', x: 390, y: 62, size: 10, anchor: 'middle' },
      { text: 'C', x: 530, y: 62, size: 10, anchor: 'middle' },
      { text: 'D', x: 670, y: 62, size: 10, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'rj45', n: 4 }, { t: 'powercon_in', n: 1 },
    ] } },

  // 241 mm wide — half the full 483 mm panel, so it bolts rail-to-centre with
  // its own ears rather than needing a tray. IEC mains, unlike the rest of d&b.
  { id: 'db-5d', brand: 'd&b audiotechnik', model: '5D', category: 'audio',
    half: true, ears: true, ru: 1, depth: 435, weight: 4.6, power: 50, powerMax: 550, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/5d/',
    front: { elements: [
      { t: 'led', x: 150, y: 36, n: 4, gap: 62 },
      { t: 'led', x: 150, y: 68, n: 4, gap: 62 },
      { t: 'led', x: 410, y: 52 },
    ], labels: [
      { text: '5D', x: 26, y: 44, size: 15, ls: 1 },
      { text: 'd&b', x: 26, y: 68, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 5 }, { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  // Dante-to-AES3 bridge. Its published I/O is quoted in CHANNELS, not
  // connectors — AES3 carries two channels per XLR, so 4 in / 16 out is 2 and 8
  // sockets. Sixteen XLRs would be 384 mm of connector and could not fit a 1U
  // face at all, which is how the discrepancy showed up.
  // Manual 1.11: "Power consumption 10 W (max)" — a single figure, so typical
  // and maximum are the same thing here.
  { id: 'db-ds10', brand: 'd&b audiotechnik', model: 'DS10', category: 'audio',
    ru: 1, depth: 232, weight: 3.75, power: 10, powerMax: 10, approx: true,
    src: 'https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-manual-ds10-1.11-en.pdf',
    front: { elements: [
      { t: 'button', x: 220, y: 50, w: 30, h: 24 },
      { t: 'led', x: 320, y: 50, n: 6, gap: 40 },
    ], labels: [
      { text: 'DS10', x: 90, y: 44, size: 14, ls: 1 },
      { text: 'BYPASS', x: 220, y: 82, size: 7, ls: .4, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 920, y: 56, size: 10, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      // `sig: 'aes3'` — these XLRs carry AES3, not analogue. The connector
      // cannot say so on its own, which is exactly what `sig` is for.
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 8, sig: 'aes3', lbl: 'AES3 OUT' },
      { t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] },
      { t: 'powercon_in', n: 1 },
    ] } },

  // Soundscape engine. All audio is on Dante — there is no analogue I/O — and
  // the front face was never confirmed, so it is drawn as vents and lettering.
  { id: 'db-ds100', brand: 'd&b audiotechnik', model: 'DS100', category: 'audio',
    ru: 3, depth: 481, weight: 11.2, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/processing-and-matrix/ds100/',
    front: { elements: [
      { t: 'mesh', x: 250, y: 150, w: 320, h: 220 },
      { t: 'mesh', x: 750, y: 150, w: 320, h: 220 },
    ], labels: [
      { text: 'd&b audiotechnik', x: 500, y: 142, size: 18, ls: 1, anchor: 'middle' },
      { text: 'DS100', x: 500, y: 174, size: 15, ls: .8, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 3 }, { t: 'iec_in', n: 1 }] } },
];
