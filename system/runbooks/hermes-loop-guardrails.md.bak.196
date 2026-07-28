# Runbook — Hermes/Janus Loop Guardrails

**Purpose:** bound and surface runaway "over-engineering" loops where Janus (Hermes
orchestrator) turns a trivial task into a full spec + multi-stage review pipeline,
burning tokens. Established 2026-07-28 after a ChatGPT Plus→Business migration
exposed the failure mode.

## Root cause (for context)
The Business account unlocked the gpt-5.6 `sol`/`luna` tier and an auto-raise flipped
the Hermes default from `gpt-5.5` → `gpt-5.6-sol`. In the same window the review-chain
doctrine was rewritten from a simple `re-review → mid` into a 4-stage escalating
pipeline ending in a **mandatory "Hermes final checkpoint"**. A high-reasoning model
executing that doctrine wrapped one-line edits in spec+progress+re-review chains.
The harness `tool_loop_guardrails` did **not** catch it because they are failure-based;
this was *productive-churn* (every step "succeeded").

## Layered guardrails now in place

### 1. Doctrine (the real fix) — risk-proportional review
Canonical in `system/configs/openclaw-agents.md` (§Review Chain) and mirrored in
`/root/.hermes.md`. Principle: **match review depth to task risk.** Routine data edits
(a one-line Sheet/DB update) = apply → verify → done, no review chain, no mandatory
Hermes self-checkpoint. Escalate `re-review → mid` only if risk warrants; `lead` is
explicit-only. If this ever regresses, both files must be reverted together.

### 2. Structural caps — `/root/.hermes/config.yaml` (backup before editing)
| Key | Value | Why |
|---|---|---|
| `tool_loop_guardrails.hard_stop_enabled` | `true` | halt failure-loops, not just warn |
| `agent.max_turns` | `60` | bound productive-churn; only forces a checkpoint (no work lost) |
| `kanban.dispatch_stale_timeout_seconds` | `3600` | kill zombie dispatches at 1h not 4h |

Thinking levels: `mid` = gpt-5.6-luna **xhigh**, `lead` = gpt-5.6-sol **high**,
orchestrator `agent.reasoning_effort` = **medium**.

### 3. Loop sentinel (alert-only, never kills)
- Script: `/root/scripts/hermes-loop-sentinel.sh` · units: `hermes-loop-sentinel.{service,timer}` (every 10 min).
- Fires a Telegram alert when the live Hermes session shows **≥20 tool calls in 10 min with 0 user messages** (self-driving churn). 30-min per-session cooldown.
- Reuses the `watchdog-sweep` alert path (`openclaw message send`).

## Responding to a sentinel alert
1. Confirm what it's doing: check the live session cadence and spawned processes
   (`ps -eo pid,etimes,args | grep -E 'openclaw agent|tasks/'`).
2. Check whether the substantive work is already done (artifact mtime / `.done` marker)
   — the loop is usually *post-completion* polish.
3. If over-engineering: stop Janus, then finalize `.done` markers on any orphan
   review/polish task files so nothing re-dispatches; set the spec `status: complete`.

## Tuning
- Sentinel threshold: `TOOL_THRESHOLD` in the script (currently 20). Lower = more sensitive.
- If legit long work trips it, it only *alerts* — raise the threshold rather than disabling.
- Deliberately **no auto-kill backstop** yet (owner deferred picking thresholds).
