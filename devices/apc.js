// APC — 2 devices

export const APC = [
  // ----------------------------------------------------------------- power ---
  // Rack UPS: the front is a status display and buttons, the outlets are all on
  // the rear. Outlet counts and inlet types are exact, from the NetBox YAML.

  { id: 'apc-smt3000rmi2u', brand: 'APC', model: 'Smart-UPS SMT3000RMI2U',
    category: 'power', ru: 2, depth: 660, weight: 45, approx: true,
    src: 'https://www.apc.com/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'APC', x: 100, y: 84, size: 18, ls: 1.2 },
      { text: 'Smart-UPS 3000', x: 100, y: 116, size: 10, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 8 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },

  // 1U metered rack PDU — unlike the UPS above, a horizontal PDU carries its
  // outlets on the same face as the display.
  { id: 'apc-ap7821', brand: 'APC', model: 'Rack PDU AP7821', category: 'power',
    ru: 1, depth: 250, weight: 3.5, approx: true,
    src: 'https://www.apc.com/',
    front: { elements: [
      { t: 'display', x: 170, y: 50, w: 80, h: 40 },
      { t: 'iec_thru', x: 320, y: 50, n: 8, gap: 66 },
      { t: 'rj45', x: 862, y: 50 },
    ], labels: [
      { text: 'APC', x: 80, y: 34, size: 10, ls: .8 },
      { text: 'AP7821', x: 80, y: 74, size: 7, ls: .3 },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
];
