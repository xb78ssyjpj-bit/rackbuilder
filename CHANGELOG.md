# Changelog

Version history for Rack Builder. Newest first.

The repository is the real history — `git log` has every change, and
`git diff <a> <b>` compares any two points. This file is the readable summary:
what changed and, where it matters, why.

Conventions:

- One commit per coherent change, with the reasoning in the commit body.
- A `## vX.Y.Z` heading per release. `tools/release.py` refuses to run without
  one, and uses it verbatim as the GitHub release notes.
- `dist/` is a build artefact and is not tracked. Rebuild with
  `python3 tools/bundle.py`, or let `tools/release.py` do it.

Versioning: **major** breaks saved projects or rewrites a view, **minor** adds a
capability, **patch** is fixes and data corrections.

---

## v1.4.0 — 2026-08-12

**Added**

- **The dLive MixRacks take option cards** — DM32/48/64 with **three** I/O Ports
  each, CDM32/48/64 with **one**. Both figures are from A&H's own guides and
  they differ, which is worth not assuming from the family name.

- **Eleven dLive / Avantis cards**, each from A&H's fitting note for that card:

  | Card | Sockets |
  |---|---|
  | Dante 64×64 / 128×128 (M-DL-DANT64 / DANT128) | 2 × etherCON |
  | DX Link (M-DL-DXLINK) | 4 × etherCON |
  | gigaACE (M-DL-GACE) | 1 × etherCON |
  | fibreACE (M-DL-GOPT) | opticalCON Duo + etherCON |
  | Waves V3 (M-DL-WAVES3) | 3 × etherCON — a 3-port switch, not 2 |
  | superMADI (M-DL-SMADI) | 4 × BNC + 4 × SFP |
  | AES3 ×4 variants (M-DL-AES10O / 2I8O / 4I6O / 6I4O) | 5 × XLR each |

  The AES numbers are *channels*, and each XLR carries a stereo pair, so 6I4O is
  three in and two out — confirmed against A&H's faceplate drawing, which
  brackets the first three sockets separately from the last two.

  Not included: **M-DL-ADAPT**, which is a slot inside a slot — a 'letter-box'
  that puts an iLive/GLD aperture inside a dLive one. Modelling it as a card
  with no connectors would draw it as a blank plate, which is what it is not.

**Changed**

- **Auto-layout allocates band heights by what a row needs**, where before every
  row got an equal share of the face. A row containing something taller than its
  share — a dLive aperture is 48 mm, more than a rack unit — used to hang off
  the panel edge. Rows now take their required height and split the leftover.

  Panels whose rows all fit an equal share are untouched: **151 of the 151
  slot-free auto panels render byte-identically**, checked by diffing every
  element position against the previous release.

**Known soft spot — the dLive aperture size is derived, not measured**

Every other dimension in this library comes from a drawing or a stated figure.
This one does not, and the `note:` line in `tools/check.mjs` says so on every
run. A&H publish no mechanical drawing of the I/O Port and neither MixRack guide
has a rear-panel *drawing* to scale off — only photographs with callouts.

What is exact is the **aspect ratio**: every card's fitting note draws the
aperture on the same 300 × 85 template, so 3.53:1 is A&H's own figure. The
absolute size is pinned by what the cards demonstrably carry in one row — five
Neutrik D-series on the AES card, measured at 6.6 plate-widths of pitch off that
faceplate drawing — giving **170 × 48 mm**. Every card in the range fits it and
so does every host, but the figure could move. One straight-on photograph of a
dLive MixRack rear would replace it with a measurement.

---

## v1.3.1 — 2026-08-12

**Added**

- **The AHM processors take option cards.** AHM-16, AHM-32 and AHM-64 each have
  one I/O Port, and it is the *same* aperture as the SQ's — A&H's guides say so
  and sell one card range for both — so all five SQ cards are now fittable to
  all four hosts with no new format.

  The 1U AHM-16 and AHM-32 are a useful check on the aperture measured for
  v1.3.0: an 88 × 41 mm plate has to fit inside 44.45 mm of rack height, and
  41 mm does, with about 1.7 mm each side. A wrong figure would have failed the
  panel-bounds check rather than drawn quietly.

- Noted on the Dante cards that A&H's AHM guides require the **V2 revision**
  (M-SQ-DANT32 / M-SQ-DANT64) in an AHM, not the original M-SQ-DANTE, and that
  the 64×64's V1 is SQ-only. The library holds one entry per product rather than
  per board revision, so this is recorded rather than modelled.

**Not done — dLive and Avantis**

The card range is fully documented (see TODO §5) but the **aperture has not been
measured**, and it is definitely not the SQ's: M-DL-DXLINK puts four etherCON in
one row, which is 96 mm of connector before any spacing, and the SQ I/O Port is
88 mm wide. Rather than draw a slot at an invented size, this is left out. One
photograph of a dLive MixRack rear would settle it — the 19" span is the ruler.

---

## v1.3.0 — 2026-08-12

**Added**

- **Option cards.** Gear with a card slot now has one, and what you fit into it
  becomes part of that unit: it draws on the rear panel and its sockets patch in
  the flow view like anything soldered in at the factory. Fitted from the
  inspector, per unit rather than per library entry — two SQ-Racks on the same
  tour are routinely built differently.

  A slot is a **physical aperture of a stated size** and a card is a faceplate
  that has to fit inside it, so the same fit reasoning that catches an
  impossible panel also catches a card carrying one connector too many.
  Compatibility is by aperture format, not by model list, which is how the real
  ranges work — the five cards below fit the SQ-Rack, the SQ-5/6/7, the SQ+
  consoles and the AHM processors alike.

- **The five Allen & Heath SQ / AHM cards**, from A&H's own documentation and
  product photography of each faceplate:

  | Card | Sockets |
  |---|---|
  | SQ SLink | 1 × etherCON |
  | SQ Dante 32×32 | 2 × etherCON |
  | SQ Dante 64×64 | 2 × etherCON |
  | SQ Waves | 2 × etherCON (SoundGrid 1 / 2) |
  | SQ MADI | 5 × BNC (out over in, ×2, plus SYNC) |

  No weight or power figures: A&H publish none per card, and a made-up one would
  end up in a power total somebody signs off on.

  Card sockets are named for the slot they sit in — `I/O SLINK`, not `SLINK`.
  An SQ-Rack with the SLink card fitted has **two** SLink ports, and without the
  prefix they were two rows in the flow view reading the same name and patched
  to different things. `tools/check.mjs` now fails on that, and on a card whose
  connectors do not fit its aperture; both were confirmed by breaking them.

**Fixed**

- **The SQ-Rack's rear panel was wrong**, and had been since it was added. It
  claimed 16 XLR-F, 8 XLR-M, two etherCON, USB-B and an IEC *outlet*. Rebuilt
  from A&H's rear-panel drawing: the talkback input was missing, four outputs
  were missing, the AES3 output was missing, **all seven 1/4" jacks** were
  missing (ST1/ST2 in, A/B out, footswitch), the Network port is an ordinary
  RJ45 rather than a second etherCON, and mains is an inlet. 28 sockets → 41.
- **The SQ-Rack draws 75 W, not 100.** The figure is printed on the panel
  itself: `100-240V~ 50/60Hz 75W`.
- Sockets on that rear are now numbered the way the panel is — **counting down**
  left to right, because the numbering is chosen to read correctly from the
  front. The headphone jack on the front is named `PHONES` rather than `TRS 1`.

---

## v1.2.4 — 2026-08-12

**Fixed**

- **The flow canvas no longer stops at its top-left corner.** Racks and cards
  were clamped to positive coordinates, so nothing could be placed above or to
  the left of wherever the graph happened to start — you could not put a stage
  rack up and to the left of the console it feeds without shoving everything
  else out of the way first. The canvas is unbounded in all four directions now.

  Nothing needed the corner: **Arrange** already places nodes at negative Y, and
  **Fit** works off the graph's actual bounding box, so it still gathers
  everything up however far out it has been scattered.
- **The cable layer follows the graph rather than the origin.** Its viewport
  started at 0,0 and only ever grew right and down, so cables on anything at a
  negative coordinate were drawn outside it — visible only because the layer
  does not clip, and clickable only by luck. It is now sized and positioned to
  the real bounding box, with a matching `viewBox` so the paths stay in world
  coordinates.

---

## v1.2.3 — 2026-08-12

**Fixed**

- **Moving a rack in the flow view was a feature nobody could find.** Dragging a
  rack's name moved the whole rack — but the name was a 46 × 15 px label in the
  corner of the zone, and nothing about it said "handle". So the whole top strip
  of a zone is now a **title bar**: full width, its own tint, a grip, and a grab
  cursor. A title bar is where everyone already tries to drag a thing from.

  The strip also sits above the cables now rather than under them, so a cable
  crossing a zone can no longer swallow the press — and the cards sit above the
  strip, so a bar passing beneath another rack's cards never steals their
  clicks.
- **Dragging a zone selected text across every zone name it passed.** The cards
  had opted out of selection long ago; the zones never had, and it only became
  obvious once the handle was big enough to actually drag by.
- **A rack being dragged now firms up** — solid border, stronger fill — so it
  stays readable as one rack while it is passing over another.

---

## v1.2.2 — 2026-08-11

**Fixed**

- **The split-socket notice used an accent rail down its left edge**, which
  matches nothing else in the app. Warning state here is signalled with the
  whole border — `.toast.bad` does exactly that — so the notice now does too.
  Also removes a one-off `#7a6330` that existed only to support the rail.

---

## v1.2.1 — 2026-08-11

**Fixed**

- **The split notice's "Got it" and "Stop telling me" buttons did nothing.**
  The notice sits inside the flow canvas, so pressing it fell through to the pan
  branch, `setPointerCapture` grabbed the pointer, and the browser retargeted the
  click to the canvas. The button's `onclick` never ran.

  This is the **fourth** time the same bug has been fixed — matrix close button,
  panel resizers, card `edit` button, now this. So the rule is inverted rather
  than patched again: the canvas handler no longer lists what to ignore, it
  skips anything carrying **`data-ui`**, and every overlay declares itself. Mark
  a new overlay and it works; forget and it fails the same known way.

  `tools/check.mjs` now enforces it — it fails if the handler stops honouring
  `data-ui`, or if a known overlay stops declaring it. Verified the check bites
  by breaking it deliberately.

**Note on how this kept getting through**

Every instance failed **only under a real pointer**. A test that calls
`.click()` bypasses pointer capture entirely and passes on broken code, which is
exactly what happened here — the buttons were "verified" with `.click()` and
shipped broken. Overlay controls are now tested with a full
pointerdown / pointerup / click sequence at real coordinates.

---

## v1.2.0 — 2026-08-11

**Fixed**

- **The `edit` button on a flow card did nothing at all.** It sits inside the
  card header, which is the drag handle, so pressing it started a node drag and
  `setPointerCapture` retargeted the click away from the button. The ext node's
  `×` was broken the same way and nobody had noticed. Buttons in a header are
  buttons now, not drag handles — the same failure the matrix close button had.
- **Cables ran straight through cards they had nothing to do with**, which reads
  as a connection to that device. Routing now samples the curve, and any cable
  crossing an unrelated card is bowed over or under it — both directions are
  tried and the clearer one kept.

**Added**

- **Move a whole rack in the flow view** by dragging its zone's name strip.
  Rearranging a graph a card at a time when what you mean is "this rack goes
  over there" was the tedious part of tidying up.
- **Double-patching a socket is explicit rather than silent.** It was always
  allowed — a Y-split or a passive splitter is a real thing — but nothing said
  so. A socket carrying more than one cable now shows a count, and a dismissible
  notice explains it the first time, with a "stop telling me" that sticks.
- **The side panels collapse completely.** Drag one shut past 120 px, or use the
  tab on its inner edge; a tab against the window edge brings it back. On a
  laptop, 530 px of chrome was most of the screen.
- **d&b D90, D12 and D6.** All three from d&b's own hardware manuals, which —
  unlike the D20's — do extract. Every one carries a **real mains figure**,
  because d&b publish a power balance table nobody else in the amplifier section
  does. The D12 is **three** rack units; retail listings routinely say two.

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
