// Waves — 3 SoundGrid servers
//
// PROVENANCE. Gathered by a Haiku research pass from Waves' own A&E
// specification PDFs (assets.wavescdn.com/pdf/hardware/). By instruction the
// figures were NOT independently re-checked and are owed a manual pass — see
// TODO §8f, which lists exactly which numbers those are.
//
// NO PANEL FIGURE EXISTS IN THOSE PDFS. They are schematic dimension drawings,
// so they confirm what is ON each face and not the order across it. Both faces
// are therefore `auto`: the inventory and the connector sizes are real, the
// left-to-right order is the layout engine's guess. Treat these rears as "what
// is on the back and how much of it", not as a photograph of the back.
//
// The fronts carry a confirmed element inventory at UNCONFIRMED POSITIONS —
// same standing as the Spectera Base Station. Waves state a power button and
// two status LEDs (network, CPU temperature); where those sit is not published.
//
// THE SOUNDGRID PORT IS DRAWN AS etherCON, AND THAT IS THE SOFTEST CALL HERE.
// Waves' A&E text names an "Ethercon connector", which is a Neutrik locking
// shell rather than a bare RJ45, and the two draw differently. No figure
// confirms it. If somebody has one in front of them, read the panel — a plain
// RJ45 would be the unsurprising fitting on a server, and this is the first
// thing to correct if it is wrong.
//
// ONLY THE THREE CURRENT MODELS. The Extreme Server, Proton Server and
// SoundGrid Server One-C are discontinued, and this library does not carry
// discontinued lines — same grounds as Martin's MA series and the Pulse².

export const WAVES = [
  // 2U, 482 x 88 x 392 mm over the ears, 7.0 kg, 140 W, one IEC inlet.
  // Category is `audio`, not `computing`: it is a server, but it is a server
  // that does nothing except run audio processing.
  { id: 'waves-titan', brand: 'Waves', model: 'Titan SoundGrid Server',
    category: 'audio', ru: 2, depth: 392, weight: 7, power: 140,
    src: 'https://www.waves.com/hardware/titan-soundgrid-server',
    front: { elements: [
      { t: 'button', x: 110, y: 100, w: 30, h: 30 },
      { t: 'led', x: 170, y: 88 },
      { t: 'led', x: 170, y: 112 },
    ], labels: [
      { text: 'WAVES', x: 240, y: 94, size: 20, ls: 2 },
      { text: 'TITAN', x: 240, y: 128, size: 13, ls: 1.5 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'ethercon', n: 1, sig: 'soundgrid', lbl: 'SOUNDGRID' },
      { t: 'usba', n: 2 },
      { t: 'hdmi', n: 2 },
    ] } },

  // The redundant-PSU Titan. 9.2 kg for the second supply, and TWO IEC inlets.
  //
  // THIS IS THE FIRST DEVICE IN THE LIBRARY WITH TWO MAINS INLETS — the gap
  // noted in v1.10.7 against the ATEM 4 M/E. Nothing needed changing: `auto`
  // takes `n: 2` and draws two, and the summary counts the device's draw once,
  // which is right — a redundant pair is one load, not two.
  //
  // 140 W is labelled "max" in Waves' spec for this model and unlabelled for
  // the Titan, though it is the same platform and the same number. Recorded as
  // `power` on both rather than splitting them, because reporting one as a
  // ceiling and one as an operating figure would make two identical servers
  // total differently. TODO §8f.
  { id: 'waves-titan-r', brand: 'Waves', model: 'Titan-R SoundGrid Server',
    category: 'audio', ru: 2, depth: 392, weight: 9.2, power: 140,
    src: 'https://www.waves.com/hardware/titan-r-soundgrid-server',
    front: { elements: [
      { t: 'button', x: 110, y: 100, w: 30, h: 30 },
      { t: 'led', x: 170, y: 88 },
      { t: 'led', x: 170, y: 112 },
      { t: 'led', x: 196, y: 100 },
    ], labels: [
      { text: 'WAVES', x: 250, y: 94, size: 20, ls: 2 },
      { text: 'TITAN-R', x: 250, y: 128, size: 13, ls: 1.5 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 2, lbl: ['MAINS A', 'MAINS B'] },
      { t: 'ethercon', n: 1, sig: 'soundgrid', lbl: 'SOUNDGRID' },
      { t: 'usba', n: 2 },
      { t: 'hdmi', n: 2 },
    ] } },

  // HALF RACK, and it ships with ears. 221 x 86 x 284 mm, 3.4 kg, 65 W.
  // Waves' spec says "1/2 rack width" with rack ears included as standard, so
  // this carries `half: true, ears: true` — it bolts to the rails and wants no
  // shelf. 221 mm against the app's 211 mm HALF_W, so it draws about 10 mm
  // narrow, the same simplification the Shure half-rack units carry.
  //
  // One fewer HDMI than the Titans, per the spec.
  { id: 'waves-extreme-c', brand: 'Waves', model: 'Extreme-C SoundGrid Server',
    category: 'audio', ru: 2, depth: 284, weight: 3.4, power: 65,
    half: true, ears: true,
    src: 'https://www.waves.com/hardware/soundgrid-extreme-server-c',
    front: { elements: [
      { t: 'button', x: 70, y: 100, w: 26, h: 26 },
      { t: 'led', x: 120, y: 88 },
      { t: 'led', x: 120, y: 112 },
    ], labels: [
      { text: 'WAVES', x: 170, y: 96, size: 15, ls: 1.5 },
      { text: 'EXTREME-C', x: 170, y: 126, size: 9, ls: 1 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'ethercon', n: 1, sig: 'soundgrid', lbl: 'SOUNDGRID' },
      { t: 'usba', n: 2 },
      { t: 'hdmi', n: 1 },
    ] } },
];
