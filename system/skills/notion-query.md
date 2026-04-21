---
type: system-skill
title: Notion Query
slug: notion-query
source_path: /root/.claude/skills/notion-query.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, notion]
---

## Purpose
Query planner for answering questions from Notion content. Use this skill when the user asks substantive questions that require reading Notion pages.

## Contents

# Notion Query

## Role
You are the query planner for Notion content. When the user asks a
substantive question that needs information from their Notion
workspace, this skill tells you which tools to call, in what order,
and when to delegate long fetches to Grunt.

## When To Invoke
- User asks a question that plausibly requires reading Notion pages —
  e.g. "what did I write about <project> in Notion?", "check my Notion
  for <topic>", "summarize my <project> page"
- User asks about workspace structure — "what databases do I have?",
  "who's in my workspace?" (handled inline, no Grunt needed)

## Workflow

### 1. Triage
Before any tool call, decide which kind of query this is:
- **Workspace structure** (teams, users, databases) — use
  `notion-get-teams`, `notion-get-users`, or a scoped
  `notion-search`. Answer inline.
- **Content** (what does page X say, compare two pages, find the page
  about Y) — proceed to §2.

### 2. Search First
- Call `notion-search` with a concise query (single question, under 10
  words). Set `page_size` to 5–10; `max_highlight_length` to 0 unless
  you need snippet preview.
- Filter by `teamspace_id` if the question is scoped to a specific
  teamspace.
- If the user named a specific database, first fetch the database to
  get the `collection://` data-source URL, then re-search with
  `data_source_url` set.

### 3. Decide: Fetch Inline or Delegate
Count the candidate pages you'd need to fetch to answer:
- **1 page, < ~5k chars (based on search highlight or your estimate)** —
  fetch inline with `notion-fetch` and answer.
- **2–3 pages, each small** — fetch inline in parallel.
- **Any page > ~5k chars, OR > 3 pages total, OR nested children
  needed** — delegate to Grunt.

### 4. Delegate to Grunt (when triggered)
Write a small task file at `/root/tasks/notion-query-<slug>.txt`:

```
Execute this task now:

TIER: Grunt (Kimi K2.5)
TASK: notion-query-<slug>

OBJECTIVE:
Answer the following question by reading the listed Notion pages.

QUESTION:
<user's question, verbatim>

PAGES TO FETCH:
- <page_id_1>  (title: <title>)
- <page_id_2>  (title: <title>)
  ...

INSTRUCTIONS:
1. notion-fetch each page in order. Don't fetch child pages unless
   the question clearly requires it.
2. Extract only what answers the question. Ignore unrelated content.
3. Write a structured answer (under 500 words unless the question
   demands more) covering:
   - Direct answer
   - Supporting excerpts (quoted, with page title)
   - Anything relevant you noticed but isn't a direct answer

WHEN COMPLETE:
Write /root/tasks/notion-query-<slug>.done with:
STATUS: COMPLETE
TIMESTAMP: <ISO>
ANSWER: |
  <your structured answer>
SOURCES:
  - <page_id>: <title>
```

Then hand off to the user: "Paste this into OC (agent:grunt:main); I'll
read the .done and summarize."

### 5. Never Ingest Silently
If during a query you realize the content would be valuable in the
wiki, do NOT silently write it. Finish the query, then ask the user
whether to trigger `notion-ingest` on that page.

## Rules
- Never fetch more than 3 Notion pages directly in one CC turn —
  delegate to Grunt instead. CC context stays lean; Grunt has 256k ctx.
- Never call `notion-search` with broad unscoped queries like "stuff"
  or a single generic word. If the query is too broad, ask the user to
  narrow it before searching.
- Always cite the Notion page title (and ID, if the user might want to
  open it) in your answer. Don't paraphrase into thin air.
- If `notion-search` returns zero results, try one reformulation, then
  stop and tell the user. Don't iterate endlessly.
- Query is read-only. Never create, update, or comment on Notion pages
  inside this workflow — that's what `notion-ingest` and
  `notion-push` are for.
