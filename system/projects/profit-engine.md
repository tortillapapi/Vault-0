---
type: system-project
title: Profit Engine
slug: profit-engine
created: 2026-06-29
last_updated: 2026-06-29
status: evergreen-active
priority: high
owner: hermes
tags: [project, finance, reseller, profit-engine, amazon, ebay, evergreen]
---

# Profit Engine

## Status

**Evergreen / constantly upgrading.** This is not a one-and-done report project. Treat Profit Engine as Papi's durable reseller-finance command center: keep improving ingestion, COGS coverage, reconciliation, spreadsheet views, and eventually dashboards/automation when they are worth it.

Current preferred view: **spreadsheet first**. Dashboard work is deferred until it provides more value than the workbook.

## Current accepted state

Spec 153 completed the first trustworthy 2026 YTD net-profit v1 report after Amazon finance repair and independent review.

Spec 154 Phase 1 completed the spreadsheet view and uploaded it to Papi's `mramirez021111` Google Drive.

New-session handoff: [[profit-engine-handoff-2026-06-29]].

### Accepted report artifacts

- Markdown: `/root/sales-data/reports/profit/net-profit-v1-20260629T022201Z.md`
- JSON: `/root/sales-data/reports/profit/net-profit-v1-20260629T022201Z.json`

### Spreadsheet artifacts

- Local workbook: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260629T024930Z.xlsx`
- Google Drive copy: `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx`
- Drive owner: `mramirez021111@gmail.com`
- Drive file ID: `1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`
- Drive link: `https://docs.google.com/spreadsheets/d/1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR/edit?usp=drivesdk&ouid=106454522528803298522&rtpof=true&sd=true`

## Latest accepted headline numbers

2026 YTD v1:

- Revenue: `$107,882.49`
- COGS: `$53,043.84`
- Gross profit: `$54,838.65`
- Gross margin: `50.8%`
- Marketplace fees: `$39,831.00`
- Refunds: `$5,452.74`
- Adjustments/reimbursements: `$5,528.73`
- Net profit: `$15,083.64`
- Net margin: `14.0%`

Platform notes:

- Amazon net profit: `$12,598.45` / `12.0%` margin on `$104,717.52` revenue.
- eBay reported net profit: `$2,485.19` / `78.5%` margin on `$3,164.97` revenue, but this is overstated until eBay finance events are ingested.

## Data quality caveats to carry forward

- Ads are excluded / treated as `$0` by Papi's direction.
- Tax is excluded by Papi's direction.
- FIFO purchase-lot COGS is deferred; current reports use active COGS observations.
- Amazon finance repair is accepted, but 702 undated `ServiceFee` rows totaling `-$3,144.72` are included in totals and cannot be cleanly date-bucketed.
- `ebay_fin_events = 0`; eBay fees/refunds/finance adjustments are currently unavailable.
- eBay COGS is partial: 3/7 rows matched; 4 unmatched rows; `$1,494.99` unmatched revenue.
- Reports and spreadsheet views must remain aggregate-only: no buyer PII, raw order IDs, item titles, raw marketplace identifiers, addresses, secrets, or sensitive hashes.

## Source of truth and shared trail

Specs:

- `/root/specs/153-profit-engine-financial-events-net-profit.md` — complete.
- `/root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md` — Phase 1 complete; Phase 2 eBay gap closure pending.

Key task markers:

- `/root/tasks/153_2_5-amazon-finance-live-db-repair.done`
- `/root/tasks/153_3-net-profit-v1-report.done`
- `/root/tasks/154_1-profit-engine-spreadsheet-view.done`

Reviews:

- `/root/reviews/153_2_5-amazon-finance-live-db-repair.re-review.md` — ACCEPT.
- `/root/reviews/153_2_5-amazon-finance-live-db-repair.mid-review.md` — ACCEPT.
- `/root/reviews/153_3-net-profit-v1-report.final-review.md` — ACCEPTED.
- `/root/reviews/154_1-profit-engine-spreadsheet-view.review.md` — ACCEPT.

Operational DB and code:

- DB: `/root/sales-data/db/sales.db`
- Report generator: `/root/sales-data/scripts/profit_report.py`
- Spreadsheet exporter: `/root/sales-data/scripts/export_profit_spreadsheet.py`
- COGS coverage reference: `/root/sales-data/scripts/cogs_coverage_report.py`

## Upgrade roadmap

### Next immediate phase: eBay cleanup

1. Backfill/repair eBay finance events so fees/refunds/adjustments are real instead of `$0`.
2. Fill the 4 unmatched eBay COGS rows / `$1,494.99` unmatched revenue.
3. Re-run the Profit Engine net-profit report.
4. Re-export the spreadsheet and replace/upload the fresh Drive workbook.

### Later upgrades

- FIFO purchase-lot COGS allocation.
- Ads integration if/when Papi wants ad spend included.
- Tax-aware reporting if/when Papi asks; currently excluded.
- Better reconciliation against Sellerboard/BoxEm exports.
- Dashboard only after spreadsheet workflow proves what views actually matter.
- Recurring refresh automation with safe backups and aggregate-only output.

## Operating rules for future sessions

- Repair/verify ingestion before final reports.
- Back up the DB before live sync/backfill/import operations.
- Treat report generation as read-only unless explicitly performing a repair/import phase.
- Use spreadsheet/workbook as the default viewing surface.
- Keep artifacts private/root-only locally (`0600`) unless Papi explicitly asks to share/upload.
- Any final report or new spreadsheet version must reconcile to source JSON/DB and pass safety scans.
- If code or finance logic changes, run tests and independent review before final closeout.
