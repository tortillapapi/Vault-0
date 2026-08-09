---
type: system-project
title: Notion Quick-Capture Router
slug: notion-quick-capture-router
status: paused
last_synced: 2026-08-09
maintainer: cc-oc-orchestrator
next_action: "Waiting on a live Telegram button tap to confirm Gate 0 (round-trip to agent mid), then install the notion-sync.service drop-in to go live"
tags: [project, notion, notion-sync, automation, telegram]
---

# Notion Quick-Capture Router

Automates triage of Notion Notes-DB quick captures: auto-fills cheap metadata and
proposes Project/Resource/Task promotions to Papi over Telegram (via Alfred) with
tap-to-approve buttons, closing the gap between "captured" and "filed." Full design:
`/root/.claude/plans/okay-next-thing-when-imperative-quasar.md` (approved 2026-08-05).

## Status: fully built and tested, one live confirmation away from going live

Phase 1 (deterministic core + schema) landed via an unsupervised Hermes handoff on
2026-08-05. The rest of Phase 2 (LLM classification, Telegram approval loop, apply
script, systemd wiring) was completed 2026-08-06. **Everything is built, unit
tested, and installed — but the one piece that actually turns the system on
(the `notion-sync.service` drop-in) is intentionally not installed yet**, pending
a live Telegram round-trip confirmation (Gate 0b — see below).

### What's live and verified (2026-08-06)
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
  every permission/environment path with zero LLM/Telegram risk). Left
  **disabled**, not wired to any timer.
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

### What's still NOT done — the actual gate
- **Gate 0b** — a live Telegram round-trip proving a button tap reaches agent
  `mid` as a synthetic message. A real test message ("🔧 Triage [TEST]", 5
  buttons) was sent to the Alfred chat at 2026-08-06T01:05Z (messageId 939) and
  is still sitting there awaiting a tap as of this writing. Gate 0a (does the
  presentation JSON survive normalization into real `callback_data`) was
  confirmed by reading the installed OpenClaw source directly, since
  `--dry-run` turned out not to print normalized presentation content at all —
  that's a corrected assumption from the original plan too.
- The `notion-sync.service` drop-in (`Wants=`/`After=notion-router.service`) —
  **deliberately not installed.** This is the one file that would put the router
  on the live 30-minute schedule. Installing it before Gate 0b is confirmed would
  mean the first real promotion proposal goes out with an unproven return path.
- Live end-to-end promotion test (Gates 1–8 in the plan) — not run against a real
  captured note yet, since there's nothing in the Notes DB to triage right now.

**Re-checked 2026-08-09, nothing has changed:** no tap or reply ever landed on
messageId 939 (`journalctl --user -u openclaw-gateway.service` shows only the
outbound send, no inbound callback), the drop-in was never installed, the router
unit is still `disabled`/`inactive`, the Notes DB is still at 0 pending, and all
56 tests still pass. This is a genuinely idle, safe state — nothing decayed,
nothing needs redoing, it is simply still waiting on a tap.

## Resuming this project
1. Tap any button on the pending Telegram test message in the Alfred chat (or
   send `triage deadbeef 0` as text) and confirm `mid` responds.
2. If it reaches `mid`: install the staged drop-in —
   `mkdir -p /etc/systemd/system/notion-sync.service.d && cp
   /root/scripts/systemd-staged/notion-sync-20-router.conf
   /etc/systemd/system/notion-sync.service.d/20-router.conf && systemctl
   daemon-reload` — then capture one real test note in Notion and watch the
   next tick.
3. If it does not reach `mid`: fall back per the plan — `url` buttons to a small
   local endpoint, or drop to a text-only `triage <token> <choice>` convention
   (already implemented and tested in `notion-triage-apply.py` regardless).
