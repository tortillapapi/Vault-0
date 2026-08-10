# Metis Telegram Gateway

Metis = the Claude Code (CC) orchestrator, reachable over Telegram at
**@RareForce_Metis_Bot**. Lets the user orchestrate / edit on the VPS from mobile,
at parity with Janus (Hermes) and the OC fleet. Live since 2026-06-06.

## Architecture
- `/root/metis-gateway/gateway.py` — a Python daemon, the **sole** Telegram
  getUpdates consumer for the Metis bot. No other process may poll this token.
- Whitelisted to one Telegram user id; all other senders are silently dropped.
- Drives Claude via the **Python Agent SDK** (`claude-agent-sdk`,
  `ClaudeSDKClient`), one persistent client per chat for conversation continuity,
  working dir `/root`. The SDK uses its own bundled `claude` binary; auth requires
  `HOME=/root` (set in the unit).

## The permission gate
Every tool call passes through a **PreToolUse hook**:
- Read-only tools (Read/Glob/Grep/LS/NotebookRead/TodoWrite) auto-allow.
- Everything else (Bash/Write/Edit/network/Task/MCP/...) sends an Approve/Deny
  inline-button prompt to the user's Telegram and blocks until they tap.
- Fail-safe: timeout (300s) / send-error / unknown → DENY. No
  `--dangerously-skip-permissions`. `setting_sources=[]` so no external allow-rule
  can bypass the hook.
- Note: the CLI flag `--permission-prompt-tool` does not exist in this version, and
  the SDK `can_use_tool` callback is not consulted in permission_mode=default
  (fail-open) — the PreToolUse hook is the authoritative mechanism.

## Files & paths
- Code/state: `/root/metis-gateway/` (`gateway.py`, `metis-gateway.service`,
  `requirements.txt`, `state/sessions/`, `state/audit.log`).
- Secret (token + allowed user id): `/root/secrets/metis-gateway/gateway.env`
  (chmod 600; /root is not a git repo). Never commit or echo the token.
- Audit log: `state/audit.log` — one line per decision (ISO ts | chat | tool |
  allow/deny/deny-timeout | summary). Summaries only, never secret values.

## Service ops
- `systemctl status|restart|stop metis-gateway`
- Logs: `journalctl -u metis-gateway -f`
- After editing the token or code: `systemctl restart metis-gateway`.
- If Telegram shows `Command failed with exit code 143`, the Claude Code subprocess was SIGTERM'd while the Python gateway survived. Current gateway code resets that chat client and asks the user to resend the last request; restart `metis-gateway` only if it remains wedged.

## What Metis is, in protocol terms
Metis is **a surface of CC, not a separate peer** — the same `/root/CLAUDE.md`
behavior reached over Telegram, with `cwd=/root` pinned by the gateway. It signs specs
and reviews as `metis` so Telegram-origin work stays traceable. See
[[system/workflows/peer-orchestrator-protocol]].

The gateway system prompt deliberately suppresses the session-resume sweep — Telegram is
not the place for a status dump. That is intended behavior, not drift; see
[[system/workflows/session-resume-protocol]].

## Roster (verified 2026-08-10)
- **Metis** — Telegram-reachable CC (`@RareForce_Metis_Bot`), this gateway
- **Janus** — Hermes default profile, `gpt-5.6-luna` via `openai-codex`; the primary
  orchestrator, and now also the PA (Mnemosyne retired 2026-08-10 — see
  [[system/configs/mnemosyne-pa]])
- **Milo** — Hermes `milo` profile, fitness bot (`hermes-gateway-milo.service`)
