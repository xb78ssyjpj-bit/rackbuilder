# Changelog

Version history for Rack Builder. Newest first.

The repository is the real history — `git log` has every change, and
`git diff <a> <b>` compares any two points. This file is the readable summary:
what changed and, where it matters, why.

Conventions:

- One commit per coherent change, with the reasoning in the commit body.
- A dated heading here per working session.
- `dist/` is a build artefact and is not tracked. Rebuild with
  `python3 tools/bundle.py`.

---

## 2026-08-11 — rack duplication, right-click, side-view dragging

**Added**

- **Duplicate rack** in the inspector. Copies contents and all. Every copied
  item gets a fresh `uid`, because a uid identifies one physical device and the
  flow graph keys cables off it — reusing them would have silently patched the
  copy's sockets to the original's cables. Punched patch panels get their slot
  array copied rather than shared. Names step to the next free number
  (`RACK 1` → `RACK 2`), falling back to `RACK 1 copy`.
- **Devices can be dragged in the side view** — up and down the rack, and across
  the midline to flip between the front and rear faces. Placement goes through
  the same `occupied()` check as the bays, so the side view cannot put a device
  anywhere the other views would refuse.
- **Right-click removes a rack item**, in the bays and in the side view.
- **Behringer POWERPLAY HA8000 V2 rear I/O**: two stereo MAIN inputs, eight
  DIRECT inputs, eight rear PHONES outputs, IEC inlet. 21 connectors, 327 mm of
  a 407 mm face.
- **This changelog, and a git repository.** Everything to this point is one
  baseline commit; changes land individually from here.

**Fixed**

- **Right-pressing a rack item left a ghost stranded on screen.** `pointerdown`
  fired for every button, so a right-press started a drag it could never finish:
  the context menu swallowed the pointerup, `onDragEnd` never ran, and the drag
  ghost — a scaled-down copy of the device — stayed put. Drags are now primary
  button only, and any stray ghost is cleared on `contextmenu` as a backstop.

**Known soft spots**

- The HA8000's four main-input jacks are inferred from "2 stereo main inputs"
  plus Behringer's instruction to use "TRS or TS" cables into MAIN INPUTS (L/R);
  a single stereo TRS could not take a TS cable. Everything else on that rear is
  stated.

---

## Earlier — before version control

Reconstructed from the working notes; there are no commits behind these.

- **204 devices**, 3,501 sockets, 158 auto panels, 246 manufacturer-named ports.
- **Four views**: front, rear, side elevation, signal flow.
- **Signal flow**: ports derived from the existing panel declarations rather
  than authored, cables with a connection matrix, bulk patching by picked run,
  rack zones, CSV export, and a cable schedule on the project sheet.
- **QSC**: PLD4.2/4.3/4.5 from numbered panel figures, plus the 17 legacy
  PLX / PLX2 / RMX amps — the only amplifiers in the library with a real mains
  figure.
- **Dante**: Yamaha SWP1-8/16MMF and Luminex GigaCore 14R, and port naming
  (`lbl`) so a Dante port reads `DANTE PRI` rather than `EC 1`.
- **AES3** as a port-level `sig`, since it rides on XLR rather than having a
  connector of its own.
- **TRS / TS** split out from the generic `jack`, from manufacturer
  documentation.
- **Tooling**: `tools/check.mjs` (the real syntax gate — `node --check` parses
  as CommonJS and will pass a module that cannot load), `tools/bundle.py`
  (self-contained single-file build), `tools/netbox-import.py`.
