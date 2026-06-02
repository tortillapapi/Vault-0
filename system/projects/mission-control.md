---
type: project
title: Mission Control
slug: mission-control
created: 2026-06-02
last_updated: 2026-06-02
status: mvp
priority: core
tags: [project, dashboard, monitoring, agents, ops]
domain_tags: [infrastructure, monitoring]
specs: [85, 86, 87, 88]
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

## Future backlog

- Controlled spec creation (low-risk hand-off from orchestrator to dashboard)
- Dispatch controls (pre-approved dispatch surface)
- Public access decision (Caddy proxy + auth hardening)
- Office / mobile-friendly view
- Richer search and full-text indexing
