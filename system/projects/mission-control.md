---
type: project
title: Mission Control
slug: mission-control
created: 2026-06-02
last_updated: 2026-06-04
status: mvp
priority: core
tags: [project, dashboard, monitoring, agents, ops]
domain_tags: [infrastructure, monitoring]
specs: [85, 86, 87, 88, 105, 106, 107, 108, 109, 110]
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

- **Anthropic / Claude**: live 5h block usage from `ccusage`
  (`npx -y ccusage@latest blocks --active --json`), including tokens, cost, burn
  rate, and reset time.
- **OpenAI / ChatGPT**: Codex rollout `payload.rate_limits`, using the scoped
  carve-out documented in `CLAUDE.md`: only the `rate_limits` field may be read
  from Codex rollout JSONL. The collector prefers embedded OpenClaw Codex homes
  under `/root/.openclaw/agents/{main,lead,mid,pa}/agent/codex-home/sessions/`
  and falls back to `/root/.codex/sessions/`; no prompts, responses, auth, or
  transcript content are read.
- **DeepSeek / Qwen (opencode-go)**: best-effort live percentages from the
  opencode.ai dashboard scrape, plus local OpenClaw health/token signals. Local
  signals include auth-state cooldown/last-used/rate-limit data and bounded
  token rollups from recent OpenClaw logs. The opencode scrape reads
  `/root/secrets/mission-control/opencode.env` only and parses the dashboard RSC
  payload for rolling, weekly, and monthly windows; absent or expired credentials
  degrade to a visible non-breaking state.
- **Gemini**: manual limits via `usage_limits.yaml`; local last-used/token
  signals may appear when available, but quota windows are not automatically
  readable yet.

Refresh model:

- `mission-control-usage.timer` runs every 5 minutes.
- `mission-control-usage.service` calls
  `/root/mission-control/scripts/refresh-usage.sh`.
- The refresher writes `/root/mission-control/state/usage-snapshot.json`
  atomically; the web page reads that snapshot so page loads do not spawn live
  collectors.

Manual and credential maintenance:

- Edit manual ceilings/display names in `/root/mission-control/usage_limits.yaml`.
  This is for non-secret provider limits and fallback windows only.
- Use `bash /root/mission-control/scripts/set-opencode-creds.sh` to set or
  refresh opencode.ai credentials. The helper writes
  `/root/secrets/mission-control/opencode.env` at mode 0600 with
  `OPENCODE_WORKSPACE_ID` and `OPENCODE_AUTH_COOKIE`; real secrets stay outside
  the vault.

## Future backlog

- Controlled spec creation (low-risk hand-off from orchestrator to dashboard)
- Dispatch controls (pre-approved dispatch surface)
- Public access decision (Caddy proxy + auth hardening)
- Office / mobile-friendly view
- Richer search and full-text indexing
