---
type: system-workflow
title: Google Tasks Notion n8n Sync Handoff
slug: google-tasks-notion-n8n-sync-handoff
created: 2026-04-27
last_updated: 2026-04-27
maintainer: codex
derived_from:
  - /root/n8n/local-files/google-tasks-notion-sync/README.md
  - /root/n8n/local-files/google-tasks-notion-sync/sync.js
  - /root/n8n/compose.yaml
tags: [ops, workflow, n8n, notion, google-tasks]
priority: reference
domain_tags: [oc-system, wiki-ops]
last_accessed: 2026-04-27
access_count: 1
---

# Google Tasks Notion n8n Sync Handoff

## Purpose

This page hands off the live two-way sync between Google Tasks and the Notion `Task Database`. The sync replaces the earlier Make.com automation and runs on the same VPS as OpenClaw and n8n.

## Current State

- Status: live and active in n8n.
- n8n workflow: `Google Tasks <-> Notion Tasks Hourly Sync`.
- n8n workflow ID: `8f438348-4668-44e1-8c59-5e8bf0d4101f`.
- Schedule: hourly.
- n8n version at setup: `2.17.7`.
- Docker image: `docker.n8n.io/n8nio/n8n:latest`.
- n8n is bound to `127.0.0.1:5678`.
- Health check: `curl -i http://127.0.0.1:5678/healthz`.

## Live Files

- Compose file: `/root/n8n/compose.yaml`
- Sync directory: `/root/n8n/local-files/google-tasks-notion-sync`
- Main script: `/root/n8n/local-files/google-tasks-notion-sync/sync.js`
- Private env file: `/root/n8n/local-files/google-tasks-notion-sync/.env`
- Importable workflow JSON: `/root/n8n/local-files/google-tasks-notion-sync/workflow-google-tasks-notion-hourly.json`
- Sync state: `/root/n8n/local-files/google-tasks-notion-sync/state.json`
- Sync log: `/root/n8n/local-files/google-tasks-notion-sync/sync.log`
- Pre-live backups: `/root/n8n/local-files/google-tasks-notion-sync/backups`

Do not paste or mirror `.env` contents into the wiki. It contains the Notion integration token and Google OAuth credentials. The Google Cloud API key is not used for private Google Tasks sync.

## Behavior

- Most recent update wins when both sides changed.
- Google completed tasks set Notion `Done=true` and archive the Notion page.
- Notion `Done=true` completes the matching Google task.
- Notion archived pages complete the matching Google task.
- Notion pages moved to trash delete the matching Google task.
- Subtasks are intentionally ignored for now.

## Notion Mapping

Database: `Task Database`

| Notion property | Use |
|---|---|
| `Task` | Google task title |
| `Description` | Google task notes |
| `Due Date` | Google task due date |
| `Done` | Google task completed status |
| `Completed At` | Completion timestamp written by sync |
| `Google Task ID` | Cross-system ID |
| `Last Sync Hash` | Last synced payload hash |

## Implementation Notes

The first workflow attempt used `n8n-nodes-base.executeCommand`, but this n8n build failed to activate that node type. The live workflow now uses a standard `n8n-nodes-base.code` node that calls:

```bash
node /files/google-tasks-notion-sync/sync.js
```

`/root/n8n/compose.yaml` includes:

```yaml
NODE_FUNCTION_ALLOW_BUILTIN: "child_process"
```

This permits the Code node to call the script while keeping the sync logic centralized in `sync.js`.

## First Live Run

Pre-live snapshots were taken at `20260427T090817Z`:

- Notion snapshot: 68 pages.
- Google Tasks snapshot: 174 tasks.

The first live run created 3 Notion pages, archived 36 Notion pages, and created 13 Google tasks. Follow-up convergence runs completed remaining state transitions. The final manual pass reported:

```json
{
  "dryRun": false,
  "googleTasks": 187,
  "notionPages": 26,
  "createdNotion": 0,
  "updatedNotion": 0,
  "archivedNotion": 0,
  "createdGoogle": 0,
  "updatedGoogle": 0,
  "deletedGoogle": 0
}
```

## Verification Commands

From `/root/n8n`:

```bash
docker compose ps
docker compose logs --tail=100 n8n
docker compose exec -T n8n node /files/google-tasks-notion-sync/sync.js
docker compose exec -T postgres psql -U n8n -d n8n -c "select id,name,active from workflow_entity where id='8f438348-4668-44e1-8c59-5e8bf0d4101f';"
```

From anywhere:

```bash
curl -i http://127.0.0.1:5678/healthz
tail -50 /root/n8n/local-files/google-tasks-notion-sync/sync.log
```

## Known Risks

- The pasted Notion and Google credentials should be rotated when practical.
- The sync is not transactional. If a run fails halfway through, inspect `sync.log`, `state.json`, and the pre-live backups before retrying repeatedly.
- Existing Notion pages that were already archived before state tracking may not be discoverable through normal database queries. Going forward, archived/deleted behavior is tracked through `state.json`.
- n8n logs a Python task runner warning because Python is absent in the container. The active sync uses JavaScript and does not need Python.

## Recovery Notes

If the workflow stops activating, first check for unsupported node types in `docker compose logs n8n`. The active workflow should use `n8n-nodes-base.code`, not `n8n-nodes-base.executeCommand`.

If the Google Tasks API returns `403 SERVICE_DISABLED`, enable Google Tasks API for the OAuth client project and retry after propagation. If Google returns `401`, refresh or regenerate OAuth credentials.
