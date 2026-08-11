#!/usr/bin/env python3
"""Turn NetBox devicetype-library YAML into Rack Builder device entries.

The NetBox devicetype-library (github.com/netbox-community/devicetype-library)
is CC0-1.0 — public domain — and carries ~5,600 device definitions with the
things this app needs: rack units, weight, power draw and a full interface list.

It ALSO ships front/rear elevation photographs. Those are deliberately NOT used:
they are raster images, and this app draws line art at true connector size. A
photo pasted into a rack elevation would clash with every other panel and would
not scale, print or export with the rest of the drawing. So we take the specs
and re-draw the panel with the app's own renderer.

    python3 tools/netbox-import.py <path-to-devicetype-library> Netgear/M4350-24G4XF.yaml ...

Prints device entries on stdout for pasting into devices.js.

What it can and cannot know:
  * Interface counts and types are exact.
  * Weight and maximum power draw are exact when the YAML records them.
  * Depth is NOT in the schema — NetBox only records `is_full_depth` as a
    boolean, so depth comes out as a bracket (full ~450 mm / short ~250 mm) and
    is flagged approx. Correct it by hand if it matters for a front/rear clash.
  * Which FACE the ports are on is not in the schema either. Access switches put
    them on the front, which is what is assumed here; check anything unusual.
"""
import sys
import pathlib
import yaml

# NetBox interface type -> our primitive. Anything unmatched is counted and
# reported rather than silently dropped.
def prim_for(t):
    t = (t or '').lower()
    if 'qsfp' in t:
        return 'qsfp'
    if 'sfp' in t or 'base-x' in t:
        return 'sfp'
    if 'base-t' in t or 'base-tx' in t:
        return 'rj45'
    return None


def slug(manufacturer, model):
    keep = []
    for ch in f'{manufacturer}-{model}'.lower():
        if ch.isalnum():
            keep.append(ch)
        elif keep and keep[-1] != '-':
            keep.append('-')
    return ''.join(keep).strip('-')


# A management / out-of-band port is a physically separate socket on the face,
# not part of the numbered port block — counting it in gives a 24-port switch 25
# ports and throws the two-row split out. The schema flags most of them with
# `mgmt_only`; the name check catches the ones that don't set it.
def is_mgmt(iface):
    if iface.get('mgmt_only'):
        return True
    n = (iface.get('name') or '').lower()
    return 'oob' in n or 'mgmt' in n or 'management' in n


def convert(path):
    d = yaml.safe_load(pathlib.Path(path).read_text())
    counts = {'rj45': 0, 'sfp': 0, 'qsfp': 0}
    mgmt = 0
    unknown = {}
    for i in d.get('interfaces') or []:
        p = prim_for(i.get('type'))
        if not p:
            unknown[i.get('type')] = unknown.get(i.get('type'), 0) + 1
        elif is_mgmt(i):
            mgmt += 1
        else:
            counts[p] += 1

    weight = d.get('weight')
    if weight and (d.get('weight_unit') or 'kg').lower() in ('lb', 'lbs', 'pound'):
        weight = round(weight * 0.4536, 1)

    power = None
    for p in d.get('power-ports') or []:
        if p.get('maximum_draw'):
            power = max(power or 0, p['maximum_draw'])

    ru = d.get('u_height') or 1
    full = d.get('is_full_depth')
    depth = 450 if full else 250

    man, model = d['manufacturer'], str(d['model'])
    fields = [
        f"id: '{slug(man, model)}'",
        f"brand: '{man}'",
        f"model: {js_str(model)}",
        "category: 'network'",
        f"ru: {int(ru)}",
        f"depth: {depth}",
    ]
    if weight:
        fields.append(f'weight: {weight}')
    if power:
        fields.append(f'power: {power}')
    fields.append('approx: true')

    if mgmt:
        counts['mgmt'] = mgmt
    ports = ', '.join(
        f'{k}: {v}' for k, v in counts.items() if v
    )
    out = [f'  {{ {fields[0]}, {fields[1]},']
    out.append(f'    {fields[2]}, {fields[3]},')
    out.append('    ' + ', '.join(fields[4:]) + ',')
    out.append(f"    front: switchFront({{ {ports}, brand: '{man}', "
               f'model: {js_str(model)} }}),')
    out.append('    rear: { auto: [{ t: \'iec_in\', n: 1 }] } },')
    note = ''
    if unknown:
        note = '   // unmapped interfaces: ' + ', '.join(
            f'{k} x{v}' for k, v in unknown.items())
    return '\n'.join(out) + note


def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    root = pathlib.Path(sys.argv[1]) / 'device-types'
    for rel in sys.argv[2:]:
        print(convert(root / rel))
