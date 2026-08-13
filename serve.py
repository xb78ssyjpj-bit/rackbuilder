#!/usr/bin/env python3
"""Static server for Rack Builder.

Browsers cache CSS and ES modules hard enough that `Cache-Control: no-store`
alone is not reliable — a stale styles.css or a stale panel.js against a fresh
app.js produces silently wrong layout, or "does not provide an export named ...".

So this server stamps a version token onto every reference to a local asset, in
both the HTML and inside the JS modules themselves. The token is the newest
mtime across the source files, so editing any one of them changes every URL and
the cache cannot serve you yesterday's file.

    python3 serve.py [port]        # default 4180
"""
import http.server
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def assets():
    """Every local file whose staleness would break the app.

    Discovered, not listed: the device library is a folder of one file per
    brand, and a hardcoded list would go stale the first time somebody added a
    manufacturer — silently, by serving them a cached copy of the file they had
    just edited, which is the exact failure this server exists to prevent.
    """
    out = ['styles.css', 'app.js', 'panel.js', 'devices.js', 'flow.js',
           'version.js']
    devs = os.path.join(ROOT, 'devices')
    if os.path.isdir(devs):
        out += [f'devices/{n}' for n in sorted(os.listdir(devs))
                if n.endswith('.js')]
    return [a for a in out if os.path.isfile(os.path.join(ROOT, a))]


# Any quoted relative .js/.css reference: "app.js", './panel.js',
# '../panel.js', './devices/qsc.js'. Resolved against the file being served
# rather than matched by name, because a brand file reaches its neighbours as
# './_lib.js' and the geometry as '../panel.js' — neither of which looks like
# the path from the root that a name list would hold.
REF_RE = re.compile(r'''(["'])((?:\.{1,2}/)*[\w./-]+\.(?:js|css))\1''')


def stamp(body, base_dir, tok):
    def sub(m):
        q, ref = m.group(1), m.group(2)
        target = os.path.normpath(os.path.join(base_dir, ref))
        # Only stamp things that actually exist under the root. A device's
        # `src:` URL is absolute and never matches; anything else that does not
        # resolve to a real file is left alone rather than guessed at.
        if os.path.commonpath([ROOT, target]) != ROOT or not os.path.isfile(target):
            return m.group(0)
        return f'{q}{ref}?v={tok}{q}'
    return REF_RE.sub(sub, body)


def version_token():
    times = [os.path.getmtime(os.path.join(ROOT, a)) for a in assets()]
    return str(int(max(times))) if times else '0'


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path in ('/', ''):
            path = '/index.html'
        local = os.path.join(ROOT, path.lstrip('/'))

        if os.path.isfile(local) and local.endswith(('.html', '.js')):
            tok = version_token()
            with open(local, 'rb') as fh:
                body = fh.read().decode('utf-8')
            body = stamp(body, os.path.dirname(local), tok)
            data = body.encode('utf-8')
            ctype = 'text/html; charset=utf-8' if local.endswith('.html') \
                else 'text/javascript; charset=utf-8'
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        super().do_GET()

    def log_message(self, fmt, *args):
        pass          # quiet; errors still surface as exceptions


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4180
    os.chdir(ROOT)
    print(f'Rack Builder on http://localhost:{port}  (assets versioned per edit)')
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
