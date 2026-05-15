---
type: topic
title: n8n Order Parser
slug: n8n-order-parser
created: 2026-05-15
last_updated: 2026-05-15
tags: [ops, n8n, gmail, orders, sheets]
thesis_version: 1
priority: core
domain_tags: [automation, pipeline, orders]
last_accessed: 2026-05-15
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

Status ladder:
`Purchase → Packing → Shipped → Out for Delivery → Delivered`; `Cancelled` can overwrite any prior status. The parser normalizes order-number matches by stripping `#`, whitespace, and dashes.

Item name extraction is regex-first. Boilerplate/marketing fragments are post-validated and rejected before writing to Sheets. If regex cannot determine a valid item name, it calls OpenCode-Go `qwen3.6-plus` through the configured n8n Header Auth credential and expects strict JSON: `{ "item_name": "..." }` or `{ "item_name": null }`.

## Known Limitations

Direct restaurant emails may still leak through as purchase rows. Spec 50.1 intentionally only expanded sender-domain exclusions for food-delivery platforms; direct restaurant senders like HINODEYA remain observable data for a later tuning pass if they prove noisy.

## Tuning History

- **Spec 50.1 — 2026-05-15:** tightened Item Name prompt and post-validation, rejected boilerplate/marketing fragments, tightened order-number extraction with digit + stopword checks, and expanded food-delivery sender exclusions. Re-test report: `/root/.openclaw/workspace/phase1-test-report-v2.md`.

## Logs + Operations

- n8n UI executions panel: `http://127.0.0.1:5678`
- Container logs: `docker logs n8n-n8n-1`
- Test report: `/root/.openclaw/workspace/phase1-test-report.md`
- Quality re-test report: `/root/.openclaw/workspace/phase1-test-report-v2.md`
- Config: `/root/n8n/local-files/order-parser/config.json`
- Workflow artifacts: `/root/n8n/local-files/order-parser/workflow-*.json`

## Related

- [[orders-dashboard]] — still reads the old Gemini Orders Master Sync source until Spec 51 repoints it.
- `/root/specs/50-n8n-order-parser.md`
- `/root/specs/50-n8n-order-parser-amendment.md`
- `/root/specs/50_1-order-parser-quality-fixes.md`

## Version

- **v1.1** — quality pass shipped 2026-05-15 under Spec 50.1.
- **v1.0** — shipped 2026-05-15 under Spec 50.
