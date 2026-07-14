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

Spec 159 completed the guarded Amazon SP-API sync validation. The first live sync safely ingested **73 new Amazon finance events**, after a dry-run and root-only DB backup; all post-sync tests passed, DB integrity remained clean, and final Qwen/re-review accepted the closeout. Amazon Orders API hit a transient 429 after checking 1,300/1,900 orders during the live run, but finance ingestion completed fully and the pre-sync dry-run had already shown 0 new/updated orders across all 1,900.

Spec 160 resolved the Amazon Orders throttle caveat, clarified date-basis reporting, and made FIFO forward-ready. A cooldown rerun checked **1,901 Amazon orders** with **0 new/updated** and no 429. Undated Amazon `ServiceFee` rows were audited and intentionally left unallocated because Amazon provides no deterministic per-row date; they remain included in total profit. Forward-only FIFO tables/engine/status reporting are live with boundary `2026-07-01T00:00:00Z`, 4 seeded lots / 8 units, 0 allocations, and no historical P&L impact; Qwen/re-review accepted the closeout.

Spec 160_5 completed the explicit forward-only FIFO activation requested by Papi. `python scripts/profit_report.py --with-fifo` is the guarded writable activation path and creates an automatic DB backup before allocation; ordinary reports remain read-only. Current live data has no post-boundary eligible sale items yet, so activation exercised the path with 0 allocations and no P&L impact.

Spec 161 is complete. `profit_report.py --basis order-date|statement-date|both` now emits clearly labeled operational and cash-reconciliation views with embedded guidance and reconciliation back to the accepted aggregate P&L. Parser/COGS coverage reporting is aggregate-only and shows 100% COGS coverage for current 2026 sales. After Papi approval, W1 live parser backfill completed, TheCanvasDon parsing was fixed, cancelled/refund standalone append guards were added, and the additive hashed `parser_sale_link` table/export was applied with 3 medium/title-fingerprint/pending links and no COGS/P&L semantic changes.

Current handoff: [[profit-engine-spec-161-closeout-handoff-2026-07-01]].  
Previous handoff: [[profit-engine-ebay-gap-handoff-2026-06-30]].

### Accepted report artifacts

- Markdown: `/root/sales-data/reports/profit/net-profit-v1-20260701T054025Z.md`
- JSON: `/root/sales-data/reports/profit/net-profit-v1-20260701T054025Z.json`

### Spreadsheet artifacts

- Local workbook: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z.xlsx`
- Handoff: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z-handoff.md`
- Earlier Drive copy from Phase 1: `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx`
- Drive owner: `mramirez021111@gmail.com`
- Drive file ID: `1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`
- Drive link: `https://docs.google.com/spreadsheets/d/1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR/edit?usp=drivesdk&ouid=106454522528803298522&rtpof=true&sd=true`

## Latest accepted headline numbers

2026 YTD v1 as of 2026-07-08 (Specs 168+169+170 complete, Papi-approved): adjustment
double-count removed (168), sync idempotency/cursors hardened (170, merge `e48057b`),
eBay final-value fees now captured as `SALE_FEE` events + Amazon finance catch-up
through 2026-07-08 (169, commit `9ddbd89`).
Report: `/root/sales-data/reports/profit/net-profit-v1-20260708T195024Z.{md,json}`
(+ order-date and statement-date views, same timestamp).

- Revenue: `$112,842.09`
- COGS: `$55,633.06`
- Marketplace fees: `$44,826.15`
- Net profit: `$9,756.60`
- Net margin: `8.6%`

Platform notes:

- Amazon net profit: `$9,093.96` / `8.3%` margin on `$109,677.12` revenue. COGS coverage **100%**.
- eBay net profit: `$662.64` / `20.9%` margin on `$3,164.97` revenue. COGS coverage **100%**.
  eBay marketplace fees now real: `$743.08` total incl. 21 `SALE_FEE` rows (`$627.74` final-value fees).
- Delta trail from the pre-review `$13,791.83`: −`$2,790.24` (168 double-count) −`$627.74`
  (169 eBay fees) −`$617.25` (169 Amazon July catch-up — largely late-posting fees for
  June revenue, plus a first orders catch-up adding `~$4.9k` fully-costed July revenue).
- 51 `AdjustmentItem` detail rows remain excluded from totals as duplicates of event-level
  `Adjustment` amounts (Spec 168 caveat carried in every report).
- Idempotency now count-aware (spec 170): overlapping re-syncs are safe; dup-group audit
  2026-07-08: 429 legit repeated-fee groups, no spurious duplication after live syncs.
- eBay finance events are live: 18 rows total, including 7 `SALE`, 6 `NON_SALE_CHARGE`, 1 `SHIPPING_LABEL`, and 4 `TRANSFER` rows. `SALE` transaction amounts are not counted as extra revenue; TRANSFER rows are included as adjustments based on observed `booking_entry=CREDIT` / `transaction_status=PAYOUT`.

## Business Command Center (Spec 182, 2026-07-14)

Spec 182 (owner: cc — Metis/Fable orchestrating, grunt-eng implementing,
GLM re-review QA) extended the Profit Engine into a private command center.
All seven phases accepted 2026-07-14. Root-only layer at
`/root/command-center/` (bridge.db + scripts + tests, local git, no remote).

Verified headline reconciliations (window 2026-01-01→07-04, finance
freshness 2026-07-05, aggregate-only):

- Card debt $57,810.40 vs cash $11,351.85 → net debt $46,458.55.
- YTD debt grew +$25,083.33 while reported net profit was $9,756.60:
  card inventory $81,005 + interest/fees $5,085 + personal $4,050 +
  unknown $9,376 vs payments $67,668 + refunds ≈$8.8k. Debt-bridge
  equation exact with a surfaced −$50.00 classification residual;
  implied 2026-01-01 opening debt $32,727.07 (no true snapshot exists).
- Financing costs $5,084.83 YTD = 52% of net profit → profit after
  financing $4,686.77. Highest-APR balance $15,000.22 @28.49%.
- Payout gap: marketplace proceeds $128,695 vs bank payout deposits
  $77,175 → $51.5k cumulative in-flight estimate; deposits are mostly
  Payability advances (factoring fee invisible in bank data — DATA GAP).
- Purchase log = intake slice only: 110 rows / $54,230.33 (line-total
  semantics proven empirically); 61/102 non-cancelled lines matched to
  card charges (T1 15 accepted, T2 8, T3 38 review-only proposals);
  cancelled-PO exposure $10,871.52 pending refund audit.
- Classification ruleset v2: 1,859 transactions, ≈93% dollar coverage;
  unknown remainder $63,790.77 honestly surfaced.

Artifacts (root-only, 0600): `reports/command-center-v1-20260714T075108Z.{xlsx,json,-handoff.md}` + reconciliation/classification/match run reports.
55/55 tests; zero over-allocation (SQL-audited); PII cell-scan 0 hits.

Papi-gated next steps: cancelled-PO refund audit, P2P/person-transfer
identification ($36.9k), 28.49% APR paydown priority, Payability statement
pull, unknown-bucket classification session, guarded Plaid/SP-API re-sync
before refreshed numbers, T3 match proposals review.

Trail: specs/182*.md, tasks/182*, reviews/182_*.re-review.md,
tasks/182-profit-engine-business-command-center.progress.

## Data quality caveats to carry forward

- Ads are excluded / treated as `$0` by Papi's direction.
- Tax is excluded by Papi's direction.
- Forward-only FIFO infrastructure is live for new entries, but current accepted historical reports still use active observation-based COGS because existing sales are pre-boundary and no FIFO allocations exist yet.
- Amazon finance repair and guarded SP-API finance refresh are accepted, but 704 undated `ServiceFee` rows totaling `-$3,149.26` are included in totals and cannot be cleanly date-bucketed. Spec 160 confirmed these are account-level fees with no deterministic allocation date; future period reports should show them as an `Unallocated Service Fees` bucket rather than inventing fake precision.
- Amazon Orders API throttling from Spec 159 is resolved: Spec 160 cooldown dry-run checked 1,901 orders with 0 new/updated and no 429.
- Settlement-date vs order-date differences are inherent: finance events use posted/settlement dates, while order revenue uses order dates.
- Forward-only FIFO is available for new entries from `2026-07-01T00:00:00Z`; historical/pre-boundary sales continue using observation-based COGS. Current FIFO status: 4 lots, 8 units remaining, 0 allocations.
- eBay TRANSFER handling is partially verified: only `CREDIT` / `TRANSFER_FROM` / `PAYOUT` variants have been observed, and those are included in P&L as adjustments. Future `DEBIT` or otherwise different TRANSFER variants should be reviewed as they appear.
- Ads integration is not needed for Papi's current OA/wholesale model; he does not run ads and does not plan to in the near future.
- Reports and spreadsheet views must remain aggregate-only: no buyer PII, raw order IDs, item titles, raw marketplace identifiers, addresses, secrets, or sensitive hashes.

## Source of truth and shared trail

Specs:

- `/root/specs/153-profit-engine-financial-events-net-profit.md` — complete.
- `/root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md` — eBay OAuth + COGS gap closed; eBay finance-events ingestion accepted.
- `/root/specs/158-profit-engine-caveats-and-amazon-blocker-audit.md` — complete; caveats/Amazon blocker audit + eBay TRANSFER semantics accepted.
- `/root/specs/159-profit-engine-guarded-amazon-spapi-sync-validation.md` — complete; guarded Amazon SP-API finance refresh accepted.
- `/root/specs/160-profit-engine-date-basis-fifo-hardening.md` — complete; Amazon throttle rerun, ServiceFee allocation decision, and forward-only FIFO accepted.

Key task markers:

- `/root/tasks/153_2_5-amazon-finance-live-db-repair.done`
- `/root/tasks/153_3-net-profit-v1-report.done`
- `/root/tasks/154_1-profit-engine-spreadsheet-view.done`
- `/root/tasks/154-profit-engine-ebay-gap-closure.done`
- `/root/tasks/154_6-ebay-finance-events-ingestion.done`
- `/root/tasks/158_1-profit-engine-caveats-amazon-blocker-audit.done`
- `/root/tasks/158_2-ebay-transfer-semantics.done`
- `/root/tasks/159_1-guarded-amazon-spapi-sync-validation.done`
- `/root/tasks/159_2-fix-servicefee-caveat-count.done`
- `/root/tasks/160_1-amazon-orders-throttle-rerun.done`
- `/root/tasks/160_2-undated-servicefee-allocation.done`
- `/root/tasks/160_3-forward-only-fifo-cogs.done`
- `/root/tasks/160_4-forward-only-fifo-integration.done`
- `/root/tasks/160_5-forward-only-fifo-activation.done`
- `/root/tasks/161_1-profit-engine-date-basis-views.done`
- `/root/tasks/161_2-parser-cogs-linkage-backfill.done`
- `/root/tasks/161_3-live-parser-backfill-canvasdon-fix.done`
- `/root/tasks/161_3a-cancelled-refund-backfill-guard.done`
- `/root/tasks/161_4-parser-sale-link-export-table.done`
- `/root/tasks/161-profit-engine-date-views-parser-cogs-linkage.done`

Reviews:

- `/root/reviews/153_2_5-amazon-finance-live-db-repair.re-review.md` — ACCEPT.
- `/root/reviews/153_2_5-amazon-finance-live-db-repair.mid-review.md` — ACCEPT.
- `/root/reviews/153_3-net-profit-v1-report.final-review.md` — ACCEPTED.
- `/root/reviews/154_1-profit-engine-spreadsheet-view.review.md` — ACCEPT.
- `/root/reviews/154_4-ebay-gap-closure.review.md` — ACCEPT.
- `/root/reviews/154_6-ebay-finance-events-ingestion-final.review.md` — ACCEPT.
- `/root/reviews/158-profit-engine-caveats-and-amazon-blocker-audit.md` — caveats/Amazon audit complete.
- `/root/reviews/158_2-ebay-transfer-semantics.review.md` — ACCEPT.
- `/root/reviews/159-guarded-amazon-spapi-sync-final.review.md` — ACCEPT.
- `/root/reviews/160-profit-engine-date-basis-fifo-hardening-final.review.md` — ACCEPT.
- `/root/reviews/160_5-forward-only-fifo-activation-final.review.md` — ACCEPT.
- `/root/reviews/161_1-profit-engine-date-basis-views-qwen.review.md` — ACCEPT.
- `/root/reviews/161_2-parser-cogs-linkage-backfill-qwen.review.md` — ACCEPT.
- `/root/reviews/161_3a-cancelled-refund-backfill-guard-qwen.review.md` — ACCEPT.
- `/root/reviews/161_4-parser-sale-link-export-table.review.md` — ACCEPT.
- `/root/reviews/161-profit-engine-date-views-parser-cogs-linkage.md` — final closeout handoff.

Operational DB and code:

- DB: `/root/sales-data/db/sales.db`
- Report generator: `/root/sales-data/scripts/profit_report.py`
- FIFO engine: `/root/sales-data/lib/sales/fifo.py`
- Spreadsheet exporter: `/root/sales-data/scripts/export_profit_spreadsheet.py`
- COGS coverage reference: `/root/sales-data/scripts/cogs_coverage_report.py`
- eBay sync: `/root/sales-data/lib/sales/ebay_sync_engine.py`
- eBay API client: `/root/sales-data/lib/sales/ebay_client.py`

## Upgrade roadmap

### Next immediate phase: post-sync reconciliation / automation hardening

The first guarded Amazon SP-API finance refresh is accepted. Next useful upgrades are:

1. Add/import richer purchase-lot quantities so FIFO coverage grows beyond the initial 4 lots / 8 units.
2. Add optional dual-path COGS comparison (`observation` vs `FIFO`) before switching FIFO to primary report COGS.
3. Build a recurring refresh workflow with cooldown-aware SP-API scheduling, automatic backups, aggregate-only logs, and report delta summaries.
4. Improve reconciliation against Sellerboard/BoxEm exports before dashboard work.

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

## Fable sprint verification + repo backup (2026-07-05, specs 163/166/167)

- **COGS coverage verified 100%**: 1576/1576 sale items resolve to active COGS; $0.00
  of $107,882.49 revenue uncosted (spec 163, read-only). Net-profit baseline fully costed.
- **Parser-linkage review queue is NOT actionable**: parser source export has 105 records
  with zero ASIN/title-fp overlap vs the 1573 queued sales; 3 conservative links are the
  ceiling. Queue = provenance-only noise, no P&L impact.
- **Pending Hermes**: remove review-queue tabs from operator-close packages, replace with
  COGS-coverage stat — handoff at `/root/context/metis-handoff-hermes-cogs-stat-2026-07-05.md`.
- **Code now off-box**: `/root/sales-data` is a git repo (code only; db/backups/reports/
  imports excluded) pushed to private `github.com/tortillapapi/sales-data` (master).
- Quarantined artifacts from a rejected grunt scoring attempt: `reports/parser-sale-link/
  *20260702T213818Z*` + `parser_sale_link_builder.py` gained an unused `score_candidate`
  path (harmless; revisit only if candidate artifacts are ever needed).
