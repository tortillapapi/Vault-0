---
type: system-project
title: Profit Engine
slug: profit-engine
created: 2026-06-29
last_updated: 2026-06-30
status: evergreen-active
priority: high
owner: hermes
tags: [project, finance, reseller, profit-engine, amazon, ebay, evergreen]
---

# Profit Engine

## Status

**Evergreen / constantly upgrading.** This is Papi's durable reseller-finance command center: ingestion, COGS coverage, reconciliation, spreadsheet views, and eventually dashboards/automation when they are worth it.

Current preferred view: **spreadsheet first**. Dashboard work remains deferred until the workbook proves what views actually matter.

## Current accepted state

Spec 153 completed the first trustworthy 2026 YTD net-profit v1 report after Amazon finance repair and independent review.

Spec 154 Phase 1 completed the spreadsheet view and uploaded it to Papi's `mramirez021111` Google Drive.

Spec 154 Phase 2 closed the eBay OAuth + COGS gap after Papi provided the eBay Cert ID and four manual buy-cost values. eBay COGS coverage is now **7/7 matched, 0 unmatched**.

Current handoff: [[profit-engine-ebay-gap-handoff-2026-06-30]].  
Previous handoff: [[profit-engine-handoff-2026-06-29]].

### Accepted report artifacts

- Markdown: `/root/sales-data/reports/profit/net-profit-v1-20260630T083559Z.md`
- JSON: `/root/sales-data/reports/profit/net-profit-v1-20260630T083559Z.json`

### Spreadsheet artifacts

- Local workbook: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z.xlsx`
- Handoff: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z-handoff.md`
- Earlier Drive copy from Phase 1: `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx`
- Drive owner: `mramirez021111@gmail.com`
- Drive file ID: `1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`
- Drive link: `https://docs.google.com/spreadsheets/d/1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR/edit?usp=drivesdk&ouid=106454522528803298522&rtpof=true&sd=true`

## Latest accepted headline numbers

2026 YTD v1 after eBay COGS closure:

- Revenue: `$107,882.49`
- COGS: `$54,211.95`
- Gross profit: `$53,670.54`
- Gross margin: `49.8%`
- Marketplace fees: `$39,831.00`
- Refunds: `$5,452.74`
- Adjustments/reimbursements: `$5,528.73`
- Net profit: `$13,915.53`
- Net margin: `12.9%`

Platform notes:

- Amazon net profit: `$12,598.45` / `12.0%` margin on `$104,717.52` revenue. Amazon COGS matched **1,569/1,569**.
- eBay COGS: `$1,847.89`, matched **7/7**, unmatched **0**.
- eBay reported net is still overstated until eBay finance events are ingested because `ebay_fin_events = 0`.

## Data quality caveats to carry forward

- Ads are excluded / treated as `$0` by Papi's direction.
- Tax is excluded by Papi's direction.
- FIFO purchase-lot COGS is deferred; current reports use active COGS observations.
- Amazon finance repair is accepted, but 702 undated `ServiceFee` rows totaling `-$3,144.72` are included in totals and cannot be cleanly date-bucketed.
- eBay COGS/OAuth gap is closed.
- `ebay_fin_events = 0`; eBay fees/refunds/shipping-label purchases/seller credits/payout adjustments are not yet available in net profit.
- Reports and spreadsheet views must remain aggregate-only: no buyer PII, raw order IDs, item titles, raw marketplace identifiers, addresses, secrets, or sensitive hashes.

## Source of truth and shared trail

Specs:

- `/root/specs/153-profit-engine-financial-events-net-profit.md` — complete.
- `/root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md` — eBay OAuth + COGS gap closed; finance-events caveat remains separate follow-up.

Key task markers:

- `/root/tasks/153_2_5-amazon-finance-live-db-repair.done`
- `/root/tasks/153_3-net-profit-v1-report.done`
- `/root/tasks/154_1-profit-engine-spreadsheet-view.done`
- `/root/tasks/154-profit-engine-ebay-gap-closure.done`
- `/root/tasks/154_6-ebay-finance-events-ingestion.txt` — next task prompt, not yet executed.

Reviews:

- `/root/reviews/153_2_5-amazon-finance-live-db-repair.re-review.md` — ACCEPT.
- `/root/reviews/153_2_5-amazon-finance-live-db-repair.mid-review.md` — ACCEPT.
- `/root/reviews/153_3-net-profit-v1-report.final-review.md` — ACCEPTED.
- `/root/reviews/154_1-profit-engine-spreadsheet-view.review.md` — ACCEPT.
- `/root/reviews/154_4-ebay-gap-closure.review.md` — ACCEPT.

Operational DB and code:

- DB: `/root/sales-data/db/sales.db`
- Report generator: `/root/sales-data/scripts/profit_report.py`
- Spreadsheet exporter: `/root/sales-data/scripts/export_profit_spreadsheet.py`
- COGS coverage reference: `/root/sales-data/scripts/cogs_coverage_report.py`
- eBay sync: `/root/sales-data/lib/sales/ebay_sync_engine.py`
- eBay API client: `/root/sales-data/lib/sales/ebay_client.py`

## Upgrade roadmap

### Next immediate phase: eBay finance-events ingestion

1. Verify OAuth token has correct eBay Sell Finances scope(s), redacted.
2. Add a non-secret diagnostics command/report for Finances API calls.
3. Test transaction/payout/order-earnings endpoints and date filters.
4. Persist finance transactions idempotently into `ebay_fin_events` if returned.
5. Re-run Profit Engine report/spreadsheet.
6. Confirm either `ebay_fin_events > 0` or a verified upstream/no-data reason.

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
- Do not print or log eBay Cert ID, client secret, refresh/access tokens, Google creds, DB creds, order IDs, buyer PII, addresses, or sensitive hashes.
