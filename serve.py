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

ASSETS = ('styles.css', 'app.js', 'panel.js', 'devices.js')
# "app.js"  ./panel.js'  "styles.css"  — quoted, optional ./ prefix, no existing query
ASSET_RE = re.compile(
    r'(["\'])(\./)?(' + '|'.join(a.replace('.', r'\.') for a in ASSETS) + r')\1'
)
ROOT = os.path.dirname(os.path.abspath(__file__))


def version_token():
    times = [os.path.getmtime(os.path.join(ROOT, a))
             for a in ASSETS if os.path.exists(os.path.join(ROOT, a))]
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
            body = ASSET_RE.sub(
                lambda m: f'{m.group(1)}{m.group(2) or ""}{m.group(3)}?v={tok}{m.group(1)}',
                body,
            )
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
