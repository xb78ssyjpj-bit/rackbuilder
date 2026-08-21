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

**dLive / Avantis — done, with one soft figure.** The whole card range is in,
from A&H's own fitting notes, on the `ah-dl-io` format: DM32/48/64 with three
I/O Ports each and CDM32/48/64 with one.

The **aperture size is derived, not measured** — 170 x 48 mm, from A&H's exact
3.53:1 template aspect plus the pitch of five D-series connectors on the AES
card's faceplate drawing. It is the only dimension in this library that is not
from a drawing or a stated figure, `check.mjs` prints a note about it on every
run, and one straight-on photograph of a dLive MixRack rear would settle it: the
19" ear-to-ear span is the ruler, the same way the SQ-Rack's 88 x 41 mm was got.

- **DM0** has no slots declared. A&H's DM MixRack guide covers "3 sizes" — the
  DM32, DM48 and DM64 — and says nothing about the DM0, so its I/O Port count
  was not established rather than assumed from the family.
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

## 5b. Penn Elcom — the rest of the PDU range

Ten of the 2U units are in (v1.5.0). Not done, and why:

- **The universal-socket models** — PDU16-UN, PDU16-UN32, PDU16-AV, PDU16-AVC.
  A "universal" outlet takes UK, US, EU and AU plugs and looks like none of
  them. There is no primitive for it and drawing it as a Schuko or a BS1363
  would be a lie about what you can plug in. Needs a `universal_thru` primitive
  first. PDU16-AV also wants a dual-USB charger module and an IEC C13 outlet
  strip on one face.
- **The 1U range** — PDU16-10DJ-UK/EU (10-channel), PDU16-5DJ-AV-UK/EU
  (5-channel switched), PDU6-UK, PDU-EU-6, PDU6SW, PDU01-14 (surge + EMI
  filter), PDU-EU-8/8SW/8SWR, RG-6517, RG-6518FR. All straightforward, just not
  done this pass.
- **Vertical 0U PDUs** — PDU-UK-20B, PDU20-UK, PDU-EU-20B, PDU-US-20B,
  PDU-AU-20B, PDU-CN-20B, PDU08-US. These mount in the rear channel rather than
  on the rails, so they do not fit the app's rack-unit model at all — same
  situation as the wall-mount DT164-W, out of scope rather than missing.
- **Truss-mount plug boards** — PDU16-5UK-T1, PDU16-6UK. Not rack units.
- **US / AU / CN socket variants** of everything above.
- **R2249/1UK-PH16**, the 16-way punched Phoenix panel, is a patch panel rather
  than a PDU and would suit the existing `patch: true` model.

Penn Elcom's own copy has paste errors worth watching for: the PDU16-UK32 page
describes "8 x Universal Sockets" in a product titled and tagged UK, and the
PDU16-EU32 page does the same. The structured Plug Type field was trusted over
the prose.

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

- **Mains draw, and the claim that used to be here.** This section said the
  figure was missing for every amp except the QSC PLX/PLX2/RMX, and that d&b,
  L-Acoustics and Martin "all have vector-art PDFs that yield no text". **The
  second half is false.** d&b's hardware manuals extract cleanly with
  `pdftotext -layout`; the earlier attempts used a fetch tool that hands back
  the raw PDF. Fixed in v1.9.0 for the D80, D20 and DS10, straight out of d&b's
  own Technical specifications tables.

  The manuals sit at a predictable path. Versions differ per model and per
  language, so probe rather than guess:

  ```
  https://www.dbaudio.com/assets/products/downloads/
    manuals-documentation/electronics/dbaudio-manual-<model>-<ver>-en.pdf
  ```

  **The whole d&b amp range now carries a peak** — D40, 40D, 30D, 10D, 5D and
  D90 were supplied by the user in v1.9.1; D20 and D80 came from the manuals and
  match that list exactly, which is the check on the rest.

  Still owed there: a **typical draw** for D40, 40D, 30D, 10D and 5D, which have
  a peak but no idle figure and so total as `0 W+`; a **`powerMax` for D6 and
  D12**, the older generation, absent from that list; and **5DM, D25 and 25D**,
  which are not in the library at all — a power figure alone is not a device,
  and no RU, depth, weight or connector face has been established for them.
  **DS100 genuinely publishes none** — its manual gives fan noise at idle and no
  consumption figure at all.

  **L-Acoustics landed in v1.10.0** — LA2Xi, LA4X, LA7.16, LA7.16i and LA12X all
  carry idle and peak. **LA1.16i and LA8 are still not in the library**; their
  wattage is recorded in `devices/l-acoustics.js` ready for the chassis figures.

  **Martin Audio landed in v1.10.1** — iK41, iK42, iK81 and the four VIAs all
  carry idle and peak. That was the last brand with no draw data at all.

  What is left across the whole amplifier section, after v1.10.2: **QSC PLX
  1202/1602/2402/3002/3402** — the original series, typical only; **QSC
  PLD4.2/4.3/4.5** — neither figure, QSC publishing heat loss rather than mains
  draw; **d&b D6 and D12** — typical only, and a programme row at that;
  **L-Acoustics P1** and **d&b DS100** — publish nothing, both processors.
  49 devices, 44 with an idle figure, 33 with a peak.

  **D6 and D12 are the remaining inconsistency**: their `power` is a
  programme row off the power balance table, not idle like every other amp.

- ~~The QSC figures are 1/8-power typical, not worst case~~ — **peak added in
  v1.10.2** for the RMX and PLX2 ranges, as maximum current at 230 V, so there
  is a figure to size from and the old "do not size a breaker from the summary"
  warning is retired. `power` still carries the 1/8-power typical row.
  **The original PLX series — 1202, 1602, 2402, 3002, 3402 — was not in the
  supplied table and still has typical only.**
- ~~The D20's 400 W has never been verified~~ — **corrected in v1.9.0.** It was
  not any real figure: the manual gives standby 9 W, idle 48 W, max 2.2 kW.
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

## ~~8b. The batch of asked-for items~~ — done

Shipped: IEC shorthand now reads `IEC in` / `IEC out`; combo reads `XLR/TRS`
(patch cells wrap and shrink for codes over four characters); cable chips slide
along their own curve rather than colliding; cables sharing both endpoints bow
apart; a run of sockets can be picked and patched in one drag; both sidebars
drag-resize and remember their width; AES3 is a declarable `sig` on a port; and
there is a side elevation. All documented in the README.

The one item deliberately excluded from that batch — **+ Device building a front
panel only** — was rebuilt in v1.6.0 as a punch-grid editor with front and rear
tabs, per-socket naming, placed lettering, half-rack support and JSON export.

**Loose ends from the device editor:**

- **The grid is uniform.** Every cell in a row is the same width, so a face
  mixing a 65 mm C-FORM with 24 mm etherCONs spaces them evenly rather than
  packing them. Good enough to place things truthfully; not the same as
  hand-placed `x`/`y`, which is still what the best entries in `devices.js` use.
- **No `sig`, `stack` or `n`-with-`gap` from the editor.** A run of eight
  sockets becomes eight separate elements rather than one declaration with
  `n: 8`, which is more verbose in the exported JSON than a hand-written entry
  would be. It renders identically.
- **Text size is fixed** at 13 px. Real panels use a range.
- **A corrected library device is per-project.** The fix lives in the project
  file, so it travels with a saved `.json` but not to anybody else's library.
  Copy JSON into `devices.js` is the way to make a correction permanent, and
  there is no prompt reminding you to — a fix can sit in one project forever.

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

## 8c. Analog Way — and the research pass that produced it

The **Pulse 4K** (v1.10.5) is the first entry gathered by a Haiku subagent
research pass rather than by hand. By explicit instruction its figures were
**not** re-checked before entry — RU, 440 x 88 x 434 mm, 7.6 kg, 80 W max, C14
inlet. **They are owed a manual check.** The panel drawing is a separate
matter: both faces came from Analog Way's own Quick Start Guide (PLS-4K, page
2, "FRONT & REAR PANELS DESCRIPTION"), which carries a straight-on photograph
of each face with the silkscreen legible.

What the pass did not settle, and what it raised:

- **No typical / idle draw.** Analog Way publish one figure, labelled "max
  consumption: 80W", so the entry carries `powerMax` and no `power` and the
  unit counts toward the summary's `+`. If an idle figure exists anywhere it
  was not found.
- **The Analog & Dante audio card is optional and is currently drawn as
  fitted** — the LINE IN / LINE OUT minijacks and the two Dante RJ45s. Analog
  Way's own photograph has it in, so the drawing does. This is the right shape
  for the option-card mechanism, but **the aperture has never been measured**,
  and a slot at an invented size is what §5 exists to prevent. One straight-on
  rear photograph with the 19" span as the ruler would settle it, the same way
  the SQ-Rack's 88 x 41 mm was got.
- **Pulse², Pulse²-3G and Pulse²-H are all discontinued** and are not in, on
  the same grounds as Martin's MA series (§7). They would also need four
  primitives this library does not have — **HD15, DVI-D, DVI-I, and Analog
  Way's 5-pin MCO audio connector**. That is the real cost, not the typing.
- **Both an input's BNC and its HDMI are silkscreened `IN #1`** on the real
  panel, because they are one selectable input with two plugs. Two sockets on a
  device may not share a label, so those read `IN #1 SDI` / `IN #1 HDMI`. A
  small departure from the silkscreen, recorded here because the library's rule
  is otherwise to use the manufacturer's name verbatim.
- **The rear is `auto`, deliberately, despite a photograph existing.** The QSG
  shot is slightly perspective — the top of the case is visible — so measuring
  x positions off it would give coordinates *less* accurate than the layout
  engine's own. What the photo settles is the left-to-right order, and on an
  auto face declaration order is panel order, so that is what it bought.
- **`displayport` is a new primitive, and its 24 mm is derived rather than read
  off a drawing.** It is the second soft figure in the library after
  `ah-dl-io`. See §9b.

## 8d. Barco, and fractional rack units

The **PDS-4K** (v1.10.6) is the second Haiku research-pass entry. Its figures —
484.1 x 66.2 x 409 mm, 6.21 kg, 151 W — are **not re-checked** and are owed a
manual pass, same as §8c. They do come from Barco's own spec sheet on
assets.barco.com rather than a reseller, which the Pulse 4K's did not.

- **It is the first fractional-RU device in the library: `ru: 1.5`.** Barco give
  6.62 cm, which is 1.49 U. Nothing needed changing to support it, and that is
  worth writing down before somebody "fixes" it:
  - `occupied()` already works. A 1.5U unit at U1 spans `[1, 2.5)`, so a device
    dropped at U2 is correctly refused.
  - **`usedU` already ceilings**, because it is a `for (k = 0; k < itemRU; k++)`
    loop — k takes 0 and 1 for ru 1.5, so the device claims two rows. "U used"
    therefore reports the rack space consumed rather than the sum of panel
    heights, which is the number you actually want. **This is right by accident
    of the loop condition, not by design.** Anything that rewrites that loop
    needs to keep the ceiling behaviour deliberately.
  - The bay draws it 1.5U tall, so the spare half-U is visible as empty rack.
    The side view gets a true 66.7 mm.
  - **What does NOT happen is packing.** Two PDS-4Ks land at U1 and U3, not U1
    and U2.5, because slots are integer. That matches how most people rack them
    and is the safe direction, but it is not what a pair of them physically
    does — two 1.5U units genuinely fit in 3U. There is no way to express that.
- **Only Model 1 (HDMI only) is in.** Barco ship Model 2 / **PDS-4K SDI** as
  well, which fills the blanked IN 7, IN 8 and four PGM holes with 12G-SDI
  BNCs. Its drawing is Image 4-3 in the same user guide, already read; it is a
  short job and was left out only to keep this trial to one device to check.
- **The Option slot is drawn as the blanked vented aperture it is.** It takes
  Event Master cards. Not modelled with the option-card mechanism because the
  aperture was never measured and the card range was not established — same
  call as the Pulse 4K's audio card.
- **Barco publish one unlabelled power figure**, "Input power: 100-240 VAC
  50/60Hz 151W", with the panel silkscreened "2A". There is no idle/typical
  split, so it is recorded as `powerMax` only and the rack reads `0.0 A+` idle.
  If that 151 W turns out to be a typical rather than a ceiling, the entry is
  under-reporting idle and over-reporting nothing — the safe direction, but
  worth settling.
- **Front and rear both silkscreen a port simply `USB`.** They read `USB FRONT`
  / `USB REAR`, the same kind of departure as the Pulse 4K's `IN #1 SDI`.

## 8e. Blackmagic Design — and a scale bug in the two entries before it

The **ATEM 2 M/E Constellation HD** (v1.10.7) was researched **by hand** rather
than by the Haiku pass, to compare the two methods. See the CHANGELOG for the
cost comparison.

### ~~The scale bug~~ — fixed in v1.10.8 by re-measuring both

`analogway-pulse-4k` (v1.10.5) and `barco-pds-4k` (v1.10.6) were drawn about
12% too narrow, because both were hand-placed by mapping the source drawing's
ear-to-ear span onto viewBox `62..938`. That is wrong: `62` and `938` are
`EAR_L` and `EAR_R`, the *inner* edges of the rack ears. The panel's full
482.6 mm is `0..1000` — `MM = W / 482.6`.

A blanket `(x - 62) x 1000/876` was tried in v1.10.7 and reverted, because it
faithfully propagated a second error underneath: the pixel spans measured were
each panel's *body*, not its ear-to-ear outer edge. Both faces were therefore
**re-measured from source in v1.10.8**, against the outermost ink in each
figure, with the mapping written into each device file so the next person can
check it rather than trust it. Both were also cross-checked against a known
dimension in their own drawing — the Barco's C14 aperture comes out 26.8 mm
against a real 27 mm, the Pulse 4K's LCD comes out 16:9 for a 480x272 panel.

**What is still owed on these two:**

- **The Pulse 4K face carries three bands of ventilation slots and only the top
  one is drawn.** The other two sit between the SCREEN 2 row and the SHORTCUTS
  group, and along the bottom of the face. Measured the same way, they are half
  an hour's work; they were left out to keep v1.10.8 a re-measure rather than a
  redraw.
- **The PDS-4K's mains inlet is a combined switch-and-inlet module** — Barco's
  Image 4-2 shows a rocker above the C14, inside one flange. It is not drawn.
  `breaker` is the nearest primitive and is a *portrait* rocker 18 mm wide,
  where this is a landscape one about 30 x 12 mm, so drawing it with that would
  be wrong about the thing it is meant to show. Needs a `rocker` primitive.
- **The PDS-4K front has two panel step lines** at the top and bottom of the
  source-button block, spanning most of the face. `line` would draw them.
- **The Pulse 4K's recorded 440 mm body width is contradicted by the source
  photograph**, which puts the body between the ears at 454 mm. §8c already
  lists that figure as owed a manual check; this is a second reason to make it.

### What the re-measure exposed: this app draws a rack ear twice as wide as a real one

Measured honestly, the PDS-4K puts its `MVR` output, its TAKE button and its
rear mains lettering **outside `EAR_L`..`EAR_R`**. That is not a measurement
error — it is the app's ear convention being wrong, and it has been wrong since
the beginning:

| | app | real 19" |
|---|---|---|
| Ear inner edge | `EAR_L` 62 = **29.9 mm** | 15.9 mm (482.6 panel, 450.85 rack opening) |
| Mounting hole centre | `chassis()` draws it at x 31 = **15.0 mm** | 8.75 mm (465.1 mm hole centres) |
| Interior between ears | 876 = **422.8 mm** | 431.8 mm (two 215.9 mm half-rack boxes) |

Nothing in the library has hit this before because every other device measured
from a drawing has a body inset well clear of 30 mm. The PDS-4K does not: its
chassis is 477.8 mm inside a 484.1 mm ear-to-ear panel, so it is very nearly
edge-to-edge and its connectors run to within 16 mm of the panel edge.

**This is a decision, not a bug fix.** Narrowing `EAR_L`/`EAR_R` moves the drawn
ear on all 220 devices, changes `HALF_W` (which is derived from them, and whose
own comment already notes it comes out 4.5 mm narrow per side), moves
`FACE_L`/`FACE_R` and therefore every `auto` layout, and changes what
`check.mjs` will accept. Worth doing — the numbers above say the current
figures are guesses that nobody has checked — but worth doing deliberately and
on its own.

The ATEM was measured correctly from the start and is the second reference for
how it should be done: find the outermost extent of the rack ears in the
drawing, call that 0 and 1000, and place everything as a fraction of it.

### What the ATEM itself raised

- **Blackmagic publish no depth and no weight for any Constellation.** The tech
  specs say "Physical Installation: 1 Rack Unit Size" and stop. Both fields are
  absent rather than estimated.
- ~~**A device with no depth draws NOTHING in the side elevation.**~~ —
  **fixed in v1.14.0.** It draws a short dashed stub at reduced opacity, and
  says "depth not published" on hover. Dashed on purpose: the one thing it must
  not be mistaken for is a measured depth.
- **The 1 M/E Constellation HD is 2/3 rack width** — not full, not half. Same
  class of problem as the 1/3-rack Shure ANI4IN in §9c, and it is why only the
  2 M/E is in. It mounts in a Blackmagic Universal Rack Shelf.
- **Only the 2 M/E of eight.** The 4 M/E HD is 2U with **two** internal PSUs
  and BNC MADI in/out — the library has no device drawn with two mains inlets,
  so it would exercise something new. The 4K variants and the Constellation 8K
  are separate research again.
- **The talkback XLR is on the FRONT**, with an RJ45 marked `TALKBACK` on the
  rear for third-party intercom. `xlr5f` is a new primitive for it.
- **The source-button numerals are not drawn.** Twenty buttons across 1U puts
  them ~32 units apart and they turn to mush, same as §9's connector numbering.

## 8f. The Waves and Behringer pass — figures owed a check, and one device not entered

Five devices added in v1.11.1 from three Haiku research passes. By instruction
the figures were **not re-checked before entry** — same standing as the Pulse
4K (§8c) and the PDS-4K (§8d). These are the numbers that owe a manual pass:

- **Waves Titan / Titan-R** — 482 x 88 x 392 mm, 7.0 / 9.2 kg, 140 W.
- **Waves Extreme-C** — 221 x 86 x 284 mm, 3.4 kg, 65 W.
- **Behringer WING Rack** — 9.5 kg, 130 W typical, and the depth, on which see
  below.
- **Behringer S32** — 483 x 137 x 210 mm, 4.9 kg, from Thomann rather than
  Behringer.

### What each one is still missing

- **No Waves server has a panel figure.** Waves' A&E PDFs are schematic
  dimension drawings, so both faces are `auto`: right inventory, right sizes,
  invented order. The fronts carry a confirmed inventory (power button, two
  status LEDs, plus a PSU-fail LED on the Titan-R) at unconfirmed positions.
- **The SoundGrid port is drawn as etherCON and might be a plain RJ45.** Waves'
  A&E text names an "Ethercon connector" — a Neutrik locking shell, which draws
  quite differently from a bare RJ45 — but no figure confirms it, and RJ45 is
  the unsurprising fitting on a server. First thing to correct if wrong.
- **Waves publish no inlet type**, so the IEC is this library's assumption on
  all three, as it is on the Behringer S16.
- **`waves-extreme-c` is the first half-rack device taller than 1U.** All 28
  other half-rack entries are 1U. The half-panel renderers size on `U * ru` so
  it should scale, but nothing has ever exercised it — worth one look.
- **The WING Rack's width is a reconciliation, not a quoted figure.**
  Behringer's QSG says "Dimensions (H x W x D) 183 x 326 x 486 mm" on a product
  titled "Rackmount", and 326 mm is not a 19" panel. The QSG never says "19
  inch", "rack unit", "rack ear" or "RU", has no mounting section and no figure
  of it in a rack. The 4U height came from the user, not the document. One
  straight-on front photograph, or one line of Behringer's mounting
  instructions, settles both.
- **The WING Rack's phones count is 4 or 5** and Behringer say both, in the same
  document — the spec table says 5, the rear-panel text names four stereo pairs
  on outputs 1/2, 3/4, 5/6 and 7/8. Four are drawn.
- **No WING Rack XLR has a stated gender.** Inputs female, outputs male is this
  library's convention applied, not Behringer's word. `STAGECONNECT` is the
  softest: drawn male on nothing better than being named a host output.
- **The S32 has no panel at all**, on purpose. The inventory is known from
  retailers (2 x AES50, 2 x ADAT out, MIDI in/out, USB, one RJ45) but the FACE
  is not, and the S16 puts all its I/O on the front — unusual enough that
  assuming the S32 matches would be fitting the family grammar and calling it a
  spec. Also missing: XLR counts and genders, and any power figure.

### Behringer documentation is now hard to reach, and that is the real blocker

behringer.com renders its **Downloads tab client-side**, so the
`cdn-media.empowertribe.com` PDF links cannot be fetched without a browser, and
the hashed paths cannot be guessed. Two research passes and a browser attempt
failed on it; the WING Rack QSG was only obtained because a parallel pass
happened to surface one URL. **The way in, for next time: open the product page
in a real browser, copy the QSG and manual URLs out of the Downloads tab, and
hand those URLs to the research pass.** Fetching and parsing them is easy once
you have them.

### Not added at all

- **Behringer XR18, XR16 and XR12.** Nothing was obtained — not dimensions, not
  weight, not power, not whether they are 19"-rackmountable at all, which is
  the first question since some X AIR units are desktop boxes with optional
  ears. Blocked on the documentation problem above rather than skipped.
- **Waves Extreme Server, Proton Server and SoundGrid Server One-C** are
  discontinued, on the same grounds as Martin's MA series (§7) and the Pulse²
  (§8c).
- **Waves Axis One / Axis Scope** are computers rather than SoundGrid servers,
  and **DiGiGrid IOX / IOS** are interfaces. Out of scope rather than missing.

## 9. Smaller things

- Individual connector numbering on high-density panels (DX168 etc.) is dropped
  because it turns to mush at normal render size. Could re-add it and only show
  it above a zoom threshold.
- ~~**No undo.**~~ — **done in v1.14.0.** Ctrl/Cmd+Z, with Shift or Ctrl+Y to
  redo, 60 steps deep. It snapshots the whole project rather than recording
  per-action diffs: coarse, but every mutation already funnels through `save()`
  so it cannot miss one, and an undo that silently fails to cover some path is
  worse than none — you find out after the thing you wanted back is gone.
  Identical serialisations are not pushed, so typing in a name field does not
  fill the stack, and Ctrl+Z inside a text field is left to the browser.
- **Rack lights.** Nothing in the library lights a rack. Wanted: the 1U
  gooseneck/LED bar types that take a U of their own, and the clip-on lamps that
  do not. Note the Furman PL-8C and PL-PRO DMC already have retractable lamps
  built into the front panel — those are drawn as part of the conditioner, so a
  standalone light is a separate device, not a fix to those. Needs a decision on
  whether a clip-on lamp is a device at all, given it occupies no U.

## 9b. Connector detail still owed

- **The six VEAM sizes are ESTIMATES, and the only sized connectors here that
  are.** Added in v1.13.0 at the user's instruction: they regularly rack 8, 12,
  16, 24, 32 and 48 pin, and brands differ enough that no one published figure
  is correct, so these are a deliberate average rather than a spec.

  Derived as `cutout = 49.2 mm x sqrt(pins / 19)` and `flange = cutout x 1.22`.
  49.2 mm is the one hard datapoint obtained — the panel cutout of a VEAM VSC
  19-pin — and contacts pack into the shell's area, so the diameter goes as the
  square root of the count. The 1.22 is this library's existing 60 mm VEAM face
  over that cutout. The model returns 60.0 mm at 19 pins, which is exactly the
  number already in the library: **self-consistent, not verified.**

  This is now the third soft figure in the library after `ah-dl-io` and
  `displayport`, and by far the largest — twelve primitives rather than one.
  Unlike `ah-dl-io` it is NOT flagged by `check.mjs`, because that gate only
  inspects slot formats. **What replaces it: one dimensioned panel-cutout
  drawing per shell size, plus the pin-count-to-shell mapping** — the research
  pass got Amphenol's CIR catalogue but the insert-by-shell tables (pp. 26-34)
  extract too poorly to read, and one shell takes several pin arrangements.
  The contact ring layouts are drawing rather than data and a real insert may
  group its pins differently.

- **`displayport` is 24 mm DERIVED, not measured.** Added in v1.10.5 for the
  Analog Way Pulse 4K. The DP receptacles in Analog Way's own rear-panel
  photograph measure 1.15x the HDMI ones beside them in the same shot, and this
  library's `hdmi` is 21 mm. The check on it is that 1.15 is also the ratio of
  the two published receptacle widths — 16.10 mm DP against 14.0 mm HDMI Type A
  — so the photograph and the spec sheets agree. It is nonetheless the second
  figure in this library that is not from a drawing or a stated dimension, the
  other being `ah-dl-io`. Unlike that one it is **not** flagged by `check.mjs`,
  because the check gate only inspects slot formats. A dimensioned DisplayPort
  panel-cutout drawing would settle it.

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

- ~~**Dante, AES50, ULTRANET and control all read as one `network` family**~~ —
  **done in v1.11.0.** `dante`, `aes50`, `slink`, `gigaace`, `dx`, `ultranet`,
  `soundgrid` and `madi` are families of their own, declared with `sig` on the
  port exactly as AES3 is, and SLink patches to gigaACE / DX / dSnake without a
  crossing warning because it is a port type rather than a protocol. See the
  README.

  **What is NOT converted, and why:** 690 network sockets are still generic,
  because only sockets the manufacturer *names* were given a protocol. The ones
  worth chasing, in order of how much they would buy:

  - **Allen & Heath AudioRacks and expanders** — AR84, AR2412, AB168, DX168,
    DT168, DX32, GX4816 and the dLive MixRack rears. Every etherCON on them is
    declared bare. In reality a DT168 is Dante, a DX168 is DX, an AR is dSnake
    and a MixRack carries gigaACE and DX — but none of that is in the library
    as a socket name, and §5 already says the A&H rears want a pass from
    source. Do that pass and the protocols come with it.
  - **Midas DL16 / DL32** — AES50, unnamed.
  - **Sennheiser EW-DX EM 2 Dante / EM 4 Dante** — Dante, unnamed.
  - **DiGiCo** — the racks' network ports, and **Optocore**, which has no
    family yet because nothing in the library declares a port that speaks it.
    Adding the family with no members would be dead code.
  - **fibreACE (M-DL-GOPT)** is deliberately left as `network`. A&H's own
    naming treats gigaACE and fibreACE as two descendants of ACE, so calling
    the fibreACE card's ports `gigaace` would be a guess. One line of A&H
    documentation saying whether fibreACE *is* gigaACE over fibre settles it.
  - **`dsnake` has a place in the SLink superset but no family of its own**,
    for the same reason as Optocore: nothing declares it yet. Add the family in
    the same change as the A&H pass above.
- **SWP1 and GigaCore switch-port numbering is unverified**, so those ports use
  the `F EC 1` default. If someone has one in front of them, read the silkscreen
  and set `lbl`.
- **Focusrite RedNet, Ferrofish A32 Dante and RME Digiface Dante are absent.**
  Those brands were excluded during the stagebox pass; RedNet in particular is
  the canonical Dante interface range, so it is worth deciding whether that
  exclusion still stands.
- ~~**Shure ANI4IN / ANI4OUT are 1/3-rack width**, which the layout model has no
  concept of~~ — **the model exists now.** v1.12.0 added `widthMM`: a device
  declares its true width and draws centred with blanking plate either side.
  These are now a data job rather than a code one, as are the 2/3-rack ATEM
  1 M/E (§8e) and the Green-GO RDX and SI2WR (§4).

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
- ~~A cable cannot be labelled~~ — **done in v1.8.1.** Inline field per matrix
  row, shown in the wire's tooltip and second column of the CSV. Still not
  settable *from the canvas* — you go through the matrix — and there is no
  bulk/auto numbering, which is the other half of the same job.
- ~~**Nodes do not reflow when expanded**~~ — **done in v1.15.0.** Expanding a
  card pushes the neighbours it now overlaps downward by exactly the height it
  gained, cascading so a pushed node does not land on the next one. Only
  downward, only what actually collides, and only in the same column — a node
  off to the side is left alone, which is the whole difference from **Arrange**,
  which throws away every deliberate position to fix one card. Collapsing
  deliberately pulls nothing back up: closing a card would otherwise drag
  unrelated nodes around under the cursor.

  Found while doing it: **a fully expanded node lost its collapse button and
  could never be folded back.** The button rendered on `hidden > 0 || !open`,
  and once open `hidden` is 0 by definition. Pre-existing since the baseline
  commit, and contrary to the README, which has always documented "Hide unused
  folds it back to what's patched".
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

## 11. Requested, sized

Asked for on 2026-08-12, sized rather than scheduled. The scale is effort, not
importance:

| | Meaning |
|---|---|
| **S** | An hour or less. Known cause, known fix, no design decision. |
| **M** | Half a day. Some design, or a lot of data entry. |
| **L** | A day or more, or blocked on documentation nobody has yet. |
| **XL** | Needs a design pass before an estimate means anything. |

Data items are sized by **how hard the documentation is to get**, not by how
hard the typing is. That has been the binding constraint on every device added
so far, and it is why several entries below are L despite being simple code.

### S — cheap, do these first

- ~~**Naming IO in the edit dialog loses focus after every keystroke**~~ —
  **fixed in v1.8.1.** Not where it looked: the `input` event bubbles, and the
  form's own `oninput` was rebuilding the row being typed into.
- ~~**Side view ignores group colours**~~ — **fixed in v1.10.3.** The stripe
  sits at the rail rather than always on the left, so it follows the face a
  device is mounted to. Note for anyone drawing into that SVG next: colour has
  to go in an inline `style`, because a `fill=` presentation attribute loses to
  the `.sitem rect` rule and would have drawn silently wrong.
- ~~**Cables cannot be labelled**~~ — **done in v1.8.1.** Inline field per matrix
  row; shows in the wire tooltip, searchable, and now the second CSV column.
- **DM0 I/O Port count.** Blocked on documentation, not code — see §5. A&H's DM
  MixRack guide covers "3 sizes" and is silent on the DM0. One line of data once
  somebody can see one.

### Already built — check before costing

- **A cable spreadsheet with from/to already exists.** Flow view → **Cables** →
  **Export CSV**. Columns: Cable, Type, Source, Source socket, Source location,
  Target, Target socket, Target location, Note. The location columns give rack
  and U. If this is not what was wanted, the gap is worth stating precisely,
  because the export itself is done.

### M — a session each

- ~~**Other audio networking standards: SLink, gigaACE, AES50, Optocore**~~ —
  **done in v1.11.0**, by the first of the two routes that were on the table: a
  family per protocol, with SLink as a superset that patches to any of the
  things it can be. Chosen on 2026-08-15 as the more honest of the two about
  what will and will not connect, which is what the flow view is for.

  **"DigiACE" is settled: it does not exist**, confirmed the same day, and
  nothing was entered for it. For the record, since the name will come round
  again: ACE is *Allen & Heath's* — "Audio Control Ethernet", the ancestor of
  gigaACE and fibreACE, and the M-ACE card for iLive/GLD — and DiGiCo's own
  transports are Optocore and MADI, on DMI-OPTO and DMI-MADI-B/C cards.

  What shipped: eight families declared with `sig` on the port exactly as AES3
  is, and a `compatible()` relation in `flow.js` where SLink alone is a
  superset — "Mode automatically switches between dSnake/ME, DX and
  gigaACE/GX", so an SLink patched to a DX expander is a correct cable and not
  a crossing. DX to gigaACE still warns; only a port that can be either speaks
  to both.

  **What is left is a documentation problem, not a code one.** 690 network
  sockets are still generic because only sockets the manufacturer names were
  given a protocol — the Allen & Heath AudioRack rears are the big one. Listed
  in §9c.
- **Devices mounted inside the rack rather than on the ears.** Power supplies,
  routers, anything that lives in the box without taking a U. An `internal: true`
  item, excluded from U occupancy and from the bay layout, still counted in
  weight, power and depth, and placeable in the flow view. The ask was for the
  flow half only, which is the smaller part — but if an internal device is
  invisible in the rack views, people will forget it is in there and under-order
  power. Worth a strip or a count somewhere in the bay.
- ~~**Split `devices.js` into a folder**~~ — **done in v1.8.0.** One module per
  brand under `devices/`, with a hand-written index, as argued below. The
  bundler and dev server discover the folder rather than listing it. Data
  verified unchanged record by record.

### L — a day or more, or blocked on documentation

- **Harris frames and cards.** The option-card mechanism from v1.3.0 already
  covers this shape — a frame is a device with many slots, a card is a faceplate
  that fits one format. What makes it L is scale and sources: a broadcast frame
  carries 10–20 cards, so the slot layout needs to handle a row of apertures
  rather than one, and Harris/Imagine documentation is harder to reach than
  A&H's. Establish the frame's slot pitch from a real drawing before any of it,
  the same way the SQ aperture was measured.
- **Make placing IO genuinely intuitive.** Currently a uniform grid, which is
  honest but abstract — you place into cells, not onto a panel. Candidates:
  drag from a connector palette onto the preview itself, snap to the pitch of
  whatever is already on that row, arrow-key nudge, and drag-to-repeat for runs.
  This is the one item that should not be estimated until it is designed, so it
  is L as a placeholder and could be XL.

### XL — explicitly lowest priority

- **A library of external devices — consoles, PA, anything at the other end of
  the cable.** The flow view already takes ad-hoc external nodes with whatever
  sockets you give them; this is about not retyping a DiGiCo SD12's socket list
  every show. The cost is not the code, it is that every console added is
  another device researched to the same standard as the rack gear — and consoles
  have far more I/O than the boxes in here. Sized XL for that reason alone.
