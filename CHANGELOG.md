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

## v1.9.0 — 2026-08-13

**Added**

- **`powerMax`, and peak rows in the summary.** One number cannot answer both
  questions a rack poses. `power` is what a device draws doing its job;
  `powerMax` is the manufacturer's stated maximum, which is what a feed and a
  breaker have to survive. A D80 idles at 180 W and peaks at 7000.

  The summary now shows both, and the peak rows appear only when something in
  the rack actually states one. Three D80s read:

  | | |
  |---|---|
  | Power | 540 W |
  | Current @230V | 2.3 A |
  | **Peak power** | **21000 W** |
  | **Peak @230V** | **91.3 A** |

  Before this release that rack reported `0 W+`.

**Fixed**

- **d&b amplifier mains draw, from d&b's own manuals.** The D80, D20 and DS10
  now carry real figures out of the Technical specifications tables:

  | | Standby | Idle | Max (short term RMS) | Mains |
  |---|---|---|---|---|
  | D80 | 9 W | 180 W | **7000 W** | powerCON-HC, 208–240 V |
  | D20 | 9 W | 48 W | **2200 W** | powerCON, 100–240 V |
  | DS10 | — | — | **10 W** | powerCON, 100–240 V |

- **The D20's 400 W was not a real figure.** It carried a code comment saying so
  — *"power figure is NOT from the datasheet — set it from the manual"* — and it
  is none of the manual's three numbers. Now 48 W idle, 2200 W peak.

**A wrong claim in TODO, corrected**

§7 said mains draw was missing for every amp except the QSC PLX/PLX2/RMX, and
that d&b, L-Acoustics and Martin "all have vector-art PDFs that yield no text".
**The second half is false.** d&b's manuals extract cleanly with
`pdftotext -layout`; what failed before was a fetch tool handing back the raw
PDF, which is not the same thing as the PDF being unreadable. The URL pattern
and the models still owed are now recorded, along with the note that
L-Acoustics and Martin deserve the same retry before anyone assumes otherwise.

DS100 is the one that genuinely publishes nothing — its manual gives fan noise
at idle and no consumption figure at all.

---

## v1.8.1 — 2026-08-12

**Fixed**

- **Naming a socket in the edit dialog lost focus after every keystroke** — one
  character per click, which made the list editor from v1.7.1 close to unusable.
  The socket-count field had it too.

  The cause was not where I first looked. The name field's own handler was the
  obvious suspect, but fixing it changed nothing: the `input` event **bubbles**,
  and the form's own `oninput` — which repaints the whole dialog — was catching
  it and rebuilding the row being typed into. It already excluded two panes;
  it now excludes the socket list as well, and typing routes through an update
  that touches the preview and the one cell rather than re-rendering the list.

**Added**

- **Cables can be named.** An inline field on each row of the Cables matrix.
  The name shows in the wire's tooltip on the canvas, is searchable in the
  matrix, and goes into the CSV.

  The data field had existed since the matrix was written and was already being
  exported — there was simply never a way to put anything in it.

- **The cable CSV leads with the name.** `Label` is now the second column,
  straight after the number, rather than a trailing `Note`:

  ```
  Cable,Label,Type,Source,Source socket,Source location,Target,Target socket,Target location
  "14","LX FOH 1","Analogue audio","DX168","XLRf 1","STAGE · U5","PLD4.5","USBb 1","STAGE · U9"
  ```

  Anyone with a saved sheet built on the old column order will need to re-import
  — the header changed name and position in the same release deliberately, so it
  breaks visibly rather than silently loading into the wrong column.

---

## v1.8.0 — 2026-08-12

**Changed**

- **The device library is a folder now — one module per brand.** `devices.js`
  was a single 4,293-line file; it is now a 60-line index that imports
  `devices/allen-heath.js`, `devices/qsc.js` and 29 others, plus
  `devices/_lib.js` and `devices/cards.js`.

  Adding a device is now *open that brand's file* — a filename rather than a
  search. Adding a brand is a new file plus two lines in the index; the bundler
  and the dev server both discover `devices/*.js` themselves, so neither needs
  telling.

  The real win is merges. The README used to instruct people to add devices
  *inside the brand's existing section* purely to avoid conflicts, which is a
  convention nobody can enforce. Files make it structural: two people adding
  gear to different manufacturers cannot touch the same file.

  **Nothing about the data changed.** Verified by dumping every export before
  and after and comparing record by record, keyed on id: 217 devices and 16
  cards, **0 differ**, categories identical. Only the order of `SEED_DEVICES`
  moved, to alphabetical by brand file, which nothing depends on — the library
  list sorts brands for display anyway.

- **`tools/bundle.py` and `serve.py` discover the library instead of listing
  it.** Both had a hardcoded module list, and both would have gone stale the
  first time somebody added a brand — the bundler by omitting it, the server by
  serving a cached copy of a file you had just edited, which is the exact
  failure it exists to prevent.

  `serve.py` also now resolves each reference against the file being served
  rather than matching filenames, because a brand file reaches its neighbours
  as `./_lib.js` and the geometry as `../panel.js`, and neither looks like the
  path from the root that a name list holds. Absolute `src:` URLs in the
  library are left alone.

**Where things live**

| | |
|---|---|
| `devices.js` | the index — imports every brand, spreads them into `SEED_DEVICES` |
| `devices/_lib.js` | `CATEGORIES`, and `switchFront()` because more than one brand uses it |
| `devices/<brand>.js` | that manufacturer's devices, and any face helper only it uses |
| `devices/cards.js` | `OPTION_CARDS`, and the `registerCards()` call that publishes them |

`CATEGORIES` and `OPTION_CARDS` are imported from their own modules rather than
re-exported through the index: the single-file build shares one scope, so an
alias would collide with the original declaration.

---

## v1.7.1 — 2026-08-12

**Added**

- **The IO of any device can now be edited — a List mode beside the Grid.**
  v1.7.0 shipped editing that could only reach a panel the grid could draw,
  which is 12 faces out of 599. The other 587 — every `auto` face and 208
  hand-placed ones — showed a note explaining they were preserved and gave you
  no way to correct a single socket, which is most of the reason to open the
  dialog at all.

  List edits whatever shape the face actually is:

  | Face | What the list gives you |
  |---|---|
  | `auto` | the declarations — type, count, name, order. Order **is** panel order |
  | hand-placed | type, count and name per element; positions left alone |
  | grid-drawn | every placed cell |

  Type, count, name, reorder, add and remove throughout. A run declared
  `n: 8, gap: 58` stays **one row with a count** rather than exploding into
  eight elements, so editing keeps the source's shape. A name accepts either one
  label for the whole run or a comma-separated list naming each socket, which is
  how `IN 16, IN 15, …` reads back.

**Fixed**

- **The preview went blank on any `auto` face.** It assumed every face had an
  `elements` array; an `auto` one has no such thing, so it threw and left the
  last drawing on screen — which after v1.7.0 meant most library devices. It now
  goes through `renderDevice`, the same path the rack itself draws with, so it
  handles every face shape including half-width and ears.
- **An option-card slot rendered as an XLR in the list.** `slot` is not a
  connector type, so its `<select>` fell to the first option and showed *XLR
  female* while the underlying value was still `slot` — one stray click would
  have turned an I/O Port aperture into an XLR. Rows the editor does not own are
  now locked and labelled for what they are (`SLOT · I/O Port`).
- **`keep` held a live reference into `SEED_DEVICES`.** Editing a preserved
  face's IO would have rewritten the shared library in memory for the rest of
  the session, including for projects that never opened the editor. It is cloned
  on the way in.

---

## v1.7.0 — 2026-08-12

**Added**

- **Any device can be edited, including the ones that ship in the library.** The
  pencil on a library row, or **Edit device** in the inspector when something is
  selected — so you can fix a device from where you noticed it was wrong.

- **A library device is never rewritten in place.** `devices.js` is the shared
  truth and one project has no business editing it, so a correction is stored
  against the device's id and applied on read. That means it reaches everything
  already using that device — a rack item keeps its uid and simply starts
  drawing the corrected panel — while `devices.js` stays untouched. Corrected
  devices get a dot in the library list, and **Revert** puts them back.

  The correction travels with a saved `.json` but does *not* reach the shared
  library. **Copy JSON** into `devices.js` is what makes a fix everybody's, and
  the dialog says so rather than leaving you to find out.

**How a panel survives being edited**

The editor draws on a uniform grid, and most of this library's panels are not on
one — they are hand-placed at real pitch. So a face is read back onto the grid
only when it genuinely fits: **12 of the 220 hand-placed faces do, and the other
208 are kept exactly as they are**, along with every `auto` face. Those show an
amber note saying the panel is preserved and that placing anything replaces it,
with the real drawing still in the preview beneath so you can see what you have.

This is the point: you can correct the SQ-Rack's wattage without the editor
quietly re-gridding a rear that took a morning to get right.

Editing also starts from the **original record** rather than a blank one, so
fields the editor knows nothing about — `src`, `slots`, `bands`, `patch`,
`shelf` — survive. Verified on the SQ-Rack: changing its power kept the
18-element front, the `auto` rear, the `src` and the option-card `slots`.

---

## v1.6.0 — 2026-08-12

**Changed**

- **+ Device is now a drawing tool.** It was a list of "8 of these, 2 of those",
  which could only ever produce an auto-layout — fine for inventory, useless for
  saying *where* anything is, and with no way at all to describe a rear.

  It is now the patch-panel punch grid applied to a whole device. Pick rows and
  columns, click cells to place, drag for a run, shift-click to extend,
  right-click to clear — the same gestures the punch editor already uses. Every
  filled cell becomes a real element at a real coordinate, so what comes out is
  a hand-placed panel, not a generated one.

**Added**

- **Front *and* rear**, on tabs, each with its own grid. The note beside the
  tabs says what is on the face you are not looking at, because a rear you
  forgot about is the easiest mistake this tool can let you make.
- **Select a socket and give it its real name.** An etherCON on an A&H box is
  `AES50`, on a Yamaha it is `Dante` — a drawing that only ever says `EC 1` has
  thrown that away. The name is what the flow view labels the port with, and it
  is why a socket you place reads back as `AES50 A` rather than `EC 1`.
- **Text labels placed in position** — the first entry in the Place list. Panel
  lettering goes in a cell like anything else.
- **Half-rack devices, at any U height**, with or without rack ears. Previously
  + Device could only make full-width units, so a 3U half-rack had to be
  hand-written into `devices.js`.
- **Copy JSON** — the record in exactly the shape `devices.js` uses. Paste it
  into a collaborator's **Find specs** box, or into `devices.js` to put it in
  the library everybody gets. The `id` is stripped on copy so a pasted record
  gets a fresh one rather than colliding with the device it came from. On a
  `file://` page the clipboard is often blocked; the JSON then lands in the Find
  specs box instead, with a toast saying so.

---

## v1.5.0 — 2026-08-12

**Added**

- **Ten Penn Elcom rack PDUs**, from Penn Elcom's own product pages and their
  product photography:

  | Model | In | Out |
  |---|---|---|
  | PDU16-UK / -UK32 | C-FORM 16 A / 32 A | 8 × UK 13 A |
  | PDU16-EU / -EU32 | C-FORM 16 A / 32 A | 8 × Schuko |
  | PDU16-PC / -PC32 | C-FORM 16 A / 32 A | 8 × powerCON |
  | PDU16-UK-TR1 | TRUE1 16 A | 8 × UK 13 A |
  | PDU32-CF | C-FORM 32 A | 8 × powerCON, two banks |
  | PDU32-CTR1 | C-FORM 32 A | 8 × TRUE1, two banks |
  | PDU32-PC | powerCON 32 A | 8 × powerCON, two banks |

  **Worth knowing before you plan a rack: only ONE of the eight outlets is on
  the front.** The other seven are on the back panel. Penn Elcom state that
  outright for the TR1 and the photographs confirm it across the PDU16 range —
  it is not what you would assume from "8 sockets", and it changes which way the
  unit wants to face. The PDU32 two-channel units go further: nothing on the
  front but the inlet, the two bank trips and the monitor, all eight outputs on
  the back.

  Every front is drawn with the real furniture — earth stud, C-FORM or TRUE1
  inlet, Channel A trip, the THRU LINK outlet, the LCD monitor, Channel B trip.
  Ports read `MAINS IN`, `THRU LINK`, `OUT 1`–`OUT 8`, and on the two-channel
  units `A1`–`A4` / `B1`–`B4`.

**Changed**

- **A breaker is a control, not a connector.** It was filed under Power, which
  made it a patchable port and a punchable patch-panel hole — so each new PDU
  arrived with two rows in the flow view that no cable could ever land on. It
  moves to Controls / panel. No existing device had a breaker port, so nothing
  else changes; it is still placeable from **+ Device**.

**Known soft spot**

Depth is the weak figure. Penn Elcom quote "Case Size" with the three numbers in
a different order on almost every page — 140×98×430, 88×140×430, 87×98×430 —
where 430 is plainly the body width (483 over the ears) and 87/88 is the 2U
height, leaving *both* 98 and 140 claiming to be depth. 140 mm is used
throughout and all ten are marked `approx`, because understating a depth is the
direction that puts a device in a rack it does not fit.

---

## v1.4.1 — 2026-08-12

**Fixed**

- **The generic outlet strips had no way to get power in.** All five were a row
  of outlets and nothing else — no inlet to patch a feed to in the flow view,
  and a drawing of a thing that cannot work. Each now carries a **C14 inlet** at
  the left-hand end, named `MAINS IN`.

  Reported against the IEC strip; the other four had the identical fault, so
  they were fixed with it: Schuko 1U, 13A 1U ×6, 13A 1U ×8 and 13A 2U ×12.

  C14 because that is what a rack strip is fed with. The other common build is a
  13 A strip on a captive lead, which has no inlet connector at all — if that is
  what you have, delete the inlet rather than trust the drawing.

  The inlet sits on the same face as the outlets, so the spacing came in to make
  room. The 8-way 13 A strip is the tight one: eight BS1363 faces are 368 mm of
  a 407 mm usable face, and the C14 takes it to 395 mm. Checked for overlap and
  for face overrun on every strip, since hand-placed `elements` do not go through
  the auto-layout fit check.

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
