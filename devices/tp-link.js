// TP-Link — 1 device

export const TP_LINK = [
  // --------------------------------------------------------------- network ---
  // TL-SG1008PE: 8-port gigabit PoE+ easy-smart switch, 124 W PoE budget.
  // A 294 mm body that racks centrally on TP-Link's own brackets, so `widthMM`
  // draws it at true width with filler either side. Faces hand-placed from
  // the front/rear elevations in the V2 installation guide (figs 1-7, 1-14);
  // datasheet gives 294 x 180 x 44 mm, 5.8 W with no PDs, 140.1 W at full PoE
  // load. No weight is published in either document. Research pass, unverified.
  { id: 'tplink-tl-sg1008pe', brand: 'TP-Link', model: 'TL-SG1008PE',
    category: 'network', ru: 1, depth: 180, widthMM: 294,
    power: 6, powerMax: 140, approx: true,
    src: 'https://static.tp-link.com/res/down/doc/TL-SG1008PE(UN)_V2_IG.pdf',
    front: { elements: [
      { t: 'led', x: 378, y: 50 },
      { t: 'led', x: 392, y: 50, n: 8, gap: 13 },
      { t: 'led', x: 392, y: 62, n: 8, gap: 13 },
      { t: 'led', x: 378, y: 74 },
      { t: 'led', x: 392, y: 74, n: 8, gap: 13 },
      { t: 'rj45', x: 510, y: 62, n: 8, gap: 30.1, lbl: 'Port' },
    ], labels: [
      { text: 'TP-LINK', x: 214, y: 30, size: 11, ls: 1 },
      { text: 'TL-SG1008PE', x: 214, y: 66, size: 7, ls: .4 },
      { text: '8-Port Gigabit Desktop Switch with 8-Port PoE', x: 214, y: 82, size: 4 },
      { text: 'PoE MAX', x: 378, y: 40, size: 3.5, anchor: 'middle' },
      { text: 'Power', x: 378, y: 84, size: 3.5, anchor: 'middle' },
      { text: '1', x: 510, y: 44, size: 5, anchor: 'middle' },
      { text: '2', x: 540, y: 44, size: 5, anchor: 'middle' },
      { text: '3', x: 570, y: 44, size: 5, anchor: 'middle' },
      { text: '4', x: 600, y: 44, size: 5, anchor: 'middle' },
      { text: '5', x: 631, y: 44, size: 5, anchor: 'middle' },
      { text: '6', x: 661, y: 44, size: 5, anchor: 'middle' },
      { text: '7', x: 691, y: 44, size: 5, anchor: 'middle' },
      { text: '8', x: 721, y: 44, size: 5, anchor: 'middle' },
    ] },
    rear: { elements: [
      { t: 'iec_in', x: 554, y: 48 },
      { t: 'screw', x: 660, y: 54 },
    ], labels: [
      { text: '100-240V~ 50/60Hz 2.0A', x: 554, y: 84, size: 3.5, anchor: 'middle' },
    ] } },
];
