---
type: topic
title: Orders Dashboard
slug: orders-dashboard
created: 2026-04-27
last_updated: 2026-06-24
tags: [ops, dashboard, orders, sheets, gemini, decommissioned]
thesis_version: 1
priority: decommissioned
domain_tags: [dashboard, pipeline]
last_accessed: 2026-06-24
access_count: 0
---

## Current Thesis — DECOMMISSIONED 2026-06-24

The Orders Dashboard has been **decommissioned** per Spec 151. Papi is not
using it. The legacy source sheet has been trashed and the runtime is stopped,
disabled, and masked. The active parser master `Purchase Log - Master`
(`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`) remains the source of
truth.

- **Legacy sheet:** `1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k` — trashed.
- **Dashboard units:** All stopped, disabled, masked.
- **Backup dir:** `/root/backups/orders-dashboard-decommission-20260624T194544Z/`
- **Rollback:** See `/root/orders-dashboard/DECOMMISSIONED.md`.
- **Source tree:** `/root/orders-dashboard/` remains on disk (not deleted).

## Pre-Decommission History (archival)

The Orders Dashboard was a Flask-based web interface that visualized purchase
order data from the Gemini Orders master sync system. It provided a
lightweight, read-only view into the consolidated order sheet without
requiring direct Google Sheets access. The dashboard served time-series
charts, retailer breakdowns, and item-level summaries suitable for quick
status checks and inventory oversight.

## Supporting Evidence (historical)

- Data source: Orders — Master sheet (All tab) via Google Sheets API
- Sync mechanism: Pulled hourly via `orders-pull.timer` systemd unit
- Visualization: Chart.js for time-series and categorical breakdowns
- Authentication: Token-in-URL pattern with rotation capability
- Deployment: systemd-managed service on port 5002

## Architecture (historical)

Upstream source: [[docs/gemini-orders-master-sync]] — the Gemini Orders master
sync system provided the canonical order data. The dashboard did not write
back to Sheets; it was a read-only consumer of the All tab.

Components:
- **Flask app** (`orders-dashboard.service`) — served the web UI
- **SQLite cache** — local copy of sheet data for fast queries
- **Chart.js** — client-side rendering of purchase trends and summaries
- **Sheets API client** — Vertex AI service account with readonly scope

## systemd Units (all masked)

| Unit | Status |
|------|--------|
| `orders-dashboard.service` | masked |
| `orders-pull.timer` | masked |
| `orders-pull.service` | masked |
| `orders-dashboard-7day-check.timer` | masked |
| `orders-dashboard-7day-check.service` | masked |

## Related

- [[n8n-order-parser]] — replacement parser shipped in Spec 50; active.
  Legacy Orders sheet (`1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`) is
  trashed. Active parser master is `Purchase Log - Master`
  (`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`).
- [[docs/gemini-orders-master-sync]] — previous upstream sync system
- [[decisions/gemini-orders-architecture]] — design decisions for master sync

## Sources

- /root/specs/42-orders-dashboard.md
- /root/specs/151-delete-legacy-orders-master-and-decommission-dashboard.md
- /root/reviews/session-2026-04-27-handoff.md

## Version

- **DECOMMISSIONED** — 2026-06-24 per Spec 151.
- **v1.1** — updated 2026-05-15 with source-change pending note for Spec 51.
- **v1.0** — released 2026-04-27. Stable, actionable. Specs 42, 43, 44.
