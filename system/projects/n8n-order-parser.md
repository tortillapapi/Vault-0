---
type: system-project
title: n8n Order Parser
slug: n8n-order-parser
last_synced: 2026-05-21
maintainer: cc-oc-orchestrator
tags: [project, n8n, gmail, sheets]
---

# n8n Order Parser

n8n runs on this VPS in Docker (`n8n-n8n-1`, localhost:5678, Postgres backend),
powering the Gmail→Google Sheets order automation.

## Workflows (Schedule Trigger, daily 09:00 America/Los_Angeles)
- `Mcbqgukfgdafk57U` — Order Parser — mramirez021111 (account_a, Inbox A)
- `EAKfdR3Csk0zdT6H` — Order Parser — themetalman13 (account_b = themetalman13@gmail.com, the **eBay** inbox / Inbox B)
- `XY3vs7olrtnnlBDv` — Order Parser — Master Merge

Each is a schedule trigger + Code node running the self-authenticating script
`/files/order-parser/order_parser.js <mode> <acct>` (host path
`/root/n8n/local-files/order-parser/`). Config: `config.json` in that dir
(credential IDs, sheet IDs, account map).

## Gotchas
- Script must live on the persistent `/files` bind mount; only `/home/node/.n8n`
  and `/files` survive container recreate (bare `node account b` → MODULE_NOT_FOUND).
- After repeated run errors n8n **auto-deactivates** trigger workflows and does NOT
  re-enable after a fix — POST `/workflows/{id}/activate` (cause of the May 2026
  outage: bug fixed May 17 but workflows stayed off).
- `config.json` has a hardcoded `"today"` value stamped into the sheet "Last
  Updated" column — goes stale; verify/auto-set.
- `appendRows` now writes at an explicit computed row index (`readSheet` length+1,
  PUT `A{n}:I{n}`); the old `values:append` misplaced rows when blank rows existed.
  Keep sheets free of blank rows.
- `listMessages` scans only `in:inbox newer_than:2d` — gaps older than 2 days need
  a widened query for one-off backfills.
- `n8n execute --id` CLI fails while the server is up (port 5679 conflict); run via
  `docker exec` instead.
- Read-only access to account_b creds: `n8n export:credentials --all --decrypted`,
  refresh gmail_b `Yvzzuu9y1BQeII6o` / sheets_b `4kOviLlBVYEXPtmK`.
- themetalman13 Drive cred `4cxUhHDUa7KKbBm4` (OAuth client `...5`) works; complete
  consent at exactly `http://localhost:5678`.

## State (2026-05-21)
Drop logic patched: rows with a valid order number are KEPT even if item-name
validation fails (`itemNameRejectedKeptForOrder`). Backfilled eBay 49802/49804/49805.
**Open:** (1) eBay "Packing" item-name mis-extraction; (2) false-positive "Cancelled"
classification of marketing emails; (3) classify() misses "order is confirmed"
(49803). Calendar/Docs scopes deprioritized — Drive is enough.
Full handoff: `/root/reviews/session-2026-05-21-handoff.md`.
