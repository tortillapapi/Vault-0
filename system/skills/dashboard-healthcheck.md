# dashboard-healthcheck

Mirror of the CC orchestrator skill `dashboard-healthcheck` (canonical:
`/root/.claude/skills/dashboard-healthcheck.md`).

Read-only spot-check of the Orders Dashboard (Flask + SQLite, port 5002,
`/root/orders-dashboard/data/orders.db`): health endpoint + row-count/last-date
sanity. Revenue checks use `SUM(price)`, not `SUM(price*quantity)` (prior
double-count bug). A stale max date points upstream → [[n8n-parser-triage]].
v2 backlog is LOW priority — do not pitch unsolicited.

See [[orders-dashboard]].
