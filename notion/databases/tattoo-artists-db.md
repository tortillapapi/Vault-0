---
title: Tattoo Artists — Schema Reference
notion_id: e22c4c78-3c83-4b0f-be45-598e16e05dc7
notion_url: https://www.notion.so/e22c4c783c834b0fbe45598e16e05dc7
type: database-schema
last_synced: 2026-04-22
tags: [notion, database, schema, tattoo]
---

# Tattoo Artists — Schema Reference

## Properties

| Property | Type | Options |
|----------|------|---------|
| Artist Name | title | — |
| Style Specialties | multi_select | Blackwork, Traditional, Neo-Traditional, Fine Line, Watercolor, Japanese, Realism, Geometric, Illustrative, Dotwork |
| Rating | select | 1–5 stars |
| Instagram | url | — |
| Website | url | — |
| Studio | text | — |
| Location | text | — |
| Contact Info | text | — |
| Notes | text | — |
| Availability Notes | text | — |
| Tattoo Ideas | relation | → [[tattoo-ideas-db]] |
