# dashboard-healthcheck

Mirror of the CC orchestrator skill `dashboard-healthcheck` (canonical:
`/root/.claude/skills/dashboard-healthcheck.md`).

**DECOMMISSIONED 2026-06-24 per Spec 151.** The Orders Dashboard (Flask + SQLite,
was port 5002, `/root/orders-dashboard/data/orders.db`) has been stopped,
disabled, and masked. The legacy source sheet (`1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`)
has been trashed in Google Drive. This healthcheck skill is retained for
reference only — do not run against a decommissioned service.

Read-only spot-check of the Orders Dashboard (historical): health endpoint +
row-count/last-date sanity. Revenue checks used `SUM(price)`, not
`SUM(price*quantity)` (prior double-count bug). A stale max date pointed
upstream → [[n8n-parser-triage]].

See [[orders-dashboard]].
