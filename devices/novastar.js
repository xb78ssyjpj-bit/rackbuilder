// NovaStar — 3 LED display controllers
//
// PROVENANCE. Haiku research pass over NovaStar's own manuals and
// specification PDFs on oss.novastar.tech, which are directly downloadable.
// The figures were NOT independently re-checked, by instruction — TODO §8g.
//
// The first pass on these was wrong in ways worth recording, because they are
// the failure modes of the method rather than of the brand: it marked two
// 483.6 mm units as not rack-mountable, left RU "not established" while
// quoting the height in mm beside it, and returned placeholder connector lists
// ("Video_inputs", "Ethernet_outputs_10x") instead of sockets. Sent back with
// those named, it produced the lists below from the actual PDFs.
//
// EVERY ONE OF THESE IS A FRACTIONAL RACK UNIT, and none of them fits the
// whole-U height its marketing implies:
//
//   MX40 Pro   94.2 mm = 2.12 U      VX1000  50.1 mm = 1.13 U
//   VX6S       51.4 mm = 1.16 U
//
// So they carry `ru` as the true fraction, the same call the Barco PDS-4K's
// 1.5 U got. That matters in a rack drawing: a 94.2 mm box does NOT go in 2 U
// of space, and `usedU` ceilings, so the summary correctly reserves three rows
// for the MX40 Pro rather than two.
//
// BOTH FACES ARE `auto`. No panel figure was obtained for any of them, so the
// inventory and the connector sizes are real and the left-to-right order is
// the layout engine's.

export const NOVASTAR = [
  // 2.12U all-in-one controller. 482.6 x 94.2 x 467 mm, 7.5 kg, 95 W max.
  // 20 Gigabit outputs and 4 10G optical, reconfigurable in firmware between
  // 20-port and 40-port modes — the SOCKET count is what is drawn, since the
  // mode changes what they carry rather than how many there are.
  { id: 'novastar-mx40-pro', brand: 'NovaStar', model: 'MX40 Pro',
    category: 'video', ru: 2.2, depth: 467, weight: 7.5, powerMax: 95,
    approx: true,
    src: 'https://www.novastar.tech/products/mx40-pro/',
    front: { auto: [
      { t: 'usba', n: 1, lbl: 'USB' },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'hdmi', n: 3, lbl: 'HDMI 2.0 IN' },
      { t: 'displayport', n: 1, lbl: 'DP 1.2 IN' },
      { t: 'bnc', n: 1, lbl: '12G-SDI IN' },
      { t: 'rj45', n: 20, lbl: 'OUT' },
      { t: 'sfp', n: 4, lbl: 'OPT' },
    ] } },

  // 1.13U all-in-one controller. 483.6 x 50.1 x 351.2 mm, 4.0 kg.
  // NO POWER FIGURE — NovaStar's specification does not give one, and neither
  // does it name the mains inlet, so the IEC below is this library's assumption
  // in the same way the Behringer S16's is. TODO §8g.
  { id: 'novastar-vx1000', brand: 'NovaStar', model: 'VX1000',
    category: 'video', ru: 1.2, depth: 351, weight: 4, approx: true,
    src: 'https://www.novastar.tech/products/vx1000/',
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'bnc', n: 1, lbl: '3G-SDI IN' },
      { t: 'hdmi', n: 2, lbl: 'HDMI 1.4 IN' },
      { t: 'dsub', n: 2, lbl: 'DVI IN' },
      { t: 'rj45', n: 10, lbl: 'OUT' },
    ] } },

  // 1.16U all-in-one controller. 483.6 x 51.4 x 276.4 mm, 2.71 kg.
  // Same missing power figure and same assumed inlet as the VX1000.
  //
  // The two DVI loop/monitor outputs are drawn as `dsub`, which is what this
  // library has: there is no DVI primitive, and DVI-I, DVI-D and DVI-A are
  // three different pinouts in one shell. TODO §9b.
  { id: 'novastar-vx6s', brand: 'NovaStar', model: 'VX6S',
    category: 'video', ru: 1.2, depth: 276, weight: 2.71, approx: true,
    src: 'https://www.novastar.tech/products/vx6s/',
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'bnc', n: 2, lbl: '3G-SDI IN' },
      { t: 'hdmi', n: 2, lbl: 'HDMI IN' },
      { t: 'dsub', n: 2, lbl: 'DVI IN' },
      { t: 'dsub', n: 1, lbl: 'DVI LOOP OUT' },
      { t: 'dsub', n: 1, lbl: 'DVI MONITOR' },
      { t: 'usba', n: 2, lbl: 'USB 2.0' },
      { t: 'rj45', n: 6, lbl: 'OUT' },
    ] } },
];
