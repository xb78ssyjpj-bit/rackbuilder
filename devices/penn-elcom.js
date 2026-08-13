// Penn Elcom — 10 devices

// Penn Elcom 2U rack PDUs. The whole PDU16 range shares one front panel, drawn
// from Penn Elcom's own product photography: an M4 earth stud, the C-FORM (or
// TRUE1) mains inlet, Channel A's illuminated trip, the matching THRU LINK
// outlet, the LCD power monitor, Channel B's trip, and then — this is the part
// worth knowing before you plan a rack — exactly ONE of the eight outlets. The
// other seven are on the back panel, which Penn Elcom state outright for the
// TR1 and which the photographs confirm for the rest.
//
// `inlet`/`link` differ per model, `socket` is whichever outlet family it is.
// Positions are proportional to the photographs; every connector is drawn at
// its true size, so the fit is real even where the spacing is eyeballed.
const pdu16Front = ({ inlet, link, socket, model }) => ({
  elements: [
    { t: 'screw', x: 98, y: 118 },
    { t: inlet, x: inlet === 'cee32_1_in' ? 190 : 182, y: 100, lbl: 'MAINS IN' },
    { t: 'breaker', x: 304, y: 100 },
    { t: link, x: 423, y: 100, lbl: 'THRU LINK' },
    { t: 'display', x: 628, y: 100, w: 114, h: 62 },
    { t: 'breaker', x: 750, y: 100 },
    { t: socket, x: 835, y: 100, lbl: 'OUT 1' },
  ],
  labels: [
    { text: 'GROUND', x: 98, y: 86, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL A', x: 304, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'THRU LINK', x: 304, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'POWER MONITOR', x: 628, y: 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL B', x: 750, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: '8 SOCKETS', x: 750, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: model, x: 900, y: 44, size: 13, ls: .8, anchor: 'end' },
  ],
});

// The PDU32 two-channel units put NOTHING on the front but the inlet, the two
// bank trips and the monitor — all eight outputs are on the back, four per
// channel, colour coded A grey / B yellow.
const pdu32Front = (inlet) => ({
  elements: [
    { t: 'screw', x: 100, y: 118 },
    { t: inlet, x: 213, y: 100, lbl: 'MAINS IN' },
    { t: 'breaker', x: 382, y: 100 },
    { t: 'display', x: 568, y: 100, w: 114, h: 62 },
    { t: 'breaker', x: 745, y: 100 },
  ],
  labels: [
    { text: 'GROUND', x: 100, y: 86, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL A', x: 382, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'A1-A4', x: 382, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'POWER MONITOR', x: 568, y: 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL B', x: 745, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'B1-B4', x: 745, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'PDU32', x: 900, y: 44, size: 13, ls: .8, anchor: 'end' },
  ],
});

// Seven of the eight outlets, on the back. Numbered from 2 because socket 1 is
// the one on the front.
const pdu16Rear = (socket) => ({ auto: [
  { t: socket, n: 7, lbl: ['OUT 2', 'OUT 3', 'OUT 4', 'OUT 5', 'OUT 6', 'OUT 7', 'OUT 8'] },
] });

export const PENN_ELCOM = [
  // --- Penn Elcom rack power distribution ------------------------------------
  // From Penn Elcom's own product pages: socket inventory, circuit structure,
  // weights and the 2U height are all stated there, and the front layouts are
  // drawn from their product photography.
  //
  // DEPTH is the soft figure. Penn Elcom quote "Case Size" with the three
  // numbers in a different order on almost every page — 140x98x430, 88x140x430,
  // 87x98x430 — where 430 is plainly the body width (483 over the ears) and
  // 87/88 is the 2U height. That leaves 98 and 140 both claiming to be depth.
  // 140 is used throughout because understating a depth is the direction that
  // puts a device in a rack it does not fit; all are marked approx.
  //
  // Power draw is 0: a PDU dissipates nothing worth counting, and its job in a
  // rack total is to be the thing everything else is plugged into.
  { id: 'penn-pdu16-uk', brand: 'Penn Elcom', model: 'PDU16-UK', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16-amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-uk',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },

  { id: 'penn-pdu16-uk32', brand: 'Penn Elcom', model: 'PDU16-UK32', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32-amp-ac-rack-mount-pdu-with-8-x-uk-sockets-pdu16-uk32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },

  { id: 'penn-pdu16-eu', brand: 'Penn Elcom', model: 'PDU16-EU', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-eu',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'socket_thru', model: 'PDU16' }),
    rear: pdu16Rear('socket_thru') },

  { id: 'penn-pdu16-eu32', brand: 'Penn Elcom', model: 'PDU16-EU32', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32a-ac-pdu-with-8-x-schuko-sockets-overload-protection-and-power-monitoring-pdu16-eu32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'socket_thru', model: 'PDU16' }),
    rear: pdu16Rear('socket_thru') },

  { id: 'penn-pdu16-pc', brand: 'Penn Elcom', model: 'PDU16-PC', category: 'power',
    ru: 2, depth: 140, weight: 2.0, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-pc',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'powercon_thru', model: 'PDU16' }),
    rear: pdu16Rear('powercon_thru') },

  { id: 'penn-pdu16-pc32', brand: 'Penn Elcom', model: 'PDU16-PC32', category: 'power',
    ru: 2, depth: 140, weight: 2.5, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32-amp-ac-rack-mount-pdu-with-8-x-neutrik-powercon-sockets-pdu16-pc32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'powercon_thru', model: 'PDU16' }),
    rear: pdu16Rear('powercon_thru') },

  // The one Penn Elcom spell out: "One at front, seven on the back panel."
  { id: 'penn-pdu16-uk-tr1', brand: 'Penn Elcom', model: 'PDU16-UK-TR1', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16-amp-rack-mount-pdu-with-overload-protection-and-power-monitoring-tru1-pdu16-uk-tr1',
    front: pdu16Front({ inlet: 'true1_in', link: 'true1_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },

  // Two-channel 32 A: one inlet, two banks of four, nothing on the front but
  // the inlet, the two bank trips and the monitor.
  { id: 'penn-pdu32-cf', brand: 'Penn Elcom', model: 'PDU32-CF', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-c-form-socket-input-pdu32-cf',
    front: pdu32Front('cee32_1_in'),
    rear: { auto: [
      { t: 'powercon_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'powercon_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },

  { id: 'penn-pdu32-ctr1', brand: 'Penn Elcom', model: 'PDU32-CTR1', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-c-form-socket-input-powercon-tru1-output-pdu32-ctr1',
    front: pdu32Front('cee32_1_in'),
    rear: { auto: [
      { t: 'true1_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'true1_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },

  // Fed on powerCON rather than C-Form: Neutrik NAC3MP-HC, the 32 A one.
  { id: 'penn-pdu32-pc', brand: 'Penn Elcom', model: 'PDU32-PC', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-powercon-input-pdu32-pc',
    front: pdu32Front('powercon_in'),
    rear: { auto: [
      { t: 'powercon_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'powercon_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },
];
