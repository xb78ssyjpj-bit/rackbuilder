// Parametric front/rear panel renderer.
//
// Coordinate space: 1000 units wide x 100 units per rack unit.
// Same convention StageRack and the NetBox elevation images use.
//
// SIZING: every connector carries `mm` — the real width of its panel face — and
// `nat`, the width its draw function happens to produce. renderPanel scales by
// (mm * MM) / nat, so at scale 1 a connector is drawn at its TRUE size relative
// to the 19" panel. That is what stops twelve 16 A CEE fitting into 1U.

export const NS = 'http://www.w3.org/2000/svg';

export const U = 100;        // units per rack unit
export const W = 1000;       // panel width
export const EAR_L = 62;     // left rack ear inner edge
export const EAR_R = 938;    // right rack ear inner edge
export const FACE_L = 78;    // usable face, left
export const FACE_R = 922;   // usable face, right

export const MM = W / 482.6;          // 2.0721 units per mm (19" = 482.6 mm)

// --- rotated connectors -----------------------------------------------------
// A connector mounted on its side. Barco's Event Master cards are the reason:
// 14 of them span a 432 mm chassis, so a card face is 30.9 mm — and a Dual Link
// DVI is 53 mm across, which only fits because Barco turn it 90 degrees. Until
// now the fit check would (correctly) have refused that card, because nothing
// could say the connector was on its side.
//
// `rot: 90` on an element swaps its footprint and turns the drawing. Note the
// drawn shape picks up the panel's existing ~8% anisotropy — the viewBox is
// 1000 x 100·U, so a unit of x and a unit of y are not the same number of
// millimetres, and rotating swaps which one applies. That is the same
// squash the whole drawing already carries; physical truth lives in the mm
// fields, and the FOOTPRINT below is computed from those, not from the
// drawing.
export const isRot = (e) => !!e && (e.rot === 90 || e.rot === 270);

// A connector's footprint in real millimetres, honouring rotation.
export const elemMM = (e) => (isRot(e)
  ? { w: heightMM(e.t) || 20, h: sizeMM(e.t) || 20 }
  : { w: sizeMM(e.t) || 20, h: heightMM(e.t) || 20 });
export const U_MM = 44.45;            // one rack unit in mm
export const FACE_MM = (FACE_R - FACE_L) / MM;   // usable face width in mm (~407)

export const el = (n, a = {}) => {
  const e = document.createElementNS(NS, n);
  for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]);
  return e;
};

const txt = (s, a) => {
  const t = el('text', {
    'font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
    stroke: 'none', fill: 'currentColor', ...a,
  });
  t.textContent = s;
  return t;
};

const ring = (g, x, y, r) => g.appendChild(el('circle', { cx: x, cy: y, r }));
const pin = (g, x, y, r) => g.appendChild(el('circle', {
  cx: x, cy: y, r, fill: 'currentColor', stroke: 'none',
}));
const path = (g, d) => g.appendChild(el('path', { d }));
const rect = (g, x, y, w, h, rx = 0) => g.appendChild(el('rect', {
  x: x - w / 2, y: y - h / 2, width: w, height: h, rx,
}));
// Shaded disc — the "dark inside" that separates male from female at a glance.
const shade = (g, x, y, r) => g.appendChild(el('circle', {
  cx: x, cy: y, r, fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'none',
}));
const p1 = (n) => Math.round(n * 10) / 10;

// ---------------------------------------------------------------------------
// Shared drawing helpers. `male` = pins (a plug / inlet); otherwise holes.
// ---------------------------------------------------------------------------
// Neutrik D-series panel connector: a 24 x 31 mm flange plate with the round
// connector bore centred and two countersunk screw holes on the diagonal.
// Drawing the flange is what makes these read as PANEL connectors rather than
// as bare circles, and it is the shape every D-type shares.
const D_W = 42, D_H = 54, BORE = 17;

function dFlange(g, x, y) {
  rect(g, x, y, D_W, D_H, 5);
  ring(g, x - 14.5, y - 20.5, 3.2);
  ring(g, x + 14.5, y + 20.5, 3.2);
}
const bore = (g, x, y, r = BORE) => ring(g, x, y, r);

// Centred numeral, used where the pole count is the only useful difference.
function numeral(g, x, y, s, size) {
  const t = el('text', {
    x, y: y + size * 0.35, 'font-size': size, 'font-weight': 700,
    'font-family': 'Inter, Helvetica, Arial, sans-serif',
    'text-anchor': 'middle', fill: 'currentColor', stroke: 'none',
  });
  t.textContent = s;
  g.appendChild(t);
}

const XLR3 = [[0, -6], [-5.2, 3.4], [5.2, 3.4]];

// Contacts arranged on a pitch circle.
function contacts(g, x, y, n, pr, cr, male) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const px = p1(x + Math.cos(a) * pr);
    const py = p1(y + Math.sin(a) * pr);
    if (male) pin(g, px, py, cr); else ring(g, px, py, cr);
  }
}

// IEC 60309 "CEE": round shell, keyway lug at 6 o'clock, contacts on a circle.
function drawCee(g, x, y, pins, r, male) {
  ring(g, x, y, r);
  ring(g, x, y, r * 0.78);
  path(g, `M${p1(x - r * 0.2)},${p1(y + r * 0.78)} L${p1(x - r * 0.16)},${p1(y + r)} `
        + `L${p1(x + r * 0.16)},${p1(y + r)} L${p1(x + r * 0.2)},${p1(y + r * 0.78)}`);
  contacts(g, x, y, pins, r * 0.44, r * 0.13, male);
}

// Circular multipin (Socapex / VEAM family).
function drawMultipin(g, x, y, r, rings, male) {
  ring(g, x, y, r);
  ring(g, x, y, r * 0.82);
  path(g, `M${p1(x - r * 0.16)},${p1(y - r * 0.82)} v${p1(-r * 0.18)}`);
  if (male) pin(g, x, y, r * 0.09); else ring(g, x, y, r * 0.09);
  rings.forEach(([count, frac]) => contacts(g, x, y, count, r * frac, r * 0.075, male));
}

// Neutrik speakON (NL2/NL4/NL8 panel). The bore and keyway are near-identical
// across pole counts on a real connector, so the pole count is spelled out —
// that is the only thing anyone actually needs to read off a rack drawing.
function drawSpeakon(g, x, y, poles) {
  dFlange(g, x, y);
  bore(g, x, y);
  // the speakON key: a notch cut into the bore at 12 o'clock
  path(g, `M${p1(x - 5)},${p1(y - BORE)} l3,5 h4 l3,-5`);
  numeral(g, x, y, String(poles), 17);
}

// Neutrik powerCON (NAC3MP): D-flange, bore, and the keyed insert with its
// characteristic flat chord. IN gets solid contacts, THRU open ones.
function drawPowercon(g, x, y, male) {
  dFlange(g, x, y);
  bore(g, x, y);
  const ir = 12;
  // insert: circle with a flat chord across the top
  path(g, `M${p1(x - 10.4)},${p1(y - 6)} h20.8 `
        + `A${ir},${ir} 0 1,1 ${p1(x - 10.4)},${p1(y - 6)} Z`);
  const c = 3;
  [[0, 1.5], [-6, 7], [6, 7]].forEach(([a, b]) => {
    if (male) pin(g, x + a, y + b, c); else ring(g, x + a, y + b, c);
  });
}

// Neutrik powerCON TRUE1 (NAC3MPX): the square latching collar inside the bore
// is what separates it from a standard powerCON at a glance.
function drawTrue1(g, x, y, male) {
  dFlange(g, x, y);
  bore(g, x, y);
  rect(g, x, y, 21, 21, 4);
  const c = 2.8;
  [[0, -4.5], [-5, 4], [5, 4]].forEach(([a, b]) => {
    if (male) pin(g, x + a, y + b, c); else ring(g, x + a, y + b, c);
  });
  // latch tab on the shell
  rect(g, x, y + BORE + 3.5, 9, 5, 1.5);
}

// IEC C13 outlet / C14 inlet — the chamfered-top aperture is the giveaway.
function drawIec(g, x, y, male) {
  rect(g, x, y, 38, 30, 3);
  path(g, `M${x - 13},${y + 9.5} L${x - 13},${y - 4} L${x - 7.5},${y - 9.5} `
        + `L${x + 7.5},${y - 9.5} L${x + 13},${y - 4} L${x + 13},${y + 9.5} Z`);
  const c = 2.4;
  if (male) {
    pin(g, x, y - 4, c); pin(g, x - 7, y + 4.5, c); pin(g, x + 7, y + 4.5, c);
  } else {
    ring(g, x, y - 4, c); ring(g, x - 7, y + 4.5, c); ring(g, x + 7, y + 4.5, c);
  }
}

// IEC 60320 C8 inlet — the two-pin "figure of eight" a Mac mini takes. Drawn
// as its own shape rather than a small C14, because the whole point of having
// it is that you cannot plug a C13 lead into one: two poles, no earth, and the
// twin-lobe outline instead of the C14's flat-topped hexagon.
function drawIecC8(g, x, y) {
  rect(g, x, y, 34, 20, 3);
  // the figure-8 aperture: two overlapping lobes
  ring(g, x - 5, y, 6);
  ring(g, x + 5, y, 6);
  path(g, `M${x - 11},${y - 3} h22 M${x - 11},${y + 3} h22`);
  pin(g, x - 5, y, 2.2); pin(g, x + 5, y, 2.2);
}

// Single-pole (Powerlock family).
function drawPowerlock(g, x, y, r, male) {
  ring(g, x, y, r); ring(g, x, y, r * 0.72);
  if (male) pin(g, x, y, r * 0.32); else ring(g, x, y, r * 0.32);
  rect(g, x, y - r * 1.16, r * 0.4, r * 0.36, 2);
}

// Shared by `jack`, `trs` and `ts` — same hole, same nut, same 15 mm pitch.
const JACK_1_4 = { mm: 15, nat: 30, d(g, x, y) { ring(g, x, y, 15); ring(g, x, y, 7); } };

// ---------------------------------------------------------------------------
// Primitive registry.
//   mm  = real width of the panel face (used for true sizing + fit checks)
//   mmH = real height, when it differs from mm
//   nat = width the draw function naturally produces, in units
// ---------------------------------------------------------------------------
const P = {
  // --- audio ---------------------------------------------------------------
  // All D-types share the Neutrik flange. Female = open holes and the latch
  // tab a panel-mount NC3FD really has; male = shaded bore and solid pins.
  xlrf: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); ring(g, x, y, 12);
    XLR3.forEach(([a, b]) => ring(g, x + a, y + b, 2.6));
    rect(g, x, y - 13.5, 6, 5, 1.4);
  } },
  xlrm: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); shade(g, x, y, 12); ring(g, x, y, 12);
    XLR3.forEach(([a, b]) => pin(g, x + a, y + b, 3.6));
  } },
  // 5-pin XLR, the intercom headset connector. Same Neutrik D shell as a
  // 3-pin — 24 x 31 mm — so it is the pin count that distinguishes it, which
  // is exactly what `contacts` is for. Drawn female because a panel-mount
  // headset socket is: the headset's own connector is the male half.
  xlr5f: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); ring(g, x, y, 12);
    contacts(g, x, y, 5, 6.4, 2.4, false);
    rect(g, x, y - 13.5, 6, 5, 1.4);
  } },
  combo: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); ring(g, x, y, 12);
    XLR3.forEach(([a, b]) => ring(g, x + a, y + b, 2.6));
    ring(g, x, y, 6);
  } },
  // A 1/4" socket is a 1/4" socket: you cannot tell TRS from TS by looking at
  // the panel, so all three draw identically and share one primitive. The type
  // exists to carry what the *cable* has to be, which is what a patch list is
  // for. `jack` stays as the honest "not recorded" case — see the README.
  jack: JACK_1_4, trs: JACK_1_4, ts: JACK_1_4,
  // 3-pin Phoenix / Euroblock at 5.08 mm pitch — the install-audio standard, and
  // what the whole AHM range uses instead of XLR.
  euroblock: { mm: 16, mmH: 14, nat: 30, d(g, x, y) {
    rect(g, x, y, 30, 24, 2);
    [-9, 0, 9].forEach((dx) => {
      ring(g, x + dx, y - 3, 3.4);
      path(g, `M${x + dx - 2.4},${y - 3} h4.8`);
    });
  } },
  minijack: { mm: 9, nat: 20, d(g, x, y) { ring(g, x, y, 10); ring(g, x, y, 4.5); } },

  // RCA phono — coaxial S/PDIF and unbalanced line. Smaller than a BNC, which
  // is what tells them apart at rack scale.
  rca: { mm: 10, nat: 20, d(g, x, y) { ring(g, x, y, 10); ring(g, x, y, 3.2); } },
  // ADAT / optical S-PDIF — a TOSLINK panel jack: square face, shuttered bore.
  toslink: { mm: 13, mmH: 11, nat: 26, d(g, x, y) {
    rect(g, x, y, 26, 22, 3);
    rect(g, x, y, 15, 12, 1.5);
    path(g, `M${x - 7.5},${y - 6.5} h15`);
  } },
  // MIDI — 5-pin DIN. Five pins in an arc above the keyway, which is what makes
  // it read as a DIN rather than as any other round connector.
  midi: { mm: 21, nat: 34, d(g, x, y) {
    ring(g, x, y, 17);
    ring(g, x, y, 12);
    [180, 135, 90, 45, 0].forEach((deg) => {
      const a = (deg * Math.PI) / 180;
      ring(g, x + Math.cos(a) * 7.5, y - Math.sin(a) * 7.5, 1.7);
    });
    path(g, `M${x - 4},${y + 12} h8`);
  } },

  // speakON — NL2/NL4 are D-size; NL8 uses a larger flange
  nl2: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawSpeakon(g, x, y, 2); } },
  nl4: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawSpeakon(g, x, y, 4); } },
  nl8: { mm: 44, mmH: 44, nat: D_W, d(g, x, y) { drawSpeakon(g, x, y, 8); } },

  // --- video / data --------------------------------------------------------
  bnc: { mm: 16, nat: 26, d(g, x, y) { ring(g, x, y, 13); ring(g, x, y, 4.5); } },
  // 5.5/2.1 mm coaxial DC barrel — RF distros feed their receivers with these
  dcjack: { mm: 11, nat: 22, d(g, x, y) {
    ring(g, x, y, 11); ring(g, x, y, 6); path(g, `M${x},${y - 2.6} v5.2`);
  } },
  // 15 mm is the pitch of a stacked RJ45 switch port, not the 18 mm of a lone
  // panel jack. It is what decides whether 48 ports fit across a 19" face.
  rj45: { mm: 15, nat: 26, d(g, x, y) {
    path(g, `M${x - 13},${y - 11} h26 v15 h-8 v7 h-10 v-7 h-8 z`);
  } },
  // QSFP is a wider cage than SFP — 40/100G uplinks are not the same size.
  // CXP — the InfiniBand 84-pin, 12-lane copper cage on Barco Event Master
  // Expansion Link cards. 28 mm is a BOUND, NOT A MEASUREMENT, and it is the
  // softest figure in this file.
  //
  // No dimensioned drawing could be reached: TE, Amphenol, Molex, the two big
  // distributors and the InfiniBand specification are all behind access
  // controls. What pins it is Barco's own orthographic rear figure (Image 4-5,
  // manual R5905948): a CXP sits on an Event Master card, fourteen of which
  // span a 432 mm chassis, so the card face is 30.9 mm and the cage reads
  // nearly full-width on it. So: wider than the 22 mm QSFP beside it in this
  // file, and no wider than 31 mm.
  //
  // One dimensioned cage drawing replaces this. See TODO §9b.
  cxp: { mm: 28, mmH: 12, nat: 40, d(g, x, y) {
    rect(g, x, y, 40, 17, 2);
    rect(g, x, y, 33, 11, 1);
    path(g, `M${x - 12},${y - 5.5} v11 M${x + 12},${y - 5.5} v11`);
  } },

  qsfp: { mm: 22, nat: 44, d(g, x, y) {
    rect(g, x, y, 44, 20); rect(g, x, y, 32, 9);
  } },
  ethercon: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); P.rj45.d(g, x, y);
  } },
  opticalcon: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) {
    dFlange(g, x, y); bore(g, x, y); rect(g, x, y, 15, 12, 1.5);
    ring(g, x - 4, y, 2.4); ring(g, x + 4, y, 2.4);
  } },
  sfp: { mm: 20, nat: 40, d(g, x, y) { rect(g, x, y, 40, 20); rect(g, x, y, 28, 8); } },
  hdmi: { mm: 21, nat: 38, d(g, x, y) {
    path(g, `M${x - 19},${y - 8} h38 v10 l-5,5 h-28 l-5,-5 z`);
  } },
  // DisplayPort. 24 mm is DERIVED, not read off a drawing: the DP receptacles
  // in Analog Way's own Pulse 4K rear-panel photograph measure 1.15x the HDMI
  // ones sitting beside them in the same shot, and this library's hdmi is
  // 21 mm. The check on it is that 1.15 is also the ratio of the two published
  // receptacle widths — 16.10 mm for DisplayPort against 14.0 mm for HDMI
  // Type A — so the photo and the spec sheets agree.
  // The chamfered corner is the whole point of the shape: a DP drawn as a
  // plain rectangle is indistinguishable from an HDMI at panel scale.
  displayport: { mm: 24, nat: 43, d(g, x, y) {
    path(g, `M${x - 21.5},${y - 8} h43 v16 h-38 l-5,-5 z`);
  } },
  usba: { mm: 15, nat: 26, d(g, x, y) {
    rect(g, x, y, 26, 12); path(g, `M${x - 8},${y - 2} h16`);
  } },
  usbb: { mm: 18, nat: 22, d(g, x, y) {
    path(g, `M${x - 11},${y + 8} h22 v-11 l-4,-5 h-14 l-4,5 z`);
  } },
  usbc: { mm: 12, nat: 22, d(g, x, y) { rect(g, x, y, 22, 9, 4.5); } },
  // DB25 flange: 53.04 x 12.55 mm. Wide but short — which is why analogue
  // multicore breakouts get away with two rows of them in a single U.
  dsub: { mm: 53, mmH: 12.6, nat: 68, d(g, x, y) {
    path(g, `M${x - 26},${y - 8} h52 l-4,16 h-44 z`);
    ring(g, x - 34, y, 4); ring(g, x + 34, y, 4);
  } },
  // HD15 / DE-15 — the VGA "E" shell, the same shell DB9 uses. 30.9 x 16.3 mm,
  // Amphenol CN-DSUB9SKT00-000 (a DB9 female datasheet, sourced for the shell
  // size rather than a VGA-branded one because it is the same E shell and the
  // DB9 drawing was the one with legible dimensions). Added for the Analog Way
  // Ascender 48's "Universal Analog" inputs — this library previously had no
  // HD15 primitive at all, which is why the Pulse² family (TODO note in
  // devices/analog-way.js) was left out rather than drawn with dsub as a
  // lookalike. Same call here: dsub is the DB25 shell, visibly wider and
  // shorter, and using it for HD15 would be exactly that lookalike.
  hd15: { mm: 30.9, mmH: 16.3, nat: 40, d(g, x, y) {
    path(g, `M${x - 15},${y - 10.5} h30 l-2.5,21 h-25 z`);
    ring(g, x - 20, y, 3); ring(g, x + 20, y, 3);
  } },
  // DVI-I / DVI-D — one shape for both. The 4-pin analog cluster that makes an
  // -I an -I rather than a -D sits inside the same shell and doesn't change
  // the panel footprint, so there is nothing to draw differently — the same
  // reasoning `jack` already uses for TRS vs TS. 36.8 x 17.8 mm, Omron XM4M
  // DVI connector datasheet. Also new for the Ascender 48; see the hd15 note.
  dvi: { mm: 36.8, mmH: 17.8, nat: 47, d(g, x, y) {
    rect(g, x, y, 42, 24, 2);
    rect(g, x - 14, y, 26, 16, 1);
    ring(g, x - 23, y, 3); ring(g, x + 23, y, 3);
  } },

  // --- power: every type has an IN (pins) and a THRU (holes) variant --------
  powercon_in:   { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawPowercon(g, x, y, true); } },
  powercon_thru: { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawPowercon(g, x, y, false); } },
  true1_in:      { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawTrue1(g, x, y, true); } },
  true1_thru:    { mm: 24, mmH: 31, nat: D_W, d(g, x, y) { drawTrue1(g, x, y, false); } },
  iec_in:        { mm: 27, nat: 38, d(g, x, y) { drawIec(g, x, y, true); } },

  // IEC 60320 C8 inlet, the figure-of-eight. 24 x 12 mm from SCHURTER's own
  // drawing for their type 2578 — panel cut-out 24.1 x 11.7 mm, which is the
  // same basis `iec_in`'s 27 mm uses (the C14's body/cut-out, not its 30.5 mm
  // flange). Much flatter than a C14 rather than much narrower, which is what
  // it looks like on a panel.
  //
  // NO `_thru` VARIANT. A panel-mounted C7 outlet is not a thing you meet, the
  // same reasoning that gives the 13 A socket no inlet.
  iec_c7_in:     { mm: 24, mmH: 12, nat: 34, d(g, x, y) { drawIecC8(g, x, y); } },
  iec_thru:      { mm: 27, nat: 38, d(g, x, y) { drawIec(g, x, y, false); } },

  // Schuko and BS1363 are outlet-only in practice, but panel inlets exist.
  socket_thru: { mm: 45, mmH: 44, nat: 46, d(g, x, y) {
    ring(g, x, y, 23);
    ring(g, x - 9, y, 3.4); ring(g, x + 9, y, 3.4);
    path(g, `M${x - 7.5},${y - 20.5} h15`); path(g, `M${x - 7.5},${y + 20.5} h15`);
  } },
  socket_in: { mm: 45, mmH: 44, nat: 46, d(g, x, y) {
    ring(g, x, y, 23);
    pin(g, x - 9, y, 3.6); pin(g, x + 9, y, 3.6);
    path(g, `M${x - 7.5},${y - 20.5} h15`); path(g, `M${x - 7.5},${y + 20.5} h15`);
  } },
  bs13a_thru: { mm: 46, mmH: 44, nat: 50, d(g, x, y) {
    rect(g, x, y, 50, 50, 5);
    rect(g, x, y - 12.5, 7, 14, 1.2);
    rect(g, x - 10, y + 7, 14, 6.5, 1.2); rect(g, x + 10, y + 7, 14, 6.5, 1.2);
  } },
  // IEC 60309 — sizes are the real panel flanges, which is why a 16 A needs 2U
  cee16_in:     { mm: 65,  nat: 52, d(g, x, y) { drawCee(g, x, y, 3, 26, true); } },
  cee16_thru:   { mm: 65,  nat: 52, d(g, x, y) { drawCee(g, x, y, 3, 26, false); } },
  cee32_1_in:   { mm: 75,  nat: 60, d(g, x, y) { drawCee(g, x, y, 3, 30, true); } },
  cee32_1_thru: { mm: 75,  nat: 60, d(g, x, y) { drawCee(g, x, y, 3, 30, false); } },
  cee32_3_in:   { mm: 80,  nat: 66, d(g, x, y) { drawCee(g, x, y, 5, 33, true); } },
  cee32_3_thru: { mm: 80,  nat: 66, d(g, x, y) { drawCee(g, x, y, 5, 33, false); } },
  cee63_1_in:   { mm: 95,  nat: 74, d(g, x, y) { drawCee(g, x, y, 3, 37, true); } },
  cee63_1_thru: { mm: 95,  nat: 74, d(g, x, y) { drawCee(g, x, y, 3, 37, false); } },
  cee125_3_in:  { mm: 125, nat: 88, d(g, x, y) { drawCee(g, x, y, 5, 44, true); } },
  cee125_3_thru:{ mm: 125, nat: 88, d(g, x, y) { drawCee(g, x, y, 5, 44, false); } },

  powerlock_in:   { mm: 50, nat: 50, d(g, x, y) { drawPowerlock(g, x, y, 25, true); } },
  powerlock_thru: { mm: 50, nat: 50, d(g, x, y) { drawPowerlock(g, x, y, 25, false); } },

  breaker: { mm: 18, nat: 24, d(g, x, y) {
    rect(g, x, y, 24, 40); rect(g, x, y - 6.5, 14, 11);
  } },

  // --- multipin ------------------------------------------------------------
  socapex_in:   { mm: 50, nat: 68, d(g, x, y) { drawMultipin(g, x, y, 34, [[6, 0.34], [12, 0.62]], true); } },
  socapex_thru: { mm: 50, nat: 68, d(g, x, y) { drawMultipin(g, x, y, 34, [[6, 0.34], [12, 0.62]], false); } },
  // --- VEAM, by pin count ---------------------------------------------------
  // THESE WIDTHS ARE ESTIMATES, NOT MANUFACTURER FIGURES, and are the only
  // sized connectors here that are. Recorded at the user's instruction: they
  // regularly rack 8, 12, 16, 24, 32 and 48 pin, and shell sizes differ enough
  // between brands that no single published number is the right one — so these
  // are a deliberate average rather than a spec.
  //
  // The method, so anyone can improve or replace it:
  //   cutout = 49.2 mm * sqrt(pins / 19)      flange = cutout * 1.22
  // 49.2 mm is the one hard datapoint found — the panel cutout of a VEAM VSC
  // 19-pin — and contacts pack into the shell's AREA, so the diameter goes as
  // the square root of the count. The 1.22 comes from this library's existing
  // 60 mm VEAM face over that 49.2 mm cutout.
  //
  // The check on it: the model returns 60.0 mm for 19 pins, which is exactly
  // the figure already in the library. That makes it self-consistent, not
  // verified. A dimensioned panel-cutout drawing per shell size replaces all
  // of it. See TODO §9b.
  //
  // Contact ring arrangements are drawing, not data — a real insert may group
  // its pins differently.
  veam_in:      { mm: 60, mmH: 60, nat: 80, d(g, x, y) { drawMultipin(g, x, y, 40, [[8, 0.36], [16, 0.66]], true); } },
  veam_thru:    { mm: 60, mmH: 60, nat: 80, d(g, x, y) { drawMultipin(g, x, y, 40, [[8, 0.36], [16, 0.66]], false); } },
  veam8_in:    { mm: 39, mmH: 39, nat: 52, d(g, x, y) { drawMultipin(g, x, y, 26, [[8, 0.55]], true); } },
  veam8_thru:  { mm: 39, mmH: 39, nat: 52, d(g, x, y) { drawMultipin(g, x, y, 26, [[8, 0.55]], false); } },
  veam12_in:    { mm: 48, mmH: 48, nat: 64, d(g, x, y) { drawMultipin(g, x, y, 32, [[4, 0.32], [8, 0.62]], true); } },
  veam12_thru:  { mm: 48, mmH: 48, nat: 64, d(g, x, y) { drawMultipin(g, x, y, 32, [[4, 0.32], [8, 0.62]], false); } },
  veam16_in:    { mm: 55, mmH: 55, nat: 73, d(g, x, y) { drawMultipin(g, x, y, 36, [[5, 0.32], [11, 0.64]], true); } },
  veam16_thru:  { mm: 55, mmH: 55, nat: 73, d(g, x, y) { drawMultipin(g, x, y, 36, [[5, 0.32], [11, 0.64]], false); } },
  veam24_in:    { mm: 67, mmH: 67, nat: 90, d(g, x, y) { drawMultipin(g, x, y, 45, [[6, 0.30], [18, 0.63]], true); } },
  veam24_thru:  { mm: 67, mmH: 67, nat: 90, d(g, x, y) { drawMultipin(g, x, y, 45, [[6, 0.30], [18, 0.63]], false); } },
  veam32_in:    { mm: 78, mmH: 78, nat: 104, d(g, x, y) { drawMultipin(g, x, y, 52, [[8, 0.30], [24, 0.63]], true); } },
  veam32_thru:  { mm: 78, mmH: 78, nat: 104, d(g, x, y) { drawMultipin(g, x, y, 52, [[8, 0.30], [24, 0.63]], false); } },
  veam48_in:    { mm: 95, mmH: 95, nat: 127, d(g, x, y) { drawMultipin(g, x, y, 63, [[6, 0.22], [16, 0.46], [26, 0.70]], true); } },
  veam48_thru:  { mm: 95, mmH: 95, nat: 127, d(g, x, y) { drawMultipin(g, x, y, 63, [[6, 0.22], [16, 0.46], [26, 0.70]], false); } },

  // --- controls ------------------------------------------------------------
  knob: { d(g, x, y, o = {}) {
    const r = o.r || 16; ring(g, x, y, r); path(g, `M${x},${y} L${x},${y - r + 3}`);
  } },
  encoder: { d(g, x, y, o = {}) {
    const r = o.r || 16; ring(g, x, y, r); ring(g, x, y, r - 5);
    path(g, `M${x},${y - r + 5} v-5`);
  } },
  button: { d(g, x, y, o = {}) { rect(g, x, y, o.w || 26, o.h || 17, 3); } },
  led: { d(g, x, y) { ring(g, x, y, 4.5); } },
  meter: { d(g, x, y, o = {}) {
    const n = o.n || 8, h = o.h || 56, step = h / n;
    for (let i = 0; i < n; i++) {
      g.appendChild(el('rect', {
        x: x - 5, y: y - h / 2 + i * step + 1, width: 10, height: step - 2, rx: 1.5 }));
    }
  } },
  fader: { d(g, x, y, o = {}) {
    const h = o.h || 60; path(g, `M${x},${y - h / 2} v${h}`); rect(g, x, y, 18, 12, 2);
  } },
  display: { d(g, x, y, o = {}) {
    const w = o.w || 150, h = o.h || 52;
    rect(g, x, y, w, h, 4); rect(g, x, y, w - 12, h - 12, 2);
  } },
  vent: { d(g, x, y, o = {}) {
    const w = o.w || 200, h = o.h || 44, pitch = o.pitch || 13;
    const n = Math.max(1, Math.floor(w / pitch)), span = (n - 1) * pitch;
    for (let i = 0; i < n; i++) {
      g.appendChild(el('rect', {
        x: x - span / 2 + i * pitch - 2.5, y: y - h / 2, width: 5, height: h, rx: 2.5 }));
    }
  } },
  mesh: { d(g, x, y, o = {}) {
    const w = o.w || 200, h = o.h || 44, p = 11;
    for (let cy = y - h / 2 + p / 2; cy < y + h / 2; cy += p) {
      for (let cx = x - w / 2 + p / 2; cx < x + w / 2; cx += p) ring(g, cx, cy, 2.6);
    }
  } },
  bar: { d(g, x, y, o = {}) { rect(g, x, y, o.w || 120, o.h || 20, o.rx ?? 4); } },
  fan: { d(g, x, y, o = {}) {
    const r = o.r || 40;
    ring(g, x, y, r); ring(g, x, y, p1(r * 0.2));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      path(g, `M${p1(x + Math.cos(a) * r * 0.26)},${p1(y + Math.sin(a) * r * 0.26)} `
           + `Q${p1(x + Math.cos(a + 0.35) * r * 0.78)},${p1(y + Math.sin(a + 0.35) * r * 0.78)} `
           + `${p1(x + Math.cos(a + 0.95) * r * 0.9)},${p1(y + Math.sin(a + 0.95) * r * 0.9)}`);
    }
  } },
  brush: { d(g, x, y, o = {}) {
    const w = o.w || 700, h = o.h || 32;
    rect(g, x, y, w, h, 3);
    for (let i = x - w / 2 + 7; i < x + w / 2 - 3; i += 7) {
      path(g, `M${Math.round(i)},${y - h / 2 + 5} v${h - 10}`);
    }
  } },
  handle: { d(g, x, y, o = {}) {
    const h = o.h || 50; rect(g, x, y, 20, h, 3);
    path(g, `M${x - 10},${y - h / 2 + 12} h20`);
  } },
  line: { d(g, x, y, o = {}) { const w = o.w || 200; path(g, `M${x - w / 2},${y} h${w}`); } },
  vline: { d(g, x, y, o = {}) { const h = o.h || 60; path(g, `M${x},${y - h / 2} v${h}`); } },
  screw: { d(g, x, y) { ring(g, x, y, 6); path(g, `M${x - 4},${y} h8`); } },
};

export const PRIMS = P;

// ---------------------------------------------------------------------------
// Option-card slots
// ---------------------------------------------------------------------------
// A lot of gear has an aperture in the back with a blanking plate over it, and
// what goes in that aperture changes the socket count. So a slot is a physical
// hole of a stated size, and a card is a faceplate that has to fit inside it —
// which means the same physical-fit reasoning that catches an impossible panel
// also catches a card that could not exist.
//
// A *format* is one aperture standard. A device says which format its slot
// takes and a card says which format it fits, so neither has to know anything
// about the other's model names. Adding a manufacturer means adding a format.
export const SLOT_FORMATS = {
  // Allen & Heath 'I/O Port' — SQ-Rack, SQ-5/6/7, SQ+ and the AHM processors.
  // Measured off A&H's own rear-panel drawing in the SQ-Rack Getting Started
  // Guide, scaled on the 19" ear-to-ear span (674 px = 482.6 mm). The same
  // scale puts the chassis body at 437.5 mm — the standard 19" body width —
  // which is the check that the scale itself is right.
  'ah-sq-io': { name: 'I/O Port', mm: 88, mmH: 41 },

  // Sonnet RackMac mini bay. SIZE DERIVED FROM THE MACHINE, NOT THE TRAY:
  // Sonnet publish no bay opening (only the SSD space, 102 x 102 x 13 mm), but
  // the bay must clear the Mac mini it holds, and Apple publish that chassis as
  // 197 x 197 x 36 mm. So the aperture is at least 197 x 36 and is recorded as
  // exactly that. Two of them is 394 mm of a 407 mm face, which is the check
  // that it is the right order of size — a 1U tray really does take two and
  // no more.
  'sonnet-macmini': { name: 'Mac mini bay', mm: 197, mmH: 36, approx: true },

  // Barco Encore3 card bay. VERTICAL, and this was corrected in v1.19.0 after
  // being shipped wrong.
  //
  // v1.18.0 reasoned the bay must be about 100 x 60 mm and horizontal, from
  // "seven bays fit a 4 U face as two rows of four". The fit check accepted
  // that, because it tests whether connectors fit a bay — not whether the bay
  // is the right shape. Barco's own rear photograph shows the seven cards are
  // VERTICAL, in a single row, and occupy only the right-hand portion of the
  // panel. So the reasoning was sound and the premise was invented.
  //
  // 30 x 145 mm, measured off that photograph: the chassis spans 1732 px for
  // Barco's stated 485.3 mm over the handles, and the seven coloured card
  // headers span 769 px = 215 mm, so a card face is 30.8 mm. That lands within
  // a millimetre of the older Event Master generation's 30.9 mm — fourteen
  // cards across a 432 mm chassis — which is the cross-check that the reading
  // is right. HEIGHT COMES FROM THE HORIZONTAL SCALE TOO: the photograph is a
  // three-quarter render showing the top of the case, so its vertical pixel
  // scale is not the panel's — measuring the card height against the width
  // gives 140 mm where the naive vertical reading gives 114. Still a BOUND rather than a
  // measurement — Barco publish no aperture dimension — but now a bound taken
  // from a photograph of the thing rather than from an assumed layout. It
  // agrees with the older Event Master generation, whose fourteen cards across
  // a 432 mm chassis give 30.9 mm.
  //
  'barco-e3': { name: 'Encore3 card bay', mm: 30, mmH: 145, approx: true },

  // Allen & Heath dLive / Avantis 'I/O Port'. A larger, separate aperture from
  // the SQ's, which the cards themselves prove: M-DL-DXLINK alone puts four
  // etherCON in one row — 96 mm of flange before any spacing — against an 88 mm
  // SQ port.
  //
  // SIZE NOT MEASURED, unlike every other dimension in this file. A&H publish
  // no mechanical drawing of the aperture and neither MixRack guide has a
  // rear-panel *drawing* to scale off — only photographs with callouts, which
  // carry no ruler. What is exact is the ASPECT RATIO: every card's fitting note
  // draws the aperture on the same 300 x 85 px template, so 3.53:1 is A&H's own
  // figure. The absolute size is pinned by what the cards demonstrably carry in
  // a single row — five Neutrik D-series on M-DL-AES, at a pitch of 6.6 plate
  // widths measured off that faceplate drawing, which puts the plate at 26 mm
  // pitch x 6.6 ~= 170 mm. Height follows from the ratio.
  //
  // `approx` marks it as the one slot size here that is derived rather than
  // measured, so the fit check below it is a sanity bound and not a guarantee.
  // One straight-on photograph of a dLive MixRack rear would replace this with
  // a real figure, the 19" span being the ruler.
  'ah-dl-io': { name: 'I/O Port', mm: 170, mmH: 48, approx: true },

  // Barco Event Master card bay (E2 / S3-4K). NOT 'barco-e3' — that is the
  // newer Encore3's aperture, a different chassis and a different card range
  // that merely looks similar (portrait, option-card slots, CXP links).
  //
  // WIDTH is Barco's own arithmetic and is corroborated by code already in
  // this file: the Event Master Devices User Guide (R5905948, Image 4-5) shows
  // 14 cards spanning a 432 mm E2 chassis, 432/14 = 30.86 mm — the exact figure
  // the `rot: 90` mechanism above was built to accommodate, because a Dual
  // Link DVI card (53 mm) only fits a card this narrow turned on its side.
  // Independently re-measured off the same figure: the 14-card row spans
  // 1279 px for that 432 mm width (0.338 mm/px), and the S3-4K's own 9-card
  // row in the same figure spans 826 px for 9 cards — 91.8 px/card against the
  // E2's 91.4 px/card, confirming the two chassis share one card face width.
  //
  // HEIGHT IS NOT 140 mm, though an early pass here read the figure that way.
  // Measuring the card column's pixel height against the 432 mm width gives
  // ~139 mm — but that number is IMPOSSIBLE: a 139 mm card cannot fit inside
  // the S3-4K, whose own published height is 132.6 mm (3U) end to end, rail to
  // rail, chassis I/O included. The width-based reading silently assumed the
  // figure's x and y pixel scales match; they do not — this drawing is not
  // isometric. What replaces it: each chassis's card column was measured
  // against ITS OWN published overall height instead — a real figure, not a
  // pixel ratio. E2: card column 412 px of a 612 px (178 mm / 4U) rail-to-rail
  // body = 119.8 mm. S3-4K: card column 411 px of a 488 px (132.6 mm / 3U)
  // body = 111.7 mm. Two independent devices, two independent calibrations,
  // agreeing to within 7% on a figure that — because E2 and S3-4K are stated
  // to share one card range — must be the same real number: about 116 mm.
  // 118 mm is used here, the average rounded up slightly for safety margin.
  // This is exactly the trap the fit check cannot catch on its own: it proves
  // a card's connectors fit a bay of a given size, never that the bay is that
  // size. See TODO §9b.
  'barco-em': { name: 'Event Master card bay', mm: 30.9, mmH: 118, approx: true },

  // Barco Event Master EX. A DIFFERENT, smaller aperture from 'barco-em' — EX
  // is 1U and its two flex banks of 4 HDMI are landscape, not portrait cards.
  // Measured off the EX rear figure (R5905948, Image 4-7) the same way as
  // above: the panel's rack-ear-to-rack-ear span is 788 px for Barco's stated
  // 484.1 mm (0.614 mm/px), and each flex zone measures 244-248 px wide by
  // 53 px tall against that scale — 150 x 33 mm. Cross-checked against the
  // panel's own outer body, which measures 77 px tall against the same scale
  // (47 mm) for a published 43.7 mm chassis — within measurement error.
  //
  // These are not physically swappable cards on the real unit — EX's HDMI
  // banks are fixed hardware, software-configured as input, output or
  // multiviewer. Modelled as slots anyway because that is exactly what
  // `accepts` is for: choosing a role from the inspector, whether or not
  // anything is actually unplugged to do it.
  'barco-ex-io': { name: 'EX flex I/O bank', mm: 150, mmH: 33, approx: true },
};

export const slotType = (fmt) => `slot_${String(fmt).replace(/[^a-z0-9]/gi, '')}`;

// One primitive per format. Auto-layout then sizes, wraps and stacks a slot
// with no idea that it is a slot — it is simply another object of known size.
Object.entries(SLOT_FORMATS).forEach(([fmt, f]) => {
  const w = f.mm * MM, h = f.mmH * MM;
  P[slotType(fmt)] = {
    mm: f.mm, mmH: f.mmH, nat: w,
    d(g, x, y) {
      rect(g, x, y, w, h, 4);
      [-1, 1].forEach((sx) => [-1, 1].forEach((sy) => {
        ring(g, x + sx * (w / 2 - 9), y + sy * (h / 2 - 9), 3.2);
      }));
    },
  };
});

// Cards are declared in the device library, which imports this module, so it
// cannot be imported back. It registers them here instead, and renderDevice can
// then resolve a fitted card without every caller having to pass one in.
const CARD_REG = new Map();
export function registerCards(list) {
  (list || []).forEach((c) => CARD_REG.set(c.id, c));
}
export const cardById = (id) => CARD_REG.get(id) || null;
// Cards that fit a slot. `accepts` is optional and only the Barco Encore3
// needs it so far: its seven bays are not interchangeable — two take input
// cards only, one takes an input or the link card, and four are flex and take
// anything. A slot with no `accepts` takes any card of its format, which is
// how every A&H and Sonnet slot already behaves, so nothing existing changes.
export const cardsFor = (fmt, accepts) =>
  [...CARD_REG.values()].filter((c) => c.fmt === fmt
    && (!accepts || !c.role || accepts.includes(c.role)));

// Flow a card's connectors inside the aperture. Deliberately not autoLayout:
// that lays out a whole panel face in bands of a rack unit, and a card is a
// handful of connectors in a hole 41 mm tall. Same spirit though — real widths,
// wrap when the row is full, and never shrink a connector to make it fit.
function layoutIn(items, cx, cy, w, h) {
  const flat = [];
  (items || []).forEach((it) => {
    const n = it.n || it.count || 1;
    for (let i = 0; i < n; i++) flat.push({ ...it, n: 1, _i: i, _n: n });
  });
  if (!flat.length) return [];

  const wOf = (e) => (elemMM(e).w || 12) * MM + 5;
  const hOf = (e) => (elemMM(e).h || 12) * MM;

  // Runs of the same connector at the same stack depth, as on a panel face.
  // A card is small enough that one band is always the right answer, so the
  // only vertical arrangement is the stacking a declaration asks for — which is
  // what puts SQ MADI's four BNC out over in rather than in one row of four.
  const runs = [];
  flat.forEach((it) => {
    const want = Math.max(1, it.stack || 1);
    const last = runs[runs.length - 1];
    if (last && last.t === it.t && last.want === want && last.rot === it.rot) last.items.push(it);
    else runs.push({ t: it.t, rot: it.rot, want, items: [it] });
  });
  runs.forEach((r) => {
    r.stack = Math.max(1, Math.min(r.want, Math.floor(h / hOf(r)) || 1, r.items.length));
    r.cols = Math.ceil(r.items.length / r.stack);
  });

  // A PORTRAIT APERTURE HOLDS A VERTICAL CARD, so its runs go down the face
  // rather than across it. Barco's Event Master and Encore3 cages are both
  // like this: fourteen cards across a 432 mm chassis leaves 31 mm of width
  // and the whole height of the box, so a Tri-combo's DisplayPort, HDMI and
  // six BNC are a column, not a row. Laying them across would need 61 mm and
  // the card would read as impossible.
  if (h > w) {
    runs.forEach((r) => { r.stack = r.items.length; r.cols = 1; });
    const totalH = runs.reduce((a, r) => a + r.items.length * hOf(r), 0);
    const scv = totalH > h ? h / totalH : 1;
    let y = cy - (totalH * scv) / 2;
    const col = [];
    runs.forEach((r) => {
      const step = hOf(r) * scv;
      r.items.forEach((it) => { col.push({ ...it, x: cx, y: y + step / 2 }); y += step; });
    });
    return col;
  }

  const total = runs.reduce((a, r) => a + r.cols * wOf(r), 0);
  // Overflow tightens the spacing rather than shrinking the connectors, so a
  // card that cannot physically fit its aperture reads as one on the drawing
  // instead of quietly scaling itself down until it does.
  const sc = total > w ? w / total : 1;
  let x = cx - (total * sc) / 2;

  const out = [];
  runs.forEach((r) => {
    const cw = wOf(r) * sc;
    const pitch = r.stack > 1 ? Math.min(hOf(r) + 5, h / r.stack) : 0;
    r.items.forEach((it, i) => {
      out.push({
        ...it,
        x: Math.round(x + cw * ((i % r.cols) + 0.5)),
        y: Math.round(cy + (Math.floor(i / r.cols) - (r.stack - 1) / 2) * pitch),
      });
    });
    x += cw * r.cols;
  });
  return out;
}

// One socket's declared name. Mirrors the rule the flow view reads labels by:
// an array names each socket, a bare string numbers them when there is more
// than one. Resolved here so a card's names can be prefixed with their slot.
const resolveLbl = (e) => {
  if (!e.lbl) return '';
  if (Array.isArray(e.lbl)) return e.lbl[e._i || 0] || '';
  return (e._n || 1) > 1 ? `${e.lbl} ${(e._i || 0) + 1}` : e.lbl;
};

// The slot's declared format, or null when `id` names no slot on this device.
export const slotDef = (dev, id) =>
  ((dev && dev.slots) || []).find((s) => s.id === id) || null;

// The positioned elements of one face, with any option-card slots expanded:
// the aperture itself, plus whatever card the item has fitted, laid out inside
// it. Everything that needs to know what sockets a device actually has — the
// drawing, the flow graph, the checks — goes through this one function, so a
// fitted card cannot appear on the panel but be missing from the patch.
export function faceElements(spec, dev, item, left = FACE_L, right = FACE_R) {
  if (!spec) return [];
  const fitted = (item && item.cards) || {};

  // A HAND-PLACED FACE CAN CARRY SLOTS TOO. It used to return early here, so
  // `{ t: 'slot' }` in an `elements` array drew an aperture and nothing else —
  // the fitted card's connectors never appeared, and it had no ports in the
  // flow view. Only `auto` faces expanded them. The Barco Encore3 is the first
  // face that needs both: seven bays at measured positions, which `auto`
  // cannot place because it bands by rack unit.
  if (Array.isArray(spec.elements)) {
    const out = [];
    for (const e of spec.elements) {
      if (e.t !== 'slot') { out.push(e); continue; }
      const def = slotDef(dev, e.slot);
      const f = def && SLOT_FORMATS[def.fmt];
      if (!def || !f) { out.push(e); continue; }
      out.push({ ...e, t: slotType(def.fmt), slot: e.slot, fmt: def.fmt });
      const card = cardById(fitted[e.slot]);
      if (!card) continue;
      const pad = 7 * MM;
      const pre = def.short || def.name || '';
      out.push(...layoutIn(card.auto, e.x, e.y, f.mm * MM - pad, f.mmH * MM - pad)
        .map((k) => ({ ...k, _card: card.id, _slot: e.slot,
          lbl: k.lbl ? (Array.isArray(k.lbl) ? k.lbl : `${pre} ${k.lbl}`) : k.lbl })));
    }
    return out;
  }
  if (!spec.auto) return [];

  const declared = spec.auto.map((e) => {
    if (e.t !== 'slot') return e;
    const def = slotDef(dev, e.slot);
    return def ? { ...e, t: slotType(def.fmt), slot: e.slot, fmt: def.fmt } : e;
  });

  const placed = autoLayout(declared, dev.ru || 1, left, right);
  const out = [];
  placed.forEach((e) => {
    out.push(e);
    if (!e.slot) return;
    const card = cardById(fitted[e.slot]);
    const f = SLOT_FORMATS[e.fmt];
    if (!card || !f) return;
    // Inset from the aperture edge: a card's faceplate overlaps the hole, and
    // its connectors sit inboard of the fixing screws.
    const pad = 7 * MM;
    const def = slotDef(dev, e.slot);
    const pre = (def && (def.short || def.name)) || '';
    out.push(...layoutIn(card.auto, e.x, e.y, f.mm * MM - pad, f.mmH * MM - pad)
      .map((k) => ({
        ...k, _card: card.id, _slot: e.slot,
        // Named for the slot they sit in, which is both what stops a card
        // socket colliding with an identical one on the chassis — an SQ-Rack
        // with the SLink card fitted has two SLink ports — and what A&H's own
        // patch screen does, where the tabs read 'SLink' and 'I/O Port'.
        lbl: [pre, resolveLbl(k)].filter(Boolean).join(' '),
        _i: 0, _n: 1,
      })));
  });
  return out;
}

// Intrinsic scale that renders a primitive at its real physical size.
export const intrinsic = (t) => {
  const p = P[t];
  return p && p.mm && p.nat ? (p.mm * MM) / p.nat : 1;
};
export const sizeMM = (t) => (P[t] && P[t].mm) || 0;
export const heightMM = (t) => (P[t] && (P[t].mmH || P[t].mm)) || 0;

// ---------------------------------------------------------------------------
export const CONNECTOR_GROUPS = [
  ['Audio', [
    ['xlrf', 'XLR female'], ['xlrm', 'XLR male'], ['xlr5f', 'XLR 5-pin (intercom)'], ['combo', 'Combo XLR/jack'],
    ['trs', '1/4" TRS (balanced / stereo)'], ['ts', '1/4" TS (unbalanced)'],
    ['jack', '1/4" jack — type not recorded'], ['minijack', '3.5 mm jack'],
    ['euroblock', 'Euroblock 3-pin'],
    ['toslink', 'ADAT / optical'], ['midi', 'MIDI 5-pin DIN'],
    ['rca', 'RCA phono'],
    ['nl2', 'speakON NL2'], ['nl4', 'speakON NL4'], ['nl8', 'speakON NL8'],
  ]],
  ['Data / video', [
    ['bnc', 'BNC'], ['rj45', 'RJ45'], ['ethercon', 'etherCON'],
    ['opticalcon', 'opticalCON'], ['sfp', 'SFP/SFP+'], ['qsfp', 'QSFP'], ['cxp', 'CXP'],
    ['hdmi', 'HDMI'], ['displayport', 'DisplayPort'],
    ['usba', 'USB-A'], ['usbb', 'USB-B'], ['usbc', 'USB-C'], ['dsub', 'D-sub'],
    ['hd15', 'HD15 / VGA'], ['dvi', 'DVI-I / DVI-D'],
    ['dcjack', 'DC barrel'],
  ]],
  ['Power — in', [
    ['socket_in', 'Schuko inlet'],
    ['iec_in', 'IEC C14 inlet'], ['iec_c7_in', 'IEC C7 inlet'],
    ['powercon_in', 'powerCON in'],
    ['true1_in', 'TRUE1 in'], ['cee16_in', 'CEE 16 A in'],
    ['cee32_1_in', 'CEE 32 A 1ph in'], ['cee32_3_in', 'CEE 32 A 3ph in'],
    ['cee63_1_in', 'CEE 63 A 1ph in'], ['cee125_3_in', 'CEE 125 A 3ph in'],
    ['powerlock_in', 'Powerlock in'],
  ]],
  ['Power — thru', [
    ['bs13a_thru', '13 A outlet'], ['socket_thru', 'Schuko outlet'],
    ['iec_thru', 'IEC C13 outlet'], ['powercon_thru', 'powerCON thru'],
    ['true1_thru', 'TRUE1 thru'], ['cee16_thru', 'CEE 16 A thru'],
    ['cee32_1_thru', 'CEE 32 A 1ph thru'], ['cee32_3_thru', 'CEE 32 A 3ph thru'],
    ['cee63_1_thru', 'CEE 63 A 1ph thru'], ['cee125_3_thru', 'CEE 125 A 3ph thru'],
    ['powerlock_thru', 'Powerlock thru'],
  ]],
  ['Multipin', [
    ['socapex_in', 'Socapex 19p in'], ['socapex_thru', 'Socapex 19p thru'],
    ['veam_in', 'VEAM 19p in'], ['veam_thru', 'VEAM 19p thru'],
    ['veam8_in', 'VEAM 8p in'], ['veam8_thru', 'VEAM 8p thru'],
    ['veam12_in', 'VEAM 12p in'], ['veam12_thru', 'VEAM 12p thru'],
    ['veam16_in', 'VEAM 16p in'], ['veam16_thru', 'VEAM 16p thru'],
    ['veam24_in', 'VEAM 24p in'], ['veam24_thru', 'VEAM 24p thru'],
    ['veam32_in', 'VEAM 32p in'], ['veam32_thru', 'VEAM 32p thru'],
    ['veam48_in', 'VEAM 48p in'], ['veam48_thru', 'VEAM 48p thru'],
  ]],
  // A breaker lives here, not under Power, because it is a switch: you cannot
  // plug anything into it. Left in the power group it became a patchable port
  // and a punchable patch-panel hole, which is how a rack PDU ended up with two
  // rows in the flow view that no cable could ever land on.
  ['Controls / panel', [
    ['breaker', 'Breaker'],
    ['knob', 'Knob'], ['encoder', 'Encoder'], ['button', 'Button'],
    ['led', 'LED'], ['meter', 'Meter'], ['fader', 'Fader'],
    ['display', 'Display'], ['vent', 'Vent'], ['mesh', 'Mesh'],
    ['handle', 'Handle'], ['fan', 'Fan'], ['brush', 'Brush strip'],
    ['bar', 'Bar / pull'],
  ]],
];

export const CONNECTOR_TYPES = CONNECTOR_GROUPS.flatMap(([, l]) => l);
export const PATCH_GROUPS = CONNECTOR_GROUPS.filter(([n]) => n !== 'Controls / panel');
export const PATCH_TYPES = PATCH_GROUPS.flatMap(([, l]) => l);
// Compact codes for the patch-grid cells — "spe" told you nothing.
// Suffix i / o distinguishes inlet from outlet where both exist.
export const SHORT = {
  xlrf: 'XLRf', xlrm: 'XLRm', xlr5f: 'XLR5', combo: 'XLR/TRS',
  trs: 'TRS', ts: 'TS', jack: 'JACK', minijack: '3.5',
  euroblock: 'EURO', toslink: 'ADAT', midi: 'MIDI', rca: 'RCA',
  nl2: 'NL2', nl4: 'NL4', nl8: 'NL8',
  bnc: 'BNC', rj45: 'RJ45', ethercon: 'EC', opticalcon: 'OC',
  sfp: 'SFP', qsfp: 'QSFP', cxp: 'CXP',
  hdmi: 'HDMI', displayport: 'DP',
  usba: 'USBa', usbb: 'USBb', usbc: 'USBc', dsub: 'DSUB',
  hd15: 'HD15', dvi: 'DVI',
  dcjack: 'DC',
  socket_in: 'SKOi', socket_thru: 'SKO', bs13a_thru: '13A',
  // Kept distinct on purpose: the code is the only thing telling an inlet from
  // an outlet in a patch cell or on a flow port row.
  iec_in: 'IEC in', iec_thru: 'IEC out', iec_c7_in: 'C7 in',
  powercon_in: 'PCi', powercon_thru: 'PCo', true1_in: 'T1i', true1_thru: 'T1o',
  cee16_in: '16Ai', cee16_thru: '16Ao',
  cee32_1_in: '32/1i', cee32_1_thru: '32/1', cee32_3_in: '32/3i', cee32_3_thru: '32/3',
  cee63_1_in: '63/1i', cee63_1_thru: '63/1', cee125_3_in: '125i', cee125_3_thru: '125',
  powerlock_in: 'PLi', powerlock_thru: 'PLo', breaker: 'MCB',
  socapex_in: 'SOCi', socapex_thru: 'SOCo', veam_in: 'VMi', veam_thru: 'VMo',
  veam8_in: 'VM8i', veam8_thru: 'VM8o', veam12_in: 'VM12i', veam12_thru: 'VM12o', veam16_in: 'VM16i', veam16_thru: 'VM16o', veam24_in: 'VM24i', veam24_thru: 'VM24o', veam32_in: 'VM32i', veam32_thru: 'VM32o', veam48_in: 'VM48i', veam48_thru: 'VM48o',
};
export const shortCode = (t) => SHORT[t] || (t || '').slice(0, 4);

export const typeLabel = (t) =>
  (CONNECTOR_TYPES.find(([v]) => v === t) || [, t])[1];

// ---------------------------------------------------------------------------
// Auto-layout: bare connector list -> positioned elements.
// ---------------------------------------------------------------------------
// `left`/`right` bound the usable face. They default to a full 19" panel, but a
// half-width device has no ears and only half the room, so it passes its own.
//
// Stacking. Real 1U rears very often run their 1/4" jacks two deep rather than
// in one long line, because a jack is 15 mm across but also only 15 mm tall:
// two rows cost 30 mm of the 44 mm U and halve the face width the bank eats.
// A D-shell cannot do that — 31 mm twice over does not fit in a U — and the
// height test in `depthLimit` is what enforces it, so no list of exceptions has
// to be maintained. Declare it per run with `stack: 2`; runs that overflow the
// face get stacked automatically, which beats the old behaviour of shrinking
// connectors below their real size to make them fit.
const MAX_STACK = 3;

// How many rows of `t` will honestly fit in a band `bandH` units tall.
function depthLimit(t, bandH) {
  const h = (heightMM(t) || 20) * MM;
  let s = 1;
  while (s < MAX_STACK && (s + 1) * h + s * 6 <= bandH - 12) s++;
  return s;
}

// Split a band into contiguous runs of one connector type. A run is the unit
// that gets stacked, so that a stacked bank reads as one tidy grid.
function runsOf(list) {
  const runs = [];
  list.forEach((it) => {
    const want = Math.max(1, it.stack || 1);
    const last = runs[runs.length - 1];
    if (last && last.t === it.t && last.want === want && last.rot === it.rot) last.items.push(it);
    else runs.push({ t: it.t, rot: it.rot, want, items: [it] });
  });
  return runs;
}

export function autoLayout(items, ru = 1, left = FACE_L, right = FACE_R) {
  const flat = [];
  items.forEach((it) => {
    const n = it.n || it.count || 1;
    // `_i` / `_n` survive the flattening so a declaration carrying `lbl` can
    // still tell which of its own sockets each one is. Nothing draws them.
    for (let i = 0; i < n; i++) flat.push({ ...it, t: it.t, n: 1, _i: i, _n: n });
  });
  if (!flat.length) return [];

  const faceW = right - left;
  const out = [];
  const width = (e) => (elemMM(e).w ? elemMM(e).w * MM : 40) + 12;

  const rows = [];
  let row = [], used = 0;
  flat.forEach((it) => {
    const w = width(it);
    if (row.length && used + w > faceW && rows.length < ru - 1) {
      rows.push(row); row = []; used = 0;
    }
    row.push(it); used += w;
  });
  if (row.length) rows.push(row);

  // Bands are equal shares of the face by default. But a row can contain
  // something that simply does not fit an equal share — an option-card aperture
  // is over a rack unit tall, and on a panel with a row per unit that leaves it
  // hanging off the bottom edge. When any row needs more than its share, the
  // heights are allocated by what each row actually needs and the leftover is
  // split evenly. A panel whose rows all fit their equal share is untouched,
  // which is every panel that existed before slots did.
  const equal = (ru * U) / rows.length;
  const need = rows.map((r) => Math.max(...r.map((it) => (heightMM(it.t) || 20) * MM)));
  const total = need.reduce((a, b) => a + b, 0);
  // EDGE is the breathing room a row wants beyond the bare height of what is in
  // it. Without it a 48 mm aperture in a 48.26 mm band technically "fits" while
  // touching the panel edge top and bottom, which is not a panel anyone made.
  const EDGE = 8;
  const bands = (need.some((h) => h + EDGE > equal) && total <= ru * U)
    ? need.map((h) => h + (ru * U - total) / rows.length)
    : rows.map(() => equal);
  const tops = [];
  bands.reduce((y, h) => { tops.push(y); return y + h; }, 0);

  rows.forEach((r, ri) => {
    const bandH = bands[ri];
    const runs = runsOf(r);
    const cols = (run) => Math.ceil(run.items.length / run.stack);
    const runW = (run) => cols(run) * width(run);
    const totalW = () => runs.reduce((a, run) => a + runW(run), 0);

    runs.forEach((run) => {
      run.max = Math.min(depthLimit(run.t, bandH), run.items.length);
      run.stack = Math.min(run.want, run.max);
    });
    // Deepen the widest run that still has room, until the band fits. Only
    // banks of three or more get folded automatically: turning a lone S/PDIF
    // pair into a 1-wide column buys almost no width and says something about
    // the panel that was never checked. Declare `stack` if a pair really does
    // sit one above the other.
    while (totalW() > faceW) {
      const cand = runs.filter((run) => run.stack < run.max && run.items.length >= 3)
        .sort((a, b) => runW(b) - runW(a))[0];
      if (!cand) break;
      cand.stack++;
    }

    const total = totalW();
    const scale = total > faceW ? faceW / total : 1;
    let x = left + (faceW - total * scale) / 2;
    const cy = tops[ri] + bandH / 2;

    runs.forEach((run) => {
      const w = width(run) * scale;
      const nc = cols(run);
      const pitch = run.stack > 1
        ? Math.min((heightMM(run.t) || 20) * MM + 6, (bandH - 16) / run.stack)
        : 0;
      run.items.forEach((it, i) => {
        out.push({
          ...it, n: 1,
          x: x + w * ((i % nc) + 0.5),
          y: cy + (Math.floor(i / nc) - (run.stack - 1) / 2) * pitch,
        });
      });
      x += w * nc;
    });
  });
  return out;
}

// ---------------------------------------------------------------------------
function chassis(g, ru, H, bg, body) {
  g.appendChild(el('rect', {
    x: 3, y: 3, width: W - 6, height: H - 6, rx: 4, fill: bg || 'none',
  }));
  if (body) {
    // The body sits central; everything outside it is blanking plate, so the
    // seam is drawn where the real one is rather than at the rack ear.
    const [bx0, bx1] = body;
    g.appendChild(el('rect', {
      x: bx0, y: 7, width: bx1 - bx0, height: H - 14, rx: 3, fill: bg || 'none',
    }));
  }
  path(g, `M${EAR_L},8 V${H - 8} M${EAR_R},8 V${H - 8}`);
  for (let u = 0; u < ru; u++) {
    [31, W - 31].forEach((ex) => {
      [u * U + 24, u * U + 60].forEach((hy) => {
        g.appendChild(el('rect', { x: ex - 7, y: hy, width: 14, height: 21, rx: 7 }));
      });
    });
  }
}

function drawElements(g, spec, sw) {
  (spec.elements || []).forEach((e) => {
    const prim = P[e.t];
    if (!prim) return;
    const s = intrinsic(e.t) * (e.scale || 1);
    const n = e.n || 1;
    const gap = e.gap || 0;
    for (let i = 0; i < n; i++) {
      const cx = e.x + i * gap;
      // Turn the connector on its side about its own centre. Done as an outer
      // group so it composes with `scale:` below rather than fighting it.
      let host = g;
      if (isRot(e)) {
        host = el('g', { transform: `rotate(${e.rot} ${p1(cx)} ${p1(e.y)})` });
        g.appendChild(host);
      }
      if (Math.abs(s - 1) > 0.001) {
        const sg = el('g', {
          transform: `translate(${p1(cx)} ${p1(e.y)}) scale(${p1(s)}) `
                   + `translate(${p1(-cx)} ${p1(-e.y)})`,
          'stroke-width': p1(sw / s),
        });
        host.appendChild(sg);
        prim.d(sg, cx, e.y, e);
      } else {
        prim.d(host, cx, e.y, e);
      }
    }
  });
  (spec.labels || []).forEach((l) => {
    g.appendChild(txt(l.text, {
      x: l.x, y: l.y, 'font-size': l.size || 19,
      'letter-spacing': l.ls ?? 1.5, 'text-anchor': l.anchor || 'start',
    }));
  });
}

function panelSvg(width, H, sw) {
  const svg = el('svg', {
    viewBox: `0 0 ${width} ${H}`, class: 'panel', preserveAspectRatio: 'none',
  });
  const g = el('g', {
    fill: 'none', stroke: 'currentColor', 'stroke-width': sw,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  });
  svg.appendChild(g);
  return { svg, g };
}

export function renderPanel(spec, opt = {}) {
  const ru = spec.ru || 1;
  const H = U * ru;
  const sw = opt.stroke || 3;
  const { svg, g } = panelSvg(W, H, sw);
  chassis(g, ru, H, opt.bg, opt.body);
  drawElements(g, spec, sw);
  if (opt.hatch) hatchBacking(svg, g, H, { key: opt.hatchKey });
  return svg;
}

// Half-width devices are desktop boxes sitting on a shelf, not rack-mounted, so
// they get a plain body outline with no ears and no mounting holes.
//
// WIDTH: half of the interior between the ears (EAR_L..EAR_R = 876), NOT half of
// the 1000-unit panel — the 19" figure includes the mounting ears, so halving it
// makes the box too wide and it collides with the ears of whatever it sits on.
// 438 units = 211.4 mm, against a real half-rack width of ~215.9 mm.
// --- narrower-than-19" devices, mounted centrally with filler either side ----
// Plenty of real gear is neither full width nor half: the Behringer XR18 is
// 333 mm, the ATEM 1 M/E is two-thirds rack, the Shure ANI4IN is a third. They
// rack with the manufacturer's own hardware, which is a bracket that centres
// the body and fills the rest of the U — so that is exactly how they are
// drawn: the body at its TRUE width in the middle, blanking plate either side.
//
// Occupancy is deliberately unchanged. A narrow device still claims the whole
// row, because the filler plates are physically there and nothing else can go
// beside it. That is the difference from `half`, where two boxes genuinely do
// share a U.
export const isNarrow = (dev) => !!dev && !dev.half && dev.widthMM > 0
  && dev.widthMM < 482.6;

// Body edges in panel units for a narrow device, centred on the face.
export function bodyBounds(dev) {
  const w = dev.widthMM * MM;
  const x0 = (W - w) / 2;
  return [x0, x0 + w];
}

export const HALF_W = (EAR_R - EAR_L) / 2;        // 438
export const HALF_L = EAR_L;                      // left box starts here
export const HALF_R = EAR_L + HALF_W;             // right box starts here
// Margin between a half-width body's edge and its usable face, matching the
// FACE_L inset on a full panel.
export const HALF_INSET = FACE_L - EAR_L;         // 16

// Plenty of half-rack RF gear ships with rack ears and bolts straight in, no tray.
// Such a unit's drawing is one ear wider than its body, with the ear on the OUTER
// side, so the whole thing spans from the rack rail to the centre line: a left
// unit covers rack x 0..500, a right unit 500..1000. `opt.ears` is which side the
// ear goes on IN THE DRAWING, which the caller flips for the rear view.
export const HALF_EAR_W = EAR_L;                  // 62 — same ear a full panel has

const earedWidth = (ears) => (ears ? EAR_L + HALF_W : HALF_W);
const earedBodyX = (ears) => (ears === 'left' ? EAR_L : 0);

function halfBody(g, H, bodyX, bg) {
  g.appendChild(el('rect', {
    x: bodyX + 8, y: 7, width: HALF_W - 16, height: H - 14, rx: 9, fill: bg || 'none',
  }));
}

// The ear itself, drawn to the same geometry as a full panel's: it runs right up
// to the rail with two mounting holes per U on the ear's centre line.
function halfEar(g, ru, H, side, bg) {
  const x0 = side === 'left' ? 0 : HALF_W;
  g.appendChild(el('rect', {
    x: x0 + 3, y: 3, width: EAR_L - 3, height: H - 6, rx: 4, fill: bg || 'none',
  }));
  for (let u = 0; u < ru; u++) {
    [u * U + 24, u * U + 60].forEach((hy) => {
      g.appendChild(el('rect', {
        x: x0 + 31 - 7, y: hy, width: 14, height: 21, rx: 7,
      }));
    });
  }
}

export function renderHalfPanel(spec, opt = {}) {
  const ru = spec.ru || 1;
  const H = U * ru;
  const sw = opt.stroke || 3;
  const ears = opt.ears === 'left' || opt.ears === 'right' ? opt.ears : null;
  const bodyX = earedBodyX(ears);
  const { svg, g } = panelSvg(earedWidth(ears), H, sw);
  halfBody(g, H, bodyX, opt.bg);
  if (ears) halfEar(g, ru, H, ears, opt.bg);
  // Panel detail is authored in body coordinates, so shift it onto the body
  // rather than teaching every device about the ear.
  const cg = bodyX
    ? el('g', { transform: `translate(${bodyX} 0)` })
    : g;
  if (cg !== g) g.appendChild(cg);
  drawElements(cg, spec, sw);
  if (opt.hatch) {
    hatchBacking(svg, g, H,
      { x0: bodyX + 12, x1: bodyX + HALF_W - 12, key: opt.hatchKey });
  }
  return svg;
}

// A shelf carrying half-rack gear: draw only the mounting ears. The shelf body
// behind the gear is hidden, but the ears still read at the sides.
export function renderEarsOnly(ru, opt = {}) {
  const H = U * ru;
  const { svg, g } = panelSvg(W, H, 3);
  g.appendChild(el('rect', { x: 3, y: 3, width: EAR_L - 3, height: H - 6, rx: 4,
                             fill: opt.bg || 'none' }));
  g.appendChild(el('rect', { x: EAR_R, y: 3, width: W - 3 - EAR_R, height: H - 6, rx: 4,
                             fill: opt.bg || 'none' }));
  for (let u = 0; u < ru; u++) {
    [31, W - 31].forEach((ex) => {
      [u * U + 24, u * U + 60].forEach((hy) => {
        g.appendChild(el('rect', { x: ex - 7, y: hy, width: 14, height: 21, rx: 7 }));
      });
    });
  }
  return svg;
}

// True when the device actually documents its rear panel.
export const hasRear = (dev) => !!(dev && dev.rear
  && (Array.isArray(dev.rear.elements) || dev.rear.auto));

// The diagonal hatch that says "you are looking at the back of this". Used for
// every rear face — with connectors drawn over it when we know them, with a
// note when we don't — so the rear elevation reads as one thing.
export function hatchBacking(svg, g, H, opts = {}) {
  const x0 = opts.x0 ?? EAR_L + 4;
  const x1 = opts.x1 ?? EAR_R - 4;
  const key = `${opts.key || ''}${x0}_${x1}_${H}`;
  const cid = 'hx' + Math.abs(hashStr(key)).toString(36);

  const defs = el('defs');
  const cp = el('clipPath', { id: cid });
  cp.appendChild(el('rect', { x: x0, y: 8, width: x1 - x0, height: H - 16 }));
  defs.appendChild(cp);
  svg.insertBefore(defs, svg.firstChild);

  const hg = el('g', {
    'clip-path': `url(#${cid})`,
    'stroke-opacity': String(opts.opacity ?? 0.16),
  });
  // After the chassis fill (which is opaque and would cover it) but before the
  // panel detail, so connectors stay legible on top.
  g.insertBefore(hg, g.childNodes[1] || null);
  for (let x = x0 - H; x < x1 + H; x += 30) path(hg, `M${x},${H - 8} L${x + H},8`);
}

// Rear face we have no drawing for. `quiet` drops the centred caption, used when
// something in front partly covers this panel and the text would collide.
export function renderNoRear(dev, ru, opt = {}) {
  const H = U * ru;
  // A half-width device needs a half-width hatch — drawing a full 19" panel into
  // a half-width slot squashed the whole thing.
  if (dev.half) {
    const ears = opt.ears === 'left' || opt.ears === 'right' ? opt.ears : null;
    const bodyX = earedBodyX(ears);
    const { svg, g } = panelSvg(earedWidth(ears), H, 3);
    halfBody(g, H, bodyX, opt.bg);
    if (ears) halfEar(g, ru, H, ears, opt.bg);
    hatchBacking(svg, g, H,
      { x0: bodyX + 12, x1: bodyX + HALF_W - 12, key: dev.id + ru, opacity: 0.22 });
    if (opt.quiet) return svg;
    const cx = bodyX + HALF_W / 2;
    g.appendChild(txt(dev.model, {
      x: cx, y: H / 2 - 1, 'font-size': 15, 'letter-spacing': 1.2,
      'text-anchor': 'middle',
    }));
    g.appendChild(txt('rear not documented', {
      x: cx, y: H / 2 + 16, 'font-size': 10, 'letter-spacing': 1,
      'text-anchor': 'middle', 'fill-opacity': '0.55',
    }));
    return svg;
  }

  const { svg, g } = panelSvg(W, H, 3);
  chassis(g, ru, H, opt.bg);
  hatchBacking(svg, g, H, { key: dev.id + ru, opacity: 0.22 });
  if (opt.quiet) return svg;

  g.appendChild(txt(`${dev.brand}  ${dev.model}`, {
    x: W / 2, y: H / 2 - 2, 'font-size': 22, 'letter-spacing': 2,
    'text-anchor': 'middle',
  }));
  g.appendChild(txt('rear not documented', {
    x: W / 2, y: H / 2 + 22, 'font-size': 14, 'letter-spacing': 1.5,
    'text-anchor': 'middle', 'fill-opacity': '0.55',
  }));
  return svg;
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

export function renderBlock(dev, opt = {}) {
  const ru = dev.ru || 1;
  const H = U * ru;
  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`, class: 'panel', preserveAspectRatio: 'none',
  });
  const g = el('g', {
    fill: 'none', stroke: 'currentColor', 'stroke-width': 3,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  });
  svg.appendChild(g);
  chassis(g, ru, H, opt.bg);
  g.appendChild(txt(`${dev.brand}  ${dev.model}`, {
    x: W / 2, y: H / 2 + 8, 'font-size': 24, 'letter-spacing': 3, 'text-anchor': 'middle',
  }));
  return svg;
}

// ---------------------------------------------------------------------------
// Custom patch panels — the punched holes live on the rack item, not the device.
//   item: { ru, cols, slots: [type|null, ...] }  length ru*cols, row-major
// ---------------------------------------------------------------------------
export const patchRU = (dev, item) => (item && item.ru) || dev.ru || 1;
export const patchCols = (dev, item) => (item && item.cols) || dev.cols || 12;
// Rows are deliberately NOT tied to plate height: a 2U plate with one row gives
// each connector 88 mm of height, which is how you actually mount a 16 A CEE.
export const patchRows = (dev, item) =>
  (item && item.rows) || patchRU(dev, item);

export function patchSlotXY(ru, rows, cols, index) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const faceW = FACE_R - FACE_L;
  return {
    x: FACE_L + (faceW * (col + 0.5)) / cols,
    y: (U * ru * (row + 0.5)) / rows,
  };
}

// Per-row physical fit. Connectors are drawn at true size, so a row can be
// genuinely impossible in two ways: too wide, or taller than the row itself.
export function patchFit(ru, rows, cols, slots) {
  const rowMM = (ru * U_MM) / rows;
  const out = [];
  for (let r = 0; r < rows; r++) {
    let widthMM = 0, tallestMM = 0, count = 0;
    for (let c = 0; c < cols; c++) {
      const t = slots?.[r * cols + c];
      if (!t || !P[t]) continue;
      count += 1;
      widthMM += sizeMM(t);
      tallestMM = Math.max(tallestMM, heightMM(t));
    }
    out.push({
      row: r + 1, count, widthMM: Math.round(widthMM), tallestMM,
      rowMM: Math.round(rowMM),
      tooWide: widthMM > FACE_MM,
      tooTall: tallestMM > rowMM,
      widthPct: Math.round((widthMM / FACE_MM) * 100),
    });
  }
  return out;
}

export function renderPatch(dev, item, opt = {}) {
  const ru = patchRU(dev, item);
  const rows = patchRows(dev, item);
  const cols = patchCols(dev, item);
  const slots = (item && item.slots) || [];
  const elements = [];
  for (let i = 0; i < rows * cols; i++) {
    const t = slots[i];
    if (!t || !P[t]) continue;
    elements.push({ t, ...patchSlotXY(ru, rows, cols, i) });
  }
  return renderPanel({ ru, elements }, opt);
}

export function renderDevice(dev, view = 'front', item = null, opt = {}) {
  if (dev.patch) return renderPatch(dev, item, opt);
  const layout = dev[view];
  const o = { ...opt };
  if (o.hatch) o.hatchKey = dev.id + view + (dev.ru || 1);
  if (dev.half) {
    if (layout && Array.isArray(layout.elements)) {
      return renderHalfPanel({ ru: dev.ru, ...layout }, o);
    }
    // A half-width face has no ears, so auto-layout gets its own narrower bounds.
    if (layout && layout.auto) {
      return renderHalfPanel({
        ru: dev.ru,
        elements: faceElements(layout, dev, item, HALF_INSET, HALF_W - HALF_INSET),
        labels: layout.labels,
      }, o);
    }
    return renderHalfPanel({ ru: dev.ru, elements: [], labels: [
      { text: `${dev.brand} ${dev.model}`, x: HALF_W / 2, y: (U * dev.ru) / 2 + 7,
        size: 20, ls: 2, anchor: 'middle' }] }, o);
  }
  if (isNarrow(dev)) {
    const [bx0, bx1] = bodyBounds(dev);
    const inset = FACE_L - EAR_L;
    o.body = [bx0, bx1];
    if (layout && Array.isArray(layout.elements)) {
      return renderPanel({ ru: dev.ru, ...layout }, o);
    }
    if (layout && layout.auto) {
      return renderPanel({
        ru: dev.ru,
        elements: faceElements(layout, dev, item, bx0 + inset, bx1 - inset),
        labels: layout.labels,
      }, o);
    }
    return renderPanel({ ru: dev.ru, elements: [], labels: [
      { text: `${dev.brand} ${dev.model}`, x: W / 2, y: (U * dev.ru) / 2 + 7,
        size: 20, ls: 2, anchor: 'middle' }] }, o);
  }
  // An explicitly empty `elements` array is a real layout — a blank panel.
  if (layout && Array.isArray(layout.elements)) {
    // A hand-placed face carrying slots has to be expanded first, or the
    // apertures and their fitted cards never reach the drawing. Faces with no
    // slot go straight through, which is every hand-placed face but one.
    const els = layout.elements.some((e) => e.t === 'slot')
      ? faceElements(layout, dev, item)
      : layout.elements;
    return renderPanel({ ru: dev.ru, ...layout, elements: els }, o);
  }
  if (layout && layout.auto) {
    return renderPanel({ ru: dev.ru, elements: faceElements(layout, dev, item),
                         labels: layout.labels }, o);
  }
  return renderBlock(dev, o);
}
