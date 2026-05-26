---
type: topic
title: n8n Order Parser
slug: n8n-order-parser
created: 2026-05-15
last_updated: 2026-05-26
tags: [ops, n8n, gmail, orders, sheets]
thesis_version: 1
priority: core
domain_tags: [automation, pipeline, orders]
last_accessed: 2026-05-21
access_count: 0
---

## Current Thesis

The n8n Order Parser replaces the disabled Gemini scheduled action with deterministic daily parsing for two Gmail inboxes. Each account writes to its own seeded Purchase Log sheet, then a separate master-merge workflow unions both sheets into `Purchase Log - Master`.

## Workflows

| Workflow | ID | Schedule | Purpose |
|---|---|---|---|
| Order Parser — mramirez021111 | `Mcbqgukfgdafk57U` | Daily 09:00 America/Los_Angeles | Scan `mramirez021111@gmail.com`, update its Purchase Log |
| Order Parser — themetalman13 | `EAKfdR3Csk0zdT6H` | Daily 09:00 America/Los_Angeles | Scan `themetalman13@gmail.com`, update its Purchase Log |
| Order Parser — Master Merge | `XY3vs7olrtnnlBDv` | Daily 09:15 America/Los_Angeles | Merge both per-account logs into master |

Implementation files live at `/root/n8n/local-files/order-parser/` and are mounted into the n8n container at `/files/order-parser/`.

## Sheets

| Sheet | ID | Notes |
|---|---|---|
| Purchase Log - 2026 - 05 - 13 (`mramirez021111`) | `1y1JXLFX0wUQuYrEfami6Z6yFE56Gl9yTpPEUWgIvkGU` | Seed sheet preserved; new rows/updates append here |
| Purchase Log - 2026 - 05 - 13 (`themetalman13`) | `1ZJ1BVOItFstSVCN5oxuYC6JfcSUsi5SsOxBZr7g87Y0` | Seed sheet preserved; new rows/updates append here |
| Purchase Log - Master | `1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM` | Master union with leading `Source Account` column |

## Parser Rules

Exclusions:
- `donotreply@amazon.com`
- `*@ubereats.com`
- `*@dutch.com`
- `*@weedmaps.com`
- `*@doordash.com`
- `*@grubhub.com`
- `*@postmates.com`
- `*@caviar.com`
- `*@seamless.com`
- `*@slicelife.com`
- `*@toasttab.com`
- `*@chownow.com`

Subject gate:
- Accepts only order-like subjects (`order`, `confirmation`, `shipped`, `delivered`, `receipt`, `purchase`, `tracking`, `invoice`, `dispatched`, `out for delivery`, `arrived`).
- Rejects promo/newsletter subjects (`deal`, `% off`, `save $`, `sale`, `weekly`, `newsletter`, `promo`, `limited time`, `new arrival`, etc.) before body classification.

Status ladder:
`Purchase → Packing → Shipped → Out for Delivery → Delivered`; `Cancelled` can overwrite any prior status, but Cancelled rows without a validated order number are dropped. The parser normalizes order-number matches by stripping `#`, whitespace, and dashes, and rejects English stopwords / non-4-digit junk.

Item name extraction is regex-first. Boilerplate/marketing/sentence fragments are post-validated and rejected before writing to Sheets. If regex cannot determine a valid item name, it calls OpenCode-Go `qwen3.6-plus` through the configured n8n Header Auth credential and expects strict JSON: `{ "item_name": "..." }` or `{ "item_name": null }`.

## Retailer Hard Exclusions

| Retailer | Match |
|---|---|
| Weedmaps | `weedmaps`, `budzilla`; weedmaps/budzilla sender domains |
| Uber Eats | `uber eats`, `ubereats`, `uber receipts`; Uber Eats sender/domain patterns |
| TikTok Shop | `tiktok shop`, `tiktokshop`; TikTok Shop sender/domain patterns |
| J. Crew | `j. crew`, `jcrew`, `j.crew`; jcrew.com |
| Panda Express | `panda express`, `pandaexpress`; pandaexpress.com |
| Abercrombie family | `abercrombie`, `hollister`, `gilly hicks`; Abercrombie/Hollister domains |
| Amazon Pharmacy only | exact `amazon pharmacy` phrase or pharmacy Amazon sender; does **not** match regular Amazon |
| Domino's | `domino's`, `dominos`, `domino`; dominos.com |
| Musely | `musely`; musely.com |
| Charles Tyrwhitt | `charles tyrwhitt`, `tyrwhitt`; ctshirts.com / tyrwhitt.com |

## Known Limitations

Direct restaurant emails may still leak through as purchase rows unless they are blocked by the subject gate or later retailer-specific tuning. Lids.com promotional emails are handled by path (b): promo subject rejection plus a safety drop for Lids.com `Delivered` rows where both Item Name and Order Number are blank. A future spec could add a dedicated Lids.com shipping template extractor if needed.

- **Master-merge orphan-row filter is narrow.** The
  `isItemNameOnlyPartialRow` filter (added in spec 50.2) only triggers
  when column 1 (Item Name, `r[0]`) is truthy. Legacy rows with text
  in column 9 (`Last Updated`) and all other key columns blank slip
  through. The column-9-only orphan shape recurred on 2026-05-21 via
  the old `appendRows` auto-append against a sheet with blank rows.
  This is now fixed at the source (explicit-index write in `appendRows`).
  The `isItemNameOnlyPartialRow` filter remains as defense-in-depth.
  If new orphan rows appear in the future, broaden the filter to
  `!r[0] && !r[1] && !r[6]` (drop rows with no Item Name, no Retailer,
  AND no Order Number).
- **eBay "Packing" item-name mis-extraction.** The item-name regex can
  grab an `ID/Order number/Seller` block from eBay "Packing" emails
  instead of the actual product name. The LLM fallback usually rescues
  the correct name, but regex-first extraction remains brittle for
  eBay's terse packing notices.
- **2-day scan window.** The parser scans only `in:inbox newer_than:2d`,
  so outage gaps older than 2 days need a manual `OP_GMAIL_QUERY`
  backfill via `listMessages` env override.

## Tuning History

- **Spec 50.3 — 2026-05-21 (outage recovery):** Three workflows had auto-deactivated
  after a May 15–16 `MODULE_NOT_FOUND` error and were never re-enabled — root cause of
  the "no updates since May 16" outage. Re-activated all three. Code fixes in
  `order_parser.js`: (a) rows with a valid order number are kept (blank/LLM name) instead
  of dropped when item-name validation fails — new `itemNameRejectedKeptForOrder` counter;
  (b) `TODAY` now derives from `config.tz` (removed hardcoded `config.today`); (c)
  `listMessages` honors `OP_GMAIL_QUERY` env override for one-off wide backfills;
  (d) added `'order is confirmed'` to Purchase status keywords (eBay confirmation emails);
  (e) **`appendRows` rewritten** to write at an explicit computed row index instead of
  Sheets `values:append` auto-detection, which misplaced rows when blank rows existed.
  Backfilled/repaired eBay orders 49802–49805 and cleaned 10 marketing-noise rows +
  duplicates from the per-account sheets. See `/root/reviews/session-2026-05-21-handoff.md`.
- **Spec 50.2 — 2026-05-15:** added subject-line promo gate, hardened order-number validation, extended sentence-fragment rejection, dropped Cancelled rows without order numbers, added 10 retailer hard-exclusions, filtered item-name-only partial rows in master merge, and backfilled bad rows. Root cause: master merge propagated pre-existing malformed per-account rows because it accepted any row with any populated cell. Reports: `/root/.openclaw/workspace/phase1-test-report-v3.md`, `/root/.openclaw/workspace/phase3-backfill-summary.md`.
- **Spec 50.1 — 2026-05-15:** tightened Item Name prompt and post-validation, rejected boilerplate/marketing fragments, tightened order-number extraction with digit + stopword checks, and expanded food-delivery sender exclusions. Re-test report: `/root/.openclaw/workspace/phase1-test-report-v2.md`.

## Logs + Operations

- n8n UI executions panel: `http://127.0.0.1:5678`
- Container logs: `docker logs n8n-n8n-1`
- Test report: `/root/.openclaw/workspace/phase1-test-report.md`
- Quality re-test report: `/root/.openclaw/workspace/phase1-test-report-v2.md`
- Refinement re-test report: `/root/.openclaw/workspace/phase1-test-report-v3.md`
- Backfill summary: `/root/.openclaw/workspace/phase3-backfill-summary.md`
- Config: `/root/n8n/local-files/order-parser/config.json`
- Workflow artifacts: `/root/n8n/local-files/order-parser/workflow-*.json`
- themetalman13 Drive OAuth credential: `4cxUhHDUa7KKbBm4` (used for per-account sheet access)

## Related

- [[orders-dashboard]] — still reads the old Gemini Orders Master Sync source until Spec 51 repoints it.
- `/root/specs/50-n8n-order-parser.md`
- `/root/specs/50-n8n-order-parser-amendment.md`
- `/root/specs/50_1-order-parser-quality-fixes.md`
- `/root/specs/50_2-order-parser-refinement.md`
- `/root/specs/50_3-order-parser-outage-recovery.md`

## 2026-05-26 — OAuth outage recovery & hardening

n8n is now reachable at `https://n8n.rareforceone.cloud` (Caddy HTTPS proxy, spec 52), in addition to the local `http://127.0.0.1:5678` admin interface. The OAuth redirect URI used by all four Google credentials is `https://n8n.rareforceone.cloud/rest/oauth2-credential/callback` and must be registered in the corresponding Google Cloud OAuth client(s).

### The outage

A ~11-day silent outage ran from ~2026-05-15 through 2026-05-26. All three workflows showed `active=true` in the n8n UI, yet every scheduled execution errored. Root cause was two-fold:

1. **Consent screen in "Testing" mode.** The Google OAuth consent screen was still in "Testing" (not "Published"), which expires refresh tokens every 7 days. When the tokens expired, all four Google credentials (`gmail_a`, `gmail_b`, `sheets_a`, `sheets_b`) were simultaneously revoked.
2. **`redirect_uri_mismatch`.** After the Caddy HTTPS proxy went live, the n8n OAuth callback URL changed from the old `http://localhost:5678/...` to the new `https://n8n.rareforceone.cloud/...`. This new URI was not yet registered in Google Cloud, so attempting to re-authorize any credential immediately failed with `redirect_uri_mismatch`.

### The fix

1. Re-authorized all four Google credentials inside n8n.
2. **Published the consent screen** in Google Cloud Console (permanent — stops the weekly refresh-token expiry).
3. Ran a 14-day backfill with `OP_GMAIL_QUERY='in:inbox newer_than:14d'` across both per-account parsers and the master merge.

### Operational lesson

- **`active=true` ≠ succeeding.** A workflow can be active and still fail on every run. Verify via the executions API per workflow (`/api/v1/executions?workflowId=<id>`), not just the UI toggle.

### New helpers & audit

- **`/root/scripts/sheets-read.sh`** — read-only Google Sheets diagnostic (reuses n8n OAuth creds).
- **`/root/scripts/gmail-orders-list.sh`** — read-only Gmail order list diagnostic (reuses n8n OAuth creds).
- A **daily accuracy-audit cron** runs through 2026-06-01 to spot silent regressions. See `system/logs/n8n-parser-daily-check.md`.

## Version

- **v1.4** — OAuth outage recovery + Caddy HTTPS + published consent screen, 2026-05-26 under Spec 62.
- **v1.3** — outage recovery + appendRows fix, 2026-05-21 under Spec 50.3.
- **v1.2** — refinement + backfill shipped 2026-05-15 under Spec 50.2.
- **v1.1** — quality pass shipped 2026-05-15 under Spec 50.1.
- **v1.0** — shipped 2026-05-15 under Spec 50.
