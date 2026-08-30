#!/usr/bin/env sh
# Capx Casa SessionStart advisor.
# Prints the current company status and next action before the first turn.
# Dependency-free on purpose (no jq). Reads a plain-text snapshot the router keeps.

NOW="company-brain/NOW.md"

printf '\n=== Capx Casa ===\n'
if [ -f "$NOW" ]; then
  cat "$NOW"
  printf '\nRun /casa to open your session. /casa-help shows everything else.\n'
else
  printf 'No company in this directory yet.\n'
  printf 'Run /casa-start to set up your company, whether it is an idea or already running.\n'
fi
printf '=================\n\n'
exit 0
