---
type: topic
title: Orders Dashboard
slug: orders-dashboard
created: 2026-04-27
last_updated: 2026-04-27
tags: [ops, dashboard, orders, sheets, gemini]
thesis_version: 1
priority: core
domain_tags: [dashboard, pipeline]
last_accessed: 2026-04-27
access_count: 0
---

## Current Thesis

The Orders Dashboard is a Flask-based web interface that visualizes purchase order data from the Gemini Orders master sync system. It provides a lightweight, read-only view into the consolidated order sheet without requiring direct Google Sheets access. The dashboard serves time-series charts, retailer breakdowns, and item-level summaries suitable for quick status checks and inventory oversight.

## Supporting Evidence

- Data source: Orders — Master sheet (All tab) via Google Sheets API
- Sync mechanism: Pulls hourly via `orders-pull.timer` systemd unit
- Visualization: Chart.js for time-series and categorical breakdowns
- Authentication: Token-in-URL pattern with rotation capability
- Deployment: systemd-managed service on port 5002

## Architecture

Upstream source: [[docs/gemini-orders-master-sync]] — the Gemini Orders master sync system provides the canonical order data. The dashboard does not write back to Sheets; it is a read-only consumer of the All tab.

Components:
- **Flask app** (`orders-dashboard.service`) — serves the web UI
- **SQLite cache** — local copy of sheet data for fast queries
- **Chart.js** — client-side rendering of purchase trends and summaries
- **Sheets API client** — Vertex AI service account with readonly scope

## URL + Token Rotation

Dashboard URL pattern: `http://srv1535917.hstgr.cloud:5002/d/<token>/`

Token rotation procedure:
1. Generate new random token: `openssl rand -hex 16`
2. Write to secret file: `/root/secrets/orders-dashboard/url-token.txt`
3. Reload dashboard service: `systemctl restart orders-dashboard.service`
4. Update any bookmarks or shared links
5. Old token becomes invalid immediately

**Never commit the token to git or paste it in chat.**

## systemd Units + Ports

| Unit | Type | Port | Purpose |
|------|------|------|---------|
| `orders-dashboard.service` | Service | 5002 | Flask HTTP server |
| `orders-pull.timer` | Timer | — | Hourly sheet sync trigger |
| `orders-pull.service` | Service | — | One-shot sync execution |

Service status:
```bash
systemctl status orders-dashboard.service
systemctl status orders-pull.timer
```

## Filters + Charts Present

Dashboard sections:
- **Time series**: Purchase volume over last 30/60/90 days
- **Retailer breakdown**: Pie chart of spend by retailer
- **Item grid**: Recent orders with search/filter by SKU/description
- **Status summary**: Counts by processing status (ordered, shipped, delivered)

Filters available:
- Date range (preset or custom)
- Retailer multi-select
- Item category
- Order status

## Maintenance

**Token rotation:**
- Rotate immediately if URL is shared with unintended parties
- Rotate quarterly as routine hygiene
- Procedure documented in "URL + Token Rotation" section above

**Refresh interval:**
- Automatic: hourly via `orders-pull.timer`
- Manual: `systemctl start orders-pull.service` for on-demand sync

**Pull logs:**
- systemd journal: `journalctl -u orders-pull.service -f`
- Log file: `/var/log/orders-dashboard/pull.log` (if configured)
- Failed pulls do not clear existing SQLite cache; dashboard shows stale data until next successful sync

**Common issues:**
- 403 from Sheets API → check Vertex SA key validity and scopes
- Empty dashboard → verify `orders-pull.service` last run success
- Token rejected → verify token file matches URL parameter exactly

## Related

- [[docs/gemini-orders-master-sync]] — upstream sync system
- [[decisions/gemini-orders-architecture]] — design decisions for master sync

## Sources

- /root/specs/42-orders-dashboard.md
- /root/reviews/session-2026-04-27-handoff.md

## Version

- **v1.0** — released 2026-04-27. Stable, actionable. Specs 42, 43, 44.
- v2 backlog is explicitly LOW priority per user
  (see /root/.claude/projects/-root/memory/project_order_dashboard.md).
