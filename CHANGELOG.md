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

## v1.1.0 — 2026-08-11

**Added**

- **Versioned builds.** `version.js` is the single source of truth; the bundle is
  named `rackbuilder-v1.1.0.html`, the app shows its version beside the logo, and
  the page title carries it. `rackbuilder-latest.html` is a copy of the newest.
  Handing somebody `rackbuilder.html` twice a week apart gave them two different
  programs with the same name.
- **Reorder sockets on a flow card** — **edit** on the header turns the rows into
  drag handles. Stored per node, not per device, so two copies of a stagebox can
  be arranged differently. Applied as a sort, so a device whose sockets change
  later keeps the new ones.
- **Edge auto-pan while dragging a cable**, ramped rather than stepped.
- **Shift-drag a rack item to copy it.**
- **Side view zoom**, on the same three controls the bays use.
- **Drag tolerance**: a press must travel 5 px before it counts as a drag, and
  port anchors are a 17×15 target rather than a 9 px dot. *(Taken from "make
  tolerences good for dr" — if that meant something else, say so.)*

**Fixed**

- **The side view was upside down** — U1 was at the bottom while every other
  view and ruler in the app puts it at the top.
- **A cable between two sockets on the same card** was drawn from the right edge
  to the left, straight through the card and across every port row, reading as a
  cable to some other device. Self-patches now loop out to the right.
- **Cable numbers could sit on top of a device card**, hiding a port row. Cards
  are now obstacles for chip placement, alongside the other chips.
- **Right-click removal now asks.** Two presses within 4 s, the same shape as the
  destructive buttons. It is far easier to land by accident than the Delete key
  or a drag to the library, and there is still no undo.
- **`setPointerCapture` failure no longer aborts a drag.** It throws when the
  browser has no active pointer with that id, and the exception killed the
  handler before the drag started. It is an optimisation, not a requirement —
  window-level listeners do the real work.

---

## v1.0.0 — 2026-08-11 — rack duplication, right-click, side-view dragging

*Version control began during this session, so all of it sits in the baseline
commit rather than in commits of its own. Splitting it out afterwards would have
meant inventing file states that were never committed. From the next change on,
one commit each.*

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
