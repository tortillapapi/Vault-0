# n8n-parser-triage

Mirror of the CC orchestrator skill `n8n-parser-triage` (canonical:
`/root/.claude/skills/n8n-parser-triage.md`).

Use when the order-parser sheet stopped updating or to health-check the n8n
order pipeline. Triage order: (1) `healthz`, (2) **workflow active state — the
#1 cause is silent auto-deactivation**, (3) manual `docker exec` run ⚠️ which
APPENDS to the live Sheet (no dry-run mode — not a routine check), (4) safe
re-activate. Read-only probing direct; any parser/workflow fix routes to OC.

See [[n8n-order-parser]] for the pipeline itself and [[orders-dashboard]] /
[[dashboard-healthcheck]] for the downstream read surface.
