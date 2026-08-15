#!/usr/bin/env python3
"""Cut a release: bump the version, build, tag, and publish to GitHub.

    python3 tools/release.py patch      1.1.0 -> 1.1.1   fixes, data corrections
    python3 tools/release.py minor      1.1.0 -> 1.2.0   new capability
    python3 tools/release.py major      1.1.0 -> 2.0.0   breaks saved projects
    python3 tools/release.py --dry-run minor            show what would happen

What it does, in order:

  1. Refuses to run on a dirty tree. A release has to correspond to a commit
     somebody can check out, so uncommitted work is a hard stop rather than
     something to quietly sweep in.
  2. Runs tools/check.mjs. A release that fails the checks is worse than no
     release, because it looks official.
  3. Bumps version.js, builds dist/, and confirms the bundle parses as a module.
  4. Requires a CHANGELOG.md heading for the new version, written by hand.
     Generating one from commit subjects produces something nobody reads; the
     point of the changelog is the *why*, which only a person can write.
  5. Commits, tags, pushes, and creates the GitHub release with the standalone
     build attached — so the collaborator downloads one file and knows exactly
     which version it is.
  6. Opens the published Pages URL and proves the site is actually serving the
     new version. Pass --no-pages to skip it.

Needs `gh` installed and `gh auth login` already done. Without it, everything up
to the push still runs and it tells you what is left.
"""

import pathlib
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True, **kw)


def die(msg):
    sys.exit(f'\n  STOP: {msg}\n')


def read_version():
    m = re.search(r"VERSION\s*=\s*'([^']+)'", (ROOT / 'version.js').read_text())
    if not m:
        die('version.js: no VERSION found')
    return m.group(1)


def bump(version, part):
    major, minor, patch = (int(x) for x in version.split('.'))
    if part == 'major':
        return f'{major + 1}.0.0'
    if part == 'minor':
        return f'{major}.{minor + 1}.0'
    return f'{major}.{minor}.{patch + 1}'


def fetch(url, timeout=15):
    """(status, body). An HTTP error is a status, not an exception — a 404 is
    the answer we are looking for, not a crash."""
    req = urllib.request.Request(url, headers={'Cache-Control': 'no-cache'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except Exception:
        return 0, ''


def verify_pages(new, wait=180):
    """Open the published site and prove it is there, and that it is the new one.

    THIS EXISTS BECAUSE TWO DIFFERENT PAGES FAILURES HAVE SHIPPED UNNOTICED.

    v1.10.4: the site loaded, but `devices/_lib.js` returned 404 — Jekyll
    strips underscore-prefixed files, and four releases went out over the top
    of it. v1.11.0: the site was not served at all, and the release before it
    had already stopped deploying.

    Every deployment reported success both times, because the deploy genuinely
    did succeed: it published a directory. A green tick is a claim about the
    upload, not about whether the page loads. The only thing that catches
    either failure is fetching the URL, which is what this does.

    Two questions, because one does not imply the other:
      - is it the NEW version? (a stale deploy answers 200 all day)
      - does EVERY module load? (v1.10.4 was a 200 root and one missing file)

    Nothing here can fail the release — that has already happened by this point
    — but it will not let a broken site pass quietly either.
    """
    r = run(['gh', 'api', 'repos/:owner/:repo/pages', '--jq', '.html_url'])
    if r.returncode or not r.stdout.strip():
        print('  no GitHub Pages site configured — published check skipped')
        return
    base = r.stdout.strip().rstrip('/')
    print(f'  checking {base}')

    # Wait for the deploy. version.js is the honest staleness test: it carries
    # the number, so a cached or half-finished deploy cannot fake it.
    deadline, tries, status = time.time() + wait, 0, 0
    while True:
        tries += 1
        status, body = fetch(f'{base}/version.js?_rc={tries}')
        if status == 200 and f"'{new}'" in body:
            break
        if time.time() > deadline:
            served = re.search(r"VERSION\s*=\s*'([^']+)'", body)
            why = (f'it is still serving v{served.group(1)}' if served
                   else f'version.js returned HTTP {status or "no response"}')
            warn(f'the release is published, but the SITE is not serving it —\n'
                 f'  {why}, after waiting {wait}s.\n\n'
                 f'  {base}\n\n'
                 f'  Check that Actions is enabled for the account and that\n'
                 f'  Settings -> Pages -> Source is set to GitHub Actions.')
            return
        time.sleep(10)

    # Every module the app imports, discovered the same way the dev server
    # discovers them — so a new brand file cannot quietly escape the check.
    sys.path.insert(0, str(ROOT))
    import serve                                          # noqa: E402
    bad = []
    for a in ['index.html'] + serve.assets():
        st, _ = fetch(f'{base}/{a}?_rc=v{new}')
        if st != 200:
            bad.append(f'{a} -> HTTP {st or "no response"}')
    if bad:
        warn('the site is serving the new version, but files are MISSING:\n\n  '
             + '\n  '.join(bad)
             + '\n\n  This is the v1.10.4 failure. If a name starts with "_",\n'
               '  something is running the tree through Jekyll again.')
        return
    print(f'  published site is live on v{new} — '
          f'{len(serve.assets()) + 1} files checked')


def warn(msg):
    line = '  ' + '-' * 68
    print(f'\n{line}\n  WARNING: {msg}\n{line}\n')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry-run' in sys.argv
    part = args[0] if args else 'patch'
    if part not in ('major', 'minor', 'patch'):
        die(f'unknown bump "{part}" — use major, minor or patch')

    old = read_version()
    new = bump(old, part)
    print(f'\n  Rack Builder  {old} -> {new}  ({part})\n')

    # 1. clean tree
    if run(['git', 'status', '--porcelain']).stdout.strip():
        die('working tree is dirty. Commit or stash first — a release has to '
            'point at a commit somebody can check out.')

    # 2. checks
    print('  running tools/check.mjs')
    r = run(['node', 'tools/check.mjs'])
    if r.returncode:
        print(r.stdout, r.stderr)
        die('checks failed. Fix them before releasing.')
    print('   ', r.stdout.strip().splitlines()[-1])

    # 3. changelog entry, written by a human, before anything is changed
    changelog = (ROOT / 'CHANGELOG.md').read_text()
    if f'## v{new}' not in changelog:
        die(f'CHANGELOG.md has no "## v{new}" heading.\n'
            f'         Write the entry first — what changed and why. That is the '
            f'part\n         your collaborator actually reads.')

    if dry:
        print(f'\n  --dry-run: would bump to {new}, build, commit, tag and '
              f'publish.\n')
        return

    # 4. bump + build
    vfile = ROOT / 'version.js'
    vfile.write_text(vfile.read_text().replace(f"VERSION = '{old}'",
                                               f"VERSION = '{new}'"))
    print(f'  version.js -> {new}')

    r = run([sys.executable, 'tools/bundle.py'])
    if r.returncode:
        print(r.stdout, r.stderr)
        die('bundle failed')
    print('  built dist/')

    # the bundle must parse as a module, not as CommonJS
    doc = (ROOT / 'dist' / f'rackbuilder-v{new}.html').read_text()
    js = doc.split('<script type="module">', 1)[1].rsplit('</script>', 1)[0]
    r = subprocess.run(['node', '--input-type=module', '--check'],
                       input=js, text=True, capture_output=True)
    if r.returncode:
        print(r.stderr)
        die('the built bundle does not parse as a module')
    print('  bundle parses')

    # 5. commit, tag
    run(['git', 'add', '-A'])
    r = run(['git', 'commit', '-m', f'Release v{new}'])
    if r.returncode:
        print(r.stdout, r.stderr)
        die('commit failed')
    run(['git', 'tag', '-a', f'v{new}', '-m', f'v{new}'])
    print(f'  committed and tagged v{new}')

    # 6. push + GitHub release
    if not shutil.which('gh'):
        print('\n  gh not installed — commit and tag are local. To publish:\n'
              f'    git push && git push origin v{new}\n')
        return
    if run(['gh', 'auth', 'status']).returncode:
        print('\n  gh is installed but not signed in. Run:\n'
              '    gh auth login\n'
              f'  then:  git push && git push origin v{new}\n')
        return
    if not run(['git', 'remote', 'get-url', 'origin']).stdout.strip():
        print('\n  No "origin" remote yet. Create the repo, then:\n'
              f'    git push -u origin main && git push origin v{new}\n')
        return

    print('  pushing')
    for cmd in (['git', 'push'], ['git', 'push', 'origin', f'v{new}']):
        r = run(cmd)
        if r.returncode:
            print(r.stderr)
            die('push failed')

    # The release notes are this version's changelog section, verbatim.
    section = changelog.split(f'## v{new}', 1)[1].split('\n## ', 1)[0]
    notes = f'## v{new}{section}'.strip()
    asset = ROOT / 'dist' / f'rackbuilder-v{new}.html'
    r = run(['gh', 'release', 'create', f'v{new}', str(asset),
             '--title', f'v{new}', '--notes', notes])
    if r.returncode:
        print(r.stderr)
        die('gh release failed — the tag is pushed, so you can retry just the '
            'release step')
    print(f'  published: {r.stdout.strip()}')

    # 7. the published site — the step whose absence let two outages ship
    if '--no-pages' in sys.argv:
        print('  --no-pages: published site not checked')
    else:
        verify_pages(new)

    print(f'\n  Done. Your collaborator downloads rackbuilder-v{new}.html from '
          f'the release.\n')


if __name__ == '__main__':
    main()
