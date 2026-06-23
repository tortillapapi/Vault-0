---
type: concept
title: Second-Brain Wiki
slug: second-brain-wiki
tags: [pkm, knowledge-management, llm]
priority: core
domain_tags: [tech, ai, productivity]
last_accessed: 2026-06-23
access_count: 0
---

## Definition

A personal knowledge system in which an LLM coding agent ingests arbitrary
sources (articles, transcripts, PDFs, bookmarks, notes), links them, and files
them into a living, queryable wiki. The thesis: knowledge compounds — the more
you feed it, the more valuable answering questions against it becomes, and you
"never start from a blank chat again." Popularized by [[andrej-karpathy]].

## Core Mechanics

- **`raw/`** — immutable dropbox for sources.
- **`wiki/`** — agent-owned, human-read pages (entities, concepts, topics, sources).
- **A runner doc** (`CLAUDE.md` / a schema) — the contract that tells the agent
  how to read, link, and file.
- **"ingest this"** — the one-step capture action.
- **Query across everything** — ask questions spanning all ingested material.

## How this vault implements it

This Obsidian vault is a more rigorous build of the same idea, predating the
post: typed pages with frontmatter, a `WIKI_SCHEMA.md` constitution, a `log.md`,
git versioning + Notion mirror, plus two ingest lanes —
[[wiki-ingest-orchestrator]] (full, reviewed) and [[wiki-fast-ingest]] (fast,
single-turn). The gap was never architecture; it was that the vault was built
but under-fed. The fast lane + the planned bookmarks feeder are the fix.

## Related

- [[andrej-karpathy]] · source: [[karpathy-second-brain-wiki]]
