---
type: system-cheatsheet
title: Operating Rules (standing feedback)
slug: operating-rules
last_synced: 2026-05-21
maintainer: cc-oc-orchestrator
source: CC auto-memory (feedback entries)
tags: [ops, rules, feedback, shared-brain]
---

# Operating Rules

Standing rules distilled from real sessions. Apply by default — they bind CC,
Codex, and OpenClaw equally (and Hermes once installed).

## Messaging & OC interaction
- **Telegram: use `openclaw message send`, never `agent --deliver`.** `agent`
  spins a ~60s inference turn and can lock sessions; `message send` is a ~10s
  direct relay. Chat ID 1207164084. See `system/cheatsheets/oc-cli`.
- **Read the OC CLI cheatsheet before any `openclaw` command.** Hard gate — no
  exceptions, even if you think you remember the syntax.

## Dispatch & verification
- **OC main can self-orchestrate multi-phase specs (3+ phases).** Dispatch the
  whole spec to `main` with pre-approved handoffs + a `.progress` file instead of
  CC driving each phase (~10k tokens / ~3× faster). Not for single-phase work or
  phases needing CC judgment between them.
- **Kimi (`grunt`) has a weak clock.** Its `.done` timestamps can be months off.
  Hardcode dates in the task prompt and tell it to copy verbatim, or verify with
  `stat -c %y`.
- **Verification checks must match unique content text**, not numeric prefixes or
  assumed file/process structure. Use `pgrep -af <name>` not `systemctl is-active`
  unless the target is confirmed a systemd unit (OpenClaw runs many plain
  processes). Prefer `>= N` over `== N` for counts that can grow.
- **Check systemd state before dispatching run-type tasks** on any project with a
  `systemd/` dir — a live timer can silently race your work.

## Session hygiene
- **Manage OC main's context proactively.** Don't ask every session, but check
  OC main's context % before a heavy/multi-phase dispatch, and recommend `/clear`
  (not `/compact`) after a multi-phase spec completes — disk state is canonical.

## Project guardrails
- **Never suggest reviving the Inventory Tracker / Inventory Dashboard.** User
  retired it permanently (2026-04-27); treat as if it never existed. The Orders
  Dashboard (spec 42) is the reference implementation for any future dashboard.
- **The `notion/` mirror is not reference material.** It is a one-way sink of the
  user's Notion workspace. Touch it only when changing Notion itself or adding new
  info destined for Notion. Exclude it from context greps
  (`--exclude-dir=notion`). The `system/skills/notion-*` docs are NOT part of the
  mirror and remain readable.
- **Every vault-touching spec ends with git commit + push** (`git pull --rebase`
  first; never force-push / reset --hard / checkout --theirs). Local-only edits
  drift the VPS/GitHub/Mac trio apart.
