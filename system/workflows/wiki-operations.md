---
type: system-workflow
title: Wiki Operations
slug: wiki-operations
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
  - /root/.claude/skills/wiki-ingest-orchestrator.md
  - /root/.claude/skills/wiki-query-planner.md
  - /root/.claude/skills/wiki-lint.md
tags: [ops, workflow, wiki]
---

## Purpose

Use this page for the end-to-end operating loop around the wiki. It explains how ingest, query, and lint work together across CC and OC tiers.

## Two ingest lanes — pick by stakes/size

The vault has **two** ingest paths. Choose before starting:

- **Fast lane** ([[skills/wiki-fast-ingest|wiki-fast-ingest]]) — CC reads the
  source and writes the pages directly in one turn, no spec/grunt/mid. Use for
  single, low-stakes, small items: bookmarks, clips, threads, personal notes,
  ideas. This is the default for day-to-day capture and the engine for the
  bookmarks project.
- **Full loop** (below) — spec → grunt → mid review → accept. Use for large,
  canonical, batch, or multi-page-touching sources where rigor matters.

When unsure, fast-ingest and flag that it may warrant a fuller pass.

## Full Ingest Loop

1. CC reads `WIKI_SCHEMA.md`, `index.md`, and recent `log.md` entries.
2. CC plans the touch list and writes a spec and task prompt using [[skills/wiki-ingest-orchestrator|wiki-ingest-orchestrator]].
3. Grunt reads the raw source, creates or updates wiki pages, and writes a `.done` marker.
4. Mid reviews the output against the spec.
5. CC accepts the result or writes a follow-up fix task.

## Fast Ingest Loop

1. CC reads `WIKI_SCHEMA.md`, `core-index.md`, and the last ~15 `log.md` lines (dedupe).
2. CC lands the raw source immutably in `raw/clips/` or `raw/bookmarks/`.
3. CC reads it fully (it is small), writes `wiki/sources/<slug>.md` with Summary +
   Key Points + **Action Items**, and links it into existing/new topic/entity/concept pages.
4. CC appends a `fast-ingest` log entry, commits, and pushes the vault.
   No grunt, no mid — CC owns correctness and the user eyeballs the result.

## Query Loop

- Use [[skills/wiki-query-planner|wiki-query-planner]] when a user asks a substantive question against the wiki.
- CC translates the question into search, read, and synthesize steps.
- OC tiers do the actual reading or updates if a follow-up task is needed.

## Lint Loop

- Use [[skills/wiki-lint|wiki-lint]] for periodic health checks.
- Lint is for cross-cutting issues, not single-source ingest validation.
- Lint findings either become fix tasks or schema-attention tasks.

## Operating Discipline

- Do not read the full source in CC during ingest.
- Do not edit wiki pages directly from CC.
- Always check the log for duplicate ingests before planning new source work.
- Preserve append-only behavior in `log.md`.
