// Blackmagic Design — 1 device
//
// PROVENANCE. Researched by hand rather than by the Haiku subagent pass, to
// compare the two methods — see CHANGELOG v1.10.7. Everything below is from
// Blackmagic's own material:
//   - panels: ATEM Constellation Switchers manual, June 2026 edition, pages 10
//     and 11. Page 10's rear figure is captioned "3G-SDI and 1/4" analog audio
//     inputs on ATEM 2 M/E Constellation HD", so it is this exact model rather
//     than a family illustration. Both are orthographic line drawings, so the
//     positions below are measured, not estimated.
//   - connector counts and power: blackmagicdesign.com tech specs, W-APS-26.
//
// WHAT BLACKMAGIC DO NOT PUBLISH: **no depth and no weight, for any
// Constellation.** The tech specs give "Physical Installation: 1 Rack Unit
// Size" and nothing else — no mm, no kg. Both fields are therefore absent
// rather than estimated. The consequence is real and is recorded in TODO §8e:
// a device with no depth draws NOTHING in the side elevation.
//
// ONLY THE 2 M/E IS HERE. The family is eight switchers. The 1 M/E HD is
// **2/3 rack width**, which the full/half layout model cannot express at all —
// same situation as the 1/3-rack Shure ANI4IN in §9c. The 4 M/E HD is 2U with
// dual internal PSUs and BNC MADI. The 4K variants and the Constellation 8K
// are separate again.

export const BLACKMAGIC_DESIGN = [
  // 1U 2 M/E live production switcher. 20 x 3G-SDI in, 12 x 3G-SDI out,
  // 2 x 3G-SDI multiview, tri-sync/black-burst reference.
  //
  // POWER: 52 W, from Blackmagic's "Power Usage" row. That reads as what the
  // unit draws doing its job rather than a ceiling, so it goes in `power` —
  // unlike the Barco PDS-4K's unlabelled "Input power", which went in
  // `powerMax`. One internal 100-240 V supply, so one IEC inlet. The 4 M/E is
  // the one with two.
  //
  // THE TALKBACK XLR IS ON THE FRONT, which is unusual enough to be worth
  // saying twice: the manual's front-panel figure shows a 5-pin XLR beside the
  // PROD TALK / ENG TALK buttons, and the rear carries an RJ45 marked TALKBACK
  // for third-party intercom instead. Both are in. `xlr5f` is a new primitive
  // — same Neutrik D shell as a 3-pin, five contacts.
  //
  // The source-button numerals (1-20) are NOT drawn. Twenty buttons across a
  // 1U face puts them at ~32 units apart and they turn to mush at normal
  // render size — the same reason connector numbering is dropped on the DX168
  // (TODO §9). The PDS-4K's numerals survive because it is 1.5U with more room.
  { id: 'bmd-atem-2me-constellation-hd', brand: 'Blackmagic Design',
    model: 'ATEM 2 M/E Constellation HD',
    category: 'video', ru: 1, power: 52,
    src: 'https://www.blackmagicdesign.com/products/atemconstellation/techspecs/W-APS-26',
    front: { elements: [
      // intercom headset socket, and the talkback/level buttons beside it
      { t: 'xlr5f', x: 94, y: 50, lbl: 'TALKBACK HEADSET' },
      { t: 'button', x: 151, y: 22, w: 19, h: 17 },   // PROD TALK
      { t: 'button', x: 177, y: 22, w: 19, h: 17 },   // ENG TALK
      { t: 'button', x: 151, y: 51, w: 19, h: 17 },   // CALL
      { t: 'button', x: 177, y: 51, w: 19, h: 17 },   // PGM MIX
      { t: 'button', x: 151, y: 80, w: 19, h: 17 },   // level up
      { t: 'button', x: 177, y: 80, w: 19, h: 17 },   // level down
      // source select, 1-10 over 11-20
      { t: 'button', x: 229, y: 34, n: 10, gap: 32.2, w: 30, h: 31 },
      { t: 'button', x: 229, y: 69, n: 10, gap: 32.2, w: 30, h: 31 },
      // CUT over AUTO
      { t: 'button', x: 575, y: 34, w: 33, h: 31 },
      { t: 'button', x: 575, y: 69, w: 33, h: 31 },
      // KEY 1 MIX / DSK 1 MIX / DSK2 MIX / FTB
      { t: 'button', x: 628, y: 22, n: 4, gap: 25.8, w: 19, h: 17 },
      // BARS / BLACK / MP 1 / MP 2
      { t: 'button', x: 628, y: 51, n: 4, gap: 25.8, w: 19, h: 17 },
      // MIX / WIPE / DIP / DVE
      { t: 'button', x: 628, y: 80, n: 4, gap: 25.8, w: 19, h: 17 },
      { t: 'display', x: 789, y: 53, w: 94, h: 79 },
      { t: 'knob', x: 874, y: 51, r: 21 },
      { t: 'button', x: 915, y: 22, w: 19, h: 17 },   // MENU
      { t: 'button', x: 915, y: 51, w: 19, h: 17 },   // SET
      { t: 'button', x: 915, y: 80, w: 19, h: 17 },   // LOCK
    ], labels: [
      { text: 'Blackmagicdesign', x: 841, y: 26, size: 5, ls: .1 },
    ] },
    // Measured from the manual's page 10 rear figure. Two rows throughout:
    // odd numbers on the top row, even below, which is how the panel reads.
    rear: { elements: [
      { t: 'iec_in', x: 103, y: 50, lbl: 'MAINS IN' },
      { t: 'rj45', x: 166, y: 30, lbl: 'CONTROL' },
      { t: 'usbc', x: 167, y: 70, lbl: 'USB-C' },
      { t: 'rj45', x: 210, y: 30, lbl: 'TALKBACK' },
      { t: 'bnc', x: 209, y: 70, lbl: 'REF IN' },
      // SDI INPUTS 1-20
      { t: 'bnc', x: 255, y: 30, n: 10, gap: 35,
        lbl: ['SDI IN 1', 'SDI IN 3', 'SDI IN 5', 'SDI IN 7', 'SDI IN 9',
              'SDI IN 11', 'SDI IN 13', 'SDI IN 15', 'SDI IN 17', 'SDI IN 19'] },
      { t: 'bnc', x: 255, y: 70, n: 10, gap: 35,
        lbl: ['SDI IN 2', 'SDI IN 4', 'SDI IN 6', 'SDI IN 8', 'SDI IN 10',
              'SDI IN 12', 'SDI IN 14', 'SDI IN 16', 'SDI IN 18', 'SDI IN 20'] },
      // SDI OUTPUTS 1-12
      { t: 'bnc', x: 630, y: 30, n: 6, gap: 36.4,
        lbl: ['SDI OUT 1', 'SDI OUT 3', 'SDI OUT 5', 'SDI OUT 7', 'SDI OUT 9',
              'SDI OUT 11'] },
      { t: 'bnc', x: 630, y: 70, n: 6, gap: 36.4,
        lbl: ['SDI OUT 2', 'SDI OUT 4', 'SDI OUT 6', 'SDI OUT 8', 'SDI OUT 10',
              'SDI OUT 12'] },
      { t: 'bnc', x: 859, y: 30, lbl: 'MULTIVIEW 1' },
      { t: 'bnc', x: 859, y: 70, lbl: 'MULTIVIEW 2' },
      { t: 'trs', x: 913, y: 30, lbl: 'ANALOG AUDIO IN CH 1' },
      { t: 'trs', x: 913, y: 70, lbl: 'ANALOG AUDIO IN CH 2' },
    ] } },
];
