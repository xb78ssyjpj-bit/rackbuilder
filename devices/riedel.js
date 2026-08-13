// Riedel — 8 devices

export const RIEDEL = [
  // ---------------------------------------------------------------- Riedel ---
  // Drawn from the dimensioned line elevations in Riedel's own manuals and
  // datasheets. The Artist frames are card-based: the card slot count and the PSU
  // arrangement are what you actually need off a rack drawing, so those are what
  // is drawn, rather than the detail of whichever cards happen to be fitted.
  //
  // Frame wattage figures are PSU ratings, not measured draw, and the frames are
  // dual-PSU for redundancy so the two do not add up.

  { id: 'riedel-artist-1024', brand: 'Riedel', model: 'Artist-1024', category: 'comms',
    ru: 2, depth: 404, weight: 6.3, power: 225, approx: true,
    src: 'https://www.riedel.net/en/products-solutions/intercom/artist',
    front: { elements: [
      // 10 card bays across the full 2U height, then the info display module
      { t: 'vline', x: 141, y: 100, h: 184, n: 9, gap: 78.8 },
      { t: 'sfp', x: 101, y: 46, n: 10, gap: 78.8 },
      { t: 'sfp', x: 101, y: 84, n: 10, gap: 78.8 },
      { t: 'rj45', x: 101, y: 128, n: 10, gap: 78.8 },
      { t: 'usbc', x: 101, y: 168, n: 10, gap: 78.8 },
      { t: 'vline', x: 850, y: 100, h: 188 },
      { t: 'display', x: 890, y: 96, w: 70, h: 44 },
      { t: 'knob', x: 890, y: 158, r: 15 },
    ], labels: [
      { text: 'RIEDEL', x: 890, y: 44, size: 9, ls: .6, anchor: 'middle' },
      { text: 'ARTIST-1024', x: 890, y: 192, size: 6.5, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 2 }, { t: 'fan', n: 2 }] } },

  { id: 'riedel-artist-128', brand: 'Riedel', model: 'Artist 128', category: 'comms',
    ru: 6, depth: 380, weight: 11.8, power: 400, approx: true,
    // 11.8 kg is the frame with both PSUs and the fan tray; cards add to that.
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      // upper zone: 20 card slots, including the two redundant CPU bays
      { t: 'vline', x: 106, y: 148, h: 276, n: 19, gap: 43.8 },
      { t: 'rj45', x: 84, y: 106, n: 20, gap: 43.8 },
      { t: 'led', x: 84, y: 196, n: 20, gap: 43.8 },
      { t: 'line', x: 500, y: 296, w: 876 },
      // lower zone: two PSU bricks, four fans and three status LEDs each
      { t: 'fan', x: 140, y: 384, n: 4, gap: 96, r: 34 },
      { t: 'fan', x: 578, y: 384, n: 4, gap: 96, r: 34 },
      { t: 'vline', x: 500, y: 446, h: 280 },
      { t: 'led', x: 120, y: 476, n: 3, gap: 24 },
      { t: 'led', x: 558, y: 476, n: 3, gap: 24 },
    ], labels: [
      { text: 'PSU 2', x: 120, y: 512, size: 9, ls: .5 },
      { text: 'PSU 1', x: 558, y: 512, size: 9, ls: .5 },
      { text: 'RIEDEL', x: 120, y: 556, size: 14, ls: 1.2 },
      { text: 'ARTIST 128', x: 120, y: 580, size: 11, ls: .6 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 20 }, { t: 'dsub', n: 2 }] } },

  { id: 'riedel-artist-64', brand: 'Riedel', model: 'Artist 64', category: 'comms',
    ru: 3, depth: 380, weight: 5.6, power: 250, approx: true,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      // fan module left, 8 card bays plus 2 CPU bays centre, 2 PSUs right
      { t: 'fan', x: 114, y: 90, r: 38 },
      { t: 'fan', x: 114, y: 210, r: 38 },
      { t: 'vline', x: 167, y: 150, h: 280 },
      { t: 'vline', x: 789, y: 150, h: 280 },
      { t: 'bar', x: 322, y: 30, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 90, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 150, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 210, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 270, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'rj45', x: 220, y: 30, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 90, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 150, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 210, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 270, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 30, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 90, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 150, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 210, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 270, n: 2, gap: 311 },
      { t: 'bar', x: 863, y: 90, w: 130, h: 118, rx: 3 },
      { t: 'bar', x: 863, y: 220, w: 130, h: 118, rx: 3 },
      { t: 'led', x: 841, y: 90, n: 3, gap: 22 },
      { t: 'led', x: 841, y: 220, n: 3, gap: 22 },
    ], labels: [
      { text: 'RIEDEL', x: 863, y: 20, size: 8, ls: .6, anchor: 'middle' },
      { text: 'ARTIST 64', x: 863, y: 296, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 10 }, { t: 'dsub', n: 2 }] } },

  { id: 'riedel-artist-32', brand: 'Riedel', model: 'Artist 32', category: 'comms',
    ru: 2, depth: 380, weight: 5.15, power: 200, approx: true,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      { t: 'fan', x: 92, y: 100, n: 3, gap: 35, r: 16 },
      { t: 'vline', x: 193, y: 100, h: 184 },
      { t: 'vline', x: 807, y: 100, h: 184 },
      { t: 'bar', x: 346, y: 34, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'bar', x: 346, y: 100, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'bar', x: 346, y: 166, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'rj45', x: 250, y: 34, n: 2, gap: 307 },
      { t: 'rj45', x: 250, y: 100, n: 2, gap: 307 },
      { t: 'rj45', x: 250, y: 166, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 34, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 100, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 166, n: 2, gap: 307 },
      { t: 'bar', x: 872, y: 55, w: 124, h: 76, rx: 3 },
      { t: 'bar', x: 872, y: 145, w: 124, h: 76, rx: 3 },
      { t: 'led', x: 852, y: 78, n: 3, gap: 20 },
      { t: 'led', x: 852, y: 168, n: 3, gap: 20 },
    ], labels: [
      { text: 'RIEDEL', x: 127, y: 42, size: 9, ls: .6, anchor: 'middle' },
      { text: 'ARTIST 32', x: 127, y: 168, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 6 }, { t: 'dsub', n: 2 }] } },

  // Half-width stagebox. The rack kit (RMK-001) is a separate carrier frame, so
  // this is NOT an eared unit — it wants the kit or a shelf.
  { id: 'riedel-nsa-002a', brand: 'Riedel', model: 'NSA-002A', category: 'comms',
    half: true, ru: 1, depth: 276, weight: 1.77, power: 25,
    src: 'https://www.riedel.net/fileadmin/user_upload/11-products_neu/intercom/NSA/NSA-002A/NSA-002A_Datasheet_A10_.20230731135233420.pdf',
    front: { elements: [
      { t: 'xlrf', x: 34, y: 56, n: 4, gap: 52 },
      { t: 'xlrm', x: 242, y: 56, n: 4, gap: 52 },
    ], labels: [
      { text: 'NSA-002A', x: 10, y: 16, size: 7, ls: .4 },
      { text: 'IN 1-4', x: 139, y: 16, size: 8, ls: .4, anchor: 'middle' },
      { text: 'OUT 1-4', x: 347, y: 16, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'rj45', n: 2 },
      { t: 'dsub', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  // The 1U carrier that holds one or two NSA-002A. Modelled as a shelf so the
  // app's half-rack tray rule applies to it.
  { id: 'riedel-rmk-001', brand: 'Riedel', model: 'RMK-001 rack kit', category: 'comms',
    shelf: true, ru: 1, depth: 280, weight: 0.8, power: 0, approx: true,
    // Riedel publishes no dimensioned drawing for the bracket itself.
    src: 'https://www.riedel.net/en/products-solutions/intercom/bolero-wireless-intercom',
    front: { elements: [
      { t: 'line', x: 500, y: 72, w: 840 },
      { t: 'vline', x: 500, y: 50, h: 44 },
    ] } },

  // ------------------------------------------------------------- charging ---
  // 4U slide-out drawer carrying two 5-bay Bolero chargers, so ten bays face
  // front. Dimensioned front/side drawings are in the Bolero 3.1 manual.
  { id: 'riedel-bolero-drawer', brand: 'Riedel', model: 'Bolero charger drawer (10 bay)',
    category: 'charging', ru: 4, depth: 400, weight: 7.2, power: 120, approx: true,
    // 4.9 kg empty + 2 x 1.14 kg chargers; 2 x 60 W while charging ten packs.
    src: 'https://www.riedel.net/en/products-solutions/intercom/bolero-wireless-intercom',
    front: { elements: [
      { t: 'line', x: 500, y: 10, w: 856 },
      { t: 'usbc', x: 150, y: 100 },
      { t: 'usba', x: 195, y: 100 },
      { t: 'bar', x: 290, y: 100, n: 5, gap: 140, w: 108, h: 78, rx: 6 },
      { t: 'led', x: 290, y: 126, n: 5, gap: 140 },
      { t: 'usbc', x: 150, y: 300 },
      { t: 'usba', x: 195, y: 300 },
      { t: 'bar', x: 290, y: 300, n: 5, gap: 140, w: 108, h: 78, rx: 6 },
      { t: 'led', x: 290, y: 326, n: 5, gap: 140 },
      { t: 'line', x: 500, y: 390, w: 856 },
    ], labels: [
      { text: 'RIEDEL  BOLERO', x: 500, y: 196, size: 16, ls: 1.4, anchor: 'middle' },
      { text: 'CHARGER DRAWER  10 BAY', x: 500, y: 220, size: 9, ls: .6, anchor: 'middle' },
    ] } },

  { id: 'riedel-rsp-1216hl', brand: 'Riedel', model: 'SmartPanel RSP-1216HL',
    category: 'comms', ru: 1, depth: 138, weight: 2.3, power: 15,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/03.0-DataSheets-Intercom/1200_SmartPanels/RSP-1216HL_Datasheet.pdf',
    front: { elements: [
      { t: 'xlrf', x: 92, y: 52 },
      { t: 'xlrf', x: 146, y: 52 },
      { t: 'display', x: 320, y: 30, w: 256, h: 26 },
      { t: 'display', x: 600, y: 30, w: 276, h: 26 },
      // 16 hybrid lever keys, each with its own rotary encoder
      { t: 'button', x: 200, y: 72, n: 16, gap: 35, w: 26, h: 22 },
      { t: 'bar', x: 752, y: 38, w: 14, h: 14, rx: 3 },
      { t: 'led', x: 752, y: 74 },
      { t: 'display', x: 800, y: 32, w: 56, h: 24 },
      { t: 'mesh', x: 800, y: 74, w: 56, h: 22 },
      { t: 'knob', x: 858, y: 32, r: 11 },
      { t: 'usba', x: 858, y: 76 },
      { t: 'knob', x: 902, y: 54, r: 13 },
    ], labels: [
      { text: 'RSP-1216HL', x: 186, y: 96, size: 7, ls: .4 },
    ] } },
];
