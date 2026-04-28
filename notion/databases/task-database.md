---
title: Task Database — Schema Reference
notion_id: b6e2508b-7644-8241-8bf0-815aa2a485e1
notion_url: https://www.notion.so/b6e2508b764482418bf0815aa2a485e1
type: database-schema
last_synced: 2026-04-22
tags: [notion, database, schema, tasks]
---

# Task Database — Schema Reference

## Properties

| Property | Type | Notes |
|----------|------|-------|
| Task | title | — |
| Done | checkbox | — |
| Due Date | date | — |
| Completed At | date | — |
| Description | text | — |
| Google Task ID | text | For Google Tasks sync |
| Last Sync Hash | text | For sync dedup |
| Related to Projects Database | relation | → [[projects-database]] |
| Rollup - Project Status | rollup | Shows project status from related project |

## Views
- **Current** — Table of incomplete tasks, sorted by Due Date asc
- **All Tasks** — Table of everything, sorted by Due Date desc
- **Today's Pipeline** — List of incomplete tasks
- **Completed Tasks** — List of incomplete tasks (mislabeled — shows not-done)
