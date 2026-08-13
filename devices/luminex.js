// Luminex — 1 device

export const LUMINEX = [
  // 1U, 482 x 204 x 44 mm, 2.5 kg. 30 W, or up to 180 W with the PoE option.
  // Fourteen ports: 10 etherCON on the FRONT (it is a touring switch), 2
  // etherCON and 2 SFP cages on the rear with the serial console and the IEC.
  // NOT modelled: the two Molex Micro-Fit 6-pin backup power inlets — there is
  // no primitive for them and inventing one would be worse than the omission.
  // Discontinued June 2024 in favour of the GigaCore 18t, still everywhere in
  // UK rental stock.
  { id: 'luminex-gigacore-14r', brand: 'Luminex', model: 'GigaCore 14R',
    category: 'network', ru: 1, depth: 204, weight: 2.5, power: 30, approx: true,
    src: 'https://www.luminex.be/wp-content/uploads/doccenter/GigaCore_14R_User_Manual-rev-2.8.4.pdf',
    front: { elements: [
      { t: 'ethercon', x: 216, y: 50, n: 10, gap: 62 },
    ], labels: [
      { text: 'LUMINEX', x: 76, y: 44, size: 10, ls: .8 },
      { text: 'GigaCore 14R', x: 76, y: 64, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'rj45', n: 1, lbl: 'CONSOLE' },
      { t: 'sfp', n: 2 },
      { t: 'ethercon', n: 2 },
    ] } },
];
