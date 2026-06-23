---
type: source
source_type: bookmark
title: Set up a RAG system for Claude Code (YouTube/voice-memo ingestion)
slug: tiktok-colton-ai-automation-setup
author: Colton Holland (@thecoltonholland)
date_published:
date_ingested: 2026-06-23
raw_path: raw/bookmarks/ai-folder-pilot-2026-06-23-transcripts.md
url: https://www.tiktok.com/@thecoltonholland/video/7621375636203932941
tags: [tiktok, ai, claude-code, rag, second-brain, telegram]
priority: core
ingest_mode: fast
domain_tags: [tech, ai]
last_accessed: 2026-06-23
access_count: 0
---

## Summary

Pitches setting up a **RAG (retrieval-augmented generation) system for
[[claude-code]]**: a database that stores lots of information — YouTube videos,
voice memos, photos — as chunked data the agent can retrieve against. Two payoffs
called out: (1) send the agent a YouTube link and it auto-pulls the full
transcript, chunks it, and stores it for analysis; (2) hook the agent to
**Telegram** and prompt it via **voice memo** instead of typing long prompts.

**Why this matters to us:** this is essentially a more automated version of the
[[second-brain-wiki]] we're building — and the Telegram voice-memo control is
literally how Metis already works. Strong corroboration for where this vault
could go next (auto-transcript ingestion + a retrieval layer).

## Key Points (from transcript)

1. RAG = chunked store of YT videos / voice memos / photos the agent retrieves from.
2. Send a YouTube link → auto-transcribe → chunk → store → agent can analyze it.
3. Telegram + voice-memo prompting = faster than typing big prompts.

## Action Items

- **Directly relevant:** we just built local transcript ingestion ([[wiki-fast-ingest]]
  + `tiktok-transcribe.py`). Next logical step is exactly this video's thesis —
  add **YouTube-link auto-transcript ingestion** to the lane, and consider a
  retrieval/RAG layer over the wiki (see [[tiktok-dylanworr-build-cool-tech-mindset]]
  for the embeddings angle).
- Already have: Telegram voice-memo control (Metis). This video validates it.

## Transcript

> If you don't have a RAG system set up for your Claude Code, you're missing out...
> store info from YouTube videos, voice memos, photos in chunks... send it a YouTube
> video and it pulls the full transcript, chunks it, stores it... or hook it to
> Telegram and talk to your Claude Code agent via voice memo. (Full verbatim in raw_path;
> Whisper rendered "Claude Code" as "cloud code".)

## Wiki Pages Updated

[[ai]], [[claude-code]], [[second-brain-wiki]]
