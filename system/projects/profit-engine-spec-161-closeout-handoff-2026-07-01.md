---
type: project-handoff
title: Profit Engine Spec 161 Closeout Handoff
created: 2026-07-01
project: profit-engine
owner: hermes
status: complete
related_spec: /root/specs/161-profit-engine-date-views-parser-cogs-linkage.md
---

# Profit Engine Spec 161 Closeout Handoff — 2026-07-01

## Status

Spec 161 is **complete and accepted**. Use this as the short resume note for the next session.

## Completed

- 161_1 date-basis views accepted: order-date and statement/posted-date reporting with embedded guidance.
- 161_2 parser/COGS linkage report and safe backfill plan accepted.
- 161_3 live parser backfill phase completed after Papi approval, including TheCanvasDon parser fix.
- 161_3a cancelled/refund standalone append guard completed; guarded W1 live backfill resumed and master rebuilt.
- 161_4 parser source export + local hashed `parser_sale_link` linkage table/export completed and independently accepted.

## Final verified state

- Parent completion marker: `/root/tasks/161-profit-engine-date-views-parser-cogs-linkage.done`
- Final parent handoff/review: `/root/reviews/161-profit-engine-date-views-parser-cogs-linkage.md`
- 161_4 acceptance review: `/root/reviews/161_4-parser-sale-link-export-table.review.md`
- Final row counts after live parser backfill:
  - Account A: 44 rows including header
  - Account B: 63 rows including header
  - Master: 105 rows including header
- Latest coverage artifact: `/root/reviews/161-parser-cogs-linkage/coverage-20260701T185019Z.json`
  - Amazon: 1,569 / 1,569 covered
  - eBay: 7 / 7 covered
- `parser_sale_link` applied after backup:
  - `/root/sales-data/backups/sales.db.bak-20260701T184403Z-pre-161_4-parser-sale-link`
  - 3 medium/title-fingerprint/pending links
  - 1,573 review-needed/unmatched rows
  - no COGS/P&L semantic changes

## Verification already run

- Parser source export unit test, fixtures, and all parser `test_*.js` passed.
- Profit Engine tests passed: `249 passed`.
- SQLite: `quick_check=ok`; FK check `0`.
- Restricted artifacts verified `0600`.
- Secret/PII scan clean on user-facing summaries/reviews and hashed linkage artifacts.

## Next-session guardrails

- Do not reopen Spec 161; create a new owner:`hermes` spec for the next phase.
- Keep parser/source-sheet data private; do not print raw order IDs, Gmail message IDs, buyer PII, item titles, ASIN/SKU values, credentials, or sensitive hashes.
- Treat `/root/n8n/local-files/order-parser` as intentionally dirty from accepted parser improvements; do not reset/stomp it.
- Keep `parser_sale_link` additive and reviewer-gated unless a new reviewed spec changes semantics.

## Suggested next phase options

1. Parser linkage phase 2: reviewer workflow for the 3 pending links and strategy for unmatched rows.
2. FIFO enrichment: import richer purchase-lot quantities for useful forward-only FIFO allocations.
3. Spreadsheet refresh: new workbook with date-basis views and aggregate parser-linkage summary.
4. Recurring refresh automation: backup + sync + aggregate delta summary to Telegram.

Canonical non-vault handoff mirror: `/root/context/profit-engine-spec-161-closeout-handoff-2026-07-01.md`.

Related project note: [[profit-engine]].
