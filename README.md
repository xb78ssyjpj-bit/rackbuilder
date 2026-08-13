# Rack Builder

A local 19" rack diagramming tool for touring / event work. No build step, no
backend, no accounts — plain ES modules served as static files.

## Run

```bash
python3 rackbuilder/serve.py
```

Use `serve.py`, not `python3 -m http.server`. Browsers cache CSS and ES modules
hard enough that `Cache-Control: no-store` alone is **not** reliable — a stale
`styles.css` silently breaks layout, and a stale `panel.js` against a fresh
`app.js` fails with *"does not provide an export named…"*. `serve.py` stamps a
version token (the newest source mtime) onto every asset URL, in the HTML and
inside the JS modules, so editing any file changes every URL and the cache
cannot win.

Then open <http://localhost:4180>. (A `rackbuilder` entry also exists in
`.claude/launch.json`.) It must be *served* — ES modules don't load over `file://`.

## Version history

The project is a git repository. `CHANGELOG.md` is the readable summary — what
changed and why — and the repo is the real history:

```bash
git -C rackbuilder log --oneline
```

To compare two points, including a specific file:

```bash
git -C rackbuilder diff v1.0.0 v1.1.0 -- devices/
```

One commit per coherent change, with the reasoning in the commit body. Every
release is tagged. `dist/` is a build artefact and is not tracked — rebuild it
rather than committing it.

## Working on this with somebody else

### Getting the newest build

Go to the repository's **Releases** page and download
`rackbuilder-vX.Y.Z.html`. One file, double-click it, done — no server, no
install. The release notes are that version's changelog entry, so what changed
sits next to the thing that changed.

Storage is per-file-location, so a new version opens with no projects in it.
**File → Save .json** before switching, and load it into the new one.

### Cutting a release

```bash
python3 tools/release.py minor      # or patch, or major
```

Bumps `version.js`, rebuilds, commits, tags, pushes, and creates the GitHub
release with the standalone build attached. It refuses to run on a dirty tree,
refuses if the checks fail, and refuses if `CHANGELOG.md` has no heading for the
new version — the entry is written by hand on purpose. Generating one from
commit subjects produces something nobody reads; the point of a changelog is the
*why*.

`--dry-run` shows what would happen without touching anything.

### Adding a device

1. Open **`devices/<brand>.js`** and add the entry. That is the whole of it —
   one file per manufacturer, so the file to edit is a filename rather than a
   search. A new brand means a new file plus one import and one spread in
   `devices.js`; nothing else needs telling, because the bundler and the dev
   server both discover `devices/*.js` on their own.
2. `node tools/check.mjs` — catches duplicate ids, undeclared categories,
   connectors that fall off the panel, and two sockets sharing a label.
3. Commit with the source you used in the message. The library's value is that
   every figure is traceable; a device with no `src` is a device somebody has to
   re-research later.

Follow the existing policy: **work from the manufacturer's own documentation, and
where it does not say, leave it out and note it in `TODO.md` rather than guess.**
Half the entries here carry a comment explaining what was and was not verified.

### Two people editing the library

The library is a folder — `devices/`, one module per brand — so two people
adding gear to different manufacturers never touch the same file. That used to
be a convention ("add inside the brand's section, not at the end") that nobody
could enforce; it is now structural.

What can still conflict:

- **Two people adding the same brand.** Unavoidable and fine — the edits are
  usually far apart in a short file, which git merges without complaint.
- **Adding a brand at the same time.** `devices.js` gains one import and one
  spread, so simultaneous new brands touch the same two blocks. It is a
  two-line conflict and obvious to resolve.
- **Reformatting.** A tidy-up that touches lines you did not mean to change
  turns a clean merge into a manual one. Leave formatting alone.

Before pushing:

```bash
git pull --rebase && node tools/check.mjs
```

The rebase replays your commits on top of theirs, so the history stays a
straight line rather than filling with merge commits. Re-running the checks
afterwards is the important half: **a merge that resolves cleanly can still be
wrong** — two people adding the same device under different ids, or the same id
under different names, is a textual success and a semantic conflict. That is
exactly what `check.mjs` catches.

## Handing it to somebody else

```bash
python3 rackbuilder/tools/bundle.py
```

Inlines the CSS and concatenates every module — including each brand file under
`devices/`, which it discovers rather than being told about — into one
self-contained file.
**Output is named for the version**, from `version.js`:

- `dist/rackbuilder-v1.1.0.html` — a complete document. **Double-click it.** No
  server, no Python, no install. Works from a USB stick, an email attachment or
  any static host.
- `dist/rackbuilder-v1.1.0.body.html` — body content only, for hosts that supply
  their own `<!doctype>` and `<head>`.
- `dist/rackbuilder-latest.html` — a copy of the newest complete document, for
  anyone who just wants the current one.

The number is in the filename on purpose: handing somebody `rackbuilder.html`
twice, a week apart, gives them two different programs with the same name and no
way to tell which is which. The running app shows its version beside the logo,
and it is in the page title, so a screenshot can be tied back to a build too.

Why this works when `index.html` does not: `file://` blocks module *imports*, but
an inline `<script type="module">` fetches nothing, so it runs fine. Every export
in the source is `export const` or `export function`, so bundling is just
dropping the import blocks and the `export` keyword and letting the files share
one module scope. Duplicate top-level names would be a syntax error, so:

```bash
node tools/check.mjs
```

Note `node --check` **cannot** verify a module — it parses as CommonJS and will
pass a file that fails to import. Use `--input-type=module`; `tools/bundle.py`
prints the exact command.

The bundle is a build artefact. **Edit the source modules and re-run the script**
— never edit `dist/`. Storage is per-origin, so a copy opened from `file://` has
its own saved projects, separate from the served one. Nothing is fetched at
runtime; the manufacturer `src:` URLs in the library are data, never requested.

## Use

| Action | How |
| --- | --- |
| Find a device | Type in the search box — it matches brand, model **and** category, and cuts straight through collapsed groups |
| Browse the library | Brands are collapsed with a count; click one to open it. What's open is remembered |
| Add a device | Drag from the library, or double-click to drop in the first free slot |
| Move a device | Drag it. Green = will fit, red = blocked |
| Rename / colour | Click it, use the inspector |
| Delete | Select and press <kbd>Delete</kbd>, or use Remove |
| Multiple racks | Add rack, then use the tabs |
| Copy a rack | **Duplicate** — contents and all, dropped in beside the original |
| Copy one device | **Shift-drag** it to a free slot |
| Remove a device | Right-click it **twice** within 4 s, in the bays or the side view. Or select and press <kbd>Delete</kbd>, or drag it back to the library |
| Empty a rack | Click **Clear front & rear**, then click again to confirm (4 s) |
| Delete a rack | Click **Delete rack**, then click again to confirm (4 s) |
| Export | File → SVG / PNG / Print (Print gives you PDF) — one sheet covering the whole project |
| Patch it up | **Flow** in the view switcher — see below |
| See depth | **Side** in the view switcher — see below |
| Resize the panels | Drag either sidebar's inner edge. Arrow keys work too (shift = bigger steps); widths are remembered |

Projects autosave to `localStorage`. **File → Save .json** for a real backup —
clearing site data wipes the autosave.

### No native dialogs

Some embedded browsers suppress `window.alert` / `window.confirm` — `confirm()`
returns `false` in about 2 ms and nothing is ever shown. That silently disabled
every destructive action in the app. Nothing depends on them now:

- Destructive buttons (**Clear front & rear**, **Delete rack**, **File → New
  project**) are two-step: click once to arm, again within 4 s to commit. They
  revert on their own.
- **Delete rack** is disabled outright when only one rack exists.
- **Clear front & rear** empties the selected rack of gear but keeps the rack —
  its name, height, weight and depth all survive. It clears **both faces**: a
  front-only clear would silently leave rear-mounted kit behind and read as a
  bug. It only touches the rack you are on, and disables itself once empty.
- Messages use an in-app toast.
- Reducing a rack's height no longer offers to bin the gear that no longer fits;
  it refuses, reverts the field, and tells you how many devices are in the way.

## The device library

### Browsing it

At ~180 devices a flat list stopped working, so brands **collapse**. Closed, the
sidebar is a scannable list of ~28 brands with counts; open one and its models
appear. Which groups are open is remembered across sessions, in its own
`localStorage` key rather than the project file — it is a view preference, not
part of the drawing, and should not travel inside a saved `.json`.

**Search is the fast path** and deliberately ignores the collapse: type anything
and every match is shown expanded, whichever group it lives in. It matches the
category name too, so `charging` finds the chargers wherever they sit.

The category tag on each row only appears while the category filter is off —
once you have filtered to Power, every row saying "Power" is just noise.

### What is in it

Deliberately small and uniformly accurate rather than broad. Every entry is
either hand-drawn from the manufacturer's orthographic front view, or is
brand-agnostic rack hardware drawn to standard 19" geometry.

- **Named products** — d&b D20, Behringer X32 RACK, S16 and POWERPLAY HA8000 V2,
  PreSonus Quantum 2626.
- **Allen & Heath** — see below.
- **Half rack** — Focusrite Scarlett 18i8, generic Router.
- **Wireless / RF** — see below.

## Wireless / RF

**Sennheiser.** evolution wireless G3 (EM 100, EM 300, SR 300 IEM), G4 (EM 100,
EM 300-500, SR IEM), EW-D (EW-D EM, EW-D ASA), EW-DX (EW-DX EM 2, EM 2 Dante,
EM 4 Dante), plus the ASA 214 splitter, the GA 3 rack tray and the AM 2 front
antenna mount. Everything except the EW-DX EM 4 Dante is a 212 mm half-rack box.

**Shure.** Axient Digital (AD4D, AD4Q, AD600), ULX-D (ULXD4, ULXD4D, ULXD4Q),
QLX-D (QLXD4), SLX-D (SLXD4), IEM transmitters (P10T, P9T, P3T), and antenna
hardware (UA844+SWB, UA845UWB, PA421B, AXT630).

**RF Venue.** DISTRO4, DISTRO9 HDR, DISTRO5 HDR, COMBINE4, COMBINE6 HDR,
COMBINE8, 4 ZONE and 4 ZONE-Network.

**Spectera.** The Base Station is the only rack part of the range — RF
distribution is done by the DAD antenna itself over Cat5e/PoE, so there is no
Spectera rack splitter to add.

## Stageboxes

**Yamaha** Rio3224-D3, Rio1608-D3, Tio1608-D2 · **DiGiCo** SD-Rack, SD-MiNi,
SD-NANO, D-Rack, D2-Rack, DQ-Rack, MQ-Rack, Orange Box · **Midas** DL16, DL32,
DL152, DL153, DL251.

### Which face the connectors are on varies, and it is recorded per device

This is the thing that decides what a stagebox elevation actually looks like, so
it was researched rather than assumed:

| | |
| --- | --- |
| Yamaha Rio / Tio | inputs **and** outputs on the front; Dante and mains rear |
| DiGiCo | **everything** on the front, including both mains inlets — the rear is a plain vented panel with no connectors at all |
| Midas DL16 / DL32 | XLR I/O on the front, AES50 and mains rear |
| Midas DL152 / DL153 / DL251 | the opposite — **all** I/O on the rear, front is just an LCD and status LEDs |

That last row is why a DL153 draws almost bare next to a DL16. It is not a
missing panel; that is what the unit looks like.

The Rio input layout — rows of 8, each channel with +48V / SIG / PEAK above its
XLR — was read off Yamaha's own front-view photograph. The DQ-Rack is the
best-sourced of the set: DiGiCo's datasheet carries genuine straight-on front
and rear photographs.

**Yamaha's D2 generation is discontinued.** Rio1608-D2 and Rio3224-D2 are
superseded by the D3, which is what is in the library.

## Amplifiers

**d&b audiotechnik** — D80, D40, D20, 40D, 30D, 10D, 5D, plus the DS10 bridge and
DS100 engine. **L-Acoustics** — LA12X, LA4X, LA7.16, LA7.16i, LA2Xi, the P1
processor and the LS10 switch. **Martin Audio** — iKON iK41/iK42/iK81, VIA2004/
2502/5002/5004, and the DX0.4/DX0.6/DX4.0 processors.

### No amplifier carries a mains power figure — and that is deliberate

Not one of these three manufacturers publishes mains draw. They publish **output**
power, which is a completely different number: a D80 is 4 × 4000 W out and an
iK81 is 8 × 1250 W out, but nothing remotely like that comes off the wall. Their
datasheet PDFs are vector art with no extractable text.

Putting output watts in the `power` field would have made the summary's amps-at-
230 V figure — the one number you would actually take off an amp rack drawing —
badly wrong in the dangerous direction. So amplifiers carry **no** power figure
and count toward the summary's `+` tally instead. **An amp rack will therefore
under-report its load to near zero.** The only amp-adjacent devices with real
figures are Martin's DX processors (30 W nominal, published) and the LS10 (20 W).

Get the real numbers off the units or the manuals before sizing a feed.

### Mains connectors

Worth knowing before you spec a distro, and drawn on each rear panel: d&b D80 is
powerCON-HC, D40/40D are TRUE1 TOP, 30D/10D/DS10 are powerCON, the 5D and DS100
are IEC. Martin's iKON and VIA amps are all powerCON 32 A. L-Acoustics'
connectors were not confirmed.

### Channels are not connectors

Two entries needed correcting on this: the d&b DS10's "16-channel AES3 out" is
**8 XLRs** (AES3 carries two channels per connector) — sixteen would be 384 mm of
connector and could not fit a 1U face at all, which is how the error surfaced.
Same for the Martin iK81 and the LA7.16: 8 and 16 output channels over 4 and 8
speakON NL4, two channels per connector.

## Allen & Heath

SQ, Avantis, dLive and AHM only — nothing older.

**AudioRacks and expanders** — SQ-Rack, AR84 (1U), AR2412 (3U), AB168, DX168,
DT168 and DX32 (all 4U), GX4816 (5U). The family shares one grammar: mic inputs
in rows of **8** on the left, line outputs in rows of **4** on the right, split by
a divider, model lettering along the top. That was read off Allen & Heath's own
product photography for the AR2412 and matches the DX168, which was drawn from
their orthographic front view. The AR84's single row isn't a guess either — a 1U
face is 44.45 mm and an XLR is 31 mm tall, so one row is all that fits.

**dLive MixRacks** — DM32/48/64 (S Class, 7/8/10U) and CDM32/48/64 (C Class,
5/7/8U). These have **no front-panel controls** — mixing happens at the Surface
or Director — so the front is left as a labelled block, but the **rear is drawn**
with its full XLR count, which is what you plan cabling from. A DM64 rear is 64
inputs and 32 outputs across 10U.

**AHM** — AHM-16, AHM-32 (1U) and AHM-64 (2U). All audio I/O is on the **rear**
on Euroblock; the front carries only the display, navigation cluster and four
SoftKeys.

Avantis is console-only — there is no rack-mount Avantis unit, and DM0 does not
exist. Neither was invented to fill the gap.

## Network

Switches come from the **NetBox devicetype-library**
(github.com/netbox-community/devicetype-library), which is **CC0-1.0** — public
domain — and carries ~5,600 device definitions. `tools/netbox-import.py`
converts their YAML into library entries:

```bash
python3 tools/netbox-import.py ~/devicetype-library Netgear/M4350-24G4XF.yaml
```

It prints entries to paste into `devices.js`, so any of the 5,600 can be pulled
in on demand rather than all at once — the library stays small and legible.

Currently in: Netgear M4250/M4300/M4350 (the AV Line switches), Cisco Catalyst
9200-24P/48P, Ubiquiti EdgeSwitch 16/24/48, MikroTik CRS309/CRS317/CRS326.

### Dante / AV switches

Hand-built rather than imported, because these are the switches Dante actually
runs on and NetBox does not carry them:

| Device | Ports |
| --- | --- |
| Yamaha SWP1-8MMF | 4 etherCON front + 4 rear, front opticalCON |
| Yamaha SWP1-16MMF | 4 etherCON front + 8 rear, 4 RJ45 rear, front opticalCON |
| Luminex GigaCore 14R | 10 etherCON front, 2 etherCON + 2 SFP rear, RJ45 console |

**Both manufacturers' manuals contradict their own retail listings on where the
ports are.** The GigaCore is sold as "12-port etherCON + 2 SFP", which is right
on the total and wrong on the placement: ten of the twelve are on the front,
because it is a touring switch. The counts here come from the manuals.

Not modelled, deliberately: the SWP1's option-module slot and the GigaCore's two
Molex Micro-Fit 6-pin backup power inlets. A slot is not a socket, and there is
no Micro-Fit primitive — inventing one would be worse than the omission.

Dante I/O itself was already well covered: Yamaha Rio3224-D3, Rio1608-D3 and
Tio1608-D2, Allen & Heath DT168, and the DiGiCo racks. The three Yamahas now
name their etherCON pair `DANTE PRI` / `DANTE SEC`, as the panels do.

**The library's elevation photographs are deliberately not used.** They are
raster images; this app draws line art at true connector size. A photo dropped
into a rack elevation would clash with every other panel and wouldn't scale,
print or export with the drawing. So the specs are imported and the panel is
re-drawn by `switchFront()`.

What the import knows and doesn't:

| | |
| --- | --- |
| Port counts and types | exact, from the YAML |
| Weight, max power draw | exact where recorded |
| Depth | **not in the schema** — NetBox records only a full-depth boolean, so it comes out as a 250/450 mm bracket, flagged `approx` |
| Which face the ports are on | not in the schema — front is assumed, right for access switches |

Management ports are pulled out of the numbered block (the schema flags them
`mgmt_only`) and drawn on their own, so a 24-port switch draws 24 ports and a
separate MGMT socket rather than a lopsided 25.

Port pitch is real: 15 mm for a stacked RJ45, 20 mm for an SFP cage, 22 mm for
QSFP. That is why a 48-port switch only just fits a 19" face — its SFP cages
butt against the copper block and there is no room left for lettering, exactly
as on the real thing.

**Luminex GigaCore is not in the NetBox library** — no entertainment-networking
vendors are. Those need adding by hand.

## Computing

Sonnet RackMac mini, ATEN CL1308 KVM console drawer and CS1308 KVM switch, Dell
PowerEdge R650. Physical specs from the NetBox library; panel layouts are drawn
from what these classes of device look like, since the YAML says nothing about
faces.

## Power

**UPS** — APC Smart-UPS SMT3000RMI2U, Riello SDH 2200 (the UK-common one), Eaton
5PX3000iRT2U. All 2U. **PDU** — APC AP7821. **Conditioners** — Furman PL-8C and
PL-PRO DMC. Plus the generic 13 A / IEC / Schuko strips.

Two layout facts worth knowing, because they draw differently:

- A **rack UPS puts its outlets on the rear** — the front is only a display and
  buttons. Outlet counts and inlet types are exact from the NetBox YAML (the
  Riello is C20 in, 8 × C13 + 1 × C19 out).
- A **1U horizontal PDU carries its outlets on the same face as the display**.

Furman's rear outlets are drawn as Schuko, which is what a UK/EU rack has; the US
models ship NEMA, for which this library has no primitive. The outlet *count* is
right either way, and that is the part you plan from.

**Still no real touring distro.** The NetBox library is IT-oriented, so it has
rack PDUs but nothing from Indu-Electric, SES or similar, and no 32/63 A CEE
distro. Every connector needed is already in the library — CEE 16/32/63/125,
Powerlock, powerCON — so these are quick to draw once you say which ones you
actually see in UK stock.

## Comms

**Clear-Com.** Eclipse HX-Median, HX-Omega (both 6U) and HX-Delta (3U) matrix
frames, HelixNet HMS-4X, FreeSpeak Edge Base, LQ-R2W4-4W4 and Arcadia. The HX
frames are **rear-connector**: their fronts are card edges and PSU modules, and
the slot counts come from Clear-Com's own straight-on datasheet views.

**Riedel.** Artist-1024 (2U), Artist 32 (2U), Artist 64 (3U) and Artist 128 (6U)
mainframes, the RSP-1216HL SmartPanel, and the NSA-002A stagebox with its
RMK-001 carrier. The Artist frames are card-based, so what is drawn is the slot
count and the PSU arrangement — the thing you actually need off a rack drawing —
rather than whichever cards happen to be fitted.

**Green-GO.** MCX, MCXEXT, BridgeX, INTERFACEX, Q4WR, the BC6 charger and the
SISHELVE tray. These are **deliberately drawn as plain labelled blocks** — see
"Devices with no panel drawing" below.

## Charging

Rack-mountable chargers only: Sennheiser **L 6000** (four front bays, each module
holding two packs, so eight in 1U), Shure **SBRC**, the Riedel **Bolero charger
drawer** (4U, two 5-bay chargers = ten bays) and Green-GO **BC6**.

Most manufacturers' chargers are *not* rack-mountable and are deliberately
absent: Shure's SBC220/240, SBC450/850 and SBC840/840M are desktop or wall units
whose only documented mounting is screws into a hard surface, and Sennheiser's
EW-D CHG 2 and L 2015 are tabletop. Riedel's 5-bay Bolero charger is a tabletop
unit too — the rack-mountable item is the drawer that carries two of them.

## Devices with no panel drawing

A device needs only `{ id, brand, model, category, ru }` to be useful: the app
renders it as a labelled block at the correct U height, which still gives you
rack space, weight and depth. That is the honest fallback when a front elevation
cannot be verified, and it is what the Green-GO entries use — their manual site
blocks automated access and no orthographic front view could be obtained, so the
alternative was inventing panel detail. Supply a front photo or a panel
description for any of them and they can be drawn properly.

### Frequency bands are per unit, not per library entry

RF gear ships as one product in a dozen band SKUs. Rather than a library entry
per band, a device carries a `bands` list and each **unit in the rack** picks one
from the inspector's **Band** dropdown. Two of the same receiver in one rack can
therefore be on different bands, which is the normal case. The choice is saved in
the project file.

The rack drawing shows the band **name** beside the device (`GBW`, `S1-10`,
`K57`) because the full range does not fit the label column; the tooltip and the
export sheet both carry the whole thing (`GBW: 606 - 678 MHz`).

Wideband units that genuinely have no band SKUs — the AD600, the RF Venue
distros — have no dropdown at all rather than a fake one.

### Front BNC

Nearly every antenna distro in this library lands its BNCs on the **rear**, which
is worth knowing before you plan a loom. Sennheiser is explicit that the ASA
splitters are rear-connector units. The exceptions, and the ways to get antennas
onto the front of a rack, are:

| | |
| --- | --- |
| Shure UA844+SWB | a front antenna BNC each side, on the unit itself |
| Shure UA845UWB | front antenna mounts in the ear region |
| Sennheiser AM 2 | 2 BNC bulkheads filling the spare half of a GA 3 tray |
| Generic antenna front panel 1U | 2 or 4 BNC feed-throughs, brand-agnostic |

### Half-rack gear with its own rack ears

Most half-rack RF gear ships with rack ears and bolts straight to the rails — no
tray involved. Those entries carry `ears: true`, and it changes three things:

- **No shelf warning.** They are not drawn red and the inspector shows
  *Mounting: Rack ears fitted* instead of the Shelf toggle.
- **They are drawn with the ear**, complete with mounting holes, so an eared unit
  spans **rail to centre line** — exactly half the full 483 mm panel rather than
  half the 423 mm interior. Two of them fill a U edge to edge.
- **The ear follows the view.** Sides are recorded as seen from the front, and the
  rear view mirrors positions, so from the back a left-hand unit is on your right
  and its ear moves with it. The ear is always at the rail, never in the middle.

A half-rack unit *without* ears (Focusrite 18i8, the generic Router, and the
Sennheiser AM 2, which fits a GA 3 cutout) still sits inside the rails at the
narrower width and still wants a shelf. The two widths sitting side by side is
the visual difference between bolted-in and sitting-on-a-tray.

### Half-rack width

Sennheiser's half-rack chassis is 212 mm, which matches the app's `HALF_W`
(211 mm) almost exactly. Shure's is 197 mm, so Shure half-rack units are drawn
about 14 mm wider than life. Two still sit side by side in a U correctly; it is a
drawing simplification, not a fit error.

### Power figures

Most Shure RF units and several RF Venue ones publish no wattage — only a supply
current or VA rating, which is not the same thing. Those entries carry **no**
power figure rather than a guess, so the rack's watts and amps are a **floor, not
a total**. The summary marks this with a `+` and says how many devices are
unaccounted for, on screen and on the export sheet. Do not use it for power
sign-off without checking the units yourself.

## Half-rack devices

A device flagged `half: true` occupies one **side** of a U rather than the whole
row, so two of them sit side by side in a single U. Drop into the left or right
half of the bay and the preview narrows to that side; the inspector gains a
Left / Right toggle. Occupancy knows the difference — a full-width device blocks
the whole row, two half-width ones only clash if they're on the same side, and
the summary counts a shared row as 1U rather than 2U.

Half-rack units aren't rack-mounted, so they're drawn as a plain body with no
ears or mounting holes, and they want a shelf. A shelf counts if it is either
**sharing their U** (they sit on it) or **directly beneath**. A shelf and
half-width gear deliberately share a U — the shelf renders behind the gear —
while full-width devices and two shelves still clash normally.

A unit with no shelf either way is drawn in red. If that's wrong — it has rack
ears, or it's stacked on another unit — the inspector has a **Shelf:
Required / Not required** button to switch the check off for that item.

**Width.** A half-rack box is half the rack *interior*, not half the 19" figure —
482.6 mm includes the mounting ears. So `HALF_W` is half of the span between the
ears (876 / 2 = 438 units = 211 mm, against a real half-rack width of ~215.9 mm),
and the two boxes sit at 62..500 and 500..938. Halving the full panel width
instead makes them overrun the ears of the shelf they sit on. Their coordinates
run 0..438 at the same 2.07 units/mm as a full panel, so connector sizing is
identical.

**Shelves carrying gear** render as *ears only* — the shelf body behind the gear
is dropped so it doesn't show through, but the mounting ears still read at the
sides. An empty shelf draws in full. Same in the SVG export.
- **Accessories** — blanks 1–4U, vented and perforated blanks, brush panel,
  fan tray, drawers, shelf, lacing bar, fixed XLR/etherCON/BNC/jack patch
  panels, and blank patch panels you punch yourself.
- **Power** — UK 13 A (6 and 8 way, plus 2U 12-way), IEC C13, Schuko.

Rack weight is an optional field beside name and height. Leave it blank and the
summary shows kit weight only; set it and you get kit / case / total.

## The export sheet

**File → Export** produces a single document for the whole project, not a
snapshot of what's on screen:

- Header — project name, rack and device counts, date.
- Every rack, **front and rear elevations side by side**, with U rulers, side
  markings, group colours, `behind:` notes and *rear not documented* hatching.
- A summary strip per rack — device count, U used, kit / case / total weight,
  watts, amps at 230 V, max depth against the rack depth, plus any depth clash.
- A project total across all racks.

The file is named after the project. SVG, PNG and Print all use the same sheet —
**Print renders the sheet into a hidden `#printArea` and hides the app**, because
`window.print()` on the live DOM printed the dark UI with one rack in it, which
was useless. The page is set landscape; the sheet is wide.

## Front and rear mounting

Set an optional **Depth mm** on the rack and devices can be bolted to either
face. The inspector's **Mounted: Front / Rear** toggle moves a selected device;
dropping from the library mounts to whichever face you're currently viewing.

A front and a rear device share a U freely — they only compete for depth. A pair
whose combined depth exceeds the rack is refused on drop, and any existing pair
that stops fitting (say you reduce the rack depth) is listed under the summary.
Leave Depth blank and the check is skipped rather than guessed at.

Each view shows what is physically visible from that side: devices on that face
front-on, plus the **back** of anything on the far face. Panels are drawn with an
opaque face and the far side is drawn first, so a device genuinely occludes what
sits behind it — a 2U unit covering the top half of a 4U one hides exactly that
half, and the rest still shows. Occlusion is checked per U row, not per device.
The export follows the same rule.

Anything you *can't* see is still on the drawing — the side column adds a
`behind:` line naming whatever is mounted on the far side of that U, from both
views. Half-width rows use a compact `↳` form since they have half the height.

## Rear view

The bay mirrors positions — a unit on the front-left is on your right when you
walk round the back — while each device counter-mirrors itself so its own panel
and lettering read correctly. The SVG export does the same.

**Every rear face uses the same hatched backing**, so a rear elevation reads as
one thing. Where the rear IO is known it's drawn over the hatch; where it isn't,
the hatch carries the device name and *rear not documented*. Patch panels are
punched through, so they show the same holes from both sides.

Rear IO never blocks anything — a device may well be wired internally to a patch
panel — so gear mounts behind it freely as long as the depth allows.

Because a rear elevation tells you very little on its own, the side column
gains a second line naming what each position actually is, with *no rear* called
out in amber.

## Side elevation

The only view drawn in **true millimetres on both axes** — 44.45 mm per U
vertically, real depth horizontally. Front-mounted gear is anchored to the front
rail, rear-mounted gear to the rear rail, so the gap down the middle is the room
you actually have left.

It exists because the depth model was already there — `rack.depth`, per-item
depth, the front/rear clash check — but only ever surfaced as a line of text in
the summary. Now a pair that does not fit is drawn in red, both boxes, and you
can see *why*: a 406 mm amp facing a 204 mm switch in a 600 mm case.

With no rack depth recorded it shows enough to hold the deepest device and says
`(assumed — no rack depth set)` under the drawing, rather than inventing a case
size. Labels are trimmed to what their box can hold, with the full name on hover.

U1 is at the top, matching the bays and their rulers. Zoom with the same
controls the bays use — the drawing scales through its own viewBox, and the
frame scrolls when it outgrows the window.

**Devices drag here too** — up and down the rack, and across the midline to flip
between the front and rear faces. Crossing the midline *is* the gesture, because
the midline is what the two faces are either side of. Placement goes through the
same `occupied()` check as the bays, so the side view cannot put a device
anywhere the other views would refuse; an illegal move is simply ignored rather
than snapping back.

## Signal flow

The third view. Every device that carries signal becomes a card, every socket on
it becomes an addressable port, and a cable is a link between two ports. The
cable list is a read-out of the graph rather than a second place to keep the same
facts.

| Action | How |
| --- | --- |
| Patch | Drag from a socket's anchor to another socket's anchor |
| Patch a whole run | Click a socket, shift-click another on the same node, then drag once. The run maps socket-for-socket onto consecutive sockets from wherever you drop |
| Undo a patch | Click the cable (or its number) and press <kbd>Delete</kbd>, or use × in the matrix |
| Rename a socket | Double-click its label. <kbd>Esc</kbd> cancels, blank restores the default |
| Show a big device's sockets | **Show N sockets** on the card; **Hide unused** folds it back to what's patched |
| Move a card | Drag its header |
| Add off-rack gear | **+ External** — a name and the sockets you need |
| Tidy up | **Arrange** lays the graph out one column per rack |

Each rack gets its own dashed, tinted region with its name on it, and the region
follows its members wherever you drag them. External nodes get a dotted region
of their own. Regions are backdrop only — they never take a click, so panning
still works over them.
| The cable list | **Cables** opens the connection matrix — filter by signal family, search, export CSV |

Cable numbers are handed out once and never reused or re-indexed. Pull cable 1
and cable 5 stays cable 5 — the numbers are on the labels already, and a list
that renumbers itself when someone unplugs something is a list you cannot trust.

### Ports are derived, not authored

Nothing was added to `devices.js` for this. Sockets come from the same
`elements` / `auto` panel declarations that drive the drawings, so the **160
devices that carry connectors arrive with their ports already mapped — 3,257
sockets in all**. Devices with no I/O (blanks, vents, drawers, shelves, brush
strips, charger trays) never appear on the canvas.

The cost is that socket *identity* on an `auto` panel is **ordinal, not
physical**. "R XLRf 12" means the twelfth rear XLR female declared, which is the
twelfth one drawn — but the library never claimed that is the socket
silkscreened 12 on the real unit. This is the same caveat as the auto rears
themselves. Rename any port where it matters; the override is stored per device
instance, so two copies of the same device can be labelled differently.

Numbering runs **per panel**, not per device: with two combos on the front and
six on the back, the first one on the back is `R CMB 1`, not `CMB 3`. The `F` /
`R` prefix only appears when a device has sockets on both faces.

### Naming sockets in the library

A connector declaration can name its own sockets with `lbl`, and that name is
used verbatim — no plane prefix, no ordinal:

```js
{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] },  // one name each
{ t: 'xlrf', n: 16, lbl: 'IN' },                           // prefix, numbered
{ t: 'rj45', n: 1, lbl: 'ULTRANET' },                      // single, bare
```

This is what makes a Dante or AES50 patch list worth printing. `R EC 1` and
`R EC 2` tell you nothing; `DANTE PRI` and `DANTE SEC` tell you everything. 58
sockets across the library carry a manufacturer name.

**Only name what the manufacturer names.** Neither the Yamaha SWP1 manual nor
the Luminex GigaCore manual says how their switch ports are numbered across the
front and rear panels, so those are left to the `F EC 1` default rather than
invented. Guessing here is worse than the generic label, because a named port
reads as fact.

### Signals the connector cannot imply

Some things ride on a connector that says nothing about them. **AES3 travels on
an XLR** — or a BNC, as AES3id — so it cannot live in the connector-to-family
map. Declare it on the port instead:

```js
{ t: 'xlrf', n: 2, sig: 'aes3', lbl: 'AES3 IN' },
```

`sig` overrides the family, so those XLRs colour as AES3 rather than analogue
audio and a cable from one is an AES3 cable in the schedule. The d&b DS10 uses
it. Note this carries the *signal*, not the channel count — AES3 is two channels
per XLR, and nothing in the library counts channels yet.

Two sockets on one device must never share a label — the ids stay unique so
patching still works, but an ambiguous patch list is a useless patch list. The
whole library is checked for this.

A **punched patch panel is the exception** — you placed each connector in a
specific hole, so its ports follow the grid and mean exactly what they say.

### Patching a run

Dragging 32 cables one at a time is the job nobody wants, so a run can be picked
first: click a socket, shift-click another on the same card, drag once. The run
maps in the direction you picked it, onto consecutive sockets from the drop
point.

It **runs off the end rather than wrapping** — sixteen into eight is eight
cables and a message saying it ran out, not eight silent surprises. Sockets
already patched are skipped and counted, and crossings between signal families
are counted too, so one toast tells you what actually happened. <kbd>Esc</kbd> or
a click on empty canvas drops the run.

Shift extends over the sockets **as shown**, not as declared — what you see
between the two you clicked is what you get, which matters on a collapsed card.

### Patching a device to itself

A jumper between two sockets on the same card **loops out to the right** rather
than being drawn from the right edge to the left. Straight across would cross
every port row on the way and read as a cable to some other device; the loop is
what it physically is — a short jumper on one box.

### Rearranging sockets

**edit** on a card header turns its rows into drag handles; drag them into the
order the panel actually runs, then **done**. Every socket is shown while
editing, because you cannot drag a row somewhere that is not on screen.

The order is stored per *node*, not per device, so two copies of the same
stagebox can be arranged differently — they are wired differently. It is applied
as a sort rather than a replacement, so a device whose sockets change later (a
repunched patch panel, an edited library entry) keeps the new ones instead of
losing them.

### Cables that would otherwise sit on top of each other

Two things stop a busy graph turning to mush. Cables sharing both endpoints —
which happens whenever a card is collapsed and several wires land on its header —
are **bowed apart** symmetrically, so a bundle of four reads as four. And the
number chips **slide along their own curve** when one would land on another —
or on a device card, which would hide a port row — walking outward from the
midpoint so the chip stays attached to the cable it belongs to. If there is
nowhere clean it takes the midpoint anyway: a crowded number beats no number.

Dragging a cable to the edge of the canvas **pans it**, so patching to something
off-screen does not mean letting go, panning, and starting again. The speed
ramps with how far into the edge band you are, because a hard step at the
boundary feels like the canvas is fighting you.

### Direction is not in the library

A jack or a BNC does not say whether it is an input or an output, and inventing
that for 3,205 sockets would be guesswork. So a cable's direction is simply the
order you drew it: source where you started, target where you let go. Drag from
a left-hand anchor and the app takes it that you grabbed the destination first,
and flips the cable accordingly.

Where the connector itself settles the question — XLR gender, and the `_in` /
`_thru` power variants — the row carries a small `in` / `out` tag. That is the
only direction claim the library makes on its own.

Patching across signal families (an XLR into a MIDI socket, say) is allowed but
warns, because sometimes you really do mean it.

### Geometry

`NODE_W`, `HEAD_H` and `ROW_H` in `flow.js` are mirrored in `styles.css` so port
anchors can be *computed* rather than measured — no DOM reads in the drag loop.
Change one and you must change the other.

## Custom patch panels

Drop in a **Patch panel (blank)** and the inspector grows a *Punch pattern*
editor. **Plate (U)** is the physical panel height; **Rows** is how many rows of
holes go in it — they are deliberately separate. A 2U plate with *1 (centred)*
row gives each connector 89 mm of height, which is how you actually mount a 16 A
CEE or a Socapex. Then pick holes per row, choose a connector, and punch.

The pattern lives on the rack **item**, not the device, so two panels of the
same type in the same rack can be punched completely differently, and the
pattern travels inside a saved `.json`.

**Selecting several holes:** drag across the grid to punch a run, or click one
hole then shift-click another to fill the range between them. Clicking a punched
hole clears it, and dragging on from there erases. Right-click clears any hole.

**Physical fit.** Connectors are drawn at their real size (see below), so the
editor checks each row two ways — total width against the 407 mm usable face,
and the tallest connector against the 44.45 mm row — and warns when a row cannot
physically exist. Twelve 16 A CEE in 1U reports 191% width and a 65 mm connector
in a 44 mm row.

### 1/4" jacks: TRS, TS, or unrecorded

A 1/4" socket is a 1/4" socket — you cannot tell a balanced TRS from an
unbalanced TS by looking at the panel, so `trs`, `ts` and `jack` all draw
identically from one primitive at the same 15 mm pitch. The type exists to
record **what the cable has to be**, which is the thing a patch list is for.

`jack` is the honest "not recorded" case and prints as `JACK`. It is not a
default to reach for: use it only where the manufacturer does not say.

Set from manufacturer documentation, not inference:

- **Headphone and monitor outputs are `trs`** everywhere. A headphone socket is
  tip-ring-sleeve by definition — there is no such thing as a mono TS headphone
  out on this gear.
- **Sennheiser EW receivers are `ts` on the rear.** Sennheiser calls it
  `AF OUT UNBAL` — an unbalanced 6.3 mm jack sitting beside the balanced XLR.
- **Shure receivers are `trs` on the rear.** Shure's own spec says a 1/4" TRS
  jack, impedance balanced, tip = audio, ring = no audio.
- **Balanced line I/O is `trs`** on the two Scarletts, the Quantum 2626, the
  X32 RACK's twelve aux sends and returns, and the HA8000's eight outputs.

Six devices are still generic `jack` because their 1/4" sockets are *inputs* on
IEM transmitters and a comms station, where the manufacturers are not explicit.
They are listed in `TODO.md` rather than guessed at.

## Connector sizing

Every connector carries `mm`, the real width of its panel face, and renderPanel
scales it so **scale 1 is true size relative to the 19" panel**. That is what
stops a row of 16 A CEE fitting where a row of XLR would.

| | face | per 1U row |
| --- | --- | --- |
| D-series (XLR, etherCON, NL2/NL4, powerCON, TRUE1) | 24 × 31 mm | 16 |
| speakON NL8 | 44 mm | 9 |
| MIDI 5-pin DIN | 21 mm | 19 |
| ADAT / optical (TOSLINK) | 13 × 11 mm | 31 |
| IEC C13/C14 | 27 mm | 15 |
| 13 A / Schuko (rack modules) | 46 / 45 mm | 8 |
| Socapex 19-pin, Powerlock | 50 mm | needs 2U — taller than a 1U row |
| CEE 16 A / 32 A / 63 A / 125 A | 65 / 75-80 / 95 / 125 mm | needs 2–3U |

**In vs thru.** Every power connector has an `_in` and a `_thru` variant. In =
solid pins (an inlet), thru = open holes (an outlet). There is no 13 A inlet,
because that isn't a thing.

**Neutrik iconography.** Every D-type draws the real D-series flange — the plate
with the connector bore and two countersunk screw holes on the diagonal — which
is what makes them read as panel connectors rather than as circles. speakON
spells out its pole count (2/4/8) because NL2, NL4 and NL8 bores are otherwise
near-identical. powerCON shows its flat-chord keyed insert; TRUE1 shows the
square latching collar. XLR male has a shaded interior and solid pins, female an
open interior, small holes and the latch-release tab.

**Policy for adding named products:** if no clean orthographic front view can be
found, the device is *skipped and reported* rather than guessed at from an
angled press shot. This is what keeps the library trustworthy.

Three ways to grow it, in increasing effort:

1. **+ Device** — draw it. It is the patch-panel punch grid applied to a whole
   device: pick rows and columns, click cells to place connectors, and every
   cell becomes a real element at a real coordinate. Specifically:
   - **Front and rear**, switched with the tabs. The note beside them says what
     is on the face you are not looking at, because a forgotten rear is the
     easiest mistake to make here.
   - **Select a placed socket and name it.** An etherCON on an A&H box is
     `AES50`, on a Yamaha it is `Dante`; a drawing that only says `EC 1` has
     thrown that away. The name is what the flow view labels the port with.
   - **Text label** is the first entry in the Place list — put panel lettering
     in a cell like any other item.
   - **Half rack**, with or without ears, at any U height.
   - **Copy JSON** gives the record in exactly the shape `devices.js` uses.
2. **Find specs** — the app is offline and can't search the web, so this gives
   you a prompt to paste into a Claude session. Claude returns a JSON device
   record; paste it back in. Ask it to cite the datasheet it used. This box also
   takes the output of **+ Device**'s Copy JSON, which is the way to hand a
   device you drew to somebody else.
3. **Edit `devices/<brand>.js`** — paste a Copy JSON record in, or hand-place
   elements for the devices you care most about. `ah-ar2412` and `db-d20` are the worked
   examples: both were drawn from the manufacturer's own orthographic front
   view, which is the standard the rest of the library is held to.

There are also generators for faces that repeat. `switchFront()` is used by more
than one brand so it lives in `devices/_lib.js`; the single-brand ones sit in the
file that uses them — `mixrackFront()` in `allen-heath.js`, `pdu16Front()` in
`penn-elcom.js`, the PLD and legacy-amp faces in `qsc.js`.

Devices added through 1 and 2 live in the project file, so they travel with a
saved `.json`. Devices in `devices.js` are shared across all projects — which is
why Copy JSON strips the `id`, so a pasted record gets a fresh one instead of
colliding with the device it was copied from.

### Correcting a device

Every device can be edited, including the ones that ship in the library: the
pencil on a library row, or **Edit device** in the inspector.

A library device is **never rewritten in place**. `devices.js` is the shared
truth, so a correction is stored against the device's id in the project and
applied on read — it reaches everything already using that device, while the
file stays untouched. Corrected devices carry a dot in the library list and can
be reverted. To make a fix everybody's, **Copy JSON** and paste it into
`devices.js`.

Editing starts from the original record, so fields the editor does not model —
`src`, `slots`, `bands`, `patch`, `shelf` — survive untouched.

Each face has two editing modes:

- **Grid** places by position — the punch grid, for panels that sit on one.
- **List** edits the sockets themselves — type, count, name, order, add, remove.
  This is the flow view's port rows made editable, and it works on *every* face
  whatever its shape.

That split matters because the grid can only draw a panel that is on a uniform
grid, and most here are not: they are hand-placed at real pitch, or an `auto`
declaration with no positions at all. Those faces are **kept exactly as they
are** — an amber note says so in Grid, and the real drawing stays in the preview
— while **List still edits their IO**. On an `auto` face the list order *is* the
order across the panel, left to right as seen from behind the rack.

A run declared `n: 8, gap: 58` stays one row with a count, so editing keeps the
shape the source was written in. A name is either one label for the whole run or
a comma-separated list naming each socket.

Rows the editor does not own — an option-card `slot`, a `screw` — are locked and
labelled rather than shown as an editable connector.

### Power figures

Two fields, because one number cannot answer both questions a rack poses:

- **`power`** — what the device draws doing its job. What the summary totals.
- **`powerMax`** — the manufacturer's stated maximum. What a feed and a breaker
  have to survive.

A d&b D80 idles at 180 W and peaks at 7000 W; reporting either alone is
misleading, and reporting only the first under-sizes the supply. The summary
shows peak rows only when something in the rack states one.

A device with no `power` at all is one the manufacturer does not publish a
figure for. That is not zero watts, so the totals carry a `+` and a count rather
than quietly under-reporting.

Manufacturer PDFs that "yield no text" usually do yield text — try
`pdftotext -layout` before recording a figure as unobtainable. d&b's hardware
manuals extract cleanly that way, which is where the D80, D20 and DS10 figures
came from.

### Spec accuracy

`ru` is reliable throughout. Entries flagged `approx: true` have ballpark
weight/depth/power — fine for layout, **not** for rigging loads or power
sign-off. The summary shows a warning whenever any such device is in the rack.
Entries with a `src` field were checked against manufacturer documentation.

## How drawing works

`panel.js` renders each device into a `1000 × (100 × U)` viewBox — the same
convention StageRack and the NetBox elevation images use. It's a ~8% squash of
the true 19":1.75" ratio, traded for round numbers; physical truth lives in the
mm/kg/W fields, not the drawing.

A device resolves in this order:

1. `front`/`rear` with an `elements` array → hand-placed drawing. An **empty**
   array is valid and means a genuinely blank panel.
2. `front`/`rear` with an `auto` connector list → generated layout.
3. Neither → a labelled block at the correct U height.

### What an `auto` rear is and is not

`autoLayout` flows the declared connector list **left to right as seen standing
behind the rack** — so declaration order *is* panel order, and getting the list
backwards puts the mains where the inputs should be.

Most rears in this library are `auto`. They are **accurate in inventory and in
size** — the right connectors, the right counts, drawn at true width, so the fit
check is meaningful — but the left-to-right *order* is only as good as the order
they were declared in. Where a real rear photograph or drawing was available the
order follows it; elsewhere it is schematic. Treat an auto rear as "what is on
the back and how much of it", not as a photograph of the back.

### Option-card slots

Gear with a card slot declares the aperture, and the aperture has a real size:

```js
slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-sq-io' }],
rear: { auto: [ …, { t: 'slot', slot: 'io' }, … ] },
```

`fmt` names an entry in `SLOT_FORMATS` (panel.js), which carries the aperture's
millimetre size. Cards live in `OPTION_CARDS` (devices.js) and declare the same
`fmt` plus their own `auto` connector list. **Any card fits any slot of its
format** — that is the whole compatibility model, and it matches how the real
ranges work: the five Allen & Heath cards fit the SQ-Rack, the SQ-5/6/7, the
SQ+ consoles and the AHM processors alike.

Which card is fitted is stored **per rack item** (`it.cards[slotId]`), not on
the library entry, because two SQ-Racks on the same tour are routinely built
differently. From then on the card's sockets *are* that unit's sockets: they
draw on the panel and they patch in the flow view like any other. They are
named for the slot they sit in — `I/O SLINK`, not `SLINK` — which is both what
keeps a card socket from colliding with an identical one on the chassis and
what A&H's own patch screen does.

`tools/check.mjs` checks that a card's connectors physically fit its aperture,
and that fitting any card to any compatible device leaves every socket name
unambiguous. Adding a manufacturer means adding a format.

A format may carry `approx: true`, meaning its size was **derived rather than
measured** — the fit checks against it are then a sanity bound, not a guarantee,
and `check.mjs` prints a note saying so on every run. `ah-dl-io` (dLive /
Avantis) is currently the only one; `ah-sq-io` was measured off A&H's drawing.

### Stacked connector banks

A run of connectors can be drawn two or three rows deep with `stack`:

```js
rear: { auto: [{ t: 'iec_in', n: 1 }, { t: 'jack', n: 10, stack: 2 }] }
```

Real 1U rears do this constantly. A 1/4" jack is 15 mm across but also only
15 mm tall, so two rows cost 30 mm of the 44 mm U and halve the face width the
bank eats — which is the only way an interface gets ten line outputs and six
combo inputs onto one panel. A D-shell cannot be stacked: 31 mm twice over does
not fit in a U. `depthLimit()` enforces that from the primitive's own `mmH`, so
there is no list of exceptions to maintain — give a new primitive an honest
height and stacking follows.

`stack` is a claim about a specific product, so set it only where the real panel
does it. Separately, a run of **three or more** stackable connectors is folded
*automatically* when the band would otherwise overflow the face. That is not a
claim about the product — it is the layout engine choosing a plausible
arrangement over the alternative, which was drawing every connector smaller than
it really is. Runs of one or two are left alone; folding a lone S/PDIF pair into
a 1-wide column buys no width and asserts something unverified.

To add a new connector or control type, add it to `PRIMS` in `panel.js` and to
`CONNECTOR_TYPES` so it shows up in the + Device form.

### Getting a panel to actually look like the product

Auto-layout gets the inventory right but the arrangement generic. For devices
worth recognising on sight, work from the manufacturer's **orthographic front
view** (not an angled press shot) and hand-place elements:

- Measure feature positions off the image as fractions of the face, then map
  them into the `1000 × 100·U` space. The face runs x 62→938.
- `scale:` on an element resizes it about its own centre with the stroke weight
  compensated — use it when a connector reads too small against a tall panel.
- `line` / `vline` draw panel steps, recesses and section dividers.

`db-d20`, `ah-sq-rack` and `ah-dx168` are built this way and are the reference
examples.

## Layout note

The app deliberately uses its own visual language and does **not** follow the
site design system in `../DESIGN.md`; the impeccable hook will flag its colours
and type sizes. Scope the hook out of this folder if that noise is unwanted.
