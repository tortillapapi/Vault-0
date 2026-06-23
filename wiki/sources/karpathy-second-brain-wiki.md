---
type: source
source_type: clip
title: Karpathy's "Second Brain Wiki" idea
slug: karpathy-second-brain-wiki
author: Andrej Karpathy (via reposted summary)
date_published: 2026-06-23
date_ingested: 2026-06-23
raw_path: raw/clips/karpathy-second-brain-wiki.md
url:
tags: [pkm, llm, obsidian]
priority: reference
ingest_mode: fast
domain_tags: [tech, ai, productivity]
last_accessed: 2026-06-23
access_count: 0
---

## Summary

A widely-shared (~16M views) post from [[andrej-karpathy]] reframing what a
coding agent is for: not just writing code, but building a [[second-brain-wiki]].
You point Claude Code at a folder, drop in any source — article, transcript,
PDF — and it reads, links, and files it into a living wiki. The pitch is that
knowledge compounds: the more you feed it, the more valuable it gets, and you
"never start from a blank chat again."

The described setup is deliberately minimal: install Obsidian, create a vault,
open it in Claude Code; paste the wiki-idea file and have Claude build it; Claude
creates `raw/` (sources), `wiki/` (its pages), and a `CLAUDE.md` (the runner);
then drop sources into `raw/` and say "ingest this", and query across everything
forever. Claimed setup time: five minutes.

## Key Points

1. Use the agent for knowledge capture, not just code.
2. Three-part structure: `raw/` sources, `wiki/` agent pages, a `CLAUDE.md` runner.
3. "ingest this" is the one-step capture verb.
4. Value compounds with volume; cross-everything querying is the payoff.

## Action Items

- **Done:** Confirmed this vault already implements (a superset of) the idea, and
  built the **fast-ingest lane** ([[wiki-fast-ingest]]) so "ingest this" is one
  step here too. This page is the inaugural fast-ingest.
- **Next (user):** Start feeding it — TikTok bookmark folders are ready; hand them
  over to batch-ingest, mapping each existing folder to a topic page.
- **Later:** Build the bookmarks export automation (TikTok/X/Reddit → `raw/bookmarks/`)
  on top of this lane.

## Wiki Pages Updated

[[andrej-karpathy]], [[second-brain-wiki]], [[wiki-fast-ingest]]
