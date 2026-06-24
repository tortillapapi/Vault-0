---
type: system-project
title: Orders Dashboard
slug: orders-dashboard
last_synced: 2026-06-24
maintainer: cc-oc-orchestrator
tags: [project, dashboard, flask, decommissioned]
---

# Orders Dashboard — DECOMMISSIONED

**Status:** DECOMMISSIONED 2026-06-24 per Spec 151.

The dashboard runtime is stopped, disabled, and masked. The legacy source
sheet `DEPRECATED — Orders Master (legacy; use Purchase Log - Master)`
(`1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`) has been trashed in Google
Drive. The active parser master `Purchase Log - Master`
(`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`) remains unchanged.

## Decommission Details
- **Backup dir:** `/root/backups/orders-dashboard-decommission-20260624T194544Z/`
- **Legacy sheet backup:** `.xlsx` export in backup dir; trashed in Drive.
- **Dashboard units:** `orders-dashboard.service`, `orders-pull.timer`,
  `orders-pull.service`, `orders-dashboard-7day-check.timer`,
  `orders-dashboard-7day-check.service` — all stopped, disabled, masked.
- **Port 5002:** Nothing listening on `127.0.0.1:5002`.
  (Tailscale DERP uses port 5002 on its own IPs — unrelated.)
- **Source tree:** `/root/orders-dashboard/` remains on disk with
  `DECOMMISSIONED.md` marker; not deleted.
- **Rollback:** See `/root/orders-dashboard/DECOMMISSIONED.md`.

## Pre-Decommission History (archival)

- **Was Live at:** `http://srv1535917.hstgr.cloud:5002/d/<token>/` (token in
  `/root/secrets/orders-dashboard/url-token.txt`; needed `ufw allow 5002/tcp`).
- **Source (DEPRECATED 2026-06-24):** Gemini Orders Master Sync sheet (All tab),
  `1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`. This was a legacy
  dashboard-era source. The active parser master and source of truth is
  **Purchase Log - Master**
  (`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`).
- **Was Tech:** Flask + gunicorn + SQLite cache + Bootstrap + DataTables + Chart.js.
  systemd: `orders-dashboard.service`, `orders-pull.timer`.
- **Wiki topic page:** `/root/obsidian-vault/wiki/topics/orders-dashboard.md`.

## v2 backlog — CANCELLED (dashboard decommissioned)
v2 backlog is void. User did not want this dashboard.
