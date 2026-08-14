// Seed device catalogue — the index.
//
// One module per brand, under devices/. Adding a device means opening that
// brand's file and nothing else, which is the whole point: two people adding
// gear to different manufacturers never touch the same file, and finding an
// entry is a filename rather than a search through 4,000 lines.
//
// Adding a BRAND means a new file plus two lines here. Nothing else — the
// bundler and the dev server both discover devices/*.js on their own.
//
// SPEC ACCURACY: `ru` is reliable. Entries marked `approx: true` have weight/
// depth/power figures that are ballpark, not datasheet-verified — good enough
// for layout, NOT for truss loading or power distribution sign-off. Entries
// with a `src` field were checked against the linked manufacturer documentation.
//
// A device needs only { id, brand, model, category, ru } to be usable; the
// panel falls back to a labelled block. `front`/`rear` add drawing detail,
// either as hand-placed `elements` or as an `auto` connector list.
//
// CATEGORIES lives in devices/_lib.js and OPTION_CARDS in devices/cards.js;
// both are imported from there directly rather than re-exported here, because
// the single-file build shares one scope and an alias would collide.

import { ALLEN_HEATH } from './devices/allen-heath.js';
import { ANALOG_WAY } from './devices/analog-way.js';
import { APC } from './devices/apc.js';
import { ATEN } from './devices/aten.js';
import { BEHRINGER } from './devices/behringer.js';
import { CISCO } from './devices/cisco.js';
import { CLEAR_COM } from './devices/clear-com.js';
import { D_B_AUDIOTECHNIK } from './devices/db-audiotechnik.js';
import { DELL } from './devices/dell.js';
import { DIGICO } from './devices/digico.js';
import { EATON } from './devices/eaton.js';
import { FOCUSRITE } from './devices/focusrite.js';
import { FURMAN } from './devices/furman.js';
import { GENERIC } from './devices/generic.js';
import { GREEN_GO } from './devices/green-go.js';
import { L_ACOUSTICS } from './devices/l-acoustics.js';
import { LUMINEX } from './devices/luminex.js';
import { MARTIN_AUDIO } from './devices/martin-audio.js';
import { MIDAS } from './devices/midas.js';
import { MIKROTIK } from './devices/mikrotik.js';
import { NETGEAR } from './devices/netgear.js';
import { PENN_ELCOM } from './devices/penn-elcom.js';
import { PRESONUS } from './devices/presonus.js';
import { QSC } from './devices/qsc.js';
import { RF_VENUE } from './devices/rf-venue.js';
import { RIEDEL } from './devices/riedel.js';
import { RIELLO } from './devices/riello.js';
import { SENNHEISER } from './devices/sennheiser.js';
import { SHURE } from './devices/shure.js';
import { SONNET } from './devices/sonnet.js';
import { UBIQUITI } from './devices/ubiquiti.js';
import { YAMAHA } from './devices/yamaha.js';
import './devices/cards.js';

export const SEED_DEVICES = [
  ...ALLEN_HEATH,
  ...ANALOG_WAY,
  ...APC,
  ...ATEN,
  ...BEHRINGER,
  ...CISCO,
  ...CLEAR_COM,
  ...D_B_AUDIOTECHNIK,
  ...DELL,
  ...DIGICO,
  ...EATON,
  ...FOCUSRITE,
  ...FURMAN,
  ...GENERIC,
  ...GREEN_GO,
  ...L_ACOUSTICS,
  ...LUMINEX,
  ...MARTIN_AUDIO,
  ...MIDAS,
  ...MIKROTIK,
  ...NETGEAR,
  ...PENN_ELCOM,
  ...PRESONUS,
  ...QSC,
  ...RF_VENUE,
  ...RIEDEL,
  ...RIELLO,
  ...SENNHEISER,
  ...SHURE,
  ...SONNET,
  ...UBIQUITI,
  ...YAMAHA,
];
