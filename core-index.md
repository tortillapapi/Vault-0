---
type: core-index
last_updated: 2026-08-10
---

# Core Index — Always-Load Pages

## System Architecture
**Precedence, one line:** live runtime beats vault `system/`; vault `system/` beats any
`/root` file; skills and per-harness files point rather than restate — and if a doc names
a model or tier, run the CLI before trusting it.

- [[system/workflows/peer-orchestrator-protocol]] — **the shared contract** for every
  orchestrator (Hermes/Janus primary; CC/Metis and Codex on request)
- [[system/configs/openclaw-agents]] — **canonical** agent roster + tier routing
- [[system/cheatsheets/operating-rules]] — **canonical** standing rules
- [[system/workflows/session-resume-protocol]] — per-harness resume behavior
- [[system/decisions/2026-04-fallback-pipeline]] — why openclaw agent subprocess pattern
- [[system/decisions/2026-04-tier-agents]] — tiered agent design rationale

## Active Services
- openclaw-gateway — always running
- n8n Order Parser — daily Gmail order parsing; now at `https://n8n.rareforceone.cloud` (Caddy proxy). Recovered 2026-05-26 from ~11-day OAuth outage (consent screen now Published). Parser runtime is `order-parser.timer` (systemd, 09:00 PT / 16:00 UTC); the n8n workflows are retired-but-retained (see [[wiki/topics/n8n-order-parser]]). Daily accuracy audit is `hermes-parser-audit.timer` at 09:20 PT / 16:20 UTC, ongoing (no end date) → log `system/logs/n8n-parser-daily-check.md`. Deterministic health check `parser-healthcheck.timer` at 09:35 PT / 16:35 UTC (no LLM — Spec 214)
- Orders Dashboard — DECOMMISSIONED 2026-06-24 per Spec 151; runtime stopped/disabled/masked, legacy sheet trashed. See [[wiki/topics/orders-dashboard]]
- cleanup-inventory-tracker.timer — scheduled 2026-05-27, archives the decommissioned inventory-tracker workspace permanently
- notion-sync.timer — VPS→Notion state push + Notion→vault inbox capture + Google Tasks, every 30 min 06:00–21:30 PT. **LIVE since 2026-08-05**; token at `/root/secrets/notion/token`. Sole writer to the Notion Task Database since the n8n `Google Tasks <-> Notion Tasks Hourly Sync` was deactivated 2026-08-05 (100% failure rate on a deleted OAuth client; all four n8n workflows are now `active=f`). Staleness canary: `Last Activity` on an active project older than 24h means the sync stopped. See [[system/workflows/notion-sync-protocol]]

## Historical (kept for reference, not active)
- [[wiki/topics/inventory-tracker-pipeline]] — ARCHIVED 2026-04-27 (pipeline shut down per spec 36, code archived per spec 37)
- [[system/decisions/2026-04-inventory-pipeline-ops]] — historical context

## Key Paths
- Vault (VPS clone): /root/obsidian-vault/
- Vault (MacBook clone): ~/Documents/Obsidian/Vault-0/ — same GitHub remote, synced only
  through `git@github.com:tortillapapi/Vault-0.git`; the two clones never talk directly.
  Mac-session notes: ~/Documents/Obsidian/CLAUDE.md
- Hermes/Janus (primary orchestrator): /root/.hermes.md
- CC (plain by default; Metis = CC over Telegram): /root/CLAUDE.md
- Codex CLI (dormant): /root/AGENTS.md
- Opt-in CC/Codex orchestrator mode: /root/ORCHESTRATOR.md
- Peer protocol: /root/obsidian-vault/system/workflows/peer-orchestrator-protocol.md
- Specs/tasks/reviews: /root/specs/, /root/tasks/, /root/reviews/ (shared)
- Ops helper scripts: /root/scripts/ (sheets-read.sh, gmail-orders-list.sh, verify-done-files.sh)
- Notion sync package: /root/scripts/notion_sync/ (`PYTHONPATH=/root/scripts python3 -m notion_sync.sync --check`)
- Notion workspace: "Manuel Ramirez's Space" — Master Page `4442508b-7644-83e2-8510-01a99cf57b9a`; START SCREEN, VPS Command Center, Vault Library, Database Hub, How To Play. Contract: [[system/workflows/notion-sync-protocol]] · usage model: [[system/workflows/notion-usage-guide]]
- Archived inventory-tracker: /root/archive/inventory-tracker-old-2026-04/

## OC Agent Roster
Do not maintain a second copy here. Roster and routing:
[[system/configs/openclaw-agents]]. Live truth: `openclaw agents list --json`.
