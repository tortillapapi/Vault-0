---
type: system-cheatsheet
title: Operating Rules (standing feedback)
slug: operating-rules
last_synced: 2026-07-24
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
- **Routine multi-phase specs (3+ phases) use `mid` with pre-approved handoffs**
  + a `.progress` file, not CC driving each phase. `lead` is explicit-only for
  exceptionally hard architecture/strategy or when grunt/re-review/mid are stuck.
  Not for single-phase work or phases needing CC judgment between them.
- **OpenClaw grunt session watchdog is installed.** `/root/bin/openclaw-grunt-session-maintenance.py`
  is the guarded manual dry-run/rotate tool for `grunt` and `grunt-eng` only;
  `/root/.hermes/scripts/openclaw-grunt-session-watchdog.py` runs every 6h via
  Hermes cron job `eac51421f32b` and stays silent unless thresholds are exceeded
  or the check fails. Manual rotation command: `/root/bin/openclaw-grunt-session-maintenance.py --rotate --all --json`.
  It refuses rotation when targeted OpenClaw tasks are running or fresh
  `/root/tasks/*.progress` markers exist.
- **OpenCode-Go agents have a weak clock (provider-wide, not just Kimi).** `grunt`
  and `grunt-eng` now run DeepSeek V4 Flash by default and `re-review` runs GLM 5.2,
  but hosted models can still misread current date/time. Always inject exact dates
  in task prompts and require `date -u` for completion markers; verify `.done`
  times with `stat -c %y` when audit accuracy matters. OpenAI agents
  (`mid` on openai/gpt-5.6-luna xhigh and `lead` on openai/gpt-5.6-sol xhigh) are unaffected.
- **Verification checks must match unique content text**, not numeric prefixes or
  assumed file/process structure. Use `pgrep -af <name>` not `systemctl is-active`
  unless the target is confirmed a systemd unit (OpenClaw runs many plain
  processes). Prefer `>= N` over `== N` for counts that can grow.
- **Check systemd state before dispatching run-type tasks** on any project with a
  `systemd/` dir — a live timer can silently race your work.
- **Review chain over grunt work.** Grunt-tier output (`grunt`,
  `grunt-eng`) goes through `re-review` (GLM 5.2, medium) for first-pass QA, then `mid`
  (GPT-5.6-luna, xhigh) as the default GPT escalation when risk warrants it, before the orchestrator approves. `lead`
  (GPT-5.6-sol, xhigh) is only for exceptionally hard tasks or when other agents
  are stuck — never route routine review directly to lead. **Bound every review prompt to the
  spec, the changed files/diff, test output, and the `.done` marker** — never broad
  project/session history; inherited context is the main review-cost leak.

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
- **Back up `/root` config files before hand-editing — they are not
  git-versioned.** Before editing/trimming any non-vault config or instruction
  file under `/root` (`/root/CLAUDE.md`, `/root/AGENTS.md`,
  `/root/.openclaw/workspace/AGENTS.md`), make a dated backup first
  (`cp file file.bak-YYYY-MM-DD`) as a spec Phase 0. `/root` has no version
  history, so the `.bak` is the only rollback. (Vault files are exempt — they
  are git-versioned; see the vault commit+push rule.)
