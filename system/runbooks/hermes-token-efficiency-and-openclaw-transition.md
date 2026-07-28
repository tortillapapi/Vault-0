# Runbook — Hermes Token Efficiency & OpenClaw Transition Notes

**Purpose:** Canonical record of the Spec 196 token-efficiency hardening, the findings that drove it, and the documented (but not yet executed) considerations for making Hermes the primary orchestration ecosystem. This document is the single source of truth for what changed, what was discovered, and what is explicitly deferred.

---

## Audit Baseline (2026-07-28)

A single long-running Hermes session was sampled for a representative 79-call window:

| Metric | Value |
|---|---|
| OpenAI API calls (window) | 79 |
| Fresh input tokens | 388,233 |
| Output tokens | 26,333 |
| Cached/replayed input tokens | 11,656,704 |
| Estimated Sol-equivalent credits | ~213.99 |

**Root cause:** Long-session replay multiplied by too many parent/tool turns. A session that ran ~10 hours accumulated massive cache-read token burn (11.6M) as each turn re-read the entire chat history. The high per-call cost of GPT-5.6 `sol`/`luna` amplified the impact.

---

## Config Changes Applied (Spec 196)

Changes to `/root/.hermes/config.yaml`, verified with `hermes config check`:

| Key | Old | New | Why |
|---|---|---|---|
| Key | Old | New | Why |
|---|---|---|---|
| `compression.threshold` | 0.30 | **0.20** | Trigger compression earlier |
| `compression.protect_last_n` | 10 | **6** | Protect fewer messages from compression |
| `compression.target_ratio` | 0.15 | **0.10** | Compress more aggressively |
| `tool_output.max_bytes` | 16,000 | **8,000** | Tighter terminal output cap |
| `tool_output.max_lines` | 500 | **250** | Tighter file pagination cap |
| `tool_output.max_line_length` | 1,200 | **600** | Tighter per-line cap |
| `agent.max_turns` | 60 | **40** | Structural cap — forces checkpoint earlier |

**Preserved (unchanged from Janus incident fix):**
- `tool_loop_guardrails.hard_stop_enabled: true` — halt failure-loops
- `kanban.dispatch_stale_timeout_seconds: 3600` — kill zombie dispatches at 1h

---

## Operational Policy (Spec 196, encoded in `.hermes.md`)

| Rule | Detail |
|---|---|
| Target calls | 10–20 parent model calls per session |
| Soft stop | At 20 calls: compress or start a fresh session |
| Hard checkpoint | At 30 calls: persist shared state, `/compress` or `/new`, continue only if justified |
| No minute-polling | One foreground call with generous timeout; long jobs use completion notification; at most one manual status check per job |
| Deterministic collectors | Prefer scripts that reduce raw SQL/file/history to compact JSON/Markdown |
| Topic boundaries | Fresh session at completed major-topic boundaries |
| Risk-proportional review | Routine edits need zero review beyond executor verification. No mandatory Hermes self-checkpoint |

---

## Resume Collector (Spec 196)

**Path:** `/root/scripts/hermes-session-resume.py`

- Deterministic, LLM-free
- Modes: `--mode=json` (default, ~6.7 KB), `--mode=markdown` (~1.5 KB), `--mode=status` (one-liner)
- Returns: active specs, pending tasks, blockers (+24h flag), fresh `.progress` anti-collision markers, last 20 vault log entries, suggested next action, Hermes state
- Called automatically at session start per `.hermes.md` Session Resume Protocol

---

## Loop Sentinel (Spec 196)

**Path:** `/root/scripts/hermes-loop-sentinel.sh`
**Units:** `hermes-loop-sentinel.{service,timer}` (every 10 min)

**Per-session threshold alerts (alert-only, never kills):**

| Threshold | Default | Metric Source |
|---|---|---|
| API calls | ≥25 | `sessions.api_call_count` |
| Cached input tokens | ≥1,000,000 | `sessions.cache_read_tokens` |
| Tool-output chars | ≥100,000 | Derived from `messages.content WHERE role=tool` |
| Sol-equivalent credits | ≥50 | Computed from tokens (see formula below) |
| Productive churn | ≥20 tool calls / 10 min with 0 user messages | Preserved from Janus incident |

**Sol-equivalent credit formula** (verified against `conversation_loop.py:2816`):
```
sol = (input_tokens*125 + cache_read_tokens*12.5 + output_tokens*750) / 1e6
```
- `output_tokens` includes `reasoning_tokens`; reasoning is not added separately (verified at `conversation_loop.py:2816`)
- `input_tokens` does NOT include cache tokens (accumulated independently)
- Rates per announced Sol Business pricing

**Available metrics:** `api_call_count`, `input_tokens`, `output_tokens`, `cache_read_tokens`, `cache_write_tokens`, `reasoning_tokens`, `estimated_cost_usd`, `tool_call_count`, `tool_output_chars` (derived)

**Unavailable:** `rate_limit_remaining` (server-side only; not in sessions table)

**Delivery:** `hermes send` (Hermes-native, no-LLM path). 30-min per-key cooldown. Never kills sessions.

**Testability:** `HERMES_SENTINEL_DRY_RUN=1` skips send; `--status` for JSON; `--check` for dry-run; per-threshold env overrides; fixture DB support. All 5 thresholds verified with controlled DB fixtures.

---

## Tool-Output Cap Investigation (Spec 196 finding)

**Source:** `/root/reviews/196-tool-output-cap-investigation.md`

- `skill_view` and `session_search` do **not** call `get_max_bytes()` from `tool_output_limits.py`
- This is **not a bug** — the `tool_output` config was designed to parameterize terminal/file tools that had hardcoded caps, not to apply to every tool
- Both tools **are protected** by two universal layers:
  1. **Per-result persistence** (100K chars per result; `DEFAULT_RESULT_SIZE_CHARS` in `tool_result_storage.py`)
  2. **Per-turn aggregate budget** (200K chars per turn; `DEFAULT_TURN_BUDGET_CHARS`)
- **No bypass exists.** The model never sees more than ~100K chars of inline output from any single tool call

**Recommendation (no change made):** If tighter caps are desired specifically for `skill_view`/`session_search`, register a lower `max_result_size_chars` in `tools/registry.py` rather than extending `get_max_bytes()` to all tools. Unnecessary for safety — current behavior is correct. A core patch adds regression risk for zero security gain.

---

## Agent Hierarchy Verified Unchanged

Verified before and after Spec 196 implementation. Live `openclaw agents list --json` roster:

| Lane | Model |
|---|---|
| `mid` | `gpt-5.6-luna` |
| `lead` | `gpt-5.6-sol` |
| `grunt-eng` | `deepseek-v4-flash` |
| `grunt` | `deepseek-v4-flash` |
| `re-review` | `glm-5.2` |
| `email-parser` | `gemini-2.5-flash` |

No hierarchy changes were made. No model/thinking-level reassignments.

---

## Hermes-Primary Recommendation

**Finding:** Hermes is the natural candidate to become the primary orchestration ecosystem because:
- Hermes owns the shared-vault state and the deterministic command/collector tooling
- Hermes has the longest-running session continuity on this VPS
- OpenClaw's use has narrowed primarily to delegated task execution (specs 96+, almost all Hermes-orchestrated)

**Explicit non-change:** No hierarchy change was implemented by Spec 196. This remains a design discussion for the next session.

---

## Remaining OpenClaw Responsibilities Discovered

Even if Hermes becomes primary, OpenClaw retains unique value:

1. **Parser daily audit cron** — The `parser-daily-audit` cron (OC `mid` lane, `20 9 * * *` America/Los_Angeles) is a self-contained audit. It would need to be ported to a Hermes script or cron equivalent.
2. **Current per-lane model routing** — OpenClaw handles dynamic model routing across lanes (`mid`→luna, `lead`→sol, `grunt`→flash, etc.). Hermes would need equivalent worker profiles/lanes.
3. **Separate failure domain** — If Hermes is down or mid-upgrade, OpenClaw can still execute bounded tasks. This operational independence is valuable.

---

## Hermes Migration Caveats

Any future migration of OpenClaw responsibilities to Hermes must account for:

1. **`delegate_task` model is globally configured** — Hermes' direct `delegate_task` tool uses a single configured model; there is no per-call model override equivalent to OpenClaw's per-lane routing.
2. **In-flight child execution is not restart-durable** — If Hermes restarts while a child task is running, the child state is lost. OpenClaw task markers are filesystem-persistent and survive restarts.
3. **Profiles, Kanban, and cron solve persistent lanes** — Hermes profiles, Kanban, and cron can reproduce persistent/specialized lanes (equivalent to OpenClaw lanes), but that architecture has not yet been designed/configured for this VPS.
4. **`hermes claw migrate --dry-run --yes` — limited scope** — The built-in migration command would only import memory/user/daily-memory from OpenClaw's workspace. It skips:
   - Agent hierarchy and model assignments
   - Cron jobs and systemd timers
   - Runtime state (session stores, in-flight tasks)
5. **Data conflict risk** — Importing into an already-operational Hermes state risks duplicate keys and conflicting state.
6. **Bot-token collision** — If both Hermes and OpenClaw gateways use the same Telegram bot token, messages will collide.

---

## Proposed Staged Future Plan

These steps are **recommendations only** — no action has been taken:

1. **Inventory** — Catalog every live OpenClaw cron job, timer, and service. Determine which are still needed and which can be ported.
2. **Design** — Design only the Hermes worker profiles/lanes needed to replace OpenClaw's remaining roles.
3. **Port parser audit cron** — Move the daily parser-audit dispatch from OpenClaw cron to a Hermes-native cron.
4. **Rewrite `.hermes.md` dispatch doctrine** — Update the `.hermes.md` to reference Hermes-native workers instead of `openclaw agent` for most tasks.
5. **Shadow test** — Run Hermes workers alongside OpenClaw for 1–2 weeks; compare outcomes.
6. **Stop (not delete) OpenClaw** — Disable OpenClaw gateway/systemd units; do not remove.
7. **Observe 1–2 weeks** — Verify no regressions before committing.
8. **Archive/remove** — After rollback window expires, clean up.

---

## Next-Session Gate

**No changes to hierarchy, runtime, or services will be made automatically.** The next session MUST begin with:

1. Read this document (`hermes-token-efficiency-and-openclaw-transition.md`)
2. Discuss/design the Hermes-vs-OpenClaw hierarchy
3. Agree on a migration plan before any runtime changes

This gate is encoded in the new-session handoff document at `/root/context/hermes-token-optimization-handoff-2026-07-28.md`.

---

## Cross-References

- Parent guardrails runbook: `hermes-loop-guardrails.md` (this directory)
- Spec 196: `/root/specs/196-hermes-token-efficiency-hardening.md`
- Spec 196 completion: `/root/tasks/196-hermes-token-efficiency-hardening.done`
- Spec 196 fixups: `/root/tasks/196-hermes-token-efficiency-hardening.fixups.done`
- Tool-output cap investigation: `/root/reviews/196-tool-output-cap-investigation.md`
- Hermes orchestrator guidance: `/root/.hermes.md`
- Agent roster: `system/configs/openclaw-agents.md` (this repo)
- Peer orchestrator protocol: `system/workflows/peer-orchestrator-protocol.md` (this repo)
