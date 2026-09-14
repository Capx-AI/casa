#!/bin/sh
root="${CLAUDE_PLUGIN_ROOT:-}"
[ -d "$root/capx" ] || exit 0
# find company-brain in cwd
[ -d company-brain ] || exit 0
node "$root/capx/autopush.mjs" company-brain || true
