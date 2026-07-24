# Incident: OOM kill of Janus gateway — 2026-07-23

**Status:** ✅ RESOLVED — work complete
**Date:** 2026-07-23 (~17:10 UTC / ~10:10 AM America/Los_Angeles)
**Impact:** Janus (main Hermes gateway, @RareForce_Janus_Bot) stopped responding in Telegram for a short window; OpenClaw node gateway also restarted.

## Symptom
User reported Janus not responding in Telegram. Metis (@RareForce_Metis_Bot) unaffected.

## Root cause
Global out-of-memory (OOM) on a **7.8 GB box with no swap**.

Chain of events:
1. Scheduled `parser-daily-audit` cron (agent `mid`, gpt-5.5/codex, isolated) fired on schedule at 9:20 AM LA (16:20 UTC).
2. User sent a Telegram message at 10:05 AM LA (17:05 UTC), waking the `lead` agent (also gpt-5.5/codex).
3. Two overlapping codex sessions each spawned `openclaw-hooks` subprocesses → piled up to **14 procs ≈ 3.8 GB RSS**.
4. One codex call stalled — gateway event loop frozen **~139 s** (`eventLoopDelayP99Ms=138915`), so hooks did not drain.
5. Combined memory exceeded 7.8 GB physical with **zero swap** → kernel global OOM.
6. OOM killer took the processes tagged `oom_score_adj=100` (protective "sacrifice-first" tag): hermes/Janus gateway (pid 917) at 17:10, OpenClaw node gateway (pid 635790) at 17:16.
7. Both are systemd `app.slice` units → auto-restarted within ~11 s. Janus reconnected to Telegram; hooks drained to 0; load recovered.

## Why now / never before
Normally the daily audit finishes in 1–2 min and doesn't overlap active chat. This time a **stuck codex call (139 s stall)** coincided with a **live chat session**, and the **missing swap** turned a routine spike into a fatal OOM. The box had always been one bad overlap away from this.

## Verification
- Live inference probe against Janus returned `PONG` (codex/gpt-5.6 backend healthy).
- Codex auth token valid (access token exp 2026-07-26).
- Bot token valid, no polling conflict with Metis bot.

## Remediation (DONE)
- **Added 8 GB swapfile** at `/swapfile` — active, `chmod 600`, `mkswap`/`swapon`.
- **Persistent** via `/etc/fstab`: `/swapfile none swap sw 0 0`.
- **`vm.swappiness=10`** set live + persisted in `/etc/sysctl.conf` (prefer RAM, spill to swap instead of OOM).
- Result: `Swap: 8.0Gi total`. A comparable spike now pages to swap instead of OOM-killing Janus.

## Considered but deliberately NOT changed
- **Hook reaper (`oc-reap-subagents`) cadence** — inspected `/root/scripts/oc-reap-subagents.sh`. It only reaps orphaned `claude` subagents / `claude|acp` node companions older than 120 min; it does **not** govern the `openclaw-hooks` codex processes that caused this OOM. The hooks are short-lived bursts (drained to 0 on their own), so tightening the timer would not have prevented this and would give false confidence. Left as-is.

## Optional future follow-ups (not urgent; not done)
- Stagger `parser-daily-audit` off active morning hours to avoid collision with live chat.
- Cap concurrent codex sessions in the OpenClaw gateway.
