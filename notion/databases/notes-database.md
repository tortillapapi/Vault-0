---
title: Notes Database — Schema Reference
notion_id: 2ed2508b-7644-83f7-96e3-0117ba12448c
notion_url: https://www.notion.so/2ed2508b764483f796e30117ba12448c
type: database-schema
last_synced: 2026-04-22
tags: [notion, database, schema, notes]
---

# Notes Database — Schema Reference

## Properties

| Property | Type | Options |
|----------|------|---------|
| Note | title | — |
| Note Type | select | Notes, Thoughts, Research, Resource |
| Date | date | — |
| Reviewed | checkbox | — |
| Files & media | file | — |
| Related to Projects Database | relation | → [[projects-database]] |
| Created time | created_time | — |
| Last edited time | last_edited_time | — |

## Views
- **All Notes** — Table sorted by Date desc
- **Unprocessed Notes** — List sorted by Date desc
- **Active Reads** — List filtered to Note Type = Resource
- **Reviewed Notes** — List filtered to Reviewed = false
