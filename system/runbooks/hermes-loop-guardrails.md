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
| `agent.max_turns` | `40` | Spec 196 — boundary productive-churn; forces a checkpoint earlier |
| `kanban.dispatch_stale_timeout_seconds` | `3600` | kill zombie dispatches at 1h not 4h |
| `compression.threshold` | `0.20` | Spec 196 — trigger compression earlier |
| `compression.protect_last_n` | `6` | Spec 196 — protect fewer messages |
| `compression.target_ratio` | `0.10` | Spec 196 — compress more aggressively |
| `tool_output.max_bytes` | `8,000` | Spec 196 — tighter terminal output cap |
| `tool_output.max_lines` | `250` | Spec 196 — tighter file pagination cap |
| `tool_output.max_line_length` | `600` | Spec 196 — tighter per-line cap |

Thinking levels unchanged: `mid` = gpt-5.6-luna **xhigh**, `lead` = gpt-5.6-sol **high**,
orchestrator `agent.reasoning_effort` = **medium**.

### 2b. Call budget and operational policy (Spec 196)
- Target: 10–20 parent model calls per session.
- Soft stop at 20: compress or start fresh session.
- Hard checkpoint at 30: persist state, `/compress` or `/new`, continue only
  if justified.
- No minute-polling delegated work. Bounded jobs: one foreground call with
  generous timeout. Long jobs: background completion notification. Max one
  manual status check absent hang evidence.
- Start fresh session at completed major-topic boundaries.
- Risk-proportional review: match depth to risk. Routine edits = executor
  verification only. No mandatory Hermes self-checkpoint.

### 3. Loop sentinel (alert-only, never kills)
- Script: `/root/scripts/hermes-loop-sentinel.sh` · units: `hermes-loop-sentinel.{service,timer}` (every 10 min).
- Detection: (a) productive-churn — **≥20 tool calls in 10 min with 0 user messages**; (b) per-session thresholds — **25+ API calls**, **1M+ cached input tokens**, **100K+ tool-output chars**, or **50+ Sol-equivalent credits**. 30-min per-alert-key cooldown.
- Sol-equivalent formula: `sol = (input_tokens*125 + cache_read_tokens*12.5 + output_tokens*750) / 1e6` per announced Sol Business rates.
- output_tokens includes reasoning_tokens (verified at conversation_loop.py:2816); not added separately to avoid double-count.
- All sessions-table metrics are available: `api_call_count`, `input_tokens`, `output_tokens`, `cache_read_tokens`, `cache_write_tokens`, `reasoning_tokens`, `tool_call_count`, `estimated_cost_usd`. Tool-output chars derived from `messages.content`.
- Unavailable (server-side only): rate-limit remaining/reset time.
- Delivery via `hermes send` (Hermes-native, no-LLM path). Never kills.
- Testability: `HERMES_SENTINEL_DRY_RUN=1` skips send; `--status` for JSON; `--check` for dry-run; env vars override all thresholds.

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

## Cross-References
- Token-efficiency hardening and transition planning: [`hermes-token-efficiency-and-openclaw-transition.md`](./hermes-token-efficiency-and-openclaw-transition.md) — canonical decision document covering audit baseline, config changes, operational policy, Hermes-primary migration caveats, and proposed staged future plan.
- Spec 196: `/root/specs/196-hermes-token-efficiency-hardening.md`
- Tool-output cap investigation: `/root/reviews/196-tool-output-cap-investigation.md`
