---
title: Wiki Schema
type: schema
version: 0.3
created: 2026-04-19
last_updated: 2026-04-22
---

# WIKI_SCHEMA.md

This is the constitution for the wiki. Every LLM that reads, writes, or
reviews wiki pages reads this file first. You and the LLM co-evolve this
document over time as patterns emerge.

## Vault Layout

```
obsidian-vault/
├── WIKI_SCHEMA.md          ← this file
├── core-index.md           ← always-load manifest (≤40 lines)
├── index.md                ← content catalog
├── log.md                  ← chronological record
├── raw/                    ← IMMUTABLE sources
│   ├── clips/              ← web clips
│   ├── notion-export/      ← one-time Notion migration
│   ├── podcasts/           ← transcripts
│   ├── papers/             ← PDFs (may be referenced by path only)
│   └── assets/             ← images downloaded from clips
└── wiki/                   ← LLM-owned, human-read-only
    ├── entities/           ← people, companies, products, places
    ├── concepts/           ← ideas, frameworks, theories
    ├── topics/             ← rolling syntheses on a subject
    ├── sources/            ← one page per ingested source
    └── comparisons/        ← analysis artifacts from queries
```

**Hard rule**: Nothing in `raw/` is ever modified, only read. Everything
in `wiki/` is owned by the LLM tiers. Humans read it; they don't hand-edit
it. (Adjust this rule if you want — but pick a rule and hold the line.)

## Page Types and Required Frontmatter

### Entity pages (`wiki/entities/<slug>.md`)

```yaml
---
type: entity
subtype: person | company | product | place | other
title: Human Readable Name
slug: kebab-case-slug
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
sources:
  - source-slug-1
tags: []
aliases: []        # other names this entity goes by
priority: core | reference | archive   # required
domain_tags: []    # controlled vocabulary — see tag taxonomy below
last_accessed: YYYY-MM-DD   # updated by CC when page is read
access_count: 0    # incremented by CC when page is read
---
```

Required sections:
- `## Overview` — 1-3 paragraphs
- `## Key Facts` — bullet list
- `## Related` — wikilinks to related entities/concepts
- `## Sources` — wikilinks to source pages

Optional sections:
- `## Timeline` (for entities with significant history)
- `## Contradictions Noted` (auto-created when Grunt flags conflicts)

### Concept pages (`wiki/concepts/<slug>.md`)

```yaml
---
type: concept
title: Concept Name
slug: kebab-case-slug
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
sources:
  - source-slug-1
tags: []
priority: core | reference | archive   # required
domain_tags: []    # controlled vocabulary — see tag taxonomy below
last_accessed: YYYY-MM-DD   # updated by CC when page is read
access_count: 0    # incremented by CC when page is read
---
```

Required sections:
- `## Definition` — 1 paragraph
- `## Context` — where this concept matters
- `## Examples` — concrete instances
- `## Related` — wikilinks
- `## Sources`

### Topic pages (`wiki/topics/<slug>.md`)

Topic pages hold rolling syntheses — your "current thinking" on a subject.
They are the most expensive to maintain and the most valuable.

```yaml
---
type: topic
title: Topic Title
slug: kebab-case-slug
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
sources: []          # grows over time
tags: []
thesis_version: 1    # increments on major rewrites
priority: core | reference | archive   # required
domain_tags: []    # controlled vocabulary — see tag taxonomy below
last_accessed: YYYY-MM-DD   # updated by CC when page is read
access_count: 0    # incremented by CC when page is read
---
```

Required sections:
- `## Current Thesis` — your best current synthesis, 3-8 paragraphs
- `## Supporting Evidence` — bullets with wikilinks to entities/concepts/sources
- `## Open Questions` — things the wiki doesn't yet answer
- `## Contradictions` — unresolved tensions in the source material
- `## History` — short log of major thesis revisions (append-only)
- `## Sources`

### Source pages (`wiki/sources/<slug>.md`)

One per ingested source. Created by Grunt during the full ingest loop, or by CC
directly during fast ingest (see [[wiki-fast-ingest]]).

```yaml
---
type: source
source_type: article | paper | podcast | book-chapter | clip | notion-page | bookmark
title: Source Title
slug: kebab-case-slug
author: 
date_published: YYYY-MM-DD   # when the source was created, not ingested
date_ingested: YYYY-MM-DD
raw_path: raw/<subpath>/<filename>
url:                          # if applicable
tags: []
priority: core | reference | archive   # required
ingest_mode: full | fast      # 'fast' = CC single-turn capture (no review tier)
domain_tags: []    # controlled vocabulary — see tag taxonomy below
last_accessed: YYYY-MM-DD   # updated by CC when page is read
access_count: 0    # incremented by CC when page is read
---
```

Required sections:
- `## Summary` — 2-4 paragraph neutral summary (1-3 short paragraphs for fast ingest)
- `## Key Claims` — numbered list of the main claims, each with a brief note
  (a fast-ingest `bookmark` may title this `## Key Points` instead)
- `## Action Items` — concrete next steps the source implies for the user, or
  `None` if it is pure reference. Required for `source_type: bookmark`; optional
  but encouraged for fast captures. This is the actionable layer that keeps a
  saved item from being filed-and-forgotten.
- `## Contradictions Noted` — claims that conflict with existing wiki pages
  (omit-able for fast captures where there is nothing to contradict)
- `## Wiki Pages Updated` — wikilinks to pages this ingest modified

### Comparison pages (`wiki/comparisons/<slug>.md`)

```yaml
---
type: comparison
title: X vs Y
slug: kebab-case-slug
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
compares:
  - entity-slug-1
  - entity-slug-2
sources: []
tags: []
priority: core | reference | archive   # required
domain_tags: []    # controlled vocabulary — see tag taxonomy below
last_accessed: YYYY-MM-DD   # updated by CC when page is read
access_count: 0    # incremented by CC when page is read
---
```

Required sections:
- `## Comparison Table` — structured side-by-side
- `## Analysis` — 2-4 paragraphs of synthesis
- `## Sources`

## Tag Taxonomy

Controlled vocabulary for `domain_tags`:

- `pipeline` — Gmail ingest, parsers, ingest job, tiered parse flow
- `parser` — email-parser agent, GLM, mid review, confidence, noise filter
- `dashboard` — Flask app, review queue, seed UI, port 5001
- `billing` — API costs, Vertex AI, GCP credits, AI Studio
- `wiki-ops` — vault schema, index, log, grunt/mid/lead workflows
- `oc-system` — OpenClaw config, agents, auth profiles, systemd services
- `obsidian` — vault sync, git push, Obsidian Git plugin
- `decisions` — architectural choices and their rationale

## Session Loading Protocol

CC loads pages in this order at session start:
1. Always: `core-index.md` (≤ 40 lines, all priority:core pointers)
2. On demand: full `index.md` when doing a broad query or ingest planning
3. By domain: when working on X, load pages where domain_tags contains X
4. By priority: never proactively load priority:archive pages — only on explicit request

CC updates `last_accessed` and increments `access_count` in frontmatter
whenever it reads a page during a session. Grunt updates these fields in
batch during wiki maintenance passes.

Core-index is the authoritative always-load manifest. When a page is promoted
to priority:core, add it to core-index. When demoted, remove it.

## System Tree (v0.2)

`vault/system/` holds internal ops knowledge: the operating manual for CC
and OC. It is a readable mirror + synthesis of files under `/root/`. It is
not part of the external-knowledge wiki tree (`vault/wiki/`) and uses its
own frontmatter schema (see `system/README.md`).

Hard rules for `system/`:
- Mirrored pages MUST record `source_path` and `last_synced`.
- Upstream-change detection is by comparing `last_synced` to the source file's mtime.
- Never hand-edit mirrored pages. Re-sync via a fresh task.
- Synthesized pages (decision logs, workflows) record `derived_from:`.

## Wikilink Conventions

- Format: `[[kebab-case-slug]]` — no spaces, no capitals, no extension
- Link on first mention within a page
- Don't link the same target more than twice per page
- If you reference an entity or concept that doesn't have a page yet,
  either create a stub or note it in the ingest's .done file for a
  followup task
- Stubs are valid but must include frontmatter + a `## TODO` section
  explaining what's missing

## index.md Structure

```markdown
# Wiki Index

## Entities
- [[slug]] — one-line description (<N> sources)

## Concepts
- [[slug]] — one-line description

## Topics
- [[slug]] — current thesis in one sentence

## Sources
<chronological, most recent first>
- [[source-slug]] — date — title

## Comparisons
- [[slug]] — X vs Y
```

## log.md Structure

Append-only. Every entry starts with `## [YYYY-MM-DD] <event_type> | <subject>`
for grep-friendliness.

Event types:
- `ingest` — a new source was processed
- `query` — a question was answered
- `lint` — a health check ran
- `fix` — a fix task was executed
- `schema` — the schema itself was modified
- `review` — a reviewer produced findings

Example:
```
## [2026-04-19] ingest | Karpathy — LLM Wiki
- Source: raw/clips/karpathy-llm-wiki.md
- Pages touched: 8
- Contradictions: none
- Tier: grunt → mid-review → accepted
```

## Contradiction Handling Rules

Pages never contain resolved contradictions silently. If two sources
disagree, both claims must appear with attribution. Resolution is a
separate, explicit act by Lead tier or human.

## Schema Evolution

This schema will change. When it does:

1. Append a schema change note to `log.md`
2. Bump the `version` field in this file's frontmatter
3. Decide: does existing content need migration, or does the new rule
   apply to new pages only?
4. If migration is needed, create an explicit migration task — never
   rely on incidental fixes during unrelated ingests

## Anti-patterns

- Pages without frontmatter
- Wikilinks with spaces, capitals, or extensions
- Topic pages that just list facts without a thesis
- Source pages that duplicate the full source (they should summarize)
- Entity pages with no cross-references (orphans-by-design)
- Deleting contradictions instead of documenting them
- Editing pages in `raw/`
