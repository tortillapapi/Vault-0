---
title: Tattoo Ideas — Schema Reference
notion_id: 05993c26-1542-4e33-80f8-57621f9eb68d
notion_url: https://www.notion.so/05993c2615424e3380f857621f9eb68d
type: database-schema
last_synced: 2026-04-22
tags: [notion, database, schema, tattoo]
---

# Tattoo Ideas — Schema Reference

## Properties

| Property | Type | Options |
|----------|------|---------|
| Idea Name | title | — |
| Status | select | Dream, Researching, Ready to Book, Done |
| Priority | select | High, Medium, Low |
| Style | select | Blackwork, Traditional, Neo-Traditional, Fine Line, Watercolor, Japanese, Realism, Geometric, Illustrative, Dotwork |
| Body Placement | text | — |
| Description | text | — |
| Reference Images | file | — |
| Artist | relation | → [[tattoo-artists-db]] |
