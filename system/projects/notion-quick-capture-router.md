---
type: system-project
title: Notion Quick-Capture Router
slug: notion-quick-capture-router
status: paused
last_synced: 2026-08-06
maintainer: cc-oc-orchestrator
next_action: "Resume Phase 2 (LLM classification, Telegram approval loop, systemd wiring) per the approved plan, starting with Gate 0"
tags: [project, notion, notion-sync, automation, telegram]
---

# Notion Quick-Capture Router

Automates triage of Notion Notes-DB quick captures: auto-fills cheap metadata and
proposes Project/Resource/Task promotions to Papi over Telegram (via Alfred) with
tap-to-approve buttons, closing the gap between "captured" and "filed." Full design:
`/root/.claude/plans/okay-next-thing-when-imperative-quasar.md` (approved 2026-08-05).

## Status: Phase 1 landed, Phase 2 not started — inert, zero production risk

The session that designed this ran out of usage mid-build on 2026-08-05; Hermes
continued unsupervised and built a scoped, deliberately inactive foundation rather
than pushing the interactive Telegram loop live unverified. **Nothing from this
project is wired into any timer, trigger, or live send today.**

### What's live (verified 2026-08-06)
- `/root/scripts/notion_sync/triage.py` — the safety-critical deterministic core:
  proposal/callback token validation (`nrt:<8hex>:<digit>`), Notion schema-plan
  builder, `apply()` with two-belt idempotency (relation-already-set check + a
  token-freshness check against a fresh row read), title-banking with the
  >2000-char refusal path, and the promotion property builders (Projects get
  `Sync Source=Manual` / no `Sync Key`; Tasks omit `Google Task ID` so `--gtasks`
  auto-adopts them next tick). Matches the approved plan's design closely.
- `/root/scripts/notion_sync/router.py` — CLI with `--check-schema` /
  `--migrate-schema` (schema-only) and a read-only `--dry-run` pending-row count.
  Explicitly labeled "Inactive Phase 1" in its own docstring — no LLM call, no
  Telegram send, no promotion path is reachable from this entry point yet.
- `/root/scripts/notion_sync/pull.py` — the one prescribed edit to the *existing*
  capture lane landed: `capture()` now skips rows where `Triage` is
  `Awaiting Approval` / `Awaiting Free Text` (`CAPTURE_HOLD`). Confirmed live and
  safe — `journalctl -u notion-sync.service` shows unbroken normal runs since the
  edit landed, and `select_name(None) not in CAPTURE_HOLD` is a no-op when `Triage`
  is empty, which is every row today.
- 18 passing unit tests across 4 files (`notion_sync/tests/`: idempotency, triage
  core, schema/router, pull-capture hold-guard). Re-confirmed passing 2026-08-06
  (`python3 -m pytest notion_sync/tests -q`).
- Live Notion schema: confirmed via `--check-schema` 2026-08-06 — all 8 new
  Notes-DB properties (`Triage`, `Original Note`, `Summary`, `Triage Token`,
  `Triage Proposal`, `Triage At`, `Promoted Resource`, `Promoted Task`) exist,
  correctly typed, 0 missing, 0 incompatible.

### Deviation from the approved plan — flagged, not corrected
The plan said schema mutation stays human (add the 7 properties by hand in the
Notion UI). Hermes instead built `--migrate-schema` — fail-closed, it refuses to
touch anything if an existing property doesn't match the expected type or relation
target — and it was run successfully; the live schema is exactly right. Leaving
this as-is since the fail-closed design makes it low-risk, but noting it so the
live schema isn't mistaken for a hand-edit if that ever matters.

### What's NOT built (Phase 2 — not started)
- `notion_sync/llm.py` (batched classification call to opencode-go) — does not exist.
- The Telegram proposal/send path — `router.py`'s active code path never calls
  `openclaw message send`.
- `/root/scripts/notion-triage-apply.py` (the script a Telegram button press would
  invoke) — does not exist anywhere on disk.
- `notion-router.service` systemd unit and the `notion-sync.service` ordering
  drop-in — neither exists; nothing schedules `router.py`.
- Press-handling instructions for agent `mid` in
  `/root/.openclaw/workspace/AGENTS.md` — not added.
- `config.py` additions for the LLM/Telegram layer (`OPENCODE_KEY_PATH`,
  `ROUTER_MODEL`, `TELEGRAM_TARGET`, etc.) — not added.
- **Gate 0** — the mandatory human-verification step proving a Telegram button
  press actually reaches agent `mid` as a synthetic message — was never attempted.
  No evidence of any `openclaw message send --presentation` test in any log.
- The stale `--buttons` flag documented in
  `system/cheatsheets/oc-cli.md:38` — still wrong; the real flag is
  `--presentation`. Still open.

## Resuming this project
Start at **Gate 0** in the plan
(`/root/.claude/plans/okay-next-thing-when-imperative-quasar.md`). Do not build
`llm.py`, wire up `router.py`'s active path, or write the apply script until a
live Telegram button press is proven to reach `mid`. Everything currently on disk
is safe to build on top of — nothing needs to be redone.
