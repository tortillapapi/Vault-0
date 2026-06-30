---
type: handoff
title: Profit Engine eBay Gap Closure Handoff
created: 2026-06-30T08:45:00Z
owner: hermes
status: active-reference
related_spec: /root/specs/154-profit-engine-spreadsheet-view-and-ebay-gaps.md
tags: [handoff, profit-engine, ebay, cogs, finances]
---

# Profit Engine eBay Gap Closure Handoff

## Bottom line

eBay OAuth + eBay COGS gap is closed. Papi can sleep. The only remaining eBay issue is a separate finance-events ingestion phase.

## What was completed

- Papi added the eBay Cert ID.
- Live eBay sync validated OAuth refresh and order ingestion.
- Four user-provided eBay unit costs were imported:
  - Gap A: `$60.00`
  - Gap B: `$449.00`
  - Gap C: `$384.11`
  - Gap D: `$55.00` per unit, quantity 5
- Manual/title-only eBay COGS rows now allocate safely via normalized title fingerprint fallback.
- Fallback is guarded: only unique eBay title fingerprints are used; ambiguous fingerprints are skipped.
- Regression tests were added.
- OC review accepted the closure.

## Current report

- Report: `/root/sales-data/reports/profit/net-profit-v1-20260630T083559Z.md`
- JSON: `/root/sales-data/reports/profit/net-profit-v1-20260630T083559Z.json`
- Spreadsheet: `/root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z.xlsx`
- Shared handoff file: `/root/context/profit-engine-ebay-gap-handoff-2026-06-30.md`
- Next task prompt: `/root/tasks/154_6-ebay-finance-events-ingestion.txt`

## Current numbers

- Revenue: `$107,882.49`
- COGS: `$54,211.95`
- Gross profit: `$53,670.54`
- Net profit: `$13,915.53`
- Net margin: `12.9%`
- eBay COGS: `$1,847.89`
- eBay COGS coverage: `7/7 matched`, `0 unmatched`
- `ebay_fin_events`: `0`

## Verification

- Tests: `186 passed`
- DB quick_check: `ok`
- Foreign key check: `0` rows
- Review: `/root/reviews/154_4-ebay-gap-closure.review.md` — ACCEPT
- Completion marker: `/root/tasks/154-profit-engine-ebay-gap-closure.done`

## Remaining caveat

`ebay_fin_events = 0`, so eBay marketplace fees, refunds, shipping-label purchases, seller credits, and payout/order-level adjustments are missing. eBay net profit is gross-like/overstated until this is fixed.

Do not reopen completed COGS/OAuth work unless verification fails. Start with `/root/tasks/154_6-ebay-finance-events-ingestion.txt`.

## Next phase checklist

1. Confirm finance/payout scope presence without exposing token/secrets.
2. Add redacted Finances API diagnostics.
3. Test windows/filters/endpoints for eBay Sell Finances.
4. Persist transactions idempotently into `ebay_fin_events`.
5. Regenerate report/spreadsheet.
6. Verify either `ebay_fin_events > 0` or document a verified upstream/no-data reason.

## Safety

Never log or expose Cert ID, client secret, refresh token, access token, app IDs, Google credentials, DB credentials, buyer PII, addresses, raw order IDs, or sensitive hashes.
