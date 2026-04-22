---
type: core-index
last_updated: 2026-04-22
---

# Core Index — Always-Load Pages

## System Architecture
- [[topics/inventory-tracker-pipeline]] — full pipeline: Gmail→noise filter→GLM→mid→DB
- [[decisions/2026-04-fallback-pipeline]] — why openclaw agent subprocess pattern
- [[decisions/2026-04-inventory-pipeline-ops]] — tiered parser, noise filter, dashboard, billing

## Active Services
- inventory-tracker-ingest.timer — 15-min Gmail ingest (enable after tasks 25+26)
- inventory-dashboard.service — Flask dashboard port 5001
- openclaw-gateway — always running

## Key Paths
- App: /root/.openclaw/workspace/inventory-tracker/
- DB: data/inventory.db
- Dashboard: http://srv1535917.hstgr.cloud:5001
- Vault: /root/obsidian-vault/

## OC Agent Roster
- main / lead — openai-codex/gpt-5.4 (complex tasks)
- mid — openai-codex/gpt-5.3-codex (review, verification)
- grunt-eng — opencode-go/glm-5.1 (engineering)
- grunt — opencode-go/kimi-k2.5 (doc/log edits)
- email-parser — opencode-go/glm-5.1 (email parsing, primary)
