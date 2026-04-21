---
type: system-skill
title: Notion Ingest
slug: notion-ingest
source_path: /root/.claude/skills/notion-ingest.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, notion]
---

## Purpose
Orchestrate ingestion of Notion pages into the wiki. Use this skill when the user points at a Notion URL and asks to absorb it into the vault.

## Contents

# Notion Ingest

## Role
You are the orchestrator for ingesting Notion pages into the wiki. When
the user points at a Notion page and asks to ingest it, you plan the
work, create spec + task files, and route to Grunt. You never fetch the
full Notion page yourself — Grunt does. Your job is planning, routing,
and review.

## When To Invoke
- User provides a Notion URL or page ID and says "ingest this", "add
  this to the wiki", "absorb this Notion page"
- User says "ingest my Notion page on <topic>" — in that case, use
  `notion-search` first to resolve to a page ID, confirm with the user,
  then proceed

## Scope (v1)
- Single Notion page per ingest. Databases are out of scope; if the user
  points at a database, stop and ask whether to ingest one specific row
  or defer until database-ingest is built.

## Workflow

### 1. Pre-flight (same as wiki-ingest-orchestrator)
Read in order:
- `/root/obsidian-vault/WIKI_SCHEMA.md`
- `/root/obsidian-vault/index.md`
- `/root/obsidian-vault/log.md` (last 20 entries)

Check the log for prior ingests of the same Notion page ID. If found,
stop and tell the user.

### 2. Resolve + Reconnaissance
- If the user gave a URL, extract the page ID (last UUID segment).
- Call `notion-fetch` yourself ONLY for reconnaissance: read the first
  ~2000 chars of the returned content to confirm title, type, and rough
  domain. Do not fetch child pages.
- If the page is > ~10k chars, note this — Grunt will handle, but flag
  large pages in the spec so the Mid reviewer knows.

### 3. Plan the Touch List
Same rules as wiki-ingest-orchestrator §3. Show the touch list to the
user and wait for confirmation before writing the spec.

### 4. Write the Spec
Create `/root/specs/ingest-notion-<slug>.md`. Use the standard ingest
spec template but add a `## Notion source` section:

```
## Notion source
- Page ID: <uuid>
- URL: <full notion.so URL>
- Title: <as fetched>
- Size: <rough char count>
- Fetched-for-recon at: <ISO timestamp>
```

### 5. Write the Grunt Task
Create `/root/tasks/ingest-notion-<slug>-grunt.txt`. Instruct Grunt to:

1. Call `notion-fetch` on the page ID (full fetch this time).
2. Write the raw fetch to
   `/root/obsidian-vault/raw/notion/<slug>-<YYYY-MM-DD>.md` with
   frontmatter:
   ```
   ---
   source: notion
   notion_page_id: <uuid>
   notion_url: <url>
   fetched_at: <ISO>
   title: <title>
   ---
   ```
3. Proceed through the standard wiki ingest pipeline (create
   `wiki/sources/<slug>.md`, update touched entity/concept/topic pages,
   update `index.md`, append to `log.md`).
4. Log entry format:
   ```
   ## [<date>] ingest | Notion — <title>
   - Source: raw/notion/<slug>-<date>.md (Notion page <uuid>)
   - Pages touched: <count>
   - Contradictions: <none | list>
   - Tier: grunt (Kimi K2.5) → mid-review pending
   ```

### 6. Write the Mid Review Task
Same as the standard ingest review flow. Inline the spec and the Grunt
.done file. Write output to
`/root/tasks/ingest-notion-<slug>.review`.

### 7. Hand Off to User
Output the sequence (Grunt → Mid → CC sign-off) matching the
wiki-ingest-orchestrator §7 pattern.

### 8. After Review
Same branches as wiki-ingest-orchestrator §8: ACCEPT, FIX_TASK_GRUNT,
FIX_TASK_LEAD, SCHEMA_ATTENTION.

## Rules
- Never fetch the full Notion page into CC context — Grunt handles that.
- Always log the Notion page ID in both the spec and the log entry so
  duplicate-ingest checks work on ID, not title.
- A Notion page can change between ingests. If the user asks to
  re-ingest a previously logged page, confirm this is intentional and
  record it as a refresh: `## [<date>] refresh | Notion — <title>`.
- Never edit the Notion page during ingest. Ingest is read-only from
  Notion's side.
