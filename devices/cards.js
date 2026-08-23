import { registerCards } from '../panel.js';

// ---------------------------------------------------------------------------
// Option cards
// ---------------------------------------------------------------------------
// A card is a faceplate that fits a slot aperture, carrying its own connectors.
// It is NOT a rack item: it has no rack units and cannot be dragged into a bay.
// It is fitted to one device instance from the inspector, and from then on its
// sockets are that instance's sockets — they draw on the panel and they patch
// in the flow view like any other.
//
// `fmt` is the aperture standard, matching a device's `slots[].fmt`. That is
// the whole of the compatibility model: any card fits any slot of its format,
// which is exactly how the real ranges work — the five A&H cards below fit the
// SQ-Rack, the SQ-5/6/7, the SQ+ consoles and the AHM processors alike.
//
// No weight or power figures: A&H publish none per card, and the host's own
// consumption already covers a fitted card in practice. Inventing one would put
// a made-up number into a power total that gets used for real.
export const OPTION_CARDS = [
  // 1 x etherCON. A&H product photography of the card fitted to an SQ I/O Port.
  { id: 'ah-sq-slink', brand: 'Allen & Heath', model: 'SQ SLink', fmt: 'ah-sq-io',
    note: '128x128 @ 96kHz — gigaACE / GX / DX / dSnake',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-slink/',
    auto: [{ t: 'ethercon', n: 1, sig: 'slink', lbl: 'SLINK' }] },

  // "Two ports with redundant and switch modes ... Locking Ethercon connectors".
  //
  // These are the current products. A&H's AHM guides warn to use the M-SQ-DANT32
  // or M-SQ-DANT64 (SQ Dante V2) card in an AHM rather than the original
  // M-SQ-DANTE, and the 64x64 card's V1 revision is SQ-only. The library holds
  // one entry per product, not per board revision, so that caveat is recorded
  // here rather than modelled — a second-hand V1 card will not work in an AHM.
  { id: 'ah-sq-dante32', brand: 'Allen & Heath', model: 'SQ Dante 32x32', fmt: 'ah-sq-io',
    note: '32x32 @ 48/96kHz, AES67',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-dante-32/',
    auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }] },
  { id: 'ah-sq-dante64', brand: 'Allen & Heath', model: 'SQ Dante 64x64', fmt: 'ah-sq-io',
    note: '64x64 @ 48/96kHz, AES67',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-dante-64/',
    auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }] },

  // 2 x etherCON, faceplate lettered 'SoundGrid 1' and 'SoundGrid 2'.
  { id: 'ah-sq-waves', brand: 'Allen & Heath', model: 'SQ Waves', fmt: 'ah-sq-io',
    note: '64x64 @ 48/96kHz Waves SoundGrid',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-waves/',
    auto: [{ t: 'ethercon', n: 2, sig: 'soundgrid', lbl: ['SOUNDGRID 1', 'SOUNDGRID 2'] }] },

  // Five BNC: two out over two in, then the switchable in/out word clock.
  // The stacked pairs are how the faceplate is actually arranged.
  { id: 'ah-sq-madi', brand: 'Allen & Heath', model: 'SQ MADI', fmt: 'ah-sq-io',
    note: '64x64 @ 48kHz / 32x32 @ 96kHz per pair',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-madi/',
    auto: [
      { t: 'bnc', n: 4, stack: 2, sig: 'madi',
        lbl: ['MADI 1 OUT', 'MADI 1 IN', 'MADI 2 OUT', 'MADI 2 IN'] },
      { t: 'bnc', n: 1, lbl: 'SYNC' },
    ] },

  // --- Allen & Heath dLive / Avantis ---------------------------------------
  // Every one from A&H's own fitting note for that card. They all fit the same
  // I/O Port, which the dLive MixRacks, the dLive Surfaces and Avantis share —
  // the fitting notes say "an Allen & Heath Avantis or dLive I/O Port" verbatim.
  //
  // Not included: M-DL-ADAPT, the 'letter-box' adapter. It is a slot inside a
  // slot — it puts an iLive/GLD aperture inside a dLive one to host M-Dante,
  // M-Waves, M-ES-V2, M-ACE or M-MADI — and modelling it as a card with no
  // connectors would draw it as a blank plate, which is exactly what it is not.
  { id: 'ah-dl-dant64', brand: 'Allen & Heath', model: 'Dante 64x64 (M-DL-DANT64)',
    fmt: 'ah-dl-io', note: '64x64 Dante, Primary / Secondary, redundant or switched',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40487771409937',
    auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }] },
  { id: 'ah-dl-dant128', brand: 'Allen & Heath', model: 'Dante 128x128 (M-DL-DANT128)',
    fmt: 'ah-dl-io', note: '128x128 Dante, Primary / Secondary, redundant or switched',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40487771409937',
    auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }] },

  // 4 ports, each 32x32 @ 96kHz, parallel or redundant in pairs.
  { id: 'ah-dl-dxlink', brand: 'Allen & Heath', model: 'DX Link (M-DL-DXLINK)',
    fmt: 'ah-dl-io', note: '4 x DX Link, 32x32 @ 96kHz each',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40490513360785',
    auto: [{ t: 'ethercon', n: 4, sig: 'dx', lbl: 'DX LINK' }] },

  { id: 'ah-dl-gace', brand: 'Allen & Heath', model: 'gigaACE (M-DL-GACE)',
    fmt: 'ah-dl-io', note: '128x128 @ 96kHz point-to-point to another dLive / Avantis',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40496737174801',
    auto: [{ t: 'ethercon', n: 1, sig: 'gigaace', lbl: 'GIGAACE A' }] },

  // One logical port A on two physical connectors — fibre or copper, by mode.
  { id: 'ah-dl-gopt', brand: 'Allen & Heath', model: 'fibreACE (M-DL-GOPT)',
    fmt: 'ah-dl-io', note: '128x128 @ 96kHz over fibre or copper, opticalCON Duo',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40495217801233',
    auto: [
      { t: 'opticalcon', n: 1, lbl: 'PORT A OPTICAL' },
      { t: 'ethercon', n: 1, lbl: 'PORT A COPPER' },
    ] },

  // "A built-in Gigabit switch with 3 locking EtherCon ports" — three, not two.
  { id: 'ah-dl-waves3', brand: 'Allen & Heath', model: 'Waves V3 (M-DL-WAVES3)',
    fmt: 'ah-dl-io', note: '128x128 @ 48/96kHz Waves SoundGrid, 3-port switch',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40488232359569',
    auto: [{ t: 'ethercon', n: 3, sig: 'soundgrid', lbl: 'SOUNDGRID' }] },

  // Links 1-4 on BNC, links 5-8 on SFP cages for fibre.
  { id: 'ah-dl-smadi', brand: 'Allen & Heath', model: 'superMADI (M-DL-SMADI)',
    fmt: 'ah-dl-io', note: '128x128 @ 48/96kHz AES10 MADI, coax and optional fibre',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40502416581905',
    auto: [
      { t: 'bnc', n: 4, sig: 'madi', lbl: 'LINK' },
      { t: 'sfp', n: 4, sig: 'madi', lbl: ['LINK 5', 'LINK 6', 'LINK 7', 'LINK 8'] },
    ] },

  // --- Apple Mac mini, as a bay in the Sonnet RackMac mini ------------------
  // The tray is a carrier and only ever holds Mac minis, so the machine is
  // modelled as the card. Ports are from Apple's own tech specs.
  //
  // REAR PORTS ONLY, because that is what a racked one gives you: Sonnet state
  // the tray exposes the machines' ports at the rear. The M2's front USB-C, and
  // the front headphone jack on later models, face into the rack and are not
  // modelled.
  //
  // NO MAINS INLET, deliberately. A Mac mini takes an IEC C7 — the two-pin
  // figure-of-eight — and this library has no C7 primitive. Drawing the C14
  // that `iec_in` gives would be a lie about what you can plug in, which is the
  // same call the Penn Elcom universal sockets got. Each machine still needs
  // its own mains lead. TODO §9b.
  //
  // ONE FIGURE IS IN DOUBT: the research pass put the headphone jack on the
  // FRONT of the M1 and M2. Apple moved the jack to the front with the M4, so
  // a rear jack on the M1/M2 is the likelier reading, and it is left out of
  // both rather than drawn on a face that may be wrong. TODO §9b.
  { id: 'apple-macmini-2018', brand: 'Apple', model: 'Mac mini (2018, Intel)',
    fmt: 'sonnet-macmini', note: 'Intel, 4 x Thunderbolt 3',
    src: 'https://support.apple.com/en-us/111912',
    auto: [
      { t: 'iec_c7_in', n: 1, lbl: 'POWER' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'usbc', n: 4, lbl: 'TB3' },
      { t: 'hdmi', n: 1, lbl: 'HDMI' },
      { t: 'usba', n: 2, lbl: 'USB-A' },
    ] },
  { id: 'apple-macmini-m1', brand: 'Apple', model: 'Mac mini (M1, 2020)',
    fmt: 'sonnet-macmini', note: '2 x Thunderbolt / USB 4',
    src: 'https://support.apple.com/en-us/111894',
    auto: [
      { t: 'iec_c7_in', n: 1, lbl: 'POWER' },
      { t: 'usbc', n: 2, lbl: 'TB4' },
      { t: 'hdmi', n: 1, lbl: 'HDMI' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'usba', n: 2, lbl: 'USB-A' },
    ] },
  { id: 'apple-macmini-m2', brand: 'Apple', model: 'Mac mini (M2, 2023)',
    fmt: 'sonnet-macmini', note: '2 x Thunderbolt 4',
    src: 'https://support.apple.com/en-us/111837',
    auto: [
      { t: 'iec_c7_in', n: 1, lbl: 'POWER' },
      { t: 'usbc', n: 2, lbl: 'TB4' },
      { t: 'hdmi', n: 1, lbl: 'HDMI' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'usba', n: 2, lbl: 'USB-A' },
    ] },
  { id: 'apple-macmini-m2pro', brand: 'Apple', model: 'Mac mini (M2 Pro, 2023)',
    fmt: 'sonnet-macmini', note: '4 x Thunderbolt 4',
    src: 'https://support.apple.com/en-us/111837',
    auto: [
      { t: 'iec_c7_in', n: 1, lbl: 'POWER' },
      { t: 'usbc', n: 4, lbl: 'TB4' },
      { t: 'hdmi', n: 1, lbl: 'HDMI' },
      { t: 'rj45', n: 1, lbl: 'ETHERNET' },
      { t: 'usba', n: 2, lbl: 'USB-A' },
    ] },

  // --- Barco Encore3 -------------------------------------------------------
  // Encore3 is BUILD-TO-ORDER with SEVEN physical card bays, and the bays are
  // not interchangeable — which is why `role` and `accepts` exist. One bay
  // takes an input card or the link card, two take input cards only, and four
  // are flex and take either. The spec sheet's "7 input-capable" and
  // "4 output-capable" describe overlapping uses of that ONE pool of seven,
  // not eleven bays; reading them as separate banks is the obvious mistake and
  // is the thing this comment exists to prevent.
  //
  // Connector complements and silkscreen are read off Barco's own rear-panel
  // photograph on the Encore3 product page, cross-referenced against the card
  // tables in manual R5917615. Figures NOT re-checked before entry — TODO §8g.
  //
  // ONE CONTRADICTION, LEFT AS BARCO LEFT IT. The manual's card table says the
  // Tri-combo carries "1x DP 1.2; 1x HDMI 2.0; 4x 12G-SDI (BNC)". Barco's own
  // rear photograph shows SIX individually numbered BNCs on the Tri-combo, on
  // both the In and the Out card. Every other count on that page matches the
  // spec sheet exactly, which is what makes the SDI figure the odd one rather
  // than the photograph. Six are drawn, because the photograph is the panel;
  // it may be that only four are electrically active, and Barco do not say.
  { id: 'barco-e3-link-100g', brand: 'Barco', model: 'Encore3 Quad 100G Link',
    fmt: 'barco-e3', role: 'link', note: '4 x 100G high-speed link',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [{ t: 'qsfp', n: 4, lbl: 'HIGH SPEED LINK' }] },

  { id: 'barco-e3-in-hdmi', brand: 'Barco', model: 'Encore3 HDMI 2.0 Quad Input',
    fmt: 'barco-e3', role: 'in', note: '4 x HDMI 2.0 in',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [{ t: 'hdmi', n: 4, lbl: 'IN HDMI 2.0' }] },

  { id: 'barco-e3-in-dp', brand: 'Barco', model: 'Encore3 DisplayPort 1.2 Quad Input',
    fmt: 'barco-e3', role: 'in', note: '4 x DisplayPort 1.2 in',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [{ t: 'displayport', n: 4, lbl: 'IN DP1.2' }] },

  // THE SIX BNCs ARE STACKED, and that is geometry rather than observation:
  // 141 mm of connector in one row cannot fit a bay that must be <= 100 mm for
  // seven of them to fit a 4 U face. Two columns of three is the arrangement
  // that follows. No photograph confirms it. TODO §8g.
  { id: 'barco-e3-in-tricombo', brand: 'Barco', model: 'Encore3 Tri-combo Input',
    fmt: 'barco-e3', role: 'in', note: '1 x DP 1.2, 1 x HDMI 2.0, 6 x 12G-SDI in',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [
      { t: 'displayport', n: 1, lbl: 'IN DP1.2' },
      { t: 'hdmi', n: 1, lbl: 'IN HDMI 2.0' },
      { t: 'bnc', n: 6, stack: 3, lbl: 'IN SDI' },
    ] },

  { id: 'barco-e3-out-tricombo', brand: 'Barco', model: 'Encore3 Tri-combo Output',
    fmt: 'barco-e3', role: 'out', note: '1 x DP 1.2, 1 x HDMI 2.0, 6 x 12G-SDI out',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [
      { t: 'displayport', n: 1, lbl: 'OUT DP1.2' },
      { t: 'hdmi', n: 1, lbl: 'OUT HDMI 2.0' },
      { t: 'bnc', n: 6, stack: 3, lbl: 'OUT SDI' },
    ] },

  { id: 'barco-e3-out-hdmi', brand: 'Barco', model: 'Encore3 HDMI 2.0 Quad Output',
    fmt: 'barco-e3', role: 'out', note: '4 x HDMI 2.0 out',
    src: 'https://www.barco.com/en/product/encore3',
    auto: [{ t: 'hdmi', n: 4, lbl: 'OUT HDMI 2.0' }] },

  // Four AES3 variants on one faceplate: five XLR every time, split by model
  // name. The numbers in the name are CHANNELS and each XLR carries a stereo
  // pair, so 6I4O is three in and two out — confirmed against A&H's faceplate
  // drawing, which brackets the first three sockets separately from the last
  // two. All four are 10 channels in total.
  { id: 'ah-dl-aes10o', brand: 'Allen & Heath', model: 'AES3 10 out (M-DL-AES10O)',
    fmt: 'ah-dl-io', note: '5 stereo AES3 outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [{ t: 'xlrm', n: 5, sig: 'aes3', lbl: 'AES OUT' }] },
  { id: 'ah-dl-aes2i8o', brand: 'Allen & Heath', model: 'AES3 2 in / 8 out (M-DL-AES2I8O)',
    fmt: 'ah-dl-io', note: '1 stereo AES3 input, 4 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 4, sig: 'aes3', lbl: 'AES OUT' },
    ] },
  { id: 'ah-dl-aes4i6o', brand: 'Allen & Heath', model: 'AES3 4 in / 6 out (M-DL-AES4I6O)',
    fmt: 'ah-dl-io', note: '2 stereo AES3 inputs, 3 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 3, sig: 'aes3', lbl: 'AES OUT' },
    ] },
  { id: 'ah-dl-aes6i4o', brand: 'Allen & Heath', model: 'AES3 6 in / 4 out (M-DL-AES6I4O)',
    fmt: 'ah-dl-io', note: '3 stereo AES3 inputs, 2 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 3, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 2, sig: 'aes3', lbl: 'AES OUT' },
    ] },
];

// Registered here rather than by the index, so the data and the side
// effect that publishes it cannot drift apart.
registerCards(OPTION_CARDS);
