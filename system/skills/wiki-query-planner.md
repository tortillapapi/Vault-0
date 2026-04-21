---
type: system-skill
title: Wiki Query Planner
slug: wiki-query-planner
source_path: /root/.claude/skills/wiki-query-planner.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, wiki]
---

## Purpose
Translate user questions into wiki search + read + synthesize plans. Use this skill to route queries to the appropriate tier based on complexity.

## Contents

# Wiki Query Planner

## Role
Translate user questions into search + read + synthesize plans that run
against the wiki. You orchestrate; OC tiers do the reading and writing.

## When To Invoke
- User asks a substantive question that should be answered from the wiki
  ("what do my notes say about X", "compare Y and Z", "summarize my
  current thinking on W")
- User asks for an artifact ("make me a comparison table", "draft a
  deck on X")

Simple factual lookups ("what's the file path to Y") do not need this
skill — just answer directly.

## Workflow

### 1. Classify the Query
Which pattern fits?

- **Lookup**: "what does the wiki say about X" — one or two pages, no
  synthesis needed
- **Comparison**: "X vs Y" — read two entity/concept pages + any
  existing comparison page
- **Synthesis**: "what's my current thinking on X" — topic page + recent
  sources that inform it
- **Gap-finding**: "what am I missing about X" — for lint-style questions
- **Artifact generation**: "make me a deck / table / chart about X"

### 2. Search Plan
Use `qmd query` when the wiki has >30 pages. For small wikis, grep index.md.

```bash
# Hybrid search (BM25 + vector + rerank)
qmd query "<natural language question>" --collection wiki --limit 10

# Fast keyword fallback
qmd search "<keywords>" --collection wiki --limit 20
```

Record the candidate pages. Usually 3-8 pages are relevant; if qmd returns
more than 15, tighten the query.

### 3. Decide Tier

- **Lookup**: CC reads the page(s) and answers inline. No OC task needed.
- **Comparison**: Route to Mid. GPT 5.3 is good at structured comparison.
- **Synthesis**: Route to Lead. GPT 5.4 does real thinking.
- **Gap-finding**: Route to Lead.
- **Artifact generation**: Route to Grunt for the bulk transformation,
  then Mid to review format.

### 4. Write the Query Task
For non-lookup queries, create `/root/tasks/query-<slug>.txt`:

```
Execute this task now:

TIER: <Mid | Lead | Grunt>
TASK: query-<slug>

OBJECTIVE:
<clear, one-sentence question>

PAGES TO READ:
<qmd results, full paths>

OUTPUT:
<one of:>
- Inline answer in the .done file (for quick questions)
- New wiki page at wiki/comparisons/<slug>.md (for durable artifacts)
- Slide deck at wiki/decks/<slug>.md in Marp format (for presentations)

SCHEMA CONTRACT (if writing a wiki page):
<inline relevant sections of WIKI_SCHEMA.md>

CITATION REQUIREMENT:
Every non-obvious claim must cite the wiki page it came from using
[[wikilink]] syntax. If a claim is not supported by any page in the
read list, mark it with [UNSOURCED] rather than making it up.

WHEN COMPLETE:
Create /root/tasks/query-<slug>.done with:
STATUS: COMPLETE | PARTIAL
OUTPUT_LOCATION: <inline | path to created file>
UNSOURCED_CLAIMS: <list or "none">
SUGGESTED_FOLLOWUP_INGESTS: <sources you'd want but don't have, or "none">
```

### 5. Decide Whether To File the Answer
After OC returns the answer, ask the user:

> "Should I file this as a persistent wiki page at
> `wiki/<type>/<slug>.md`, or leave it in the .done file?"

Answers worth filing:
- Comparisons the user will reference again
- Syntheses that represent current thinking
- Discoveries ("I noticed X connects to Y")

Answers not worth filing:
- One-off lookups
- Queries that will be obsolete in a week

If filed, append to `log.md` and `index.md` as a `query-result` entry.

## Rules

- Always search before reading. Don't assume you know which pages are
  relevant.
- Always run through qmd or index.md. Don't route OC to "read the whole
  wiki" — that wastes tokens and produces worse answers than a focused
  read.
- Unsourced claims must be marked, not hidden. This is how the wiki
  stays trustworthy.
- Filing a query result is opt-in, not automatic. The user decides what
  compounds into the wiki.
