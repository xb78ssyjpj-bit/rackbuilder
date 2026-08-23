// NovaStar — 9 LED display controllers
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
//   MX40 Pro   94.2 mm = 2.12 U      VX1000   50.1 mm = 1.13 U
//   VX6S       51.4 mm = 1.16 U      CX40 Pro 94.4 mm = 2.12 U
//   CX80 Pro   95.1 mm = 2.14 U      MX30     94.2 mm = 2.12 U
//   MX6000 Pro 282.9 mm = 6.36 U     KU20     50.6 mm = 1.14 U
//   MX20       49.9 mm = 1.12 U
//
// So they carry `ru` as the true fraction, the same call the Barco PDS-4K's
// 1.5 U got. That matters in a rack drawing: a 94.2 mm box does NOT go in 2 U
// of space, and `usedU` ceilings, so the summary correctly reserves three rows
// for the MX40 Pro rather than two. `ru` itself is stored ceilinged to one
// decimal (2.12 U becomes `ru: 2.2`, not 2.1) — the comment carries the exact
// figure, the field carries the value that will not under-reserve space.
//
// BOTH FACES ARE `auto`. No panel figure was obtained for any of them, so the
// inventory and the connector sizes are real and the left-to-right order is
// the layout engine's.

export const NOVASTAR = [
  // 2.12U all-in-one controller. 482.6 x 94.2 x 467 mm, 7.5 kg, 95 W max.
  //
  // CORRECTED — this entry originally came from an early, coarse pass (the
  // "before" example the file header describes) and drew all 20 outputs as
  // plain `rj45`. A later, fuller pass on the same unit — the one that also
  // produced the CX40/CX80 Pro and MX30 siblings — found the real panel:
  // round twist-lock EtherCon shells, split across TWO physically separate
  // groups rather than one strip (16 on the top row, 4 more on the bottom
  // row sandwiched between the input block and the 4 optical ports — ports
  // 17-20 are not next to 1-16 on the real panel), plus a full front fascia
  // this entry never had at all. Replaced outright rather than patched,
  // since the connector TYPE itself was wrong, not just under-detailed.
  //
  // THREE HDMI 2.0 CHANNELS (2.0-1/2/3), each with its own LOOP
  // pass-through, plus one DP 1.2 (no loop — DisplayPort has none) and one
  // 12G-SDI in/loop pair — confirmed against the manual's own per-channel
  // table, the same cross-check the rest of this family used.
  //
  // POWER: "Max power consumption: 95W" verbatim — `powerMax`, stated
  // rather than inferred, same as MX30.
  { id: 'novastar-mx40-pro', brand: 'NovaStar', model: 'MX40 Pro',
    category: 'video', ru: 2.2, depth: 467, weight: 7.5, powerMax: 95,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2025/10/MX40-Pro-LED-Display-Controller-Specifications-V1.5.0.pdf',
    front: { elements: [
      { t: 'led', x: 95, y: 105 },
      { t: 'button', x: 119, y: 105, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 105, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 105, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 105, r: 25 },
      { t: 'button', x: 409, y: 105, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 16 },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK LOOP' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-2 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-2 LOOP' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-3 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-3 LOOP' },
      { t: 'rj45', n: 1, lbl: 'AUX' },
      { t: 'toslink', n: 1, lbl: 'SPDIF OUT' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 LOOP' },
      { t: 'displayport', n: 1, lbl: 'DP 1.2' },
      { t: 'bnc', n: 1, lbl: '12G-SDI IN' },
      { t: 'bnc', n: 1, lbl: '12G-SDI LOOP' },
      { t: 'ethercon', n: 4 },
      { t: 'sfp', n: 4, lbl: ['OPT 1', 'OPT 2', 'OPT 3', 'OPT 4'] },
      { t: 'iec_in', n: 1 },
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
      { t: 'dvi', n: 2, lbl: 'DVI IN' },
      { t: 'rj45', n: 10, lbl: 'OUT' },
    ] } },

  // 1.16U all-in-one controller. 483.6 x 51.4 x 276.4 mm, 2.71 kg.
  // Same missing power figure and same assumed inlet as the VX1000.
  { id: 'novastar-vx6s', brand: 'NovaStar', model: 'VX6S',
    category: 'video', ru: 1.2, depth: 276, weight: 2.71, approx: true,
    src: 'https://www.novastar.tech/products/vx6s/',
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'bnc', n: 2, lbl: '3G-SDI IN' },
      { t: 'hdmi', n: 2, lbl: 'HDMI IN' },
      { t: 'dvi', n: 2, lbl: 'DVI IN' },
      { t: 'dvi', n: 1, lbl: 'DVI LOOP OUT' },
      { t: 'dvi', n: 1, lbl: 'DVI MONITOR' },
      { t: 'usba', n: 2, lbl: 'USB 2.0' },
      { t: 'rj45', n: 6, lbl: 'OUT' },
    ] } },

  // 2.12U LED display controller (processor + sender in one box).
  // 482.6 x 94.4 x 472.0 mm, 8.1 kg.
  //
  // PROVENANCE. NovaStar's manual (chapter 2, "Appearance") was fully
  // curl-able from oss.novastar.tech — no Cloudflare, no browser needed. Its
  // panel diagrams don't extract as raster objects via pdfimages (vector or
  // oddly composited); rendering the whole page with pdftoppm at 200 dpi
  // worked instead and needed no rotation or mirroring correction, unlike
  // the Barco ImagePRO-4K's QSG. Labels are read off that render and
  // cross-checked against the manual's own connector-count prose.
  //
  // POWER: unlike every Barco datasheet in this library, there is no
  // typical/maximum ambiguity here — NovaStar's spec table states "Power
  // consumption: 105W" as a line distinct from "Power supply: AC100-240V,
  // 1.5A", so 105 W is a real consumption figure and belongs in `power`,
  // not `powerMax`.
  //
  // THE PANEL'S OWN LEFT-TO-RIGHT ORDER RUNS 2 BEFORE 1: HDMI2.0-2 / 12G-SDI-2
  // / HDMI2.0-1 / DP1.2 / 12G-SDI-1, channel "2" printed left of channel "1"
  // for both HDMI and SDI. Reproduced exactly as silkscreened — a rack
  // diagram needs the physical order, not an ascending one that looks tidier.
  // Each HDMI/SDI input's "LOOP" neighbour is a pass-through/daisy-chain
  // port, not a second logical input — the manual's own channel count (one
  // HDMI2.0-1, one HDMI2.0-2, one DP1.2, two 12G-SDI) matches once the LOOPs
  // are read that way. DisplayPort has no LOOP, since DP has no passive
  // loop-through.
  //
  // SIX ETHERCON "OUTPUT" ports carry the LED wall data — round twist-lock
  // shells, confirmed against the panel render, distinct from the two plain
  // rectangular CONTROL/ETHERNET jacks and the AUX IN jack. None of the
  // three carries a confirmed per-port silkscreen number, so none is
  // labelled rather than guessed; same call on the AC inlet, whose exact
  // silkscreen (as opposed to its functional name in the manual's table)
  // was not confirmed either. AUX IN's protocol (RS-232/485 vs Ethernet)
  // is not stated despite the RJ45 shell — left as a plain `rj45` with no
  // `sig`, the same honest gap as the Behringer S16's assumed inlet.
  { id: 'novastar-cx40-pro', brand: 'NovaStar', model: 'CX40 Pro',
    category: 'video', ru: 2.2, depth: 472, weight: 8.1, power: 105,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2023/07/CX40-Pro-LED-Display-Controller-Specifications-V1.0.1.pdf',
    front: { elements: [
      { t: 'led', x: 95, y: 105 },
      { t: 'button', x: 119, y: 105, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 105, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 105, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 105, r: 25 },
      { t: 'button', x: 409, y: 105, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 6 },
      { t: 'qsfp', n: 1, lbl: '40G QSFP+' },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'rj45', n: 1, lbl: 'AUX IN' },
      { t: 'toslink', n: 1, lbl: 'SPDIF OUT' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK LOOP' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-2 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-2 LOOP' },
      { t: 'bnc', n: 1, lbl: '12G-SDI-2 IN' },
      { t: 'bnc', n: 1, lbl: '12G-SDI-2 LOOP' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 LOOP' },
      { t: 'displayport', n: 1, lbl: 'DP 1.2 IN' },
      { t: 'bnc', n: 1, lbl: '12G-SDI-1 IN' },
      { t: 'bnc', n: 1, lbl: '12G-SDI-1 LOOP' },
      { t: 'iec_in', n: 1 },
    ] } },

  // 2.14U LED display controller — CX40 Pro's bigger sibling. 482.6 x 95.1 x
  // 528 mm, 10.5 kg. Same front fascia as the CX40 Pro (LED, standby button,
  // USB, display, ADJUST encoder, BACK), reused verbatim below.
  //
  // PROVENANCE. Same method as the CX40 Pro — curl-able end to end from
  // oss.novastar.tech. One shortcut worth recording: no search hit named
  // this model's manual directly, so its URL was guessed by pattern-matching
  // the specs-sheet URL that WAS found (same folder, date and version
  // string, "Specifications" swapped for "User-Manual") — and it resolved
  // first try. Worth trying before a second search.
  //
  // THE INPUT SECTION IS A SWAPPABLE CARD, and the manual documents two:
  // "Input Card 1" (HDMI 2.1 + DP 1.4 + 4x 12G-SDI — used below, since it is
  // the one actually transcribed) and "Input Card 2" (4x HDMI 2.0 + 4x
  // 12G-SDI, no DisplayPort). Only Card 1's connectors were read off its own
  // rear-panel photo in enough detail to draw; Card 2's photo exists but was
  // not individually zoomed and transcribed, so it is not represented here.
  // This is therefore Card 1's configuration specifically, not a fixed
  // panel — same status as the Barco PDS-4K's blanked Option slot: a real
  // aperture that could take something else, drawn as what is actually
  // fitted. Not modelled with the slots/cards mechanism, because that needs
  // a measured aperture size and none was taken; if Card 2 is ever
  // transcribed in full, that is the point to reconsider it. TODO §8g.
  //
  // POWER: 170 W, and — same as the CX40 Pro — genuinely unambiguous:
  // NovaStar state "Power consumption: 170W" as its own line, separate from
  // "Power supply: AC100-240V, 4A", so this is `power`, not `powerMax`.
  //
  // REAR ORDER DIFFERS FROM THE CX40 PRO'S, confirmed from this unit's own
  // photo rather than assumed from the sibling: Genlock sits between the two
  // Ethernet control ports and AUX/SPDIF here, where the CX40 Pro puts
  // AUX/SPDIF before Genlock. Reproduced as silkscreened.
  //
  // TWO 40G QSFP+ for chassis cascading (the CX40 Pro has one) — labelled 1
  // and 2 on the panel, kept as a bare `n: 2` since neither figure or text
  // distinguishes them further.
  { id: 'novastar-cx80-pro', brand: 'NovaStar', model: 'CX80 Pro',
    category: 'video', ru: 2.2, depth: 528, weight: 10.5, power: 170,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2023/07/CX80-Pro-LED-Display-Controller-User-Manual-V1.1.2.pdf',
    front: { elements: [
      { t: 'led', x: 95, y: 105 },
      { t: 'button', x: 119, y: 105, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 105, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 105, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 105, r: 25 },
      { t: 'button', x: 409, y: 105, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 16 },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK LOOP' },
      { t: 'rj45', n: 1, lbl: 'AUX' },
      { t: 'toslink', n: 1, lbl: 'SPDIF OUT' },
      { t: 'bnc', n: 4, lbl: '12G-SDI' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.1' },
      { t: 'displayport', n: 1, lbl: 'DP 1.4' },
      { t: 'qsfp', n: 2, lbl: '40G QSFP+' },
      { t: 'iec_in', n: 1 },
    ] } },

  // 2.12U LED display controller — same 94.2 mm height as the MX40 Pro
  // (likely the same chassis platform), 482.6 x 94.2 x 467 mm, 7.2 kg. A
  // lower/mid tier all-in-one: 10 output ports and 2 optical uplinks rather
  // than the MX40 Pro's 20 + 4, and a mixed HDMI 2.0/1.4 pair on the two
  // HDMI channels rather than matched ports.
  //
  // PROVENANCE. Same method and source host as the rest of this family
  // (oss.novastar.tech, fully curl-able).
  //
  // POWER IS UNAMBIGUOUS FOR ONCE: NovaStar's own spec sheet says "Max power
  // consumption: 55W" verbatim — the word "Max" is right there, unlike the
  // CX40/CX80 Pro's cleanly-separate-but-unlabelled figure and unlike every
  // Barco datasheet in this library. `powerMax`, stated rather than inferred.
  //
  // REAR ORDER matches the CX40 Pro's control-section arrangement
  // (ETHERNET1, ETHERNET2 before AUX/SPDIF), not the CX80 Pro's (which puts
  // GENLOCK between them) — confirmed from this unit's own rendered manual
  // page, not assumed from either sibling. Declaration order below is that
  // photo's left-to-right order verbatim.
  //
  // THE OUTPUT PORTS' ETHERNET SPEED GRADE IS NOT CONFIRMED. The CX40/CX80
  // Pro's rear photos carry a legible "5GBASE-T" tag under their output
  // ports; this one does not, at the resolution available. NovaStar's
  // marketing copy says "10 x Gigabit Ethernet output ports" for the MX30
  // specifically (1000BASE-T, plausible for a lower-tier model), but that
  // text was not cross-checked against the panel photo itself the way every
  // other figure in this family was, so it is not asserted here — the
  // connector is drawn as `ethercon` either way, since the shell is what
  // decides the primitive, not the speed behind it.
  { id: 'novastar-mx30', brand: 'NovaStar', model: 'MX30',
    category: 'video', ru: 2.2, depth: 467, weight: 7.2, powerMax: 55,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2023/07/MX30-LED-Display-Controller-User-Manual-V1.0.1.pdf',
    front: { elements: [
      { t: 'led', x: 95, y: 105 },
      { t: 'button', x: 119, y: 105, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 105, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 105, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 105, r: 25 },
      { t: 'button', x: 409, y: 105, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 10 },
      { t: 'sfp', n: 2, lbl: ['OPT 1', 'OPT 2'] },
      { t: 'iec_in', n: 1 },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK LOOP' },
      { t: 'bnc', n: 1, lbl: '3G-SDI-1 IN' },
      { t: 'bnc', n: 1, lbl: '3G-SDI-1 LOOP' },
      { t: 'bnc', n: 1, lbl: '3G-SDI-2 IN' },
      { t: 'bnc', n: 1, lbl: '3G-SDI-2 LOOP' },
      { t: 'rj45', n: 1, lbl: 'AUX' },
      { t: 'toslink', n: 1, lbl: 'SPDIF OUT' },
      { t: 'displayport', n: 1, lbl: 'DP 1.1' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 2.0-1 LOOP' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 1.4-2 IN' },
      { t: 'hdmi', n: 1, lbl: 'HDMI 1.4-2 LOOP' },
    ] } },

  // 6.36U — NovaStar's flagship, and a completely different kind of device
  // from every other COEX box in this file: a genuinely card-based 6U cage,
  // not an all-in-one. 482.6 x 282.9 x 538.8 mm bare chassis, 31 kg WITHOUT
  // CARDS — actual shipped weight depends entirely on what's fitted.
  //
  // NOT MODELLED WITH THE SLOTS/CARDS MECHANISM, on purpose. The manual
  // documents 16 independent bays with real roles (8 input-only "IN x", 8
  // output-only "OUT x", 1 MVR-only, 1 CTRL-only, per its own slot-marking
  // legend) plus 2 hot-swap PSUs — architecturally exactly what that
  // mechanism is for. What's missing is a measured aperture: no bay
  // dimension or scaled photograph was taken, only a connector inventory,
  // and a slot format invented from that would be exactly the guess this
  // library refuses (see the Barco Event Master formats in panel.js, all of
  // which came from a real measured or bounded figure). If a bay dimension
  // ever turns up, this is the entry to rebuild as slots + cards — the card
  // range is already partly known (MX_4xHDMI2.0 input card; 4x10G-fiber and
  // 1x40G-fiber output cards, per the manual's own text, though not its
  // full catalogue).
  //
  // WHAT'S DRAWN INSTEAD is NovaStar's own illustrative photo, and it is
  // explicitly not canonical — the manual's own caption says so twice: "All
  // product pictures shown in this document are for illustration purpose
  // only. Actual product may vary," and separately, of the dimensioned
  // diagram, "This... is an example of four input cards and one
  // CX_1x40G_Fiber output card... The actual application may vary." So this
  // is one arbitrary example NovaStar itself declines to call typical, not
  // a "Card 1" primary configuration the way the CX80 Pro's is — treat
  // every IN/OUT/MVR bay as independently swappable for any compatible
  // card, not as what a real MX6000 Pro necessarily looks like. The MVR bay
  // is shown empty in that same photo and is not represented below.
  //
  // POWER IS AN INTERPRETATION, NOT A STATED FACT, and is flagged as such
  // rather than silently folded into the usual `powerMax` convention: a
  // modular multi-card chassis has no single "typical" draw independent of
  // its card population, and NovaStar's "625 W" power-consumption figure
  // doesn't say what configuration it assumes (full 16 cards, or some
  // reference build). Recorded as `powerMax` because a ceiling is the safer
  // misreading if this interpretation is wrong, not because the source used
  // the word "maximum" — it didn't.
  { id: 'novastar-mx6000-pro', brand: 'NovaStar', model: 'MX6000 Pro',
    category: 'video', ru: 6.4, depth: 539, weight: 31, powerMax: 625,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2023/12/MX6000-Pro-LED-Display-Controller-Specifications-V1.1.1.pdf',
    front: { elements: [
      { t: 'led', x: 95, y: 105 },
      { t: 'button', x: 119, y: 105, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 105, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 105, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 105, r: 25 },
      { t: 'button', x: 409, y: 105, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'displayport', n: 2, lbl: 'IN 1: DP 1.4' },
      { t: 'displayport', n: 2, lbl: 'IN 2: DP 1.4' },
      { t: 'displayport', n: 2, lbl: 'IN 3: DP 1.4' },
      { t: 'displayport', n: 4, lbl: 'IN 4: DP 1.2' },
      { t: 'displayport', n: 4, lbl: 'IN 5: DP 1.2' },
      { t: 'displayport', n: 4, lbl: 'IN 6: DP 1.2' },
      { t: 'hdmi', n: 4, lbl: 'IN 7: HDMI 2.0' },
      { t: 'hdmi', n: 4, lbl: 'IN 8: HDMI 2.0' },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'rj45', n: 1, lbl: 'AUX' },
      { t: 'toslink', n: 1, lbl: 'SPDIF OUT' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK IN' },
      { t: 'bnc', n: 1, lbl: 'GENLOCK LOOP' },
      { t: 'sfp', n: 4, lbl: 'OUT 1: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 2: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 3: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 4: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 5: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 6: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 7: OPT' },
      { t: 'sfp', n: 4, lbl: 'OUT 8: OPT' },
      { t: 'iec_in', n: 2 },
    ] } },

  // 1.14U — genuinely narrower than full rack width, the first in this whole
  // NovaStar batch: 254.3 x 50.6 x 290.0 mm. The spec sheet's own dimension
  // page is captioned "Assembly of a KU20 and a Connecting Piece" —
  // NovaStar expects two of these joined side by side with an optional
  // bracket to fill one standard 19" U.
  //
  // NOT DRAWN WITH `half: true`, even though the pairing behaviour is
  // exactly what that mechanism is for — the fit doesn't work. `half`
  // draws at this app's fixed HALF_W, 211 mm, and KU20's own connectors
  // (with the EtherCon reading below) need close to 240 mm even at minimum
  // spacing; forcing them into 211 mm is not the same class of
  // approximation as Shure's 197 mm half-rack gear drawn 14 mm narrower —
  // it doesn't fit at all. `widthMM: 254` draws it at its own true width
  // instead, centred rather than paired, which loses the "two join into
  // one U" detail but keeps the panel honest. Noted here in case a future
  // pass wants to extend `half` to take a real width.
  //
  // THE 6 OUTPUT PORTS ARE DRAWN `rj45`, NOT `ethercon` — a departure from
  // every sibling in this family, and the reason is physical, not just
  // photographic: the research pass itself flagged the shell as "looks
  // like plain RJ45 ... not the round locking shell seen on CX40/CX80/MX40
  // Pro" without being able to confirm it, and six EtherCon shells (24 mm
  // each) plus the rest of this rear does not fit inside KU20's own 254 mm
  // width at any reasonable spacing — six plain RJ45 (15 mm each) does,
  // with room to spare. The photographic hedge and the physical fit agree,
  // which is why this is a correction rather than a coin flip.
  //
  // SMALLEST I/O IN THE FAMILY otherwise: one HDMI channel (in + loop), one
  // optical uplink — NovaStar's entry-level "compact, cost-effective" COEX
  // box. `powerMax: 25`, stated as "Max power consumption" verbatim, same
  // convention as the rest of this family.
  { id: 'novastar-ku20', brand: 'NovaStar', model: 'KU20',
    category: 'video', widthMM: 254, ru: 1.2, depth: 290, weight: 2.1, powerMax: 25,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2023/05/KU20-LED-Display-Controller-Specifications-V1.1.0.pdf',
    // Front is narrow (widthMM), so x is shifted to sit inside the body
    // bounds (~236..764) rather than the full-width layout's ~90..440; y is
    // 60, not the 2.2U siblings' 105 — this device is only 1.2U (120 units
    // tall total), and 105 would run the encoder off the bottom edge.
    front: { elements: [
      { t: 'led', x: 338, y: 60 },
      { t: 'button', x: 362, y: 60, w: 24, h: 20 },
      { t: 'usba', x: 398, y: 60, lbl: 'USB 2.0' },
      { t: 'display', x: 471, y: 60, w: 100, h: 45 },
      { t: 'encoder', x: 604, y: 60, r: 25 },
      { t: 'button', x: 652, y: 60, w: 30, h: 20, lbl: 'BACK' },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'rj45', n: 2, lbl: 'ETHERNET' },
      { t: 'rj45', n: 1, lbl: 'AUX' },
      { t: 'hdmi', n: 1, lbl: 'IN' },
      { t: 'hdmi', n: 1, lbl: 'LOOP' },
      { t: 'rj45', n: 6, lbl: 'OUT' },
      { t: 'sfp', n: 1, lbl: 'OPT' },
      { t: 'toslink', n: 1, lbl: 'SPDIF' },
    ] } },

  // 1.12U — 482.6 x 49.9 x 384.0 mm, 4.5 kg. Sits between the KU20 and MX30
  // in the range: two HDMI 1.3 channels (older than MX30's HDMI 2.0/1.4
  // pair) plus one 3G-SDI in/loop pair, genlock, and 6 EtherCON outputs
  // with 2 optical uplinks.
  //
  // PROVENANCE NOTE: the pass that produced this entry cross-referenced a
  // newer manual revision (cover branding differs — plain "NOVASTAR"
  // wordmark rather than the orange "COEX" mark the rest of this family's
  // manuals carry, and the front-panel photo shows the LCD unlit) against
  // the same-generation specs sheet. Documentation styling only, not
  // evidence of a different physical unit — the dimensions and I/O match
  // one device.
  //
  // POWER: "Maximum power consumption: 50W" verbatim — `powerMax`. Rear
  // order matches the CX40/MX40 Pro CONTROL+INPUT pattern (Ethernet and
  // Genlock on one sub-row, AUX/SPDIF and the video inputs on the other),
  // not the CX80 Pro's different arrangement.
  { id: 'novastar-mx20', brand: 'NovaStar', model: 'MX20',
    category: 'video', ru: 1.2, depth: 384, weight: 4.5, powerMax: 50,
    approx: true,
    src: 'https://oss.novastar.tech/uploads/2024/08/MX20-LED-Display-Controller-Specifications-V1.4.1.pdf',
    // y is 60, not the 2.2U siblings' 105 — MX20 is only 1.2U (120 units
    // tall total), and 105 would run the encoder off the bottom edge.
    front: { elements: [
      { t: 'led', x: 95, y: 60 },
      { t: 'button', x: 119, y: 60, w: 24, h: 20 },
      { t: 'usba', x: 155, y: 60, lbl: 'USB 2.0' },
      { t: 'display', x: 228, y: 60, w: 100, h: 45 },
      { t: 'encoder', x: 361, y: 60, r: 25 },
      { t: 'button', x: 409, y: 60, w: 30, h: 20, lbl: 'BACK' },
    ] },
    // HAND-PLACED, NOT `auto` — at 1.2U, `auto`'s row-splitting produces
    // bands too short for a 31 mm EtherCon shell once width forces a second
    // row (60 units = 27 mm tall; the shell needs closer to 70). check.mjs
    // caught it directly ("ethercon outside the panel"), unlike the
    // Ascender 48's version of this problem, which passed the bounds check
    // and only showed up on render. Single row, sequential real widths,
    // ~2-unit gaps — tighter than `auto`'s own per-item padding, which is
    // what makes it fit the 1U-tall face at all.
    rear: { elements: [
      { t: 'rj45', x: 57.5, y: 60, lbl: 'ETHERNET 1' },
      { t: 'rj45', x: 90.6, y: 60, lbl: 'ETHERNET 2' },
      { t: 'bnc', x: 124.7, y: 60, lbl: 'GENLOCK IN' },
      { t: 'bnc', x: 159.9, y: 60, lbl: 'GENLOCK LOOP' },
      { t: 'rj45', x: 194, y: 60, lbl: 'AUX' },
      { t: 'toslink', x: 225, y: 60, lbl: 'SPDIF OUT' },
      { t: 'bnc', x: 257.1, y: 60, lbl: '3G-SDI IN' },
      { t: 'bnc', x: 292.2, y: 60, lbl: '3G-SDI LOOP' },
      { t: 'hdmi', x: 332.6, y: 60, lbl: 'HDMI 1.3-1 IN' },
      { t: 'hdmi', x: 378.1, y: 60, lbl: 'HDMI 1.3-1 LOOP' },
      { t: 'hdmi', x: 423.6, y: 60, lbl: 'HDMI 1.3-2 IN' },
      { t: 'hdmi', x: 469.1, y: 60, lbl: 'HDMI 1.3-2 LOOP' },
      { t: 'ethercon', x: 517.7, y: 60 },
      { t: 'ethercon', x: 569.5, y: 60 },
      { t: 'ethercon', x: 621.2, y: 60 },
      { t: 'ethercon', x: 672.9, y: 60 },
      { t: 'ethercon', x: 724.6, y: 60 },
      { t: 'ethercon', x: 776.4, y: 60 },
      { t: 'sfp', x: 824, y: 60, lbl: 'OPT 1' },
      { t: 'sfp', x: 867.4, y: 60, lbl: 'OPT 2' },
      { t: 'iec_in', x: 918.1, y: 60 },
    ] } },
];
