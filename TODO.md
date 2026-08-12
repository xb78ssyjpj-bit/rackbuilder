# TODO

Not urgent, but real.

## ~~1. Rear view~~ — done

Fixed. The bay still mirrors positions (front-left is rear-right), but each item
counter-mirrors itself so its own panel and text read the right way round. A
device with no `rear` layout now draws an explicit hatched *"rear not
documented"* panel instead of a plain block that looked like a real blank panel,
and the side column names every position so you can tell what you're looking at.
The SVG export mirrors half-width sides to match.

## ~~2. Rack depth and front/rear mounting~~ — done

Devices now mount to either face. `rack.depth` is an optional mm field beside
name and height; each item carries `plane: 'front' | 'rear'` (front is implied).
Occupancy is per face — a front and a rear device share a U freely, and only
compete on depth: the pair is refused when their depths together exceed the rack,
and existing pairs that no longer fit are listed in the summary. With no rack
depth recorded the check is skipped rather than guessed.

What you see is what is physically there: each face shows its own devices front-on
plus the BACK of anything on the far face whose slot isn't already filled. The
SVG export applies the same rule.

Still open: the depth check treats every device as a solid block from the rails
backwards. It doesn't know about a shallow device mounted with long rear
connectors, or about cable bend radius.

## 3. RF gear that was skipped rather than guessed at

Per the standing policy — no orthographic front view, no drawing:

- **Shure SLXD4D** — Shure's SLX-D guide diagrams only the single-channel SLXD4.
  The dual's dimensions are published (393 mm wide) but its face is not drawn
  anywhere I could find. Add it if a drawing turns up, or from a photo of yours.
- **Shure UA440** front BNC panel — the only figure in Shure's documentation is an
  isometric assembly illustration, not an elevation. The generic *Antenna front
  panel 1U (4 BNC)* covers the same job in the meantime.
- **Sennheiser ASA 1** and **AC 3** — could not confirm from Sennheiser's own
  documentation whether their BNCs are front or rear. Given the EW-D ASA turned
  out to be rear-connector when a secondary source said front, these were left
  out rather than drawn wrong.
- **Shure AXT600** — legacy spectrum manager, superseded by the AD600 which is in
  the library. Easy to add on request.

Also worth a look one day: `bands` currently trims very long SKU lists (Shure
publishes 18 Axient Digital bands, 17 PSM300 bands) to the common ones.

## 4. Comms and charging — what is not drawn properly

- **Green-GO panels.** Every Green-GO entry is a plain labelled block. Their
  manual host (manual.greengoconnect.com) returns 403 to automated fetches, the
  dealer listings that remain contradict each other — MCX appears as both
  485 x 110 x 45 and 483 x 155 x 44, and BridgeX and INTERFACEX are quoted with
  byte-identical dimensions, which smells like a templated spec block — and no
  orthographic front view was obtainable. RU and full-width are safe; depths are
  the weakest figure. A front photo of each would let them be drawn properly.
- **Spectera Base Station** is drawn from a confirmed element inventory (OLED,
  jog wheel, headphone out with volume) but unconfirmed positions, in the EW-DX
  house style. Dimensions, weight and the 70 W figure ARE from Sennheiser.
  Note their own marketing page quotes a conflicting 435 x 175 x 550 mm / 8.2 kg
  against docs.cloud's 483 x 44 x 373 / 6.3 kg; the latter was used because
  44 mm is a real 1U and 483 mm is a real 19".
- **Riedel RMK-001** has no published dimensions — Riedel dimension the NSA-002A
  it carries but not the bracket. Modelled as a 1U tray with an assumed depth.
- **Green-GO RDX and SI2WR** are 95 mm and 145 mm wide — far narrower than half
  rack, so they do not fit the app's full/half width model at all. They mount
  several-up in the SISHELVE tray, which IS in the library. Same story for the
  standalone 5-bay Bolero charger at 380 mm.
- Sennheiser's **LM 6060/6061/6062/6070** are inserts into the L 6000, not rack
  units, so they are not separate entries. A part-populated L 6000 is drawn with
  all four bays regardless.

## 5. Allen & Heath — what is not drawn properly

allen-heath.com returns 403 to automated fetches, so all of this came from
search snippets, retailer listings, or pages rendered in a real browser. The
front-panel layouts that ARE drawn were confirmed visually; these were not:

- **GX4816** is a labelled block. 48 in / 16 out is confirmed but 64 XLR does not
  divide cleanly into a 5U face, and its arrangement could not be seen — the
  product page image would not load. Four rows of 12 in plus one row of 16 out
  fits the geometry exactly, but that is arithmetic, not evidence.
- **dLive MixRack fronts** are labelled blocks. A&H's own copy says they are
  control-less, which makes a plain vented face very likely, but no front view
  was obtained. Their rears ARE drawn from confirmed I/O counts.
- **DX Hub** is not in the library at all — its RU height was never established.
- **DT164-W and DX164-W** are wall-mount / floor-pocket, not 19" rack, so they
  are out of scope rather than missing.
- **AB168 and DT168** fronts are drawn from the DX168's confirmed layout on the
  grounds of identical chassis and I/O count. Worth a glance if you have one.
- Depths and weights across the dLive range are the weakest figures — several
  come from retailers rather than A&H, and are marked `approx`.
- **The SQ-Rack rear was rebuilt in v1.3.0** from A&H's own drawing, and it was
  wrong in six separate ways. Every other A&H rear in this library was declared
  the same way and from the same class of source. They are worth the same pass —
  the SQ-Rack's errors were all of the "counted the obvious connectors, missed
  the jacks" kind, which nothing in the check gate can catch.

### Option-card slots — what is not covered yet

The mechanism is general (see README, "Option-card slots"); only the aperture
formats are per-manufacturer. Done: the SQ-Rack and AHM-16/32/64, all four on
the `ah-sq-io` format with the five SQ cards.

**dLive / Avantis — blocked on one number.** The whole card range is documented
from A&H's own fitting notes and needs no further research:

| Card | Sockets |
|---|---|
| M-DL-DANT64 / DANT128 | 2 × etherCON (Primary / Secondary) |
| M-DL-DXLINK | 4 × etherCON (DX Link 1–4) |
| M-DL-GACE (gigaACE) | 1 × etherCON (port A) |
| M-DL-GOPT (fibreACE) | 1 × opticalCON Duo + 1 × etherCON |
| M-DL-WAVES3 | 3 × etherCON (built-in gigabit switch) |
| M-DL-SMADI (superMADI) | 4 × BNC (Link 1–4) + 4 × SFP (Link 5–8) |
| M-DL-AES ×4 variants | AES3 on XLR — 10 channels split 10O / 2I8O / 4I6O / 6I4O |

What is missing is the **aperture size in mm**. It is certainly not the SQ's:
M-DL-DXLINK puts four etherCON in one row, 96 mm of connector before any
spacing, against an 88 mm SQ I/O Port. A&H publish no mechanical drawing of it,
their site 403s automated fetches, and neither MixRack Getting Started Guide has
a rear-panel *drawing* — only photographs with callouts, which carry no ruler.

The fix is one photograph of a dLive MixRack rear, straight on: the 19" ear-to-
ear span is the scale reference, the same way the SQ-Rack's 88 × 41 mm was
measured. That same photo would also fix the rears below.

Slot counts, when the aperture is known — both from A&H's guides, and they
differ, which is worth not assuming:

- **DM0 / DM32 / DM48 / DM64**: *3* I/O Ports, 128×128 channels each.
- **CDM32 / CDM48 / CDM64**: *1* I/O Port.

- **M-DL-ADAPT** is a slot inside a slot — a 'letter-box' adapter that puts an
  iLive/GLD aperture inside a dLive one, hosting M-Dante, M-Waves, M-ES-V2,
  M-ACE or M-MADI. Supporting it means letting a *card* declare `slots` too,
  plus the iLive/GLD card range. Left out entirely rather than modelled as a
  blank plate, which is what it would look like and is not what it is.
- **The dLive MixRack rears are as incomplete as the SQ-Rack's was.** Every one
  is declared as XLRs, two etherCON and mains. From the guides they also have:
  3 I/O Ports, 2 × RJ45 network, gigaACE link, 4 × etherCON DX links (DM) or
  DX links for up to 4 expanders (CDM), a dedicated ME etherCON, word clock in
  and out on BNC, a 1/4" phones jack, and a *hot-swap PSU bay* — itself a slot,
  taking an MPS-16, with a blanking plate when the second bay is empty.
- **DX32** already draws its four I/O module bays as plain rectangles. Those are
  real slots of a different kind — I/O modules rather than network cards — and
  the DX module range is its own format.
- **Yamaha MY-cards, DiGiCo, Lake, Dante-in-anything** — each is a new format.
- No weight or power per card, because nobody publishes it. If a manufacturer
  does, the field is there to fill in.

## 6. Network

- ~~Luminex GigaCore~~ — **done.** GigaCore 14R and the Yamaha SWP1-8/16MMF are
  hand-built from their own manuals; see the README. Still no other entertainment
  vendors in NetBox, so anything further is hand-work too.
- **Depth is a bracket, not a measurement**, on every imported switch: NetBox
  records `is_full_depth` as a boolean only, so entries get 250 mm or 450 mm and
  are flagged `approx`. Fix by hand where a front/rear depth clash matters.
- **Port face is assumed front.** Correct for access switches, wrong for any
  data-centre switch with rear-facing ports.
- Cisco Catalyst 9200s import with no SFP because their uplinks are a separate
  network module; NetBox models those as module bays, which the importer skips.
  The drawn panel is right for a bare unit, not one with an uplink fitted.
- `rj45` was 18 mm and is now 15 mm — the pitch of a stacked switch port rather
  than a lone panel jack. Slightly narrows RJ45s on a few older entries too.

## 7. Amplifiers

- **Mains draw is missing for every amplifier except the 17 QSC PLX / PLX2 /
  RMX** — d&b, L-Acoustics and Martin Audio all publish output power only, and
  all three have vector-art PDFs that yield no text. This is still the biggest
  real gap in the library: an amp rack is the heaviest electrical load in a
  system and the summary reports it as near zero (with a `+` and a count, so it
  is at least not silently wrong). Fixing the rest needs the figures read off the
  units or paper manuals.
- **The QSC figures are 1/8-power typical, not worst case.** QSC's own tables
  also give a "severe, 1/3 power" current that runs 1.5-2x higher. `power` here
  carries the typical row because that is what the summary is for; **do not size
  a breaker from the summary.** A second field for peak draw would be the honest
  fix, and would let the summary show a range.
- **The D20's 400 W has never been verified** — it predates all this and carries
  a "not from the datasheet" note in the code. d&b's manual PDF is over the
  fetch size limit. It is the only amp with any figure at all, which makes it
  the odd one out; consider removing it for consistency.
- **L-Acoustics front panels are indicative, not drawn from source.** Their spec
  tables render client-side and their PDFs are vector art, so RU/depth/weight
  came from third-party listings and the fascia layouts follow family grammar.
  The LS10 front is the exception — that came from L-Acoustics' own text.
- **d&b front panels** follow the D20's confirmed house grammar rather than
  their own orthographic views, which d&b do not publish.
- **LA1.16i is not in** — no RU height could be established for it.
- **Martin's MA series and DX0.5/1.5/2.0 are archived**, not current; the live
  line is iKON + VIA and DX0.4/0.6/4.0. Nothing discontinued was added.
- **QSC PLD4.2/4.3/4.5 are in and are the best-documented amps here** — front
  and rear both drawn from QSC's own numbered panel figures, so the rear
  connector *order* is real rather than schematic. They still carry no `power`:
  QSC publish **heat loss** (BTU/hr at idle, 1/8, 1/3 and full power), not mains
  draw. That is a better lead than d&b, L-Acoustics or Martin give — wall draw is
  output + heat loss — but it is a calculation, so it was not asserted. If the
  amp-power gap is ever closed properly, start here.
- **QSC CX-Q, CXD-Q, CXD and GXD are not in.** CX-Q is the network/Dante line and
  the obvious next one, but its page gives dimensions and weight only; the
  connector complement needs the individual model pages or the manuals.
- **RMX depth is a ceiling, not a measurement.** QSC only ever say "less than
  16 inches"; all six carry 400 mm and are flagged `approx`.
- **No QSC sheet names the mains inlet.** C14 is assumed across PLX, PLX2 and
  RMX. The RMX5050 ships with a NEMA 5-20 (20 A) plug, so a plain 10 A C14 is
  unlikely on that one — worth a look at a real unit.
- **The RMX spec sheet contradicts itself on inputs.** Its detailed table says
  "3-pin Euro-style detachable terminal block and XLR"; its own intro and feature
  bullets say XLR, 1/4" TRS *and* barrier strip, which is also what the user
  manuals describe. All three are modelled. If the table is right, the TRS pair
  should come out.
- **Touch-proof binding posts are not drawn** on any PLX/PLX2/RMX — there is no
  primitive for them, so each amp shows two speakON where the real panel has
  speakON plus posts.

## 8. Stageboxes — skipped and uncertain

Skipped for lack of evidence, all worth adding if the source turns up:

- **Midas DL231** (5U) — connector face inferred from the DL251 rather than
  stated, so not drawn.
- **Midas HUB4 / HUB4 PRO** — could not resolve which face carries what, and the
  two SKUs' specs came back indistinguishable.
- **Yamaha RSio64-D** — the routing switch is confirmed front, but the card
  slots, Dante ports and mains could not be placed.

Other caveats:

- **Tio1608-D2's connector face is moderate confidence**, not confirmed —
  Yamaha's manual PDF would not extract. Everything is drawn on the front.
- **No DiGiCo rack publishes dimensions, weight or wattage** — except the
  D-Rack (483 x 179 x 310 mm, 14 kg) and the Orange Box, which has a dimensioned
  CAD drawing. Their datasheets otherwise give connector counts and PSU input
  ratings only, so RU comes from the product pages and depth/weight are
  estimates flagged `approx`.
- **Only the SD-Rack, DQ-Rack and Orange Box had their connector face
  confirmed.** D2-Rack, MQ-Rack, SD-MiNi, SD-NANO and D-Rack are drawn to the
  confirmed DiGiCo pattern — everything on the front, rear a blank vented panel —
  because none of their pages state it either way. MQ-Rack is the safest of
  those (same 6U chassis and I/O count as the photographically-confirmed
  DQ-Rack); D-Rack is the least, being a different generation and a floor box.
- **D-Rack's rack ears are an option, not standard fit** — it is really a
  floor-standing stagebox that can be racked, hence tall and shallow.
- **Midas publishes almost no wattage either** — only the DL32 (55 W) and DL251
  (110 W, dual PSU) have figures.

## ~~8b. The batch of asked-for items~~ — done bar one

Shipped: IEC shorthand now reads `IEC in` / `IEC out`; combo reads `XLR/TRS`
(patch cells wrap and shrink for codes over four characters); cable chips slide
along their own curve rather than colliding; cables sharing both endpoints bow
apart; a run of sockets can be picked and patched in one drag; both sidebars
drag-resize and remember their width; AES3 is a declarable `sig` on a port; and
there is a side elevation. All documented in the README.

**Still open, deliberately excluded from that batch:**

- **The + Device dialog builds a front panel only.** `index.html` hardcodes an
  `<h3>Front panel</h3>` and a single `connRows` list, so a device added by hand
  can never have a rear — which since the flow view arrived also means it can
  never have rear ports on the canvas. Wants front/rear tabs writing to
  `front.auto` and `rear.auto`.

**Loose ends from what did ship:**

- **`sig` is set on one device.** Only the d&b DS10 declares `aes3`. Anything
  else in the library carrying AES3 on XLR still reads as analogue audio —
  the DiGiCo racks and the Midas boxes are the likely candidates.
- **AES3 channel counts are not modelled.** The family is right; the fact that
  one XLR carries two channels is not represented anywhere.
- **The side view has no zoom control and draws only the selected rack.**
  Devices now drag within it. It still does not know about anything a device
  sticks out behind its own chassis — connectors, cable bend radius — which is
  the same caveat the depth check has always had.
- **A picked run cannot span two cards**, and shift-extend works within one
  card's visible sockets only.

## 9. Smaller things

- Individual connector numbering on high-density panels (DX168 etc.) is dropped
  because it turns to mush at normal render size. Could re-add it and only show
  it above a zoom threshold.
- **No undo.** Drag-to-remove, right-click-remove and Delete are all instant.
  Right-click is the easiest of the three to hit by accident, so it toasts what
  it removed — but that is a consolation, not a fix. Undo is the real answer.
- **Rack lights.** Nothing in the library lights a rack. Wanted: the 1U
  gooseneck/LED bar types that take a U of their own, and the clip-on lamps that
  do not. Note the Furman PL-8C and PL-PRO DMC already have retractable lamps
  built into the front panel — those are drawn as part of the conditioner, so a
  standalone light is a separate device, not a fix to those. Needs a decision on
  whether a clip-on lamp is a device at all, given it occupies no U.

## 9b. Connector detail still owed

- **Six devices keep the generic `jack`** because their 1/4" sockets are inputs
  and the manufacturer does not say whether they are balanced: `senn-sr300-iem-g3`,
  `senn-sr-iem-g4`, `shure-p10t`, `shure-p9t`, `shure-p3t` (IEM transmitter
  inputs) and `clearcom-hms-4x`. Everything else is now `trs` or `ts` from
  manufacturer documentation — see the README.
- **The S16's mains inlet is inferred.** Behringer's connector table lists AES50,
  ULTRANET, ADAT, MIDI and USB but never names the inlet; C14 is what is on the
  unit and what every comparable box here uses. Worth a photo check.
- **`cisco-catalyst-9200-48p` loses its management port.** `switchFront` only
  draws a MGMT port when the face has a lettering gutter, and a 48-port face has
  none — at `x0 - 46` it would sit on the rack ear. On the real Catalyst the
  out-of-band port is on the rear anyway, so the fix is probably a rear entry
  rather than squeezing the front. Now visible in the flow view, which is why it
  is worth doing: the switch has no MGMT socket on the graph.

## 9c. Dante

- **Dante, AES50, ULTRANET and control all read as one `network` family**, so
  the flow view colours a Dante primary the same green as an AES50 run and a
  laptop's control port. The socket *names* now carry the distinction where the
  manufacturer gives one, but the family does not. Splitting `network` into
  audio-over-IP versus control is the obvious next move if the cable colours are
  meant to mean anything on a big graph.
- **SWP1 and GigaCore switch-port numbering is unverified**, so those ports use
  the `F EC 1` default. If someone has one in front of them, read the silkscreen
  and set `lbl`.
- **Focusrite RedNet, Ferrofish A32 Dante and RME Digiface Dante are absent.**
  Those brands were excluded during the stagebox pass; RedNet in particular is
  the canonical Dante interface range, so it is worth deciding whether that
  exclusion still stands.
- **Shure ANI4IN / ANI4OUT are 1/3-rack width**, which the layout model has no
  concept of — it does full and half only. They were skipped rather than
  modelled as half-width, which would be a lie about the panel.

## 10. Signal flow — what it does not do yet

- ~~Cables are not in the export~~ — **done.** The project sheet now carries a
  numbered cable schedule below the elevations, with a family colour dot and the
  rack/U of each end. Appears only when there are cables.
- ~~No zones~~ — **done** for racks: each rack is a tinted, named region that
  follows its members. **External nodes still have no sense of place** — there
  is one "External" region and no way to say *stage* versus *FOH*.
- **No cable length, type or numbering scheme.** Every cable is just a link with
  a number. No length field, no "XLR 10 m" stock type, no per-family numbering
  prefixes.
- **Ports have no direction of their own** — see the README. Only XLR gender and
  the power in/thru variants know which way round they are.
- **A cable cannot be labelled from the canvas.** The `label` field exists on
  every cable and is exported to CSV, but nothing sets it yet.
- **Nodes do not reflow when expanded**, so opening a 48-port switch will
  overlap whatever is below it. **Arrange** fixes it; nothing does automatically.
- **`sonnet-rackmac-mini` is the one device that carries signal but has no
  ports**, so it never appears on the canvas. It is modelled as a carrier tray —
  two bays and a vent — and the Mac minis that would hold the I/O are not in the
  library. Either give the tray the machines' ports or add a Mac mini node.
- **Riedel NSA-002A rear is over-specified.** It is a half-rack unit, so the face
  is ~200 mm, but the rear declares 2 XLRf + 2 XLRm + 2 RJ45 + 2 DB25 + IEC =
  ~311 mm of connector. It cannot be drawn honestly and currently shrinks by a
  third. The front already carries 4 in / 4 out on XLR, so the rear XLRs look
  like a duplication — needs checking against the datasheet before editing.
- **`stack` is set on two devices only** (Quantum 2626, Scarlett 18i20 2nd gen),
  because those two were confirmed. Other 1U rears with big jack, BNC or
  euroblock banks are folded automatically only when they overflow — see the
  README. Where a real rear view is to hand, set `stack` explicitly instead.
