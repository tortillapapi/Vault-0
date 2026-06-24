---
type: system-project
title: Orders Dashboard
slug: orders-dashboard
last_synced: 2026-05-21
maintainer: cc-oc-orchestrator
tags: [project, dashboard, flask]
---

# Orders Dashboard

**Status:** v1.0 SHIPPED 2026-04-27 (specs 42, 43, 44). Stable ship line.

- **Live at:** `http://srv1535917.hstgr.cloud:5002/d/<token>/` (token in
  `/root/secrets/orders-dashboard/url-token.txt`; needs `ufw allow 5002/tcp`).
- **Source (DEPRECATED 2026-06-24):** Gemini Orders Master Sync sheet (All tab),
  `1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`. This is a legacy dashboard-era
  source. The active parser master and source of truth is **Purchase Log - Master**
  (`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`). The dashboard's hourly pull
  via `orders-pull.timer` (Vertex SA credential, readonly) still reads the legacy sheet;
  repointing the dashboard to the active master is deferred.
- **Tech:** Flask + gunicorn + SQLite cache + Bootstrap + DataTables + Chart.js.
  systemd: `orders-dashboard.service`, `orders-pull.timer`.
- **Wiki topic page:** `/root/obsidian-vault/wiki/topics/orders-dashboard.md`.

## v2 backlog — LOW PRIORITY (do NOT pitch unsolicited)
User (2026-04-27): "stable, actionable version… upgrade later if needed." Candidates
only if asked: per-row totals override, email-thread linkback, date-range presets,
CSV export, compact Notion-friendly view, auth/token rotation, multi-user views.
Bugs in v1.0 are fixes (ship in-place), not v2.
