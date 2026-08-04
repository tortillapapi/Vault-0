---
type: workflow
title: Notion Sync Protocol
slug: notion-sync-protocol
created: 2026-08-04
last_updated: 2026-08-04
owner: cc
tags: [workflow, notion, sync, para, dashboard]
---

# Notion Sync Protocol

How VPS state reaches Notion, and how Notion capture reaches the vault.

## Why this exists

The Notion workspace was hand-fed and went dormant on 2026-04-29 — three months
of drift while all real work happened on the VPS. Structure was never the
problem; **supply** was. This pipeline is the supply line. If it stops, the
workspace rots again, and `Last Activity` on the Projects database is the
tell-tale.

## Direction of authority

| Data | Source of truth | Direction |
|---|---|---|
| Projects, Specs, Systems, Vault docs | VPS files + systemd | VPS → Notion |
| Inbox notes captured in Notion | Notion | Notion → vault (`system/projects/inbox.md`) |
| Tasks | Google Tasks ↔ Notion | bidirectional, most-recent-edit wins |
| Personal PARA content (Areas, Resources, hand-made projects) | Notion | never touched by sync |

## Invariants

1. **Upsert only — the sync never deletes a Notion row.** Items that disappear
   from the VPS are marked `⚪ Idle` / `⚪ Inactive`, not removed.
2. **`Sync Source = Manual` is untouchable.** Set it on any row you want to
   hand-own and the sync will skip it forever.
3. **Only changed properties are PATCHed**, so a second consecutive run reports
   `unchanged` across the board and creates nothing.
4. **Every vault write ends with `git pull --rebase && add && commit && push`.**
   Never force-push (`/root/CLAUDE.md` rule 3).
5. **Rows are matched on `Sync Key`**, never on title. Renaming a project in
   Notion does not fork it; renaming its vault `slug:` does.

## Sync keys

```
vps:project:<slug>          from system/projects/<doc>.md frontmatter slug
vps:spec:<spec-file-stem>   from /root/specs/*.md
vps:timer:<unit>.timer      from systemctl list-timers
vps:agent:<agent-id>        from openclaw agents list
vps:doc:<tree>/<relpath>    from system/, wiki/, /root/context
```

## The `next_action:` field

`▶ CONTINUE` on the START SCREEN is driven by `next_action:` in each project
doc's frontmatter. It cannot be scraped from prose reliably — project docs have
no consistent "next step" heading — so it is authored, one line, in frontmatter:

```yaml
next_action: "Run the first full live TCG price refresh and confirm the 42 never-priced sealed items get values"
```

Leave it `""` when a project genuinely has no queued move. The CONTINUE view
filters to `Next Action is not empty AND Health is not ⚪ Idle`, so parked work
can record a next step without cluttering the daily view.

`sync.py` prints every project missing a `next_action` on each run.

## Status normalization

Spec frontmatter `status:` is free text with 30+ observed variants. It is
normalized by longest-prefix match into seven buckets (`Active`, `Ready`,
`Proposed`, `Blocked`, `Parked`, `Complete`, `Superseded`) and the verbatim
value is preserved in `Raw Status`. Closed history (`Complete`/`Superseded`,
81 specs as of 2026-08-04) is skipped on the routine cycle; `--all-specs`
backfills it.

## Running it

```bash
export PYTHONPATH=/root/scripts
python3 -m notion_sync.sync --check          # verify token + per-database reachability
python3 -m notion_sync.sync --dry-run        # collect + diff, write nothing
python3 -m notion_sync.sync                  # push + capture
python3 -m notion_sync.sync --push-only
python3 -m notion_sync.sync --pull-only
python3 -m notion_sync.sync --all-specs      # one-off closed-spec backfill
python3 -m notion_sync.sync --gtasks         # add the Google Tasks lane
```

Scheduled by `notion-sync.timer`, every 30 min from 06:00–21:30 **Pacific**.
The system clock is `Etc/UTC`, so the unit states the zone explicitly — without
it the schedule inverts to 23:00–14:30 PT.

## Credentials

| Secret | Path | Needed for |
|---|---|---|
| Notion connection token | `/root/secrets/notion/token` (mode 0600) | everything |
| Google OAuth (order-parser store) | `/root/secrets/order-parser/credentials.json` | `--gtasks` only |

The Google side needs **no setup** — the live order-parser credential
`191ZRFwvzMdQy4ep` already carries `https://www.googleapis.com/auth/tasks`
alongside gmail/drive/sheets/calendar/documents. `gtasks.py` picks the first
credential in that store with the tasks scope and a refresh token, refreshes the
access token **in memory**, and never writes back — n8n owns that file.

> **Do not use `/root/secrets/gmail-oauth/`.** It was copied from the
> decommissioned inventory-tracker on 2026-04-27, its token expired that same
> day, and its OAuth client has since been deleted from Google Cloud —
> authorizing it returns `401 deleted_client`. Nothing live references it.

The Notion token is an **internal connection** token (Notion renamed
"integrations" to "connections"; `notion.so/my-integrations` now redirects to a
Connections settings page):

1. <https://app.notion.com/developers/connections> → sidebar **Build** →
   **Internal connections** → **Create a new connection**
2. **Configuration** tab → copy the **Installation access token** (`ntn_…`)
3. **Content access** tab → **Edit access** → add the Master Page — or in Notion,
   page `•••` → **Connections** → **+ Add connection**

Step 3 is not optional: a new connection has **no page access by default** and
every API request fails until it is granted. Access cascades to child pages, so
granting the Master Page covers the whole tree.

The MCP connector Claude Code uses interactively is session-bound and cannot be
used by a timer — hence the separate token.

## Conflict rule (Google Tasks)

`Last Sync Hash` stores a digest of the agreed state after the previous run.
If only one side's hash moved, that side wins. If both moved, the most recently
edited side wins and **the loser's title is appended to `Description`** rather
than discarded.

**Completed history is not imported.** As of 2026-08-04 the `@default` list held
208 tasks — 6 open, 202 completed — and a second "Work Tasks" list that is 100%
completed. Creating Notion rows for all of them would bury the live board, so a
Google task that is already completed and has no Notion row is skipped. Tasks
Notion *does* track still sync their completion state both ways.

## Failure modes to watch

- **`Last Activity` older than 24h on an active project** → the sync is broken
  or the timer is off. This is the canary for the whole system.
- **429s from Notion** — the client backs off exponentially and honours
  `Retry-After`. `query_data_sources` is rate-limited on this plan, but the sync
  uses the REST API, not the MCP query path.
- **Duplicate rows** — means `Sync Key` was cleared on a row. Restore the key or
  delete the duplicate by hand; the sync will not do it for you.
