---
type: system-project
title: n8n Order Parser
slug: n8n-order-parser
last_synced: 2026-05-28
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
