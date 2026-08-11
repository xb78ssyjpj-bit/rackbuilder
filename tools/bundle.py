#!/usr/bin/env python3
"""Bundle Rack Builder into a single self-contained HTML file.

The app is plain ES modules with no build step, which is lovely to work on and
awkward to hand to somebody: opening index.html from the filesystem fails
because module *imports* are blocked over file://. So this inlines the CSS and
concatenates the four modules, in dependency order, into one inline
<script type="module"> — an inline module fetches nothing, so it runs happily
from a double-clicked file, a USB stick or a static host.

Output is VERSIONED, from version.js:

  dist/rackbuilder-v1.1.0.html        complete document; open it directly
  dist/rackbuilder-v1.1.0.body.html   body content only, for hosts that supply
                                      their own <!doctype>/<head>/<body>
  dist/rackbuilder-latest.html        a copy of the newest complete document

The version is in the filename on purpose: handing somebody "rackbuilder.html"
twice, a week apart, gives them two different programs with the same name and no
way to tell which is which. `-latest` exists for anyone who just wants the
newest and does not care about the number.

Every export is `export const` or `export function`, so stripping is honest:
drop the import blocks, drop the `export ` keyword, and the four files share one
module scope. Duplicate top-level names would be a syntax error, which is
exactly the check we want — run `node --check` on the output.

    python3 tools/bundle.py
"""

import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
# Dependency order: panel defines the geometry everything else imports.
MODULES = ['version.js', 'panel.js', 'devices.js', 'flow.js', 'app.js']

IMPORT_RE = re.compile(
    r"^import\s+(?:\{[^}]*\}|[\w*\s,]+)\s+from\s+'[^']+';\s*$",
    re.MULTILINE | re.DOTALL,
)
EXPORT_RE = re.compile(r"^export\s+(const|let|var|function|class|async)\b",
                       re.MULTILINE)


def strip_module(src: str, name: str) -> str:
    """Remove import statements and the `export` keyword."""
    src, n_imp = IMPORT_RE.subn('', src)
    src, n_exp = EXPORT_RE.subn(r'\1', src)
    if re.search(r"^\s*export\s*[{*]", src, re.MULTILINE):
        sys.exit(f'{name}: re-export / export-list form is not handled — '
                 'convert it to `export const` or extend this script')
    if re.search(r"^\s*import\b", src, re.MULTILINE):
        sys.exit(f'{name}: an import survived stripping — check its formatting')
    print(f'  {name}: {n_imp} imports removed, {n_exp} exports unwrapped')
    return src.strip('\n')


def main() -> None:
    # version.js is the source of truth and is also shipped as a module, so it
    # is read rather than duplicated here.
    m = re.search(r"VERSION\s*=\s*'([^']+)'", (ROOT / 'version.js').read_text())
    if not m:
        sys.exit('version.js: could not find VERSION')
    version = m.group(1)
    print(f'bundling Rack Builder v{version}')
    css = (ROOT / 'styles.css').read_text()
    html = (ROOT / 'index.html').read_text()

    parts = []
    for name in MODULES:
        parts.append(f'// ===== {name} '
                     + '=' * max(0, 66 - len(name)))
        parts.append(strip_module((ROOT / name).read_text(), name))
    js = '\n\n'.join(parts)

    # The document shell is index.html with the two external references swapped
    # for their contents. Everything between <body> and the script tag is kept
    # verbatim so the markup only ever lives in one place.
    body = html.split('<body>', 1)[1].rsplit('</body>', 1)[0]
    body = body.replace('<script type="module" src="app.js"></script>', '')
    banner = (f'<!-- Rack Builder v{version} — self-contained build. Generated '
              'by tools/bundle.py; edit the source modules, not this file. -->')

    page_body = (f'{banner}\n<style>\n{css}\n</style>\n'
                 f'{body.strip()}\n<script type="module">\n{js}\n</script>\n')

    doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
           f'<title>Rack Builder v{version}</title>\n</head>\n<body>\n'
           f'{page_body}</body>\n</html>\n')

    out = ROOT / 'dist'
    out.mkdir(exist_ok=True)
    doc_name = f'rackbuilder-v{version}.html'
    (out / doc_name).write_text(doc)
    (out / f'rackbuilder-v{version}.body.html').write_text(page_body)
    # A stable name for "give me the newest", alongside the numbered one.
    shutil.copyfile(out / doc_name, out / 'rackbuilder-latest.html')

    kb = len(doc) / 1024
    print(f'  dist/{doc_name}  {kb:,.0f} KB')
    print(f'  dist/rackbuilder-v{version}.body.html  '
          f'{len(page_body) / 1024:,.0f} KB')
    print(f'  dist/rackbuilder-latest.html  (copy of v{version})')
    # Plain `node --check` parses as CommonJS and will pass a module that
    # cannot load — it proves nothing here. `--input-type=module` does.
    print('verify with:')
    print("  python3 -c \"import pathlib,sys;"
          "h=pathlib.Path('dist/rackbuilder-latest.html').read_text();"
          "sys.stdout.write(h.split(chr(60)+'script type=\\\"module\\\">')[1]"
          ".split(chr(60)+'/script>')[0])\" | node --input-type=module --check")
    print('  node tools/check.mjs')


if __name__ == '__main__':
    main()
