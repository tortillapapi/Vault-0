---
type: system-project
title: n8n Order Parser
slug: n8n-order-parser
last_synced: 2026-06-04
maintainer: cc-oc-orchestrator
tags: [project, order-parser, gmail, sheets, systemd]
---

# n8n Order Parser

The Gmail to Google Sheets order parser now runs directly on the VPS via systemd.
n8n is no longer the parser runtime, scheduler, or Google credential source.

## Current Runtime
- Timer: `order-parser.timer`
- Service: `order-parser.service`
- Schedule: daily `09:00 America/Los_Angeles`
- Runner: `/root/scripts/run-order-parser.sh`
- Parser: `/root/n8n/local-files/order-parser/order_parser.js`
- Order: account A -> account B -> master
- Config: `/root/n8n/local-files/order-parser/config.json`
- Parser-owned credentials: `/root/secrets/order-parser/credentials.json` (`0600`)

The runner uses host Node (`/usr/bin/node`) and does not call Docker or n8n.

## Retired n8n Workflows
The old n8n workflows are intentionally deactivated, not deleted:
- `Mcbqgukfgdafk57U` — Order Parser — mramirez021111 (account_a, Inbox A)
- `EAKfdR3Csk0zdT6H` — Order Parser — themetalman13 (account_b = themetalman13@gmail.com, the eBay inbox / Inbox B)
- `XY3vs7olrtnnlBDv` — Order Parser — Master Merge

Inactive n8n parser workflows are expected. Monitoring should use
`/root/scripts/parser-run-status.sh`, not n8n execution history, as the run-status signal.

## Gotchas
- The parser must run from the host path unless `ORDER_PARSER_BASE_DIR` is explicitly set.
- Google auth lives in `/root/secrets/order-parser/credentials.json`; do not reintroduce
  `n8n export:credentials` into the production parser path.
- After repeated run errors n8n **auto-deactivates** trigger workflows and does NOT
  re-enable after a fix. This is historical context only; those workflows are now retired.
- `config.json` has a hardcoded `"today"` value stamped into the sheet "Last
  Updated" column — goes stale; verify/auto-set.
- `appendRows` now writes at an explicit computed row index (`readSheet` length+1,
  PUT `A{n}:I{n}`); the old `values:append` misplaced rows when blank rows existed.
  Keep sheets free of blank rows.
- `listMessages` scans only `in:inbox newer_than:2d` — gaps older than 2 days need
  a widened query for one-off backfills.
- `n8n execute --id` and n8n Code/ExecuteCommand nodes are not supported paths for this
  parser. Do not attempt to restore n8n execution without a fresh architecture decision.
- Read-only helpers `/root/scripts/sheets-read.sh` and `/root/scripts/gmail-orders-list.sh`
  now use parser-owned credentials directly.

## State (2026-05-28)
- Spec 76 moved scheduling from n8n to `order-parser.timer`.
- Spec 77 re-pointed monitoring to `order-parser.service` status.
- Codex decoupled Google auth/runtime from n8n:
  - one-time minimized credential export to `/root/secrets/order-parser/credentials.json`
  - parser reads that file directly
  - runner uses host Node
  - `order-parser.service` no longer depends on Docker
- Verification passed:
  - `order_parser.js authcheck`
  - `sheets-read.sh` headers for account A, account B, and master
  - `gmail-orders-list.sh` auth for both accounts
  - host Node master dry-run
  - no-match account dry-runs
  - final grep showed no n8n credential export, Docker exec, or Docker service dependency
    in the production parser path

Open parser-quality items from May 21 still apply unless separately closed:
eBay "Packing" item-name mis-extraction, false-positive "Cancelled" classification of
marketing emails, and some classify() keyword misses.

## Master Refresh (spec 67_1 — 2026-06-04)
- Master stays on the daily rebuild path (`order-parser.timer`, 09:00 PT).
- `/root/scripts/refresh-master.sh` plus the `refresh master` Telegram command gives
  instant catch-up after manual source-sheet edits.
- The live IMPORTRANGE mirror from spec 67 is abandoned because it conflicts with the
  daily clear+rewrite rebuild.
- Both account-to-Master IMPORTRANGE auth grants remain recorded if a future design
  needs them.

## Self-Improvement Loop (spec 92, L2 — 2026-06-04)
- Detection → proposal → regression-gated → human-approved deploy. Ceiling L2:
  every parser/ledger change stays human-gated; L3 (auto-merge exclusion-only) deferred.
- Tooling in `n8n/local-files/order-parser/`:
  - `run_fixtures.js` / `fixtures-run.sh` — regression gate (corpus in `fixtures/`).
  - `propose_fix.js` — anomaly → staged fixture + scratch-validated minimal exclusion diff
    → `reviews/parser-improve-<date>.proposal.md` (authoring only, no apply).
  - `apply_proposal.js` — gated EXCLUDED_SENDERS deploy: `.bak` + full-corpus gate +
    auto-revert on red; refuses any change outside the exclusion array. `--apply` + human OK.
  - `prune_rows.js` — parameterized, snapshot-backed, assert-before-write FP-row remover for
    account sheets (master self-heals). `--apply` + human OK.
  - `kpi_rollup.js` — per-day + pooled 7/14d precision/recall, Verdict:OK streak, and a
    human-confirmed retirement criterion (default 14 clean days). Report: `reviews/parser-kpi-<date>.md`.
- Weekly KPI: `parser-kpi-weekly.timer` (Mon 09:45 PT) → regenerates the report and sends a
  Telegram headline. Retirement of the daily watchdog stays a human decision.
- Hard invariants: never auto-edit core matching logic; never auto-write/delete ledger rows
  without a human gate; every change passes a green full-corpus run; snapshot before any sheet write.

## Audit hardening + Walmart Marketplace (2026-06-04)
- **Spec 101 — second-audit delivery fixed.** The unattended CC parser review
  (`parser-cc-review.timer`, 09:35 PT) ran with isolated `HOME=/opt/cc-parser-review`,
  which made `openclaw` read an unpaired config and fail delivery. The systemd unit now sets
  `OPENCLAW_STATE_DIR=/root/.openclaw` and
  `OPENCLAW_CONFIG_PATH=/root/.openclaw/openclaw.json` while leaving `HOME` isolated for
  Claude permission scoping. Its isolated `.claude` allowlist was also repaired:
  `parser-run-status.sh` and the host-node dry-run are allowed, while dead docker-exec and
  legacy `n8n-status.sh` entries were removed.
- **Spec 102 — audit recall honors parser exclusions.** New
  `/root/scripts/filter-parser-excluded.js` pipes recall candidates through the parser's
  exported `isExcluded` / `retailerExcluded` checks, keeping `order_parser.js` as the single
  source of truth. `/root/scripts/gmail-orders-list.sh` gained `--exclude-parser-rejects`,
  and the daily-audit runbook now treats filtered parser rejects as not recall misses.
- **Spec 103 — Walmart Marketplace extraction.** Parser handling now covers Walmart
  Marketplace "Sold by <seller>" emails: `\d{7}-\d{8}` Walmart order tokens,
  `walmart_order` matching, marketplace item-name extraction, Walmart price extraction,
  HTML-entity decoding in `htmlToText`, and a short-hash collector guard. Regression fixtures
  cover marketplace confirmation, marketplace shipping, and first-party Walmart behavior.
- **103b — personal-order prune.** After the Walmart Marketplace fix, one personal
  non-inventory CONCETTA order was corrected/pruned from account_a and master follow-up state:
  the malformed blank-order tracking row was removed and the corrected Walmart row was verified
  as the sole CONCETTA/tracking match.
