// RF Venue — 8 devices

export const RF_VENUE = [
  // ------------------------------------------------------------- RF Venue ---
  // Every RF Venue rack unit puts ALL of its antenna I/O on the rear — there is
  // not a single front BNC in the range. Fronts are a logo, a vent field, model
  // silkscreen, a rocker switch and a power LED; the channel LEDs on the
  // combiners are the only per-channel front indication. Drawn from the numbered
  // front/rear elevations in each product's own spec sheet.

  { id: 'rfvenue-distro4', brand: 'RF Venue', model: 'DISTRO4', category: 'wireless',
    ru: 1, depth: 250, weight: 2.15, power: 60,
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/DISTRO4%20Specifications.pdf',
    front: { elements: [
      { t: 'mesh', x: 470, y: 50, w: 460, h: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'DISTRO4', x: 720, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Distribution', x: 720, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 4 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-distro9-hdr', brand: 'RF Venue', model: 'DISTRO9 HDR',
    category: 'wireless', ru: 1, depth: 250, weight: 2.7, approx: true,
    // spec sheet gives 100-240 VAC / 2 A, which is a supply rating rather than
    // a consumption figure — left out rather than guessed at.
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/DISTRO9_spec_REV1.pdf',
    front: { elements: [
      { t: 'mesh', x: 480, y: 50, w: 480, h: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'DISTRO9 HDR', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Distribution', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 22 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  // Half-width chassis: ships with short and long ears plus a joining plate, so
  // it mounts solo or paired with another RF Venue half-rack unit.
  { id: 'rfvenue-distro5-hdr', brand: 'RF Venue', model: 'DISTRO5 HDR',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 224, weight: 1.7, approx: true,
    src: 'https://www.rfvenue.com/hubfs/DFUs/DISTRO5_HDR_Specifications.pdf',
    front: { elements: [
      { t: 'mesh', x: 222, y: 50, w: 140, h: 42 },
      { t: 'button', x: 400, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'RF VENUE', x: 26, y: 55, size: 11, ls: 1.1 },
      { text: 'DISTRO5', x: 310, y: 45, size: 11, ls: .6 },
      { text: 'HDR', x: 310, y: 62, size: 9, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-combine4', brand: 'RF Venue', model: 'COMBINE4', category: 'wireless',
    ru: 1, depth: 250, weight: 2.3, power: 60,
    src: 'https://www.rfvenue.com/hubfs/DFU-00009%20rev%20A%2c%20COMBINE4%20Spec%20Sheet.pdf',
    front: { elements: [
      { t: 'mesh', x: 330, y: 50, w: 180, h: 44 },
      { t: 'led', x: 456, y: 44, n: 4, gap: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'CH1', x: 456, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH2', x: 500, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH3', x: 544, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH4', x: 588, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'COMBINE4', x: 668, y: 45, size: 13, ls: .8 },
      { text: 'Transmitter Combiner', x: 668, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 5 }, { t: 'dcjack', n: 4 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-combine6-hdr', brand: 'RF Venue', model: 'COMBINE6 HDR',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 224, weight: 1.6, power: 40, approx: true,
    // 40 W is the rating of the external supply in the box, not measured draw.
    bands: ['USA + Canada: 470 - 608 MHz', "International: 470 - 698 MHz"],
    src: 'https://info.rfvenue.com/hubfs/DFUs/COMBINE6_HDR_Specifications.pdf',
    front: { elements: [
      { t: 'led', x: 155, y: 44, n: 6, gap: 24 },
      { t: 'button', x: 410, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'RF VENUE', x: 26, y: 55, size: 11, ls: 1.1 },
      { text: '1', x: 155, y: 68, size: 7, anchor: 'middle' },
      { text: '2', x: 179, y: 68, size: 7, anchor: 'middle' },
      { text: '3', x: 203, y: 68, size: 7, anchor: 'middle' },
      { text: '4', x: 227, y: 68, size: 7, anchor: 'middle' },
      { text: '5', x: 251, y: 68, size: 7, anchor: 'middle' },
      { text: '6', x: 275, y: 68, size: 7, anchor: 'middle' },
      { text: 'COMBINE6', x: 310, y: 45, size: 11, ls: .6 },
      { text: 'HDR', x: 310, y: 62, size: 9, ls: .6 },
    ] },
    rear: { auto: [{ t: 'bnc', n: 10 }, { t: 'dcjack', n: 1 }] } },

  { id: 'rfvenue-combine8', brand: 'RF Venue', model: 'COMBINE8', category: 'wireless',
    ru: 1, depth: 260, weight: 3.7, power: 84,
    bands: ['USA + Canada: 470 - 608 MHz', "International: 470 - 698 MHz"],
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/COMBINE8_Spec_REV2.pdf',
    front: { elements: [
      { t: 'led', x: 325, y: 44, n: 8, gap: 47 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'CH1', x: 325, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH8', x: 654, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'COMBINE8', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Transmitter Combiner', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 9 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  // The 8 front LEDs map one-for-one onto the 8 rear zone inputs. The Lock knob
  // and display cycle RF attenuation / DC power / input on-off per channel.
  { id: 'rfvenue-4zone', brand: 'RF Venue', model: '4 ZONE', category: 'wireless',
    ru: 1, depth: 250, weight: 2.5, approx: true,
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/4ZONE%20SpecificationsREV2.pdf',
    front: { elements: [
      { t: 'knob', x: 205, y: 50, r: 15 },
      { t: 'display', x: 290, y: 50, w: 64, h: 34 },
      { t: 'led', x: 360, y: 44, n: 4, gap: 35 },
      { t: 'led', x: 553, y: 44, n: 4, gap: 35 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 88, y: 44, size: 11, ls: 1.1 },
      { text: 'Lock', x: 205, y: 76, size: 7, anchor: 'middle' },
      { text: 'B1', x: 360, y: 70, size: 7, anchor: 'middle' },
      { text: 'B4', x: 465, y: 70, size: 7, anchor: 'middle' },
      { text: 'A4', x: 553, y: 70, size: 7, anchor: 'middle' },
      { text: 'A1', x: 658, y: 70, size: 7, anchor: 'middle' },
      { text: '4 ZONE', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Combiner', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [{ t: 'bnc', n: 10 }, { t: 'iec_in', n: 1 }] } },

  { id: 'rfvenue-4zone-net', brand: 'RF Venue', model: '4 ZONE-Network',
    category: 'wireless', ru: 1, depth: 250, weight: 2.5, approx: true,
    // The network port is in the spec table but not on a labelled panel diagram;
    // placed on the rear with the rest of the I/O, which is where it should be.
    src: 'https://www.rfvenue.com/hubfs/4Zone%20Network%202025/Spec%20Sheet/4ZONE-NETWORK%20SpecificationsREV1.pdf',
    front: { elements: [
      { t: 'knob', x: 205, y: 50, r: 15 },
      { t: 'display', x: 290, y: 50, w: 64, h: 34 },
      { t: 'led', x: 360, y: 44, n: 4, gap: 35 },
      { t: 'led', x: 553, y: 44, n: 4, gap: 35 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 88, y: 44, size: 11, ls: 1.1 },
      { text: 'Lock', x: 205, y: 76, size: 7, anchor: 'middle' },
      { text: 'B1', x: 360, y: 70, size: 7, anchor: 'middle' },
      { text: 'B4', x: 465, y: 70, size: 7, anchor: 'middle' },
      { text: 'A4', x: 553, y: 70, size: 7, anchor: 'middle' },
      { text: 'A1', x: 658, y: 70, size: 7, anchor: 'middle' },
      { text: '4 ZONE-NETWORK', x: 676, y: 45, size: 12, ls: .6 },
      { text: 'Multi-Zone Combiner', x: 676, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 10 }, { t: 'rj45', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },
];
