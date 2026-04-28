#!/usr/bin/env bash
# Pulls /root/obsidian-vault from origin/main with --rebase.
# Pull-only — does not commit, does not push, does not auto-resolve.
# On rebase conflict: aborts cleanly, exits non-zero, logs to journal.
set -uo pipefail

VAULT=/root/obsidian-vault
cd "$VAULT" || { echo "vault dir missing"; exit 2; }

# Skip if a rebase is already in progress (another invocation, manual ops)
if [[ -d "$VAULT/.git/rebase-merge" || -d "$VAULT/.git/rebase-apply" ]]; then
  echo "rebase already in progress — skipping this tick"
  exit 0
fi

# Capture state before pull
BEFORE=$(git rev-parse HEAD)

# Pull. If rebase conflicts, abort and exit non-zero.
if ! git pull --rebase --no-edit origin main; then
  echo "pull --rebase failed — aborting rebase"
  git rebase --abort 2>/dev/null || true
  exit 3
fi

AFTER=$(git rev-parse HEAD)
if [[ "$BEFORE" == "$AFTER" ]]; then
  echo "no changes (already up-to-date)"
else
  echo "pulled: $BEFORE -> $AFTER"
fi