---
type: project
title: Mission Control
slug: mission-control
created: 2026-06-02
last_updated: 2026-07-14
status: mvp
priority: core
tags: [project, dashboard, monitoring, agents, ops]
domain_tags: [infrastructure, monitoring]
specs: [85, 86, 87, 88, 105, 106, 107, 108, 109, 110, 183]
---

# Mission Control

A read-only cockpit for the VPS agent fleet — surfaced as a local Flask web app.

## Purpose & scope

Mission Control provides a single-pane view over the running OpenClaw agent fleet,
their task/completion/review/blocker state, scheduled cron jobs, and a quick-search
surface. It is a **derived view** over canonical state — it never creates, edits, or
deletes anything.

> **Obsidian/vault remains canonical.** Mission Control reads from it; it does not
> compete with it.

## Paths & service

| Thing | Detail |
|---|---|
| Location | `/root/mission-control` |
| Service | `mission-control.service` (systemd user) |
| Bind | `127.0.0.1:5003` |
| Auth | Token-in-URL (token stored at `/root/secrets/mission-control/url-token.txt`, mode 0600) |

## Security boundary

- **Local-only** — binds `127.0.0.1`, not reachable externally.
- **Token-protected** — every request must carry the correct URL token.
- **Read-only** — no write actions, no dispatch, no agent steering.
- **No public route yet** — future Caddy proxy or SSH tunnel will require a user decision.

## Data sources

- `/root/specs/`, `/root/tasks/`, `/root/reviews/` — orchestration state
- `/root/obsidian-vault/system/` — shared ops knowledge
- `/root/context/` — session-resume state
- OpenClaw agent roster (`openclaw agents list --json`) and session status
- Cron job state (`openclaw cron list`)
- Systemd timer status (`systemctl --user list-timers`)
- Lock files (`.lock`, `.progress`) for concurrency awareness

## Usage Tracker

Mission Control has a read-only Usage tab for per-provider AI subscription
usage. The UI emphasizes active windows first: reset countdown bars show how much
of each rolling/weekly/monthly window is used and when it resets. Cost and burn
rate are secondary details when a provider exposes them.

Routes:

- Page: `/d/<token>/usage`
- JSON: `/d/<token>/api/usage`

Provider sources:

- **Anthropic / Claude**: live OAuth usage API (`GET /api/oauth/usage`).
  Dynamic `limits` array parsed for `Current session`, `All models` (weekly),
  and scoped models such as `Fable only`. Real `resets_at` timestamps preserved;
  credential is the existing Claude Code OAuth token. On failure the card
  degrades with a sanitized actionable error — no fallback to local estimates.
- **OpenAI / ChatGPT**: live WHAM usage endpoint
  (`https://chatgpt.com/backend-api/wham/usage`) per account using its own
  OAuth credential. Two separate cards with stable unique provider IDs:
  `OpenAI — mramirez021111@gmail.com` (auth: `/root/.codex/auth.json`,
  read-only) and `OpenAI — themetalman13@gmail.com` (auth:
  `/root/.hermes/auth.json`, read-only). Each account fails and recovers
  independently. Account IDs and OAuth tokens are never exposed in
  snapshot/UI/logs/errors.
- **OpenCode (DeepSeek + Qwen)**: best-effort live percentages from the
  opencode.ai dashboard scrape, plus local OpenClaw health/token signals. Local
  signals include auth-state cooldown/last-used/rate-limit data and bounded
  token rollups from recent OpenClaw logs. The opencode scrape reads
  `/root/secrets/mission-control/opencode.env` only and parses the dashboard RSC
  payload for rolling, weekly, and monthly windows; absent or expired credentials
  degrade to a visible non-breaking state.
- **Gemini**: removed from the Usage Tracker.

Reset timestamps render in `America/Los_Angeles` (PDT/PST).

Refresh model:

- `mission-control-usage.timer` runs every 5 minutes.
- `mission-control-usage.service` calls
  `/root/mission-control/scripts/refresh-usage.sh`.
- The refresher writes `/root/mission-control/state/usage-snapshot.json`
  atomically; the web page reads that snapshot so page loads do not spawn live
  collectors.

Manual and credential maintenance:

- `usage_limits.yaml` is a deprecated stub and no longer used for provider
  ceilings. Do not edit it for quota purposes.
- Use `bash /root/mission-control/scripts/set-opencode-creds.sh` to set or
  refresh opencode.ai credentials. The helper writes
  `/root/secrets/mission-control/opencode.env` at mode 0600 with
  `OPENCODE_WORKSPACE_ID` and `OPENCODE_AUTH_COOKIE`; real secrets stay outside
  the vault.
- Auth store paths for the usage collectors are read-only:
  `/root/.codex/auth.json`, `/root/.hermes/auth.json`, and the Claude Code
  OAuth credential. These paths are named for reference only; values and IDs
  must never be logged, snapshot-rendered, or included in errors.

## Git remote

Mission Control project repo has no Git remote. Current local HEAD `c54a69a`.
This is an operational caveat — local commits only, no push target.

## Future backlog

- Controlled spec creation (low-risk hand-off from orchestrator to dashboard)
- Dispatch controls (pre-approved dispatch surface)
- Public access decision (Caddy proxy + auth hardening)
- Office / mobile-friendly view
- Richer search and full-text indexing
