// Sennheiser — 16 devices

export const SENNHEISER = [
  // ----------------------------------------------------------- Sennheiser ---
  // Almost the whole evolution wireless range is a 212 mm half-rack box — which
  // is HALF_W to within a millimetre — carried in a GA 3 tray. So these are
  // `half: true` and want a shelf, exactly like the other half-rack gear.
  //
  // Band SKUs are NOT separate library entries: pick the band per unit in the
  // inspector. Two receivers in one rack are routinely on different bands.
  //
  // Front-panel element order for EW-D EM is straight from Sennheiser's own
  // product-overview page. The G3/G4 shells follow the "Operating Elements on
  // the Front of the Device" list in the evolution wireless manuals. Exact
  // positions are proportioned from those lists, not from a dimensioned drawing.

  { id: 'senn-em100-g3', brand: 'Sennheiser', model: 'EM 100 G3', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10792/EM_300_G3_Manual_12_2016_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'EM 100 G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-em300-g3', brand: 'Sennheiser', model: 'EM 300 G3', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10792/EM_300_G3_Manual_12_2016_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'EM 300 G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  // Same shell as the receivers — the IEM transmitter's audio is on the rear.
  { id: 'senn-sr300-iem-g3', brand: 'Sennheiser', model: 'SR 300 IEM G3',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/3078/SR_300_IEM_G3__03_2013.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'SR 300 IEM G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'combo', n: 2 }, { t: 'jack', n: 1 }, { t: 'bnc', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // G4 adds a SYNC button and a warning LED to the G3 shell.
  { id: 'senn-em100-g4', brand: 'Sennheiser', model: 'EM 100 G4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A1: 470 - 516 MHz', 'A: 516 - 558 MHz', 'AS: 520 - 558 MHz',
            'G: 566 - 608 MHz', 'GB: 606 - 648 MHz', 'B: 626 - 668 MHz',
            'C: 734 - 776 MHz', 'D: 780 - 822 MHz', '1G8: 1785 - 1800 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10001/SP_1117_v2.0_EM_100_G4_Product_Specification_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'EM 100 G4', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-em300-500-g4', brand: 'Sennheiser', model: 'EM 300-500 G4',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['AW+: 470 - 558 MHz', 'AS: 520 - 558 MHz', 'GW1: 558 - 608 MHz',
            'GW: 558 - 626 MHz', 'GBW: 606 - 678 MHz', 'BW: 626 - 698 MHz',
            'CW: 718 - 790 MHz', 'DW: 780 - 865 MHz'],
    src: 'https://www.manualslib.com/manual/1846086/Sennheiser-Evolution-Wireless-G4.html',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 344, y: 54, w: 24, h: 16 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'EM 300-500 G4', x: 196, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-sr-iem-g4', brand: 'Sennheiser', model: 'SR IEM G4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A1: 470 - 516 MHz', 'A: 516 - 558 MHz', 'AS: 520 - 558 MHz',
            'G: 566 - 608 MHz', 'GB: 606 - 648 MHz', 'B: 626 - 668 MHz',
            'C: 734 - 776 MHz', 'D: 780 - 822 MHz', '1G8: 1785 - 1800 MHz'],
    src: 'https://www.fullcompass.com/common/files/40342-SRIEMG4Datasheet.pdf',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 344, y: 54, w: 24, h: 16 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'SR IEM G4', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'combo', n: 2 }, { t: 'jack', n: 1 }, { t: 'bnc', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // Front elements confirmed one-for-one against Sennheiser's product overview:
  // LINK and DATA LEDs, display, UP/DOWN/SET, SYNC, ESC, ON/OFF. There is NO
  // headphone output on the EW-D EM — that arrives with the EW-DX EM 2.
  { id: 'senn-ewd-em', brand: 'Sennheiser', model: 'EW-D EM', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 189, weight: 1.0, power: 3.6,
    bands: ['Q1-6: 470.2 - 526 MHz', 'R1-6: 520 - 576 MHz', 'R4-9: 552 - 607.8 MHz',
            'S1-7: 606.2 - 662 MHz', 'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-d/ew-d/ew-d-em-overview.html',
    front: { elements: [
      { t: 'led', x: 30, y: 54 },
      { t: 'led', x: 50, y: 54 },
      { t: 'display', x: 170, y: 54, w: 160, h: 46 },
      { t: 'button', x: 272, y: 54, w: 20, h: 16 },
      { t: 'button', x: 298, y: 54, w: 20, h: 16 },
      { t: 'button', x: 324, y: 54, w: 20, h: 16 },
      { t: 'button', x: 350, y: 54, w: 20, h: 16 },
      { t: 'button', x: 380, y: 54, w: 20, h: 16 },
      { t: 'button', x: 412, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'EW-D', x: 24, y: 22, size: 10, ls: .8 },
      { text: 'EW-D EM', x: 170, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // Two-channel: one OLED per channel, then headphone + volume, jog and standby.
  // 212 x 44 x 189 mm, 1.0 kg, max 12 W — from Sennheiser's own product page.
  { id: 'senn-ewdx-em2', brand: 'Sennheiser', model: 'EW-DX EM 2', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 189, weight: 1.0, power: 12,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'V5-7: 941.7 - 959.65 MHz',
            'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-2/ew-dx-em-2-q1-9-509342',
    front: { elements: [
      { t: 'display', x: 92, y: 52, w: 118, h: 50 },
      { t: 'display', x: 218, y: 52, w: 118, h: 50 },
      { t: 'trs', x: 305, y: 54 },
      { t: 'knob', x: 342, y: 54, r: 10 },
      { t: 'encoder', x: 380, y: 54, r: 15 },
      { t: 'button', x: 416, y: 54, w: 18, h: 22 },
    ], labels: [
      { text: 'EW-DX EM 2', x: 30, y: 14, size: 9, ls: .5 },
      { text: '1', x: 92, y: 92, size: 8, anchor: 'middle' },
      { text: '2', x: 218, y: 92, size: 8, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'ts', n: 2 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  // Same chassis and front panel as the EM 2; the rear gains Dante ports.
  // Depth is taken from the EM 2 because the two share a housing — dealer
  // listings disagree on a shallower figure that could not be confirmed.
  { id: 'senn-ewdx-em2-dante', brand: 'Sennheiser', model: 'EW-DX EM 2 Dante',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 189, weight: 1.0, power: 12, approx: true,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'V5-7: 941.7 - 959.65 MHz',
            'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-2-dante/ew-dx-em-2-dante-q1-9-509356',
    front: { elements: [
      { t: 'display', x: 92, y: 52, w: 118, h: 50 },
      { t: 'display', x: 218, y: 52, w: 118, h: 50 },
      { t: 'trs', x: 305, y: 54 },
      { t: 'knob', x: 342, y: 54, r: 10 },
      { t: 'encoder', x: 380, y: 54, r: 15 },
      { t: 'button', x: 416, y: 54, w: 18, h: 22 },
    ], labels: [
      { text: 'EW-DX EM 2 DANTE', x: 30, y: 14, size: 8, ls: .4 },
      { text: '1', x: 92, y: 92, size: 8, anchor: 'middle' },
      { text: '2', x: 218, y: 92, size: 8, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'rj45', n: 3 },
      { t: 'dcjack', n: 1 },
    ] } },

  // The only full-width unit in the range: 483 x 44 x 373 mm, 4.56 kg, max 37 W,
  // internal PSU on an IEC inlet, four assignable network ports and an
  // integrated antenna splitter that daisy-chains four units to 16 channels.
  { id: 'senn-ewdx-em4-dante', brand: 'Sennheiser', model: 'EW-DX EM 4 Dante',
    category: 'wireless', ru: 1, depth: 373, weight: 4.56, power: 37,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V5-7: 941.7 - 959.65 MHz', 'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-4-dante/ew-dx-em-4-dante-q1-9-509370',
    front: { elements: [
      { t: 'display', x: 300, y: 50, w: 300, h: 58 },
      { t: 'encoder', x: 500, y: 50, r: 19 },
      { t: 'button', x: 560, y: 50, w: 36, h: 20 },
      { t: 'button', x: 610, y: 50, w: 36, h: 20 },
      { t: 'led', x: 670, y: 50, n: 4, gap: 26 },
      { t: 'trs', x: 800, y: 50 },
      { t: 'knob', x: 852, y: 50, r: 12 },
      { t: 'button', x: 900, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'sennheiser', x: 70, y: 42, size: 11, ls: .5 },
      { text: 'EW-DX EM 4', x: 70, y: 64, size: 9, ls: .5 },
      { text: 'SYNC', x: 560, y: 76, size: 7, anchor: 'middle' },
      { text: 'ESC', x: 610, y: 76, size: 7, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 4 }, { t: 'rj45', n: 4 },
      { t: 'iec_in', n: 1 },
    ] } },

  // Antenna splitters. Sennheiser's product overview is explicit that the BNCs
  // are on the REAR — two rows of four outputs plus the antenna inputs, the
  // cascade output and DC in. The front is only a standby button and its LED.
  { id: 'senn-asa-214', brand: 'Sennheiser', model: 'ASA 214', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 168, weight: 1.09, power: 3.4,
    bands: ['ASA 214-UHF: 470 - 870 MHz', 'ASA 214-1G8: 1785 - 1805 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-g4/ew-g4/specifications-asa214.html',
    front: { elements: [
      { t: 'button', x: 34, y: 54, w: 26, h: 20 },
      { t: 'led', x: 70, y: 54 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'ASA 214', x: 250, y: 60, size: 15, ls: 1, anchor: 'middle' },
      { text: 'ACTIVE ANTENNA SPLITTER', x: 250, y: 78, size: 7, ls: .4,
        anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 11 }, { t: 'dcjack', n: 1 }] } },

  { id: 'senn-ewd-asa', brand: 'Sennheiser', model: 'EW-D ASA', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 168, weight: 1.1, power: 2.9, approx: true,
    bands: ['Q-R-S: 470 - 694 MHz', 'T-U-V-W: 694 - 1075 MHz',
            'X-Y: 1350 - 1805 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-d/ew-d/ew-d-asa-overview.html',
    front: { elements: [
      { t: 'button', x: 34, y: 54, w: 26, h: 20 },
      { t: 'led', x: 70, y: 54 },
    ], labels: [
      { text: 'EW-D', x: 24, y: 22, size: 10, ls: .8 },
      { text: 'EW-D ASA', x: 250, y: 60, size: 15, ls: 1, anchor: 'middle' },
      { text: 'ACTIVE ANTENNA SPLITTER', x: 250, y: 78, size: 7, ls: .4,
        anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 11 }, { t: 'dcjack', n: 1 }] } },

  // The tray the half-rack units live in — mount one or two side by side, or one
  // unit plus an AM 2 to bring the antennas to the front. Modelled as a shelf so
  // the app's half-rack shelf rule applies to it.
  { id: 'senn-ga3', brand: 'Sennheiser', model: 'GA 3 rack tray', category: 'wireless',
    shelf: true, ru: 1, depth: 220, weight: 0.9, power: 0, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/accessories/ga-3/',
    front: { elements: [{ t: 'line', x: 500, y: 72, w: 840 }] } },

  // Front antenna feed-through: fills the spare half of a GA 3 with two BNC
  // bulkheads so the antennas land on the front of the rack.
  { id: 'senn-am2', brand: 'Sennheiser', model: 'AM 2 antenna front mount',
    category: 'wireless', half: true,
    ru: 1, depth: 80, weight: 0.2, power: 0, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/am-2/am-2-009912',
    front: { elements: [
      { t: 'bnc', x: 176, y: 56, n: 2, gap: 86 },
    ], labels: [
      { text: 'AM 2', x: 30, y: 22, size: 9, ls: .5 },
      { text: 'ANT A', x: 176, y: 92, size: 7, ls: .3, anchor: 'middle' },
      { text: 'ANT B', x: 262, y: 92, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 2 }] } },

  // Sennheiser's bidirectional wideband flagship. Dimensions, weight and the
  // 70 W figure are from Sennheiser's own spec page; the front-panel INVENTORY
  // (OLED, jog wheel, headphone out with volume) is confirmed but the exact
  // positions are not — no orthographic front view could be obtained, so only
  // confirmed elements are drawn, in the EW-DX house style. See TODO.
  { id: 'senn-spectera-base', brand: 'Sennheiser', model: 'Spectera Base Station',
    category: 'wireless', ru: 1, depth: 373, weight: 6.3, power: 70, approx: true,
    src: 'https://docs.cloud.sennheiser.com/en-us/spectera-solution/spectera/spec-base-station.html',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 300, h: 56 },
      { t: 'encoder', x: 620, y: 50, r: 19 },
      { t: 'button', x: 684, y: 50, w: 30, h: 20 },
      { t: 'trs', x: 780, y: 50 },
      { t: 'knob', x: 840, y: 50, r: 13 },
      { t: 'button', x: 895, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'sennheiser', x: 78, y: 42, size: 11, ls: .5 },
      { text: 'SPECTERA', x: 78, y: 66, size: 9, ls: .8 },
    ] },
    // RF distribution is done by the DAD antenna over Cat5e/PoE, not by a rack
    // splitter — there is no rack antenna unit in the Spectera range.
    rear: { auto: [
      { t: 'rj45', n: 7 }, { t: 'sfp', n: 2 }, { t: 'bnc', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  // ------------------------------------------------------------- charging ---
  // 19" 1U, four front-loading module bays. Each module (LM 6060/6061/6062 for
  // Digital 6000/9000, LM 6070 for EW-D/EW-DX/EW-DP) holds two packs, so a full
  // chassis charges eight. The modules are inserts, not rack units, so they are
  // not separate library entries — an empty bay ships with a dummy cap.
  { id: 'senn-l6000', brand: 'Sennheiser', model: 'L 6000 charging station',
    category: 'charging', ru: 1, depth: 373, weight: 5.1, power: 85, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/l-6000/l-6000-507300',
    front: { elements: [
      { t: 'bar', x: 245, y: 50, n: 4, gap: 190, w: 182, h: 78, rx: 4 },
      { t: 'bar', x: 200, y: 44, n: 4, gap: 190, w: 72, h: 44, rx: 3 },
      { t: 'bar', x: 290, y: 44, n: 4, gap: 190, w: 72, h: 44, rx: 3 },
      { t: 'led', x: 200, y: 80, n: 4, gap: 190 },
      { t: 'led', x: 290, y: 80, n: 4, gap: 190 },
    ], labels: [
      { text: 'sennheiser', x: 70, y: 44, size: 9, ls: .5 },
      { text: 'L 6000', x: 70, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 1 }, { t: 'iec_in', n: 1 }] } },
];
