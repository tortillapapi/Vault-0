---
type: core-index
last_updated: 2026-08-01
---

# Core Index — Always-Load Pages

## System Architecture
- [[system/workflows/peer-orchestrator-protocol]] — CC + Codex CLI shared conventions
- [[system/workflows/orchestrator-role]] — orchestrator workflow (plan, dispatch, review)
- [[system/workflows/tier-routing]] — OC tier dispatch matrix
- [[system/decisions/2026-04-fallback-pipeline]] — why openclaw agent subprocess pattern
- [[system/decisions/2026-04-tier-agents]] — tiered agent design rationale

## Active Services
- openclaw-gateway — always running
- n8n Order Parser — daily Gmail order parsing; now at `https://n8n.rareforceone.cloud` (Caddy proxy). Recovered 2026-05-26 from ~11-day OAuth outage (consent screen now Published). Parser runtime is `order-parser.timer` (systemd, 09:00 PT / 16:00 UTC); the n8n workflows are retired-but-retained (see [[wiki/topics/n8n-order-parser]]). Daily accuracy audit is `hermes-parser-audit.timer` at 09:20 PT / 16:20 UTC, ongoing (no end date) → log `system/logs/n8n-parser-daily-check.md`. Deterministic health check `parser-healthcheck.timer` at 09:35 PT / 16:35 UTC (no LLM — Spec 214)
- Orders Dashboard — DECOMMISSIONED 2026-06-24 per Spec 151; runtime stopped/disabled/masked, legacy sheet trashed. See [[wiki/topics/orders-dashboard]]
- cleanup-inventory-tracker.timer — scheduled 2026-05-27, archives the decommissioned inventory-tracker workspace permanently

## Historical (kept for reference, not active)
- [[wiki/topics/inventory-tracker-pipeline]] — ARCHIVED 2026-04-27 (pipeline shut down per spec 36, code archived per spec 37)
- [[system/decisions/2026-04-inventory-pipeline-ops]] — historical context

## Key Paths
- Vault: /root/obsidian-vault/
- CC orchestrator file: /root/CLAUDE.md
- Codex orchestrator file: /root/AGENTS.md
- Peer protocol: /root/obsidian-vault/system/workflows/peer-orchestrator-protocol.md
- Specs/tasks/reviews: /root/specs/, /root/tasks/, /root/reviews/ (shared)
- Ops helper scripts: /root/scripts/ (sheets-read.sh, gmail-orders-list.sh, verify-done-files.sh)
- Archived inventory-tracker: /root/archive/inventory-tracker-old-2026-04/

## OC Agent Roster (live routing, 2026-08-01)
- mid — openai/gpt-5.6-luna (default GPT escalation/review, xhigh)
- lead — openai/gpt-5.6-sol (explicit-only exceptional escalation, xhigh)
- grunt-eng — opencode-go/deepseek-v4-flash (bounded engineering, medium)
- grunt — opencode-go/deepseek-v4-flash (mechanical/docs, medium)
- re-review — opencode-go/glm-5.2 (first-pass QA, medium)
- email-parser — google/gemini-2.5-flash (email parsing only)
