---
type: handoff
title: Profit Engine Evergreen Session Handoff
created: 2026-06-29
updated: 2026-06-29
owner: hermes
status: current
project: profit-engine
tags: [handoff, profit-engine, evergreen, reseller-finance]
---

# Profit Engine Evergreen Session Handoff

## One-line summary

Papi has a trustworthy, accepted 2026 YTD Profit Engine net-profit v1 report and a spreadsheet-first view uploaded to his `mramirez021111` Google Drive. Treat Profit Engine as a constantly-upgraded business finance command center.

## Current user intent

- Spreadsheet is the preferred viewing surface for now.
- Dashboard is deferred until the workbook shows what extra views are worth building.
- Next substantive work: fix/fill missing eBay info, then regenerate report/spreadsheet.

## Current accepted artifacts

- Final report MD: `/root/sales-data/reports/profit/net-profit-v1-20260629T022201Z.md`
- Final report JSON: `/root/sales-data/reports/profit/net-profit-v1-20260629T022201Z.json`
- Spreadsheet workbook: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260629T024930Z.xlsx`
- Spreadsheet Google Drive file: `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx`
- Drive owner: `mramirez021111@gmail.com`
- Drive file ID: `1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`

## Accepted headline numbers

- Revenue: `$107,882.49`
- COGS: `$53,043.84`
- Gross profit: `$54,838.65`
- Marketplace fees: `$39,831.00`
- Refunds: `$5,452.74`
- Adjustments/reimbursements: `$5,528.73`
- Net profit: `$15,083.64`
- Net margin: `14.0%`

## Specs/tasks/reviews

- Spec 153: `/root/specs/153-profit-engine-financial-events-net-profit.md` — complete.
- Spec 154: `/root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md` — Phase 1 complete, Phase 2 pending.
- Phase 153 report marker: `/root/tasks/153_3-net-profit-v1-report.done`
- Phase 154 spreadsheet marker: `/root/tasks/154_1-profit-engine-spreadsheet-view.done`
- Final report review: `/root/reviews/153_3-net-profit-v1-report.final-review.md` — ACCEPTED.
- Spreadsheet review: `/root/reviews/154_1-profit-engine-spreadsheet-view.review.md` — ACCEPT.

## Next phase recommendation

Create/dispatch Spec 154 Phase 2 task(s):

1. Diagnose why eBay finance API returns zero events for the current token/window.
2. Backfill real eBay finance events if available; create DB backup before mutation.
3. Fill 4 unmatched eBay COGS rows / `$1,494.99` unmatched revenue.
4. Rerun Profit Engine report, rerun tests, safety-scan aggregate outputs.
5. Re-export and upload refreshed spreadsheet to mramirez Drive.

## Caveats to preserve

- Ads excluded / `$0` by Papi's direction.
- Tax excluded by Papi's direction.
- FIFO deferred.
- Amazon has 702 undated `ServiceFee` rows totaling `-$3,144.72`; included in totals but not date-bucketable.
- eBay finance events currently `0`, so eBay profit is overstated.
- eBay COGS is partial: 3/7 rows matched, 4 unmatched rows, `$1,494.99` unmatched revenue.
- Keep all outputs aggregate-only; never expose buyer PII/raw order IDs/item titles/raw marketplace IDs/addresses/secrets/sensitive hashes.
