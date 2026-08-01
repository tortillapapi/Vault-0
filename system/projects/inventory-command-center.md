---
type: system-project
title: Inventory Command Center
slug: inventory-command-center
created: 2026-08-01
last_updated: 2026-08-01
status: evergreen-active
priority: high
owner: hermes
tags: [project, inventory, reseller, command-center, tcg, prep-center, amazon, evergreen]
---

# Inventory Command Center

## What this is

The **Inventory Command Center** is Papi's durable inventory + reconciliation
layer: a root-only `bridge.db` that consolidates purchase-log, TCG, and
prep-center inventory into one **unified inventory pipeline** tracking every
item across all 10 lifecycle stages (inbound → at house → at prep center → in
transit to FBA → at FBA → sold), plus a read-only extract of the Profit
Engine's sales/finance snapshots and a transaction-purchase matching engine.
It lives at `/root/command-center/`, runs entirely on the VPS, and is the
Aleph for "how much money is floating, and in what stage, right now."

### Relationship to the Profit Engine

The Command Center **extends — it does not replace — the [[profit-engine]]**.
`bridge.db` consumes read-only snapshots from the two Profit Engine source
databases via `/root/command-center/scripts/extract_snapshots.py`:

- `/root/sales-data/db/sales.db` → source sales/order/order-item tables
  (`src_orders`, `src_order_items`, `src_marketplace_fin_events`).
- `/root/finance-data/db/finance.db` → source finance/transaction/balance tables
  (`src_accounts`, `src_transactions`, `src_balances_latest`,
  `src_credit_liabilities_latest`).

Each extract is recorded in the `extract_runs` table. The Profit Engine remains
the canonical source for sales P&L, COGS coverage, finance-event ingestion, and
FIFO; the Command Center copies those in aggregate so inventory valuation and
transaction-purchase matching can be done in one database without writing to
the source DBs. **Never write back to `sales.db` or `finance.db` from this
repo.**

### NOT the retired Inventory Tracker

This is **not** the Inventory Tracker. The Inventory Tracker was a Flask/SQLite
system **shut down 2026-04-27 (never to be revived)** — see the standing rule
under retired systems. If an agent is orienting from the vault and remembers
an "inventory tracker" project, that is a different, dead system. The
Inventory Command Center is a separate, active, root-only SQLite + Python
project started with Spec 182 (2026-07-14) and extended through Specs 184–212.

## Paths (read carefully)

- **Repo root:** `/root/command-center/` — local git on `master`. A GitHub
  private remote is configured at
  `git@github.com:tortillapapi/command-center.git` (Spec 217; see Status).
- **Real database:** `/root/command-center/db/bridge.db` — mode **0600**, root
  only, ~7.9 MB. This is the only usable database.
- **There is NO usable DB at the repo root.** A 0-byte `bridge.db` once lived
  at `/root/command-center/bridge.db` and was tracked by git as a decoy; Spec
  217 removed it from tracking and disk and added `/bridge.db` to `.gitignore`.
  Caveat: some pre-217 vault docs (and the [[profit-engine]] Spec 182 note)
  describe the project as "`bridge.db` + scripts + tests at the repo root" —
  that root path resolves to nothing. Use `db/bridge.db`.
- **Code only** is mirrored to GitHub. `.gitignore` excludes `db/` and
  `reports/` — that is the confidentiality boundary. **bridge.db and all
  financial data never leave the VPS.**
- Secondary inputs: Google Sheets master purchase log and TCG inventory sheets
  (read-only mirror via import scripts).

## Status

**Evergreen / actively iterating.** The codebase is now committed and code-only
mirrored to a private GitHub remote. The data stays root-only on the VPS.

Outstanding operational caveats (see "Operational caveats" below):
TCG price refresh is currently broken (Spec 216 owns the repair), and the
Profit Engine's `sales.db` source snapshot is stale since 2026-07-08 (Spec 215
owns its scheduled refresh).

## Table inventory (read from the live DB, 2026-08-01)

These are the real tables in `/root/command-center/db/bridge.db` with live row
counts. **Aggregate only** — counts, no PII, order IDs, item titles, or
addresses. Verified directly against the live database this session.

### Source-snapshot family (read-only copies of Profit Engine DBs)
| Table | Rows | Source |
|---|---|---|
| `src_accounts` | 9 | finance.db |
| `src_transactions` | 1,873 | finance.db |
| `src_balances_latest` | 9 | finance.db |
| `src_credit_liabilities_latest` | 8 | finance.db |
| `src_marketplace_fin_events` | 24,850 | sales.db |
| `src_orders` | 3,915 | sales.db |
| `src_order_items` | 3,990 | sales.db |

### Inventory core
| Table | Rows | Notes |
|---|---|---|
| `inventory_pipeline` | 3,042 | Unified pipeline; all 10 stages; full history preserved across runs |
| `purchase_orders` | 95 | Canonical account_b Master Purchase Log orders |
| `purchase_lines` | 98 | Line-level purchase detail (line-total semantics) |
| `prep_center_items` | 17 | Prep-center inventory (Tortilla Papi Rare Force One X Prep Pal) |
| `fba_shipments` | 0 | FBA shipment tracking (schema live, no rows yet) |
| `fba_shipment_items` | 0 | FBA shipment line items (schema live, no rows yet) |
| `lifecycle_evidence` | 98 | Audit trail for purchase/item lifecycle |
| `overrides` | 1 | Manual corrections |

### TCG family (Pokémon TCG inventory + market value)
| Table | Rows | Notes |
|---|---|---|
| `tcg_items` | 138 | Singles, sealed, other_inventory |
| `tcg_name_map` | 108 | raw_name → TCGPlayer canonical-name resolution |
| `tcg_price_history` | 253 | Market price history (PPT + TCGPlayer/PriceCharting) |
| `tcg_refresh_runs` | 13 | Price refresh run log |
| `tcg_photo_batches` | 0 | Photo-capture intake plumbing (schema live) |
| `tcg_line_tags` | 81 | TCG purchase-line tags |

### Transaction reconciliation family
| Table | Rows | Notes |
|---|---|---|
| `txn_class` | 9,295 | Classification ruleset v2 output |
| `txn_purchase_match` | 440 | Transaction ↔ purchase-line matches |
| `class_runs` | 5 | Classification run log |
| `match_runs` | 8 | Match engine run log |

### Meta
| Table | Rows | Notes |
|---|---|---|
| `extract_runs` | 20 | Source-DB extract log |
| `schema_version` | 2 | Schema migration version |

Total: 27 user tables. `inventory_pipeline` now holds 3,042 rows across all
runs (latest-run view is the operational surface; raw history is preserved for
audit).

## Spec trail (184–212)

One line each. Numbers, titles, and What-changed are read from the spec
frontmatter/bodies in `/root/specs/` — no invented entries. **Note: there is
no Spec 212 on disk;** the highest extant inventory-related spec is 211
(Spec 218 is a separate watchdog task, 213–216 are parser/refresh repairs).

- **184 — TCG Inventory → Command Center** (draft-for-review, created
  2026-07-19). Extended the Spec 182 command center with a Pokémon TCG
  inventory + market-value layer: read-only sheet mirror, COGS gap fill,
  TCGPlayer canon name resolution, daily PPT price refresh, TCG Position
  workbook card, photo-capture intake. 109+ tests.
- **185 — Unified Inventory Pipeline** (approved, 2026-07-23). Built the
  10-stage `inventory_pipeline` consolidating purchase log, TCG, and prep
  center; the `v_inventory_pipeline_summary` view and "Inventory Pipeline"
  workbook tab; 313 rows / $49,916 floating at acceptance.
- **187 — Sealed Pricing Case-Filter Fix** (approved, 2026-07-23). Fixed the
  PPT sealed-product refresh to return individual product prices instead of
  case-level prices.
- **188 — Pipeline Stages: house_to_fba, fba_direct, at_fba** (approved,
  2026-07-23). Added the three manual-routing stages to the pipeline builder
  for physical-inventory audits.
- **192 — TCG Other-Inventory Cleanup Batch 2** (complete, 2026-07-24). Applied
  Papi's confirmed row-by-row cleanup to the `TCG Raw Data` inventory;
  `spec192_apply.py` preserves the SQLite-derived workbook pipeline.
- **193 — Lost Origin Booster Box Cleanup** (complete, 2026-07-24). One
  inventory correction to `tcg_items.id=117` (Lost Origin Booster Box);
  `spec193_apply.py`.
- **194 — Inventory Valuation Read-Only Audit** (complete, 2026-07-28).
  Diagnosed the `$151,955.71` `at_house_collecting` figure — traced to raw
  history / versioned pipeline rows, not a live-valuation error.
- **195 — Inventory Pipeline Latest-Run Hardening** (complete, 2026-07-28).
  Eliminated schema/test drift that could reintroduce multi-run valuation
  inflation after a DB rebuild; latest-run-only view semantics + tests.
- **205 — Prep-Center Inventory Cost Linkage** (complete, 2026-07-30).
  Reconciled the uncosted prep-center rows against `purchase_lines`;
  `import_prep_center.py`; continued cost cleanup without reopening TCG
  valuation issues.
- **207 — Floating Inventory User Corrections** (completed 2026-07-31). Applied
  Papi's explicit stock/stage/cost-basis corrections; timestamped DB backup
  before mutation; rebuilt latest-run view.
- **208 — Profit Engine Fulfilled-Only P&L Timing View** (accepted_fifo_guarded,
  2026-07-31). Designed an additive fulfilled-only realized-P&L view without
  rewriting historical data or replacing the order-date headline view.
- **209 — Purchase Log Hygiene and U.S. Mint Parser Repair** (completed
  2026-07-31). Removed Papi-approved non-business/cancelled rows from canonical
  purchase log + `bridge.db`; investigated ambiguous rows without altering
  them; corrected two U.S. Mint records; parser now extracts Mint item names.
- **210 — U.S. Mint Shipping Order Cost Repair** (completed 2026-07-31). Added
  the distinct, evidence-backed $175 U.S. Mint shipment (order ref ...3691) to
  account_b purchase log and `bridge.db` as one inbound purchase, preserving the
  January subscription rows.
- **211 — Papi VPS Tools Read-Only MCP Bridge** (completed 2026-08-01). Built an
  isolated read-only Python MCP server (Streamable HTTP, localhost-only) at
  `/root/papi-vps-tools/` exposing filesystem + Git inspection for approved
  project paths — supports Codex desktop inspection of this repo.

### Related specs that own pending repairs
- **215 — Profit Engine Scheduled Refresh** owns the `sales.db` staleness
  (last snapshot 2026-07-08). The Command Center's `src_*` tables are only as
  fresh as the last extract.
- **216 — TCG Price Refresh Repair** owns the broken TCG price refresh
  (`tcg_refresh_runs` / `refresh_prices.py`). Market-value figures should not
  be trusted until that lands.

## Operational caveats

- **TCG price refresh is BROKEN.** `scripts/tcg/refresh_prices.py` is not
  producing trustworthy prices right now; Spec 216 owns the repair. Do not
  quote TCG market values or "TCG Position" workbook cards as authoritative
  until 216 lands. Cost basis remains valid.
- **`sales.db` snapshot is STALE since 2026-07-08.** The Profit Engine source
  snapshot has not been refreshed since 2026-07-08; Spec 215 owns its scheduled
  refresh. The Command Center's `src_orders`, `src_order_items`,
  `src_marketplace_fin_events` reflect that cutoff. Re-extract after 215.
- **Latest-run view only for valuation.** `inventory_pipeline` preserves full
  history across runs (3,042 rows now); use the latest-run
  (`v_inventory_pipeline_summary`) view for any current valuation — raw row
  counts over-count (Spec 194/195).
- **No script in this repo writes to `sales.db` or `finance.db`.** All writes
  are to `bridge.db` only, and only through the guarded import/apply scripts.
  Always back up `bridge.db` before a write/import phase.
- **Aggregate only.** No buyer PII, raw order IDs, item titles, raw marketplace
  identifiers, addresses, secrets, or sensitive hashes belong in reports or
  vault pages.

## Source of truth and trail

- Repo: `/root/command-center/` (local git, `master`; private remote configured
  per Spec 217).
- DB: `/root/command-center/db/bridge.db` (0600, root-only).
- Snapshot extractor: `/root/command-center/scripts/extract_snapshots.py`
  (reads `/root/sales-data/db/sales.db` and
  `/root/finance-data/db/finance.db` read-only).
- Pipeline builder: `/root/command-center/scripts/inventory/build_pipeline.py`;
  migrations `scripts/inventory/migrate_stages.py`.
- Prep-center import: `/root/command-center/scripts/prep_center/import_prep_center.py`.
- Workbook: `/root/command-center/scripts/build_workbook.py`.
- Spec trail: `/root/specs/{184,185,187,188,192,193,194,195,205,207,208,209,210,211}-*.md`.
- Predecessor: [[profit-engine]] (Spec 182 started the command center; this
  page covers the Spec 184–212 inventory extensions).