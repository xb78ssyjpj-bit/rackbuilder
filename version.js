// Single source of truth for the version.
//
// tools/bundle.py reads it to name its output, the header shows it, and
// CHANGELOG.md has a heading per version. Bump it in the same commit as the
// change it describes — a version that lags the code is worse than none.
//
// Major   a change that breaks saved projects, or a rewrite of a whole view.
// Minor   new capability.
// Patch   fixes and data corrections only.
export const VERSION = '1.10.5';
