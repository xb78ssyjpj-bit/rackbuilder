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

Needs `gh` installed and `gh auth login` already done. Without it, everything up
to the push still runs and it tells you what is left.
"""

import pathlib
import re
import shutil
import subprocess
import sys

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
    print(f'\n  Done. Your collaborator downloads rackbuilder-v{new}.html from '
          f'the release.\n')


if __name__ == '__main__':
    main()
