---
type: system-project
title: Notion Quick-Capture Router
slug: notion-quick-capture-router
status: active
last_synced: 2026-08-09
maintainer: hermes
next_action: "Observe the first real pending Note and perform the approval-gated live promotion test if a Project/Resource/Task proposal appears"
tags: [project, notion, notion-sync, automation, telegram]
---

# Notion Quick-Capture Router

Automates triage of Notion Notes-DB quick captures: auto-fills cheap metadata and
proposes Project/Resource/Task promotions to Papi over Telegram (via Alfred) with
tap-to-approve buttons, closing the gap between "captured" and "filed." Full design:
`/root/.claude/plans/okay-next-thing-when-imperative-quasar.md` (approved 2026-08-05).

## Status: production-active, fully built and tested

Phase 1 (deterministic core + schema) landed via an unsupervised Hermes handoff on
2026-08-05. The rest of Phase 2 (LLM classification, Telegram approval loop, apply
script, systemd wiring) was completed and independently verified. Production
scheduling was activated on 2026-08-09 after the schema, test, approval-model,
dry-run, service-ordering, and zero-pending canary gates passed.

### What's live and verified (2026-08-09)
- `notion_sync/triage.py` — deterministic core: proposal/callback token validation
  (`nrt:<8hex>:<digit>`), schema-plan builder, `apply()` with two-belt idempotency,
  title-banking with the >2000-char refusal path, promotion property builders
  (`Sync Source=Manual`, Tasks omit `Google Task ID` so `--gtasks` auto-adopts
  them), and `find_by_token()` (added 2026-08-06 — the apply script's only way to
  resolve a bare Telegram callback token back to a Notion row).
- `notion_sync/llm.py` — direct stdlib HTTPS client to opencode-go
  (`https://opencode.ai/zen/go/v1`, model `deepseek-v4-flash`), OpenAI-compatible
  chat-completions call with 429/5xx retry/backoff, fence-tolerant JSON-array
  extraction. No agent, no session, no lock file.
- `notion_sync/router.py` — now fully active: `classify()` (one batched LLM call,
  validates every field against live Area/Note-Type options — never trusts the
  model, never invents an Area), `_apply_metadata()` (auto-file path for
  `kind=="note"`), `propose()` (writes `Awaiting Approval` + sends the Telegram
  presentation, asserting every `callback_data` is ≤64 bytes before sending),
  `expire()` (24h sweep), `run()` (one full tick, `ROUTER_MAX_PROPOSALS=8` cap
  with graceful downgrade-to-auto-file on overflow). Still has `--check-schema` /
  `--migrate-schema` / `--dry-run` / `--no-send` from Phase 1.
- `notion-triage-apply.py` — the deterministic apply step a Telegram button press
  (or the `triage <token> <choice>` text fallback) invokes: `flock`-serialized,
  resolves token → row via `find_by_token`, takes the *actual tapped option* as
  the action (not the LLM's stored guess — those are independent), supports a
  small free-text grammar (`project|resource|task|note[/keep] [in <Area>]`) for
  the "Other" escape hatch, prints one JSON object `{"ok","reply","action",
  "page_id","target_id"}`.
- `config.py` additions: `OPENCODE_KEY_PATH`, `OPENCODE_BASE_URL`, `ROUTER_MODEL`,
  `ROUTER_MAX_BATCH=25`, `ROUTER_MAX_PROPOSALS=8`, `TRIAGE_EXPIRY_HOURS=24`,
  `TELEGRAM_TARGET`.
- `pull.py`'s `CAPTURE_HOLD` guard — live since Phase 1, unchanged.
- Press-handling instructions for agent `mid` added to
  `/root/.openclaw/workspace/AGENTS.md` (dated `.bak` taken first, per house rule
  — `/root` isn't git-versioned): on a `nrt:<token>:<option>` callback or a
  `triage <token> <choice>` message, run `notion-triage-apply.py` and echo its
  `reply` verbatim — no reasoning, keeps a button press cheap.
- `notion-router.service` — installed, `systemd-analyze verify` clean, **live-ran
  once** under its real hardened sandbox (`ProtectSystem=strict` +
  `ProtectHome=read-only` + `ReadWritePaths=/root/.openclaw /run/notion-triage`)
  and completed cleanly (0 pending rows in Notion right now, so this exercised
  every permission/environment path with zero LLM/Telegram risk). It is now
  wired to the existing `notion-sync.timer` through
  `/etc/systemd/system/notion-sync.service.d/20-router.conf`; the standalone
  router unit remains disabled by design and is started through `Wants=`.
- 56 passing unit tests across 7 files (was 18 before today): `test_llm.py`,
  `test_router_active.py`, `test_triage_apply_cli.py` are new; `test_triage.py`
  and `test_schema_router.py` gained new/updated cases.
- Live Notion schema: still all 8 properties present, correctly typed (unchanged
  from Phase 1).
- `system/cheatsheets/oc-cli.md` — the stale `--buttons` flag is fixed, replaced
  with the real `--presentation` shape and its gotchas.

### One plan correction, verified empirically
The plan claimed `ProtectHome=read-only` would block `/root/.openclaw` even with
it in `ReadWritePaths`, and recommended omitting `ProtectHome` entirely. Tested
live with `systemd-run` before writing the real unit: **that claim was wrong** —
`ReadWritePaths` correctly overrides `ProtectHome=read-only` for the listed path,
exactly as it does for the existing `notion-sync.service`. `notion-router.service`
uses the same (more restrictive, already-proven) pattern as `notion-sync.service`
instead of the plan's untested one.

### Production activation and remaining scope
- Gate 0b is closed operationally: the old synthetic callback was received by
  Alfred and correctly rejected as expired, proving the callback handler and
  stale-token path. A new synthetic approval was deliberately not created.
- The production drop-in is installed at
  `/etc/systemd/system/notion-sync.service.d/20-router.conf` and exactly matches
  `/root/scripts/systemd-staged/notion-sync-20-router.conf`.
- Activation evidence is recorded in
  `/root/reviews/225-phase2-notion-router-production-activation.md`; the task is
  closed by `/root/tasks/archive/spec225-notion-router-phase2/225-phase2-notion-router-production-activation.done`.
- The live Notes schema is complete, all 56 tests pass, the timer is enabled and
  active, and the post-activation router canary found 0 pending rows. Therefore
  no live LLM classification, Notion mutation, or Telegram proposal has occurred
  yet.
- Remaining validation is observational: when a real Project/Resource/Task
  proposal appears, Papi can approve it through Alfred. The existing 24-hour
  token expiry, actual-tapped-option behavior, lock, and relation idempotency
  remain the safety boundaries.

## Resuming this project
1. Confirm `notion-sync.timer` is enabled/active and inspect the next timer tick
   before troubleshooting anything.
2. If a real proposal appears in Alfred, approve or decline it and verify the
   resulting Notion relation and source-row state; do not create synthetic test
   content merely to exercise the path.
3. For a failure, read the activation evidence and router/sync journals first.
   Rollback is limited and reversible: remove
   `/etc/systemd/system/notion-sync.service.d/20-router.conf`, run
   `systemctl daemon-reload`, and verify the existing timer remains active.
