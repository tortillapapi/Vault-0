---
title: Projects Database — Schema Reference
notion_id: 5332508b-7644-8387-aa14-0148ab925f3c
notion_url: https://www.notion.so/5332508b76448387aa140148ab925f3c
type: database-schema
last_synced: 2026-04-22
tags: [notion, database, schema, projects]
---

# Projects Database — Schema Reference

## Properties

| Property | Type | Options |
|----------|------|---------|
| Project | title | — |
| Status | select | Not Started, WIP, Completed, On Hold, Archived |
| Priority | select | High, Medium, Low |
| Category | select | IT Infrastructure, Automation, RARE FORCE ONE, Operations, Personal, Kane Collab |
| Start Date | date | — |
| End Date | date | — |
| Project Folder | url | — |
| Related to Task Database | relation | → [[task-database]] |
| Related to Notes Database | relation | → [[notes-database]] |
| Created by | created_by | — |
| Created time | created_time | — |
| Last edited by | last_edited_by | — |
| Last edited time | last_edited_time | — |

## Views
- **All** — Table with all columns
- **Active Deployments** — Board grouped by Status (excludes RARE FORCE ONE category)
- **Arbitrage Tracking** — Gallery filtered to RARE FORCE ONE category
- **Archived Projects** — List of Completed + Archived, sorted by End Date desc
