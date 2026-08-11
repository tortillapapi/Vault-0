---
type: system-cheatsheet
title: Operating Rules (standing feedback)
slug: operating-rules
last_synced: 2026-08-01
maintainer: cc-oc-orchestrator
source: CC auto-memory (feedback entries)
tags: [ops, rules, feedback, shared-brain]
---

# Operating Rules

Standing rules distilled from real sessions. **This page is the single source of truth
for standing behavioral rules** and binds every agent on this box equally — Hermes,
CC/Metis, Codex, and the OpenClaw fleet. The per-harness files in `/root` point here
rather than restating these rules.

Adjacent authorities: which tier gets the work → [[system/configs/openclaw-agents]];
shared spec/review conventions → [[system/workflows/peer-orchestrator-protocol]];
command syntax → [[system/cheatsheets/oc-cli]].

## Messaging & OC interaction
- **Telegram: use `openclaw message send`, never `agent --deliver`.** `agent`
  spins a ~60s inference turn and can lock sessions; `message send` is a ~10s
  direct relay. Chat ID 1207164084. See `system/cheatsheets/oc-cli`.
- **Read the OC CLI cheatsheet before any `openclaw` command.** Hard gate — no
  exceptions, even if you think you remember the syntax.

## Dispatch & verification
- **Routine multi-phase specs (3+ phases) use `mid` with pre-approved handoffs**
  + a `.progress` file, not CC driving each phase. `lead` is explicit-only for
  exceptionally hard architecture/strategy or when grunt/re-review/mid are stuck.
  Not for single-phase work or phases needing CC judgment between them.
- **OpenClaw grunt session watchdog + nightly rotation are installed.** `/root/bin/openclaw-grunt-session-maintenance.py`
  is the guarded manual dry-run/rotate tool. It is **not** grunt-only: it **defaults** to `grunt`/`grunt-eng`
  but accepts an explicit `--allow-agent` allow-list for the rest of the roster (any non-default
  agent errors without a matching `--allow-agent`). The nightly rotation drives it across the
  **full roster** (`mid`, `lead`, `grunt-eng`, `grunt`, `re-review`, `email-parser`) via
  `/root/.hermes/scripts/openclaw-nightly-rotation.py` (Hermes cron `572c4dc18aed`, active only
  04:00–04:09 America/Los_Angeles). `/root/.hermes/scripts/openclaw-grunt-session-watchdog.py`
  runs every 6h via Hermes cron `eac51421f32b` and stays silent unless thresholds are exceeded
  or the check fails — alert-only, never kills; it is the failure detector for the nightly
  rotation (thresholds: 25 sessions, 25 MB store, 30h age). Manual rotation command:
  `/root/bin/openclaw-grunt-session-maintenance.py --rotate --all --json`.
  It refuses rotation when targeted OpenClaw tasks are running or fresh
  `/root/tasks/*.progress` markers exist.
- **Model quirks (weak clock, secret echo) and the DeepSeek residency gate** are
  canonical in [[system/configs/openclaw-agents]] § Known model quirks / Data residency.
  Both still bind: inject exact dates and verify `.done` times with `stat -c %y`; never
  extend the China-hosted-model opt-in to another workspace without user consent.
- **Verification checks must match unique content text**, not numeric prefixes or
  assumed file/process structure. Use `pgrep -af <name>` not `systemctl is-active`
  unless the target is confirmed a systemd unit (OpenClaw runs many plain
  processes). Prefer `>= N` over `== N` for counts that can grow.
- **Check systemd state before dispatching run-type tasks** on any project with a
  `systemd/` dir — a live timer can silently race your work.
- **Review chain over grunt work.** The ladder and its escalation rules are canonical in
  [[system/configs/openclaw-agents]] § Review chain. The standing rule here: **match
  review depth to task risk** — most routine edits need zero review beyond the executor's
  own verification, and routine review never goes straight to `lead`. **Bound every
  review prompt to the spec, the changed files/diff, test output, and the `.done`
  marker** — never broad project/session history; inherited context is the main
  review-cost leak.

- **Dispatch cost discipline — keep OpenAI for judgment.** OpenClaw's connected
  OpenAI/ChatGPT account is separate from Hermes/Janus's OpenAI account, so an
  OpenClaw GPT rolling-window burn does not affect Hermes availability. Within
  OpenClaw, OpenAI quota is still the scarce pool (`mid`/`lead`);
  DeepSeek (`grunt`/`grunt-eng`) and GLM (`re-review`) are separate pools. Default
  mechanical/coding work to `grunt-eng` and docs/formatting to `grunt`; use `mid`
  for review and judgment work; reserve `lead` only for genuinely exceptional
  problems when mid is stuck. `mid` runs `openai/gpt-5.6-luna` with
  `xhigh` thinking; `lead` runs `openai/gpt-5.6-sol` with `xhigh` thinking. If OpenClaw GPT is burned but GPT is still needed
  for low/medium work, Janus may use Hermes delegation/subagents on the Hermes
  account with lower reasoning while keeping Janus itself on the high-reasoning
  orchestration lane. Do
  feasibility/investigation (`ls`/`grep`/`curl`) on the orchestrator side directly;
  don't spend an OpenAI agent on greppy work, and skip costly liveness probes (a
  PONG to `main` is ~60k tokens). Watch the Mission Control Usage tab to stay ahead
  of the OpenAI 5h rolling window.
- **Judge cost by quota %, not raw token counts.** Per-session counters are
  context-processing volume; with ~95% prompt caching, raw totals are dominated by
  discounted cached re-reads and overstate real spend. Optimize against the
  weekly/5h rolling-window percentages (Mission Control Usage tab); alert on
  quota-point deltas (e.g. one session moving the weekly window ≥2 points), not on
  raw-token thresholds.
- **One project = one pre-approved dispatch, not many sequential GPT sessions.**
  Bundle a project's phases into a single self-orchestrated dispatch via `mid` (or
  a bounded `mid`/grunt chain). Re-opening a fresh GPT session per phase replays the
  full instruction/tool payload each time — the specs 105-110 usage-tracker sprint
  opened 7 sequential `main`/xhigh sessions for one project, the clearest avoidable
  burn to date.
- **Scheduled GPT crons need a justified tier.** Any recurring `openclaw cron` /
  systemd job that wakes an OpenAI agent must run at the lowest tier that does the
  job: default recurring audits/reviews to `mid` or `re-review`/GLM; reserve
  `lead` for jobs that demonstrably need it; re-audit periodically.
  (2026-07-24: `parser-daily-audit` runs on `mid` at `xhigh` per Spec 191.)
- **Don't run heavy introspective usage reports on the paid OpenAI account.**
  Generating a full token-usage analysis itself once burned ~5 points of a 5h
  window. Pull usage from the Mission Control trackers / `rate_limits` fields
  instead; if a narrative report is genuinely needed, run it on a cheaper agent.

## Session hygiene
- **Manage OC lead's context proactively.** Don't ask every session, but check
  OC lead's context % before a heavy/multi-phase dispatch, and recommend `/clear`
  (not `/compact`) after a multi-phase spec completes — disk state is canonical.

- **Never restart `metis-gateway` as the last unreported step of a turn.** That
  service is the parent of every Telegram-side Metis session; `systemctl restart
  metis-gateway.service` from inside one kills the session mid-turn (exit 144) and
  the user just sees silent ghosting. Order of operations: (1) send the completion
  message first via `openclaw message send --channel telegram --target 1207164084`,
  noting the session is about to end; (2) then detach the restart with
  `systemd-run --on-active=5 --unit=metis-gw-restart systemctl restart
  metis-gateway.service`, or simply accept the session death since step 1 already
  reported out. Same hazard for any `systemctl restart/stop` of a unit in the
  session's own cgroup ancestry. (2026-07-30: the Claude 5-series model upgrade
  landed correctly but went unreported for a day for exactly this reason.)

## Project guardrails
- **Fable 5 is API-billed — never invoke or probe it.** `/model fable`
  (`claude-fable-5`) is wired into `gateway.py` presets but is NOT covered by the
  user's Anthropic subscription; it bills per token and would require the $100
  tier, which the user explicitly declined (2026-07-30). Do not select it, do not
  "test access", do not pitch the upgrade unsolicited. Subscription-covered tiers:
  Opus 5 (default), Sonnet 5, Haiku 4.5.
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
- **Back up `/root` config files before hand-editing — they are not
  git-versioned.** Before editing/trimming any non-vault config or instruction
  file under `/root` (`/root/CLAUDE.md`, `/root/AGENTS.md`,
  `/root/.openclaw/workspace/AGENTS.md`), make a dated backup first
  (`cp file file.bak-YYYY-MM-DD`) as a spec Phase 0. `/root` has no version
  history, so the `.bak` is the only rollback. (Vault files are exempt — they
  are git-versioned; see the vault commit+push rule.)
