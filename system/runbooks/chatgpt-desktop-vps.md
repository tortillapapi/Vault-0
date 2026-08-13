---
type: system-runbook
title: ChatGPT Desktop VPS Front Door
slug: chatgpt-desktop-vps
last_verified: 2026-08-13
maintainer: codex
tags: [chatgpt, codex, voice, vps, mcp]
---

# ChatGPT Desktop VPS Front Door

Use this page as the neutral starting context for ChatGPT Work, Codex, and Voice. It exposes shared operating knowledge without exposing any harness's private session history.

## Operating model

- ChatGPT desktop is the primary-interface pilot on Mac.
- Hermes/Janus remains available for Telegram, scheduled work, orchestration, and fallback during the evaluation.
- GitHub contains only part of the VPS. Use `Papi VPS Tools` for live, local-only repositories and shared operational files.
- Voice may investigate, start, and coordinate tasks, but every MCP tool call is configured for visible approval during the pilot.

## Read first

1. [[../cheatsheets/operating-rules|Operating Rules]]
2. [[../resources/registry|Resource Registry]]
3. [[../workflows/peer-orchestrator-protocol|Peer Orchestrator Protocol]] when coordinating shared specs or agents
4. [[../../core-index|Vault Index]] for topic and project navigation

## VPS access boundary

- The desktop app reaches `Papi VPS Tools` through a Mac loopback SSH tunnel over Tailscale.
- Reads cover ordinary operational paths under `/root`; hidden state, credentials, secrets, backups, and private harness state fail closed.
- Never request or infer access to `/root/.hermes`, `/root/.claude`, `/root/.codex`, `/root/.openclaw`, `/root/.ssh`, `/root/.gnupg`, or `/root/secrets`.
- `replace_text` is the only write tool. It requires an exact prior SHA-256, changes one exact occurrence, and creates a dated backup.
- Pilot writes cover shared coordination files and selected application repositories. Scripts, systemd, n8n, gateways, browser automation, finance data, and other live operational surfaces remain read-only.
- There is no arbitrary shell, create, delete, database mutation, or service-control tool.
- Vault writes use the normal Git pull/rebase/commit/push workflow, not the MCP write tool.

## Shared working surfaces

- `/root/specs` — immutable specification audit trail
- `/root/tasks` — prompts and completion/progress markers
- `/root/reviews` — review audit trail
- `/root/context` — explicit cross-session handoffs
- `/root/obsidian-vault/system` — shared governance and current operating knowledge

Before writing, check for active work and avoid two agents changing the same checkout. Keep Hermes as fallback until the desktop pilot has demonstrated reliable read, write, approval, Voice, and recovery behavior.
