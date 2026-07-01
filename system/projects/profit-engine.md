---
type: system-project
title: Profit Engine
slug: profit-engine
created: 2026-06-29
last_updated: 2026-07-01
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

Spec 154 Phase 6 closed the eBay Sell Finances ingestion gap. `ebay_fin_events` now contains 18 events from `/sell/finances/v1/transaction`, with bounded/chunked date windows, idempotent writes, automatic pre-sync backups, and accepted `re-review`/Qwen review.

Spec 158 checked off the remaining caveats/Amazon blocker audit and eBay TRANSFER semantics. Amazon SP-API credentials are present/config-valid, so the old credential blocker is stale. Observed eBay TRANSFER rows are `booking_entry=CREDIT`, `transactionMemo=TRANSFER_FROM`, and `transaction_status=PAYOUT`; they are included in P&L as adjustments with a partial-verification caveat for future DEBIT variants.

Current handoff: [[profit-engine-ebay-gap-handoff-2026-06-30]].  
Previous handoff: [[profit-engine-handoff-2026-06-29]].

### Accepted report artifacts

- Markdown: `/root/sales-data/reports/profit/net-profit-v1-20260701T044751Z.md`
- JSON: `/root/sales-data/reports/profit/net-profit-v1-20260701T044751Z.json`

### Spreadsheet artifacts

- Local workbook: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z.xlsx`
- Handoff: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z-handoff.md`
- Earlier Drive copy from Phase 1: `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx`
- Drive owner: `mramirez021111@gmail.com`
- Drive file ID: `1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`
- Drive link: `https://docs.google.com/spreadsheets/d/1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR/edit?usp=drivesdk&ouid=106454522528803298522&rtpof=true&sd=true`

## Latest accepted headline numbers

2026 YTD v1 after eBay finance ingestion + TRANSFER semantics acceptance:

- Revenue: `$107,882.49`
- COGS: `$54,211.95`
- Gross profit: `$53,670.54`
- Gross margin: `49.8%`
- Marketplace fees: `$39,831.00`
- Refunds: `$5,452.74`
- Adjustments/reimbursements: `$5,560.53`
- Net profit: `$13,888.83`
- Net margin: `12.9%`

Platform notes:

- Amazon net profit: `$12,598.45` / `12.0%` margin on `$104,717.52` revenue. Amazon COGS matched **1,569/1,569**.
- eBay net profit: `$1,290.38` / `40.8%` margin on `$3,164.97` revenue. eBay COGS matched **7/7**, unmatched **0**.
- eBay finance events are live: 18 rows total, including 7 `SALE`, 6 `NON_SALE_CHARGE`, 1 `SHIPPING_LABEL`, and 4 `TRANSFER` rows. `SALE` transaction amounts are not counted as extra revenue; TRANSFER rows are included as adjustments based on observed `booking_entry=CREDIT` / `transaction_status=PAYOUT`.

## Data quality caveats to carry forward

- Ads are excluded / treated as `$0` by Papi's direction.
- Tax is excluded by Papi's direction.
- FIFO purchase-lot COGS is deferred; current reports use active COGS observations.
- Amazon finance repair is accepted, but 702 undated `ServiceFee` rows totaling `-$3,144.72` are included in totals and cannot be cleanly date-bucketed.
- Settlement-date vs order-date differences are inherent: finance events use posted/settlement dates, while order revenue uses order dates.
- eBay TRANSFER handling is partially verified: only `CREDIT` / `TRANSFER_FROM` / `PAYOUT` variants have been observed, and those are included in P&L as adjustments. Future `DEBIT` or otherwise different TRANSFER variants should be reviewed as they appear.
- Reports and spreadsheet views must remain aggregate-only: no buyer PII, raw order IDs, item titles, raw marketplace identifiers, addresses, secrets, or sensitive hashes.

## Source of truth and shared trail

Specs:

- `/root/specs/153-profit-engine-financial-events-net-profit.md` — complete.
- `/root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md` — eBay OAuth + COGS gap closed; eBay finance-events ingestion accepted.
- `/root/specs/158-profit-engine-caveats-and-amazon-blocker-audit.md` — complete; caveats/Amazon blocker audit + eBay TRANSFER semantics accepted.

Key task markers:

- `/root/tasks/153_2_5-amazon-finance-live-db-repair.done`
- `/root/tasks/153_3-net-profit-v1-report.done`
- `/root/tasks/154_1-profit-engine-spreadsheet-view.done`
- `/root/tasks/154-profit-engine-ebay-gap-closure.done`
- `/root/tasks/154_6-ebay-finance-events-ingestion.done`
- `/root/tasks/158_1-profit-engine-caveats-amazon-blocker-audit.done`
- `/root/tasks/158_2-ebay-transfer-semantics.done`

Reviews:

- `/root/reviews/153_2_5-amazon-finance-live-db-repair.re-review.md` — ACCEPT.
- `/root/reviews/153_2_5-amazon-finance-live-db-repair.mid-review.md` — ACCEPT.
- `/root/reviews/153_3-net-profit-v1-report.final-review.md` — ACCEPTED.
- `/root/reviews/154_1-profit-engine-spreadsheet-view.review.md` — ACCEPT.
- `/root/reviews/154_4-ebay-gap-closure.review.md` — ACCEPT.
- `/root/reviews/154_6-ebay-finance-events-ingestion-final.review.md` — ACCEPT.
- `/root/reviews/158-profit-engine-caveats-and-amazon-blocker-audit.md` — caveats/Amazon audit complete.
- `/root/reviews/158_2-ebay-transfer-semantics.review.md` — ACCEPT.

Operational DB and code:

- DB: `/root/sales-data/db/sales.db`
- Report generator: `/root/sales-data/scripts/profit_report.py`
- Spreadsheet exporter: `/root/sales-data/scripts/export_profit_spreadsheet.py`
- COGS coverage reference: `/root/sales-data/scripts/cogs_coverage_report.py`
- eBay sync: `/root/sales-data/lib/sales/ebay_sync_engine.py`
- eBay API client: `/root/sales-data/lib/sales/ebay_client.py`

## Upgrade roadmap

### Next immediate phase: guarded Amazon SP-API sync validation

Amazon SP-API credentials are present/config-valid as of Spec 158. The next implementation task should be guarded and reversible:

1. Run Amazon SP-API sync dry-run/status checks with aggregate-only output.
2. Create a SQLite backup before any live DB mutation.
3. Run the first guarded live Amazon SP-API sync if dry-run passes.
4. Re-run tests, DB integrity checks, and net profit report generation.
5. Compare report deltas and verify no secrets/PII/raw marketplace identifiers are exposed.

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
